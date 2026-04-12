import { Plus, Settings } from 'lucide-react';
import type { RechnerCard as RechnerCardType, Operation } from '@/types/rechner';
import { Button, IconButton, EmptyState } from '@/ui';
import { RechnerCard } from '../components/RechnerCard';
import { SettingsDrawer } from '../components/SettingsDrawer';

interface RechnerViewProps {
  cards: RechnerCardType[];
  operations: Operation[];
  settingsOpen: boolean;
  onAddCard: () => void;
  onUpdateCard: (card: RechnerCardType) => void;
  onRemoveCard: (id: string) => void;
  onOpsChange: (ops: Operation[]) => void;
  onOpenSettings: () => void;
  onCloseSettings: () => void;
}

export function RechnerView({
  cards, operations, settingsOpen,
  onAddCard, onUpdateCard, onRemoveCard,
  onOpsChange, onOpenSettings, onCloseSettings,
}: RechnerViewProps) {
  return (
    <div>
      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        marginBottom: 'var(--sp-lg)',
      }}>
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-1)', letterSpacing: '-0.02em', marginBottom: '2px' }}>
            Rechner
          </h2>
          <p style={{ fontSize: '13px', color: 'var(--text-3)' }}>
            {cards.length === 0 ? 'Füge einen Rechner hinzu' : `${cards.length} aktiv`}
          </p>
        </div>
        <div style={{ display: 'flex', gap: 'var(--sp-sm)' }}>
          <IconButton onClick={onOpenSettings} aria-label="Einstellungen">
            <Settings size={18} />
          </IconButton>
          <Button variant="secondary" size="sm" icon={<Plus size={16} />} onClick={onAddCard}>
            Rechner
          </Button>
        </div>
      </div>

      {/* Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-md)' }}>
        {cards.map((c) => (
          <RechnerCard
            key={c.id}
            card={c}
            operations={operations}
            onUpdate={onUpdateCard}
            onRemove={onRemoveCard}
          />
        ))}
      </div>

      {/* Empty */}
      {cards.length === 0 && (
        <EmptyState
          title="Noch keine Rechner aktiv"
          description='Klicke oben auf "+ Rechner" um loszulegen'
        />
      )}

      {/* Settings */}
      <SettingsDrawer
        open={settingsOpen}
        onClose={onCloseSettings}
        operations={operations}
        onOpsChange={onOpsChange}
      />
    </div>
  );
}
