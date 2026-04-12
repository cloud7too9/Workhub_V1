import type { OrderStatusFilter, OrderSortMode } from '@/types/orders';
import { orderStatusLabels } from '@/data/orderStatus';
import { SearchField } from '@/ui';

interface OrderFilterBarProps {
  statusFilter: OrderStatusFilter;
  onStatusChange: (f: OrderStatusFilter) => void;
  searchTerm: string;
  onSearchChange: (t: string) => void;
  sortMode: OrderSortMode;
  onSortChange: (m: OrderSortMode) => void;
}

const selectStyle: React.CSSProperties = {
  height: '44px', borderRadius: 'var(--radius-md)',
  border: '1px solid var(--border)', background: 'var(--surface)',
  color: 'var(--text-1)', padding: '0 10px', fontSize: '13px',
  fontFamily: 'var(--font-sans)', outline: 'none', cursor: 'pointer',
};

export function OrderFilterBar({
  statusFilter, onStatusChange, searchTerm, onSearchChange, sortMode, onSortChange,
}: OrderFilterBarProps) {
  return (
    <div style={{ display: 'flex', gap: 'var(--sp-sm)', flexWrap: 'wrap', alignItems: 'center' }}>
      <div style={{ flex: 1, minWidth: '140px' }}>
        <SearchField value={searchTerm} onChange={onSearchChange} placeholder="Suchen..." />
      </div>
      <select value={statusFilter} onChange={(e) => onStatusChange(e.target.value as OrderStatusFilter)} style={{ ...selectStyle, width: '140px' }}>
        <option value="all">Alle Status</option>
        {(Object.entries(orderStatusLabels) as [OrderStatusFilter, string][]).map(([key, label]) => (
          <option key={key} value={key}>{label}</option>
        ))}
      </select>
      <select value={sortMode} onChange={(e) => onSortChange(e.target.value as OrderSortMode)} style={{ ...selectStyle, width: '160px' }}>
        <option value="deliveryDateAsc">Lieferdatum ↑</option>
        <option value="deliveryDateDesc">Lieferdatum ↓</option>
        <option value="updatedAtDesc">Zuletzt geändert</option>
      </select>
    </div>
  );
}
