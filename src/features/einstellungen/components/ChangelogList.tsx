import type { ChangelogEntry } from '@/types/changelog';

import { metalGroups } from '@/data/metalGroups';

const actionLabels: Record<string, { label: string; color: string }> = {
  added: { label: 'Hinzugefügt', color: 'var(--success)' },
  edited: { label: 'Bearbeitet', color: '#f59e0b' },
  deleted: { label: 'Gelöscht', color: 'var(--error)' },
};

function getGroupName(groupId: string): string {
  return metalGroups.find((g) => g.id === groupId)?.name ?? groupId;
}

interface ChangelogListProps {
  entries: ChangelogEntry[];
  onUndo: (entry: ChangelogEntry) => void;
}

export function ChangelogList({ entries, onUndo }: ChangelogListProps) {
  if (entries.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-3)' }}>
        <div style={{ fontSize: 32, marginBottom: 10, opacity: 0.3 }}>📋</div>
        <div style={{ fontSize: 14 }}>Keine Änderungen vorhanden</div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {entries.map((entry) => {
        const d = new Date(entry.timestamp);
        const time = d.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });
        const date = d.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' });
        const info = actionLabels[entry.action] ?? { label: entry.action, color: 'var(--text-3)' };

        return (
          <div
            key={entry.id}
            style={{
              border: `1px solid ${'var(--border)'}`,
              borderRadius: 12,
              background: 'var(--bg)',
              padding: 12,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 10,
            }}
          >
            {/* Left: info */}
            <div style={{ minWidth: 0, flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    color: info.color,
                    background: `${info.color}18`,
                    border: `1px solid ${info.color}30`,
                    padding: '2px 8px',
                    borderRadius: 6,
                  }}
                >
                  {info.label}
                </span>
                <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-1)' }}>
                  {entry.materialName}
                </span>
              </div>
              <div style={{ fontSize: 11, color: 'var(--text-3)', display: 'flex', gap: 8 }}>
                <span>{getGroupName(entry.groupId)}</span>
                <span>·</span>
                <span style={{ fontFamily: 'var(--font-mono)' }}>{date} {time}</span>
              </div>
            </div>

            {/* Right: undo */}
            <button
              onClick={() => onUndo(entry)}
              title="Rückgängig"
              style={{
                height: 34,
                padding: '0 12px',
                borderRadius: 8,
                border: `1px solid ${'var(--accent)'}40`,
                background: 'var(--accent-muted)',
                color: 'var(--accent)',
                fontSize: 12,
                fontWeight: 600,
                cursor: 'pointer',
                fontFamily: 'var(--font-sans)',
                whiteSpace: 'nowrap',
                flexShrink: 0,
              }}
            >
              ↺ Undo
            </button>
          </div>
        );
      })}
    </div>
  );
}
