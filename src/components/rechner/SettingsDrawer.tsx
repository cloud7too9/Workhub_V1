import { useState } from 'react';
import type { Operation } from '../../types/rechner';
import { tokens } from '../../styles/tokens';
import { FormulaBuilder } from './FormulaBuilder';
import { Backdrop, SideDrawer, OverlayHeader } from '../shared/Overlay';

interface SettingsDrawerProps {
  open: boolean;
  onClose: () => void;
  operations: Operation[];
  onOpsChange: (ops: Operation[]) => void;
}

export function SettingsDrawer({ open, onClose, operations, onOpsChange }: SettingsDrawerProps) {
  const [editingOp, setEditingOp] = useState<Operation | null>(null);
  const [isNew, setIsNew] = useState(false);

  const handleEdit = (op: Operation) => {
    setEditingOp(op);
    setIsNew(false);
  };

  const handleNew = () => {
    setEditingOp(null);
    setIsNew(true);
  };

  const handleSave = (op: Operation) => {
    if (isNew) {
      onOpsChange([...operations, op]);
    } else {
      onOpsChange(operations.map((o) => (o.id === op.id ? op : o)));
    }
    setEditingOp(null);
    setIsNew(false);
  };

  const handleDelete = (id: string) => {
    onOpsChange(operations.filter((o) => o.id !== id));
  };

  const handleCancel = () => {
    setEditingOp(null);
    setIsNew(false);
  };

  const handleClose = () => {
    handleCancel();
    onClose();
  };

  const showBuilder = editingOp !== null || isNew;

  return (
    <>
      {open && <Backdrop onClick={handleClose} />}

      <SideDrawer open={open} side="right" width={380}>
        <OverlayHeader
          title={
            showBuilder
              ? isNew
                ? 'Neue Operation'
                : 'Operation bearbeiten'
              : 'Rechner-Einstellungen'
          }
          onClose={handleClose}
        />

        <div style={{ flex: 1, overflowY: 'auto', padding: 16 }}>
          {showBuilder ? (
            <FormulaBuilder operation={editingOp} onSave={handleSave} onCancel={handleCancel} />
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
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
                Rechenoperationen ({operations.length})
              </div>

              {operations.map((op) => (
                <div
                  key={op.id}
                  style={{
                    border: `1px solid ${tokens.border}`,
                    borderRadius: 12,
                    padding: 12,
                    background: tokens.bg,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 10,
                  }}
                >
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: tokens.text }}>
                      {op.name}
                    </div>
                    <div style={{ fontSize: 11, color: tokens.muted, marginTop: 2 }}>
                      {op.fields.length} Felder · {op.results.length} Ergebnisse
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                    <button
                      onClick={() => handleEdit(op)}
                      title="Bearbeiten"
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: 8,
                        border: `1px solid ${tokens.border}`,
                        background: 'transparent',
                        color: tokens.accent,
                        fontSize: 13,
                        cursor: 'pointer',
                        display: 'grid',
                        placeItems: 'center',
                      }}
                    >
                      ✎
                    </button>
                    <button
                      onClick={() => handleDelete(op.id)}
                      title="Löschen"
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: 8,
                        border: `1px solid ${tokens.danger}40`,
                        background: `${tokens.danger}18`,
                        color: tokens.danger,
                        fontSize: 13,
                        cursor: 'pointer',
                        display: 'grid',
                        placeItems: 'center',
                      }}
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))}

              <button
                onClick={handleNew}
                style={{
                  width: '100%',
                  height: 44,
                  borderRadius: 12,
                  border: `1px dashed ${tokens.accent}40`,
                  background: tokens.accentDim,
                  color: tokens.accent,
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: 'pointer',
                  fontFamily: tokens.font.ui,
                }}
              >
                + Neue Operation erstellen
              </button>
            </div>
          )}
        </div>
      </SideDrawer>
    </>
  );
}
