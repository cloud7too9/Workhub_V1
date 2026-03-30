import { useState, useEffect, useMemo } from 'react';
import type {
  Order,
  OrderStatusFilter,
  OrderSortMode,
  ExtractedFieldKey,
  SelectionRect,
} from '../types/orders';
import type { OrderHistoryEntry } from '../types/orders';
import { tokens } from '../styles/tokens';
import { OrderFilterBar } from '../components/auftraege/OrderFilterBar';
import { OrderCard } from '../components/auftraege/OrderCard';
import { OrderForm } from '../components/auftraege/OrderForm';
import { OrderDetail } from '../components/auftraege/OrderDetail';
import { ScanStartButton } from '../components/auftraege/ScanStartButton';
import { ConfirmDialog } from '../components/shared/ConfirmDialog';
import {
  loadOrders,
  saveOrders,
  loadOrderHistory,
  saveOrderHistory,
  createOrder,
  createOrderFromScan,
  updateOrder,
  deleteOrder,
  advanceOrderStatus,
  applyOrderView,
  setFieldSelection,
  confirmFieldValue,
  setDrawingImage,
} from '../stores/orderStorage';

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
  const [sortMode, setSortMode] = useState<OrderSortMode>('updatedAtDesc');
  const [formState, setFormState] = useState<FormState>({ mode: 'closed' });
  const [deleteState, setDeleteState] = useState<DeleteState>({ mode: 'closed' });
  const [detailOrderId, setDetailOrderId] = useState<string | null>(null);

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

  const detailOrder = detailOrderId
    ? orders.find((o) => o.id === detailOrderId) ?? null
    : null;

  const addHistory = (entry: OrderHistoryEntry) => {
    setHistory((prev) => [entry, ...prev]);
  };

  // ── Manuell erstellen ──
  const handleCreate = (data: Parameters<typeof createOrder>[1]) => {
    const result = createOrder(orders, data);
    setOrders(result.orders);
    addHistory(result.historyEntry);
    setFormState({ mode: 'closed' });
    setDetailOrderId(result.order.id);
  };

  // ── Scan-Start (Phase 3) ──
  const handleScanStart = (imageData: string) => {
    const result = createOrderFromScan(orders, imageData);
    setOrders(result.orders);
    addHistory(result.historyEntry);
    setDetailOrderId(result.order.id);
  };

  // ── Bearbeiten ──
  const handleUpdate = (data: Parameters<typeof createOrder>[1]) => {
    if (formState.mode !== 'edit') return;
    const result = updateOrder(orders, formState.order.id, data);
    if (result) {
      setOrders(result.orders);
      addHistory(result.historyEntry);
    }
    setFormState({ mode: 'closed' });
  };

  // ── Status weiter ──
  const handleAdvance = (id: string) => {
    const result = advanceOrderStatus(orders, id);
    if (result) {
      setOrders(result.orders);
      addHistory(result.historyEntry);
    }
  };

  // ── Löschen ──
  const handleDeleteConfirm = () => {
    if (deleteState.mode !== 'confirm') return;
    const result = deleteOrder(orders, deleteState.order.id);
    if (result) {
      setOrders(result.orders);
      addHistory(result.historyEntry);
    }
    if (detailOrderId === deleteState.order.id) {
      setDetailOrderId(null);
    }
    setDeleteState({ mode: 'closed' });
  };

  // ── Feld-Markierung setzen (Phase 5) ──
  const handleFieldSelection = (
    orderId: string,
    fieldKey: ExtractedFieldKey,
    rect: SelectionRect,
  ) => {
    setOrders((prev) => setFieldSelection(prev, orderId, fieldKey, rect, 'drawing'));
  };

  // ── Feld-Wert bestätigen (Phase 6) ──
  const handleFieldConfirm = (
    orderId: string,
    fieldKey: ExtractedFieldKey,
    value: string,
  ) => {
    setOrders((prev) => confirmFieldValue(prev, orderId, fieldKey, value));
  };

  // ── Zeichnung setzen ──
  const handleSetDrawing = (orderId: string, imageData: string) => {
    setOrders((prev) => setDrawingImage(prev, orderId, imageData));
  };

  // Zähler
  const openCount = orders.filter((o) => o.status === 'open').length;
  const inProgressCount = orders.filter((o) => o.status === 'in_progress').length;

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
            {orders.length} gesamt · {openCount} offen · {inProgressCount} aktiv
          </p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <ScanStartButton onImageCaptured={handleScanStart} />
          <button
            onClick={() => setFormState({ mode: 'create' })}
            style={{
              height: 44,
              padding: '0 14px',
              borderRadius: 12,
              border: `1px solid ${tokens.border}`,
              background: 'transparent',
              color: tokens.muted,
              fontSize: 14,
              fontWeight: 600,
              fontFamily: tokens.font.ui,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 4,
            }}
          >
            <span style={{ fontSize: 16, lineHeight: 1 }}>+</span> Manuell
          </button>
        </div>
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
      <div
        style={{
          padding: '0 14px 14px',
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
        }}
      >
        {filtered.map((o) => (
          <OrderCard
            key={o.id}
            order={o}
            onOpen={() => setDetailOrderId(o.id)}
          />
        ))}

        {filtered.length === 0 && orders.length > 0 && (
          <div
            style={{
              textAlign: 'center',
              padding: 40,
              color: tokens.muted,
              fontSize: 14,
            }}
          >
            Keine Aufträge für diesen Filter.
          </div>
        )}

        {orders.length === 0 && (
          <div
            style={{
              textAlign: 'center',
              padding: '60px 20px',
              color: tokens.muted,
            }}
          >
            <div style={{ fontSize: 40, marginBottom: 12, opacity: 0.3 }}>📋</div>
            <div style={{ fontSize: 14, marginBottom: 4 }}>Noch keine Aufträge</div>
            <div style={{ fontSize: 12 }}>
              Scanne eine Zeichnung oder klicke „+ Manuell"
            </div>
          </div>
        )}
      </div>

      {/* Detail-Ansicht (Phase 4–7) */}
      {detailOrder && (
        <OrderDetail
          order={detailOrder}
          onClose={() => setDetailOrderId(null)}
          onAdvance={() => handleAdvance(detailOrder.id)}
          onEdit={() => {
            setFormState({ mode: 'edit', order: detailOrder });
            setDetailOrderId(null);
          }}
          onDelete={() => {
            setDeleteState({ mode: 'confirm', order: detailOrder });
          }}
          onFieldSelection={(fieldKey, rect) =>
            handleFieldSelection(detailOrder.id, fieldKey, rect)
          }
          onFieldConfirm={(fieldKey, value) =>
            handleFieldConfirm(detailOrder.id, fieldKey, value)
          }
          onSetDrawing={(imageData) =>
            handleSetDrawing(detailOrder.id, imageData)
          }
        />
      )}

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
          message={`„${deleteState.order.article || 'Scan-Auftrag'}" wirklich löschen?`}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeleteState({ mode: 'closed' })}
        />
      )}
    </div>
  );
}
