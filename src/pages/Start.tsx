import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { tokens } from '../styles/tokens';
import { getStartNavItems } from '../data/navigation';
import type { NavRoute } from '../data/navigation';

function NavCard({ route, index }: { route: NavRoute; index: number }) {
  const navigate = useNavigate();
  const [hovered, setHovered] = useState(false);

  return (
    <button
      onClick={() => navigate(route.path)}
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
      {/* Icon from navigation config */}
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
        {route.icon}
      </div>

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
          {route.label}
        </span>
        <span style={{ fontFamily: tokens.font.mono, fontSize: 11, color: tokens.muted }}>
          {route.group}
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
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </div>
    </button>
  );
}

export function Start() {
  const navItems = getStartNavItems();

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
        minHeight: '100vh',
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
          background: 'radial-gradient(ellipse at center, rgba(0,229,255,0.06) 0%, transparent 70%)',
          pointerEvents: 'none',
          animation: 'startGlow 6s ease-in-out infinite',
        }}
      />

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

        <p
          style={{
            margin: '8px 0 0',
            fontFamily: tokens.font.mono,
            fontSize: 11,
            color: tokens.muted,
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            animation: 'startFadeIn 0.7s cubic-bezier(0.16,1,0.3,1) 0.1s both',
          }}
        >
          Werkstatt-Management
        </p>

        <div
          style={{
            width: 40,
            height: 2,
            background: `linear-gradient(90deg, transparent, ${tokens.accent}55, transparent)`,
            margin: '28px 0',
            animation: 'startFadeIn 0.7s cubic-bezier(0.16,1,0.3,1) 0.18s both',
          }}
        />

        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 10 }}>
          {navItems.map((route, i) => (
            <NavCard key={route.path} route={route} index={i} />
          ))}
        </div>

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
    </div>
  );
}
