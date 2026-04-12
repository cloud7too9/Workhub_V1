import { EmptyState } from './EmptyState';
import { Inbox, Search } from 'lucide-react';

export const emptyStatePreviews = {
  id: 'empty-state',
  name: 'EmptyState',
  sections: [
    {
      title: 'Varianten',
      render: () => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <EmptyState icon={<Inbox size={36} />} title="Keine Einträge" description="Es sind noch keine Daten vorhanden." />
          <EmptyState icon={<Search size={36} />} title="Nichts gefunden" description="Versuch einen anderen Suchbegriff." />
        </div>
      ),
    },
  ],
};
