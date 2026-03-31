import { useState } from 'react';
import { TabBar } from '../components/shared/TabBar';
import { MetallgruppenView } from '../components/metallgruppen/MetallgruppenView';
import { VerpackungView } from '../components/verpackung/VerpackungView';

type Tab = 'metallgruppen' | 'verpackung';

const tabs = [
  { id: 'metallgruppen' as const, label: 'Metallgruppen' },
  { id: 'verpackung' as const, label: 'Verpackung' },
];

export function Handbuch() {
  const [activeTab, setActiveTab] = useState<Tab>('metallgruppen');

  return (
    <div>
      <TabBar tabs={tabs} active={activeTab} onChange={setActiveTab} />
      <div style={{ paddingTop: 10 }}>
        {activeTab === 'metallgruppen' && <MetallgruppenView />}
        {activeTab === 'verpackung' && <VerpackungView />}
      </div>
    </div>
  );
}
