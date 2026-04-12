import { SearchField, EmptyState, Modal, Button } from '@/ui';
import type { MetalGroup, Material } from '@/types/materials';
import { GroupCard } from '../components/GroupCard';
import { MaterialForm } from '../components/MaterialForm';

type FormState =
  | { mode: 'closed' }
  | { mode: 'add'; groupId: string }
  | { mode: 'edit'; material: Material };

type DeleteState =
  | { mode: 'closed' }
  | { mode: 'confirm'; material: Material };

interface MetallgruppenViewProps {
  filteredGroups: MetalGroup[];
  search: string;
  openId: string | null;
  formState: FormState;
  deleteState: DeleteState;
  totalGroups: number;
  totalMaterials: number;
  getMaterials: (groupId: string) => Material[];
  getGroupName: (groupId: string) => string;
  onSearchChange: (value: string) => void;
  onToggleGroup: (groupId: string) => void;
  onAddMaterial: (groupId: string) => void;
  onEditMaterial: (material: Material) => void;
  onDeleteMaterial: (material: Material) => void;
  onFormSave: (name: string, notes: string) => void;
  onFormCancel: () => void;
  onDeleteConfirm: () => void;
  onDeleteCancel: () => void;
}

export function MetallgruppenView({
  filteredGroups, search, openId, formState, deleteState,
  totalGroups, totalMaterials,
  getMaterials, getGroupName,
  onSearchChange, onToggleGroup,
  onAddMaterial, onEditMaterial, onDeleteMaterial,
  onFormSave, onFormCancel,
  onDeleteConfirm, onDeleteCancel,
}: MetallgruppenViewProps) {
  return (
    <div>
      {/* Search */}
      <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: 'var(--sp-md)' }}>
        <div style={{ flex: 1 }}>
          <SearchField value={search} onChange={onSearchChange} placeholder="Gruppe oder Werkstoff suchen…" />
        </div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-3)', whiteSpace: 'nowrap' }}>
          {totalGroups} · {totalMaterials}
        </div>
      </div>

      {/* Groups */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-sm)' }}>
        {filteredGroups.map((g) => (
          <GroupCard
            key={g.id}
            group={g}
            materials={getMaterials(g.id)}
            isOpen={openId === g.id}
            onToggle={() => onToggleGroup(g.id)}
            onAddMaterial={() => onAddMaterial(g.id)}
            onEditMaterial={onEditMaterial}
            onDeleteMaterial={onDeleteMaterial}
          />
        ))}

        {filteredGroups.length === 0 && (
          <EmptyState title={`Kein Ergebnis für „${search}"`} description="Versuch einen anderen Suchbegriff." />
        )}
      </div>

      {/* Add/Edit Form */}
      {formState.mode === 'add' && (
        <MaterialForm
          mode="add"
          groupName={getGroupName(formState.groupId)}
          onSave={onFormSave}
          onCancel={onFormCancel}
        />
      )}
      {formState.mode === 'edit' && (
        <MaterialForm
          mode="edit"
          initialName={formState.material.name}
          initialNotes={formState.material.notes}
          groupName={getGroupName(formState.material.groupId)}
          onSave={onFormSave}
          onCancel={onFormCancel}
        />
      )}

      {/* Delete Confirm */}
      {deleteState.mode === 'confirm' && (
        <Modal
          open
          onClose={onDeleteCancel}
          title="Material löschen"
          actions={
            <>
              <Button variant="secondary" onClick={onDeleteCancel} fullWidth>Abbrechen</Button>
              <Button variant="danger" onClick={onDeleteConfirm} fullWidth>Löschen</Button>
            </>
          }
        >
          <p style={{ fontSize: '14px', color: 'var(--text-2)' }}>
            „{deleteState.material.name}" wirklich löschen?
          </p>
        </Modal>
      )}
    </div>
  );
}
