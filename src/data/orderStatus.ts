import type { OrderStatus } from '../types/orders';

export const orderStatusLabels: Record<OrderStatus, string> = {
  open: 'Offen',
  in_progress: 'In Bearbeitung',
  done: 'Erledigt',
};

export const orderStatusColors: Record<OrderStatus, string> = {
  open: '#6b7280',
  in_progress: '#60a5fa',
  done: '#22c55e',
};

/** Nächster Status im vereinfachten Workflow */
const nextStatusMap: Record<OrderStatus, OrderStatus | null> = {
  open: 'in_progress',
  in_progress: 'done',
  done: null,
};

const advanceButtonLabels: Record<OrderStatus, string | null> = {
  open: 'Starten',
  in_progress: 'Erledigt',
  done: null,
};

export function isOrderAdvanceable(status: OrderStatus): boolean {
  return nextStatusMap[status] !== null;
}

export function getNextStatus(status: OrderStatus): OrderStatus | null {
  return nextStatusMap[status];
}

export function getAdvanceButtonLabel(status: OrderStatus): string | null {
  return advanceButtonLabels[status];
}
