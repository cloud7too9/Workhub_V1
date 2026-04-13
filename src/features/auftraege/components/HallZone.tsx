import type { HallZoneConfig } from '@/data/hallConfig';
import type { HallStationData } from '../types/ui.types';
import { HallStation } from './HallStation';

interface HallZoneProps {
  zone: HallZoneConfig;
  stations: HallStationData[];
  onAdvance: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export function HallZone({ zone, stations, onAdvance, onEdit, onDelete }: HallZoneProps) {
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
      gap: '8px',
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

      {/* Stations within this zone */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', flex: 1, overflowY: 'auto' }}>
        {stations.map((station) => (
          <HallStation
            key={station.id}
            {...station}
            onAdvance={onAdvance}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </div>
    </div>
  );
}
