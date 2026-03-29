import type { MetalGroup, Material } from '../../types/materials';
import { tokens } from '../../styles/tokens';
import { SawParams } from './SawParams';
import { MaterialChip } from './MaterialChip';

interface GroupCardProps {
  group: MetalGroup;
  materials: Material[];
  isOpen: boolean;
  onToggle: () => void;
  onAddMaterial: () => void;
  onEditMaterial: (material: Material) => void;
  onDeleteMaterial: (material: Material) => void;
}

export function GroupCard({
  group,
  materials,
  isOpen,
  onToggle,
  onAddMaterial,
  onEditMaterial,
  onDeleteMaterial,
}: GroupCardProps) {
  const c = group.color;

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
              letterSpacing: '-0.01em',
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
            {materials.length}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontFamily: tokens.font.mono, fontSize: 11, color: tokens.muted }}>
            {group.chipsBin}
          </span>
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
        </div>
      </button>

      {/* Expanded */}
      {isOpen && (
        <div style={{ padding: '0 16px 16px', animation: 'fadeSlideDown 0.2s ease' }}>
          {/* Saw Params */}
          <SawParams saw={group.saw} color={c} />

          {/* Materials header + add button */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 10,
            }}
          >
            <div
              style={{
                fontSize: 10,
                color: tokens.muted,
                fontFamily: tokens.font.ui,
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                fontWeight: 600,
              }}
            >
              Werkstoffe
            </div>
            <button
              onClick={onAddMaterial}
              style={{
                height: 30,
                padding: '0 12px',
                borderRadius: 8,
                border: `1px dashed ${c}50`,
                background: `${c}10`,
                color: c,
                fontSize: 11,
                fontWeight: 600,
                cursor: 'pointer',
                fontFamily: tokens.font.ui,
              }}
            >
              + Material
            </button>
          </div>

          {/* Material chips */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {materials.length === 0 ? (
              <div style={{ fontSize: 12, color: tokens.muted }}>
                Keine Werkstoffe in dieser Gruppe.
              </div>
            ) : (
              materials.map((m) => (
                <MaterialChip
                  key={m.id}
                  name={m.name}
                  color={c}
                  onEdit={() => onEditMaterial(m)}
                  onDelete={() => onDeleteMaterial(m)}
                />
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
