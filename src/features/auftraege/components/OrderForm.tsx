import { useState } from 'react';
import { Plus } from 'lucide-react';
import type { Werkstueck } from '@/types/workpieces';
import type { Material } from '@/types/materials';
import type { Bearbeiter } from '@/types/bearbeiter';
import { rohmaterialTypLabels } from '@/types/workpieces';
import type { OrderFormData, OrderFormInitial } from '../types/ui.types';

interface OrderFormProps {
  mode: 'create' | 'edit';
  initial?: OrderFormInitial;
  workpieces: Werkstueck[];
  materials: Material[];
  bearbeiter: Bearbeiter[];
  onSave: (data: OrderFormData) => void;
  onCancel: () => void;
  onCreateWorkpiece: () => void;
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
          color: 'var(--text-3)',
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
  border: '1px solid var(--border)',
  background: 'var(--bg)',
  color: 'var(--text-1)',
  padding: '0 12px',
  fontSize: 14,
  fontFamily: 'var(--font-sans)',
  outline: 'none',
};

function formatWorkpieceOption(wp: Werkstueck, materials: Material[]): string {
  const material = materials.find((m) => m.id === wp.materialId)?.name;
  const parts = [wp.bezeichnung, material, rohmaterialTypLabels[wp.rohmaterialTyp], wp.fertigmass]
    .filter(Boolean);
  return parts.join(' · ');
}

