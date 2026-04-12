import { Divider } from './Divider';

export const dividerPreviews = {
  id: 'divider',
  name: 'Divider',
  sections: [
    {
      title: 'Varianten',
      render: () => (
        <div>
          <span style={{ fontSize: '14px', color: 'var(--text-2)' }}>Oben</span>
          <Divider />
          <span style={{ fontSize: '14px', color: 'var(--text-2)' }}>Mitte</span>
          <Divider label="Oder" />
          <span style={{ fontSize: '14px', color: 'var(--text-2)' }}>Unten</span>
        </div>
      ),
    },
  ],
};
