import type { ReactNode, CSSProperties } from 'react';
import { tokens } from '../../styles/tokens';

// ── Backdrop (shared by all overlays) ──

interface BackdropProps {
  onClick?: () => void;
  zIndex?: number;
}

export function Backdrop({ onClick, zIndex = 90 }: BackdropProps) {
  return (
    <div
      onClick={onClick}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex,
        background: 'rgba(0,0,0,0.55)',
        animation: 'fadeIn 0.15s ease',
      }}
    />
  );
}

// ── Centered Panel (for ConfirmDialog, forms) ──

interface PanelProps {
  children: ReactNode;
  maxWidth?: number;
  zIndex?: number;
  style?: CSSProperties;
}

export function CenterPanel({ children, maxWidth = 340, zIndex = 130, style }: PanelProps) {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 14,
        pointerEvents: 'none',
      }}
    >
      <div
        style={{
          position: 'relative',
          width: '100%',
          maxWidth,
          border: `1px solid ${tokens.border}`,
          background: tokens.surface,
          borderRadius: 18,
          padding: 20,
          animation: 'fadeSlideUp 0.2s ease',
          pointerEvents: 'auto',
          ...style,
        }}
      >
        {children}
      </div>
    </div>
  );
}

// ── Side Drawer (for nav drawer, settings drawer) ──

type DrawerSide = 'left' | 'right';

interface SideDrawerProps {
  open: boolean;
  side?: DrawerSide;
  width?: number | string;
  children: ReactNode;
  zIndex?: number;
}

export function SideDrawer({ open, side = 'left', width = 280, children, zIndex = 100 }: SideDrawerProps) {
  const isLeft = side === 'left';
  return (
    <aside
      style={{
        position: 'fixed',
        top: 0,
        [isLeft ? 'left' : 'right']: 0,
        bottom: 0,
        zIndex,
        width,
        maxWidth: '90vw',
        background: tokens.surface,
        [isLeft ? 'borderRight' : 'borderLeft']: `1px solid ${tokens.border}`,
        transform: open
          ? 'translateX(0)'
          : `translateX(${isLeft ? '-100%' : '100%'})`,
        transition: 'transform 0.25s ease',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      {children}
    </aside>
  );
}

// ── Drawer/Panel Header (shared top bar with title + close) ──

interface OverlayHeaderProps {
  title: string;
  onClose: () => void;
}

export function OverlayHeader({ title, onClose }: OverlayHeaderProps) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '16px 20px',
        borderBottom: `1px solid ${tokens.border}`,
        flexShrink: 0,
      }}
    >
      <span style={{ fontSize: 16, fontWeight: 600, color: tokens.text }}>
        {title}
      </span>
      <button
        onClick={onClose}
        aria-label="Schließen"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 36,
          height: 36,
          background: 'none',
          border: `1px solid ${tokens.border}`,
          color: tokens.muted,
          fontSize: 16,
          cursor: 'pointer',
          borderRadius: tokens.radius.sm,
        }}
      >
        ✕
      </button>
    </div>
  );
}
