import { tokens } from '../../styles/tokens';

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function SearchInput({ value, onChange, placeholder = 'Suchen\u2026' }: SearchInputProps) {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      style={{
        flex: 1,
        height: 44,
        borderRadius: 14,
        border: `1px solid ${tokens.border}`,
        background: tokens.surface,
        color: tokens.text,
        padding: '0 12px',
        outline: 'none',
        fontSize: 14,
        fontFamily: tokens.font.ui,
        minWidth: 0,
      }}
    />
  );
}
