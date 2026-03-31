import type { OrderStatusFilter, OrderSortMode } from '../../types/orders';
import { orderStatusLabels } from '../../data/orderStatus';
import { tokens } from '../../styles/tokens';
import { SearchInput } from '../shared/SearchInput';

interface OrderFilterBarProps {
  statusFilter: OrderStatusFilter;
  onStatusChange: (filter: OrderStatusFilter) => void;
  searchTerm: string;
  onSearchChange: (term: string) => void;
  sortMode: OrderSortMode;
  onSortChange: (mode: OrderSortMode) => void;
}

const selectStyle: React.CSSProperties = {
  height: 44,
  borderRadius: 12,
  border: `1px solid ${tokens.border}`,
  background: tokens.surface,
  color: tokens.text,
  padding: '0 10px',
  fontSize: 13,
  fontFamily: tokens.font.ui,
  outline: 'none',
  cursor: 'pointer',
};

export function OrderFilterBar({
  statusFilter,
  onStatusChange,
  searchTerm,
  onSearchChange,
  sortMode,
  onSortChange,
}: OrderFilterBarProps) {
  return (
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
      <SearchInput
        value={searchTerm}
        onChange={onSearchChange}
        placeholder="Suchen…"
      />
      <select
        value={statusFilter}
        onChange={(e) => onStatusChange(e.target.value as OrderStatusFilter)}
        style={{ ...selectStyle, width: 140 }}
      >
        <option value="all">Alle Status</option>
        {(Object.entries(orderStatusLabels) as [OrderStatusFilter, string][]).map(
          ([key, label]) => (
            <option key={key} value={key}>
              {label}
            </option>
          ),
        )}
      </select>
      <select
        value={sortMode}
        onChange={(e) => onSortChange(e.target.value as OrderSortMode)}
        style={{ ...selectStyle, width: 160 }}
      >
        <option value="deliveryDateAsc">Lieferdatum ↑</option>
        <option value="deliveryDateDesc">Lieferdatum ↓</option>
        <option value="updatedAtDesc">Zuletzt geändert</option>
      </select>
    </div>
  );
}
