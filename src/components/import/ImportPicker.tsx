import { useRef, useState } from 'react';
import { tokens } from '../../styles/tokens';
import { Backdrop } from '../shared/Overlay';
import type { ImportSource, ImportOption } from '../../types/import';
import { IMPORT_OPTIONS } from '../../types/import';
import { validateAndCreateSource, formatImportError } from '../../utils/importValidation';

// ── Icons ──

const ICONS: Record<string, JSX.Element> = {
  camera: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z" />
      <circle cx="12" cy="13" r="4" />
    </svg>
  ),
  gallery: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
      <circle cx="8.5" cy="8.5" r="1.5" />
      <polyline points="21 15 16 10 5 21" />
    </svg>
  ),
  file: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="12" y1="18" x2="12" y2="12" />
      <line x1="9" y1="15" x2="15" y2="15" />
    </svg>
  ),
};

// ── ImportPicker ──

interface ImportPickerProps {
  open: boolean;
  onClose: () => void;
  onImport: (source: ImportSource) => void;
}

export function ImportPicker({ open, onClose, onImport }: ImportPickerProps) {
  const fileRef = useRef<HTMLInputElement>(null);
  const activeOptionRef = useRef<ImportOption | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleOptionClick = (option: ImportOption) => {
    activeOptionRef.current = option;
    setError(null);

    const input = fileRef.current;
    if (!input) return;

    input.accept = option.accept;

    if (option.capture) {
      input.setAttribute('capture', option.capture);
    } else {
      input.removeAttribute('capture');
    }

    input.value = '';
    input.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    const option = activeOptionRef.current;

    // User cancelled the file picker
    if (!file) return;
    if (!option) return;

    const result = validateAndCreateSource(file, option.kind);

    if (!result.ok) {
      setError(formatImportError(result.error));
      return;
    }

    setError(null);
    onImport(result.source);
    onClose();
  };

  const handleClose = () => {
    setError(null);
    onClose();
  };

  if (!open) return null;

  return (
    <>
      <Backdrop onClick={handleClose} zIndex={140} />

      <input
        ref={fileRef}
        type="file"
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />

      {/* Bottom Sheet */}
      <div
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 141,
          background: tokens.surface,
          borderTop: `1px solid ${tokens.border}`,
          borderRadius: '20px 20px 0 0',
          padding: '8px 16px 24px',
          animation: 'importSheetUp 0.3s cubic-bezier(0.16,1,0.3,1) both',
        }}
      >
        {/* Drag handle */}
        <div style={{ display: 'flex', justifyContent: 'center', padding: '8px 0 16px' }}>
          <div style={{ width: 36, height: 4, borderRadius: 2, background: tokens.border }} />
        </div>

        {/* Title */}
        <div style={{ fontSize: 16, fontWeight: 700, color: tokens.text, marginBottom: 4, paddingLeft: 4 }}>
          Zeichnung importieren
        </div>
        <div style={{ fontSize: 12, color: tokens.muted, marginBottom: 16, paddingLeft: 4 }}>
          Quelle wählen
        </div>

        {/* Error message */}
        {error && (
          <div
            style={{
              padding: '10px 14px',
              marginBottom: 12,
              borderRadius: tokens.radius.sm,
              background: `${tokens.danger}15`,
              border: `1px solid ${tokens.danger}30`,
              fontSize: 12,
              color: tokens.danger,
              lineHeight: 1.4,
            }}
          >
            {error}
          </div>
        )}

        {/* Options */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {IMPORT_OPTIONS.map((option) => (
            <button
              key={option.kind}
              onClick={() => handleOptionClick(option)}
              style={{
                all: 'unset',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 14,
                padding: '14px 16px',
                borderRadius: tokens.radius.md,
                border: `1px solid ${tokens.border}`,
                background: tokens.bg,
                minHeight: tokens.touch.minHeight,
                boxSizing: 'border-box',
                width: '100%',
                transition: 'border-color 0.15s ease, background 0.15s ease',
              }}
            >
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: tokens.radius.sm,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: tokens.accentDim,
                  color: tokens.accent,
                  flexShrink: 0,
                }}
              >
                {ICONS[option.kind]}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <span style={{ fontSize: 14, fontWeight: 600, color: tokens.text, fontFamily: tokens.font.ui }}>
                  {option.label}
                </span>
                <span style={{ fontSize: 11, color: tokens.muted, fontFamily: tokens.font.ui }}>
                  {option.description}
                </span>
              </div>
            </button>
          ))}
        </div>

        {/* Cancel */}
        <button
          onClick={handleClose}
          style={{
            width: '100%',
            height: 44,
            marginTop: 12,
            borderRadius: tokens.radius.md,
            border: `1px solid ${tokens.border}`,
            background: 'transparent',
            color: tokens.muted,
            fontSize: 14,
            fontWeight: 600,
            fontFamily: tokens.font.ui,
            cursor: 'pointer',
          }}
        >
          Abbrechen
        </button>
      </div>

      <style>{`
        @keyframes importSheetUp {
          from { transform: translateY(100%); }
          to   { transform: translateY(0); }
        }
      `}</style>
    </>
  );
}
