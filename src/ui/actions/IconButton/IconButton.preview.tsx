import { IconButton } from './IconButton';
import { Plus, X, Settings, ChevronLeft } from 'lucide-react';

export const iconButtonPreviews = {
  id: 'icon-button',
  name: 'IconButton',
  sections: [
    {
      title: 'Varianten',
      render: () => (
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <IconButton variant="ghost"><Plus size={20} /></IconButton>
          <IconButton variant="ghost"><X size={20} /></IconButton>
          <IconButton variant="surface"><Settings size={20} /></IconButton>
          <IconButton variant="surface"><ChevronLeft size={20} /></IconButton>
        </div>
      ),
    },
    {
      title: 'Größen',
      render: () => (
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <IconButton size={36}><Plus size={16} /></IconButton>
          <IconButton size={44}><Plus size={20} /></IconButton>
          <IconButton size={52}><Plus size={24} /></IconButton>
        </div>
      ),
    },
  ],
};