export function OrderForm({
  mode,
  initial,
  workpieces,
  materials,
  bearbeiter,
  onSave,
  onCancel,
  onCreateWorkpiece,
}: OrderFormProps) {
  const [workpieceId, setWorkpieceId] = useState(initial?.workpieceId ?? '');
  const [article, setArticle] = useState(initial?.article ?? '');
  const [quantity, setQuantity] = useState(String(initial?.quantity ?? ''));
  const [processedQuantity, setProcessedQuantity] = useState(
    String(initial?.processedQuantity ?? 0),
  );
  const [deliveryDate, setDeliveryDate] = useState(initial?.deliveryDate ?? '');
  const [orderDate, setOrderDate] = useState(
    initial?.orderDate ?? new Date().toISOString().slice(0, 10),
  );
  const [orderNumber, setOrderNumber] = useState(initial?.orderNumber ?? '');
  const [customer, setCustomer] = useState(initial?.customer ?? '');
  const [notes, setNotes] = useState(initial?.notes ?? '');
  const [bearbeiterId, setBearbeiterId] = useState(initial?.bearbeiterId ?? '');

  const canSave =
    workpieceId && article.trim() && Number(quantity) > 0 && deliveryDate;

  const handleSave = () => {
    if (!canSave) return;
    onSave({
      workpieceId,
      article: article.trim(),
      quantity: Number(quantity),
      processedQuantity: Number(processedQuantity) || 0,
      deliveryDate,
      orderDate,
      orderNumber: orderNumber.trim(),
      customer: customer.trim(),
      notes: notes.trim(),
      bearbeiterId,
    });
  };

  const activeBearbeiter = bearbeiter.filter((b) => b.active);

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
      <div
        onClick={onCancel}
        style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(0,0,0,0.55)',
          animation: 'fadeIn 0.15s ease',
        }}
      />
      <div
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: 520,
          maxHeight: '92vh',
          overflowY: 'auto',
          border: '1px solid var(--border)',
          background: 'var(--surface)',
          borderRadius: 18,
          padding: 16,
          animation: 'fadeSlideUp 0.2s ease',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 16,
          }}
        >
          <span style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-1)' }}>
            {mode === 'create' ? 'Neuer Auftrag' : 'Auftrag bearbeiten'}
          </span>
          <button
            onClick={onCancel}
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              border: '1px solid var(--border)',
              background: 'transparent',
              color: 'var(--text-3)',
              fontSize: 14,
              cursor: 'pointer',
              display: 'grid',
              placeItems: 'center',
            }}
          >
            ✕
          </button>
        </div>

        <div style={{ display: 'grid', gap: 12 }}>
          <Field label="Werkstück" required>
            <div style={{ display: 'flex', gap: 6 }}>
              <select
                style={{ ...inputStyle, cursor: 'pointer', flex: 1 }}
                value={workpieceId}
                onChange={(e) => setWorkpieceId(e.target.value)}
              >
                <option value="">— Werkstück wählen —</option>
                {workpieces.map((wp) => (
                  <option key={wp.id} value={wp.id}>
                    {formatWorkpieceOption(wp, materials)}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={onCreateWorkpiece}
                aria-label="Neues Werkstück anlegen"
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 12,
                  border: '1px solid var(--border)',
                  background: 'var(--surface-alt)',
                  color: 'var(--text-2)',
                  cursor: 'pointer',
                  display: 'grid',
                  placeItems: 'center',
                }}
              >
                <Plus size={16} />
              </button>
            </div>
          </Field>

          <Field label="Artikel / Bezeichnung (Kunde)" required>
            <input
              style={inputStyle}
              value={article}
              onChange={(e) => setArticle(e.target.value)}
              placeholder="Wie der Kunde es nennt"
            />
          </Field>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
            <Field label="Bestellt" required>
              <input
                style={inputStyle}
                inputMode="numeric"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="z.B. 100"
              />
            </Field>
            <Field label="Bearbeitet">
              <input
                style={inputStyle}
                inputMode="numeric"
                value={processedQuantity}
                onChange={(e) => setProcessedQuantity(e.target.value)}
                placeholder="0"
              />
            </Field>
            <Field label="Liefertermin" required>
              <input
                style={inputStyle}
                type="date"
                value={deliveryDate}
                onChange={(e) => setDeliveryDate(e.target.value)}
              />
            </Field>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <Field label="Bestell-Nr.">
              <input
                style={inputStyle}
                value={orderNumber}
                onChange={(e) => setOrderNumber(e.target.value)}
                placeholder="Optional"
              />
            </Field>
            <Field label="Bestelldatum">
              <input
                style={inputStyle}
                type="date"
                value={orderDate}
                onChange={(e) => setOrderDate(e.target.value)}
              />
            </Field>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <Field label="Kunde">
              <input
                style={inputStyle}
                value={customer}
                onChange={(e) => setCustomer(e.target.value)}
                placeholder="Optional"
              />
            </Field>
            <Field label="Bearbeiter">
              <select
                style={{ ...inputStyle, cursor: 'pointer' }}
                value={bearbeiterId}
                onChange={(e) => setBearbeiterId(e.target.value)}
              >
                <option value="">— keiner —</option>
                {activeBearbeiter.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name}
                  </option>
                ))}
              </select>
            </Field>
          </div>

          <Field label="Zusatzinformation">
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

        <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
          <button
            onClick={onCancel}
            style={{
              flex: 1,
              height: 48,
              borderRadius: 12,
              border: '1px solid var(--border)',
              background: 'transparent',
              color: 'var(--text-3)',
              fontSize: 14,
              fontWeight: 600,
              cursor: 'pointer',
              fontFamily: 'var(--font-sans)',
            }}
          >
            Abbrechen
          </button>
          <button
            onClick={handleSave}
            disabled={!canSave}
            style={{
              flex: 2,
              height: 48,
              borderRadius: 12,
              border: 'none',
              background: canSave ? 'var(--accent)' : 'var(--border)',
              color: canSave ? '#0b0d10' : 'var(--text-3)',
              fontSize: 14,
              fontWeight: 700,
              fontFamily: 'var(--font-sans)',
              cursor: canSave ? 'pointer' : 'default',
            }}
          >
            {mode === 'create' ? 'Erstellen' : 'Speichern'}
          </button>
        </div>
      </div>
    </div>
  );
}
