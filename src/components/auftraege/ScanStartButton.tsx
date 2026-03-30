import { useRef } from 'react';
import { tokens } from '../../styles/tokens';

interface ScanStartButtonProps {
  onImageCaptured: (imageData: string) => void;
}

export function ScanStartButton({ onImageCaptured }: ScanStartButtonProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        onImageCaptured(reader.result);
      }
    };
    reader.readAsDataURL(file);

    // Reset damit dieselbe Datei erneut gewählt werden kann
    e.target.value = '';
  };

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFile}
        style={{ display: 'none' }}
      />
      <button
        onClick={() => inputRef.current?.click()}
        style={{
          height: 44,
          padding: '0 18px',
          borderRadius: 12,
          border: `1px solid ${tokens.accent}40`,
          background: tokens.accentDim,
          color: tokens.accent,
          fontSize: 14,
          fontWeight: 600,
          fontFamily: tokens.font.ui,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: 6,
        }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="2" y="5" width="20" height="15" rx="2" />
          <circle cx="12" cy="13" r="4" />
          <path d="M8 5V3h8v2" />
        </svg>
        Zeichnung scannen
      </button>
    </>
  );
}
