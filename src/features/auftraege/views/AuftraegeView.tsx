import { Plus } from 'lucide-react';
import { Button, EmptyState, Modal, Tabs } from '@/ui';
import type {
  OrderCardProps, OrderFilterBarProps, OrderSummary,
  DeleteTarget, OrderFormData, OrderFormInitial,
  ViewTab, HallStationData,
} from '../types/ui.types';
import { OrderFilterBar } from '../components/OrderFilterBar';
import { OrderCard } from '../components/OrderCard';
import { OrderForm } from '../components/OrderForm';
import { HallView } from '../components/HallView';

const viewTabs = [
  { id: 'liste', label: 'Liste' },
  { id: 'halle', label: 'Hallenansicht' },
];

type FormState =
  | { mode: 'closed' }
  | { mode: 'create' }
  | { mode: 'edit'; initial: OrderFormInitial };

interface AuftraegeViewProps {
  summary: OrderSummary;
  cards: OrderCardProps[];
  filter: OrderFilterBarProps;
  formState: FormState;
  deleteTarget: DeleteTarget | null;
  activeTab: ViewTab;
  stations: HallStationData[];
  onTabChange: (tab: ViewTab) => void;
  onOpenCreate: () => void;
  onCloseForm: () => void;
  onFormSave: (data: OrderFormData) => void;
  onDeleteConfirm: () => void;
  onDeleteCancel: () => void;
  onHallAdvance: (id: string) => void;
  onHallEdit: (id: string) => void;
  onHallDelete: (id: string) => void;
}

export function AuftraegeView({
  summary, cards, filter, formState, deleteTarget,
  activeTab, stations,
  onTabChange, onOpenCreate, onCloseForm, onFormSave,
  onDeleteConfirm, onDeleteCancel,
  onHallAdvance, onHallEdit, onHallDelete,
}: AuftraegeViewProps) {
  return (
    <div>
      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        marginBottom: 'var(--sp-md)',
      }}>
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-1)', letterSpacing: '-0.02em', marginBottom: '2px' }}>
            Aufträge
          </h2>
          <p style={{ fontSize: '12px', color: 'var(--text-3)' }}>
            {summary.total} gesamt · {summary.openCount} offen
          </p>
        </div>
        <Button variant="secondary" size="sm" icon={<Plus size={16} />} onClick={onOpenCreate}>
          Auftrag
        </Button>
      </div>

      {/* Filters (shared across views) */}
      <div style={{ marginBottom: 'var(--sp-md)' }}>
        <OrderFilterBar {...filter} />
      </div>

      {/* View Tabs */}
      <div style={{ marginBottom: 'var(--sp-md)' }}>
        <Tabs items={viewTabs} active={activeTab} onChange={(id) => onTabChange(id as ViewTab)} />
      </div>

      {/* Liste View */}
      {activeTab === 'liste' && (
        <>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-sm)' }}>
            {cards.map((card) => (
              <OrderCard key={card.id} {...card} />
            ))}
          </div>

          {cards.length === 0 && summary.total > 0 && (
            <EmptyState title="Keine Aufträge für diesen Filter" description="Versuch einen anderen Filter oder Suchbegriff." />
          )}
          {summary.total === 0 && (
            <EmptyState title="Noch keine Aufträge" description='Klicke oben auf "+ Auftrag" um loszulegen' />
          )}
        </>
      )}

      {/* Halle View */}
      {activeTab === 'halle' && (
        <HallView
          stations={stations}
          onAdvance={onHallAdvance}
          onEdit={onHallEdit}
          onDelete={onHallDelete}
        />
      )}

      {/* Create Form */}
      {formState.mode === 'create' && (
        <OrderForm mode="create" onSave={onFormSave} onCancel={onCloseForm} />
      )}

      {/* Edit Form */}
      {formState.mode === 'edit' && (
        <OrderForm mode="edit" initial={formState.initial} onSave={onFormSave} onCancel={onCloseForm} />
      )}

      {/* Delete Confirm */}
      {deleteTarget && (
        <Modal open onClose={onDeleteCancel} title="Auftrag löschen" actions={
          <>
            <Button variant="secondary" onClick={onDeleteCancel} fullWidth>Abbrechen</Button>
            <Button variant="danger" onClick={onDeleteConfirm} fullWidth>Löschen</Button>
          </>
        }>
          <p style={{ fontSize: '14px', color: 'var(--text-2)' }}>
            &bdquo;{deleteTarget.label}&ldquo; wirklich löschen?
          </p>
        </Modal>
      )}
    </div>
  );
}
