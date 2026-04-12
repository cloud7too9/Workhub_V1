import { Pencil, X } from 'lucide-react';

interface MaterialChipProps {
  name: string;
  color: string;
  onEdit: () => void;
  onDelete: () => void;
}

export function MaterialChip({ name, color, onEdit, onDelete }: MaterialChipProps) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: '6px',
      padding: '6px 10px', borderRadius: 'var(--radius-sm)',
      background: `${color}12`, border: `1px solid ${color}30`,
      fontFamily: 'var(--font-mono)', fontSize: '13px', color,
      transition: 'background 0.15s, border-color 0.15s',
    }}>
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: color, flexShrink: 0 }} />
      <span style={{ marginRight: '2px' }}>{name}</span>
      <button
        onClick={(e) => { e.stopPropagation(); onEdit(); }}
        title="Bearbeiten"
        style={{
          width: 22, height: 22, borderRadius: 'var(--radius-sm)',
          border: 'none', background: 'rgba(255,255,255,0.06)',
          color: 'var(--text-3)', cursor: 'pointer',
          display: 'grid', placeItems: 'center', flexShrink: 0,
        }}
      >
        <Pencil size={11} />
      </button>
      <button
        onClick={(e) => { e.stopPropagation(); onDelete(); }}
        title="Löschen"
        style={{
          width: 22, height: 22, borderRadius: 'var(--radius-sm)',
          border: 'none', background: 'color-mix(in srgb, var(--error) 12%, transparent)',
          color: 'var(--error)', cursor: 'pointer',
          display: 'grid', placeItems: 'center', flexShrink: 0,
        }}
      >
        <X size={11} />
      </button>
    </span>
  );
}
