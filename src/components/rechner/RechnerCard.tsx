import { useState } from 'react';
import type { RechnerCard as RechnerCardType, Operation, ComputedResult } from '../../types/rechner';
import { executeOperation, buildInputSummary } from '../../data/operations';
import { tokens } from '../../styles/tokens';
import { HistoryItem } from './HistoryItem';

let _id = Date.now();
function uid() {
  return `h_${_id++}`;
}

interface RechnerCardProps {
  card: RechnerCardType;
  operations: Operation[];
  onUpdate: (card: RechnerCardType) => void;
  onRemove: (id: string) => void;
}

export function RechnerCard({ card, operations, onUpdate, onRemove }: RechnerCardProps) {
  const [inputs, setInputs] = useState<Record<string, string>>(card.inputs || {});
  const [result, setResult] = useState<ComputedResult | null>(null);
  const [historyOpen, setHistoryOpen] = useState(false);

  const op = operations.find((o) => o.id === card.operationId);

  const handleOpChange = (opId: string) => {
    setInputs({});
    setResult(null);
    onUpdate({ ...card, operationId: opId, inputs: {} });
  };

  const handleInput = (key: string, value: string) => {
    const next = { ...inputs, [key]: value };
    setInputs(next);
    onUpdate({ ...card, inputs: next });
  };

  const handleCalc = () => {
    if (!op) return;
    const res = executeOperation(op, inputs);
    if (!res) return;
    setResult(res);

    const entry = {
      id: uid(),
      timestamp: Date.now(),
      summary: res.summary,
      inputSummary: buildInputSummary(op, inputs),
    };
    const history = [entry, ...(card.history || [])].slice(0, 50);
    onUpdate({ ...card, inputs, history });
  };

  const handleClear = () => {
    setInputs({});
    setResult(null);
    onUpdate({ ...card, inputs: {} });
  };

  const history = card.history || [];

  return (
    <div
      style={{
        border: `1px solid ${tokens.border}`,
        borderRadius: 16,
        background: tokens.surface,
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '12px 14px',
          borderBottom: `1px solid ${tokens.border}`,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: op ? tokens.accent : tokens.muted,
              flexShrink: 0,
            }}
          />
          <span style={{ fontSize: 14, fontWeight: 600, color: tokens.text }}>Rechner</span>
        </div>
        <button
          onClick={() => onRemove(card.id)}
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

      <div style={{ padding: 14, display: 'flex', flexDirection: 'column', gap: 12 }}>
        {/* Operation Selector */}
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
            Rechenoperation
          </div>
          <select
            value={card.operationId || ''}
            onChange={(e) => handleOpChange(e.target.value)}
            style={{
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
              cursor: 'pointer',
            }}
          >
            <option value="" disabled>
              Operation wählen…
            </option>
            {operations.map((o) => (
              <option key={o.id} value={o.id}>
                {o.name}
              </option>
            ))}
          </select>
          {op?.description && (
            <div style={{ fontSize: 11, color: tokens.muted, marginTop: 4 }}>
              {op.description}
            </div>
          )}
        </div>

        {/* Input Fields */}
        {op && (
          <>
            <div style={{ display: 'grid', gap: 10 }}>
              {op.fields.map((f) => (
                <div key={f.key}>
                  <div
                    style={{
                      fontSize: 11,
                      color: tokens.muted,
                      fontWeight: 600,
                      marginBottom: 4,
                      display: 'flex',
                      justifyContent: 'space-between',
                    }}
                  >
                    <span>
                      {f.label || f.key}
                      {f.unit ? ` (${f.unit})` : ''}
                    </span>
                    {f.type === 'fixed' && (
                      <span style={{ color: '#f59e0b', fontSize: 10 }}>
                        Festwert: {f.fixedValue}
                      </span>
                    )}
                  </div>
                  {f.type === 'input' && (
                    <input
                      type="text"
                      inputMode="decimal"
                      value={inputs[f.key] || ''}
                      onChange={(e) => handleInput(f.key, e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleCalc();
                      }}
                      style={{
                        width: '100%',
                        height: 46,
                        borderRadius: 12,
                        border: `1px solid ${tokens.border}`,
                        background: tokens.bg,
                        color: tokens.text,
                        padding: '0 12px',
                        fontSize: 16,
                        fontFamily: tokens.font.mono,
                        outline: 'none',
                      }}
                    />
                  )}
                </div>
              ))}
            </div>

            {/* Buttons */}
            <div style={{ display: 'flex', gap: 8 }}>
              <button
                onClick={handleCalc}
                style={{
                  flex: 1,
                  height: 48,
                  borderRadius: 12,
                  border: 'none',
                  background: tokens.accent,
                  color: '#0b0d10',
                  fontSize: 14,
                  fontWeight: 700,
                  fontFamily: tokens.font.ui,
                  cursor: 'pointer',
                }}
              >
                Berechnen
              </button>
              <button
                onClick={handleClear}
                title="Löschen"
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 12,
                  border: `1px solid ${tokens.border}`,
                  background: 'transparent',
                  color: tokens.muted,
                  fontSize: 13,
                  cursor: 'pointer',
                  display: 'grid',
                  placeItems: 'center',
                }}
              >
                ↺
              </button>
            </div>
          </>
        )}

        {/* Result */}
        {result && (
          <div
            style={{
              border: `1px solid ${tokens.borderFocus}`,
              borderRadius: 12,
              padding: 12,
              background: 'rgba(138,180,255,0.04)',
              display: 'grid',
              gap: 6,
            }}
          >
            {result.lines.map((l, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '8px 12px',
                  borderRadius: 10,
                  background: l.highlight ? tokens.accentDim : 'transparent',
                  border: l.highlight
                    ? `1px solid ${tokens.accent}40`
                    : `1px solid ${tokens.border}`,
                }}
              >
                <span style={{ fontSize: 12, color: tokens.muted }}>{l.label}</span>
                <span
                  style={{
                    fontSize: l.highlight ? 20 : 14,
                    fontWeight: l.highlight ? 900 : 600,
                    fontFamily: tokens.font.mono,
                    color: l.highlight ? tokens.accent : tokens.text,
                  }}
                >
                  {l.value}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* History */}
      {history.length > 0 && (
        <div style={{ borderTop: `1px solid ${tokens.border}` }}>
          <button
            onClick={() => setHistoryOpen(!historyOpen)}
            style={{
              width: '100%',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '10px 14px',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: tokens.muted,
              fontSize: 12,
              fontFamily: tokens.font.ui,
              fontWeight: 600,
            }}
          >
            <span>Verlauf ({history.length})</span>
            <span
              style={{
                transition: 'transform 0.2s',
                transform: historyOpen ? 'rotate(180deg)' : 'rotate(0deg)',
              }}
            >
              ▾
            </span>
          </button>
          {historyOpen && (
            <div
              style={{
                padding: '0 14px 14px',
                display: 'flex',
                flexDirection: 'column',
                gap: 6,
                maxHeight: 240,
                overflowY: 'auto',
              }}
            >
              {history.map((e) => (
                <HistoryItem key={e.id} entry={e} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
