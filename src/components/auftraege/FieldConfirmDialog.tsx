import { useState } from 'react';
import type { ExtractedFieldKey } from '../../types/orders';
import { extractedFieldLabels } from '../../types/orders';
import { tokens } from '../../styles/tokens';

interface FieldConfirmDialogProps {
  fieldKey: ExtractedFieldKey;
  rawText: string;
  onConfirm: (value: string) => void;
  onRetry: () => void;
  onCancel: () => void;
}

export function FieldConfirmDialog({
  fieldKey,
  rawText,
  onConfirm,
  onRetry,
  onCancel,
}: FieldConfirmDialogProps) {
  const [editValue, setEditValue] = useState(rawText);

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 210,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 14,
      }}
    >
      <div
        onClick={onCancel}
        style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(0,0,0,0.6)',
          animation: 'fadeIn 0.15s ease',
        }}
      />
      <div
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: 400,
          border: `1px solid ${tokens.border}`,
          background: tokens.surface,
          borderRadius: 18,
          padding: 20,
          animation: 'fadeSlideUp 0.2s ease',
        }}
      >
        {/* Header */}
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 16, fontWeight: 700, color: tokens.text }}>
            Wert prüfen
          </div>
          <div style={{ fontSize: 12, color: tokens.accent, fontWeight: 600 }}>
            {extractedFieldLabels[fieldKey]}
          </div>
        </div>

        {/* Rohtext */}
        <div style={{ marginBottom: 12 }}>
          <div
            style={{
              fontSize: 10,
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              color: tokens.muted,
              marginBottom: 4,
            }}
          >
            Erkannt (Rohtext)
          </div>
          <div
            style={{
              padding: '10px 12px',
              borderRadius: 10,
              background: tokens.bg,
              border: `1px solid ${tokens.border}`,
              fontFamily: tokens.font.mono,
              fontSize: 14,
              color: tokens.textSecondary,
              minHeight: 40,
            }}
          >
            {rawText || '(kein Text erkannt)'}
          </div>
        </div>

        {/* Editierbarer Wert */}
        <div style={{ marginBottom: 16 }}>
          <div
            style={{
              fontSize: 10,
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              color: tokens.muted,
              marginBottom: 4,
            }}
          >
            Endwert (korrigierbar)
          </div>
          <input
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            style={{
              width: '100%',
              height: 48,
              borderRadius: 12,
              border: `1px solid ${tokens.accent}40`,
              background: tokens.bg,
              color: tokens.text,
              padding: '0 14px',
              fontSize: 16,
              fontFamily: tokens.font.mono,
              fontWeight: 600,
              outline: 'none',
            }}
            autoFocus
          />
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            onClick={onRetry}
            style={{
              flex: 1,
              height: 44,
              borderRadius: 12,
              border: `1px solid ${tokens.border}`,
              background: 'transparent',
              color: tokens.muted,
              fontSize: 13,
              fontWeight: 600,
              cursor: 'pointer',
              fontFamily: tokens.font.ui,
            }}
          >
            Neu markieren
          </button>
          <button
            onClick={() => onConfirm(editValue.trim())}
            disabled={!editValue.trim()}
            style={{
              flex: 2,
              height: 44,
              borderRadius: 12,
              border: 'none',
              background: editValue.trim() ? tokens.success : tokens.border,
              color: editValue.trim() ? '#0b0d10' : tokens.muted,
              fontSize: 13,
              fontWeight: 700,
              cursor: editValue.trim() ? 'pointer' : 'default',
              fontFamily: tokens.font.ui,
            }}
          >
            ✓ Übernehmen
          </button>
        </div>
      </div>
    </div>
  );
}
