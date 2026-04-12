import { useState, useEffect, useMemo, useCallback } from 'react';
import { metalGroups } from '@/data/metalGroups';
import type { Material } from '@/types/materials';
import type { ChangelogEntry } from '@/types/changelog';
import {
  initMaterials,
  saveMaterials,
  addMaterial,
  editMaterial,
  deleteMaterial,
  loadChangelog,
  saveChangelog,
} from '@/stores/materialStorage';

type FormState =
  | { mode: 'closed' }
  | { mode: 'add'; groupId: string }
  | { mode: 'edit'; material: Material };

type DeleteState =
  | { mode: 'closed' }
  | { mode: 'confirm'; material: Material };

export function useMetallgruppen() {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [changelog, setChangelog] = useState<ChangelogEntry[]>([]);
  const [search, setSearch] = useState('');
  const [openId, setOpenId] = useState<string | null>(null);
  const [formState, setFormState] = useState<FormState>({ mode: 'closed' });
  const [deleteState, setDeleteState] = useState<DeleteState>({ mode: 'closed' });
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    initMaterials().then((mats) => {
      setMaterials(mats);
      setChangelog(loadChangelog());
      setInitialized(true);
    });
  }, []);

  useEffect(() => {
    if (initialized) saveMaterials(materials);
  }, [materials, initialized]);

  useEffect(() => {
    if (initialized) saveChangelog(changelog);
  }, [changelog, initialized]);

  const getMaterials = useCallback(
    (groupId: string) => materials.filter((m) => m.groupId === groupId),
    [materials],
  );

  const filteredGroups = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return metalGroups;
    return metalGroups.filter((g) => {
      if (g.name.toLowerCase().includes(q)) return true;
      return getMaterials(g.id).some((m) => m.name.toLowerCase().includes(q));
    });
  }, [search, getMaterials]);

  const getGroupName = (groupId: string) =>
    metalGroups.find((g) => g.id === groupId)?.name ?? groupId;

  const handleAdd = (name: string, notes: string) => {
    if (formState.mode !== 'add') return;
    const result = addMaterial(materials, formState.groupId, name, notes);
    setMaterials(result.materials);
    setChangelog((prev) => [result.entry, ...prev]);
    setFormState({ mode: 'closed' });
  };

  const handleEdit = (name: string, notes: string) => {
    if (formState.mode !== 'edit') return;
    const result = editMaterial(materials, formState.material.id, name, notes);
    if (result) {
      setMaterials(result.materials);
      setChangelog((prev) => [result.entry, ...prev]);
    }
    setFormState({ mode: 'closed' });
  };

  const handleDeleteConfirm = () => {
    if (deleteState.mode !== 'confirm') return;
    const result = deleteMaterial(materials, deleteState.material.id);
    if (result) {
      setMaterials(result.materials);
      setChangelog((prev) => [result.entry, ...prev]);
    }
    setDeleteState({ mode: 'closed' });
  };

  const toggleGroup = (groupId: string) => {
    setOpenId((prev) => (prev === groupId ? null : groupId));
  };

  return {
    state: {
      groups: metalGroups,
      filteredGroups,
      materials,
      search,
      openId,
      formState,
      deleteState,
      totalGroups: metalGroups.length,
      totalMaterials: materials.length,
    },
    actions: {
      setSearch,
      toggleGroup,
      getMaterials,
      getGroupName,
      openAddForm: (groupId: string) => setFormState({ mode: 'add', groupId }),
      openEditForm: (material: Material) => setFormState({ mode: 'edit', material }),
      closeForm: () => setFormState({ mode: 'closed' }),
      confirmDelete: (material: Material) => setDeleteState({ mode: 'confirm', material }),
      cancelDelete: () => setDeleteState({ mode: 'closed' }),
      handleAdd,
      handleEdit,
      handleDeleteConfirm,
    },
  };
}
