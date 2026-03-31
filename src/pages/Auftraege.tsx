import { useState, useEffect, useMemo } from 'react';
import type { Order, OrderStatusFilter, OrderSortMode } from '../types/orders';
import type { OrderHistoryEntry } from '../types/orders';
import type { ImportSource } from '../types/import';
import { tokens } from '../styles/tokens';
import { OrderFilterBar } from '../components/auftraege/OrderFilterBar';
import { OrderCard } from '../components/auftraege/OrderCard';
import { OrderForm } from '../components/auftraege/OrderForm';
import { ConfirmDialog } from '../components/shared/ConfirmDialog';
import { ImportPicker } from '../components/import/ImportPicker';
import { ImportPreview } from '../components/import/ImportPreview';
import { saveFileForOrder, deleteFileForOrder } from '../stores/fileStore';
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
  const [orders, setOrders] = useState<Order[]>(() => loadOrders());
  const [history, setHistory] = useState<OrderHistoryEntry[]>(() => loadOrderHistory());
  const [statusFilter, setStatusFilter] = useState<OrderStatusFilter>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortMode, setSortMode] = useState<OrderSortMode>('deliveryDateAsc');
  const [formState, setFormState] = useState<FormState>({ mode: 'closed' });
  const [deleteState, setDeleteState] = useState<DeleteState>({ mode: 'closed' });
  const [importPickerOpen, setImportPickerOpen] = useState(false);
  const [pendingImport, setPendingImport] = useState<ImportSource | null>(null);

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
    const orderId = deleteState.order.id;
    const result = deleteOrder(orders, orderId);
    if (result) {
      setOrders(result.orders);
      addHistory(result.historyEntry);
      // Clean up file blob from IndexedDB
      if (deleteState.order.importMeta) {
        deleteFileForOrder(orderId);
      }
    }
    setDeleteState({ mode: 'closed' });
  };

  // ── Import flow ──

  const handleImport = (source: ImportSource) => {
    setPendingImport(source);
    // Open the create form immediately after import
    setFormState({ mode: 'create' });
  };

  const handleCreateWithImport = (data: Parameters<typeof createOrder>[1]) => {
    const result = createOrder(orders, {
      ...data,
      importMeta: pendingImport
        ? {
            sourceKind: pendingImport.sourceKind,
            mimeType: pendingImport.mimeType,
            fileName: pendingImport.fileName,
            fileSize: pendingImport.fileSize,
            importedAt: pendingImport.createdAt,
          }
        : undefined,
    });
    setOrders(result.orders);
    addHistory(result.historyEntry);

    // Persist file blob in IndexedDB
    if (pendingImport?.file) {
      saveFileForOrder(result.order.id, pendingImport.file);
    }

    setFormState({ mode: 'closed' });
    if (pendingImport?.previewUrl) {
      URL.revokeObjectURL(pendingImport.previewUrl);
    }
    setPendingImport(null);
  };

  const handleFormClose = () => {
    setFormState({ mode: 'closed' });
    if (pendingImport?.previewUrl) {
      URL.revokeObjectURL(pendingImport.previewUrl);
    }
    setPendingImport(null);
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
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            onClick={() => setImportPickerOpen(true)}
            style={{
              height: 44,
              padding: '0 14px',
              borderRadius: 12,
              border: `1px solid ${tokens.accent}40`,
              background: tokens.accentDim,
              color: tokens.accent,
              fontSize: 13,
              fontWeight: 600,
              fontFamily: tokens.font.ui,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
            Importieren
          </button>
          <button
            onClick={() => setFormState({ mode: 'create' })}
            style={{
              height: 44,
              padding: '0 14px',
              borderRadius: 12,
              border: `1px solid ${tokens.border}`,
              background: tokens.surface,
              color: tokens.text,
              fontSize: 13,
              fontWeight: 600,
              fontFamily: tokens.font.ui,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
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
            <div style={{ fontSize: 12 }}>Zeichnung importieren oder manuell anlegen</div>
          </div>
        )}
      </div>

      {/* Pending import preview (shown above the form) */}
      {pendingImport && formState.mode === 'closed' && (
        <div style={{ padding: '0 14px 14px' }}>
          <ImportPreview
            source={pendingImport}
            onRemove={() => {
              URL.revokeObjectURL(pendingImport.previewUrl);
              setPendingImport(null);
            }}
          />
        </div>
      )}

      {/* Create Form */}
      {formState.mode === 'create' && (
        <OrderForm
          mode="create"
          importPreview={pendingImport}
          onRemoveImport={() => {
            if (pendingImport?.previewUrl) URL.revokeObjectURL(pendingImport.previewUrl);
            setPendingImport(null);
          }}
          onSave={handleCreateWithImport}
          onCancel={handleFormClose}
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

      {/* Import Picker */}
      <ImportPicker
        open={importPickerOpen}
        onClose={() => setImportPickerOpen(false)}
        onImport={handleImport}
      />
    </div>
  );
}
