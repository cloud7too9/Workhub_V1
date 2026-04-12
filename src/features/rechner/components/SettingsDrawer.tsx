import { useState } from 'react';
import { X, Pencil, Trash2 } from 'lucide-react';
import type { Operation } from '@/types/rechner';
import { Button } from '@/ui';
import { FormulaBuilder } from './FormulaBuilder';

interface SettingsDrawerProps {
  open: boolean;
  onClose: () => void;
  operations: Operation[];
  onOpsChange: (ops: Operation[]) => void;
}

export function SettingsDrawer({ open, onClose, operations, onOpsChange }: SettingsDrawerProps) {
  const [editingOp, setEditingOp] = useState<Operation | null>(null);
  const [isNew, setIsNew] = useState(false);

  const handleEdit = (op: Operation) => { setEditingOp(op); setIsNew(false); };
  const handleNew = () => { setEditingOp(null); setIsNew(true); };

  const handleSave = (op: Operation) => {
    if (isNew) onOpsChange([...operations, op]);
    else onOpsChange(operations.map((o) => (o.id === op.id ? op : o)));
    setEditingOp(null);
    setIsNew(false);
  };

  const handleDelete = (id: string) => { onOpsChange(operations.filter((o) => o.id !== id)); };
  const handleCancel = () => { setEditingOp(null); setIsNew(false); };

  const showBuilder = editingOp !== null || isNew;

  return (
    <>
      {/* Backdrop */}
      {open && (
        <div onClick={onClose} aria-hidden="true" style={{
          position: 'fixed', inset: 0, zIndex: 90,
          background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)',
          animation: 'fadeIn 0.2s ease',
        }} />
      )}

      {/* Drawer */}
      <aside style={{
        position: 'fixed', top: 0, right: 0, bottom: 0, zIndex: 100,
        width: '380px', maxWidth: '90vw',
        background: 'var(--surface)', borderLeft: '1px solid var(--border)',
        transform: open ? 'translateX(0)' : 'translateX(100%)',
        transition: 'transform 0.25s cubic-bezier(0.32, 0.72, 0, 1)',
        display: 'flex', flexDirection: 'column', overflow: 'hidden',
      }}>
        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: 'var(--sp-lg)', borderBottom: '1px solid var(--border-subtle)', flexShrink: 0,
        }}>
          <span style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-1)' }}>
            {showBuilder ? (isNew ? 'Neue Operation' : 'Operation bearbeiten') : 'Rechner-Einstellungen'}
          </span>
          <button
            onClick={() => { handleCancel(); onClose(); }}
            style={{
              width: 36, height: 36, borderRadius: 'var(--radius-sm)',
              border: 'none', background: 'var(--surface-alt)',
              color: 'var(--text-2)', cursor: 'pointer', display: 'grid', placeItems: 'center',
            }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: 'var(--sp-lg)' }}>
          {showBuilder ? (
            <FormulaBuilder operation={editingOp} onSave={handleSave} onCancel={handleCancel} />
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-sm)' }}>
              <div style={{
                fontSize: '10px', color: 'var(--text-3)', fontWeight: 700,
                textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '4px',
              }}>
                Rechenoperationen ({operations.length})
              </div>

              {operations.map((op) => (
                <div key={op.id} style={{
                  border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)',
                  padding: 'var(--sp-md)', background: 'var(--bg)',
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px',
                }}>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-1)' }}>{op.name}</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-3)', marginTop: '2px' }}>
                      {op.fields.length} Felder · {op.results.length} Ergebnisse
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
                    <button
                      onClick={() => handleEdit(op)} title="Bearbeiten"
                      style={{
                        width: 32, height: 32, borderRadius: 'var(--radius-sm)',
                        border: '1px solid var(--border)', background: 'transparent',
                        color: 'var(--accent)', cursor: 'pointer', display: 'grid', placeItems: 'center',
                      }}
                    >
                      <Pencil size={13} />
                    </button>
                    <button
                      onClick={() => handleDelete(op.id)} title="Löschen"
                      style={{
                        width: 32, height: 32, borderRadius: 'var(--radius-sm)',
                        border: '1px solid color-mix(in srgb, var(--error) 40%, transparent)',
                        background: 'color-mix(in srgb, var(--error) 12%, transparent)',
                        color: 'var(--error)', cursor: 'pointer', display: 'grid', placeItems: 'center',
                      }}
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              ))}

              <Button variant="secondary" onClick={handleNew} fullWidth style={{
                borderStyle: 'dashed', color: 'var(--accent)',
              }}>
                + Neue Operation erstellen
              </Button>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
