import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Topbar } from './Topbar';
import { BottomNav } from './BottomNav';
import { Sidebar } from './Sidebar';
import { ScreenContainer } from './ScreenContainer';
import { getRouteByPath } from '../routes/route-config';

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const route = getRouteByPath(location.pathname);

  return (
    <div style={{ minHeight: '100dvh', background: 'var(--bg)' }}>
      <Topbar
        title={route?.label ?? 'WorkHub'}
        subtitle={route?.subtitle}
        onMenuOpen={() => setSidebarOpen(true)}
      />
      <ScreenContainer>{children}</ScreenContainer>
      <BottomNav activePath={location.pathname} />
      <Sidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        activePath={location.pathname}
      />
    </div>
  );
}
