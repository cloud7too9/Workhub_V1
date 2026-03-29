import { useState, useEffect, useMemo } from 'react';
import { metalGroups } from '../../data/metalGroups';
import type { Material } from '../../types/materials';
import type { ChangelogEntry } from '../../types/changelog';
import { tokens } from '../../styles/tokens';
import { SearchInput } from '../shared/SearchInput';
import { ConfirmDialog } from '../shared/ConfirmDialog';
import { GroupCard } from '../metallgruppen/GroupCard';
import { MaterialForm } from '../metallgruppen/MaterialForm';
import {
  initMaterials,
  saveMaterials,
  addMaterial,
  editMaterial,
  deleteMaterial,
  loadChangelog,
  saveChangelog,
} from '../../stores/useMaterialStore';

type FormState =
  | { mode: 'closed' }
  | { mode: 'add'; groupId: string }
  | { mode: 'edit'; material: Material };

type DeleteState =
  | { mode: 'closed' }
  | { mode: 'confirm'; material: Material };

export function MetallgruppenView() {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [changelog, setChangelog] = useState<ChangelogEntry[]>([]);
  const [search, setSearch] = useState('');
  const [openId, setOpenId] = useState<string | null>(null);
  const [formState, setFormState] = useState<FormState>({ mode: 'closed' });
  const [deleteState, setDeleteState] = useState<DeleteState>({ mode: 'closed' });

  useEffect(() => {
    initMaterials().then(setMaterials);
    setChangelog(loadChangelog());
  }, []);

  useEffect(() => {
    if (materials.length > 0) saveMaterials(materials);
  }, [materials]);
  useEffect(() => {
    saveChangelog(changelog);
  }, [changelog]);

  const getMaterials = (groupId: string) =>
    materials.filter((m) => m.groupId === groupId);

  const filteredGroups = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return metalGroups;

    return metalGroups.filter((g) => {
      if (g.name.toLowerCase().includes(q)) return true;
      const mats = getMaterials(g.id);
      return mats.some((m) => m.name.toLowerCase().includes(q));
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, materials]);

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

  const getGroupName = (groupId: string) =>
    metalGroups.find((g) => g.id === groupId)?.name ?? groupId;

  return (
    <div>
      {/* Search */}
      <div style={{ padding: '0 14px 10px', display: 'flex', gap: 10, alignItems: 'center' }}>
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Gruppe oder Werkstoff suchen…"
        />
        <div
          style={{
            fontFamily: tokens.font.mono,
            fontSize: 11,
            color: tokens.muted,
            whiteSpace: 'nowrap',
          }}
        >
          {metalGroups.length} Gruppen · {materials.length} Werkstoffe
        </div>
      </div>

      {/* Groups */}
      <div style={{ padding: '0 14px 14px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {filteredGroups.map((g) => {
          const groupMats = getMaterials(g.id);
          return (
            <GroupCard
              key={g.id}
              group={g}
              materials={groupMats}
              isOpen={openId === g.id}
              onToggle={() => setOpenId((prev) => (prev === g.id ? null : g.id))}
              onAddMaterial={() => setFormState({ mode: 'add', groupId: g.id })}
              onEditMaterial={(m) => setFormState({ mode: 'edit', material: m })}
              onDeleteMaterial={(m) => setDeleteState({ mode: 'confirm', material: m })}
            />
          );
        })}

        {filteredGroups.length === 0 && (
          <div style={{ textAlign: 'center', padding: 40, color: tokens.muted, fontSize: 14 }}>
            Kein Ergebnis für „{search}"
          </div>
        )}
      </div>

      {formState.mode === 'add' && (
        <MaterialForm
          mode="add"
          groupName={getGroupName(formState.groupId)}
          onSave={handleAdd}
          onCancel={() => setFormState({ mode: 'closed' })}
        />
      )}

      {formState.mode === 'edit' && (
        <MaterialForm
          mode="edit"
          initialName={formState.material.name}
          initialNotes={formState.material.notes}
          groupName={getGroupName(formState.material.groupId)}
          onSave={handleEdit}
          onCancel={() => setFormState({ mode: 'closed' })}
        />
      )}

      {deleteState.mode === 'confirm' && (
        <ConfirmDialog
          title="Material löschen"
          message={`„${deleteState.material.name}" wirklich löschen?`}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeleteState({ mode: 'closed' })}
        />
      )}
    </div>
  );
}
