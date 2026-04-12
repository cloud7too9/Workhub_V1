import { useState } from 'react';
import { Modal } from './Modal';
import { Button } from '@/ui/actions/Button';

function ModalDemo() {
  const [basic, setBasic] = useState(false);
  const [confirm, setConfirm] = useState(false);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-sm)' }}>
      <Button variant="secondary" size="sm" onClick={() => setBasic(true)}>Einfaches Modal</Button>
      <Button variant="secondary" size="sm" onClick={() => setConfirm(true)}>Bestätigungs-Modal</Button>

      <Modal open={basic} onClose={() => setBasic(false)} title="Hinweis">
        <p style={{ fontSize: '14px', color: 'var(--text-2)', lineHeight: 1.6 }}>
          Das ist ein einfaches Modal mit Titel und Inhalt. Tippe außerhalb oder auf das X um zu schließen.
        </p>
      </Modal>

      <Modal
        open={confirm}
        onClose={() => setConfirm(false)}
        title="Auftrag löschen?"
        actions={
          <>
            <Button variant="ghost" style={{ flex: 1 }} onClick={() => setConfirm(false)}>Abbrechen</Button>
            <Button variant="danger" style={{ flex: 1 }} onClick={() => setConfirm(false)}>Löschen</Button>
          </>
        }
      >
        <p style={{ fontSize: '14px', color: 'var(--text-2)', lineHeight: 1.6 }}>
          Auftrag #1042 wird unwiderruflich gelöscht. Diese Aktion kann nicht rückgängig gemacht werden.
        </p>
      </Modal>
    </div>
  );
}

export const modalPreviews = {
  id: 'modal',
  name: 'Modal',
  sections: [
    { title: 'Varianten', render: () => <ModalDemo /> },
  ],
};
