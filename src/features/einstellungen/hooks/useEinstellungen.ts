import { useState, useEffect } from 'react';
import type { ChangelogEntry } from '@/types/changelog';
import type { Material } from '@/types/materials';
import {
  loadMaterials, saveMaterials, loadChangelog, saveChangelog,
  undoEntry, resetToFactory,
} from '@/stores/materialStorage';
import { loadSettings, saveSettings } from '@/stores/settingsStorage';
import type { AppSettings } from '@/stores/settingsStorage';

type Section = 'changelog' | 'notifications' | 'bearbeiter';

export function useEinstellungen() {
  const [activeSection, setActiveSection] = useState<Section>('changelog');
  const [changelog, setChangelog] = useState<ChangelogEntry[]>([]);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [settings, setSettings] = useState<AppSettings>(() => loadSettings());
  const [showReset, setShowReset] = useState(false);

  useEffect(() => {
    setChangelog(loadChangelog());
    setMaterials(loadMaterials());
  }, []);

  useEffect(() => { saveSettings(settings); }, [settings]);

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

  const updateNotifications = (notifications: AppSettings['notifications']) => {
    setSettings({ ...settings, notifications });
  };

  return {
    state: {
      activeSection,
      changelog,
      settings,
      showReset,
    },
    actions: {
      setActiveSection,
      handleUndo,
      openReset: () => setShowReset(true),
      cancelReset: () => setShowReset(false),
      handleReset,
      updateNotifications,
    },
  };
}
