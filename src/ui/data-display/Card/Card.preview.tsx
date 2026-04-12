import { Card } from './Card';
import { Check, Star, AlertCircle } from 'lucide-react';

export const cardPreviews = {
  id: 'card',
  name: 'Card',
  sections: [
    {
      title: 'Varianten',
      render: () => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <Card variant="default"><span style={{ fontSize: '14px' }}>Default Card</span></Card>
          <Card variant="outlined"><span style={{ fontSize: '14px' }}>Outlined Card</span></Card>
          <Card variant="elevated"><span style={{ fontSize: '14px' }}>Elevated Card</span></Card>
          <Card variant="accent"><span style={{ fontSize: '14px' }}>Accent Card</span></Card>
        </div>
      ),
    },
    {
      title: 'Mit Inhalt',
      render: () => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <Card variant="default" padding="md">
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Check size={20} color="var(--success)" />
              <div>
                <div style={{ fontSize: '15px', fontWeight: 600 }}>Aufgabe erledigt</div>
                <div style={{ fontSize: '13px', color: 'var(--text-3)' }}>Vor 2 Minuten</div>
              </div>
            </div>
          </Card>
          <Card variant="elevated" padding="lg">
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Star size={20} color="var(--warning)" />
              <div>
                <div style={{ fontSize: '15px', fontWeight: 600 }}>Featured Item</div>
                <div style={{ fontSize: '13px', color: 'var(--text-3)' }}>Mit mehr Padding</div>
              </div>
            </div>
          </Card>
        </div>
      ),
    },
    {
      title: 'Klickbar',
      render: () => (
        <Card variant="default" padding="md" onClick={() => {}}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <AlertCircle size={20} color="var(--accent)" />
            <span style={{ fontSize: '14px' }}>Tap me — hat cursor: pointer</span>
          </div>
        </Card>
      ),
    },
  ],
};
