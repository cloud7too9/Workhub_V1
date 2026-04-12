import type { LucideIcon } from 'lucide-react';
import { BookOpen, Calculator, ClipboardList, Settings } from 'lucide-react';

export interface RouteItem {
  id: string;
  path: string;
  label: string;
  icon: LucideIcon;
  subtitle?: string;
}

export const routes: RouteItem[] = [
  { id: 'handbuch', path: '/', label: 'Handbuch', icon: BookOpen, subtitle: 'Werkstoffe' },
  { id: 'rechner', path: '/rechner', label: 'Rechner', icon: Calculator, subtitle: 'Stückzahl + Rest' },
  { id: 'auftraege', path: '/auftraege', label: 'Aufträge', icon: ClipboardList, subtitle: 'Verwaltung' },
  { id: 'einstellungen', path: '/einstellungen', label: 'Einstellungen', icon: Settings },
];

export function getRouteByPath(pathname: string): RouteItem | undefined {
  return routes.find(r => r.path === pathname);
}
