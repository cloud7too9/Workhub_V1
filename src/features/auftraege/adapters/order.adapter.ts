import type { Order, OrderStatus } from '@/types/orders';
import type { Werkstueck } from '@/types/workpieces';
import type { Material } from '@/types/materials';
import type { Bearbeiter } from '@/types/bearbeiter';
import {
  orderStatusLabels, orderStatusColors, orderStepLabels,
  isOrderAdvanceable, getAdvanceButtonLabel,
} from '@/data/orderStatus';
import { arbeitsgangPhaseLabels } from '@/types/workpieces';
import { hallStations } from '@/data/hallConfig';
import type {
  OrderCardData, OrderSummary, DeleteTarget, StatusOption, OrderFormInitial,
  HallOrderChipData, HallStationData, AuftragArbeitsgangUI,
} from '../types/ui.types';

export interface OrderContext {
  workpieces: Werkstueck[];
  materials: Material[];
  bearbeiter: Bearbeiter[];
}

function getWorkpiece(order: Order, ctx: OrderContext): Werkstueck | undefined {
  return ctx.workpieces.find((w) => w.id === order.workpieceId);
}

function getMaterialName(wp: Werkstueck | undefined, ctx: OrderContext): string {
  if (!wp) return '';
  return ctx.materials.find((m) => m.id === wp.materialId)?.name ?? '';
}

function getBearbeiterName(id: string | undefined, ctx: OrderContext): string | undefined {
  if (!id) return undefined;
  return ctx.bearbeiter.find((b) => b.id === id)?.name;
}

function mapArbeitsgaenge(order: Order, ctx: OrderContext): AuftragArbeitsgangUI[] {
  return order.arbeitsgaenge
    .slice()
    .sort((a, b) => a.sequence - b.sequence)
    .map((a) => ({
      id: a.id,
      name: a.name,
      phase: a.phase,
      phaseLabel: arbeitsgangPhaseLabels[a.phase],
      done: a.done,
      bearbeiterName: getBearbeiterName(a.bearbeiterId, ctx),
      completedLabel: a.completedAt
        ? new Date(a.completedAt).toLocaleDateString('de-DE')
        : undefined,
    }));
}

// ── Card Mapping ──

