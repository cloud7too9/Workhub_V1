export interface NavRoute {
  path: string;
  label: string;
  group: string;
  title: string;
  subtitle?: string;
  showInSidebar: boolean;
}

export const routes: NavRoute[] = [
  { path: '/', label: 'Startbereich', group: '', title: 'WorkHub', showInSidebar: true },
  { path: '/handbuch', label: 'Handbuch', group: 'Werkstoffe', title: 'Werkstoff-Handbuch', subtitle: 'offline, klickbar', showInSidebar: true },
  { path: '/rechner', label: 'Rechner', group: 'Tools', title: 'Rechner', subtitle: 'Stückzahl + Restlänge', showInSidebar: true },
  { path: '/auftraege', label: 'Aufträge', group: 'Verwaltung', title: 'Aufträge', subtitle: 'Verwaltung', showInSidebar: true },
  { path: '/einstellungen', label: 'Einstellungen', group: 'System', title: 'Einstellungen', showInSidebar: true },
];

export function getPageTitle(pathname: string): { title: string; subtitle?: string } {
  const route = routes.find((r) => r.path === pathname);
  return route ? { title: route.title, subtitle: route.subtitle } : { title: 'WorkHub' };
}

export function getSidebarItems(): NavRoute[] {
  return routes.filter((r) => r.showInSidebar);
}
