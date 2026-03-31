import { useState } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Topbar } from './components/layout/Topbar';
import { Drawer } from './components/layout/Drawer';
import { ErrorBoundary } from './components/shared/ErrorBoundary';
import { getPageTitle } from './data/navigation';
import { Handbuch } from './pages/Handbuch';
import { Rechner } from './pages/Rechner';
import { Auftraege } from './pages/Auftraege';
import { Einstellungen } from './pages/Einstellungen';
import { Start } from './pages/Start';

export function App() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const location = useLocation();

  const current = getPageTitle(location.pathname);
  const isStart = location.pathname === '/';

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
      }}
    >
      {!isStart && (
        <Topbar
          title={current.title}
          subtitle={current.subtitle}
          onMenuClick={() => setDrawerOpen(true)}
        />
      )}
      <Drawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />

      <main style={{ flex: 1 }}>
        <ErrorBoundary>
          <Routes>
            <Route path="/" element={<Start />} />
            <Route path="/handbuch" element={<Handbuch />} />
            <Route path="/rechner" element={<Rechner />} />
            <Route path="/auftraege" element={<Auftraege />} />
            <Route path="/einstellungen" element={<Einstellungen />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </ErrorBoundary>
      </main>
    </div>
  );
}
