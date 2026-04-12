# WorkHub V1 → SetupHub UI Migration Plan (v4 — Final)

> **Grundregel:** UI wird ersetzt – Datenfluss bleibt gleich.
> Alles was Daten verarbeitet → bleibt. Alles was angezeigt wird → wird ersetzt.

> **Oberste Architekturregel:**
> Wenn eine Komponente einen Feature-Type importiert → gehört sie ins Feature, nicht in `ui/`.

> **Pragmatismus-Regel:**
> Struktur nur dort nutzen, wo sie echten Nutzen bringt.
> Nicht für jedes Mini-Problem eine neue Ebene. Zwei Dateien statt fünf, wenn zwei reichen.

---

## Zielarchitektur

```
src/
│
├── app/                        // Routing + App Shell
│   ├── App.tsx
│   ├── Router.tsx
│   └── providers/
│
├── pages/                      // 🔗 Klebeschicht (Hook + View)
│   ├── StartseitePage.tsx
│   ├── DashboardPage.tsx
│   ├── OrdersPage.tsx
│   ├── LagerPage.tsx
│   ├── ScannerPage.tsx
│   └── PruefprotokollePage.tsx
│
├── features/                   // Fachlogik → BEHALTEN + erweitern
│   ├── orders/
│   │   ├── hooks/              // useOrders() → { state, actions }
│   │   ├── model/              // Order, ExtractedField, SelectionRect
│   │   ├── selectors/          // ⚡ NUR wenn Filter/Sort/Gruppierung komplex
│   │   ├── adapters/           // mapOrderToCard(), mapOrderToTableRow(), etc.
│   │   ├── types/              // ⚡ NUR wenn Props von mehreren Dateien geteilt
│   │   ├── views/              // OrdersView.tsx (reine Darstellung)
│   │   └── components/         // OrderCard, OrderFilterBar, OrderActionRow
│   ├── scanner/
│   │   ├── hooks/  ├── model/  ├── adapters/  ├── views/  └── components/
│   ├── lager/
│   │   ├── hooks/  ├── model/  ├── adapters/  ├── views/  └── components/
│   ├── dashboard/
│   │   ├── hooks/  ├── adapters/  ├── views/  └── components/
│   ├── pruefprotokolle/
│   │   ├── hooks/  ├── adapters/  ├── views/  └── components/
│   └── theme/
│       └── hooks/              // useTheme()
│
├── shared/
│   ├── api/                    // API Calls → BEHALTEN
│   ├── model/                  // Globale Types → BEHALTEN
│   ├── lib/                    // uid(), safeEval(), etc. → BEHALTEN
│   └── store/                  // Zustand Stores → BEHALTEN
│
└── ui/                         // 🔥 NEU aus SetupHub — NUR GENERISCH
    ├── tokens/                 // Design Tokens (3-Ebenen-System)
    ├── components/             // Button, Card, Badge, Input, Modal, Tabs, etc.
    ├── patterns/               // Card+Aktionen, Liste+Suche, Formularbereich
    └── layout/                 // PageLayout, Topbar, Sidebar, TabBar
```

### Minimale Feature-Struktur (Pflicht)

Jedes Feature hat MINDESTENS:
```
features/xyz/
├── hooks/          // Logik
├── adapters/       // Daten → UI Mapping
├── views/          // Darstellung
└── components/     // Fachliche UI-Bausteine (wenn nötig)
```

### Optionale Erweiterungen (nur bei Bedarf)

```
features/xyz/
├── selectors/      // ⚡ Erst anlegen wenn Filter/Sort/Gruppierung > Einzeiler
├── types/          // ⚡ Erst anlegen wenn Props von >1 Datei importiert werden
└── model/          // Nur wenn eigene Types existieren (nicht bei reinen Views)
```

### Komponentengrenze (strikt einhalten!)

```
ui/components/           = GENERISCH (kennt kein Feature)
├── Button, Card, Badge, Input, Toggle, Tabs, Modal/Sheet
├── SearchField, SectionHeader, EmptyState, LoadingState
├── ErrorState, Skeleton, ListItem, Divider, Avatar, IconButton

features/.../components/ = FACHLICH (kennt das Feature)
├── OrderCard, OrderFilterBar, ScannerToolbar
├── LagerListenblock, KartonRow, StatCard, KPIWidget
```

---

## Die Schlüsselkonzepte

### 1. Hook = Logik-Container

Jeder Hook gibt `{ state, actions }` zurück. Kein loses Prop-Gemisch.

