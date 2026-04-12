import { SearchField } from '@/ui';
import type { OrderFilterBarProps, StatusFilterValue, SortModeValue } from '../types/ui.types';

const selectStyle: React.CSSProperties = {
  height: '44px', borderRadius: 'var(--radius-md)',
  border: '1px solid var(--border)', background: 'var(--surface)',
  color: 'var(--text-1)', padding: '0 10px', fontSize: '13px',
  fontFamily: 'var(--font-sans)', outline: 'none', cursor: 'pointer',
};

export function OrderFilterBar({
  statusFilter, statusOptions, searchTerm, sortMode,
  onStatusChange, onSearchChange, onSortChange,
}: OrderFilterBarProps) {
  return (
    <div style={{ display: 'flex', gap: 'var(--sp-sm)', flexWrap: 'wrap', alignItems: 'center' }}>
      <div style={{ flex: 1, minWidth: '140px' }}>
        <SearchField value={searchTerm} onChange={onSearchChange} placeholder="Suchen..." />
      </div>
      <select
        value={statusFilter}
        onChange={(e) => onStatusChange(e.target.value as StatusFilterValue)}
        style={{ ...selectStyle, width: '140px' }}
      >
        <option value="all">Alle Status</option>
        {statusOptions.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
      <select
        value={sortMode}
        onChange={(e) => onSortChange(e.target.value as SortModeValue)}
        style={{ ...selectStyle, width: '160px' }}
      >
        <option value="deliveryDateAsc">Lieferdatum &#8593;</option>
        <option value="deliveryDateDesc">Lieferdatum &#8595;</option>
        <option value="updatedAtDesc">Zuletzt geändert</option>
      </select>
    </div>
  );
}
