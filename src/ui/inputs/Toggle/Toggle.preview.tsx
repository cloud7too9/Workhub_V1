import { useState } from 'react';
import { Toggle } from './Toggle';

function ToggleDemo() {
  const [a, setA] = useState(false);
  const [b, setB] = useState(true);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <Toggle checked={a} onChange={setA} label="Aus-Zustand" />
      <Toggle checked={b} onChange={setB} label="An-Zustand" />
      <Toggle checked={false} onChange={() => {}} label="Disabled" disabled />
    </div>
  );
}

export const togglePreviews = {
  id: 'toggle',
  name: 'Toggle',
  sections: [
    { title: 'Zustände', render: () => <ToggleDemo /> },
  ],
};
