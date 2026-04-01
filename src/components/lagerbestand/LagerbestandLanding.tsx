import { useNavigate } from 'react-router-dom';
import { tokens } from '../../styles/tokens';
import { PlanBadge } from '../shared/PlanBadge';
import { kartonSizes } from '../../data/kartonData';

interface CategoryDef {
  path: string;
  label: string;
  color: string;
  desc: string;
  count: string;
  planned: boolean;
}

const categories: CategoryDef[] = [
  {
    path: '/lagerbestand/verpackung',
    label: 'Verpackung',
    color: '#f59e0b',
    desc: 'Kartons verwalten & buchen',
    count: `${kartonSizes.length} Kartongrößen`,
    planned: false,
  },
  {
    path: '/lagerbestand/fertige-werkstuecke',
    label: 'Fertige Werkstücke',
    color: '#22c55e',
    desc: 'Fertigteile-Lager',
    count: 'in Planung',
    planned: true,
  },
  {
    path: '/lagerbestand/vorbereitete-werkstuecke',
    label: 'Vorbereitete Werkstücke',
    color: '#60a5fa',
    desc: 'Halbfertige Teile',
    count: 'in Planung',
    planned: true,
  },
  {
    path: '/lagerbestand/material',
    label: 'Material',
    color: '#a78bfa',
    desc: 'Rohmaterial & Stangen',
    count: 'in Planung',
    planned: true,
  },
  {
    path: '/lagerbestand/reststuecke',
    label: 'Reststücke',
    color: '#f472b6',
    desc: 'Verwertbare Reststücke',
    count: 'in Planung',
    planned: true,
  },
];

export function LagerbestandLanding() {
  const navigate = useNavigate();

  return (
    <div style={{ padding: 14, display: 'flex', flexDirection: 'column', gap: 12 }}>
      {/* Summary bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          padding: '10px 14px',
          borderRadius: tokens.radius.md,
          background: tokens.surface,
          border: `1px solid ${tokens.border}`,
        }}
      >
        <div
          style={{
            width: 8,
            height: 8,
            borderRadius: '50%',
            background: tokens.accent,
            boxShadow: `0 0 8px ${tokens.accent}80`,
          }}
        />
        <span style={{ fontSize: 13, color: tokens.textSecondary }}>5 Lagerbereiche</span>
        <span style={{ fontSize: 11, fontFamily: tokens.font.mono, color: tokens.muted }}>
          · 1 aktiv · 4 in Planung
        </span>
      </div>

      {/* Category cards */}
      {categories.map((cat) => (
        <button
          key={cat.path}
          onClick={() => !cat.planned && navigate(cat.path)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 14,
            padding: '16px 16px',
            background: tokens.surface,
            border: `1px solid ${tokens.border}`,
            borderRadius: tokens.radius.lg,
            cursor: cat.planned ? 'default' : 'pointer',
            opacity: cat.planned ? 0.55 : 1,
            textAlign: 'left',
            transition: 'all 0.2s ease',
            minHeight: tokens.touch.minHeight,
            width: '100%',
          }}
          onMouseEnter={(e) => {
            if (!cat.planned) {
              (e.currentTarget as HTMLElement).style.borderColor = `${cat.color}50`;
              (e.currentTarget as HTMLElement).style.boxShadow = `0 0 20px ${cat.color}12`;
            }
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.borderColor = tokens.border;
            (e.currentTarget as HTMLElement).style.boxShadow = 'none';
          }}
        >
          {/* Icon circle */}
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: 14,
              background: `${cat.color}12`,
              border: `1px solid ${cat.color}25`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              fontSize: 20,
            }}
          >
            {cat.label === 'Verpackung' && '📦'}
            {cat.label === 'Fertige Werkstücke' && '⚙️'}
            {cat.label === 'Vorbereitete Werkstücke' && '🧰'}
            {cat.label === 'Material' && '🔩'}
            {cat.label === 'Reststücke' && '🔧'}
          </div>

          {/* Text */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 15, fontWeight: 600, color: tokens.text, marginBottom: 2 }}>
              {cat.label}
            </div>
            <div style={{ fontSize: 12, color: tokens.muted }}>{cat.desc}</div>
          </div>

          {/* Right badge */}
          <div style={{ flexShrink: 0 }}>
            {cat.planned ? (
              <PlanBadge />
            ) : (
              <span
                style={{
                  fontSize: 11,
                  fontFamily: tokens.font.mono,
                  color: cat.color,
                  background: `${cat.color}18`,
                  border: `1px solid ${cat.color}30`,
                  padding: '3px 8px',
                  borderRadius: 6,
                }}
              >
                {cat.count}
              </span>
            )}
          </div>
        </button>
      ))}
    </div>
  );
}
