import { useState } from 'react';
import { tokens } from '../../styles/tokens';

interface MaterialFormProps {
  mode: 'add' | 'edit';
  initialName?: string;
  initialNotes?: string;
  groupName: string;
  onSave: (name: string, notes: string) => void;
  onCancel: () => void;
}

export function MaterialForm({
  mode,
  initialName = '',
  initialNotes = '',
  groupName,
  onSave,
  onCancel,
}: MaterialFormProps) {
  const [name, setName] = useState(initialName);
  const [notes, setNotes] = useState(initialNotes);

  const canSave = name.trim().length > 0;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 120,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 14,
      }}
    >
      {/* Backdrop */}
      <div
        onClick={onCancel}
        style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(0,0,0,0.55)',
          animation: 'fadeIn 0.15s ease',
        }}
      />

      {/* Modal */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: 400,
          border: `1px solid ${tokens.border}`,
          background: tokens.surface,
          borderRadius: 18,
          padding: 16,
          animation: 'fadeSlideUp 0.2s ease',
        }}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 16,
          }}
        >
          <span style={{ fontSize: 16, fontWeight: 700, color: tokens.text }}>
            {mode === 'add' ? 'Material hinzufügen' : 'Material bearbeiten'}
          </span>
          <button
            onClick={onCancel}
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
            }}
          >
            ✕
          </button>
        </div>

        <div style={{ fontSize: 12, color: tokens.muted, marginBottom: 12 }}>
          Gruppe: {groupName}
        </div>

        {/* Name */}
        <div style={{ marginBottom: 12 }}>
          <div
            style={{
              fontSize: 10,
              color: tokens.muted,
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              marginBottom: 4,
            }}
          >
            Name *
          </div>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="z.B. 1.4301, C45, AlMg3.5"
            autoFocus
            style={{
              width: '100%',
              height: 46,
              borderRadius: 12,
              border: `1px solid ${tokens.border}`,
              background: tokens.bg,
              color: tokens.text,
              padding: '0 12px',
              fontSize: 15,
              fontFamily: tokens.font.mono,
              outline: 'none',
            }}
          />
        </div>

        {/* Notes */}
        <div style={{ marginBottom: 16 }}>
          <div
            style={{
              fontSize: 10,
              color: tokens.muted,
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              marginBottom: 4,
            }}
          >
            Notizen
          </div>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Optional…"
            rows={3}
            style={{
              width: '100%',
              borderRadius: 12,
              border: `1px solid ${tokens.border}`,
              background: tokens.bg,
              color: tokens.text,
              padding: '10px 12px',
              fontSize: 14,
              fontFamily: tokens.font.ui,
              outline: 'none',
              resize: 'vertical',
            }}
          />
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            onClick={onCancel}
            style={{
              flex: 1,
              height: 48,
              borderRadius: 12,
              border: `1px solid ${tokens.border}`,
              background: 'transparent',
              color: tokens.muted,
              fontSize: 14,
              fontWeight: 600,
              cursor: 'pointer',
              fontFamily: tokens.font.ui,
            }}
          >
            Abbrechen
          </button>
          <button
            onClick={() => canSave && onSave(name.trim(), notes.trim())}
            disabled={!canSave}
            style={{
              flex: 2,
              height: 48,
              borderRadius: 12,
              border: 'none',
              background: canSave ? tokens.accent : tokens.border,
              color: canSave ? '#0b0d10' : tokens.muted,
              fontSize: 14,
              fontWeight: 700,
              cursor: canSave ? 'pointer' : 'default',
              fontFamily: tokens.font.ui,
            }}
          >
            {mode === 'add' ? 'Hinzufügen' : 'Speichern'}
          </button>
        </div>
      </div>
    </div>
  );
}
