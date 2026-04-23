import type { ChangelogEntry } from '@/types/changelog';
import type { AppSettings } from '@/stores/settingsStorage';
import { Tabs, Button, Modal } from '@/ui';
import { ChangelogList } from '../components/ChangelogList';
import { NotificationToggles } from '../components/NotificationToggles';
import { BearbeiterVerwaltung } from '../components/BearbeiterVerwaltung';

type Section = 'changelog' | 'notifications' | 'bearbeiter';

const tabItems = [
  { id: 'changelog', label: 'Änderungen' },
  { id: 'notifications', label: 'Benachrichtigungen' },
  { id: 'bearbeiter', label: 'Bearbeiter' },
];

interface EinstellungenViewProps {
  activeSection: Section;
  changelog: ChangelogEntry[];
  settings: AppSettings;
  showReset: boolean;
  onSectionChange: (s: string) => void;
  onUndo: (entry: ChangelogEntry) => void;
  onOpenReset: () => void;
  onCancelReset: () => void;
  onConfirmReset: () => void;
  onNotificationsChange: (n: AppSettings['notifications']) => void;
}

export function EinstellungenView({
  activeSection, changelog, settings, showReset,
  onSectionChange, onUndo, onOpenReset, onCancelReset, onConfirmReset,
  onNotificationsChange,
}: EinstellungenViewProps) {
  return (
    <div>
      {/* Tabs */}
      <div style={{ marginBottom: 'var(--sp-lg)' }}>
        <Tabs items={tabItems} active={activeSection} onChange={onSectionChange} />
      </div>

      {/* Changelog */}
      {activeSection === 'changelog' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 'var(--sp-md)' }}>
            <Button variant="danger" size="sm" onClick={onOpenReset}>
              Auf Werkszustand zurücksetzen
            </Button>
          </div>
          <ChangelogList entries={changelog} onUndo={onUndo} />
        </div>
      )}

      {/* Notifications */}
      {activeSection === 'notifications' && (
        <NotificationToggles
          settings={settings.notifications}
          onChange={onNotificationsChange}
        />
      )}

      {/* Bearbeiter */}
      {activeSection === 'bearbeiter' && <BearbeiterVerwaltung />}

      {/* Reset Confirm */}
      {showReset && (
        <Modal open onClose={onCancelReset} title="Werkszustand wiederherstellen" actions={
          <>
            <Button variant="secondary" onClick={onCancelReset} fullWidth>Abbrechen</Button>
            <Button variant="danger" onClick={onConfirmReset} fullWidth>Zurücksetzen</Button>
          </>
        }>
          <p style={{ fontSize: '14px', color: 'var(--text-2)', lineHeight: 1.5 }}>
            Alle Materialien und das Änderungsprotokoll werden zurückgesetzt.
            Diese Aktion kann nicht rückgängig gemacht werden.
          </p>
        </Modal>
      )}
    </div>
  );
}
