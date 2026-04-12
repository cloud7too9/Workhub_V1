import { useToast } from './Toast';
import { Button } from '@/ui/actions/Button';

function ToastDemo() {
  const { toast } = useToast();
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-sm)' }}>
      <Button variant="primary" size="sm" onClick={() => toast('Erfolgreich gespeichert!', 'success')}>Erfolg</Button>
      <Button variant="danger" size="sm" onClick={() => toast('Beim Speichern ist ein Fehler aufgetreten.', 'error')}>Fehler</Button>
      <Button variant="secondary" size="sm" onClick={() => toast('Neue Version verfügbar.', 'info')}>Info</Button>
      <Button variant="secondary" size="sm" onClick={() => toast('Verbindung instabil.', 'warning')}>Warnung</Button>
    </div>
  );
}

export const toastPreviews = {
  id: 'toast',
  name: 'Toast',
  sections: [
    { title: 'Typen', render: () => <ToastDemo /> },
  ],
};
