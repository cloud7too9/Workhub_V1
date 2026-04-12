import { useState, useRef, useEffect, useCallback } from 'react';
import { ChevronDown, Check } from 'lucide-react';

interface DropdownOption {
  id: string;
  label: string;
  icon?: React.ReactNode;
}

interface DropdownProps {
  options: DropdownOption[];
  value?: string;
  onChange: (id: string) => void;
  placeholder?: string;
  label?: string;
}

export function Dropdown({ options, value, onChange, placeholder = 'Auswählen…', label }: DropdownProps) {
  const [open, setOpen] = useState(false);
  const [focusIdx, setFocusIdx] = useState(-1);
  const ref = useRef<HTMLDivElement>(null);
  const selected = options.find(o => o.id === value);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (!open) {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
        e.preventDefault();
        setOpen(true);
        setFocusIdx(0);
      }
      return;
    }
    switch (e.key) {
      case 'ArrowDown': e.preventDefault(); setFocusIdx(i => Math.min(i + 1, options.length - 1)); break;
      case 'ArrowUp': e.preventDefault(); setFocusIdx(i => Math.max(i - 1, 0)); break;
      case 'Enter': case ' ':
        e.preventDefault();
        if (focusIdx >= 0 && focusIdx < options.length) {
          const opt = options[focusIdx];
          if (opt) { onChange(opt.id); setOpen(false); }
        }
        break;
      case 'Escape': setOpen(false); break;
    }
  }, [open, focusIdx, options, onChange]);

  return (
    <div ref={ref} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-xs)', position: 'relative' }}>
      {label && <span id={`${label}-label`} style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-2)' }}>{label}</span>}
      <button
        onClick={() => { setOpen(!open); setFocusIdx(open ? -1 : 0); }}
        onKeyDown={handleKeyDown}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-labelledby={label ? `${label}-label` : undefined}
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: 'var(--sp-md) var(--sp-lg)',
          background: 'var(--surface)', border: '1px solid var(--border)',
          borderRadius: 'var(--radius-md)', cursor: 'pointer',
          fontSize: '15px', fontFamily: 'var(--font-sans)',
          color: selected ? 'var(--text-1)' : 'var(--text-3)',
          minHeight: '48px', transition: 'border-color 0.15s ease',
          borderColor: open ? 'var(--accent)' : undefined,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-sm)' }}>
          {selected?.icon}
          <span>{selected?.label ?? placeholder}</span>
        </div>
        <ChevronDown size={18} color="var(--text-3)" style={{
          transition: 'transform 0.2s ease',
          transform: open ? 'rotate(180deg)' : 'rotate(0)',
        }} />
      </button>

      {open && (
        <div
          role="listbox"
          aria-label={label ?? 'Optionen'}
          style={{
            position: 'absolute', top: '100%', left: 0, right: 0,
            marginTop: 'var(--sp-xs)', zIndex: 60,
            background: 'var(--surface)', border: '1px solid var(--border)',
            borderRadius: 'var(--radius-md)', overflow: 'hidden',
            boxShadow: 'var(--shadow-lg)', animation: 'scaleIn 0.15s ease',
          }}
        >
          {options.map((opt, i) => {
            const isSelected = opt.id === value;
            const isFocused = i === focusIdx;
            return (
              <button
                key={opt.id}
                role="option"
                aria-selected={isSelected}
                onClick={() => { onChange(opt.id); setOpen(false); }}
                style={{
                  display: 'flex', alignItems: 'center', gap: 'var(--sp-sm)',
                  width: '100%', padding: 'var(--sp-md) var(--sp-lg)',
                  border: 'none', cursor: 'pointer',
                  fontSize: '14px', fontFamily: 'var(--font-sans)', textAlign: 'left',
                  background: isFocused ? 'var(--surface-alt)' : isSelected ? 'var(--accent-muted)' : 'transparent',
                  color: isSelected ? 'var(--accent)' : 'var(--text-1)',
                  fontWeight: isSelected ? 600 : 400,
                  transition: 'background 0.1s ease',
                  outline: isFocused ? '2px solid var(--accent)' : 'none',
                  outlineOffset: '-2px',
                }}
              >
                {opt.icon}
                <span style={{ flex: 1 }}>{opt.label}</span>
                {isSelected && <Check size={16} />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
