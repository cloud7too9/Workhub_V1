import { useState, useEffect, useMemo } from 'react';
import type { Order, OrderHistoryEntry } from '@/types/orders';
import type { Werkstueck } from '@/types/workpieces';
import type { Material } from '@/types/materials';
import type { Bearbeiter } from '@/types/bearbeiter';
import {
  loadOrders, saveOrders, loadOrderHistory, saveOrderHistory,
  createOrder, updateOrder, deleteOrder, advanceOrderStatus,
  toggleArbeitsgangDone,
  migrateLegacyOrders, isMigrated, markMigrated,
  type CreateOrderInput,
} from '@/stores/orderStorage';
import { loadWorkpieces, saveWorkpieces } from '@/stores/workpieceStorage';
import { loadBearbeiter } from '@/stores/bearbeiterStorage';
import { initMaterials } from '@/stores/materialStorage';
import { selectFilteredOrders } from '../selectors/order.selectors';
import type { StatusFilterValue, SortModeValue } from '../types/ui.types';

type FormState =
  | { mode: 'closed' }
  | { mode: 'create' }
  | { mode: 'edit'; order: Order };

type DeleteState =
  | { mode: 'closed' }
  | { mode: 'confirm'; order: Order };

export function useAuftraege() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [workpieces, setWorkpieces] = useState<Werkstueck[]>([]);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [bearbeiter, setBearbeiter] = useState<Bearbeiter[]>([]);
  const [history, setHistory] = useState<OrderHistoryEntry[]>([]);
  const [statusFilter, setStatusFilter] = useState<StatusFilterValue>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortMode, setSortMode] = useState<SortModeValue>('deliveryDateAsc');
  const [formState, setFormState] = useState<FormState>({ mode: 'closed' });
  const [deleteState, setDeleteState] = useState<DeleteState>({ mode: 'closed' });

  useEffect(() => {
    const rawOrders = loadOrders() as unknown[];
    let loadedWp = loadWorkpieces();
    let loadedOrders: Order[];

    if (!isMigrated()) {
      const result = migrateLegacyOrders(rawOrders, loadedWp);
      loadedOrders = result.orders;
      loadedWp = result.workpieces;
      saveOrders(loadedOrders);
      saveWorkpieces(loadedWp);
      markMigrated();
    } else {
      loadedOrders = rawOrders as Order[];
    }

    setOrders(loadedOrders);
    setWorkpieces(loadedWp);
    setHistory(loadOrderHistory());
    setBearbeiter(loadBearbeiter());
    initMaterials().then(setMaterials);
  }, []);

  useEffect(() => { saveOrders(orders); }, [orders]);
  useEffect(() => { saveOrderHistory(history); }, [history]);

  const filtered = useMemo(
    () => selectFilteredOrders(orders, workpieces, { statusFilter, searchTerm, sortMode }),
    [orders, workpieces, statusFilter, searchTerm, sortMode],
  );

  const addHistory = (entry: OrderHistoryEntry) => {
    setHistory((prev) => [entry, ...prev]);
  };

  const handleCreate = (data: CreateOrderInput) => {
    const result = createOrder(orders, workpieces, data);
    setOrders(result.orders);
    addHistory(result.historyEntry);
    setFormState({ mode: 'closed' });
  };

  const handleUpdate = (data: CreateOrderInput) => {
    if (formState.mode !== 'edit') return;
    const result = updateOrder(orders, workpieces, formState.order.id, data);
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

  const handleToggleArbeitsgang = (orderId: string, arbeitsgangId: string) => {
    const order = orders.find((o) => o.id === orderId);
    const result = toggleArbeitsgangDone(orders, orderId, arbeitsgangId, order?.bearbeiterId);
    if (result) {
      setOrders(result.orders);
      addHistory(result.historyEntry);
    }
  };

  const refreshWorkpieces = () => setWorkpieces(loadWorkpieces());
  const refreshBearbeiter = () => setBearbeiter(loadBearbeiter());

  return {
    state: {
      orders,
      workpieces,
      materials,
      bearbeiter,
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
      openCreateForm: () => {
        refreshWorkpieces();
        refreshBearbeiter();
        setFormState({ mode: 'create' });
      },
      openEditForm: (order: Order) => {
        refreshWorkpieces();
        refreshBearbeiter();
        setFormState({ mode: 'edit', order });
      },
      closeForm: () => setFormState({ mode: 'closed' }),
      confirmDelete: (order: Order) => setDeleteState({ mode: 'confirm', order }),
      cancelDelete: () => setDeleteState({ mode: 'closed' }),
      handleCreate,
      handleUpdate,
      handleAdvance,
      handleDeleteConfirm,
      handleToggleArbeitsgang,
      refreshWorkpieces,
      refreshBearbeiter,
    },
  };
}
