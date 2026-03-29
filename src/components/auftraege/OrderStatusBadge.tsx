import type { OrderStatus } from '../../types/orders';
import { orderStatusLabels, orderStatusColors } from '../../data/orderStatus';

interface OrderStatusBadgeProps {
  status: OrderStatus;
}

export function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
  const color = orderStatusColors[status];
  return (
    <span
      style={{
        fontSize: 11,
        fontWeight: 700,
        color,
        background: `${color}18`,
        border: `1px solid ${color}30`,
        padding: '3px 10px',
        borderRadius: 6,
        whiteSpace: 'nowrap',
      }}
    >
      {orderStatusLabels[status]}
    </span>
  );
}
