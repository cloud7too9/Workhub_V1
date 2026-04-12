import { useAuftraege } from '@/features/auftraege/hooks/useAuftraege';
import { AuftraegeView } from '@/features/auftraege/views/AuftraegeView';

export function AuftraegePage() {
  const { state, actions } = useAuftraege();

  return (
    <AuftraegeView
      orders={state.orders}
      filtered={state.filtered}
      statusFilter={state.statusFilter}
      searchTerm={state.searchTerm}
      sortMode={state.sortMode}
      formState={state.formState}
      deleteState={state.deleteState}
      onStatusFilterChange={actions.setStatusFilter}
      onSearchChange={actions.setSearchTerm}
      onSortChange={actions.setSortMode}
      onOpenCreate={actions.openCreateForm}
      onOpenEdit={actions.openEditForm}
      onCloseForm={actions.closeForm}
      onCreate={actions.handleCreate}
      onUpdate={actions.handleUpdate}
      onAdvance={actions.handleAdvance}
      onConfirmDelete={actions.confirmDelete}
      onDeleteConfirm={actions.handleDeleteConfirm}
      onDeleteCancel={actions.cancelDelete}
    />
  );
}
