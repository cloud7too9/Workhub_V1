import { useRef, useState, useEffect } from 'react';

interface TabItem { id: string; label: string; }
interface TabsProps {
  items: TabItem[];
  active: string;
  onChange: (id: string) => void;
}

export function Tabs({ items, active, onChange }: TabsProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [indicator, setIndicator] = useState({ left: 0, width: 0 });

  useEffect(() => {
    if (!containerRef.current) return;
    const idx = items.findIndex(t => t.id === active);
    const buttons = containerRef.current.querySelectorAll('button');
    const btn = buttons[idx];
    if (btn) {
      const containerRect = containerRef.current.getBoundingClientRect();
      const btnRect = btn.getBoundingClientRect();
      setIndicator({
        left: btnRect.left - containerRect.left,
        width: btnRect.width,
      });
    }
  }, [active, items]);

  return (
    <div
      ref={containerRef}
      style={{
        display: 'flex',
        gap: 'var(--sp-xs)',
        background: 'var(--surface)',
        borderRadius: 'var(--radius-lg)',
        padding: '4px',
        border: '1px solid var(--border-subtle)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Sliding background */}
      <div style={{
        position: 'absolute',
        top: '4px',
        left: indicator.left,
        width: indicator.width,
        height: 'calc(100% - 8px)',
        background: 'var(--accent)',
        borderRadius: 'var(--radius-md)',
        transition: 'left 0.25s cubic-bezier(0.32, 0.72, 0, 1), width 0.25s cubic-bezier(0.32, 0.72, 0, 1)',
      }} />
      {items.map(t => (
        <button
          key={t.id}
          onClick={() => onChange(t.id)}
          style={{
            flex: 1,
            padding: '10px 4px',
            fontSize: '13px',
            fontWeight: 600,
            fontFamily: 'var(--font-sans)',
            border: 'none',
            borderRadius: 'var(--radius-md)',
            cursor: 'pointer',
            background: 'transparent',
            color: active === t.id ? 'var(--bg)' : 'var(--text-3)',
            transition: 'color 0.2s ease',
            position: 'relative',
            zIndex: 1,
          }}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}
