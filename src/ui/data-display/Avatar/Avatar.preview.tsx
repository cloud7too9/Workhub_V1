import { Avatar } from './Avatar';

export const avatarPreviews = {
  id: 'avatar',
  name: 'Avatar',
  sections: [
    {
      title: 'Größen',
      render: () => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-md)' }}>
          <Avatar name="Max Recknagel" size="sm" />
          <Avatar name="Max Recknagel" size="md" />
          <Avatar name="Max Recknagel" size="lg" />
        </div>
      ),
    },
    {
      title: 'Status',
      render: () => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-md)' }}>
          <Avatar name="Anna Schmidt" status="online" />
          <Avatar name="Bernd Müller" status="busy" />
          <Avatar name="Clara Weber" status="offline" />
          <Avatar name="David Koch" />
        </div>
      ),
    },
    {
      title: 'Farbvarianz',
      render: () => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-sm)' }}>
          {['Max R', 'Anna S', 'Bernd M', 'Clara W', 'David K', 'Eva L', 'Felix B'].map(n => (
            <Avatar key={n} name={n} size="sm" />
          ))}
        </div>
      ),
    },
  ],
};
