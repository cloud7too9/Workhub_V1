import type { CardProps } from './Card.types';

const paddings = { sm: '12px', md: '16px', lg: '24px' };

const variantStyles: Record<string, React.CSSProperties> = {
  default: { background: 'var(--surface)', border: '1px solid var(--border-subtle)' },
  outlined: { background: 'transparent', border: '1px solid var(--border)' },
  elevated: { background: 'var(--surface)', boxShadow: 'var(--shadow-md)' },
  accent: { background: 'var(--accent-muted)', border: '1px solid rgba(0,229,255,0.15)' },
};

export function Card({ children, variant = 'default', padding = 'md', onClick, style }: CardProps) {
  return (
    <div
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onClick={onClick}
      style={{
        borderRadius: 'var(--radius-lg)',
        padding: paddings[padding],
        cursor: onClick ? 'pointer' : undefined,
        transition: 'all 0.15s ease',
        ...variantStyles[variant],
        ...style,
      }}
    >
      {children}
    </div>
  );
}
