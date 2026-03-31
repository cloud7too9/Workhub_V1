import type { ImportSourceKind } from './import';

export type OrderStatus =
  | 'open'
  | 'sawn'
  | 'machining_done'
  | 'ready_for_shipping';

export type OrderStep =
  | 'sawing'
  | 'machining'
  | 'packing'
  | null;

/** Persisted import metadata (previewUrl is session-only, not stored) */
export interface OrderImportMeta {
  sourceKind: ImportSourceKind;
  mimeType: string;
  fileName: string;
  fileSize: number;
  importedAt: string;
}

export interface Order {
  id: string;
  article: string;
  orderNumber: string;
  customer: string;
  material: string;
  dimensions: string;
  quantity: number;
  deliveryDate: string;
  notes: string;
  status: OrderStatus;
  currentStep: OrderStep;
  createdAt: string;
  updatedAt: string;
  /** Attached drawing/document import (optional) */
  importMeta?: OrderImportMeta;
}

export interface OrderHistoryEntry {
  id: string;
  orderId: string;
  timestamp: string;
  action: string;
  oldValue: string;
  newValue: string;
}

export type OrderStatusFilter = 'all' | OrderStatus;

export type OrderSortMode =
  | 'deliveryDateAsc'
  | 'deliveryDateDesc'
  | 'updatedAtDesc';
