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
