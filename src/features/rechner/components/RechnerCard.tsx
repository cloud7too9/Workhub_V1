import { useState } from 'react';
import { X, RotateCcw, ChevronDown } from 'lucide-react';
import type { RechnerCard as RechnerCardType, Operation, ComputedResult } from '@/types/rechner';
import { executeOperation, buildInputSummary } from '@/data/operations';
import { Button } from '@/ui';
import { HistoryItem } from './HistoryItem';

let _id = Date.now();
function uid() { return `h_${_id++}`; }

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
      id: uid(), timestamp: Date.now(),
      summary: res.summary, inputSummary: buildInputSummary(op, inputs),
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
    <div style={{
      border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)',
      background: 'var(--surface)', overflow: 'hidden',
    }}>
      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '12px 14px', borderBottom: '1px solid var(--border-subtle)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            width: 8, height: 8, borderRadius: '50%',
            background: op ? 'var(--accent)' : 'var(--text-3)', flexShrink: 0,
          }} />
          <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-1)' }}>Rechner</span>
        </div>
        <button
          onClick={() => onRemove(card.id)}
          style={{
            width: 32, height: 32, borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--border)', background: 'transparent',
            color: 'var(--text-3)', cursor: 'pointer', display: 'grid', placeItems: 'center',
          }}
        >
          <X size={14} />
        </button>
      </div>

      <div style={{ padding: '14px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {/* Operation Selector */}
        <div>
          <div style={{
            fontSize: '10px', color: 'var(--text-3)', fontWeight: 700,
            textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '4px',
          }}>
            Rechenoperation
          </div>
          <select
            value={card.operationId || ''}
            onChange={(e) => handleOpChange(e.target.value)}
            style={{
              width: '100%', height: '44px', borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border)', background: 'var(--bg)',
              color: 'var(--text-1)', padding: '0 12px', fontSize: '14px',
              fontFamily: 'var(--font-sans)', outline: 'none', cursor: 'pointer',
            }}
          >
            <option value="" disabled>Operation wählen…</option>
            {operations.map((o) => <option key={o.id} value={o.id}>{o.name}</option>)}
          </select>
          {op?.description && (
            <div style={{ fontSize: '11px', color: 'var(--text-3)', marginTop: '4px' }}>{op.description}</div>
          )}
        </div>

        {/* Input Fields */}
        {op && (
          <>
            <div style={{ display: 'grid', gap: '10px' }}>
              {op.fields.map((f) => (
                <div key={f.key}>
                  <div style={{
                    fontSize: '11px', color: 'var(--text-3)', fontWeight: 600, marginBottom: '4px',
                    display: 'flex', justifyContent: 'space-between',
                  }}>
                    <span>{f.label || f.key}{f.unit ? ` (${f.unit})` : ''}</span>
                    {f.type === 'fixed' && (
                      <span style={{ color: 'var(--warning)', fontSize: '10px' }}>Festwert: {f.fixedValue}</span>
                    )}
                  </div>
                  {f.type === 'input' && (
                    <input
                      type="text" inputMode="decimal"
                      value={inputs[f.key] || ''}
                      onChange={(e) => handleInput(f.key, e.target.value)}
                      onKeyDown={(e) => { if (e.key === 'Enter') handleCalc(); }}
                      style={{
                        width: '100%', height: '46px', borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--border)', background: 'var(--bg)',
                        color: 'var(--text-1)', padding: '0 12px', fontSize: '16px',
                        fontFamily: 'var(--font-mono)', outline: 'none',
                      }}
                    />
                  )}
                </div>
              ))}
            </div>

            {/* Buttons */}
            <div style={{ display: 'flex', gap: '8px' }}>
              <Button variant="primary" onClick={handleCalc} fullWidth>Berechnen</Button>
              <button
                onClick={handleClear} title="Löschen"
                style={{
                  width: 48, height: 48, borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border)', background: 'transparent',
                  color: 'var(--text-3)', cursor: 'pointer', display: 'grid', placeItems: 'center',
                }}
              >
                <RotateCcw size={16} />
              </button>
            </div>
          </>
        )}

        {/* Result */}
        {result && (
          <div style={{
            border: '1px solid rgba(0,229,255,0.25)', borderRadius: 'var(--radius-md)',
            padding: '12px', background: 'var(--accent-muted)', display: 'grid', gap: '6px',
          }}>
            {result.lines.map((l, i) => (
              <div key={i} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '8px 12px', borderRadius: 'var(--radius-md)',
                background: l.highlight ? 'var(--accent-muted)' : 'transparent',
                border: l.highlight ? '1px solid rgba(0,229,255,0.25)' : '1px solid var(--border-subtle)',
              }}>
                <span style={{ fontSize: '12px', color: 'var(--text-3)' }}>{l.label}</span>
                <span style={{
                  fontSize: l.highlight ? '20px' : '14px',
                  fontWeight: l.highlight ? 900 : 600,
                  fontFamily: 'var(--font-mono)',
                  color: l.highlight ? 'var(--accent)' : 'var(--text-1)',
                }}>
                  {l.value}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* History */}
      {history.length > 0 && (
        <div style={{ borderTop: '1px solid var(--border-subtle)' }}>
          <button
            onClick={() => setHistoryOpen(!historyOpen)}
            style={{
              width: '100%', display: 'flex', justifyContent: 'space-between',
              alignItems: 'center', padding: '10px 14px', background: 'none',
              border: 'none', cursor: 'pointer', color: 'var(--text-3)',
              fontSize: '12px', fontFamily: 'var(--font-sans)', fontWeight: 600,
            }}
          >
            <span>Verlauf ({history.length})</span>
            <ChevronDown size={14} style={{
              transition: 'transform 0.2s',
              transform: historyOpen ? 'rotate(180deg)' : 'rotate(0deg)',
            }} />
          </button>
          {historyOpen && (
            <div style={{
              padding: '0 14px 14px', display: 'flex', flexDirection: 'column',
              gap: '6px', maxHeight: '240px', overflowY: 'auto',
            }}>
              {history.map((e) => <HistoryItem key={e.id} entry={e} />)}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
