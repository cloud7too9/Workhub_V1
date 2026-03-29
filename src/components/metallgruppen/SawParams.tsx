import type { SawParams as SawParamsType } from '../../types/materials';
import { tokens } from '../../styles/tokens';

function formatSpeed(v: SawParamsType['schnittgeschwindigkeit_ms']): string {
  if (typeof v === 'object') {
    return `Ø>10: ${v.durchmesser_gt_10} · Ø<10: ${v.durchmesser_lt_10}`;
  }
  return v;
}

function Param({ label, value, unit }: { label: string; value: string; unit?: string }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <span
        style={{
          fontSize: 10,
          color: tokens.muted,
          fontFamily: tokens.font.ui,
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
        }}
      >
        {label}
      </span>
      <span
        style={{
          fontSize: 14,
          color: tokens.text,
          fontFamily: tokens.font.mono,
          fontWeight: 500,
        }}
      >
        {value}
        {unit && (
          <span style={{ fontSize: 10, color: tokens.muted, marginLeft: 3 }}>{unit}</span>
        )}
      </span>
    </div>
  );
}

interface SawParamsProps {
  saw: SawParamsType;
  color: string;
}

export function SawParams({ saw, color }: SawParamsProps) {
  return (
    <div
      style={{
        background: tokens.bg,
        borderRadius: 12,
        padding: 14,
        border: `1px solid ${tokens.border}`,
        marginBottom: 14,
      }}
    >
      <div
        style={{
          fontSize: 10,
          color,
          fontFamily: tokens.font.ui,
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
          marginBottom: 10,
          fontWeight: 600,
        }}
      >
        ⛭ Sägeparameter
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14 }}>
        <Param label="Schnittgeschw." value={formatSpeed(saw.schnittgeschwindigkeit_ms)} unit="m/s" />
        <Param label="Sägedruck SD" value={saw.saegedruck_sd} />
        <Param label="Senkgeschw." value={saw.saegesenkgeschwindigkeit} />
      </div>
    </div>
  );
}
