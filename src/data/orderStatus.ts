import type { OrderStatus, OrderStep } from '../types/orders';

export const orderStatusLabels: Record<OrderStatus, string> = {
  open: 'Offen',
  sawn: 'Fertig gesägt',
  machining_done: 'Fertig bearbeitet',
  ready_for_shipping: 'Versandfertig',
};

export const orderStepLabels: Record<Exclude<OrderStep, null>, string> = {
  sawing: 'Sägen',
  machining: 'Bearbeitung',
  packing: 'Verpackung',
};

export const orderStatusColors: Record<OrderStatus, string> = {
  open: '#6b7280',
  sawn: '#60a5fa',
  machining_done: '#a78bfa',
  ready_for_shipping: '#22c55e',
};

const nextStatusMap: Record<OrderStatus, OrderStatus | null> = {
  open: 'sawn',
  sawn: 'machining_done',
  machining_done: 'ready_for_shipping',
  ready_for_shipping: null,
};

const nextStepMap: Record<OrderStatus, OrderStep> = {
  open: 'machining',
  sawn: 'packing',
  machining_done: null,
  ready_for_shipping: null,
};

const advanceButtonLabels: Record<OrderStatus, string | null> = {
  open: 'Sägen abschließen',
  sawn: 'Bearbeitung abschließen',
  machining_done: 'Verpackung abschließen',
  ready_for_shipping: null,
};

export function isOrderAdvanceable(status: OrderStatus): boolean {
  return nextStatusMap[status] !== null;
}

export function getNextStatus(status: OrderStatus): OrderStatus | null {
  return nextStatusMap[status];
}

export function getNextStep(status: OrderStatus): OrderStep {
  return nextStepMap[status];
}

export function getAdvanceButtonLabel(status: OrderStatus): string | null {
  return advanceButtonLabels[status];
}
