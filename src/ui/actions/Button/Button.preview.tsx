import { Button } from './Button';
import { Plus, ArrowRight, Trash2 } from 'lucide-react';

export const buttonPreviews = {
  id: 'button',
  name: 'Button',
  sections: [
    {
      title: 'Varianten',
      render: () => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <Button variant="primary" icon={<Plus size={16} />}>Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="danger" icon={<Trash2 size={16} />}>Danger</Button>
        </div>
      ),
    },
    {
      title: 'Größen',
      render: () => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <Button size="sm">Small</Button>
          <Button size="md">Medium</Button>
          <Button size="lg">Large</Button>
        </div>
      ),
    },
    {
      title: 'Zustände',
      render: () => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <Button variant="primary">Normal</Button>
          <Button variant="primary" disabled>Disabled</Button>
          <Button variant="primary" loading>Loading</Button>
          <Button variant="primary" fullWidth iconRight={<ArrowRight size={16} />}>Full Width</Button>
        </div>
      ),
    },
  ],
};
