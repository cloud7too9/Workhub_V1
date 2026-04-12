import { ChevronRight } from 'lucide-react';

interface ListItemProps {
  title: string;
  subtitle?: string;
  leading?: React.ReactNode;
  trailing?: React.ReactNode;
  showArrow?: boolean;
  onClick?: () => void;
}

export function ListItem({ title, subtitle, leading, trailing, showArrow = true, onClick }: ListItemProps) {
  return (
    <div
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '14px',
        padding: '14px 16px',
        background: 'var(--surface)',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--border-subtle)',
        cursor: onClick ? 'pointer' : undefined,
        transition: 'all 0.15s ease',
      }}
    >
      {leading && (
        <div style={{
          width: '40px', height: '40px', borderRadius: 'var(--radius-md)',
          background: 'var(--accent-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        }}>
          {leading}
        </div>
      )}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: '15px', fontWeight: 500, color: 'var(--text-1)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{title}</div>
        {subtitle && <div style={{ fontSize: '13px', color: 'var(--text-3)', marginTop: '1px' }}>{subtitle}</div>}
      </div>
      {trailing}
      {showArrow && onClick && <ChevronRight size={16} color="var(--text-3)" style={{ flexShrink: 0 }} />}
    </div>
  );
}
