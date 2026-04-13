import { Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './app/providers/ThemeProvider';
import { AppLayout } from './app/layout/AppLayout';

// Alle Pages migriert
import { HandbuchPage } from './pages/HandbuchPage';
import { RechnerPage } from './pages/RechnerPage';
import { AuftraegePage } from './pages/AuftraegePage';
import { EinstellungenPage } from './pages/EinstellungenPage';
import { Startseite } from './pages/Startseite';

export function App() {
  return (
    <ThemeProvider>
      <AppLayout>
        <Routes>
          <Route path="/" element={<Startseite />} />
          <Route path="/handbuch" element={<HandbuchPage />} />
          <Route path="/rechner" element={<RechnerPage />} />
          <Route path="/auftraege" element={<AuftraegePage />} />
          <Route path="/einstellungen" element={<EinstellungenPage />} />
        </Routes>
      </AppLayout>
    </ThemeProvider>
  );
}
