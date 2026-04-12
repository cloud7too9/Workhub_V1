import { Badge } from './Badge';

export const badgePreviews = {
  id: 'badge',
  name: 'Badge',
  sections: [
    {
      title: 'Farben',
      render: () => (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          <Badge color="accent">Accent</Badge>
          <Badge color="success">Success</Badge>
          <Badge color="warning">Warning</Badge>
          <Badge color="error">Error</Badge>
          <Badge color="neutral">Neutral</Badge>
        </div>
      ),
    },
    {
      title: 'Im Kontext',
      render: () => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '15px', fontWeight: 500 }}>Auftrag #1042</span>
          <Badge color="success">Aktiv</Badge>
        </div>
      ),
    },
  ],
};
