import { useState, useMemo } from 'react';
import { packagingGroups } from '../../data/packagingGroups';
import { tokens } from '../../styles/tokens';
import { SearchInput } from '../shared/SearchInput';
import { PackagingGroupCard } from './PackagingGroupCard';

export function VerpackungView() {
  const [search, setSearch] = useState('');
  const [openId, setOpenId] = useState<string | null>(null);

  const totalArticles = packagingGroups.reduce((sum, g) => sum + g.articles.length, 0);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return packagingGroups;

    return packagingGroups.filter((g) => {
      if (g.name.toLowerCase().includes(q)) return true;
      return g.articles.some(
        (a) =>
          a.name.toLowerCase().includes(q) ||
          a.karton.toLowerCase().includes(q) ||
          a.beutel.toLowerCase().includes(q),
      );
    });
  }, [search]);

  return (
    <div>
      {/* Search */}
      <div style={{ padding: '0 14px 10px', display: 'flex', gap: 10, alignItems: 'center' }}>
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Artikel oder Verpackung suchen…"
        />
        <div
          style={{
            fontFamily: tokens.font.mono,
            fontSize: 11,
            color: tokens.muted,
            whiteSpace: 'nowrap',
          }}
        >
          {packagingGroups.length} Gruppen · {totalArticles} Artikel
        </div>
      </div>

      {/* Groups */}
      <div style={{ padding: '0 14px 14px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {filtered.map((g) => (
          <PackagingGroupCard
            key={g.id}
            group={g}
            isOpen={openId === g.id}
            onToggle={() => setOpenId((prev) => (prev === g.id ? null : g.id))}
          />
        ))}

        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: 40, color: tokens.muted, fontSize: 14 }}>
            Kein Ergebnis für „{search}"
          </div>
        )}
      </div>
    </div>
  );
}
