import { tokens } from '../../styles/tokens';

interface KvRowProps {
  label: string;
  value: string;
}

export function KvRow({ label, value }: KvRowProps) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        gap: 10,
        padding: '10px 0',
        borderBottom: '1px dashed rgba(255,255,255,0.10)',
      }}
    >
      <div
        style={{
          color: tokens.muted,
          fontSize: 12,
          flex: '0 0 44%',
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontWeight: 900,
          fontSize: 13,
          textAlign: 'right',
          flex: 1,
        }}
      >
        {value}
      </div>
    </div>
  );
}
