import { Progress } from './Progress';

export const progressPreviews = {
  id: 'progress',
  name: 'Progress',
  sections: [
    {
      title: 'Varianten',
      render: () => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <Progress value={72} label="Fortschritt" />
          <Progress value={100} color="success" label="Abgeschlossen" />
          <Progress value={45} color="warning" label="In Bearbeitung" />
          <Progress value={15} color="error" label="Kritisch" />
        </div>
      ),
    },
    {
      title: 'Größen',
      render: () => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <Progress value={60} size="sm" label="Small" />
          <Progress value={60} size="md" label="Medium" />
        </div>
      ),
    },
  ],
};
