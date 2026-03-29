import { useState, useEffect, useMemo } from 'react';
import { metalGroups } from '../data/metalGroups';
import type { Material } from '../types/materials';
import { tokens } from '../styles/tokens';
import { SearchInput } from '../components/shared/SearchInput';
import { ItemRow } from '../components/handbuch/ItemRow';
import { ItemDetails } from '../components/handbuch/ItemDetails';

// Static fallback in case fetch fails
const FALLBACK_MATERIALS: Material[] = [
  { id: 'c45', name: 'C45', groupId: 'stahl', notes: '' },
  { id: '1_4301', name: '1.4301', groupId: 'va', notes: '' },
  { id: 'almg3_5', name: 'AlMg3.5', groupId: 'alu', notes: '' },
];

function groupById(id: string) {
  return metalGroups.find((g) => g.id === id);
}

export function Handbuch() {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [search, setSearch] = useState('');
  const [activeGroup, setActiveGroup] = useState('all');
  const [openId, setOpenId] = useState<string | null>(null);

  // Load materials from JSON
  useEffect(() => {
    fetch('/data/materials.json', { cache: 'no-store' })
      .then((res) => {
        if (!res.ok) throw new Error('fetch failed');
        return res.json() as Promise<Material[]>;
      })
      .then(setMaterials)
      .catch(() => setMaterials(FALLBACK_MATERIALS));
  }, []);

  // Filter + sort
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();

    return materials
      .filter((m) => {
        const matchesText =
          !q ||
          m.name?.toLowerCase().includes(q) ||
          m.id?.toLowerCase().includes(q);

        const matchesGroup = activeGroup === 'all' || m.groupId === activeGroup;

        return matchesText && matchesGroup;
      })
      .sort((a, b) => (a.name ?? '').localeCompare(b.name ?? '', 'de'));
  }, [materials, search, activeGroup]);

  // Reset open state on search/filter change
  const handleSearchChange = (value: string) => {
    setSearch(value);
    setOpenId(null);
  };

  const handleGroupChange = (value: string) => {
    setActiveGroup(value);
    setOpenId(null);
  };

  const handleToggle = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <div>
      {/* Sticky Controls */}
      <div
        style={{
          position: 'sticky',
          top: 56,
          zIndex: 30,
          padding: '10px 14px',
          background: 'rgba(13,15,15,0.86)',
          backdropFilter: 'blur(12px)',
          borderBottom: `1px solid ${tokens.border}`,
        }}
      >
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <SearchInput
            value={search}
            onChange={handleSearchChange}
            placeholder="Suchen… z.B. 1.4301, C45, AlMg3.5"
          />
          <select
            value={activeGroup}
            onChange={(e) => handleGroupChange(e.target.value)}
            style={{
              width: 132,
              height: 44,
              borderRadius: 14,
              border: `1px solid ${tokens.border}`,
              background: tokens.surface,
              color: tokens.text,
              padding: '0 12px',
              outline: 'none',
              fontSize: 14,
              fontFamily: tokens.font.ui,
            }}
          >
            <option value="all">Alle</option>
            {metalGroups.map((g) => (
              <option key={g.id} value={g.id}>
                {g.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* List */}
      <div style={{ padding: 14, display: 'grid', gap: 10 }}>
        {filtered.length === 0 ? (
          <div style={{ color: tokens.muted, fontSize: 14 }}>Keine Treffer.</div>
        ) : (
          filtered.map((m) => {
            const group = groupById(m.groupId);
            const isOpen = openId === m.id;

            return (
              <article
                key={m.id}
                style={{
                  border: `1px solid ${isOpen ? 'rgba(138,180,255,0.45)' : tokens.border}`,
                  borderRadius: 16,
                  background: tokens.surface,
                  overflow: 'hidden',
                  boxShadow: isOpen
                    ? '0 0 0 1px rgba(138,180,255,0.16) inset'
                    : 'none',
                  transition: 'border-color 0.18s ease, box-shadow 0.18s ease',
                }}
              >
                <ItemRow
                  material={m}
                  group={group}
                  isOpen={isOpen}
                  onToggle={() => handleToggle(m.id)}
                />
                {isOpen && <ItemDetails material={m} group={group} />}
              </article>
            );
          })
        )}

        {/* Hint when nothing is open */}
        {openId === null && filtered.length > 0 && (
          <div
            style={{
              padding: 12,
              border: '1px solid rgba(255,90,90,0.30)',
              background: 'rgba(255,90,90,0.10)',
              borderRadius: 16,
              fontSize: 13,
              color: tokens.muted,
              marginTop: 2,
            }}
          >
            Wähle einen Werkstoff aus.
          </div>
        )}
      </div>
    </div>
  );
}
