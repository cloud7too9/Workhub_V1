import { Tabs } from '@/ui';

const tabItems = [
  { id: 'metallgruppen', label: 'Metallgruppen' },
  { id: 'verpackung', label: 'Verpackung' },
];

interface HandbuchViewProps {
  activeTab: string;
  onTabChange: (id: string) => void;
  children: React.ReactNode;
}

export function HandbuchView({ activeTab, onTabChange, children }: HandbuchViewProps) {
  return (
    <div>
      <div style={{ marginBottom: 'var(--sp-lg)' }}>
        <Tabs items={tabItems} active={activeTab} onChange={onTabChange} />
      </div>
      {children}
    </div>
  );
}
