import { Plus, Search } from 'lucide-react';
import { Button, EmptyState, Modal } from '@/ui';
import type { Material } from '@/types/materials';
import { WerkstueckCard } from '../components/WerkstueckCard';
import { WerkstueckForm } from '../components/WerkstueckForm';
import type {
  WerkstueckCardProps,
  WerkstueckFormData,
  WerkstueckFormInitial,
} from '../types/ui.types';

type FormState =
  | { mode: 'closed' }
  | { mode: 'create' }
  | { mode: 'edit'; initial: WerkstueckFormInitial };

interface WerkstueckeViewProps {
  total: number;
  cards: WerkstueckCardProps[];
  materials: Material[];
  searchTerm: string;
  onSearchChange: (value: string) => void;
  formState: FormState;
  deleteTargetLabel: string | null;
  onOpenCreate: () => void;
  onCloseForm: () => void;
  onFormSave: (data: WerkstueckFormData) => void;
  onDeleteConfirm: () => void;
  onDeleteCancel: () => void;
}

export function WerkstueckeView({
  total,
  cards,
  materials,
  searchTerm,
  onSearchChange,
  formState,
  deleteTargetLabel,
  onOpenCreate,
  onCloseForm,
  onFormSave,
  onDeleteConfirm,
  onDeleteCancel,
}: WerkstueckeViewProps) {
  return (
    <div>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 'var(--sp-md)',
        }}
      >
        <div>
          <h2
            style={{
              fontSize: 20,
              fontWeight: 700,
              color: 'var(--text-1)',
              letterSpacing: '-0.02em',
              marginBottom: 2,
            }}
          >
            Werkstücke
          </h2>
          <p style={{ fontSize: 12, color: 'var(--text-3)' }}>
            {total} gesamt
          </p>
        </div>
        <Button variant="secondary" size="sm" icon={<Plus size={16} />} onClick={onOpenCreate}>
          Werkstück
        </Button>
      </div>

      <div style={{ marginBottom: 'var(--sp-md)', position: 'relative' }}>
        <Search
          size={14}
          color="var(--text-3)"
          style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }}
        />
        <input
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Suche nach Bezeichnung oder Maß…"
          style={{
            width: '100%',
            height: 44,
            borderRadius: 12,
            border: '1px solid var(--border)',
            background: 'var(--bg)',
            color: 'var(--text-1)',
            padding: '0 12px 0 34px',
            fontSize: 14,
            fontFamily: 'var(--font-sans)',
            outline: 'none',
          }}
        />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-sm)' }}>
        {cards.map((card) => (
          <WerkstueckCard key={card.id} {...card} />
        ))}
      </div>

      {cards.length === 0 && total > 0 && (
        <EmptyState title="Keine Werkstücke gefunden" description="Versuch einen anderen Suchbegriff." />
      )}
      {total === 0 && (
        <EmptyState
          title="Noch keine Werkstücke"
          description='Klicke oben auf "+ Werkstück" um loszulegen'
        />
      )}

      {formState.mode === 'create' && (
        <WerkstueckForm
          mode="create"
          materials={materials}
          onSave={onFormSave}
          onCancel={onCloseForm}
        />
      )}
      {formState.mode === 'edit' && (
        <WerkstueckForm
          mode="edit"
          initial={formState.initial}
          materials={materials}
          onSave={onFormSave}
          onCancel={onCloseForm}
        />
      )}

      {deleteTargetLabel && (
        <Modal
          open
          onClose={onDeleteCancel}
          title="Werkstück löschen"
          actions={
            <>
              <Button variant="secondary" onClick={onDeleteCancel} fullWidth>
                Abbrechen
              </Button>
              <Button variant="danger" onClick={onDeleteConfirm} fullWidth>
                Löschen
              </Button>
            </>
          }
        >
          <p style={{ fontSize: 14, color: 'var(--text-2)' }}>
            &bdquo;{deleteTargetLabel}&ldquo; wirklich löschen?
          </p>
        </Modal>
      )}
    </div>
  );
}
