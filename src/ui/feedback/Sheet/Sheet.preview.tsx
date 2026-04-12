import { useState } from 'react';
import { Sheet } from './Sheet';
import { Button } from '@/ui/actions/Button';
import { Card } from '@/ui/data-display/Card';

function SheetDemo() {
  const [leftOpen, setLeftOpen] = useState(false);
  const [bottomOpen, setBottomOpen] = useState(false);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      <Button variant="secondary" onClick={() => setLeftOpen(true)}>Sidebar öffnen</Button>
      <Button variant="secondary" onClick={() => setBottomOpen(true)}>Bottom Sheet öffnen</Button>

      <Sheet open={leftOpen} onClose={() => setLeftOpen(false)} title="Sidebar" side="left">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <Card variant="default" padding="sm"><span style={{ fontSize: '14px' }}>Menüpunkt 1</span></Card>
          <Card variant="default" padding="sm"><span style={{ fontSize: '14px' }}>Menüpunkt 2</span></Card>
          <Card variant="default" padding="sm"><span style={{ fontSize: '14px' }}>Menüpunkt 3</span></Card>
        </div>
      </Sheet>

      <Sheet open={bottomOpen} onClose={() => setBottomOpen(false)} title="Optionen" side="bottom">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <Button variant="primary" fullWidth onClick={() => setBottomOpen(false)}>Aktion 1</Button>
          <Button variant="secondary" fullWidth onClick={() => setBottomOpen(false)}>Aktion 2</Button>
          <Button variant="ghost" fullWidth onClick={() => setBottomOpen(false)}>Abbrechen</Button>
        </div>
      </Sheet>
    </div>
  );
}

export const sheetPreviews = {
  id: 'sheet',
  name: 'Sheet',
  sections: [
    { title: 'Sidebar und Bottom Sheet', render: () => <SheetDemo /> },
  ],
};
