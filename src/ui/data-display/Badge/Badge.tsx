interface BadgeProps {
  children: React.ReactNode;
  color?: 'accent' | 'success' | 'warning' | 'error' | 'neutral';
}

export function Badge({ children, color = 'accent' }: BadgeProps) {
  const styles: Record<string, { bg: string; fg: string }> = {
    accent:  { bg: 'var(--accent-muted)', fg: 'var(--accent)' },
    success: { bg: 'color-mix(in srgb, var(--success) 12%, transparent)', fg: 'var(--success)' },
    warning: { bg: 'color-mix(in srgb, var(--warning) 12%, transparent)', fg: 'var(--warning)' },
    error:   { bg: 'color-mix(in srgb, var(--error) 12%, transparent)', fg: 'var(--error)' },
    neutral: { bg: 'var(--surface-alt)', fg: 'var(--text-2)' },
  };
  const c = styles[color] ?? styles.accent!;

  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center',
      padding: '4px 10px', fontSize: '11px', fontWeight: 600,
      borderRadius: 'var(--radius-sm)',
      background: c.bg, color: c.fg,
      letterSpacing: '0.02em', textTransform: 'uppercase',
    }}>
      {children}
    </span>
  );
}
