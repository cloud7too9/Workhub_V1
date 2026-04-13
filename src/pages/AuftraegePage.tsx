import { useState } from 'react';
import { useAuftraege } from '@/features/auftraege/hooks/useAuftraege';
import {
  mapOrderToCard, mapOrdersToSummary, mapOrderToDeleteTarget,
  mapOrderToFormInitial, getStatusOptions, mapOrdersToStations,
} from '@/features/auftraege/adapters/order.adapter';
import { AuftraegeView } from '@/features/auftraege/views/AuftraegeView';
import type { OrderCardProps, OrderFormData, ViewTab } from '@/features/auftraege/types/ui.types';

const statusOptions = getStatusOptions();

export function AuftraegePage() {
  const { state, actions } = useAuftraege();
  const [activeTab, setActiveTab] = useState<ViewTab>('liste');

  const summary = mapOrdersToSummary(state.orders);

  const cards: OrderCardProps[] = state.filtered.map((order) => ({
    ...mapOrderToCard(order),
    onAdvance: () => actions.handleAdvance(order.id),
    onEdit: () => actions.openEditForm(order),
    onDelete: () => actions.confirmDelete(order),
  }));

  const stations = mapOrdersToStations(state.filtered);

  const filter = {
    statusFilter: state.statusFilter,
    statusOptions,
    searchTerm: state.searchTerm,
    sortMode: state.sortMode,
    onStatusChange: actions.setStatusFilter,
    onSearchChange: actions.setSearchTerm,
    onSortChange: actions.setSortMode,
  };

  const formState = state.formState.mode === 'edit'
    ? { mode: 'edit' as const, initial: mapOrderToFormInitial(state.formState.order) }
    : { mode: state.formState.mode as 'closed' | 'create' };

  const deleteTarget = state.deleteState.mode === 'confirm'
    ? mapOrderToDeleteTarget(state.deleteState.order)
    : null;

  const handleFormSave = (data: OrderFormData) => {
    if (state.formState.mode === 'edit') {
      actions.handleUpdate(data);
    } else {
      actions.handleCreate(data);
    }
  };

  // Hall view callbacks need the order object, so look it up by id
  const findOrder = (id: string) => state.orders.find((o) => o.id === id);

  const handleHallAdvance = (id: string) => actions.handleAdvance(id);
  const handleHallEdit = (id: string) => {
    const order = findOrder(id);
    if (order) actions.openEditForm(order);
  };
  const handleHallDelete = (id: string) => {
    const order = findOrder(id);
    if (order) actions.confirmDelete(order);
  };

  return (
    <AuftraegeView
      summary={summary}
      cards={cards}
      filter={filter}
      formState={formState}
      deleteTarget={deleteTarget}
      activeTab={activeTab}
      stations={stations}
      onTabChange={setActiveTab}
      onOpenCreate={actions.openCreateForm}
      onCloseForm={actions.closeForm}
      onFormSave={handleFormSave}
      onDeleteConfirm={actions.handleDeleteConfirm}
      onDeleteCancel={actions.cancelDelete}
      onHallAdvance={handleHallAdvance}
      onHallEdit={handleHallEdit}
      onHallDelete={handleHallDelete}
    />
  );
}
