import { useState, useEffect } from 'react';
import type { ChangelogEntry } from '../types/changelog';
import type { Material } from '../types/materials';
import { tokens } from '../styles/tokens';
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
} from '../stores/materialStorage';
import { loadSettings, saveSettings } from '../stores/settingsStorage';
import type { AppSettings } from '../stores/settingsStorage';

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

    // Remove the entry from changelog
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

  const sections: { id: Section; label: string; count?: number }[] = [
    { id: 'changelog', label: 'Änderungsprotokoll', count: changelog.length },
    { id: 'notifications', label: 'Benachrichtigungen' },
  ];

  return (
    <div>
      {/* Section Tabs */}
      <div
        style={{
          position: 'sticky',
          top: 56,
          zIndex: 30,
          padding: '10px 14px',
          background: 'rgba(13,15,15,0.86)',
          backdropFilter: 'blur(12px)',
          borderBottom: `1px solid ${tokens.border}`,
          display: 'flex',
          gap: 8,
        }}
      >
        {sections.map((s) => {
          const isActive = activeSection === s.id;
          return (
            <button
              key={s.id}
              onClick={() => setActiveSection(s.id)}
              style={{
                height: 38,
                padding: '0 14px',
                borderRadius: 10,
                border: `1px solid ${isActive ? tokens.accent + '50' : tokens.border}`,
                background: isActive ? tokens.accentDim : 'transparent',
                color: isActive ? tokens.accent : tokens.muted,
                fontSize: 13,
                fontWeight: isActive ? 600 : 400,
                cursor: 'pointer',
                fontFamily: tokens.font.ui,
                display: 'flex',
                alignItems: 'center',
                gap: 6,
              }}
            >
              {s.label}
              {s.count !== undefined && s.count > 0 && (
                <span
                  style={{
                    fontFamily: tokens.font.mono,
                    fontSize: 11,
                    background: isActive ? tokens.accent + '30' : tokens.border,
                    padding: '1px 6px',
                    borderRadius: 6,
                  }}
                >
                  {s.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Content */}
      <div style={{ padding: 14 }}>
        {activeSection === 'changelog' && (
          <div>
            {/* Reset Button */}
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

      {/* Reset Confirm */}
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
