import type {
  Order,
  OrderHistoryEntry,
  OrderStatusFilter,
  OrderSortMode,
  AuftragArbeitsgang,
} from '../types/orders';
import type { Werkstueck } from '../types/workpieces';
import { getNextStatus, getNextStep } from '../data/orderStatus';
import {
  createWorkpiece,
  type CreateWorkpieceInput,
} from './workpieceStorage';

const STOR_ORDERS = 'workhub_orders';
const STOR_HISTORY = 'workhub_order_history';
const STOR_MIGRATED = 'workhub_orders_migrated_v2';

let _id = Date.now();
function uid(prefix: string) {
  return `${prefix}_${_id++}`;
}

function now() {
  return new Date().toISOString();
}

// ── Persistence ──

export function loadOrders(): Order[] {
  try {
    return JSON.parse(localStorage.getItem(STOR_ORDERS) ?? '[]') as Order[];
  } catch {
    return [];
  }
}

export function saveOrders(orders: Order[]): void {
  localStorage.setItem(STOR_ORDERS, JSON.stringify(orders));
}

export function loadOrderHistory(): OrderHistoryEntry[] {
  try {
    return JSON.parse(localStorage.getItem(STOR_HISTORY) ?? '[]') as OrderHistoryEntry[];
  } catch {
    return [];
  }
}

export function saveOrderHistory(entries: OrderHistoryEntry[]): void {
  localStorage.setItem(STOR_HISTORY, JSON.stringify(entries));
}

// ── CRUD ──

export interface CreateOrderInput {
  workpieceId: string;
  article: string;
  quantity: number;
  deliveryDate: string;
  orderDate?: string;
  orderNumber?: string;
  customer?: string;
  notes?: string;
  bearbeiterId?: string;
  processedQuantity?: number;
}

export function createOrder(
  orders: Order[],
  workpieces: Werkstueck[],
  input: CreateOrderInput,
): {
  orders: Order[];
  order: Order;
  historyEntry: OrderHistoryEntry;
} {
  const ts = now();
  const workpiece = workpieces.find((w) => w.id === input.workpieceId);

  const arbeitsgaenge: AuftragArbeitsgang[] = (workpiece?.arbeitsgaenge ?? []).map((a) => ({
    id: uid('aag'),
    name: a.name,
    phase: a.phase,
    sequence: a.sequence,
    description: a.description,
    done: false,
  }));

  const order: Order = {
    id: uid('ord'),
    workpieceId: input.workpieceId,
    article: input.article.trim(),
    orderNumber: input.orderNumber?.trim() ?? '',
    orderDate: input.orderDate ?? ts,
    customer: input.customer?.trim() ?? '',
    quantity: input.quantity,
    processedQuantity: input.processedQuantity ?? 0,
    deliveryDate: input.deliveryDate,
    notes: input.notes?.trim() ?? '',
    arbeitsgaenge,
    bearbeiterId: input.bearbeiterId,
    status: 'open',
    currentStep: 'sawing',
    createdAt: ts,
    updatedAt: ts,
  };

  const historyEntry: OrderHistoryEntry = {
    id: uid('ohe'),
    orderId: order.id,
    timestamp: ts,
    action: 'Auftrag erstellt',
    oldValue: '',
    newValue: order.article,
  };

  return {
    orders: [...orders, order],
    order,
    historyEntry,
  };
}

