import { ChevronDown, Plus } from 'lucide-react';
import type { MetalGroup, Material } from '@/types/materials';
import { Badge } from '@/ui';
import { SawParamsPanel } from './SawParamsPanel';
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
  group, materials, isOpen, onToggle,
  onAddMaterial, onEditMaterial, onDeleteMaterial,
}: GroupCardProps) {
  const c = group.color;

  return (
    <div style={{
      background: 'var(--surface)',
      border: `1px solid ${isOpen ? c + '50' : 'var(--border-subtle)'}`,
      borderRadius: 'var(--radius-lg)',
      overflow: 'hidden',
      transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
      boxShadow: isOpen ? `0 0 20px ${c}12` : 'none',
    }}>
      {/* Header */}
      <button
        onClick={onToggle}
        style={{
          width: '100%', display: 'flex', alignItems: 'center',
          justifyContent: 'space-between', padding: '14px 16px',
          background: 'none', border: 'none', cursor: 'pointer', minHeight: '48px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: 10, height: 10, borderRadius: '50%',
            background: c, boxShadow: `0 0 8px ${c}80`,
          }} />
          <span style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-1)', letterSpacing: '-0.01em' }}>
            {group.name}
          </span>
          <Badge color="neutral">{materials.length}</Badge>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-3)' }}>
            {group.chipsBin}
          </span>
          <ChevronDown
            size={16} color={c}
            style={{ transition: 'transform 0.2s ease', transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
          />
        </div>
      </button>

      {/* Expanded */}
      {isOpen && (
        <div style={{ padding: '0 16px 16px', animation: 'slideUp 0.2s ease' }}>
          <SawParamsPanel saw={group.saw} color={c} />

          {/* Materials header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
            <div style={{
              fontSize: '10px', color: 'var(--text-3)', fontFamily: 'var(--font-sans)',
              textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600,
            }}>
              Werkstoffe
            </div>
            <button
              onClick={onAddMaterial}
              style={{
                height: 30, padding: '0 12px', borderRadius: 'var(--radius-sm)',
                border: `1px dashed ${c}50`, background: `${c}10`,
                color: c, fontSize: '11px', fontWeight: 600, cursor: 'pointer',
                fontFamily: 'var(--font-sans)', display: 'flex', alignItems: 'center', gap: '4px',
              }}
            >
              <Plus size={12} /> Material
            </button>
          </div>

          {/* Material chips */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {materials.length === 0 ? (
              <div style={{ fontSize: '12px', color: 'var(--text-3)' }}>
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
