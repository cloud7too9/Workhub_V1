import { useLocation, useNavigate } from 'react-router-dom';
import { tokens } from '../../styles/tokens';
import { getSidebarItems } from '../../data/navigation';
import { Backdrop, SideDrawer, OverlayHeader } from '../shared/Overlay';

interface DrawerProps {
  open: boolean;
  onClose: () => void;
}

export function Drawer({ open, onClose }: DrawerProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const navItems = getSidebarItems();

  const handleNav = (path: string) => {
    navigate(path);
    onClose();
  };

  return (
    <>
      {open && <Backdrop onClick={onClose} />}

      <SideDrawer open={open} side="left" width={280}>
        <OverlayHeader title="Navigation" onClose={onClose} />

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
                      alignItems: 'center',
                      gap: 12,
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
                        color: isActive ? tokens.accent : tokens.muted,
                        display: 'flex',
                        flexShrink: 0,
                      }}
                    >
                      {item.icon}
                    </span>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      <span
                        style={{
                          fontSize: 15,
                          fontWeight: isActive ? 600 : 400,
                          color: isActive ? tokens.accent : tokens.text,
                        }}
                      >
                        {item.label}
                      </span>
                      {item.group && (
                        <span
                          style={{
                            fontSize: 11,
                            color: tokens.muted,
                            fontFamily: tokens.font.mono,
                          }}
                        >
                          {item.group}
                        </span>
                      )}
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

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
      </SideDrawer>
    </>
  );
}
