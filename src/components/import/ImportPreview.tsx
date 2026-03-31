import { tokens } from '../../styles/tokens';
import type { ImportSource } from '../../types/import';

interface ImportPreviewProps {
  source: ImportSource;
  onRemove: () => void;
}

const SOURCE_LABELS: Record<string, string> = {
  camera: 'Foto',
  gallery: 'Galerie',
  file: 'Datei',
};

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function fileExtension(name: string): string {
  const dot = name.lastIndexOf('.');
  return dot >= 0 ? name.slice(dot + 1).toUpperCase() : '';
}

export function ImportPreview({ source, onRemove }: ImportPreviewProps) {
  const isImage = source.mimeType.startsWith('image/');
  const isPdf = source.mimeType === 'application/pdf';
  const ext = fileExtension(source.fileName);

  return (
    <div
      style={{
        border: `1px solid ${tokens.accent}30`,
        borderRadius: tokens.radius.md,
        background: tokens.accentDim,
        padding: 12,
        display: 'flex',
        gap: 12,
        alignItems: 'center',
      }}
    >
      {/* Thumbnail */}
      <div
        style={{
          width: 52,
          height: 52,
          borderRadius: tokens.radius.sm,
          overflow: 'hidden',
          flexShrink: 0,
          background: tokens.bg,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: `1px solid ${tokens.border}`,
        }}
      >
        {isImage ? (
          <img
            src={source.previewUrl}
            alt="Vorschau"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        ) : isPdf ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={tokens.danger} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
              <polyline points="14 2 14 8 20 8" />
            </svg>
            <span style={{ fontSize: 8, fontWeight: 700, color: tokens.danger, fontFamily: tokens.font.mono }}>PDF</span>
          </div>
        ) : (
          <span style={{ fontSize: 10, fontWeight: 700, color: tokens.muted, fontFamily: tokens.font.mono }}>{ext}</span>
        )}
      </div>

      {/* Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontSize: 13,
            fontWeight: 600,
            color: tokens.text,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {source.fileName}
        </div>
        <div style={{ fontSize: 11, color: tokens.muted, marginTop: 2 }}>
          {SOURCE_LABELS[source.sourceKind] ?? source.sourceKind} · {formatSize(source.fileSize)}
          {ext && ` · ${ext}`}
        </div>
      </div>

      {/* Remove */}
      <button
        onClick={onRemove}
        title="Import entfernen"
        style={{
          width: 32,
          height: 32,
          borderRadius: 8,
          border: `1px solid ${tokens.border}`,
          background: 'transparent',
          color: tokens.muted,
          fontSize: 14,
          cursor: 'pointer',
          display: 'grid',
          placeItems: 'center',
          flexShrink: 0,
        }}
      >
        ✕
      </button>
    </div>
  );
}
