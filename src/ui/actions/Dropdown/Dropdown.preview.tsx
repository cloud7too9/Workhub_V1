import { useState } from 'react';
import { Dropdown } from './Dropdown';
import { Wrench, Cog, Zap } from 'lucide-react';

function DropdownDemo() {
  const [machine, setMachine] = useState('');
  const [priority, setPriority] = useState('medium');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-lg)' }}>
      <Dropdown
        label="Maschine"
        placeholder="Maschine wählen…"
        value={machine}
        onChange={setMachine}
        options={[
          { id: 'ctx510', label: 'DMG CTX 510', icon: <Wrench size={16} color="var(--accent)" /> },
          { id: 'ctx310', label: 'DMG CTX 310', icon: <Wrench size={16} color="var(--accent)" /> },
          { id: 'grob', label: 'GROB G350', icon: <Cog size={16} color="var(--accent)" /> },
          { id: 'mazak', label: 'Mazak QTN 200', icon: <Zap size={16} color="var(--accent)" /> },
        ]}
      />
      <Dropdown
        label="Priorität"
        value={priority}
        onChange={setPriority}
        options={[
          { id: 'low', label: 'Niedrig' },
          { id: 'medium', label: 'Mittel' },
          { id: 'high', label: 'Hoch' },
          { id: 'urgent', label: 'Eilig' },
        ]}
      />
    </div>
  );
}

export const dropdownPreviews = {
  id: 'dropdown',
  name: 'Dropdown',
  sections: [
    { title: 'Beispiele', render: () => <DropdownDemo /> },
  ],
};