```tsx
// features/orders/hooks/useOrders.ts

export function useOrders() {
  const [orders, setOrders] = useState<Order[]>([])
  const [filter, setFilter] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setIsLoading(true)
    fetchOrders()
      .then(setOrders)
      .catch(e => setError(e.message))
      .finally(() => setIsLoading(false))
  }, [])

  const deleteOrder = (id: string) => { /* ... */ }
  const importOrders = async (file: File) => { /* ... */ }

  // Einfache Ableitung → direkt im Hook (kein Selector nötig)
  const filtered = orders.filter(o =>
    o.artikel.toLowerCase().includes(filter.toLowerCase()) ||
    o.kunde.toLowerCase().includes(filter.toLowerCase())
  )

  return {
    state: { orders: filtered, filter, isLoading, error },
    actions: { setFilter, deleteOrder, importOrders },
  }
}
```

### 2. Selectors = Reine Ableitungen (NUR bei Bedarf)

Reine Funktionen ohne Seiteneffekte. Halten den Hook schlank.

```tsx
// features/orders/selectors/order.selectors.ts

export function selectFilteredOrders(orders: Order[], filter: string): Order[] {
  if (!filter.trim()) return orders
  const q = filter.toLowerCase()
  return orders.filter(o =>
    o.artikel.toLowerCase().includes(q) ||
    o.kunde.toLowerCase().includes(q)
  )
}

export function selectOrdersByStatus(orders: Order[], status: string): Order[] {
  return orders.filter(o => o.status === status)
}

export function selectOrderStats(orders: Order[]) {
  return {
    total: orders.length,
    offen: orders.filter(o => o.status === 'neu').length,
    inArbeit: orders.filter(o => o.status === 'aktiv').length,
    fertig: orders.filter(o => o.status === 'abgeschlossen').length,
  }
}
```

**Wann Selectors anlegen:**

| Situation | Selector? |
|-----------|-----------|
| Filter mit mehreren Feldern + Logik | ✅ Ja |
| Sortierung mit wechselnden Kriterien | ✅ Ja |
| Gruppierung (z.B. Orders nach Status) | ✅ Ja |
| Statistiken/Aggregationen | ✅ Ja |
| Abgeleitete Statuswerte | ✅ Ja |
| Trivialer Einzeiler, nur einmal verwendet | ❌ Nein, direkt im Hook |
| `.filter(x => x.active)` | ❌ Nein |

### 3. Adapter = Daten → UI Brücke (konsequent für JEDE Darstellungsform)

Für jede UI-Variante eine eigene Mapping-Funktion.
Immer echte ID mitgeben. Die UI kennt KEINE Feature-Types.

```tsx
// features/orders/adapters/order.adapter.ts

import type { Order } from '../model/types'

// Wenn nur 1 View diesen Typ nutzt → Typ bleibt hier
// Wenn mehrere Dateien ihn brauchen → nach types/ui.types.ts verschieben

export interface OrderCardProps {
  id: string
  title: string
  subtitle: string
  status: 'offen' | 'in-arbeit' | 'fertig'
  badge?: string
  importBadge?: boolean
}

export interface OrderTableRowProps {
  id: string
  artikel: string
  kunde: string
  status: string
  menge: number
  datum: string
}

export interface OrderDetailPanelProps {
  id: string
  title: string
  kunde: string
  status: 'offen' | 'in-arbeit' | 'fertig'
  felder: { label: string; value: string }[]
}

export interface OrderStatusBadgeProps {
  status: 'offen' | 'in-arbeit' | 'fertig'
  label: string
  variant: 'info' | 'warning' | 'success'
}

// --- Mapping-Funktionen ---

export function mapOrderToCard(order: Order): OrderCardProps {
  return {
    id: order.id,
    title: order.artikel,
    subtitle: order.kunde,
    status: mapStatus(order.status),
    badge: order.priority ? 'Eilig' : undefined,
    importBadge: order.hasImportedFiles,
  }
}

export function mapOrderToTableRow(order: Order): OrderTableRowProps {
  return {
    id: order.id,
    artikel: order.artikel,
    kunde: order.kunde,
    status: order.status,
    menge: order.menge,
    datum: new Date(order.createdAt).toLocaleDateString('de-DE'),
  }
}

export function mapOrderToDetailPanel(order: Order): OrderDetailPanelProps {
  return {
    id: order.id,
    title: order.artikel,
    kunde: order.kunde,
    status: mapStatus(order.status),
    felder: [
      { label: 'Werkstattauftrag', value: order.werkstattauftrag },
      { label: 'Sägemaß', value: `${order.saegeMass} mm` },
      { label: 'Material', value: order.material },
      { label: 'Menge', value: String(order.menge) },
    ],
  }
}

export function mapOrderToStatusBadge(order: Order): OrderStatusBadgeProps {
  const status = mapStatus(order.status)
  const variantMap: Record<string, OrderStatusBadgeProps['variant']> = {
    'offen': 'info', 'in-arbeit': 'warning', 'fertig': 'success',
  }
  return {
    status,
    label: status.charAt(0).toUpperCase() + status.slice(1),
    variant: variantMap[status] ?? 'info',
  }
}

function mapStatus(raw: string): OrderCardProps['status'] {
  const map: Record<string, OrderCardProps['status']> = {
    'neu': 'offen', 'aktiv': 'in-arbeit', 'abgeschlossen': 'fertig',
  }
  return map[raw] ?? 'offen'
}
```

