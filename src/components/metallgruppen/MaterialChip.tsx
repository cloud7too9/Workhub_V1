import { tokens } from '../../styles/tokens';

interface MaterialChipProps {
  name: string;
  color: string;
  onEdit: () => void;
  onDelete: () => void;
}

export function MaterialChip({ name, color, onEdit, onDelete }: MaterialChipProps) {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        padding: '6px 10px',
        borderRadius: 8,
        background: `${color}12`,
        border: `1px solid ${color}30`,
        fontFamily: tokens.font.mono,
        fontSize: 13,
        color,
        cursor: 'default',
        transition: 'background 0.15s, border-color 0.15s',
      }}
    >
      <span
        style={{
          width: 6,
          height: 6,
          borderRadius: '50%',
          background: color,
          flexShrink: 0,
        }}
      />
      <span style={{ marginRight: 2 }}>{name}</span>

      {/* Edit */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onEdit();
        }}
        title="Bearbeiten"
        style={{
          width: 22,
          height: 22,
          borderRadius: 6,
          border: 'none',
          background: 'rgba(255,255,255,0.06)',
          color: tokens.muted,
          fontSize: 11,
          cursor: 'pointer',
          display: 'grid',
          placeItems: 'center',
          flexShrink: 0,
        }}
      >
        ✎
      </button>

      {/* Delete */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete();
        }}
        title="Löschen"
        style={{
          width: 22,
          height: 22,
          borderRadius: 6,
          border: 'none',
          background: `${tokens.danger}18`,
          color: tokens.danger,
          fontSize: 10,
          cursor: 'pointer',
          display: 'grid',
          placeItems: 'center',
          flexShrink: 0,
        }}
      >
        ✕
      </button>
    </span>
  );
}
