interface ToggleProps {
  checked: boolean;
  onChange: (val: boolean) => void;
  label?: string;
  disabled?: boolean;
  id?: string;
}

export function Toggle({ checked, onChange, label, disabled, id }: ToggleProps) {
  const toggleId = id ?? `toggle-${Math.random().toString(36).slice(2, 8)}`;

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-md)', opacity: disabled ? 0.4 : 1 }}>
      <button
        id={toggleId}
        role="switch"
        aria-checked={checked}
        aria-label={label ?? 'Toggle'}
        disabled={disabled}
        onClick={() => !disabled && onChange(!checked)}
        onKeyDown={(e) => { if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); !disabled && onChange(!checked); } }}
        style={{
          width: '48px',
          height: '28px',
          borderRadius: '14px',
          background: checked ? 'var(--accent)' : 'var(--surface-alt)',
          border: `1px solid ${checked ? 'var(--accent)' : 'var(--border)'}`,
          position: 'relative',
          transition: 'all 0.2s ease',
          cursor: disabled ? 'default' : 'pointer',
          padding: 0,
        }}
      >
        <div style={{
          width: '22px',
          height: '22px',
          borderRadius: '50%',
          background: checked ? 'var(--bg)' : 'var(--text-3)',
          position: 'absolute',
          top: '2px',
          left: checked ? '23px' : '2px',
          transition: 'all 0.2s ease',
        }} />
      </button>
      {label && (
        <label htmlFor={toggleId} style={{ fontSize: '15px', color: 'var(--text-1)', cursor: disabled ? 'default' : 'pointer' }}>
          {label}
        </label>
      )}
    </div>
  );
}
