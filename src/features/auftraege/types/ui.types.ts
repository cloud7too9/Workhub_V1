import type { ArbeitsgangPhase } from '@/types/workpieces';

// ── UI-spezifische Werttypen (unabhängig von Domain) ──

export type StatusFilterValue = 'all' | 'open' | 'sawn' | 'machining_done' | 'ready_for_shipping';
export type SortModeValue = 'deliveryDateAsc' | 'deliveryDateDesc' | 'updatedAtDesc';
export type ViewTab = 'liste' | 'halle';

// ── Arbeitsgänge am Auftrag (UI) ──

export interface AuftragArbeitsgangUI {
  id: string;
  name: string;
  phase: ArbeitsgangPhase;
  phaseLabel: string;
  done: boolean;
  bearbeiterName?: string;
  completedLabel?: string;
}

// ── Card: Daten getrennt von Callbacks ──

export interface OrderCardData {
  id: string;
  title: string;
  statusLabel: string;
  statusColor: string;
  subtitle: string;
  urgencyBadge?: { label: string };
  advanceAction?: { label: string; color: string };
  details: { label: string; value: string }[];
  arbeitsgaenge: AuftragArbeitsgangUI[];
}

export interface OrderCardProps extends OrderCardData {
  onAdvance: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onToggleArbeitsgang: (arbeitsgangId: string) => void;
}

// ── Status Badge ──

export interface OrderStatusBadgeProps {
  label: string;
  color: string;
}

// ── Filter Props ──

export interface StatusOption {
  value: StatusFilterValue;
  label: string;
}

export interface OrderFilterBarProps {
  statusFilter: StatusFilterValue;
  statusOptions: StatusOption[];
  searchTerm: string;
  sortMode: SortModeValue;
  onStatusChange: (value: StatusFilterValue) => void;
  onSearchChange: (value: string) => void;
  onSortChange: (value: SortModeValue) => void;
}

// ── Form Props ──

export interface OrderFormData {
  workpieceId: string;
  article: string;
  quantity: number;
  processedQuantity: number;
  deliveryDate: string;
  orderDate: string;
  orderNumber: string;
  customer: string;
  notes: string;
  bearbeiterId: string;
}

export interface OrderFormInitial {
  workpieceId?: string;
  article?: string;
  quantity?: number;
  processedQuantity?: number;
  deliveryDate?: string;
  orderDate?: string;
  orderNumber?: string;
  customer?: string;
  notes?: string;
  bearbeiterId?: string;
}

// ── View Summary ──

export interface OrderSummary {
  total: number;
  openCount: number;
}

// ── Delete Confirm ──

export interface DeleteTarget {
  id: string;
  label: string;
}

// ── Hall View ──

export interface HallOrderChipData {
  id: string;
  title: string;
  subtitle: string;
  deliveryDate: string;
  urgencyBadge?: { label: string };
  statusLabel: string;
  statusColor: string;
  advanceAction?: { label: string; color: string };
  details: { label: string; value: string }[];
}

export interface HallStationData {
  id: string;
  label: string;
  color: string;
  zoneId: string;
  count: number;
  orders: HallOrderChipData[];
}
