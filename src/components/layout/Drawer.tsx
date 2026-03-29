import { useLocation, useNavigate } from 'react-router-dom';
import { tokens } from '../../styles/tokens';

interface NavItem {
  label: string;
  group: string;
  path: string;
}

const navItems: NavItem[] = [
  { label: 'Handbuch', group: 'Werkstoffe', path: '/' },
  { label: 'Rechner', group: 'Tools', path: '/rechner' },
  { label: 'Aufträge', group: 'Verwaltung', path: '/auftraege' },
  { label: 'Einstellungen', group: 'System', path: '/einstellungen' },
];

interface DrawerProps {
  open: boolean;
  onClose: () => void;
}

export function Drawer({ open, onClose }: DrawerProps) {
  const location = useLocation();
  const navigate = useNavigate();

  const handleNav = (path: string) => {
    navigate(path);
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      {open && (
        <div
          onClick={onClose}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 90,
            background: 'rgba(0,0,0,0.6)',
            animation: 'fadeIn 0.2s ease',
          }}
        />
      )}

      {/* Drawer Panel */}
      <aside
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          bottom: 0,
          zIndex: 100,
          width: 280,
          background: tokens.surface,
          borderRight: `1px solid ${tokens.border}`,
          transform: open ? 'translateX(0)' : 'translateX(-100%)',
          transition: 'transform 0.25s ease',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Drawer Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '16px 20px',
            borderBottom: `1px solid ${tokens.border}`,
          }}
        >
          <span
            style={{
              fontSize: 16,
              fontWeight: 600,
              color: tokens.text,
            }}
          >
            Navigation
          </span>
          <button
            onClick={onClose}
            aria-label="Navigation schließen"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 36,
              height: 36,
              background: 'none',
              border: 'none',
              color: tokens.muted,
              fontSize: 18,
              cursor: 'pointer',
              borderRadius: tokens.radius.sm,
            }}
          >
            ✕
          </button>
        </div>

        {/* Nav Items */}
        <nav style={{ flex: 1, padding: '12px 0', overflowY: 'auto' }}>
          <ul style={{ listStyle: 'none' }}>
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <li key={item.path}>
                  <button
                    onClick={() => handleNav(item.path)}
                    style={{
                      width: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 2,
                      padding: '14px 20px',
                      minHeight: tokens.touch.minHeight,
                      background: isActive ? tokens.accentDim : 'transparent',
                      border: 'none',
                      borderLeft: isActive
                        ? `3px solid ${tokens.accent}`
                        : '3px solid transparent',
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'background 0.15s ease',
                    }}
                  >
                    <span
                      style={{
                        fontSize: 15,
                        fontWeight: isActive ? 600 : 400,
                        color: isActive ? tokens.accent : tokens.text,
                      }}
                    >
                      {item.label}
                    </span>
                    <span
                      style={{
                        fontSize: 11,
                        color: tokens.muted,
                        fontFamily: tokens.font.mono,
                      }}
                    >
                      {item.group}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Footer */}
        <div
          style={{
            padding: '16px 20px',
            borderTop: `1px solid ${tokens.border}`,
            fontSize: 11,
            color: tokens.muted,
            fontFamily: tokens.font.mono,
          }}
        >
          WorkHub v1.0
        </div>
      </aside>
    </>
  );
}
