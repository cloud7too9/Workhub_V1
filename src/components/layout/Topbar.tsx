import { tokens } from '../../styles/tokens';

interface TopbarProps {
  title: string;
  subtitle?: string;
  onMenuClick: () => void;
}

export function Topbar({ title, subtitle, onMenuClick }: TopbarProps) {
  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '0 16px',
        height: 56,
        background: tokens.surface,
        borderBottom: `1px solid ${tokens.border}`,
      }}
    >
      <button
        onClick={onMenuClick}
        aria-label="Navigation öffnen"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 40,
          height: 40,
          background: 'none',
          border: 'none',
          color: tokens.text,
          fontSize: 20,
          cursor: 'pointer',
          borderRadius: tokens.radius.sm,
          flexShrink: 0,
        }}
      >
        ☰
      </button>
      <div>
        <div
          style={{
            fontSize: 17,
            fontWeight: 600,
            color: tokens.text,
            letterSpacing: '-0.01em',
          }}
        >
          {title}
        </div>
        {subtitle && (
          <div
            style={{
              fontSize: 12,
              color: tokens.muted,
            }}
          >
            {subtitle}
          </div>
        )}
      </div>
    </header>
  );
}
