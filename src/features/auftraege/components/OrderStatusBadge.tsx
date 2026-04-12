import type { OrderStatus } from '@/types/orders';
import { orderStatusLabels, orderStatusColors } from '@/data/orderStatus';

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  const color = orderStatusColors[status];
  return (
    <span style={{
      fontSize: '11px', fontWeight: 700, color,
      background: `${color}18`, border: `1px solid ${color}30`,
      padding: '3px 10px', borderRadius: '6px', whiteSpace: 'nowrap',
    }}>
      {orderStatusLabels[status]}
    </span>
  );
}
