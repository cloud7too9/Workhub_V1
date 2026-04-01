import { tokens } from '../../styles/tokens';

interface ConfirmDialogProps {
  title: string;
  message: string;
  confirmLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  title,
  message,
  confirmLabel = 'Löschen',
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 130,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 14,
      }}
    >
      <div
        onClick={onCancel}
        style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(0,0,0,0.55)',
          animation: 'fadeIn 0.15s ease',
        }}
      />
      <div
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: 340,
          border: `1px solid ${tokens.border}`,
          background: tokens.surface,
          borderRadius: 18,
          padding: 20,
          animation: 'fadeSlideUp 0.2s ease',
          textAlign: 'center',
        }}
      >
        <div style={{ fontSize: 16, fontWeight: 700, color: tokens.text, marginBottom: 8 }}>
          {title}
        </div>
        <div style={{ fontSize: 13, color: tokens.muted, marginBottom: 20 }}>{message}</div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            onClick={onCancel}
            style={{
              flex: 1,
              height: 44,
              borderRadius: 12,
              border: `1px solid ${tokens.border}`,
              background: 'transparent',
              color: tokens.muted,
              fontSize: 14,
              fontWeight: 600,
              cursor: 'pointer',
              fontFamily: tokens.font.ui,
            }}
          >
            Abbrechen
          </button>
          <button
            onClick={onConfirm}
            style={{
              flex: 1,
              height: 44,
              borderRadius: 12,
              border: 'none',
              background: tokens.danger,
              color: '#fff',
              fontSize: 14,
              fontWeight: 700,
              cursor: 'pointer',
              fontFamily: tokens.font.ui,
            }}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
