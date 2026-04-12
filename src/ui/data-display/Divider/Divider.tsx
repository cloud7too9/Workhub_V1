interface DividerProps { spacing?: number; label?: string; }

export function Divider({ spacing = 16, label }: DividerProps) {
  const line: React.CSSProperties = { flex: 1, height: '1px', background: 'var(--border-subtle)' };
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: `${spacing}px 0` }}>
      <div style={line} />
      {label && <span style={{ fontSize: '11px', color: 'var(--text-3)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</span>}
      {label && <div style={line} />}
    </div>
  );
}
