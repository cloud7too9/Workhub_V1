import { tokens } from '../../styles/tokens';

export function PlanBadge() {
  return (
    <span
      style={{
        fontSize: 9,
        fontWeight: 700,
        fontFamily: tokens.font.mono,
        color: tokens.warning,
        background: `${tokens.warning}18`,
        border: `1px solid ${tokens.warning}30`,
        padding: '2px 7px',
        borderRadius: 5,
        letterSpacing: '0.04em',
        whiteSpace: 'nowrap',
      }}
    >
      in Planung
    </span>
  );
}
