import { useState } from 'react';
import { useAuftraege } from '@/features/auftraege/hooks/useAuftraege';
import {
  mapOrderToCard, mapOrdersToSummary, mapOrderToDeleteTarget,
  mapOrderToFormInitial, getStatusOptions,
  type OrderContext,
} from '@/features/auftraege/adapters/order.adapter';
import { AuftraegeView } from '@/features/auftraege/views/AuftraegeView';
import type {
  OrderCardProps, OrderFormData, ViewTab,
} from '@/features/auftraege/types/ui.types';
import type { WerkstueckFormData } from '@/features/werkstuecke/types/ui.types';
import {
  createWorkpiece,
  loadWorkpieces,
  saveWorkpieces,
} from '@/stores/workpieceStorage';

const statusOptions = getStatusOptions();

export function AuftraegePage() {
  const { state, actions } = useAuftraege();
  const [activeTab, setActiveTab] = useState<ViewTab>('liste');
  const [workpieceFormOpen, setWorkpieceFormOpen] = useState(false);

  const ctx: OrderContext = {
    workpieces: state.workpieces,
    materials: state.materials,
    bearbeiter: state.bearbeiter,
  };

  const summary = mapOrdersToSummary(state.orders);

  const cards: OrderCardProps[] = state.filtered.map((order) => ({
    ...mapOrderToCard(order, ctx),
    onAdvance: () => actions.handleAdvance(order.id),
    onEdit: () => actions.openEditForm(order),
    onDelete: () => actions.confirmDelete(order),
    onToggleArbeitsgang: (agId: string) => actions.handleToggleArbeitsgang(order.id, agId),
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
    ? mapOrderToDeleteTarget(state.deleteState.order, ctx)
    : null;

  const handleFormSave = (data: OrderFormData) => {
    if (state.formState.mode === 'edit') {
      actions.handleUpdate(data);
    } else {
      actions.handleCreate(data);
    }
  };

  const handleWorkpieceCreate = (data: WerkstueckFormData) => {
    const current = loadWorkpieces();
    const result = createWorkpiece(current, data);
    saveWorkpieces(result.workpieces);
    actions.refreshWorkpieces();
    setWorkpieceFormOpen(false);
  };

  return (
    <AuftraegeView
      summary={summary}
      cards={cards}
      filter={filter}
      formState={formState}
      deleteTarget={deleteTarget}
      activeTab={activeTab}
      workpieces={state.workpieces}
      materials={state.materials}
      bearbeiter={state.bearbeiter}
      workpieceFormOpen={workpieceFormOpen}
      onTabChange={setActiveTab}
      onOpenCreate={actions.openCreateForm}
      onCloseForm={actions.closeForm}
      onFormSave={handleFormSave}
      onDeleteConfirm={actions.handleDeleteConfirm}
      onDeleteCancel={actions.cancelDelete}
      onOpenWorkpieceForm={() => setWorkpieceFormOpen(true)}
      onCloseWorkpieceForm={() => setWorkpieceFormOpen(false)}
      onWorkpieceCreate={handleWorkpieceCreate}
    />
  );
}
