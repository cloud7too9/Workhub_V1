import { tokens } from '../../styles/tokens';

interface PillProps {
  children: React.ReactNode;
}

export function Pill({ children }: PillProps) {
  return (
    <span
      style={{
        border: `1px solid ${tokens.border}`,
        background: 'transparent',
        borderRadius: 999,
        padding: '4px 10px',
        fontSize: 12,
        color: tokens.muted,
        whiteSpace: 'nowrap',
      }}
    >
      {children}
    </span>
  );
}
