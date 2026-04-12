import { SearchField, EmptyState } from '@/ui';
import type { PackagingGroup } from '@/data/packagingGroups';
import { PackagingGroupCard } from '../components/PackagingGroupCard';

interface VerpackungViewProps {
  filteredGroups: PackagingGroup[];
  search: string;
  openId: string | null;
  totalGroups: number;
  totalArticles: number;
  onSearchChange: (value: string) => void;
  onToggleGroup: (groupId: string) => void;
}

export function VerpackungView({
  filteredGroups, search, openId,
  totalGroups, totalArticles,
  onSearchChange, onToggleGroup,
}: VerpackungViewProps) {
  return (
    <div>
      {/* Search */}
      <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: 'var(--sp-md)' }}>
        <div style={{ flex: 1 }}>
          <SearchField value={search} onChange={onSearchChange} placeholder="Artikel oder Verpackung suchen…" />
        </div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-3)', whiteSpace: 'nowrap' }}>
          {totalGroups} · {totalArticles}
        </div>
      </div>

      {/* Groups */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-sm)' }}>
        {filteredGroups.map((g) => (
          <PackagingGroupCard
            key={g.id}
            group={g}
            isOpen={openId === g.id}
            onToggle={() => onToggleGroup(g.id)}
          />
        ))}

        {filteredGroups.length === 0 && (
          <EmptyState title={`Kein Ergebnis für „${search}"`} description="Versuch einen anderen Suchbegriff." />
        )}
      </div>
    </div>
  );
}