export function updateOrder(
  orders: Order[],
  workpieces: Werkstueck[],
  id: string,
  input: Partial<CreateOrderInput>,
): { orders: Order[]; historyEntry: OrderHistoryEntry } | null {
  const existing = orders.find((o) => o.id === id);
  if (!existing) return null;

  const ts = now();

  // If workpiece changed, rebuild arbeitsgaenge from the new workpiece template.
  let arbeitsgaenge = existing.arbeitsgaenge;
  if (input.workpieceId && input.workpieceId !== existing.workpieceId) {
    const wp = workpieces.find((w) => w.id === input.workpieceId);
    arbeitsgaenge = (wp?.arbeitsgaenge ?? []).map((a) => ({
      id: uid('aag'),
      name: a.name,
      phase: a.phase,
      sequence: a.sequence,
      description: a.description,
      done: false,
    }));
  }

  const updated: Order = {
    ...existing,
    workpieceId: input.workpieceId ?? existing.workpieceId,
    article: input.article?.trim() ?? existing.article,
    orderNumber: input.orderNumber?.trim() ?? existing.orderNumber,
    orderDate: input.orderDate ?? existing.orderDate,
    customer: input.customer?.trim() ?? existing.customer,
    quantity: input.quantity ?? existing.quantity,
    processedQuantity: input.processedQuantity ?? existing.processedQuantity,
    deliveryDate: input.deliveryDate ?? existing.deliveryDate,
    notes: input.notes?.trim() ?? existing.notes,
    bearbeiterId:
      input.bearbeiterId !== undefined ? input.bearbeiterId || undefined : existing.bearbeiterId,
    arbeitsgaenge,
    updatedAt: ts,
  };

  const historyEntry: OrderHistoryEntry = {
    id: uid('ohe'),
    orderId: id,
    timestamp: ts,
    action: 'Auftrag bearbeitet',
    oldValue: existing.article,
    newValue: updated.article,
  };

  return {
    orders: orders.map((o) => (o.id === id ? updated : o)),
    historyEntry,
  };
}

export function deleteOrder(
  orders: Order[],
  id: string,
): { orders: Order[]; historyEntry: OrderHistoryEntry } | null {
  const existing = orders.find((o) => o.id === id);
  if (!existing) return null;

  const historyEntry: OrderHistoryEntry = {
    id: uid('ohe'),
    orderId: id,
    timestamp: now(),
    action: 'Auftrag gelöscht',
    oldValue: existing.article,
    newValue: '',
  };

  return {
    orders: orders.filter((o) => o.id !== id),
    historyEntry,
  };
}

export function advanceOrderStatus(
  orders: Order[],
  id: string,
): { orders: Order[]; historyEntry: OrderHistoryEntry } | null {
  const existing = orders.find((o) => o.id === id);
  if (!existing) return null;

  const nextStatus = getNextStatus(existing.status);
  if (!nextStatus) return null;

  const nextStep = getNextStep(existing.status);
  const ts = now();

  const updated: Order = {
    ...existing,
    status: nextStatus,
    currentStep: nextStep,
    completionDate:
      nextStatus === 'ready_for_shipping' ? (existing.completionDate ?? ts) : existing.completionDate,
    updatedAt: ts,
  };

  const historyEntry: OrderHistoryEntry = {
    id: uid('ohe'),
    orderId: id,
    timestamp: ts,
    action: 'Status geändert',
    oldValue: existing.status,
    newValue: nextStatus,
  };

  return {
    orders: orders.map((o) => (o.id === id ? updated : o)),
    historyEntry,
  };
}

export function toggleArbeitsgangDone(
  orders: Order[],
  orderId: string,
  arbeitsgangId: string,
  bearbeiterId?: string,
): { orders: Order[]; historyEntry: OrderHistoryEntry } | null {
  const existing = orders.find((o) => o.id === orderId);
  if (!existing) return null;

  const ag = existing.arbeitsgaenge.find((a) => a.id === arbeitsgangId);
  if (!ag) return null;

  const ts = now();
  const done = !ag.done;

  const updated: Order = {
    ...existing,
    arbeitsgaenge: existing.arbeitsgaenge.map((a) =>
      a.id === arbeitsgangId
        ? {
            ...a,
            done,
            bearbeiterId: done ? bearbeiterId ?? existing.bearbeiterId : a.bearbeiterId,
            completedAt: done ? ts : undefined,
          }
        : a,
    ),
    updatedAt: ts,
  };

  const historyEntry: OrderHistoryEntry = {
    id: uid('ohe'),
    orderId,
    timestamp: ts,
    action: done ? 'Arbeitsgang erledigt' : 'Arbeitsgang zurückgesetzt',
    oldValue: ag.name,
    newValue: done ? 'erledigt' : 'offen',
  };

  return {
    orders: orders.map((o) => (o.id === orderId ? updated : o)),
    historyEntry,
  };
}

// ── Migration: Legacy orders (pre-workpiece) → new schema ──

