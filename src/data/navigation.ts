export interface NavChild {
  path: string;
  label: string;
  status?: string | null; // e.g. 'in Planung'
}

export interface NavRoute {
  path: string;
  label: string;
  group: string;
  title: string;
  subtitle?: string;
  showInSidebar: boolean;
  children?: NavChild[];
}

export const routes: NavRoute[] = [
  { path: '/', label: 'Startseite', group: 'Home', title: 'WorkHub', subtitle: 'CNC Recknagel', showInSidebar: true },
  { path: '/handbuch', label: 'Handbuch', group: 'Werkstoffe', title: 'Werkstoff-Handbuch', subtitle: 'offline, klickbar', showInSidebar: true },
  { path: '/rechner', label: 'Rechner', group: 'Tools', title: 'Rechner', subtitle: 'Stückzahl + Restlänge', showInSidebar: true },
  { path: '/auftraege', label: 'Aufträge', group: 'Verwaltung', title: 'Aufträge', subtitle: 'Verwaltung', showInSidebar: true },
  {
    path: '/lagerbestand',
    label: 'Lagerbestand',
    group: 'Verwaltung',
    title: 'Lagerbestand',
    subtitle: 'Übersicht',
    showInSidebar: true,
    children: [
      { path: '/lagerbestand/verpackung', label: 'Verpackung', status: null },
      { path: '/lagerbestand/fertige-werkstuecke', label: 'Fertige Werkstücke', status: 'in Planung' },
      { path: '/lagerbestand/vorbereitete-werkstuecke', label: 'Vorbereitete Werkstücke', status: 'in Planung' },
      { path: '/lagerbestand/material', label: 'Material', status: 'in Planung' },
      { path: '/lagerbestand/reststuecke', label: 'Reststücke', status: 'in Planung' },
    ],
  },
  { path: '/einstellungen', label: 'Einstellungen', group: 'System', title: 'Einstellungen', showInSidebar: true },
];

export function getPageTitle(pathname: string): { title: string; subtitle?: string } {
  // Check main routes
  const route = routes.find((r) => r.path === pathname);
  if (route) return { title: route.title, subtitle: route.subtitle };

  // Check children
  for (const r of routes) {
    if (r.children) {
      const child = r.children.find((c) => c.path === pathname);
      if (child) return { title: child.label, subtitle: r.title };
    }
  }

  return { title: 'WorkHub' };
}

export function getSidebarItems(): NavRoute[] {
  return routes.filter((r) => r.showInSidebar);
}
