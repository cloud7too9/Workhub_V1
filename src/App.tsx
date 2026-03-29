import { useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { Topbar } from './components/layout/Topbar';
import { Drawer } from './components/layout/Drawer';
import { Handbuch } from './pages/Handbuch';
import { Rechner } from './pages/Rechner';
import { Auftraege } from './pages/Auftraege';
import { Metallgruppen } from './pages/Metallgruppen';
import { Einstellungen } from './pages/Einstellungen';

const pageTitles: Record<string, { title: string; subtitle?: string }> = {
  '/': { title: 'Werkstoff-Handbuch', subtitle: 'offline, klickbar' },
  '/rechner': { title: 'Rechner', subtitle: 'Stückzahl + Restlänge' },
  '/auftraege': { title: 'Aufträge', subtitle: 'Verwaltung' },
  '/metallgruppen': { title: 'Metallgruppen', subtitle: 'Übersicht' },
  '/einstellungen': { title: 'Einstellungen' },
};

export function App() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const location = useLocation();

  const current = pageTitles[location.pathname] ?? { title: 'WorkHub' };

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
          <Route path="/metallgruppen" element={<Metallgruppen />} />
          <Route path="/einstellungen" element={<Einstellungen />} />
        </Routes>
      </main>
    </div>
  );
}
