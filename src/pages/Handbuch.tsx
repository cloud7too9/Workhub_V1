import { useState } from 'react';
import { tokens } from '../styles/tokens';
import { MetallgruppenView } from '../components/metallgruppen/MetallgruppenView';
import { VerpackungView } from '../components/verpackung/VerpackungView';

type Tab = 'metallgruppen' | 'verpackung';

const tabs: { id: Tab; label: string }[] = [
  { id: 'metallgruppen', label: 'Metallgruppen' },
  { id: 'verpackung', label: 'Verpackung' },
];

export function Handbuch() {
  const [activeTab, setActiveTab] = useState<Tab>('metallgruppen');

  return (
    <div>
      {/* Sticky Tabs */}
      <div
        style={{
          position: 'sticky',
          top: 56,
          zIndex: 30,
          padding: '10px 14px',
          background: 'rgba(13,15,15,0.86)',
          backdropFilter: 'blur(12px)',
          borderBottom: `1px solid ${tokens.border}`,
          display: 'flex',
          gap: 8,
        }}
      >
        {tabs.map((t) => {
          const isActive = activeTab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              style={{
                height: 40,
                padding: '0 16px',
                borderRadius: 10,
                border: `1px solid ${isActive ? tokens.accent + '50' : tokens.border}`,
                background: isActive ? tokens.accentDim : 'transparent',
                color: isActive ? tokens.accent : tokens.muted,
                fontSize: 14,
                fontWeight: isActive ? 600 : 400,
                cursor: 'pointer',
                fontFamily: tokens.font.ui,
                transition: 'all 0.15s ease',
              }}
            >
              {t.label}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div style={{ paddingTop: 10 }}>
        {activeTab === 'metallgruppen' && <MetallgruppenView />}
        {activeTab === 'verpackung' && <VerpackungView />}
      </div>
    </div>
  );
}
