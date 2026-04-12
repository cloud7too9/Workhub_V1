import { ErrorState } from './ErrorState';

export const errorStatePreviews = {
  id: 'error-state',
  name: 'ErrorState',
  sections: [
    {
      title: 'Varianten',
      render: () => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-xl)' }}>
          <ErrorState />
          <ErrorState message="Verbindung zum Server fehlgeschlagen." />
          <ErrorState message="Auftrag konnte nicht geladen werden. Bitte versuche es erneut." />
        </div>
      ),
    },
  ],
};
