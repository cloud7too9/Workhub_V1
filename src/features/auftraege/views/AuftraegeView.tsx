import { Plus } from 'lucide-react';
import type { Order, OrderStatusFilter, OrderSortMode } from '@/types/orders';
import { Button, EmptyState, Modal } from '@/ui';
import { OrderFilterBar } from '../components/OrderFilterBar';
import { OrderCard } from '../components/OrderCard';
import { OrderForm } from '../components/OrderForm';

type FormState = { mode: 'closed' } | { mode: 'create' } | { mode: 'edit'; order: Order };
type DeleteState = { mode: 'closed' } | { mode: 'confirm'; order: Order };

interface AuftraegeViewProps {
  orders: Order[];
  filtered: Order[];
  statusFilter: OrderStatusFilter;
  searchTerm: string;
  sortMode: OrderSortMode;
  formState: FormState;
  deleteState: DeleteState;
  onStatusFilterChange: (f: OrderStatusFilter) => void;
  onSearchChange: (t: string) => void;
  onSortChange: (m: OrderSortMode) => void;
  onOpenCreate: () => void;
  onOpenEdit: (order: Order) => void;
  onCloseForm: () => void;
  onCreate: (data: Record<string, unknown>) => void;
  onUpdate: (data: Record<string, unknown>) => void;
  onAdvance: (id: string) => void;
  onConfirmDelete: (order: Order) => void;
  onDeleteConfirm: () => void;
  onDeleteCancel: () => void;
}

export function AuftraegeView({
  orders, filtered, statusFilter, searchTerm, sortMode, formState, deleteState,
  onStatusFilterChange, onSearchChange, onSortChange,
  onOpenCreate, onOpenEdit, onCloseForm, onCreate, onUpdate,
  onAdvance, onConfirmDelete, onDeleteConfirm, onDeleteCancel,
}: AuftraegeViewProps) {
  return (
    <div>
      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        marginBottom: 'var(--sp-md)',
      }}>
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-1)', letterSpacing: '-0.02em', marginBottom: '2px' }}>
            Aufträge
          </h2>
          <p style={{ fontSize: '12px', color: 'var(--text-3)' }}>
            {orders.length} gesamt · {orders.filter(o => o.status === 'open').length} offen
          </p>
        </div>
        <Button variant="secondary" size="sm" icon={<Plus size={16} />} onClick={onOpenCreate}>
          Auftrag
        </Button>
      </div>

      {/* Filters */}
      <div style={{ marginBottom: 'var(--sp-md)' }}>
        <OrderFilterBar
          statusFilter={statusFilter} onStatusChange={onStatusFilterChange}
          searchTerm={searchTerm} onSearchChange={onSearchChange}
          sortMode={sortMode} onSortChange={onSortChange}
        />
      </div>

      {/* Order List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-sm)' }}>
        {filtered.map((o) => (
          <OrderCard
            key={o.id} order={o}
            onAdvance={() => onAdvance(o.id)}
            onEdit={() => onOpenEdit(o)}
            onDelete={() => onConfirmDelete(o)}
          />
        ))}
      </div>

      {filtered.length === 0 && orders.length > 0 && (
        <EmptyState title="Keine Aufträge für diesen Filter" description="Versuch einen anderen Filter oder Suchbegriff." />
      )}
      {orders.length === 0 && (
        <EmptyState title="Noch keine Aufträge" description='Klicke oben auf "+ Auftrag" um loszulegen' />
      )}

      {/* Forms */}
      {formState.mode === 'create' && (
        <OrderForm mode="create" onSave={onCreate} onCancel={onCloseForm} />
      )}
      {formState.mode === 'edit' && (
        <OrderForm mode="edit" initial={formState.order} onSave={onUpdate} onCancel={onCloseForm} />
      )}

      {/* Delete Confirm */}
      {deleteState.mode === 'confirm' && (
        <Modal open onClose={onDeleteCancel} title="Auftrag löschen" actions={
          <>
            <Button variant="secondary" onClick={onDeleteCancel} fullWidth>Abbrechen</Button>
            <Button variant="danger" onClick={onDeleteConfirm} fullWidth>Löschen</Button>
          </>
        }>
          <p style={{ fontSize: '14px', color: 'var(--text-2)' }}>
            &bdquo;{deleteState.order.article}&ldquo; wirklich löschen?
          </p>
        </Modal>
      )}
    </div>
  );
}
