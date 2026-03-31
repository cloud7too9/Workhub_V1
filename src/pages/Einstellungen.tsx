import { useState, useEffect, useMemo } from 'react';
import type { ChangelogEntry } from '../types/changelog';
import type { Material } from '../types/materials';
import { tokens } from '../styles/tokens';
import { TabBar } from '../components/shared/TabBar';
import { ChangelogList } from '../components/einstellungen/ChangelogList';
import { NotificationToggles } from '../components/einstellungen/NotificationToggles';
import { ConfirmDialog } from '../components/shared/ConfirmDialog';
import {
  loadMaterials,
  saveMaterials,
  loadChangelog,
  saveChangelog,
  undoEntry,
  resetToFactory,
} from '../stores/materialStore';
import { loadSettings, saveSettings } from '../stores/settingsStore';
import type { AppSettings } from '../stores/settingsStore';

type Section = 'changelog' | 'notifications';

export function Einstellungen() {
  const [activeSection, setActiveSection] = useState<Section>('changelog');
  const [changelog, setChangelog] = useState<ChangelogEntry[]>([]);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [settings, setSettings] = useState<AppSettings>(() => loadSettings());
  const [showReset, setShowReset] = useState(false);

  useEffect(() => {
    setChangelog(loadChangelog());
    setMaterials(loadMaterials());
  }, []);

  useEffect(() => {
    saveSettings(settings);
  }, [settings]);

  const handleUndo = (entry: ChangelogEntry) => {
    const updated = undoEntry(materials, entry);
    setMaterials(updated);
    saveMaterials(updated);

    const newLog = changelog.filter((e) => e.id !== entry.id);
    setChangelog(newLog);
    saveChangelog(newLog);
  };

  const handleReset = async () => {
    const fresh = await resetToFactory();
    setMaterials(fresh);
    setChangelog([]);
    setShowReset(false);
  };

  const tabs = useMemo(
    () => [
      { id: 'changelog' as const, label: 'Änderungsprotokoll', count: changelog.length },
      { id: 'notifications' as const, label: 'Benachrichtigungen' },
    ],
    [changelog.length],
  );

  return (
    <div>
      <TabBar tabs={tabs} active={activeSection} onChange={setActiveSection} />

      <div style={{ padding: 14 }}>
        {activeSection === 'changelog' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 12 }}>
              <button
                onClick={() => setShowReset(true)}
                style={{
                  height: 34,
                  padding: '0 14px',
                  borderRadius: 8,
                  border: `1px solid ${tokens.danger}40`,
                  background: `${tokens.danger}18`,
                  color: tokens.danger,
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: 'pointer',
                  fontFamily: tokens.font.ui,
                }}
              >
                Auf Werkszustand zurücksetzen
              </button>
            </div>
            <ChangelogList entries={changelog} onUndo={handleUndo} />
          </div>
        )}

        {activeSection === 'notifications' && (
          <NotificationToggles
            settings={settings.notifications}
            onChange={(notifications) => setSettings({ ...settings, notifications })}
          />
        )}
      </div>

      {showReset && (
        <ConfirmDialog
          title="Werkszustand wiederherstellen"
          message="Alle Materialien und das Änderungsprotokoll werden zurückgesetzt. Diese Aktion kann nicht rückgängig gemacht werden."
          confirmLabel="Zurücksetzen"
          onConfirm={handleReset}
          onCancel={() => setShowReset(false)}
        />
      )}
    </div>
  );
}
