import { Routes, Route } from 'react-router-dom';
import { LagerbestandLanding } from '../components/lagerbestand/LagerbestandLanding';
import { VerpackungStock } from '../components/lagerbestand/VerpackungStock';

export function Lagerbestand() {
  return (
    <Routes>
      <Route index element={<LagerbestandLanding />} />
      <Route path="verpackung" element={<VerpackungStock />} />
    </Routes>
  );
}
