import { Plus, Trash2, ArrowUp, ArrowDown } from 'lucide-react';
import type { ArbeitsgangPhase } from '@/types/workpieces';
import { arbeitsgangPhaseLabels } from '@/types/workpieces';
import type { WerkstueckArbeitsgangFormData } from '../types/ui.types';

interface ArbeitsgangEditorProps {
  value: WerkstueckArbeitsgangFormData[];
  onChange: (value: WerkstueckArbeitsgangFormData[]) => void;
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  height: 40,
  borderRadius: 10,
  border: '1px solid var(--border)',
  background: 'var(--bg)',
  color: 'var(--text-1)',
  padding: '0 10px',
  fontSize: 13,
  fontFamily: 'var(--font-sans)',
  outline: 'none',
};

const iconBtnStyle: React.CSSProperties = {
  width: 32,
  height: 32,
  borderRadius: 8,
  border: '1px solid var(--border)',
  background: 'transparent',
  color: 'var(--text-3)',
  cursor: 'pointer',
  display: 'grid',
  placeItems: 'center',
};

export function ArbeitsgangEditor({ value, onChange }: ArbeitsgangEditorProps) {
  const updateAt = (idx: number, patch: Partial<WerkstueckArbeitsgangFormData>) => {
    onChange(value.map((a, i) => (i === idx ? { ...a, ...patch } : a)));
  };

  const removeAt = (idx: number) => {
    onChange(value.filter((_, i) => i !== idx));
  };

  const move = (idx: number, dir: -1 | 1) => {
    const target = idx + dir;
    if (target < 0 || target >= value.length) return;
    const next = [...value];
    const a = next[idx]!;
    const b = next[target]!;
    next[idx] = b;
    next[target] = a;
    onChange(next.map((x, i) => ({ ...x, sequence: i + 1 })));
  };

  const add = () => {
    onChange([
      ...value,
      { name: '', phase: 'machining', sequence: value.length + 1, description: '' },
    ]);
  };

  return (
    <div style={{ display: 'grid', gap: 8 }}>
      {value.map((a, idx) => (
        <div
          key={idx}
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 130px auto',
            gap: 6,
            alignItems: 'center',
          }}
        >
          <input
            style={inputStyle}
            value={a.name}
            onChange={(e) => updateAt(idx, { name: e.target.value })}
            placeholder={`Arbeitsgang ${idx + 1}`}
          />
          <select
            value={a.phase}
            onChange={(e) => updateAt(idx, { phase: e.target.value as ArbeitsgangPhase })}
            style={{ ...inputStyle, cursor: 'pointer' }}
          >
            {(Object.entries(arbeitsgangPhaseLabels) as [ArbeitsgangPhase, string][]).map(
              ([val, label]) => (
                <option key={val} value={val}>
                  {label}
                </option>
              ),
            )}
          </select>
          <div style={{ display: 'flex', gap: 4 }}>
            <button type="button" style={iconBtnStyle} onClick={() => move(idx, -1)} aria-label="Nach oben">
              <ArrowUp size={14} />
            </button>
            <button type="button" style={iconBtnStyle} onClick={() => move(idx, 1)} aria-label="Nach unten">
              <ArrowDown size={14} />
            </button>
            <button type="button" style={iconBtnStyle} onClick={() => removeAt(idx)} aria-label="Entfernen">
              <Trash2 size={14} />
            </button>
          </div>
        </div>
      ))}
      <button
        type="button"
        onClick={add}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          height: 40,
          borderRadius: 10,
          border: '1px dashed var(--border)',
          background: 'transparent',
          color: 'var(--text-3)',
          cursor: 'pointer',
          fontSize: 13,
          fontFamily: 'var(--font-sans)',
          justifyContent: 'center',
        }}
      >
        <Plus size={14} /> Arbeitsgang hinzufügen
      </button>
    </div>
  );
}
