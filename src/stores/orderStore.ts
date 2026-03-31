import type { Order, OrderHistoryEntry, OrderStatusFilter, OrderSortMode, OrderImportMeta } from '../types/orders';
import { getNextStatus, getNextStep } from '../data/orderStatus';
import { uid as _uid } from '../utils/uid';

const STOR_ORDERS = 'workhub_orders';
const STOR_HISTORY = 'workhub_order_history';

function uid() {
  return _uid('ord');
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
  article: string;
  material: string;
  dimensions: string;
  quantity: number;
  deliveryDate: string;
  orderNumber?: string;
  customer?: string;
  notes?: string;
  importMeta?: OrderImportMeta;
}

export function createOrder(orders: Order[], input: CreateOrderInput): {
  orders: Order[];
  order: Order;
  historyEntry: OrderHistoryEntry;
} {
  const ts = now();
  const order: Order = {
    id: uid(),
    article: input.article.trim(),
    orderNumber: input.orderNumber?.trim() ?? '',
    customer: input.customer?.trim() ?? '',
    material: input.material.trim(),
    dimensions: input.dimensions.trim(),
    quantity: input.quantity,
    deliveryDate: input.deliveryDate,
    notes: input.notes?.trim() ?? '',
    status: 'open',
    currentStep: 'sawing',
    createdAt: ts,
    updatedAt: ts,
    ...(input.importMeta ? { importMeta: input.importMeta } : {}),
  };

  const historyEntry: OrderHistoryEntry = {
    id: uid(),
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
  id: string,
  input: Partial<CreateOrderInput>,
): { orders: Order[]; historyEntry: OrderHistoryEntry } | null {
  const existing = orders.find((o) => o.id === id);
  if (!existing) return null;

  const ts = now();
  const updated: Order = {
    ...existing,
    article: input.article?.trim() ?? existing.article,
    orderNumber: input.orderNumber?.trim() ?? existing.orderNumber,
    customer: input.customer?.trim() ?? existing.customer,
    material: input.material?.trim() ?? existing.material,
    dimensions: input.dimensions?.trim() ?? existing.dimensions,
    quantity: input.quantity ?? existing.quantity,
    deliveryDate: input.deliveryDate ?? existing.deliveryDate,
    notes: input.notes?.trim() ?? existing.notes,
    updatedAt: ts,
  };

  const historyEntry: OrderHistoryEntry = {
    id: uid(),
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
    id: uid(),
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
    updatedAt: ts,
  };

  const historyEntry: OrderHistoryEntry = {
    id: uid(),
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
      [o.article, o.customer, o.orderNumber, o.material].some((f) =>
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
