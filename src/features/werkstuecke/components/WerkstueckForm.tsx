import { useState } from 'react';
import type { Material } from '@/types/materials';
import type { RohmaterialTyp } from '@/types/workpieces';
import { rohmaterialTypLabels } from '@/types/workpieces';
import type { WerkstueckFormData, WerkstueckFormInitial } from '../types/ui.types';
import { ArbeitsgangEditor } from './ArbeitsgangEditor';

interface WerkstueckFormProps {
  mode: 'create' | 'edit';
  initial?: WerkstueckFormInitial;
  materials: Material[];
  onSave: (data: WerkstueckFormData) => void;
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

export function WerkstueckForm({
  mode,
  initial,
  materials,
  onSave,
  onCancel,
}: WerkstueckFormProps) {
  const [bezeichnung, setBezeichnung] = useState(initial?.bezeichnung ?? '');
  const [materialId, setMaterialId] = useState(initial?.materialId ?? '');
  const [rohmaterialTyp, setRohmaterialTyp] = useState<RohmaterialTyp>(
    initial?.rohmaterialTyp ?? 'rundstange',
  );
  const [fertigmass, setFertigmass] = useState(initial?.fertigmass ?? '');
  const [saegemass, setSaegemass] = useState(initial?.saegemass ?? '');
  const [arbeitsgaenge, setArbeitsgaenge] = useState(initial?.arbeitsgaenge ?? []);

  const canSave = bezeichnung.trim() && fertigmass.trim();

  const handleSave = () => {
    if (!canSave) return;
    onSave({
      bezeichnung: bezeichnung.trim(),
      materialId,
      rohmaterialTyp,
      fertigmass: fertigmass.trim(),
      saegemass: saegemass.trim(),
      arbeitsgaenge: arbeitsgaenge
        .filter((a) => a.name.trim())
        .map((a, i) => ({ ...a, name: a.name.trim(), sequence: i + 1 })),
    });
  };

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
          maxWidth: 560,
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
            {mode === 'create' ? 'Neues Werkstück' : 'Werkstück bearbeiten'}
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
          <Field label="Werkstückbezeichnung" required>
            <input
              style={inputStyle}
              value={bezeichnung}
              onChange={(e) => setBezeichnung(e.target.value)}
              placeholder="z.B. HVS 40"
            />
          </Field>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <Field label="Werkstoff">
              <select
                style={{ ...inputStyle, cursor: 'pointer' }}
                value={materialId}
                onChange={(e) => setMaterialId(e.target.value)}
              >
                <option value="">— wählen —</option>
                {materials.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Rohmaterial">
              <select
                style={{ ...inputStyle, cursor: 'pointer' }}
                value={rohmaterialTyp}
                onChange={(e) => setRohmaterialTyp(e.target.value as RohmaterialTyp)}
              >
                {(Object.entries(rohmaterialTypLabels) as [RohmaterialTyp, string][]).map(
                  ([val, label]) => (
                    <option key={val} value={val}>
                      {label}
                    </option>
                  ),
                )}
              </select>
            </Field>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <Field label="Fertigmaß" required>
              <input
                style={inputStyle}
                value={fertigmass}
                onChange={(e) => setFertigmass(e.target.value)}
                placeholder="z.B. Ø50x80"
              />
            </Field>
            <Field label="Sägemaß">
              <input
                style={inputStyle}
                value={saegemass}
                onChange={(e) => setSaegemass(e.target.value)}
                placeholder="z.B. Ø52x82"
              />
            </Field>
          </div>

          <Field label="Arbeitsgänge">
            <ArbeitsgangEditor value={arbeitsgaenge} onChange={setArbeitsgaenge} />
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