interface LegacyOrder {
  id: string;
  article: string;
  orderNumber?: string;
  customer?: string;
  material?: string;
  dimensions?: string;
  quantity: number;
  deliveryDate: string;
  notes?: string;
  status: Order['status'];
  currentStep: Order['currentStep'];
  createdAt: string;
  updatedAt: string;
}

export interface MigrationResult {
  orders: Order[];
  workpieces: Werkstueck[];
  migratedCount: number;
}

/**
 * Migrates pre-workpiece orders: for each unique (article|material|dimensions) combo
 * a Werkstueck is auto-created and linked via workpieceId.
 */
export function migrateLegacyOrders(
  rawOrders: unknown[],
  existingWorkpieces: Werkstueck[],
): MigrationResult {
  let workpieces = existingWorkpieces;
  const seen = new Map<string, string>(); // key -> workpieceId

  const migrated = rawOrders.map((raw): Order => {
    const candidate = raw as Partial<Order> & Partial<LegacyOrder>;
    if (candidate.workpieceId) {
      // Already new schema; fill missing new fields with sensible defaults.
      return {
        ...(candidate as Order),
        orderDate: candidate.orderDate ?? candidate.createdAt ?? now(),
        processedQuantity: candidate.processedQuantity ?? 0,
        arbeitsgaenge: candidate.arbeitsgaenge ?? [],
        notes: candidate.notes ?? '',
        orderNumber: candidate.orderNumber ?? '',
        customer: candidate.customer ?? '',
      };
    }

    const legacy = raw as LegacyOrder;
    const article = legacy.article?.trim() ?? '';
    const material = legacy.material?.trim() ?? '';
    const dimensions = legacy.dimensions?.trim() ?? '';
    const key = `${article}|${material}|${dimensions}`;

    let workpieceId = seen.get(key);
    if (!workpieceId) {
      const wpInput: CreateWorkpieceInput = {
        bezeichnung: article || 'Unbenannt',
        materialId: '',
        rohmaterialTyp: 'rundstange',
        fertigmass: dimensions,
        saegemass: dimensions,
        arbeitsgaenge: [],
      };
      const result = createWorkpiece(workpieces, wpInput);
      workpieces = result.workpieces;
      workpieceId = result.workpiece.id;
      seen.set(key, workpieceId);
    }

    return {
      id: legacy.id,
      workpieceId,
      article,
      orderNumber: legacy.orderNumber ?? '',
      orderDate: legacy.createdAt,
      customer: legacy.customer ?? '',
      quantity: legacy.quantity,
      processedQuantity: 0,
      deliveryDate: legacy.deliveryDate,
      notes: legacy.notes ?? '',
      arbeitsgaenge: [],
      status: legacy.status,
      currentStep: legacy.currentStep,
      createdAt: legacy.createdAt,
      updatedAt: legacy.updatedAt,
    };
  });

  return { orders: migrated, workpieces, migratedCount: seen.size };
}

export function isMigrated(): boolean {
  return localStorage.getItem(STOR_MIGRATED) === '1';
}

export function markMigrated(): void {
  localStorage.setItem(STOR_MIGRATED, '1');
}

// ── Filtering & Sorting ──

export function applyOrderView(
  orders: Order[],
  options: {
    statusFilter: OrderStatusFilter;
    searchTerm?: string;
    sortMode: OrderSortMode;
  },
): Order[] {
  let result = orders;

  if (options.statusFilter !== 'all') {
    result = result.filter((o) => o.status === options.statusFilter);
  }

  const term = options.searchTerm?.trim().toLowerCase();
  if (term) {
    result = result.filter((o) =>
      [o.article, o.customer, o.orderNumber].some((f) =>
        f?.toLowerCase().includes(term),
      ),
    );
  }

  const sorted = [...result];
  switch (options.sortMode) {
    case 'deliveryDateAsc':
      sorted.sort((a, b) => a.deliveryDate.localeCompare(b.deliveryDate));
      break;
    case 'deliveryDateDesc':
      sorted.sort((a, b) => b.deliveryDate.localeCompare(a.deliveryDate));
      break;
    case 'updatedAtDesc':
      sorted.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
      break;
  }

  return sorted;
}
