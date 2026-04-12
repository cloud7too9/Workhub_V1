import { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import { Check, AlertCircle, X, Info } from 'lucide-react';

type ToastType = 'success' | 'error' | 'info' | 'warning';

interface ToastItem {
  id: number;
  message: string;
  type: ToastType;
  leaving?: boolean;
}

interface ToastCtx {
  toast: (message: string, type?: ToastType) => void;
}

const Ctx = createContext<ToastCtx>({ toast: () => {} });
export const useToast = () => useContext(Ctx);

let nextId = 0;

const icons: Record<ToastType, React.ReactNode> = {
  success: <Check size={18} />,
  error: <AlertCircle size={18} />,
  info: <Info size={18} />,
  warning: <AlertCircle size={18} />,
};

const typeStyles: Record<ToastType, { color: string }> = {
  success: { color: 'var(--success)' },
  error: { color: 'var(--error)' },
  info: { color: 'var(--accent)' },
  warning: { color: 'var(--warning)' },
};

function ToastBar({ item, onDismiss }: { item: ToastItem; onDismiss: (id: number) => void }) {
  const s = typeStyles[item.type];

  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 'var(--sp-sm)',
      padding: 'var(--sp-md) var(--sp-lg)',
      background: 'var(--surface)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius-lg)',
      borderLeft: `3px solid ${s.color}`,
      color: s.color,
      animation: item.leaving ? 'slideDown 0.2s ease forwards' : 'slideUp 0.25s ease',
      boxShadow: 'var(--shadow-md)',
      maxWidth: '400px', width: '100%',
    }}>
      <div style={{ flexShrink: 0 }}>{icons[item.type]}</div>
      <span style={{ flex: 1, fontSize: '14px', fontWeight: 500, color: 'var(--text-1)' }}>{item.message}</span>
      <button onClick={() => onDismiss(item.id)} aria-label="Schließen" style={{
        border: 'none', background: 'none', cursor: 'pointer', padding: 0,
        display: 'flex', color: 'var(--text-3)', flexShrink: 0,
      }}>
        <X size={16} />
      </button>
    </div>
  );
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);
  const timers = useRef<Map<number, ReturnType<typeof setTimeout>>>(new Map());

  const dismiss = useCallback((id: number) => {
    setItems(prev => prev.map(t => t.id === id ? { ...t, leaving: true } : t));
    setTimeout(() => setItems(prev => prev.filter(t => t.id !== id)), 200);
    const timer = timers.current.get(id);
    if (timer) { clearTimeout(timer); timers.current.delete(id); }
  }, []);

  const toast = useCallback((message: string, type: ToastType = 'info') => {
    const id = nextId++;
    setItems(prev => [...prev, { id, message, type }]);
    const timer = setTimeout(() => dismiss(id), 3500);
    timers.current.set(id, timer);
  }, [dismiss]);

  useEffect(() => {
    return () => { timers.current.forEach(t => clearTimeout(t)); };
  }, []);

  return (
    <Ctx.Provider value={{ toast }}>
      {children}
      <div style={{
        position: 'fixed', top: 'calc(56px + var(--sp-sm))', left: 0, right: 0,
        zIndex: 200, display: 'flex', flexDirection: 'column', alignItems: 'center',
        gap: 'var(--sp-sm)', padding: '0 var(--sp-lg)', pointerEvents: 'none',
      }}>
        {items.map(item => (
          <div key={item.id} style={{ pointerEvents: 'auto' }}>
            <ToastBar item={item} onDismiss={dismiss} />
          </div>
        ))}
      </div>
    </Ctx.Provider>
  );
}
