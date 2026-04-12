import { useNavigate } from 'react-router-dom';
import { X } from 'lucide-react';
import { routes } from '../routes/route-config';

interface SidebarProps {
  open: boolean;
  onClose: () => void;
  activePath: string;
}

export function Sidebar({ open, onClose, activePath }: SidebarProps) {
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
          aria-hidden="true"
          style={{
            position: 'fixed', inset: 0, zIndex: 90,
            background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)',
            animation: 'fadeIn 0.2s ease',
          }}
        />
      )}

      {/* Panel */}
      <aside style={{
        position: 'fixed',
        top: 0, left: 0, bottom: 0,
        zIndex: 100,
        width: '280px',
        background: 'var(--surface)',
        borderRight: '1px solid var(--border)',
        transform: open ? 'translateX(0)' : 'translateX(-100%)',
        transition: 'transform 0.25s cubic-bezier(0.32, 0.72, 0, 1)',
        display: 'flex',
        flexDirection: 'column',
      }}>
        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: 'var(--sp-lg) var(--sp-xl)',
          borderBottom: '1px solid var(--border-subtle)',
        }}>
          <span style={{ fontSize: '17px', fontWeight: 700, color: 'var(--text-1)' }}>
            WorkHub
          </span>
          <button
            onClick={onClose}
            aria-label="Menü schließen"
            style={{
              width: '36px', height: '36px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              borderRadius: 'var(--radius-sm)', border: 'none',
              background: 'var(--surface-alt)', cursor: 'pointer',
              color: 'var(--text-2)',
            }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Nav Items */}
        <nav style={{ flex: 1, padding: 'var(--sp-md) 0', overflowY: 'auto' }}>
          {routes.map(r => {
            const isActive = r.path === activePath;
            const Icon = r.icon;
            return (
              <button
                key={r.id}
                onClick={() => handleNav(r.path)}
                style={{
                  width: '100%',
                  display: 'flex', alignItems: 'center', gap: 'var(--sp-md)',
                  padding: 'var(--sp-md) var(--sp-xl)',
                  minHeight: '48px',
                  background: isActive ? 'var(--accent-muted)' : 'transparent',
                  border: 'none',
                  borderLeft: isActive ? '3px solid var(--accent)' : '3px solid transparent',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'background 0.15s ease',
                }}
              >
                <Icon size={18} color={isActive ? 'var(--accent)' : 'var(--text-3)'} />
                <div>
                  <div style={{
                    fontSize: '15px',
                    fontWeight: isActive ? 600 : 400,
                    color: isActive ? 'var(--accent)' : 'var(--text-1)',
                  }}>
                    {r.label}
                  </div>
                  {r.subtitle && (
                    <div style={{
                      fontSize: '11px', color: 'var(--text-3)',
                      fontFamily: 'var(--font-mono)',
                    }}>
                      {r.subtitle}
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </nav>

        {/* Footer */}
        <div style={{
          padding: 'var(--sp-lg) var(--sp-xl)',
          borderTop: '1px solid var(--border-subtle)',
          fontSize: '11px', color: 'var(--text-3)',
          fontFamily: 'var(--font-mono)',
        }}>
          WorkHub v1.0 · CNC Recknagel
        </div>
      </aside>
    </>
  );
}
