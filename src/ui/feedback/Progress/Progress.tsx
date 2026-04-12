interface ProgressProps {
  value: number;
  max?: number;
  size?: 'sm' | 'md';
  color?: 'accent' | 'success' | 'warning' | 'error';
  label?: string;
}

const colorMap: Record<string, string> = {
  accent: 'var(--accent)',
  success: 'var(--success)',
  warning: 'var(--warning)',
  error: 'var(--error)',
};

export function Progress({ value, max = 100, size = 'md', color = 'accent', label }: ProgressProps) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));
  const h = size === 'sm' ? '4px' : '8px';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      {label && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '13px', color: 'var(--text-2)', fontWeight: 500 }}>{label}</span>
          <span style={{ fontSize: '13px', color: 'var(--text-3)', fontFamily: 'var(--font-mono)' }}>{Math.round(pct)}%</span>
        </div>
      )}
      <div style={{ height: h, borderRadius: '99px', background: 'var(--surface-alt)', overflow: 'hidden' }}>
        <div style={{
          height: '100%',
          width: `${pct}%`,
          borderRadius: '99px',
          background: colorMap[color] ?? colorMap.accent,
          transition: 'width 0.4s cubic-bezier(0.32, 0.72, 0, 1)',
        }} />
      </div>
    </div>
  );
}
