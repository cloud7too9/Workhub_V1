import { useEffect, useState } from 'react';
import type { Material } from '@/types/materials';
import { initMaterials } from '@/stores/materialStorage';
import { useWerkstuecke } from '@/features/werkstuecke/hooks/useWerkstuecke';
import {
  mapWorkpieceToCard,
  mapWorkpieceToFormInitial,
} from '@/features/werkstuecke/adapters/werkstueck.adapter';
import { WerkstueckeView } from '@/features/werkstuecke/views/WerkstueckeView';
import type {
  WerkstueckCardProps,
  WerkstueckFormData,
} from '@/features/werkstuecke/types/ui.types';

export function WerkstueckePage() {
  const { state, actions } = useWerkstuecke();
  const [materials, setMaterials] = useState<Material[]>([]);

  useEffect(() => {
    initMaterials().then(setMaterials);
  }, []);

  const cards: WerkstueckCardProps[] = state.filtered.map((wp) => ({
    ...mapWorkpieceToCard(wp, materials),
    onEdit: () => actions.openEditForm(wp),
    onDelete: () => actions.confirmDelete(wp),
  }));

  const formState =
    state.formState.mode === 'edit'
      ? { mode: 'edit' as const, initial: mapWorkpieceToFormInitial(state.formState.workpiece) }
      : { mode: state.formState.mode as 'closed' | 'create' };

  const deleteTargetLabel =
    state.deleteState.mode === 'confirm' ? state.deleteState.workpiece.bezeichnung : null;

  const handleFormSave = (data: WerkstueckFormData) => {
    if (state.formState.mode === 'edit') {
      actions.handleUpdate(data);
    } else {
      actions.handleCreate(data);
    }
  };

  return (
    <WerkstueckeView
      total={state.workpieces.length}
      cards={cards}
      materials={materials}
      searchTerm={state.searchTerm}
      onSearchChange={actions.setSearchTerm}
      formState={formState}
      deleteTargetLabel={deleteTargetLabel}
      onOpenCreate={actions.openCreateForm}
      onCloseForm={actions.closeForm}
      onFormSave={handleFormSave}
      onDeleteConfirm={actions.handleDeleteConfirm}
      onDeleteCancel={actions.cancelDelete}
    />
  );
}
