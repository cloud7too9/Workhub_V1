import { useEffect, useCallback } from 'react';
import { X } from 'lucide-react';

interface SheetProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  side?: 'left' | 'bottom';
}

export function Sheet({ open, onClose, title, children, side = 'left' }: SheetProps) {
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') onClose();
  }, [onClose]);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
      document.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open, handleKeyDown]);

  const isLeft = side === 'left';

  const backdrop: React.CSSProperties = {
    position: 'fixed', inset: 0, zIndex: 100,
    background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)',
    opacity: open ? 1 : 0, pointerEvents: open ? 'auto' : 'none',
    transition: 'opacity 0.25s ease',
  };

  const panel: React.CSSProperties = isLeft ? {
    position: 'fixed', top: 0, left: 0, bottom: 0,
    width: 'min(300px, 80vw)', zIndex: 101,
    background: 'var(--surface)', borderRight: '1px solid var(--border-subtle)',
    transform: open ? 'translateX(0)' : 'translateX(-100%)',
    transition: 'transform 0.3s cubic-bezier(0.32, 0.72, 0, 1)',
    display: 'flex', flexDirection: 'column', overflow: 'hidden',
  } : {
    position: 'fixed', left: 0, right: 0, bottom: 0,
    maxHeight: '85vh', zIndex: 101,
    background: 'var(--surface)', borderTop: '1px solid var(--border-subtle)',
    borderRadius: 'var(--radius-xl) var(--radius-xl) 0 0',
    transform: open ? 'translateY(0)' : 'translateY(100%)',
    transition: 'transform 0.3s cubic-bezier(0.32, 0.72, 0, 1)',
    display: 'flex', flexDirection: 'column', overflow: 'hidden',
  };

  return (
    <>
      <div style={backdrop} onClick={onClose} aria-hidden="true" />
      <div
        role="dialog"
        aria-modal={open}
        aria-label={title ?? 'Panel'}
        style={panel}
      >
        {!isLeft && (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '10px 0 4px' }}>
            <div style={{ width: '36px', height: '4px', borderRadius: '2px', background: 'var(--border)' }} />
          </div>
        )}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: 'var(--sp-lg) var(--sp-xl)',
          borderBottom: '1px solid var(--border-subtle)', flexShrink: 0,
        }}>
          {title && <span style={{ fontSize: '17px', fontWeight: 700, color: 'var(--text-1)' }}>{title}</span>}
          <button
            onClick={onClose}
            aria-label="Schließen"
            style={{
              width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center',
              borderRadius: 'var(--radius-md)', border: 'none', background: 'var(--surface-alt)',
              cursor: 'pointer', color: 'var(--text-2)', transition: 'all 0.15s ease', marginLeft: 'auto',
            }}
          >
            <X size={18} />
          </button>
        </div>
        <div style={{ flex: 1, overflowY: 'auto', padding: 'var(--sp-lg) var(--sp-xl) var(--sp-3xl)' }}>
          {children}
        </div>
      </div>
    </>
  );
}
