import { LoadingState } from './LoadingState';

export const loadingStatePreviews = {
  id: 'loading-state',
  name: 'LoadingState',
  sections: [
    {
      title: 'Varianten',
      render: () => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-xl)' }}>
          <LoadingState />
          <LoadingState label="Daten werden geladen…" />
          <LoadingState label="Aufträge synchronisieren…" />
        </div>
      ),
    },
  ],
};
