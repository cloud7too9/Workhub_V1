import { type CSSProperties } from 'react';
import type { ButtonProps } from './Button.types';

const base: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '8px',
  fontFamily: 'var(--font-sans)',
  fontWeight: 600,
  border: 'none',
  cursor: 'pointer',
  borderRadius: 'var(--radius-md)',
  transition: 'all 0.15s ease',
  whiteSpace: 'nowrap',
  minHeight: '48px',
};

const sizes: Record<string, CSSProperties> = {
  sm: { padding: '8px 14px', fontSize: '13px', minHeight: '36px' },
  md: { padding: '10px 20px', fontSize: '15px', minHeight: '44px' },
  lg: { padding: '14px 28px', fontSize: '17px', minHeight: '52px' },
};

const variants: Record<string, CSSProperties> = {
  primary: { background: 'var(--accent)', color: 'var(--bg)' },
  secondary: { background: 'var(--surface-alt)', color: 'var(--text-1)', border: '1px solid var(--border)' },
  ghost: { background: 'transparent', color: 'var(--text-2)' },
  danger: { background: 'color-mix(in srgb, var(--error) 12%, transparent)', color: 'var(--error)' },
};

export function Button({
  variant = 'primary',
  size = 'md',
  icon,
  iconRight,
  loading,
  fullWidth,
  disabled,
  style,
  children,
  ...rest
}: ButtonProps) {
  return (
    <button
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      aria-disabled={disabled || undefined}
      style={{
        ...base,
        ...sizes[size],
        ...variants[variant],
        width: fullWidth ? '100%' : undefined,
        opacity: disabled ? 0.4 : 1,
        ...style,
      }}
      {...rest}
    >
      {loading ? <span style={{ animation: 'spin 1s linear infinite', display: 'inline-flex' }} aria-hidden="true">⟳</span> : icon}
      {children}
      {iconRight}
    </button>
  );
}
