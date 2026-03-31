import { useState } from 'react';
import type { Order } from '../../types/orders';
import type { ImportSource } from '../../types/import';
import { tokens } from '../../styles/tokens';
import { Backdrop, CenterPanel } from '../shared/Overlay';
import { ImportPreview } from '../import/ImportPreview';

interface OrderFormProps {
  mode: 'create' | 'edit';
  initial?: Partial<Order>;
  /** Pending import source (shown as preview in create mode) */
  importPreview?: ImportSource | null;
  onRemoveImport?: () => void;
  onSave: (data: {
    article: string;
    material: string;
    dimensions: string;
    quantity: number;
    deliveryDate: string;
    orderNumber: string;
    customer: string;
    notes: string;
  }) => void;
  onCancel: () => void;
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
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
        {label}
        {required && ' *'}
      </div>
      {children}
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  height: 44,
  borderRadius: 12,
  border: `1px solid ${tokens.border}`,
  background: tokens.bg,
  color: tokens.text,
  padding: '0 12px',
  fontSize: 14,
  fontFamily: tokens.font.ui,
  outline: 'none',
};

export function OrderForm({ mode, initial, importPreview, onRemoveImport, onSave, onCancel }: OrderFormProps) {
  const [article, setArticle] = useState(initial?.article ?? '');
  const [material, setMaterial] = useState(initial?.material ?? '');
  const [dimensions, setDimensions] = useState(initial?.dimensions ?? '');
  const [quantity, setQuantity] = useState(String(initial?.quantity ?? ''));
  const [deliveryDate, setDeliveryDate] = useState(initial?.deliveryDate ?? '');
  const [orderNumber, setOrderNumber] = useState(initial?.orderNumber ?? '');
  const [customer, setCustomer] = useState(initial?.customer ?? '');
  const [notes, setNotes] = useState(initial?.notes ?? '');

  const canSave =
    article.trim() &&
    material.trim() &&
    dimensions.trim() &&
    Number(quantity) > 0 &&
    deliveryDate;

  const handleSave = () => {
    if (!canSave) return;
    onSave({
      article: article.trim(),
      material: material.trim(),
      dimensions: dimensions.trim(),
      quantity: Number(quantity),
      deliveryDate,
      orderNumber: orderNumber.trim(),
      customer: customer.trim(),
      notes: notes.trim(),
    });
  };

  return (
    <>
      <Backdrop onClick={onCancel} zIndex={120} />
      <CenterPanel
        maxWidth={480}
        zIndex={121}
        style={{ maxHeight: '90vh', overflowY: 'auto', padding: 16 }}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 16,
          }}
        >
          <span style={{ fontSize: 16, fontWeight: 700, color: tokens.text }}>
            {mode === 'create'
              ? importPreview ? 'Auftrag aus Import' : 'Neuer Auftrag'
              : 'Auftrag bearbeiten'}
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

        {/* Import preview */}
        {importPreview && onRemoveImport && (
          <div style={{ marginBottom: 12 }}>
            <ImportPreview source={importPreview} onRemove={onRemoveImport} />
          </div>
        )}

        <div style={{ display: 'grid', gap: 12 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <Field label="Artikel" required>
              <input style={inputStyle} value={article} onChange={(e) => setArticle(e.target.value)} placeholder="z.B. HVS 40" />
            </Field>
            <Field label="Material" required>
              <input style={inputStyle} value={material} onChange={(e) => setMaterial(e.target.value)} placeholder="z.B. 1.4301" />
            </Field>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <Field label="Maße" required>
              <input style={inputStyle} value={dimensions} onChange={(e) => setDimensions(e.target.value)} placeholder="z.B. Ø50x80" />
            </Field>
            <Field label="Menge" required>
              <input style={inputStyle} inputMode="numeric" value={quantity} onChange={(e) => setQuantity(e.target.value)} placeholder="z.B. 100" />
            </Field>
          </div>

          <Field label="Lieferdatum" required>
            <input style={inputStyle} type="date" value={deliveryDate} onChange={(e) => setDeliveryDate(e.target.value)} />
          </Field>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <Field label="Bestellnummer">
              <input style={inputStyle} value={orderNumber} onChange={(e) => setOrderNumber(e.target.value)} placeholder="Optional" />
            </Field>
            <Field label="Kunde">
              <input style={inputStyle} value={customer} onChange={(e) => setCustomer(e.target.value)} placeholder="Optional" />
            </Field>
          </div>

          <Field label="Notizen">
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Optional…"
              rows={2}
              style={{
                ...inputStyle,
                height: 'auto',
                padding: '10px 12px',
                resize: 'vertical',
              }}
            />
          </Field>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
          <button
            onClick={onCancel}
            style={{
              flex: 1, height: 48, borderRadius: 12,
              border: `1px solid ${tokens.border}`, background: 'transparent',
              color: tokens.muted, fontSize: 14, fontWeight: 600,
              cursor: 'pointer', fontFamily: tokens.font.ui,
            }}
          >
            Abbrechen
          </button>
          <button
            onClick={handleSave}
            disabled={!canSave}
            style={{
              flex: 2, height: 48, borderRadius: 12, border: 'none',
              background: canSave ? tokens.accent : tokens.border,
              color: canSave ? '#0b0d10' : tokens.muted,
              fontSize: 14, fontWeight: 700, fontFamily: tokens.font.ui,
              cursor: canSave ? 'pointer' : 'default',
            }}
          >
            {mode === 'create' ? 'Erstellen' : 'Speichern'}
          </button>
        </div>
      </CenterPanel>
    </>
  );
}
