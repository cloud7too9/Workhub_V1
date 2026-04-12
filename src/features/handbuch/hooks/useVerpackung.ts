import { useState, useMemo } from 'react';
import { packagingGroups } from '@/data/packagingGroups';

export function useVerpackung() {
  const [search, setSearch] = useState('');
  const [openId, setOpenId] = useState<string | null>(null);

  const totalArticles = packagingGroups.reduce((sum, g) => sum + g.articles.length, 0);

  const filteredGroups = useMemo(() => {
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

  const toggleGroup = (groupId: string) => {
    setOpenId((prev) => (prev === groupId ? null : groupId));
  };

  return {
    state: {
      groups: packagingGroups,
      filteredGroups,
      search,
      openId,
      totalGroups: packagingGroups.length,
      totalArticles,
    },
    actions: {
      setSearch,
      toggleGroup,
    },
  };
}
