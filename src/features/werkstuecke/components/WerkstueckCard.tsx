import { useState } from 'react';
import { ChevronDown, Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/ui';
import type { WerkstueckCardProps } from '../types/ui.types';

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: 'flex', gap: 10, fontSize: 13 }}>
      <span style={{ color: 'var(--text-3)', minWidth: 100 }}>{label}</span>
      <span style={{ color: 'var(--text-1)', fontWeight: 500 }}>{value}</span>
    </div>
  );
}

export function WerkstueckCard({
  title,
  subtitle,
  details,
  arbeitsgangCount,
  onEdit,
  onDelete,
}: WerkstueckCardProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      style={{
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-lg)',
        background: 'var(--surface)',
        overflow: 'hidden',
      }}
    >
      <div
        onClick={() => setExpanded(!expanded)}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: 14,
          cursor: 'pointer',
          gap: 10,
        }}
      >
        <div style={{ minWidth: 0, flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-1)' }}>{title}</span>
            <span
              style={{
                fontSize: 10,
                fontWeight: 700,
                color: 'var(--text-3)',
                background: 'var(--surface-alt)',
                border: '1px solid var(--border-subtle)',
                padding: '2px 6px',
                borderRadius: 5,
              }}
            >
              {arbeitsgangCount} Arbeitsgänge
            </span>
          </div>
          <div style={{ fontSize: 12, color: 'var(--text-3)' }}>{subtitle}</div>
        </div>
        <ChevronDown
          size={16}
          color="var(--text-3)"
          style={{
            transition: 'transform 0.2s ease',
            transform: expanded ? 'rotate(180deg)' : 'rotate(0)',
            flexShrink: 0,
          }}
        />
      </div>

      {expanded && (
        <div
          style={{
            padding: '0 14px 14px',
            borderTop: '1px solid var(--border-subtle)',
            animation: 'slideUp 0.2s ease',
          }}
        >
          <div style={{ display: 'grid', gap: 8, padding: '12px 0' }}>
            {details.map((d) => (
              <DetailRow key={d.label} label={d.label} value={d.value} />
            ))}
          </div>
          <div style={{ display: 'flex', gap: 'var(--sp-sm)', flexWrap: 'wrap' }}>
            <Button
              variant="secondary"
              size="sm"
              icon={<Pencil size={13} />}
              onClick={(e: React.MouseEvent) => {
                e.stopPropagation();
                onEdit();
              }}
            >
              Bearbeiten
            </Button>
            <Button
              variant="danger"
              size="sm"
              icon={<Trash2 size={13} />}
              onClick={(e: React.MouseEvent) => {
                e.stopPropagation();
                onDelete();
              }}
            >
              Löschen
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
