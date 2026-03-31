# WorkHub V1

Werkstatt-Management PWA für CNC Recknagel.

## Stack

- **React 18** + **TypeScript** + **Vite**
- Deployment via **Netlify** (auto-deploy on push)
- Daten: `localStorage` (offline-first, kein Backend)

## Bereiche

| Pfad | Bereich | Beschreibung |
|------|---------|--------------|
| `/` | Startbereich | Übersicht + Navigation |
| `/handbuch` | Handbuch | Metallgruppen + Verpackung (Tabs) |
| `/rechner` | Rechner | Formelrechner mit visueller Konfiguration |
| `/auftraege` | Aufträge | Werkstattaufträge (CRUD + Statusverlauf) |
| `/einstellungen` | Einstellungen | Änderungsprotokoll + Benachrichtigungen |

## Entwicklung

```bash
npm install
npm run dev       # Vite dev server
npm run build     # tsc + vite build (production)
npm run lint      # ESLint
npm run preview   # Production preview lokal
```

## Architektur

```
src/
├── data/           # Navigation (single source of truth), Operationen, Metalldaten
├── pages/          # Seiten-Komponenten (lazy-loaded)
├── components/     # UI-Komponenten nach Bereich gruppiert
│   ├── shared/     # Overlay, TabBar, ErrorBoundary, ConfirmDialog
│   ├── layout/     # Topbar, Drawer
│   └── ...         # auftraege, rechner, handbuch, etc.
├── stores/         # localStorage-Wrapper (materialStore, orderStore, etc.)
├── styles/         # tokens.ts (Design-System) + globals.css
├── types/          # TypeScript-Interfaces
└── utils/          # Shared Utilities (uid)
```

## Design-System

Tokens in `src/styles/tokens.ts`: Hintergrund `#060709`, Akzent `#00e5ff`, Fonts DM Sans + JetBrains Mono. Touch-Targets min. 48px. Alle Overlays nutzen die shared `Overlay.tsx` Bausteine.

## Deploy

Push auf Branch `Rebuild_Typescript` → Netlify baut automatisch.

Manuell: `npx netlify deploy --prod --dir=dist`
