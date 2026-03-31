import type { ImportSource, ImportSourceKind } from '../types/import';

/** Allowed MIME types per source kind */
const ALLOWED_TYPES: Record<ImportSourceKind, string[]> = {
  camera: ['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif'],
  gallery: ['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif'],
  file: ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'],
};

/** Max file size: 20 MB */
const MAX_FILE_SIZE = 20 * 1024 * 1024;

export type ImportError =
  | { code: 'invalid_type'; mimeType: string }
  | { code: 'too_large'; fileSize: number; maxSize: number }
  | { code: 'empty' };

export function formatImportError(err: ImportError): string {
  switch (err.code) {
    case 'invalid_type':
      return `Dateityp „${err.mimeType || 'unbekannt'}" wird nicht unterstützt. Erlaubt: JPG, PNG, WEBP, PDF.`;
    case 'too_large':
      return `Datei ist zu groß (${formatBytes(err.fileSize)}). Maximum: ${formatBytes(err.maxSize)}.`;
    case 'empty':
      return 'Keine Datei ausgewählt.';
  }
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/**
 * Validate a file and create an ImportSource.
 * Returns either the source or an error.
 */
export function validateAndCreateSource(
  file: File,
  sourceKind: ImportSourceKind,
): { ok: true; source: ImportSource } | { ok: false; error: ImportError } {
  // Empty file
  if (!file || file.size === 0) {
    return { ok: false, error: { code: 'empty' } };
  }

  // Type check
  const allowed = ALLOWED_TYPES[sourceKind];
  if (!allowed.includes(file.type)) {
    return { ok: false, error: { code: 'invalid_type', mimeType: file.type } };
  }

  // Size check
  if (file.size > MAX_FILE_SIZE) {
    return { ok: false, error: { code: 'too_large', fileSize: file.size, maxSize: MAX_FILE_SIZE } };
  }

  const source: ImportSource = {
    sourceKind,
    mimeType: file.type,
    fileName: file.name || `${sourceKind}_${Date.now()}.${extensionFromMime(file.type)}`,
    fileSize: file.size,
    createdAt: new Date().toISOString(),
    previewUrl: URL.createObjectURL(file),
    file,
  };

  return { ok: true, source };
}

function extensionFromMime(mime: string): string {
  const map: Record<string, string> = {
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'image/webp': 'webp',
    'image/heic': 'heic',
    'image/heif': 'heif',
    'application/pdf': 'pdf',
  };
  return map[mime] ?? 'bin';
}
