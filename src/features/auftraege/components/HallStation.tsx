import type { HallStationData } from '../types/ui.types';
import { HallOrderChip } from './HallOrderChip';

interface HallStationProps extends HallStationData {
  onAdvance: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export function HallStation({
  label, color, count, orders,
  onAdvance, onEdit, onDelete,
}: HallStationProps) {
  return (
    <div style={{
      borderLeft: `3px solid ${color}`,
      borderRadius: 'var(--radius-md)',
      background: 'rgba(0,0,0,0.25)',
      padding: '10px',
      minHeight: '60px',
    }}>
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        marginBottom: orders.length > 0 ? '8px' : 0,
      }}>
        <span style={{ fontSize: '11px', fontWeight: 700, color: color, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
          {label}
        </span>
        <span style={{ fontSize: '10px', color: 'var(--text-3)', fontWeight: 600 }}>
          {count}
        </span>
      </div>

      {orders.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {orders.map((order) => (
            <HallOrderChip
              key={order.id}
              {...order}
              onAdvance={() => onAdvance(order.id)}
              onEdit={() => onEdit(order.id)}
              onDelete={() => onDelete(order.id)}
            />
          ))}
        </div>
      )}

      {orders.length === 0 && (
        <p style={{ fontSize: '10px', color: 'var(--text-3)', fontStyle: 'italic' }}>
          Keine Aufträge
        </p>
      )}
    </div>
  );
}
