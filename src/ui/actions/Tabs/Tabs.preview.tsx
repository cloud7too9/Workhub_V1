import { useState } from 'react';
import { Tabs } from './Tabs';

function TabsDemo() {
  const [a, setA] = useState('tab1');
  const [b, setB] = useState('opt1');
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <Tabs items={[{ id: 'tab1', label: 'Übersicht' }, { id: 'tab2', label: 'Details' }, { id: 'tab3', label: 'Verlauf' }]} active={a} onChange={setA} />
      <Tabs items={[{ id: 'opt1', label: 'An' }, { id: 'opt2', label: 'Aus' }]} active={b} onChange={setB} />
    </div>
  );
}

export const tabsPreviews = {
  id: 'tabs',
  name: 'Tabs',
  sections: [
    { title: 'Varianten', render: () => <TabsDemo /> },
  ],
};
