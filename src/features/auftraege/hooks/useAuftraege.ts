import { useState, useEffect, useMemo } from 'react';
import type { Order, OrderStatusFilter, OrderSortMode, OrderHistoryEntry } from '@/types/orders';
import {
  loadOrders, saveOrders, loadOrderHistory, saveOrderHistory,
  createOrder, updateOrder, deleteOrder, advanceOrderStatus, applyOrderView,
} from '@/stores/orderStorage';

type FormState =
  | { mode: 'closed' }
  | { mode: 'create' }
  | { mode: 'edit'; order: Order };

type DeleteState =
  | { mode: 'closed' }
  | { mode: 'confirm'; order: Order };

export function useAuftraege() {
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

  useEffect(() => { saveOrders(orders); }, [orders]);
  useEffect(() => { saveOrderHistory(history); }, [history]);

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

  return {
    state: {
      orders,
      filtered,
      statusFilter,
      searchTerm,
      sortMode,
      formState,
      deleteState,
    },
    actions: {
      setStatusFilter,
      setSearchTerm,
      setSortMode,
      openCreateForm: () => setFormState({ mode: 'create' }),
      openEditForm: (order: Order) => setFormState({ mode: 'edit', order }),
      closeForm: () => setFormState({ mode: 'closed' }),
      confirmDelete: (order: Order) => setDeleteState({ mode: 'confirm', order }),
      cancelDelete: () => setDeleteState({ mode: 'closed' }),
      handleCreate,
      handleUpdate,
      handleAdvance,
      handleDeleteConfirm,
    },
  };
}
