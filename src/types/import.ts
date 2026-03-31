/** The way a drawing/document was imported */
export type ImportSourceKind = 'camera' | 'gallery' | 'file';

/** Metadata attached to an imported file */
export interface ImportSource {
  /** How the file was acquired */
  sourceKind: ImportSourceKind;
  /** MIME type of the imported file */
  mimeType: string;
  /** Original file name (if available) */
  fileName: string;
  /** File size in bytes */
  fileSize: number;
  /** Timestamp of the import */
  createdAt: string;
  /** Object URL for in-session preview (not persisted) */
  previewUrl: string;
  /** Raw file blob — kept in memory for later storage (IndexedDB) */
  file: File;
}

/** Options shown in the import picker */
export interface ImportOption {
  kind: ImportSourceKind;
  label: string;
  description: string;
  accept: string;
  capture?: 'environment' | 'user';
}

/** The three import sources */
export const IMPORT_OPTIONS: ImportOption[] = [
  {
    kind: 'camera',
    label: 'Foto aufnehmen',
    description: 'Zeichnung mit der Kamera abfotografieren',
    accept: 'image/*',
    capture: 'environment',
  },
  {
    kind: 'gallery',
    label: 'Aus Galerie wählen',
    description: 'Vorhandenes Bild auswählen',
    accept: 'image/jpeg,image/png,image/webp',
  },
  {
    kind: 'file',
    label: 'Datei hochladen',
    description: 'PDF oder Bild von Dateien laden',
    accept: 'image/jpeg,image/png,image/webp,application/pdf',
  },
];
