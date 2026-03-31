import type { Material } from '../types/materials';
import type { ChangelogEntry } from '../types/changelog';
import { uid as _uid } from '../utils/uid';

const STOR_MATERIALS = 'workhub_materials';
const STOR_CHANGELOG = 'workhub_changelog';
const STOR_INITIALIZED = 'workhub_materials_init';

function uid() {
  return _uid('mat');
}

/** Load materials — on first run, imports from materials.json */
export async function initMaterials(): Promise<Material[]> {
  const initialized = localStorage.getItem(STOR_INITIALIZED);

  if (initialized) {
    try {
      return JSON.parse(localStorage.getItem(STOR_MATERIALS) ?? '[]') as Material[];
    } catch {
      return [];
    }
  }

  // First load — import from static JSON
  try {
    const res = await fetch('/data/materials.json', { cache: 'no-store' });
    if (!res.ok) throw new Error('fetch failed');
    const data = (await res.json()) as Material[];
    localStorage.setItem(STOR_MATERIALS, JSON.stringify(data));
    localStorage.setItem(STOR_INITIALIZED, '1');
    return data;
  } catch {
    return [];
  }
}

export function loadMaterials(): Material[] {
  try {
    return JSON.parse(localStorage.getItem(STOR_MATERIALS) ?? '[]') as Material[];
  } catch {
    return [];
  }
}

export function saveMaterials(materials: Material[]): void {
  localStorage.setItem(STOR_MATERIALS, JSON.stringify(materials));
}

/** Add a material and log it */
export function addMaterial(
  materials: Material[],
  groupId: string,
  name: string,
  notes: string,
): { materials: Material[]; entry: ChangelogEntry } {
  const newMat: Material = {
    id: uid(),
    name: name.trim(),
    groupId,
    notes: notes.trim(),
  };

  const entry: ChangelogEntry = {
    id: uid(),
    action: 'added',
    materialName: newMat.name,
    groupId,
    timestamp: Date.now(),
    previousState: null,
    currentState: newMat,
  };

  return {
    materials: [...materials, newMat],
    entry,
  };
}

/** Edit a material and log it */
export function editMaterial(
  materials: Material[],
  id: string,
  name: string,
  notes: string,
): { materials: Material[]; entry: ChangelogEntry } | null {
  const existing = materials.find((m) => m.id === id);
  if (!existing) return null;

  const updated: Material = { ...existing, name: name.trim(), notes: notes.trim() };

  const entry: ChangelogEntry = {
    id: uid(),
    action: 'edited',
    materialName: updated.name,
    groupId: existing.groupId,
    timestamp: Date.now(),
    previousState: { ...existing },
    currentState: updated,
  };

  return {
    materials: materials.map((m) => (m.id === id ? updated : m)),
    entry,
  };
}

/** Delete a material and log it */
export function deleteMaterial(
  materials: Material[],
  id: string,
): { materials: Material[]; entry: ChangelogEntry } | null {
  const existing = materials.find((m) => m.id === id);
  if (!existing) return null;

  const entry: ChangelogEntry = {
    id: uid(),
    action: 'deleted',
    materialName: existing.name,
    groupId: existing.groupId,
    timestamp: Date.now(),
    previousState: { ...existing },
    currentState: null,
  };

  return {
    materials: materials.filter((m) => m.id !== id),
    entry,
  };
}

/** Undo a changelog entry */
export function undoEntry(
  materials: Material[],
  entry: ChangelogEntry,
): Material[] {
  switch (entry.action) {
    case 'added':
      // Undo add = remove the material
      return materials.filter(
        (m) => m.id !== entry.currentState?.id,
      );
    case 'deleted':
      // Undo delete = re-add the material
      if (entry.previousState) {
        return [...materials, entry.previousState];
      }
      return materials;
    case 'edited':
      // Undo edit = restore previous state
      if (entry.previousState) {
        return materials.map((m) =>
          m.id === entry.previousState!.id ? entry.previousState! : m,
        );
      }
      return materials;
    default:
      return materials;
  }
}

// ── Changelog persistence ──

export function loadChangelog(): ChangelogEntry[] {
  try {
    return JSON.parse(localStorage.getItem(STOR_CHANGELOG) ?? '[]') as ChangelogEntry[];
  } catch {
    return [];
  }
}

export function saveChangelog(entries: ChangelogEntry[]): void {
  localStorage.setItem(STOR_CHANGELOG, JSON.stringify(entries));
}

/** Reset to factory state */
export async function resetToFactory(): Promise<Material[]> {
  localStorage.removeItem(STOR_INITIALIZED);
  localStorage.removeItem(STOR_MATERIALS);
  localStorage.removeItem(STOR_CHANGELOG);
  return initMaterials();
}
