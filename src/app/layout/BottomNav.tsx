import { useNavigate } from 'react-router-dom';
import { routes } from '../routes/route-config';

interface BottomNavProps {
  activePath: string;
}

export function BottomNav({ activePath }: BottomNavProps) {
  const navigate = useNavigate();
  const activeIndex = routes.findIndex(r => r.path === activePath);

  return (
    <nav aria-label="Hauptnavigation" style={{
      display: 'flex',
      alignItems: 'stretch',
      height: '64px',
      background: 'var(--surface)',
      borderTop: '1px solid var(--border-subtle)',
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      zIndex: 50,
      paddingBottom: 'env(safe-area-inset-bottom)',
    }}>
      {/* Sliding indicator */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: `${(activeIndex / routes.length) * 100}%`,
        width: `${100 / routes.length}%`,
        height: '2px',
        background: 'var(--accent)',
        transition: 'left 0.25s cubic-bezier(0.32, 0.72, 0, 1)',
        boxShadow: '0 0 8px var(--accent)',
      }} />
      {routes.map(r => {
        const isActive = r.path === activePath;
        const Icon = r.icon;
        return (
          <button
            key={r.id}
            onClick={() => navigate(r.path)}
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 'var(--sp-xs)',
              border: 'none',
              background: 'transparent',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
              color: isActive ? 'var(--accent)' : 'var(--text-3)',
            }}
          >
            <div style={{
              transition: 'transform 0.2s ease',
              transform: isActive ? 'scale(1.1)' : 'scale(1)',
            }}>
              <Icon size={20} strokeWidth={isActive ? 2.5 : 1.8} />
            </div>
            <span style={{ fontSize: '10px', fontWeight: isActive ? 700 : 500, letterSpacing: '0.02em' }}>
              {r.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
