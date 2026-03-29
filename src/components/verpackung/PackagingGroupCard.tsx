import type { PackagingGroup } from '../../data/packagingGroups';
import { tokens } from '../../styles/tokens';

const CARD_COLOR = '#f59e0b'; // Warm amber for packaging

interface PackagingGroupCardProps {
  group: PackagingGroup;
  isOpen: boolean;
  onToggle: () => void;
}

export function PackagingGroupCard({ group, isOpen, onToggle }: PackagingGroupCardProps) {
  const c = CARD_COLOR;

  return (
    <div
      style={{
        background: tokens.surface,
        border: `1px solid ${isOpen ? c + '50' : tokens.border}`,
        borderRadius: 16,
        overflow: 'hidden',
        transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
        boxShadow: isOpen ? `0 0 20px ${c}12` : 'none',
      }}
    >
      {/* Header */}
      <button
        onClick={onToggle}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '14px 16px',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          minHeight: 48,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div
            style={{
              width: 10,
              height: 10,
              borderRadius: '50%',
              background: c,
              boxShadow: `0 0 8px ${c}80`,
            }}
          />
          <span
            style={{
              fontFamily: tokens.font.ui,
              fontSize: 16,
              fontWeight: 600,
              color: tokens.text,
            }}
          >
            {group.name}
          </span>
          <span
            style={{
              fontFamily: tokens.font.mono,
              fontSize: 11,
              color: tokens.muted,
              background: tokens.border,
              padding: '2px 8px',
              borderRadius: 6,
            }}
          >
            {group.articles.length}
          </span>
        </div>
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke={c}
          strokeWidth="2"
          style={{
            transition: 'transform 0.2s ease',
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
          }}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {/* Expanded: article table */}
      {isOpen && (
        <div style={{ padding: '0 16px 16px', animation: 'fadeSlideDown 0.2s ease' }}>
          {/* Table header */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 65px 65px 1fr',
              gap: 8,
              padding: '8px 10px',
              borderRadius: 10,
              background: tokens.bg,
              marginBottom: 6,
            }}
          >
            {['Artikel', 'Höhe', 'Ø mm', 'Verpackung'].map((h) => (
              <span
                key={h}
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  color: tokens.muted,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                }}
              >
                {h}
              </span>
            ))}
          </div>

          {/* Rows */}
          {group.articles.map((a) => {
            const isKarton = !!a.karton;
            const packLabel = isKarton ? a.karton : a.beutel;
            const packType = isKarton ? 'Karton' : 'Beutel';
            const packColor = isKarton ? '#60a5fa' : '#a78bfa';

            return (
              <div
                key={a.name}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 65px 65px 1fr',
                  gap: 8,
                  padding: '10px 10px',
                  borderBottom: `1px solid ${tokens.border}`,
                  alignItems: 'center',
                }}
              >
                <span
                  style={{
                    fontSize: 13,
                    fontWeight: 600,
                    color: tokens.text,
                    fontFamily: tokens.font.mono,
                  }}
                >
                  {a.name}
                </span>
                <span
                  style={{
                    fontSize: 13,
                    color: tokens.textSecondary,
                    fontFamily: tokens.font.mono,
                  }}
                >
                  {a.height}
                </span>
                <span
                  style={{
                    fontSize: 13,
                    color: tokens.textSecondary,
                    fontFamily: tokens.font.mono,
                  }}
                >
                  {a.diameter}
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span
                    style={{
                      fontSize: 10,
                      fontWeight: 700,
                      color: packColor,
                      background: `${packColor}18`,
                      border: `1px solid ${packColor}30`,
                      padding: '2px 6px',
                      borderRadius: 5,
                    }}
                  >
                    {packType}
                  </span>
                  <span
                    style={{
                      fontSize: 12,
                      fontFamily: tokens.font.mono,
                      color: tokens.text,
                    }}
                  >
                    {packLabel}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
