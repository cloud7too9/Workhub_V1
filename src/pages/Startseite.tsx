import { useNavigate } from 'react-router-dom';
import { tokens } from '../styles/tokens';
import { kartonSizes } from '../data/kartonData';

interface SectionCard {
  path: string;
  label: string;
  desc: string;
  color: string;
  emoji: string;
  badge?: string;
  children?: { label: string; status: string | null }[];
}

const sections: SectionCard[] = [
  {
    path: '/handbuch',
    label: 'Handbuch',
    desc: 'Werkstoff-Referenz & Verpackung',
    color: tokens.accent,
    emoji: '📖',
  },
  {
    path: '/rechner',
    label: 'Rechner',
    desc: 'Stückzahl + Restlänge',
    color: '#a78bfa',
    emoji: '🧮',
  },
  {
    path: '/auftraege',
    label: 'Aufträge',
    desc: 'Verwaltung',
    color: '#60a5fa',
    emoji: '📋',
  },
  {
    path: '/lagerbestand',
    label: 'Lagerbestand',
    desc: 'Bestände verwalten & buchen',
    color: '#f59e0b',
    emoji: '📦',
    badge: `${kartonSizes.length} Kartongrößen`,
    children: [
      { label: 'Verpackung', status: null },
      { label: 'Fertige Werkstücke', status: 'in Planung' },
      { label: 'Vorbereitete Werkstücke', status: 'in Planung' },
      { label: 'Material', status: 'in Planung' },
      { label: 'Reststücke', status: 'in Planung' },
    ],
  },
  {
    path: '/einstellungen',
    label: 'Einstellungen',
    desc: 'System & Changelog',
    color: '#6b7280',
    emoji: '⚙️',
  },
];

export function Startseite() {
  const navigate = useNavigate();

  return (
    <div style={{ padding: 14, display: 'flex', flexDirection: 'column', gap: 14 }}>
      {/* Welcome header */}
      <div style={{ padding: '8px 0 4px' }}>
        <div style={{ fontSize: 22, fontWeight: 700, color: tokens.text, lineHeight: 1.2 }}>
          WorkHub
        </div>
        <div
          style={{
            fontSize: 12,
            color: tokens.muted,
            fontFamily: tokens.font.mono,
            marginTop: 4,
          }}
        >
          CNC Recknagel · Werkstatt-Management
        </div>
      </div>

      {/* Section cards */}
      {sections.map((section) => (
        <button
          key={section.path}
          onClick={() => navigate(section.path)}
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 0,
            background: tokens.surface,
            border: `1px solid ${tokens.border}`,
            borderRadius: tokens.radius.lg,
            cursor: 'pointer',
            textAlign: 'left',
            transition: 'all 0.2s ease',
            overflow: 'hidden',
            width: '100%',
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.borderColor = `${section.color}50`;
            (e.currentTarget as HTMLElement).style.boxShadow = `0 0 24px ${section.color}10`;
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.borderColor = tokens.border;
            (e.currentTarget as HTMLElement).style.boxShadow = 'none';
          }}
        >
          {/* Main row */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 14,
              padding: '16px 16px',
              minHeight: tokens.touch.minHeight,
            }}
          >
            {/* Icon */}
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 12,
                background: `${section.color}12`,
                border: `1px solid ${section.color}20`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 20,
                flexShrink: 0,
              }}
            >
              {section.emoji}
            </div>

            {/* Text */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 15, fontWeight: 600, color: tokens.text }}>
                {section.label}
              </div>
              <div style={{ fontSize: 12, color: tokens.muted, marginTop: 1 }}>
                {section.desc}
              </div>
            </div>

            {/* Badge */}
            {section.badge && (
              <span
                style={{
                  fontSize: 10,
                  fontFamily: tokens.font.mono,
                  fontWeight: 600,
                  color: section.color,
                  background: `${section.color}15`,
                  border: `1px solid ${section.color}25`,
                  padding: '3px 8px',
                  borderRadius: 6,
                  flexShrink: 0,
                }}
              >
                {section.badge}
              </span>
            )}

            {/* Arrow */}
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke={tokens.muted}
              strokeWidth="2"
              style={{ flexShrink: 0 }}
            >
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </div>

          {/* Children preview (for Lagerbestand) */}
          {section.children && (
            <div
              style={{
                padding: '0 16px 12px 74px',
                display: 'flex',
                flexWrap: 'wrap',
                gap: 6,
              }}
            >
              {section.children.map((child) => (
                <span
                  key={child.label}
                  style={{
                    fontSize: 10,
                    fontWeight: 500,
                    color: child.status ? tokens.muted : tokens.textSecondary,
                    background: child.status ? 'transparent' : `${section.color}10`,
                    border: `1px solid ${child.status ? tokens.border : section.color + '25'}`,
                    padding: '2px 8px',
                    borderRadius: 5,
                    opacity: child.status ? 0.6 : 1,
                  }}
                >
                  {child.label}
                  {child.status && (
                    <span
                      style={{
                        marginLeft: 4,
                        fontSize: 8,
                        color: tokens.warning,
                        fontFamily: tokens.font.mono,
                      }}
                    >
                      ●
                    </span>
                  )}
                </span>
              ))}
            </div>
          )}
        </button>
      ))}

      {/* Footer */}
      <div
        style={{
          textAlign: 'center',
          padding: '12px 0 8px',
          fontSize: 11,
          color: tokens.muted,
          fontFamily: tokens.font.mono,
        }}
      >
        WorkHub v1.0 · Offline PWA
      </div>
    </div>
  );
}
