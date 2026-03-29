import type { HistoryEntry } from '../../types/rechner';
import { tokens } from '../../styles/tokens';

interface HistoryItemProps {
  entry: HistoryEntry;
}

export function HistoryItem({ entry }: HistoryItemProps) {
  const d = new Date(entry.timestamp);
  const time = d.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });
  const date = d.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit' });

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '8px 12px',
        borderRadius: 10,
        background: tokens.bg,
        gap: 10,
      }}
    >
      <div style={{ minWidth: 0 }}>
        <div
          style={{
            fontSize: 13,
            fontFamily: tokens.font.mono,
            color: tokens.text,
            fontWeight: 500,
          }}
        >
          {entry.summary}
        </div>
        <div style={{ fontSize: 11, color: tokens.muted }}>{entry.inputSummary}</div>
      </div>
      <span
        style={{
          fontSize: 11,
          color: tokens.muted,
          fontFamily: tokens.font.mono,
          whiteSpace: 'nowrap',
          flexShrink: 0,
        }}
      >
        {date} {time}
      </span>
    </div>
  );
}
