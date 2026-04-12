import { ListItem } from './ListItem';
import { Badge } from '@/ui/data-display/Badge';
import { Package, Wrench, User, Settings } from 'lucide-react';

export const listItemPreviews = {
  id: 'list-item',
  name: 'ListItem',
  sections: [
    {
      title: 'Varianten',
      render: () => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <ListItem title="Auftrag #1042" subtitle="Welle Ø25 — 120 Stück" leading={<Package size={18} color="var(--accent)" />} trailing={<Badge color="success">Aktiv</Badge>} onClick={() => {}} />
          <ListItem title="Werkzeug W-38" subtitle="Fräser 12mm" leading={<Wrench size={18} color="var(--accent)" />} onClick={() => {}} />
          <ListItem title="Max Mustermann" subtitle="Bediener" leading={<User size={18} color="var(--accent)" />} trailing={<Badge color="neutral">Offline</Badge>} onClick={() => {}} />
          <ListItem title="Einstellungen" leading={<Settings size={18} color="var(--accent)" />} showArrow onClick={() => {}} />
          <ListItem title="Ohne Aktion" subtitle="Kein onClick — kein Pfeil" leading={<Package size={18} color="var(--text-3)" />} />
        </div>
      ),
    },
  ],
};