### 4. View = Reine Darstellung (lebt im Feature)

Kein API, kein State-Management, kein useEffect.

```tsx
// features/orders/views/OrdersView.tsx

import { PageLayout } from '../../../ui/layout/PageLayout'
import { SearchField } from '../../../ui/components/SearchField'
import { EmptyState } from '../../../ui/components/EmptyState'
import { LoadingState } from '../../../ui/components/LoadingState'
import { ErrorState } from '../../../ui/components/ErrorState'
import { OrderCard } from '../components/OrderCard'
import type { OrderCardProps } from '../adapters/order.adapter'

interface OrdersViewProps {
  orders: OrderCardProps[]
  filter: string
  isLoading: boolean
  error: string | null
  onFilterChange: (value: string) => void
  onDelete: (id: string) => void
}

export function OrdersView({
  orders, filter, isLoading, error, onFilterChange, onDelete
}: OrdersViewProps) {
  if (isLoading) return <LoadingState text="Aufträge laden..." />
  if (error) return <ErrorState message={error} />

  return (
    <PageLayout title="Aufträge">
      <SearchField value={filter} onChange={onFilterChange} placeholder="Suchen..." />
      {orders.length === 0 ? (
        <EmptyState message="Keine Aufträge gefunden" />
      ) : (
        orders.map(order => (
          <OrderCard key={order.id} {...order} onDelete={() => onDelete(order.id)} />
        ))
      )}
    </PageLayout>
  )
}
```

---

## Die Page = Klebeschicht

**Ziel:** Keine Fachlogik, keine UI-Details, keine Sonderlogik.
Wenn das eingehalten ist, sind 10 oder 18 Zeilen beide okay.

```tsx
// pages/OrdersPage.tsx

import { useOrders } from '../features/orders/hooks/useOrders'
import { mapOrderToCard } from '../features/orders/adapters/order.adapter'
import { OrdersView } from '../features/orders/views/OrdersView'

export function OrdersPage() {
  const { state, actions } = useOrders()
  const cardData = state.orders.map(mapOrderToCard)

  return (
    <OrdersView
      orders={cardData}
      filter={state.filter}
      isLoading={state.isLoading}
      error={state.error}
      onFilterChange={actions.setFilter}
      onDelete={actions.deleteOrder}
    />
  )
}
```

---

## Theme-System: 3-Ebenen mit Partial-Overrides

Themes bauen sauber aufeinander auf.
Overrides enthalten NUR die Änderungen — nicht das gesamte Objekt.

```
Ebene 1: baseTokens            ← neutrales SetupHub-System (komplett)
Ebene 2: workhubDefaultTokens  ← WorkHub-Standard (komplett, überschreibt base)
Ebene 3: themeOverrides         ← NUR Änderungen (Partial, wird gemergt)
```

### Implementierung:

```tsx
// ui/tokens/base.tokens.ts — Ebene 1 (komplett)
export const baseTokens = {
  colors: {
    background: '#1a1a2e',
    surface: '#16213e',
    accent: '#0f3460',
    text: '#e4e4e4',
    textMuted: '#8a8f98',
    error: '#e74c3c',
    success: '#2ecc71',
    warning: '#f39c12',
  },
  typography: {
    fontFamily: "'DM Sans', sans-serif",
    fontMono: "'JetBrains Mono', monospace",
  },
  spacing: {
    touchTarget: '48px',
    xs: '4px', sm: '8px', md: '16px', lg: '24px', xl: '32px',
  },
  radius: { sm: '6px', md: '12px', lg: '16px' },
}

export type ThemeTokens = typeof baseTokens
export type DeepPartial<T> = { [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K] }
export type ThemeOverride = DeepPartial<ThemeTokens> & { effects?: Record<string, unknown> }
```

