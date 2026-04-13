import { lazy } from 'react';
import type { ComponentType, ReactNode } from 'react';

// -- Route definition --

export interface NavRoute {
  path: string;
  label: string;
  group: string;
  title: string;
  subtitle?: string;
  icon: ReactNode;
  showInSidebar: boolean;
  /** true = hide Topbar on this page */
  hideChrome?: boolean;
  /** Lazy-loaded page component (deferred import avoids circular deps) */
  component: React.LazyExoticComponent<ComponentType>;
}

// -- Icons (inline SVG — no extra package) --

const icon = (d: ReactNode) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {d}
  </svg>
);

const ICONS = {
  home: icon(
    <>
      <path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </>
  ),
  book: icon(
    <>
      <path d="M4 19.5A2.5 2.5 0 016.5 17H20" />
      <path d="M4 4.5A2.5 2.5 0 016.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15z" />
      <path d="M8 7h8M8 11h6" />
    </>
  ),
  calculator: icon(
    <>
      <rect x="4" y="2" width="16" height="20" rx="2" />
      <line x1="8" y1="6" x2="16" y2="6" />
      <line x1="8" y1="10" x2="10" y2="10" />
      <line x1="12" y1="10" x2="14" y2="10" />
      <line x1="8" y1="14" x2="10" y2="14" />
      <line x1="12" y1="14" x2="14" y2="14" />
      <line x1="8" y1="18" x2="14" y2="18" />
    </>
  ),
  clipboard: icon(
    <>
      <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" />
      <rect x="9" y="3" width="6" height="4" rx="1" />
      <path d="M9 14l2 2 4-4" />
    </>
  ),
  settings: icon(
    <>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 01-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09a1.65 1.65 0 00-1.08-1.51 1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09a1.65 1.65 0 001.51-1.08 1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001.08 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9c.26.604.852.997 1.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1.08z" />
    </>
  ),
} as const;

// -- Lazy page components (deferred -> no circular deps) --

const HandbuchPage = lazy(() => import('../pages/HandbuchPage').then((m) => ({ default: m.HandbuchPage })));
const RechnerPage = lazy(() => import('../pages/RechnerPage').then((m) => ({ default: m.RechnerPage })));
const AuftraegePage = lazy(() => import('../pages/AuftraegePage').then((m) => ({ default: m.AuftraegePage })));
const EinstellungenPage = lazy(() => import('../pages/EinstellungenPage').then((m) => ({ default: m.EinstellungenPage })));

// -- Route table (single source of truth) --

export const routes: NavRoute[] = [
  {
    path: '/handbuch',
    label: 'Handbuch',
    group: 'Werkstoffe',
    title: 'Werkstoff-Handbuch',
    subtitle: 'offline, klickbar',
    icon: ICONS.book,
    showInSidebar: true,
    component: HandbuchPage,
  },
  {
    path: '/rechner',
    label: 'Rechner',
    group: 'Tools',
    title: 'Rechner',
    subtitle: 'Stückzahl + Restlänge',
    icon: ICONS.calculator,
    showInSidebar: true,
    component: RechnerPage,
  },
  {
    path: '/auftraege',
    label: 'Aufträge',
    group: 'Verwaltung',
    title: 'Aufträge',
    subtitle: 'Verwaltung',
    icon: ICONS.clipboard,
    showInSidebar: true,
    component: AuftraegePage,
  },
  {
    path: '/einstellungen',
    label: 'Einstellungen',
    group: 'System',
    title: 'Einstellungen',
    icon: ICONS.settings,
    showInSidebar: true,
    component: EinstellungenPage,
  },
];

// -- Helpers --

export function getRoute(pathname: string): NavRoute | undefined {
  return routes.find((r) => r.path === pathname);
}

export function getPageTitle(pathname: string): { title: string; subtitle?: string } {
  const route = getRoute(pathname);
  return route ? { title: route.title, subtitle: route.subtitle } : { title: 'WorkHub' };
}

export function getSidebarItems(): NavRoute[] {
  return routes.filter((r) => r.showInSidebar);
}

/** Routes shown as nav cards on the start page */
export function getStartNavItems(): NavRoute[] {
  return routes.filter((r) => r.showInSidebar);
}
