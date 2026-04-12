import { useId } from 'react';
import type { InputProps } from './Input.types';

export function Input({ label, error, hint, style, id: externalId, ...rest }: InputProps) {
  const autoId = useId();
  const inputId = externalId ?? autoId;
  const errorId = error ? `${inputId}-error` : undefined;
  const hintId = hint && !error ? `${inputId}-hint` : undefined;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      {label && <label htmlFor={inputId} style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-2)' }}>{label}</label>}
      <input
        id={inputId}
        aria-invalid={error ? true : undefined}
        aria-describedby={errorId ?? hintId}
        style={{
          padding: '12px 16px',
          fontSize: '15px',
          fontFamily: 'var(--font-sans)',
          background: 'var(--surface)',
          border: `1px solid ${error ? 'var(--error)' : 'var(--border)'}`,
          borderRadius: 'var(--radius-md)',
          color: 'var(--text-1)',
          outline: 'none',
          transition: 'border-color 0.15s ease, box-shadow 0.15s ease',
          minHeight: '48px',
          ...style,
        }}
        {...rest}
      />
      {error && <span id={errorId} role="alert" style={{ fontSize: '12px', color: 'var(--error)' }}>{error}</span>}
      {hint && !error && <span id={hintId} style={{ fontSize: '12px', color: 'var(--text-3)' }}>{hint}</span>}
    </div>
  );
}
