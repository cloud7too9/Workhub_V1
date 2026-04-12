import type { SawParams as SawParamsType } from '@/types/materials';

function formatSpeed(v: SawParamsType['schnittgeschwindigkeit_ms']): string {
  if (typeof v === 'object') return `Ø>10: ${v.durchmesser_gt_10} · Ø<10: ${v.durchmesser_lt_10}`;
  return v;
}

function Param({ label, value, unit }: { label: string; value: string; unit?: string }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
      <span style={{
        fontSize: '10px', color: 'var(--text-3)', fontFamily: 'var(--font-sans)',
        textTransform: 'uppercase', letterSpacing: '0.08em',
      }}>
        {label}
      </span>
      <span style={{ fontSize: '14px', color: 'var(--text-1)', fontFamily: 'var(--font-mono)', fontWeight: 500 }}>
        {value}
        {unit && <span style={{ fontSize: '10px', color: 'var(--text-3)', marginLeft: '3px' }}>{unit}</span>}
      </span>
    </div>
  );
}

interface SawParamsProps {
  saw: SawParamsType;
  color: string;
}

export function SawParamsPanel({ saw, color }: SawParamsProps) {
  return (
    <div style={{
      background: 'var(--bg)', borderRadius: 'var(--radius-lg)',
      padding: 'var(--sp-md)', border: '1px solid var(--border-subtle)',
      marginBottom: 'var(--sp-md)',
    }}>
      <div style={{
        fontSize: '10px', color, fontFamily: 'var(--font-sans)',
        textTransform: 'uppercase', letterSpacing: '0.1em',
        marginBottom: 'var(--sp-sm)', fontWeight: 600,
      }}>
        ⛭ Sägeparameter
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 'var(--sp-md)' }}>
        <Param label="Schnittgeschw." value={formatSpeed(saw.schnittgeschwindigkeit_ms)} unit="m/s" />
        <Param label="Sägedruck SD" value={saw.saegedruck_sd} />
        <Param label="Senkgeschw." value={saw.saegesenkgeschwindigkeit} />
      </div>
    </div>
  );
}
