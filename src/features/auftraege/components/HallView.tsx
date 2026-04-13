import { useState } from 'react';
import { Toggle } from '@/ui';
import { hallGrid, hallZones } from '@/data/hallConfig';
import type { HallStationData } from '../types/ui.types';
import { HallZone } from './HallZone';

interface HallViewProps {
  stations: HallStationData[];
  onAdvance: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

function getGridOverlayStyle(columns: number, rows: number): React.CSSProperties {
  const colSize = `calc(100% / ${columns})`;
  const rowSize = `calc(100% / ${rows})`;
  return {
    position: 'absolute',
    inset: 0,
    pointerEvents: 'none',
    backgroundImage: [
      `repeating-linear-gradient(90deg, var(--border-subtle) 0px, var(--border-subtle) 1px, transparent 1px, transparent ${colSize})`,
      `repeating-linear-gradient(0deg, var(--border-subtle) 0px, var(--border-subtle) 1px, transparent 1px, transparent ${rowSize})`,
    ].join(', '),
    borderRadius: 'var(--radius-lg)',
    zIndex: 1,
    transition: 'opacity 0.25s ease',
  };
}

export function HallView({ stations, onAdvance, onEdit, onDelete }: HallViewProps) {
  const [showGrid, setShowGrid] = useState(true);

  // Group stations by zone
  const stationsByZone = new Map<string, HallStationData[]>();
  for (const station of stations) {
    const list = stationsByZone.get(station.zoneId) ?? [];
    list.push(station);
    stationsByZone.set(station.zoneId, list);
  }

  return (
    <div>
      {/* Toolbar */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'flex-end',
        marginBottom: 'var(--sp-sm)',
      }}>
        <Toggle checked={showGrid} onChange={setShowGrid} label="Raster" />
      </div>

      {/* Hall Container */}
      <div style={{
        position: 'relative',
        display: 'grid',
        gridTemplateColumns: `repeat(${hallGrid.columns}, 1fr)`,
        gridTemplateRows: `repeat(${hallGrid.rows}, 1fr)`,
        gap: '2px',
        background: 'var(--bg)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)',
        padding: '2px',
        aspectRatio: `${hallGrid.columns} / ${hallGrid.rows}`,
        overflow: 'hidden',
      }}>
        {/* Grid Overlay */}
        {showGrid && (
          <div style={getGridOverlayStyle(hallGrid.columns, hallGrid.rows)} />
        )}

        {/* Zones */}
        {hallZones.map((zone) => (
          <HallZone
            key={zone.id}
            zone={zone}
            stations={stationsByZone.get(zone.id) ?? []}
            onAdvance={onAdvance}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </div>
    </div>
  );
}
