import { useState } from 'react';
import { Modal } from '@/ui';
import { Button } from '@/ui';

interface MaterialFormProps {
  mode: 'add' | 'edit';
  initialName?: string;
  initialNotes?: string;
  groupName: string;
  onSave: (name: string, notes: string) => void;
  onCancel: () => void;
}

export function MaterialForm({
  mode, initialName = '', initialNotes = '',
  groupName, onSave, onCancel,
}: MaterialFormProps) {
  const [name, setName] = useState(initialName);
  const [notes, setNotes] = useState(initialNotes);
  const canSave = name.trim().length > 0;

  return (
    <Modal
      open
      onClose={onCancel}
      title={mode === 'add' ? 'Material hinzufügen' : 'Material bearbeiten'}
      actions={
        <>
          <Button variant="secondary" onClick={onCancel} fullWidth>Abbrechen</Button>
          <Button
            variant="primary"
            onClick={() => canSave && onSave(name.trim(), notes.trim())}
            disabled={!canSave}
            fullWidth
          >
            {mode === 'add' ? 'Hinzufügen' : 'Speichern'}
          </Button>
        </>
      }
    >
      <div style={{ fontSize: '13px', color: 'var(--text-3)', marginBottom: 'var(--sp-md)' }}>
        Gruppe: {groupName}
      </div>

      {/* Name */}
      <div style={{ marginBottom: 'var(--sp-md)' }}>
        <label style={{
          display: 'block', fontSize: '10px', color: 'var(--text-3)', fontWeight: 700,
          textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '4px',
        }}>
          Name *
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="z.B. 1.4301, C45, AlMg3.5"
          autoFocus
          style={{
            width: '100%', height: '46px', borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border)', background: 'var(--bg)',
            color: 'var(--text-1)', padding: '0 12px', fontSize: '15px',
            fontFamily: 'var(--font-mono)', outline: 'none',
          }}
        />
      </div>

      {/* Notes */}
      <div>
        <label style={{
          display: 'block', fontSize: '10px', color: 'var(--text-3)', fontWeight: 700,
          textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '4px',
        }}>
          Notizen
        </label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Optional…"
          rows={3}
          style={{
            width: '100%', borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border)', background: 'var(--bg)',
            color: 'var(--text-1)', padding: '10px 12px', fontSize: '14px',
            fontFamily: 'var(--font-sans)', outline: 'none', resize: 'vertical',
          }}
        />
      </div>
    </Modal>
  );
}
