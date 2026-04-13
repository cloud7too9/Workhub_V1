import type { HallZoneConfig } from '@/data/hallConfig';

interface HallZoneProps {
  zone: HallZoneConfig;
}

export function HallZone({ zone }: HallZoneProps) {
  return (
    <div style={{
      gridColumn: `${zone.column[0]} / ${zone.column[1] + 1}`,
      gridRow: `${zone.row[0]} / ${zone.row[1] + 1}`,
      background: zone.color,
      borderRadius: 'var(--radius-md)',
      border: '1px solid var(--border-subtle)',
      padding: '8px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
      position: 'relative',
    }}>
      {/* Zone Label (centered) */}
      <span style={{
        fontSize: '13px',
        fontWeight: 700,
        color: 'var(--text-3)',
        textTransform: 'uppercase',
        letterSpacing: '0.08em',
        opacity: 0.6,
        userSelect: 'none',
      }}>
        {zone.label}
      </span>
    </div>
  );
}
