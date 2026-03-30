import type {
  Order,
  OrderHistoryEntry,
  OrderStatusFilter,
  OrderSortMode,
  ExtractedFieldKey,
  ExtractedField,
  SelectionRect,
  SourceImage,
} from '../types/orders';
import { emptyOrderImages, emptyExtractedFields } from '../types/orders';
import { getNextStatus } from '../data/orderStatus';

const STOR_ORDERS = 'workhub_orders';
const STOR_HISTORY = 'workhub_order_history';

let _id = Date.now();
function uid() {
  return `ord_${_id++}`;
}

function now() {
  return new Date().toISOString();
}

// ── Persistence ──

/** Lade Aufträge — migriert alte Daten automatisch */
export function loadOrders(): Order[] {
  try {
    const raw = JSON.parse(localStorage.getItem(STOR_ORDERS) ?? '[]') as Record<string, unknown>[];
    return raw.map(migrateOrder);
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

// ── Migration ──

/** Migriert alte Auftragsformate auf das neue Modell */
function migrateOrder(raw: Record<string, unknown>): Order {
  // Status-Migration: alte Werte → neue vereinfachte Werte
  let status = (raw.status as string) ?? 'open';
  if (status === 'sawn' || status === 'machining_done') status = 'in_progress';
  if (status === 'ready_for_shipping') status = 'done';
  if (!['open', 'in_progress', 'done'].includes(status)) status = 'open';

  return {
    id: (raw.id as string) ?? uid(),
    article: (raw.article as string) ?? '',
    orderNumber: (raw.orderNumber as string) ?? '',
    customer: (raw.customer as string) ?? '',
    material: (raw.material as string) ?? '',
    dimensions: (raw.dimensions as string) ?? '',
    quantity: (raw.quantity as number) ?? 0,
    deliveryDate: (raw.deliveryDate as string) ?? '',
    notes: (raw.notes as string) ?? '',
    images: (raw.images as Order['images']) ?? emptyOrderImages(),
    extracted: (raw.extracted as Order['extracted']) ?? emptyExtractedFields(),
    status: status as Order['status'],
    createdAt: (raw.createdAt as string) ?? now(),
    updatedAt: (raw.updatedAt as string) ?? now(),
  };
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
}

/** Manuell einen Auftrag erstellen (bestehendes Formular) */
export function createOrder(
  orders: Order[],
  input: CreateOrderInput,
): { orders: Order[]; order: Order; historyEntry: OrderHistoryEntry } {
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
    images: emptyOrderImages(),
    extracted: emptyExtractedFields(),
    status: 'open',
    createdAt: ts,
    updatedAt: ts,
  };

  const historyEntry: OrderHistoryEntry = {
    id: uid(),
    orderId: order.id,
    timestamp: ts,
    action: 'Auftrag erstellt',
    oldValue: '',
    newValue: order.article,
  };

  return { orders: [...orders, order], order, historyEntry };
}

/** Phase 3: Auftrag direkt aus Zeichnungsscan starten */
export function createOrderFromScan(
  orders: Order[],
  drawingImageData: string,
): { orders: Order[]; order: Order; historyEntry: OrderHistoryEntry } {
  const ts = now();
  const order: Order = {
    id: uid(),
    article: '',
    orderNumber: '',
    customer: '',
    material: '',
    dimensions: '',
    quantity: 0,
    deliveryDate: '',
    notes: '',
    images: {
      drawingImage: drawingImageData,
      jobSheetImage: null,
    },
    extracted: emptyExtractedFields(),
    status: 'open',
    createdAt: ts,
    updatedAt: ts,
  };

  const historyEntry: OrderHistoryEntry = {
    id: uid(),
    orderId: order.id,
    timestamp: ts,
    action: 'Auftrag aus Scan erstellt',
    oldValue: '',
    newValue: 'Zeichnung',
  };

  return { orders: [...orders, order], order, historyEntry };
}

/** Auftrag bearbeiten */
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

  return { orders: orders.map((o) => (o.id === id ? updated : o)), historyEntry };
}

/** Auftrag löschen */
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
    oldValue: existing.article || 'Scan-Auftrag',
    newValue: '',
  };

  return { orders: orders.filter((o) => o.id !== id), historyEntry };
}

/** Status weiterschalten: open → in_progress → done */
export function advanceOrderStatus(
  orders: Order[],
  id: string,
): { orders: Order[]; historyEntry: OrderHistoryEntry } | null {
  const existing = orders.find((o) => o.id === id);
  if (!existing) return null;

  const nextStatus = getNextStatus(existing.status);
  if (!nextStatus) return null;

  const ts = now();
  const updated: Order = {
    ...existing,
    status: nextStatus,
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

  return { orders: orders.map((o) => (o.id === id ? updated : o)), historyEntry };
}

// ── Extracted Field Operations (Phase 4–6) ──

/** Markierung für ein Feld setzen (Phase 5) */
export function setFieldSelection(
  orders: Order[],
  orderId: string,
  fieldKey: ExtractedFieldKey,
  rect: SelectionRect,
  source: SourceImage,
): Order[] {
  return orders.map((o) => {
    if (o.id !== orderId) return o;
    const existing = o.extracted[fieldKey];
    const updated: ExtractedField = {
      rawText: existing?.rawText ?? '',
      value: existing?.value ?? '',
      confirmed: false,
      sourceImage: source,
      selectionRect: rect,
    };
    return {
      ...o,
      extracted: { ...o.extracted, [fieldKey]: updated },
      updatedAt: now(),
    };
  });
}

/** Erkannten Rohtext setzen (Phase 6) */
export function setFieldRawText(
  orders: Order[],
  orderId: string,
  fieldKey: ExtractedFieldKey,
  rawText: string,
): Order[] {
  return orders.map((o) => {
    if (o.id !== orderId) return o;
    const existing = o.extracted[fieldKey];
    if (!existing) return o;
    return {
      ...o,
      extracted: {
        ...o.extracted,
        [fieldKey]: { ...existing, rawText, confirmed: false },
      },
      updatedAt: now(),
    };
  });
}

/** Feldwert bestätigen (Phase 6) */
export function confirmFieldValue(
  orders: Order[],
  orderId: string,
  fieldKey: ExtractedFieldKey,
  value: string,
): Order[] {
  return orders.map((o) => {
    if (o.id !== orderId) return o;
    const existing = o.extracted[fieldKey];
    if (!existing) return o;
    return {
      ...o,
      extracted: {
        ...o.extracted,
        [fieldKey]: { ...existing, value, confirmed: true },
      },
      updatedAt: now(),
    };
  });
}

/** Zeichnungsbild setzen */
export function setDrawingImage(
  orders: Order[],
  orderId: string,
  imageData: string,
): Order[] {
  return orders.map((o) => {
    if (o.id !== orderId) return o;
    return {
      ...o,
      images: { ...o.images, drawingImage: imageData },
      updatedAt: now(),
    };
  });
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
