import { useState, useEffect, useMemo } from 'react';
import type { Order, OrderStatusFilter, OrderSortMode } from '../types/orders';
import type { OrderHistoryEntry } from '../types/orders';
import { tokens } from '../styles/tokens';
import { OrderFilterBar } from '../components/auftraege/OrderFilterBar';
import { OrderCard } from '../components/auftraege/OrderCard';
import { OrderForm } from '../components/auftraege/OrderForm';
import { ConfirmDialog } from '../components/shared/ConfirmDialog';
import {
  loadOrders,
  saveOrders,
  loadOrderHistory,
  saveOrderHistory,
  createOrder,
  updateOrder,
  deleteOrder,
  advanceOrderStatus,
  applyOrderView,
} from '../stores/orderStore';

type FormState =
  | { mode: 'closed' }
  | { mode: 'create' }
  | { mode: 'edit'; order: Order };

type DeleteState =
  | { mode: 'closed' }
  | { mode: 'confirm'; order: Order };

export function Auftraege() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [history, setHistory] = useState<OrderHistoryEntry[]>([]);
  const [statusFilter, setStatusFilter] = useState<OrderStatusFilter>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortMode, setSortMode] = useState<OrderSortMode>('deliveryDateAsc');
  const [formState, setFormState] = useState<FormState>({ mode: 'closed' });
  const [deleteState, setDeleteState] = useState<DeleteState>({ mode: 'closed' });

  useEffect(() => {
    setOrders(loadOrders());
    setHistory(loadOrderHistory());
  }, []);

  useEffect(() => {
    saveOrders(orders);
  }, [orders]);
  useEffect(() => {
    saveOrderHistory(history);
  }, [history]);

  const filtered = useMemo(
    () => applyOrderView(orders, { statusFilter, searchTerm, sortMode }),
    [orders, statusFilter, searchTerm, sortMode],
  );

  const addHistory = (entry: OrderHistoryEntry) => {
    setHistory((prev) => [entry, ...prev]);
  };

  const handleCreate = (data: Parameters<typeof createOrder>[1]) => {
    const result = createOrder(orders, data);
    setOrders(result.orders);
    addHistory(result.historyEntry);
    setFormState({ mode: 'closed' });
  };

  const handleUpdate = (data: Parameters<typeof createOrder>[1]) => {
    if (formState.mode !== 'edit') return;
    const result = updateOrder(orders, formState.order.id, data);
    if (result) {
      setOrders(result.orders);
      addHistory(result.historyEntry);
    }
    setFormState({ mode: 'closed' });
  };

  const handleAdvance = (id: string) => {
    const result = advanceOrderStatus(orders, id);
    if (result) {
      setOrders(result.orders);
      addHistory(result.historyEntry);
    }
  };

  const handleDeleteConfirm = () => {
    if (deleteState.mode !== 'confirm') return;
    const result = deleteOrder(orders, deleteState.order.id);
    if (result) {
      setOrders(result.orders);
      addHistory(result.historyEntry);
    }
    setDeleteState({ mode: 'closed' });
  };

  return (
    <div>
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '16px 14px 10px',
        }}
      >
        <div>
          <h2
            style={{
              fontSize: 20,
              fontWeight: 700,
              color: tokens.text,
              letterSpacing: '-0.02em',
              marginBottom: 2,
            }}
          >
            Aufträge
          </h2>
          <p style={{ fontSize: 12, color: tokens.muted }}>
            {orders.length} gesamt · {orders.filter((o) => o.status === 'open').length} offen
          </p>
        </div>
        <button
          onClick={() => setFormState({ mode: 'create' })}
          style={{
            height: 44,
            padding: '0 18px',
            borderRadius: 12,
            border: `1px solid ${tokens.accent}40`,
            background: tokens.accentDim,
            color: tokens.accent,
            fontSize: 14,
            fontWeight: 600,
            fontFamily: tokens.font.ui,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
          }}
        >
          <span style={{ fontSize: 18, lineHeight: 1 }}>+</span> Auftrag
        </button>
      </div>

      {/* Filters */}
      <div style={{ padding: '0 14px 12px' }}>
        <OrderFilterBar
          statusFilter={statusFilter}
          onStatusChange={setStatusFilter}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          sortMode={sortMode}
          onSortChange={setSortMode}
        />
      </div>

      {/* Order List */}
      <div style={{ padding: '0 14px 14px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {filtered.map((o) => (
          <OrderCard
            key={o.id}
            order={o}
            onAdvance={() => handleAdvance(o.id)}
            onEdit={() => setFormState({ mode: 'edit', order: o })}
            onDelete={() => setDeleteState({ mode: 'confirm', order: o })}
          />
        ))}

        {filtered.length === 0 && orders.length > 0 && (
          <div style={{ textAlign: 'center', padding: 40, color: tokens.muted, fontSize: 14 }}>
            Keine Aufträge für diesen Filter.
          </div>
        )}

        {orders.length === 0 && (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: tokens.muted }}>
            <div style={{ fontSize: 40, marginBottom: 12, opacity: 0.3 }}>📋</div>
            <div style={{ fontSize: 14, marginBottom: 4 }}>Noch keine Aufträge</div>
            <div style={{ fontSize: 12 }}>Klicke oben auf „+ Auftrag" um loszulegen</div>
          </div>
        )}
      </div>

      {/* Create Form */}
      {formState.mode === 'create' && (
        <OrderForm
          mode="create"
          onSave={handleCreate}
          onCancel={() => setFormState({ mode: 'closed' })}
        />
      )}

      {/* Edit Form */}
      {formState.mode === 'edit' && (
        <OrderForm
          mode="edit"
          initial={formState.order}
          onSave={handleUpdate}
          onCancel={() => setFormState({ mode: 'closed' })}
        />
      )}

      {/* Delete Confirm */}
      {deleteState.mode === 'confirm' && (
        <ConfirmDialog
          title="Auftrag löschen"
          message={`„${deleteState.order.article}" wirklich löschen?`}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeleteState({ mode: 'closed' })}
        />
      )}
    </div>
  );
}
