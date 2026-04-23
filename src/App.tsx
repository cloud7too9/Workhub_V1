import { Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './app/providers/ThemeProvider';
import { AppLayout } from './app/layout/AppLayout';

// Alle Pages migriert
import { HandbuchPage } from './pages/HandbuchPage';
import { RechnerPage } from './pages/RechnerPage';
import { AuftraegePage } from './pages/AuftraegePage';
import { WerkstueckePage } from './pages/WerkstueckePage';
import { EinstellungenPage } from './pages/EinstellungenPage';

export function App() {
  return (
    <ThemeProvider>
      <AppLayout>
        <Routes>
          <Route path="/" element={<HandbuchPage />} />
          <Route path="/rechner" element={<RechnerPage />} />
          <Route path="/auftraege" element={<AuftraegePage />} />
          <Route path="/werkstuecke" element={<WerkstueckePage />} />
          <Route path="/einstellungen" element={<EinstellungenPage />} />
        </Routes>
      </AppLayout>
    </ThemeProvider>
  );
}
