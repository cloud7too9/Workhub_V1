import { useState } from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import { Button, Sheet } from '@/ui';
import type { HallOrderChipData } from '../types/ui.types';

interface HallOrderChipProps extends HallOrderChipData {
  onAdvance: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: 'flex', gap: '10px', fontSize: '13px' }}>
      <span style={{ color: 'var(--text-3)', minWidth: '100px' }}>{label}</span>
      <span style={{ color: 'var(--text-1)', fontWeight: 500 }}>{value}</span>
    </div>
  );
}

export function HallOrderChip({
  title, subtitle, deliveryDate, urgencyBadge,
  statusColor, advanceAction, details,
  onAdvance, onEdit, onDelete,
}: HallOrderChipProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div
        onClick={() => setOpen(true)}
        style={{
          padding: '8px 10px',
          borderRadius: 'var(--radius-md)',
          background: 'var(--surface)',
          border: '1px solid var(--border-subtle)',
          cursor: 'pointer',
          transition: 'border-color 0.15s ease',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}
        onMouseEnter={(e) => { e.currentTarget.style.borderColor = statusColor + '60'; }}
        onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border-subtle)'; }}
      >
        <div style={{
          width: '6px', height: '6px', borderRadius: '50%',
          background: statusColor, flexShrink: 0,
        }} />
        <div style={{ minWidth: 0, flex: 1 }}>
          <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-1)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {title}
          </div>
          <div style={{ fontSize: '10px', color: 'var(--text-3)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {subtitle}
          </div>
        </div>
        <span style={{ fontSize: '10px', color: 'var(--text-3)', flexShrink: 0 }}>
          {deliveryDate}
        </span>
        {urgencyBadge && (
          <span style={{
            fontSize: '9px', fontWeight: 700, color: 'var(--error)',
            background: 'color-mix(in srgb, var(--error) 12%, transparent)',
            padding: '1px 5px', borderRadius: '4px', flexShrink: 0,
          }}>
            {urgencyBadge.label}
          </span>
        )}
      </div>

      <Sheet open={open} onClose={() => setOpen(false)} title={title} side="bottom">
        <div style={{ display: 'grid', gap: '8px', marginBottom: 'var(--sp-lg)' }}>
          {details.map((d) => <DetailRow key={d.label} label={d.label} value={d.value} />)}
        </div>

        <div style={{ display: 'flex', gap: 'var(--sp-sm)', flexWrap: 'wrap' }}>
          {advanceAction && (
            <button
              onClick={() => { onAdvance(); setOpen(false); }}
              style={{
                height: '40px', padding: '0 16px', borderRadius: 'var(--radius-md)',
                border: 'none', background: advanceAction.color, color: '#0b0d10',
                fontSize: '13px', fontWeight: 700, cursor: 'pointer', fontFamily: 'var(--font-sans)',
              }}
            >
              {advanceAction.label}
            </button>
          )}
          <Button variant="secondary" size="sm" icon={<Pencil size={13} />}
            onClick={() => { onEdit(); setOpen(false); }}>
            Bearbeiten
          </Button>
          <Button variant="danger" size="sm" icon={<Trash2 size={13} />}
            onClick={() => { onDelete(); setOpen(false); }}>
            Löschen
          </Button>
        </div>
      </Sheet>
    </>
  );
}
