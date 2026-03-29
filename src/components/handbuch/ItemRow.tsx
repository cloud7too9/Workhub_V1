import type { Material, MetalGroup, SawParams } from '../../types/materials';
import { tokens } from '../../styles/tokens';
import { Pill } from '../shared/Pill';

function formatVcShort(vc: SawParams['schnittgeschwindigkeit_ms']): string {
  if (vc == null) return '—';
  if (typeof vc === 'object') {
    return `${vc.durchmesser_gt_10}/${vc.durchmesser_lt_10} m/s`;
  }
  return `${vc} m/s`;
}

interface ItemRowProps {
  material: Material;
  group: MetalGroup | undefined;
  isOpen: boolean;
  onToggle: () => void;
}

export function ItemRow({ material, group, isOpen, onToggle }: ItemRowProps) {
  return (
    <div
      role="button"
      tabIndex={0}
      aria-expanded={isOpen}
      onClick={onToggle}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onToggle();
        }
      }}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 10,
        padding: '12px 12px',
        cursor: 'pointer',
      }}
    >
      {/* Left: Name + Group */}
      <div style={{ minWidth: 0, display: 'flex', flexDirection: 'column', gap: 3 }}>
        <div
          style={{
            fontWeight: 900,
            letterSpacing: '0.2px',
            fontSize: 14,
            lineHeight: 1.15,
            color: tokens.text,
          }}
        >
          {material.name ?? '—'}
        </div>
        <div style={{ fontSize: 12, color: tokens.muted }}>
          {group?.name ?? '—'}
        </div>
      </div>

      {/* Right: vc pill */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: '0 0 auto' }}>
        <Pill>vc {formatVcShort(group?.saw?.schnittgeschwindigkeit_ms)}</Pill>
      </div>
    </div>
  );
}