export function mapOrderToCard(order: Order, ctx: OrderContext): OrderCardData {
  const wp = getWorkpiece(order, ctx);
  const materialName = getMaterialName(wp, ctx);
  const statusColor = orderStatusColors[order.status];
  const deliveryDate = new Date(order.deliveryDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const daysUntil = Math.ceil((deliveryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  const isUrgent = daysUntil <= 3 && order.status !== 'ready_for_shipping';

  const subtitle = [
    wp?.bezeichnung,
    materialName,
    wp?.fertigmass,
    `${order.quantity} Stk`,
    deliveryDate.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit' }),
  ]
    .filter(Boolean)
    .join(' · ');

  const bearbeiterName = getBearbeiterName(order.bearbeiterId, ctx);

  const details: { label: string; value: string }[] = [];
  if (wp) details.push({ label: 'Werkstück', value: wp.bezeichnung });
  if (materialName) details.push({ label: 'Werkstoff', value: materialName });
  if (wp?.fertigmass) details.push({ label: 'Fertigmaß', value: wp.fertigmass });
  if (wp?.saegemass) details.push({ label: 'Sägemaß', value: wp.saegemass });
  details.push({ label: 'Bestellt', value: `${order.quantity} Stk` });
  if (order.processedQuantity > 0) {
    details.push({ label: 'Bearbeitet', value: `${order.processedQuantity} Stk` });
  }
  if (order.customer) details.push({ label: 'Kunde', value: order.customer });
  if (order.orderNumber) details.push({ label: 'Bestellnr.', value: order.orderNumber });
  if (order.orderDate) {
    details.push({ label: 'Bestelldatum', value: new Date(order.orderDate).toLocaleDateString('de-DE') });
  }
  details.push({ label: 'Lieferdatum', value: deliveryDate.toLocaleDateString('de-DE') });
  if (order.completionDate) {
    details.push({ label: 'Fertig am', value: new Date(order.completionDate).toLocaleDateString('de-DE') });
  }
  if (bearbeiterName) details.push({ label: 'Bearbeiter', value: bearbeiterName });
  if (order.currentStep) details.push({ label: 'Nächster Schritt', value: orderStepLabels[order.currentStep] });
  if (order.notes) details.push({ label: 'Notizen', value: order.notes });
  details.push({ label: 'Erstellt', value: new Date(order.createdAt).toLocaleString('de-DE') });

  const advanceLabel = getAdvanceButtonLabel(order.status);
  const canAdvance = isOrderAdvanceable(order.status);

  return {
    id: order.id,
    title: order.article || wp?.bezeichnung || '—',
    statusLabel: orderStatusLabels[order.status],
    statusColor,
    subtitle,
    urgencyBadge: isUrgent ? { label: daysUntil <= 0 ? 'Überfällig' : `${daysUntil}d` } : undefined,
    advanceAction: canAdvance && advanceLabel ? { label: advanceLabel, color: statusColor } : undefined,
    details,
    arbeitsgaenge: mapArbeitsgaenge(order, ctx),
  };
}

// ── Summary ──

export function mapOrdersToSummary(orders: Order[]): OrderSummary {
  return {
    total: orders.length,
    openCount: orders.filter((o) => o.status === 'open').length,
  };
}

// ── Delete Target ──

export function mapOrderToDeleteTarget(order: Order, ctx: OrderContext): DeleteTarget {
  const wp = getWorkpiece(order, ctx);
  return { id: order.id, label: order.article || wp?.bezeichnung || order.id };
}

// ── Form Initial ──

export function mapOrderToFormInitial(order: Order): OrderFormInitial {
  return {
    workpieceId: order.workpieceId,
    article: order.article,
    quantity: order.quantity,
    processedQuantity: order.processedQuantity,
    deliveryDate: order.deliveryDate,
    orderDate: order.orderDate ? order.orderDate.slice(0, 10) : '',
    orderNumber: order.orderNumber,
    customer: order.customer,
    notes: order.notes,
    bearbeiterId: order.bearbeiterId ?? '',
  };
}

// ── Hall View Mapping ──

function mapOrderToChip(order: Order, ctx: OrderContext): HallOrderChipData {
  const wp = getWorkpiece(order, ctx);
  const materialName = getMaterialName(wp, ctx);
  const statusColor = orderStatusColors[order.status];
  const deliveryDate = new Date(order.deliveryDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const daysUntil = Math.ceil((deliveryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  const isUrgent = daysUntil <= 3 && order.status !== 'ready_for_shipping';

  const subtitle = [wp?.bezeichnung, materialName, wp?.fertigmass, `${order.quantity} Stk`]
    .filter(Boolean)
    .join(' · ');

  const details: { label: string; value: string }[] = [];
  if (wp) details.push({ label: 'Werkstück', value: wp.bezeichnung });
  if (materialName) details.push({ label: 'Werkstoff', value: materialName });
  if (wp?.fertigmass) details.push({ label: 'Fertigmaß', value: wp.fertigmass });
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
    title: order.article || wp?.bezeichnung || '—',
    subtitle,
    deliveryDate: deliveryDate.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit' }),
    urgencyBadge: isUrgent ? { label: daysUntil <= 0 ? 'Überfällig' : `${daysUntil}d` } : undefined,
    statusLabel: orderStatusLabels[order.status],
    statusColor,
    advanceAction: canAdvance && advanceLabel ? { label: advanceLabel, color: statusColor } : undefined,
    details,
  };
}

export function mapOrdersToStations(orders: Order[], ctx: OrderContext): HallStationData[] {
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
    orders: (grouped.get(config.status) ?? []).map((o) => mapOrderToChip(o, ctx)),
  }));
}

// ── Filter Options ──

export function getStatusOptions(): StatusOption[] {
  return (Object.entries(orderStatusLabels) as [StatusOption['value'], string][]).map(
    ([value, label]) => ({ value, label }),
  );
}
