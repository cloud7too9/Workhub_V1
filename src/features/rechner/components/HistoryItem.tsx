import type { HistoryEntry } from '@/types/rechner';

interface HistoryItemProps {
  entry: HistoryEntry;
}

export function HistoryItem({ entry }: HistoryItemProps) {
  const d = new Date(entry.timestamp);
  const time = d.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });
  const date = d.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit' });

  return (
    <div style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      padding: '8px 12px', borderRadius: 'var(--radius-md)', background: 'var(--bg)', gap: '10px',
    }}>
      <div style={{ minWidth: 0 }}>
        <div style={{ fontSize: '13px', fontFamily: 'var(--font-mono)', color: 'var(--text-1)', fontWeight: 500 }}>
          {entry.summary}
        </div>
        <div style={{ fontSize: '11px', color: 'var(--text-3)' }}>{entry.inputSummary}</div>
      </div>
      <span style={{ fontSize: '11px', color: 'var(--text-3)', fontFamily: 'var(--font-mono)', whiteSpace: 'nowrap', flexShrink: 0 }}>
        {date} {time}
      </span>
    </div>
  );
}
