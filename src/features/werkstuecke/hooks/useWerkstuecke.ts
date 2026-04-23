import { useState, useEffect } from 'react';
import type { Werkstueck } from '@/types/workpieces';
import {
  loadWorkpieces,
  saveWorkpieces,
  createWorkpiece,
  updateWorkpiece,
  deleteWorkpiece,
  type CreateWorkpieceInput,
} from '@/stores/workpieceStorage';

type FormState =
  | { mode: 'closed' }
  | { mode: 'create' }
  | { mode: 'edit'; workpiece: Werkstueck };

type DeleteState =
  | { mode: 'closed' }
  | { mode: 'confirm'; workpiece: Werkstueck };

export function useWerkstuecke() {
  const [workpieces, setWorkpieces] = useState<Werkstueck[]>([]);
  const [formState, setFormState] = useState<FormState>({ mode: 'closed' });
  const [deleteState, setDeleteState] = useState<DeleteState>({ mode: 'closed' });
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    setWorkpieces(loadWorkpieces());
  }, []);

  useEffect(() => {
    saveWorkpieces(workpieces);
  }, [workpieces]);

  const handleCreate = (data: CreateWorkpieceInput): Werkstueck => {
    const result = createWorkpiece(workpieces, data);
    setWorkpieces(result.workpieces);
    setFormState({ mode: 'closed' });
    return result.workpiece;
  };

  const handleUpdate = (data: CreateWorkpieceInput) => {
    if (formState.mode !== 'edit') return;
    const result = updateWorkpiece(workpieces, formState.workpiece.id, data);
    if (result) setWorkpieces(result.workpieces);
    setFormState({ mode: 'closed' });
  };

  const handleDeleteConfirm = () => {
    if (deleteState.mode !== 'confirm') return;
    setWorkpieces(deleteWorkpiece(workpieces, deleteState.workpiece.id));
    setDeleteState({ mode: 'closed' });
  };

  const filtered = searchTerm.trim()
    ? workpieces.filter((w) => {
        const t = searchTerm.trim().toLowerCase();
        return (
          w.bezeichnung.toLowerCase().includes(t) ||
          w.fertigmass.toLowerCase().includes(t) ||
          w.saegemass.toLowerCase().includes(t)
        );
      })
    : workpieces;

  return {
    state: {
      workpieces,
      filtered,
      searchTerm,
      formState,
      deleteState,
    },
    actions: {
      setSearchTerm,
      openCreateForm: () => setFormState({ mode: 'create' }),
      openEditForm: (workpiece: Werkstueck) => setFormState({ mode: 'edit', workpiece }),
      closeForm: () => setFormState({ mode: 'closed' }),
      confirmDelete: (workpiece: Werkstueck) => setDeleteState({ mode: 'confirm', workpiece }),
      cancelDelete: () => setDeleteState({ mode: 'closed' }),
      handleCreate,
      handleUpdate,
      handleDeleteConfirm,
    },
  };
}
