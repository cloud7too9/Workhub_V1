import { useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { Topbar } from './components/layout/Topbar';
import { Drawer } from './components/layout/Drawer';
import { getPageTitle } from './data/navigation';
import { Handbuch } from './pages/Handbuch';
import { Rechner } from './pages/Rechner';
import { Auftraege } from './pages/Auftraege';
import { Einstellungen } from './pages/Einstellungen';

export function App() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const location = useLocation();

  const current = getPageTitle(location.pathname);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
      }}
    >
      <Topbar
        title={current.title}
        subtitle={current.subtitle}
        onMenuClick={() => setDrawerOpen(true)}
      />
      <Drawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />

      <main style={{ flex: 1 }}>
        <Routes>
          <Route path="/" element={<Handbuch />} />
          <Route path="/rechner" element={<Rechner />} />
          <Route path="/auftraege" element={<Auftraege />} />
          <Route path="/einstellungen" element={<Einstellungen />} />
        </Routes>
      </main>
    </div>
  );
}
