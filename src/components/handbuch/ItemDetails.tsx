import type { Material, MetalGroup, SawParams } from '../../types/materials';
import { tokens } from '../../styles/tokens';
import { Pill } from '../shared/Pill';
import { KvRow } from '../shared/KvRow';

function formatVc(vc: SawParams['schnittgeschwindigkeit_ms']): string {
  if (vc == null) return '—';
  if (typeof vc === 'object') {
    const gt = vc.durchmesser_gt_10 ?? '—';
    const lt = vc.durchmesser_lt_10 ?? '—';
    return `Ø > 10: ${gt} m/s · Ø < 10: ${lt} m/s`;
  }
  return `${vc} m/s`;
}

interface ItemDetailsProps {
  material: Material;
  group: MetalGroup | undefined;
}

export function ItemDetails({ material, group }: ItemDetailsProps) {
  const notes = material.notes?.trim();

  return (
    <div
      style={{
        padding: '12px 12px 12px',
        borderTop: `1px solid ${tokens.border}`,
        background: 'rgba(255,255,255,0.02)',
      }}
    >
      {/* Pills */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 10 }}>
        <Pill>{group?.name ?? 'Unbekannte Gruppe'}</Pill>
        <Pill>ID: {material.id ?? '—'}</Pill>
      </div>

      {/* Saw params */}
      <KvRow
        label="Schnittgeschwindigkeit (m/s)"
        value={formatVc(group?.saw?.schnittgeschwindigkeit_ms)}
      />
      <KvRow
        label="Sägedruck (SD)"
        value={group?.saw?.saegedruck_sd ?? '—'}
      />
      <KvRow
        label="Sägesenkgeschwindigkeit"
        value={group?.saw?.saegesenkgeschwindigkeit ?? '—'}
      />
      <KvRow
        label="Späne → wohin"
        value={group?.chipsBin ?? '—'}
      />
      <KvRow
        label="Reste → wohin"
        value={group?.scrapStorage?.trim() || '—'}
      />

      {/* Notes */}
      <div style={{ marginTop: 10 }}>
        <div style={{ color: tokens.muted, fontSize: 12 }}>Notizen</div>
        <div
          style={{
            border: `1px solid ${tokens.border}`,
            background: tokens.surface,
            borderRadius: 16,
            padding: 10,
            marginTop: 6,
            fontSize: 13,
            color: notes ? tokens.text : tokens.muted,
          }}
        >
          {notes || '—'}
        </div>
      </div>
    </div>
  );
}
