import { useEffect, useCallback } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
}

export function Modal({ open, onClose, title, children, actions }: ModalProps) {
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

  if (!open) return null;

  return (
    <>
      <div
        onClick={onClose}
        aria-hidden="true"
        style={{
          position: 'fixed', inset: 0, zIndex: 150,
          background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)',
          animation: 'fadeIn 0.2s ease',
        }}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title ?? 'Dialog'}
        style={{
          position: 'fixed', zIndex: 151,
          top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
          width: 'min(calc(100vw - 40px), 400px)',
          background: 'var(--surface)', border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-xl)', overflow: 'hidden',
          animation: 'scaleIn 0.25s cubic-bezier(0.32, 0.72, 0, 1)',
          boxShadow: 'var(--shadow-lg)',
        }}
      >
        {title && (
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: 'var(--sp-lg) var(--sp-xl)', borderBottom: '1px solid var(--border-subtle)',
          }}>
            <span style={{ fontSize: '17px', fontWeight: 700, color: 'var(--text-1)' }}>{title}</span>
            <button onClick={onClose} aria-label="Schließen" style={{
              width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center',
              borderRadius: 'var(--radius-sm)', border: 'none', background: 'var(--surface-alt)',
              cursor: 'pointer', color: 'var(--text-2)', transition: 'all 0.15s ease',
            }}>
              <X size={16} />
            </button>
          </div>
        )}
        <div style={{ padding: 'var(--sp-xl)' }}>{children}</div>
        {actions && (
          <div style={{
            display: 'flex', gap: 'var(--sp-sm)',
            padding: 'var(--sp-lg) var(--sp-xl)', borderTop: '1px solid var(--border-subtle)',
          }}>
            {actions}
          </div>
        )}
      </div>
    </>
  );
}
