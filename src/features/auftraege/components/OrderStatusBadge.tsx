import type { OrderStatusBadgeProps } from '../types/ui.types';

export function OrderStatusBadge({ label, color }: OrderStatusBadgeProps) {
  return (
    <span style={{
      fontSize: '11px', fontWeight: 700, color,
      background: `${color}18`, border: `1px solid ${color}30`,
      padding: '3px 10px', borderRadius: '6px', whiteSpace: 'nowrap',
    }}>
      {label}
    </span>
  );
}
