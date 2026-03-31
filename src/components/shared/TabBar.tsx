import { tokens } from '../../styles/tokens';

export interface Tab<T extends string = string> {
  id: T;
  label: string;
  count?: number;
}

interface TabBarProps<T extends string> {
  tabs: Tab<T>[];
  active: T;
  onChange: (id: T) => void;
}

export function TabBar<T extends string>({ tabs, active, onChange }: TabBarProps<T>) {
  return (
    <div
      style={{
        position: 'sticky',
        top: tokens.layout.topbarHeight,
        zIndex: 30,
        padding: '10px 14px',
        background: 'rgba(13,15,20,0.86)',
        backdropFilter: 'blur(12px)',
        borderBottom: `1px solid ${tokens.border}`,
        display: 'flex',
        gap: 8,
      }}
    >
      {tabs.map((t) => {
        const isActive = active === t.id;
        return (
          <button
            key={t.id}
            onClick={() => onChange(t.id)}
            style={{
              height: 38,
              padding: '0 14px',
              borderRadius: 10,
              border: `1px solid ${isActive ? tokens.accent + '50' : tokens.border}`,
              background: isActive ? tokens.accentDim : 'transparent',
              color: isActive ? tokens.accent : tokens.muted,
              fontSize: 13,
              fontWeight: isActive ? 600 : 400,
              cursor: 'pointer',
              fontFamily: tokens.font.ui,
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              transition: 'all 0.15s ease',
            }}
          >
            {t.label}
            {t.count !== undefined && t.count > 0 && (
              <span
                style={{
                  fontFamily: tokens.font.mono,
                  fontSize: 11,
                  background: isActive ? tokens.accent + '30' : tokens.border,
                  padding: '1px 6px',
                  borderRadius: 6,
                }}
              >
                {t.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
