import { ChevronDown } from 'lucide-react';
import type { PackagingGroup } from '@/data/packagingGroups';
import { Badge } from '@/ui';

const CARD_COLOR = '#f59e0b';

interface PackagingGroupCardProps {
  group: PackagingGroup;
  isOpen: boolean;
  onToggle: () => void;
}

export function PackagingGroupCard({ group, isOpen, onToggle }: PackagingGroupCardProps) {
  const c = CARD_COLOR;

  return (
    <div style={{
      background: 'var(--surface)',
      border: `1px solid ${isOpen ? c + '50' : 'var(--border-subtle)'}`,
      borderRadius: 'var(--radius-lg)',
      overflow: 'hidden',
      transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
      boxShadow: isOpen ? `0 0 20px ${c}12` : 'none',
    }}>
      {/* Header */}
      <button
        onClick={onToggle}
        style={{
          width: '100%', display: 'flex', alignItems: 'center',
          justifyContent: 'space-between', padding: '14px 16px',
          background: 'none', border: 'none', cursor: 'pointer', minHeight: '48px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: 10, height: 10, borderRadius: '50%',
            background: c, boxShadow: `0 0 8px ${c}80`,
          }} />
          <span style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-1)' }}>
            {group.name}
          </span>
          <Badge color="neutral">{group.articles.length}</Badge>
        </div>
        <ChevronDown
          size={16} color={c}
          style={{ transition: 'transform 0.2s ease', transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
        />
      </button>

      {/* Table */}
      {isOpen && (
        <div style={{ padding: '0 16px 16px', animation: 'slideUp 0.2s ease' }}>
          {/* Header row */}
          <div style={{
            display: 'grid', gridTemplateColumns: '1fr 65px 65px 1fr',
            gap: '8px', padding: '8px 10px', borderRadius: 'var(--radius-md)',
            background: 'var(--bg)', marginBottom: '6px',
          }}>
            {['Artikel', 'Höhe', 'Ø mm', 'Verpackung'].map((h) => (
              <span key={h} style={{
                fontSize: '10px', fontWeight: 700, color: 'var(--text-3)',
                textTransform: 'uppercase', letterSpacing: '0.08em',
              }}>
                {h}
              </span>
            ))}
          </div>

          {/* Data rows */}
          {group.articles.map((a) => {
            const isKarton = !!a.karton;
            const packLabel = isKarton ? a.karton : a.beutel;
            const packType = isKarton ? 'Karton' : 'Beutel';
            const packColor = isKarton ? '#60a5fa' : '#a78bfa';

            return (
              <div key={a.name} style={{
                display: 'grid', gridTemplateColumns: '1fr 65px 65px 1fr',
                gap: '8px', padding: '10px', borderBottom: '1px solid var(--border-subtle)',
                alignItems: 'center',
              }}>
                <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-1)', fontFamily: 'var(--font-mono)' }}>
                  {a.name}
                </span>
                <span style={{ fontSize: '13px', color: 'var(--text-2)', fontFamily: 'var(--font-mono)' }}>
                  {a.height}
                </span>
                <span style={{ fontSize: '13px', color: 'var(--text-2)', fontFamily: 'var(--font-mono)' }}>
                  {a.diameter}
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{
                    fontSize: '10px', fontWeight: 700, color: packColor,
                    background: `${packColor}18`, border: `1px solid ${packColor}30`,
                    padding: '2px 6px', borderRadius: '5px',
                  }}>
                    {packType}
                  </span>
                  <span style={{ fontSize: '12px', fontFamily: 'var(--font-mono)', color: 'var(--text-1)' }}>
                    {packLabel}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