```tsx
// ui/tokens/workhub-default.tokens.ts — Ebene 2 (komplett)
import { baseTokens, type ThemeTokens } from './base.tokens'

export const workhubDefaultTokens: ThemeTokens = {
  ...baseTokens,
  colors: {
    ...baseTokens.colors,
    background: '#060709',
    surface: '#0d0f14',
    accent: '#00e5ff',
    text: '#ffffff',
  },
}
```

```tsx
// ui/tokens/themes/neon-glow.ts — Ebene 3 (NUR Änderungen)
import type { ThemeOverride } from '../base.tokens'

export const neonGlowOverride: ThemeOverride = {
  colors: {
    accent: '#39ff14',
    surface: '#0a0a1a',
  },
  effects: { glowIntensity: 0.8 },
}
```

```tsx
// ui/tokens/themes/glass-dashboard.ts
import type { ThemeOverride } from '../base.tokens'

export const glassDashboardOverride: ThemeOverride = {
  colors: {
    surface: 'rgba(255,255,255,0.05)',
  },
  effects: { blur: '12px', borderOpacity: 0.1 },
}

// Weitere: purpleHazeOverride, emberDarkOverride
```

```tsx
// ui/tokens/theme-registry.ts — Zentraler Merge
import { workhubDefaultTokens } from './workhub-default.tokens'
import { neonGlowOverride } from './themes/neon-glow'
import { glassDashboardOverride } from './themes/glass-dashboard'
import type { ThemeTokens, ThemeOverride } from './base.tokens'

function deepMerge(base: ThemeTokens, override: ThemeOverride): ThemeTokens {
  const result = { ...base }
  for (const key of Object.keys(override) as (keyof ThemeOverride)[]) {
    if (override[key] && typeof override[key] === 'object' && !Array.isArray(override[key])) {
      (result as any)[key] = { ...(base as any)[key], ...override[key] }
    }
  }
  return result
}

export const themeRegistry = {
  'cnc-original': workhubDefaultTokens,
  'neon-glow': deepMerge(workhubDefaultTokens, neonGlowOverride),
  'glass-dashboard': deepMerge(workhubDefaultTokens, glassDashboardOverride),
  // 'purple-haze': deepMerge(workhubDefaultTokens, purpleHazeOverride),
  // 'ember-dark': deepMerge(workhubDefaultTokens, emberDarkOverride),
} as const

export type ThemeKey = keyof typeof themeRegistry
```

---

## Migrationsreihenfolge

| #  | Feature           | Schwierigkeit | Selectors nötig?        | Adapter                                          |
|----|-------------------|---------------|-------------------------|--------------------------------------------------|
| 1  | Startseite        | ⭐            | ❌ Nein                 | mapQuickAction()                                 |
| 2  | Dashboard         | ⭐⭐          | ✅ selectDashboardStats | mapStatToCard(), mapStatToKPI()                  |
| 3  | Lagerverwaltung   | ⭐⭐          | ✅ selectLowStock       | mapKartonToListItem(), mapKartonToDetail()       |
| 4  | Prüfprotokolle    | ⭐⭐⭐        | ⚡ Nur wenn Filter      | mapProtokollToCard(), mapProtokollToTableRow()   |
| 5  | Aufträge          | ⭐⭐⭐⭐      | ✅ Filter + Stats       | mapOrderToCard/TableRow/DetailPanel/StatusBadge  |
| 6  | Scanner           | ⭐⭐⭐⭐⭐    | ✅ Phasen-Logik         | mapScanPhaseToView(), mapFieldToConfirmation()   |

---

## Workflow pro Feature

### Schritt 1: Hook extrahieren
```bash
git commit -m "feat(orders): useOrders Hook extrahiert"
```

### Schritt 2: Adapter bauen (+ Selectors/Types wenn nötig)
```bash
git commit -m "feat(orders): Order-Adapter (Card, Table, Detail, Badge)"
```

### Schritt 3: View + fachliche Komponenten bauen
```bash
git commit -m "feat(orders): OrdersView + OrderCard mit SetupHub UI"
```

### Schritt 4: Page zusammenstecken
```bash
git commit -m "feat(orders): OrdersPage Klebeschicht"
```

### Schritt 5: Parallelprüfung + alte UI entfernen
```bash
git commit -m "feat(orders): Migration komplett, alte UI entfernt"
git push
```

---

## Definition of Done (pro Feature)

Ein Feature ist erst „migriert", wenn ALLE zutreffenden Punkte erfüllt sind:

