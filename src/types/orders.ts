import type { ArbeitsgangPhase } from './workpieces';

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

export interface AuftragArbeitsgang {
  id: string;
  name: string;
  phase: ArbeitsgangPhase;
  sequence: number;
  description?: string;
  done: boolean;
  bearbeiterId?: string;
  completedAt?: string;
}

export interface Order {
  id: string;
  workpieceId: string;
  article: string;
  orderNumber: string;
  orderDate: string;
  customer: string;
  quantity: number;
  processedQuantity: number;
  deliveryDate: string;
  completionDate?: string;
  notes: string;
  arbeitsgaenge: AuftragArbeitsgang[];
  bearbeiterId?: string;
  status: OrderStatus;
  currentStep: OrderStep;
  createdAt: string;
  updatedAt: string;
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
