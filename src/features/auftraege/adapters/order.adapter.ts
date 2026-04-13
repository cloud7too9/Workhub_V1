import type { Order, OrderStatus } from '@/types/orders';
import {
  orderStatusLabels, orderStatusColors, orderStepLabels,
  isOrderAdvanceable, getAdvanceButtonLabel,
} from '@/data/orderStatus';
import { hallStations } from '@/data/hallConfig';
import type {
  OrderCardData, OrderSummary, DeleteTarget, StatusOption, OrderFormInitial,
  HallOrderChipData, HallStationData,
} from '../types/ui.types';

// ── Card Mapping ──

export function mapOrderToCard(order: Order): OrderCardData {
  const statusColor = orderStatusColors[order.status];
  const deliveryDate = new Date(order.deliveryDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const daysUntil = Math.ceil((deliveryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  const isUrgent = daysUntil <= 3 && order.status !== 'ready_for_shipping';

  const subtitle = [
    order.material,
    order.dimensions,
    `${order.quantity} Stk`,
    deliveryDate.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit' }),
  ].join(' · ');

  const details: { label: string; value: string }[] = [];
  if (order.customer) details.push({ label: 'Kunde', value: order.customer });
  if (order.orderNumber) details.push({ label: 'Bestellnr.', value: order.orderNumber });
  details.push({ label: 'Lieferdatum', value: deliveryDate.toLocaleDateString('de-DE') });
  if (order.currentStep) details.push({ label: 'Nächster Schritt', value: orderStepLabels[order.currentStep] });
  if (order.notes) details.push({ label: 'Notizen', value: order.notes });
  details.push({ label: 'Erstellt', value: new Date(order.createdAt).toLocaleString('de-DE') });

  const advanceLabel = getAdvanceButtonLabel(order.status);
  const canAdvance = isOrderAdvanceable(order.status);

  return {
    id: order.id,
    title: order.article,
    statusLabel: orderStatusLabels[order.status],
    statusColor,
    subtitle,
    urgencyBadge: isUrgent ? { label: daysUntil <= 0 ? 'Überfällig' : `${daysUntil}d` } : undefined,
    advanceAction: canAdvance && advanceLabel ? { label: advanceLabel, color: statusColor } : undefined,
    details,
  };
}

// ── Summary ──

export function mapOrdersToSummary(orders: Order[]): OrderSummary {
  return {
    total: orders.length,
    openCount: orders.filter(o => o.status === 'open').length,
  };
}

// ── Delete Target ──

export function mapOrderToDeleteTarget(order: Order): DeleteTarget {
  return { id: order.id, label: order.article };
}

// ── Form Initial ──

export function mapOrderToFormInitial(order: Order): OrderFormInitial {
  return {
    article: order.article,
    material: order.material,
    dimensions: order.dimensions,
    quantity: order.quantity,
    deliveryDate: order.deliveryDate,
    orderNumber: order.orderNumber,
    customer: order.customer,
    notes: order.notes,
  };
}

// ── Hall View Mapping ──

function mapOrderToChip(order: Order): HallOrderChipData {
  const statusColor = orderStatusColors[order.status];
  const deliveryDate = new Date(order.deliveryDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const daysUntil = Math.ceil((deliveryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  const isUrgent = daysUntil <= 3 && order.status !== 'ready_for_shipping';

  const subtitle = [
    order.material,
    order.dimensions,
    `${order.quantity} Stk`,
  ].join(' · ');

  const details: { label: string; value: string }[] = [];
  if (order.customer) details.push({ label: 'Kunde', value: order.customer });
  if (order.orderNumber) details.push({ label: 'Bestellnr.', value: order.orderNumber });
  details.push({ label: 'Lieferdatum', value: deliveryDate.toLocaleDateString('de-DE') });
  if (order.currentStep) details.push({ label: 'Nächster Schritt', value: orderStepLabels[order.currentStep] });
  if (order.notes) details.push({ label: 'Notizen', value: order.notes });
  details.push({ label: 'Erstellt', value: new Date(order.createdAt).toLocaleString('de-DE') });

  const advanceLabel = getAdvanceButtonLabel(order.status);
  const canAdvance = isOrderAdvanceable(order.status);

  return {
    id: order.id,
    title: order.article,
    subtitle,
    deliveryDate: deliveryDate.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit' }),
    urgencyBadge: isUrgent ? { label: daysUntil <= 0 ? 'Überfällig' : `${daysUntil}d` } : undefined,
    statusLabel: orderStatusLabels[order.status],
    statusColor,
    advanceAction: canAdvance && advanceLabel ? { label: advanceLabel, color: statusColor } : undefined,
    details,
  };
}

export function mapOrdersToStations(orders: Order[]): HallStationData[] {
  const grouped = new Map<OrderStatus, Order[]>();
  for (const order of orders) {
    const list = grouped.get(order.status) ?? [];
    list.push(order);
    grouped.set(order.status, list);
  }

  return hallStations.map((config) => ({
    id: config.status,
    label: orderStatusLabels[config.status],
    color: orderStatusColors[config.status],
    zoneId: config.zoneId,
    count: grouped.get(config.status)?.length ?? 0,
    orders: (grouped.get(config.status) ?? []).map(mapOrderToChip),
  }));
}

// ── Filter Options ──

export function getStatusOptions(): StatusOption[] {
  return (Object.entries(orderStatusLabels) as [StatusOption['value'], string][]).map(
    ([value, label]) => ({ value, label }),
  );
}