### Architektur
- [ ] Hook extrahiert mit `{ state, actions }` Return
- [ ] Adapter für jede Darstellungsform vorhanden (immer echte ID)
- [ ] View vorhanden (kein useEffect, kein API, kein State)
- [ ] Page enthält NUR: Hook-Aufruf, Adapter-Mapping, View-Rendering
- [ ] Fachliche Komponenten in `features/.../components/`
- [ ] Kein Feature-Type in `ui/` importiert
- [ ] Selectors nur wenn komplex (NICHT als leere Pflicht-Ordner)
- [ ] Types-Datei nur wenn Props geteilt werden (NICHT als leere Pflicht-Datei)

### Funktional (Parallelprüfung gegen alte UI)
- [ ] Gleiche Daten angezeigt?
- [ ] Gleiche Aktionen funktional?
- [ ] Gleiche Filter/Sortierung?
- [ ] Gleiche Sonderfälle (leere Liste, Fehler, Ladezeit)?
- [ ] Loading/Error/Empty States vorhanden?

### Qualität
- [ ] Touch Targets ≥ 48px
- [ ] Theme-Tokens verwendet (keine hardcoded Farben)
- [ ] Netlify Preview getestet

---

## Pragmatismus-Leitplanken

Das System ist stark. Die größte Gefahr ist jetzt nicht Chaos, sondern Überbau.

### Nur anlegen wenn nötig:

| Ordner/Datei | Anlegen wenn... | NICHT anlegen wenn... |
|---|---|---|
| `selectors/` | Filter/Sort/Gruppierung > Einzeiler | Trivialer `.filter()` einmal genutzt |
| `types/ui.types.ts` | Props von >1 Datei importiert | Nur 1 View nutzt den Typ |
| `components/` | Fachliche UI existiert (OrderCard) | Feature hat nur eine View ohne eigene Bausteine |
| `model/` | Feature hat eigene Types | Feature nutzt nur shared Types |

### Was eine saubere Page ausmacht:

```
✅ Sauber (egal ob 10 oder 20 Zeilen):
  - Hook aufrufen
  - Daten mappen
  - View rendern
  - Ggf. einfache Bedingung (Route-Params → Hook-Config)

❌ Unsauber:
  - useEffect in der Page
  - API Call in der Page
  - JSX-Logik (ternaries, .map()) in der Page
  - Styling in der Page
```

### Die 3 Fragen vor jeder neuen Datei:

1. **Braucht das Feature diese Ebene wirklich?** — Wenn nicht: weglassen.
2. **Würde ein anderer Entwickler verstehen, warum diese Datei existiert?** — Wenn nicht: vereinfachen.
3. **Löst diese Datei ein echtes Problem oder nur ein theoretisches?** — Wenn theoretisch: weglassen.

---

## Vermeidbare Fehler

| ❌ Nicht tun | ✅ Stattdessen |
|---|---|
| Leere Ordner „für später" anlegen | Ordner erst bei echtem Bedarf erstellen |
| Für jedes Feature 8 Dateien erzwingen | Minimale Struktur nutzen, bei Bedarf erweitern |
| UI in bestehende Komponenten quetschen | Neue View-Datei, alte erst am Ende löschen |
| SetupHub 1:1 kopieren | Tokens + Komponenten übernehmen, Patterns anpassen |
| Logik anfassen „weil ich eh dran bin" | NUR UI austauschen |
| Alles auf einmal umbauen | Feature für Feature |
| `key={order.title}` | Immer `key={order.id}` mit echter ID |
| Feature-Komponenten in `ui/` | In `features/.../components/` |
| Hooks geben loses Gemisch zurück | `{ state, actions }` Struktur |
| Alte UI sofort löschen | Erst Parallelprüfung |
| Theme-Overrides als komplette Objekte | Nur Änderungen, zentral mergen |

---

## Checkliste vor dem Start

- [ ] Branch `feat/setuphub-ui-migration` erstellt
- [ ] SetupHub lokal geklont (neben WorkHub)
- [ ] Komponentengrenze definiert (generisch vs. fachlich)
- [ ] SetupHub `ui/`, `design-system/` nach WorkHub `src/ui/` kopiert
- [ ] Theme 3-Ebenen-System aufgesetzt (base → default → partial overrides)
- [ ] Bestehende Komponenten-Liste erstellt
- [ ] Feature 1 (Startseite) identifiziert und Logik-/UI-Grenzen markiert

---

## Nächster Schritt

Wenn du bereit bist: **Feature 1 (Startseite)** durchspielen.
→ Code zeigen → Hook → Adapter → View → DoD prüfen → fertig.
