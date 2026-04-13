import { useState } from 'react';
import { useAuftraege } from '@/features/auftraege/hooks/useAuftraege';
import {
  mapOrderToCard, mapOrdersToSummary, mapOrderToDeleteTarget,
  mapOrderToFormInitial, getStatusOptions,
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

  return (
    <AuftraegeView
      summary={summary}
      cards={cards}
      filter={filter}
      formState={formState}
      deleteTarget={deleteTarget}
      activeTab={activeTab}
      onTabChange={setActiveTab}
      onOpenCreate={actions.openCreateForm}
      onCloseForm={actions.closeForm}
      onFormSave={handleFormSave}
      onDeleteConfirm={actions.handleDeleteConfirm}
      onDeleteCancel={actions.cancelDelete}
    />
  );
}
