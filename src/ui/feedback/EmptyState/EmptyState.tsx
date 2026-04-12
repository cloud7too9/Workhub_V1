interface EmptyStateProps { title: string; description?: string; icon?: React.ReactNode; action?: React.ReactNode; }

export function EmptyState({ title, description, icon, action }: EmptyStateProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '48px 24px', gap: '12px', textAlign: 'center' }}>
      {icon && <div style={{ color: 'var(--text-3)', marginBottom: '4px' }}>{icon}</div>}
      <h3 style={{ fontSize: '17px', fontWeight: 600, color: 'var(--text-1)' }}>{title}</h3>
      {description && <p style={{ fontSize: '14px', color: 'var(--text-3)', maxWidth: '280px', lineHeight: 1.5 }}>{description}</p>}
      {action && <div style={{ marginTop: '8px' }}>{action}</div>}
    </div>
  );
}
