import { useState } from 'react';
import type { Operation, OpField, OpResult } from '../../types/rechner';
import { executeOperation } from '../../data/operations';
import { tokens } from '../../styles/tokens';

let _id = Date.now();
function uid() {
  return `op_${_id++}`;
}

/* ── Mini Input ── */
function MiniInput({
  value,
  onChange,
  placeholder,
  mono,
  style: sx,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  mono?: boolean;
  style?: React.CSSProperties;
}) {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      style={{
        height: 38,
        borderRadius: 8,
        border: `1px solid ${tokens.border}`,
        background: tokens.bg,
        color: tokens.text,
        padding: '0 10px',
        fontSize: 13,
        fontFamily: mono ? tokens.font.mono : tokens.font.ui,
        outline: 'none',
        width: '100%',
        ...sx,
      }}
    />
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return (
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
      {children}
    </div>
  );
}

interface FormulaBuilderProps {
  operation: Operation | null;
  onSave: (op: Operation) => void;
  onCancel: () => void;
}

export function FormulaBuilder({ operation, onSave, onCancel }: FormulaBuilderProps) {
  const [name, setName] = useState(operation?.name || '');
  const [description, setDescription] = useState(operation?.description || '');
  const [fields, setFields] = useState<OpField[]>(
    operation?.fields || [{ key: 'a', label: '', unit: '', type: 'input', fixedValue: '' }],
  );
  const [results, setResults] = useState<OpResult[]>(
    operation?.results || [{ key: 'r1', label: '', formula: '', unit: '', highlight: true }],
  );
  const [summaryTemplate, setSummaryTemplate] = useState(operation?.summaryTemplate || '');
  const [testInputs, setTestInputs] = useState<Record<string, string>>({});
  const [testResult, setTestResult] = useState<ReturnType<typeof executeOperation>>(null);

  const updateField = (i: number, patch: Partial<OpField>) => {
    setFields((prev) => prev.map((f, j) => (j === i ? { ...f, ...patch } : f)));
  };
  const removeField = (i: number) => setFields((prev) => prev.filter((_, j) => j !== i));
  const addField = () => {
    const nextKey = String.fromCharCode(97 + fields.length);
    setFields((prev) => [...prev, { key: nextKey, label: '', unit: '', type: 'input', fixedValue: '' }]);
  };

  const updateResult = (i: number, patch: Partial<OpResult>) => {
    setResults((prev) => prev.map((r, j) => (j === i ? { ...r, ...patch } : r)));
  };
  const removeResult = (i: number) => setResults((prev) => prev.filter((_, j) => j !== i));
  const addResult = () => {
    const nextKey = `r${results.length + 1}`;
    setResults((prev) => [...prev, { key: nextKey, label: '', formula: '', unit: '', highlight: false }]);
  };

  const handleTest = () => {
    const testOp: Operation = { id: 'test', name: '', description: '', fields, results, summaryTemplate };
    setTestResult(executeOperation(testOp, testInputs));
  };

  const handleSave = () => {
    if (!name.trim()) return;
    onSave({
      id: operation?.id || uid(),
      name: name.trim(),
      description: description.trim(),
      fields,
      results,
      summaryTemplate,
    });
  };

  const canSave =
    name.trim() && fields.length > 0 && results.length > 0 && results.every((r) => r.formula.trim());

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, paddingBottom: 20 }}>
      {/* Name + Description */}
      <div>
        <Label>Name der Operation</Label>
        <MiniInput value={name} onChange={setName} placeholder="z.B. Stückzahl + Restlänge" />
      </div>
      <div>
        <Label>Beschreibung</Label>
        <MiniInput value={description} onChange={setDescription} placeholder="Kurze Erklärung…" />
      </div>

      {/* ── FIELDS ── */}
      <div>
        <Label>Eingabe-Felder</Label>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {fields.map((f, i) => (
            <div
              key={i}
              style={{
                border: `1px solid ${tokens.border}`,
                borderRadius: 12,
                padding: 10,
                background: tokens.bg,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <span
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: 8,
                    background: tokens.accentDim,
                    border: `1px solid ${tokens.accent}40`,
                    color: tokens.accent,
                    fontSize: 13,
                    fontFamily: tokens.font.mono,
                    fontWeight: 700,
                    display: 'grid',
                    placeItems: 'center',
                    flexShrink: 0,
                  }}
                >
                  {f.key}
                </span>
                <MiniInput
                  value={f.label}
                  onChange={(v) => updateField(i, { label: v })}
                  placeholder="Bezeichnung"
                  style={{ flex: 1 }}
                />
                <button
                  onClick={() => removeField(i)}
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: 8,
                    border: `1px solid ${tokens.danger}40`,
                    background: `${tokens.danger}18`,
                    color: tokens.danger,
                    fontSize: 12,
                    cursor: 'pointer',
                    flexShrink: 0,
                    display: 'grid',
                    placeItems: 'center',
                  }}
                >
                  ✕
                </button>
              </div>
              <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                <button
                  onClick={() => updateField(i, { type: f.type === 'input' ? 'fixed' : 'input' })}
                  style={{
                    height: 30,
                    padding: '0 10px',
                    borderRadius: 8,
                    border: `1px solid ${f.type === 'fixed' ? '#f59e0b40' : tokens.accent + '40'}`,
                    background: f.type === 'fixed' ? '#f59e0b18' : tokens.accentDim,
                    color: f.type === 'fixed' ? '#f59e0b' : tokens.accent,
                    fontSize: 11,
                    fontWeight: 700,
                    cursor: 'pointer',
                    fontFamily: tokens.font.ui,
                    whiteSpace: 'nowrap',
                  }}
                >
                  {f.type === 'fixed' ? '⊙ Festwert' : '⌨ Eingabe'}
                </button>
                <MiniInput
                  value={f.unit}
                  onChange={(v) => updateField(i, { unit: v })}
                  placeholder="Einheit"
                  style={{ width: 70 }}
                />
                {f.type === 'fixed' && (
                  <MiniInput
                    value={f.fixedValue}
                    onChange={(v) => updateField(i, { fixedValue: v })}
                    placeholder="Wert"
                    mono
                    style={{ width: 80 }}
                  />
                )}
              </div>
            </div>
          ))}
        </div>
        <button
          onClick={addField}
          style={{
            marginTop: 8,
            width: '100%',
            height: 36,
            borderRadius: 10,
            border: `1px dashed ${tokens.border}`,
            background: 'transparent',
            color: tokens.muted,
            fontSize: 12,
            cursor: 'pointer',
            fontFamily: tokens.font.ui,
          }}
        >
          + Feld hinzufügen
        </button>
      </div>

      {/* ── RESULTS ── */}
      <div>
        <Label>Ergebnis-Felder</Label>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {results.map((r, i) => (
            <div
              key={i}
              style={{
                border: `1px solid ${tokens.border}`,
                borderRadius: 12,
                padding: 10,
                background: tokens.bg,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <span
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: 8,
                    background: r.highlight ? `${tokens.success}18` : tokens.surface,
                    border: `1px solid ${r.highlight ? tokens.success + '40' : tokens.border}`,
                    color: r.highlight ? tokens.success : tokens.muted,
                    fontSize: 11,
                    fontFamily: tokens.font.mono,
                    fontWeight: 700,
                    display: 'grid',
                    placeItems: 'center',
                    flexShrink: 0,
                  }}
                >
                  {r.key}
                </span>
                <MiniInput
                  value={r.label}
                  onChange={(v) => updateResult(i, { label: v })}
                  placeholder="Bezeichnung"
                  style={{ flex: 1 }}
                />
                <button
                  onClick={() => removeResult(i)}
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: 8,
                    border: `1px solid ${tokens.danger}40`,
                    background: `${tokens.danger}18`,
                    color: tokens.danger,
                    fontSize: 12,
                    cursor: 'pointer',
                    flexShrink: 0,
                    display: 'grid',
                    placeItems: 'center',
                  }}
                >
                  ✕
                </button>
              </div>
              <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                <MiniInput
                  value={r.formula}
                  onChange={(v) => updateResult(i, { formula: v })}
                  placeholder="Formel z.B. floor(a / (b + c))"
                  mono
                  style={{ flex: 1 }}
                />
                <MiniInput
                  value={r.unit || ''}
                  onChange={(v) => updateResult(i, { unit: v })}
                  placeholder="Einheit"
                  style={{ width: 60 }}
                />
                <button
                  onClick={() => updateResult(i, { highlight: !r.highlight })}
                  title={r.highlight ? 'Hauptergebnis' : 'Nebenergebnis'}
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: 8,
                    border: `1px solid ${r.highlight ? tokens.success + '40' : tokens.border}`,
                    background: r.highlight ? `${tokens.success}18` : 'transparent',
                    color: r.highlight ? tokens.success : tokens.muted,
                    fontSize: 14,
                    cursor: 'pointer',
                    display: 'grid',
                    placeItems: 'center',
                    flexShrink: 0,
                  }}
                >
                  ★
                </button>
              </div>
            </div>
          ))}
        </div>
        <button
          onClick={addResult}
          style={{
            marginTop: 8,
            width: '100%',
            height: 36,
            borderRadius: 10,
            border: `1px dashed ${tokens.border}`,
            background: 'transparent',
            color: tokens.muted,
            fontSize: 12,
            cursor: 'pointer',
            fontFamily: tokens.font.ui,
          }}
        >
          + Ergebnis hinzufügen
        </button>
      </div>

      {/* Summary Template */}
      <div>
        <Label>Verlauf-Zusammenfassung</Label>
        <MiniInput
          value={summaryTemplate}
          onChange={setSummaryTemplate}
          placeholder="z.B. {r1} Stück, {r2} mm Rest"
          mono
        />
        <div style={{ fontSize: 10, color: tokens.muted, marginTop: 4 }}>
          Verwende {'{r1}'}, {'{r2}'} etc. als Platzhalter
        </div>
      </div>

      {/* ── TEST ── */}
      <div
        style={{
          border: `1px solid ${tokens.border}`,
          borderRadius: 12,
          padding: 12,
          background: tokens.surface,
        }}
      >
        <Label>Test</Label>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 8 }}>
          {fields
            .filter((f) => f.type === 'input')
            .map((f) => (
              <div key={f.key} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <span style={{ fontSize: 11, fontFamily: tokens.font.mono, color: tokens.accent }}>
                  {f.key}:
                </span>
                <MiniInput
                  value={testInputs[f.key] || ''}
                  onChange={(v) => setTestInputs((p) => ({ ...p, [f.key]: v }))}
                  placeholder={f.label || f.key}
                  mono
                  style={{ width: 80 }}
                />
              </div>
            ))}
          <button
            onClick={handleTest}
            style={{
              height: 38,
              padding: '0 14px',
              borderRadius: 8,
              border: 'none',
              background: tokens.accent,
              color: '#0b0d10',
              fontSize: 12,
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            Testen
          </button>
        </div>
        {testResult && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {testResult.lines.map((l, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '4px 8px',
                  borderRadius: 6,
                  background: l.highlight ? tokens.accentDim : 'transparent',
                }}
              >
                <span style={{ fontSize: 11, color: tokens.muted }}>{l.label}</span>
                <span
                  style={{
                    fontSize: 12,
                    fontFamily: tokens.font.mono,
                    color: l.highlight ? tokens.accent : tokens.text,
                    fontWeight: l.highlight ? 700 : 400,
                  }}
                >
                  {l.value}
                </span>
              </div>
            ))}
            <div style={{ fontSize: 10, color: tokens.muted, marginTop: 2 }}>
              Zusammenfassung: {testResult.summary}
            </div>
          </div>
        )}
      </div>

      {/* ── ACTIONS ── */}
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
          onClick={handleSave}
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
          Speichern
        </button>
      </div>
    </div>
  );
}
