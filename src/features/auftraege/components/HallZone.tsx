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
      padding: '10px',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      position: 'relative',
    }}>
      {/* Zone Label */}
      <span style={{
        fontSize: '10px',
        fontWeight: 700,
        color: 'var(--text-3)',
        textTransform: 'uppercase',
        letterSpacing: '0.06em',
      }}>
        {zone.label}
      </span>
    </div>
  );
}
