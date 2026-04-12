import { Search, X } from 'lucide-react';

interface SearchFieldProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
}

export function SearchField({ value, onChange, placeholder = 'Suchen…' }: SearchFieldProps) {
  return (
    <div
      role="search"
      style={{
        display: 'flex', alignItems: 'center', gap: '10px',
        padding: '0 16px', background: 'var(--surface)',
        border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)',
        minHeight: '44px',
      }}
    >
      <Search size={18} color="var(--text-3)" aria-hidden="true" />
      <input
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
        style={{
          flex: 1, border: 'none', background: 'transparent',
          color: 'var(--text-1)', fontSize: '15px', fontFamily: 'var(--font-sans)',
          outline: 'none',
        }}
      />
      {value && (
        <button onClick={() => onChange('')} aria-label="Suche leeren" style={{ border: 'none', background: 'none', cursor: 'pointer', display: 'flex', padding: 0 }}>
          <X size={16} color="var(--text-3)" />
        </button>
      )}
    </div>
  );
}
