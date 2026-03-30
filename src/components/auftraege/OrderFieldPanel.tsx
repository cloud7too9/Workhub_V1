import type { ExtractedFields, ExtractedFieldKey } from '../../types/orders';
import { extractedFieldLabels, sawRelevantFields, generalFields } from '../../types/orders';
import { tokens } from '../../styles/tokens';

interface OrderFieldPanelProps {
  extracted: ExtractedFields;
  activeField: ExtractedFieldKey | null;
  onFieldClick: (key: ExtractedFieldKey) => void;
  hasDrawing: boolean;
}

function FieldChip({
  fieldKey,
  label,
  extracted,
  isActive,
  onClick,
  hasDrawing,
}: {
  fieldKey: ExtractedFieldKey;
  label: string;
  extracted: ExtractedFields;
  isActive: boolean;
  onClick: () => void;
  hasDrawing: boolean;
}) {
  const field = extracted[fieldKey];
  const isEmpty = !field || !field.value;
  const isConfirmed = field?.confirmed === true;

  // Farben nach Zustand
  let borderColor: string = tokens.border;
  let bgColor: string = 'transparent';
  let textColor: string = tokens.muted;
  let valueColor: string = tokens.text;

  if (isActive) {
    borderColor = tokens.accent;
    bgColor = `${tokens.accent}12`;
    textColor = tokens.accent;
    valueColor = tokens.accent;
  } else if (isConfirmed) {
    borderColor = `${tokens.success}50`;
    bgColor = `${tokens.success}08`;
    textColor = tokens.success;
    valueColor = tokens.text;
  } else if (!isEmpty) {
    borderColor = `${tokens.warning}40`;
    textColor = tokens.warning;
  }

  return (
    <button
      onClick={onClick}
      disabled={!hasDrawing}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        gap: 2,
        padding: '10px 14px',
        borderRadius: 12,
        border: `1px solid ${borderColor}`,
        background: bgColor,
        cursor: hasDrawing ? 'pointer' : 'default',
        opacity: hasDrawing ? 1 : 0.5,
        width: '100%',
        textAlign: 'left',
        fontFamily: tokens.font.ui,
        transition: 'all 0.15s ease',
      }}
    >
      <span
        style={{
          fontSize: 10,
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          color: textColor,
        }}
      >
        {label}
        {isActive && ' ◀'}
      </span>
      <span
        style={{
          fontSize: 14,
          fontWeight: isEmpty ? 400 : 600,
          color: isEmpty ? tokens.muted : valueColor,
          fontFamily: isEmpty ? tokens.font.ui : tokens.font.mono,
        }}
      >
        {isEmpty ? '—' : field!.value}
      </span>
      {!isEmpty && !isConfirmed && (
        <span style={{ fontSize: 9, color: tokens.warning, fontWeight: 600 }}>
          unbestätigt
        </span>
      )}
    </button>
  );
}

export function OrderFieldPanel({
  extracted,
  activeField,
  onFieldClick,
  hasDrawing,
}: OrderFieldPanelProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      {/* Säge-Block (priorisiert) */}
      <div>
        <div
          style={{
            fontSize: 10,
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            color: tokens.accent,
            marginBottom: 8,
            paddingLeft: 2,
          }}
        >
          ▸ Säge-relevant
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          {sawRelevantFields.map((key) => (
            <FieldChip
              key={key}
              fieldKey={key}
              label={extractedFieldLabels[key]}
              extracted={extracted}
              isActive={activeField === key}
              onClick={() => onFieldClick(key)}
              hasDrawing={hasDrawing}
            />
          ))}
        </div>
      </div>

      {/* Allgemein-Block */}
      <div>
        <div
          style={{
            fontSize: 10,
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            color: tokens.muted,
            marginBottom: 8,
            paddingLeft: 2,
          }}
        >
          Allgemein
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          {generalFields.map((key) => (
            <FieldChip
              key={key}
              fieldKey={key}
              label={extractedFieldLabels[key]}
              extracted={extracted}
              isActive={activeField === key}
              onClick={() => onFieldClick(key)}
              hasDrawing={hasDrawing}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
