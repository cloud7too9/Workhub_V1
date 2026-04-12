import { useState } from 'react';
import { Chip, ChipGroup } from './Chips';
import { Star, Zap } from 'lucide-react';

function ChipsDemo() {
  const [selected, setSelected] = useState<Set<string>>(new Set(['cnc']));
  const toggle = (id: string) => setSelected(prev => {
    const next = new Set(prev);
    if (next.has(id)) next.delete(id); else next.add(id);
    return next;
  });

  const [tags, setTags] = useState(['React', 'TypeScript', 'Vite']);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div>
        <span style={{ fontSize: '13px', color: 'var(--text-3)', marginBottom: '8px', display: 'block' }}>Filter-Chips</span>
        <ChipGroup>
          <Chip label="CNC" active={selected.has('cnc')} onToggle={() => toggle('cnc')} icon={<Zap size={14} />} />
          <Chip label="Drehen" active={selected.has('drehen')} onToggle={() => toggle('drehen')} />
          <Chip label="Fräsen" active={selected.has('fraesen')} onToggle={() => toggle('fraesen')} />
          <Chip label="Favoriten" active={selected.has('fav')} onToggle={() => toggle('fav')} icon={<Star size={14} />} />
        </ChipGroup>
      </div>
      <div>
        <span style={{ fontSize: '13px', color: 'var(--text-3)', marginBottom: '8px', display: 'block' }}>Entfernbare Tags</span>
        <ChipGroup>
          {tags.map(t => (
            <Chip key={t} label={t} active onRemove={() => setTags(prev => prev.filter(x => x !== t))} />
          ))}
        </ChipGroup>
      </div>
    </div>
  );
}

export const chipsPreviews = {
  id: 'chips',
  name: 'Chips',
  sections: [
    { title: 'Interaktiv', render: () => <ChipsDemo /> },
  ],
};
