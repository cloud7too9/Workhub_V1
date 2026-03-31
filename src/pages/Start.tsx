import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { tokens } from '../styles/tokens';
import { routes } from '../data/navigation';

/* ── Icon-Map (SVG inline, kein extra Paket nötig) ── */
const ICONS: Record<string, JSX.Element> = {
  '/handbuch': (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19.5A2.5 2.5 0 016.5 17H20" />
      <path d="M4 4.5A2.5 2.5 0 016.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15z" />
      <path d="M8 7h8M8 11h6" />
    </svg>
  ),
  '/rechner': (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="2" width="16" height="20" rx="2" />
      <line x1="8" y1="6" x2="16" y2="6" />
      <line x1="8" y1="10" x2="10" y2="10" />
      <line x1="12" y1="10" x2="14" y2="10" />
      <line x1="8" y1="14" x2="10" y2="14" />
      <line x1="12" y1="14" x2="14" y2="14" />
      <line x1="8" y1="18" x2="14" y2="18" />
    </svg>
  ),
  '/auftraege': (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" />
      <rect x="9" y="3" width="6" height="4" rx="1" />
      <path d="M9 14l2 2 4-4" />
    </svg>
  ),
  '/einstellungen': (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 01-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09a1.65 1.65 0 00-1.08-1.51 1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09a1.65 1.65 0 001.51-1.08 1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001.08 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9c.26.604.852.997 1.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1.08z" />
    </svg>
  ),
};

/* Fallback-Icon */
const DEFAULT_ICON = (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <path d="M12 8v4l3 3" />
  </svg>
);

/* ── Einzelne NavCard ── */
function NavCard({
  path,
  label,
  group,
  index,
}: {
  path: string;
  label: string;
  group: string;
  index: number;
}) {
  const navigate = useNavigate();
  const [hovered, setHovered] = useState(false);
  const icon = ICONS[path] ?? DEFAULT_ICON;

  return (
    <button
      onClick={() => navigate(path)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
      style={{
        all: 'unset',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: 16,
        padding: '18px 20px',
        borderRadius: tokens.radius.lg,
        background: hovered ? tokens.surfaceHover : tokens.surface,
        border: `1px solid ${hovered ? tokens.borderFocus : tokens.border}`,
        transition: 'all 0.25s ease',
        transform: hovered ? 'translateY(-2px)' : 'translateY(0)',
        boxShadow: hovered
          ? `0 8px 24px rgba(0,229,255,0.06), 0 0 0 1px ${tokens.borderFocus}`
          : '0 1px 4px rgba(0,0,0,0.3)',
        minHeight: tokens.touch.minHeight,
        boxSizing: 'border-box' as const,
        width: '100%',
        animation: `startCardIn 0.45s cubic-bezier(0.16,1,0.3,1) ${index * 70}ms both`,
      }}
    >
      {/* Icon */}
      <div
        style={{
          width: 44,
          height: 44,
          borderRadius: tokens.radius.sm,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: tokens.accentDim,
          color: tokens.accent,
          flexShrink: 0,
          transition: 'box-shadow 0.25s ease',
          boxShadow: hovered ? `0 0 16px ${tokens.accentDim}` : 'none',
        }}
      >
        {icon}
      </div>

      {/* Text */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 2, minWidth: 0 }}>
        <span
          style={{
            fontFamily: tokens.font.ui,
            fontWeight: 600,
            fontSize: 15,
            color: hovered ? tokens.accent : tokens.text,
            transition: 'color 0.25s ease',
          }}
        >
          {label}
        </span>
        <span
          style={{
            fontFamily: tokens.font.mono,
            fontSize: 11,
            color: tokens.muted,
          }}
        >
          {group}
        </span>
      </div>

      {/* Chevron */}
      <div
        style={{
          marginLeft: 'auto',
          color: hovered ? tokens.accent : tokens.border,
          transition: 'all 0.25s ease',
          transform: hovered ? 'translateX(3px)' : 'translateX(0)',
          flexShrink: 0,
        }}
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </div>
    </button>
  );
}

/* ── Start-Seite ── */
export function Start() {
  /* Nur sichtbare Sidebar-Einträge, ohne die Start-Route selbst */
  const navItems = routes.filter((r) => r.showInSidebar && r.path !== '/');

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '0 20px',
        paddingTop: 'min(12vh, 80px)',
        paddingBottom: 40,
        position: 'relative',
        overflow: 'hidden',
        minHeight: 'calc(100vh - 56px)',
      }}
    >
      {/* Ambient glow */}
      <div
        style={{
          position: 'absolute',
          top: -100,
          left: '50%',
          transform: 'translateX(-50%)',
          width: 460,
          height: 360,
          background:
            'radial-gradient(ellipse at center, rgba(0,229,255,0.06) 0%, transparent 70%)',
          pointerEvents: 'none',
          animation: 'startGlow 6s ease-in-out infinite',
        }}
      />

      {/* Content wrapper */}
      <div
        style={{
          width: '100%',
          maxWidth: 440,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          position: 'relative',
          zIndex: 1,
        }}
      >
        {/* Heading */}
        <h1
          style={{
            margin: 0,
            fontFamily: tokens.font.ui,
            fontWeight: 800,
            fontSize: 'clamp(48px, 10vw, 64px)',
            letterSpacing: '-0.04em',
            background: `linear-gradient(135deg, ${tokens.text} 0%, rgba(241,245,249,0.65) 50%, ${tokens.accent} 100%)`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            lineHeight: 1.1,
            textAlign: 'center',
            animation: 'startFadeIn 0.7s cubic-bezier(0.16,1,0.3,1) both',
          }}
        >
          WorkHub
        </h1>

        {/* Tagline */}
        <p
          style={{
            margin: '8px 0 0',
            fontFamily: tokens.font.mono,
            fontSize: 11,
            fontWeight: 400,
            color: tokens.muted,
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            animation: 'startFadeIn 0.7s cubic-bezier(0.16,1,0.3,1) 0.1s both',
          }}
        >
          Werkstatt-Management
        </p>

        {/* Divider */}
        <div
          style={{
            width: 40,
            height: 2,
            background: `linear-gradient(90deg, transparent, ${tokens.accent}55, transparent)`,
            margin: '28px 0',
            animation: 'startFadeIn 0.7s cubic-bezier(0.16,1,0.3,1) 0.18s both',
          }}
        />

        {/* Nav cards */}
        <div
          style={{
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            gap: 10,
          }}
        >
          {navItems.map((item, i) => (
            <NavCard
              key={item.path}
              path={item.path}
              label={item.label}
              group={item.group}
              index={i}
            />
          ))}
        </div>

        {/* Footer */}
        <div
          style={{
            marginTop: 44,
            animation: 'startFadeIn 0.7s cubic-bezier(0.16,1,0.3,1) 0.6s both',
          }}
        >
          <span
            style={{
              fontFamily: tokens.font.mono,
              fontSize: 11,
              color: `${tokens.muted}66`,
              letterSpacing: '0.06em',
            }}
          >
            v1.0 · CNC Recknagel
          </span>
        </div>
      </div>

      {/* Keyframes */}
      <style>{`
        @keyframes startFadeIn {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes startCardIn {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes startGlow {
          0%, 100% { opacity: 0.5; }
          50%      { opacity: 1; }
        }
      `}</style>
    </div>
  );
}