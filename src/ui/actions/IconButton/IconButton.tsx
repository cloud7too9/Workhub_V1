import type { CSSProperties } from 'react';

interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  size?: number;
  variant?: 'ghost' | 'surface';
  children: React.ReactNode;
}

export function IconButton({ size = 44, variant = 'ghost', children, style, ...rest }: IconButtonProps) {
  const s: CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: size,
    height: size,
    borderRadius: 'var(--radius-md)',
    border: 'none',
    cursor: 'pointer',
    color: 'var(--text-2)',
    background: variant === 'surface' ? 'var(--surface-alt)' : 'transparent',
    transition: 'all 0.15s ease',
    ...style,
  };
  return <button style={s} {...rest}>{children}</button>;
}
