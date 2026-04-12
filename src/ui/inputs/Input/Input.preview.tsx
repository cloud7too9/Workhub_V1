import { Input } from './Input';

export const inputPreviews = {
  id: 'input',
  name: 'Input',
  sections: [
    {
      title: 'Varianten',
      render: () => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <Input label="Name" placeholder="Max Mustermann" />
          <Input label="E-Mail" placeholder="max@example.de" hint="Wird nicht weitergegeben" />
          <Input label="Fehlerhaft" placeholder="Eingabe…" error="Pflichtfeld" />
          <Input placeholder="Ohne Label" />
          <Input label="Deaktiviert" placeholder="Nicht editierbar" disabled />
        </div>
      ),
    },
  ],
};
