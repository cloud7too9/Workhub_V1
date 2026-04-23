import { useEffect, useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import type { Bearbeiter } from '@/types/bearbeiter';
import {
  loadBearbeiter,
  saveBearbeiter,
  createBearbeiter,
  deleteBearbeiter,
  updateBearbeiter,
} from '@/stores/bearbeiterStorage';
import { Button } from '@/ui';

const inputStyle: React.CSSProperties = {
  flex: 1,
  height: 40,
  borderRadius: 10,
  border: '1px solid var(--border)',
  background: 'var(--bg)',
  color: 'var(--text-1)',
  padding: '0 10px',
  fontSize: 13,
  fontFamily: 'var(--font-sans)',
  outline: 'none',
};

export function BearbeiterVerwaltung() {
  const [bearbeiter, setBearbeiter] = useState<Bearbeiter[]>([]);
  const [name, setName] = useState('');

  useEffect(() => {
    setBearbeiter(loadBearbeiter());
  }, []);

  useEffect(() => {
    saveBearbeiter(bearbeiter);
  }, [bearbeiter]);

  const handleAdd = () => {
    if (!name.trim()) return;
    const result = createBearbeiter(bearbeiter, name);
    setBearbeiter(result.bearbeiter);
    setName('');
  };

  const handleToggle = (id: string, active: boolean) => {
    setBearbeiter(updateBearbeiter(bearbeiter, id, { active }));
  };

  const handleDelete = (id: string) => {
    setBearbeiter(deleteBearbeiter(bearbeiter, id));
  };

  return (
    <div style={{ display: 'grid', gap: 'var(--sp-md)' }}>
      <div style={{ display: 'flex', gap: 8 }}>
        <input
          style={inputStyle}
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleAdd();
          }}
          placeholder="Name"
        />
        <Button variant="secondary" size="sm" icon={<Plus size={14} />} onClick={handleAdd}>
          Hinzufügen
        </Button>
      </div>

      {bearbeiter.length === 0 && (
        <p style={{ fontSize: 13, color: 'var(--text-3)' }}>Noch keine Bearbeiter angelegt.</p>
      )}

      <div style={{ display: 'grid', gap: 6 }}>
        {bearbeiter.map((b) => (
          <div
            key={b.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: '8px 12px',
              border: '1px solid var(--border-subtle)',
              borderRadius: 10,
              background: 'var(--surface)',
            }}
          >
            <span style={{ flex: 1, fontSize: 14, color: 'var(--text-1)', fontWeight: 500 }}>
              {b.name}
            </span>
            <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--text-3)' }}>
              <input
                type="checkbox"
                checked={b.active}
                onChange={(e) => handleToggle(b.id, e.target.checked)}
              />
              aktiv
            </label>
            <button
              onClick={() => handleDelete(b.id)}
              aria-label="Löschen"
              style={{
                width: 32,
                height: 32,
                borderRadius: 8,
                border: '1px solid var(--border)',
                background: 'transparent',
                color: 'var(--text-3)',
                cursor: 'pointer',
                display: 'grid',
                placeItems: 'center',
              }}
            >
              <Trash2 size={14} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
