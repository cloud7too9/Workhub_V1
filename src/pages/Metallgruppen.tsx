import { useState, useEffect, useMemo } from 'react';
import { metalGroups } from '../data/metalGroups';
import type { Material } from '../types/materials';
import type { ChangelogEntry } from '../types/changelog';
import { tokens } from '../styles/tokens';
import { SearchInput } from '../components/shared/SearchInput';
import { ConfirmDialog } from '../components/shared/ConfirmDialog';
import { GroupCard } from '../components/metallgruppen/GroupCard';
import { MaterialForm } from '../components/metallgruppen/MaterialForm';
import {
  initMaterials,
  saveMaterials,
  addMaterial,
  editMaterial,
  deleteMaterial,
  loadChangelog,
  saveChangelog,
} from '../stores/useMaterialStore';

type FormState =
  | { mode: 'closed' }
  | { mode: 'add'; groupId: string }
  | { mode: 'edit'; material: Material };

type DeleteState =
  | { mode: 'closed' }
  | { mode: 'confirm'; material: Material };

export function Metallgruppen() {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [changelog, setChangelog] = useState<ChangelogEntry[]>([]);
  const [search, setSearch] = useState('');
  const [openId, setOpenId] = useState<string | null>(null);
  const [formState, setFormState] = useState<FormState>({ mode: 'closed' });
  const [deleteState, setDeleteState] = useState<DeleteState>({ mode: 'closed' });

  // Init materials from localStorage / JSON
  useEffect(() => {
    initMaterials().then(setMaterials);
    setChangelog(loadChangelog());
  }, []);

  // Persist on change
  useEffect(() => {
    if (materials.length > 0) saveMaterials(materials);
  }, [materials]);
  useEffect(() => {
    saveChangelog(changelog);
  }, [changelog]);

  // Helper: get materials for a group
  const getMaterials = (groupId: string) =>
    materials.filter((m) => m.groupId === groupId);

  // Filter groups by search
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

  // ── CRUD Handlers ──

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

  // Find group name for form display
  const getGroupName = (groupId: string) =>
    metalGroups.find((g) => g.id === groupId)?.name ?? groupId;

  return (
    <div>
      {/* Sticky Controls */}
      <div
        style={{
          position: 'sticky',
          top: 56,
          zIndex: 30,
          padding: '10px 14px',
          background: 'rgba(13,15,15,0.86)',
          backdropFilter: 'blur(12px)',
          borderBottom: `1px solid ${tokens.border}`,
        }}
      >
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
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
      </div>

      {/* Groups */}
      <div style={{ padding: 14, display: 'flex', flexDirection: 'column', gap: 10 }}>
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

      {/* Add Form */}
      {formState.mode === 'add' && (
        <MaterialForm
          mode="add"
          groupName={getGroupName(formState.groupId)}
          onSave={handleAdd}
          onCancel={() => setFormState({ mode: 'closed' })}
        />
      )}

      {/* Edit Form */}
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

      {/* Delete Confirm */}
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
