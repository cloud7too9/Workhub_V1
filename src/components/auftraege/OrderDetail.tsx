import { useState, useCallback } from 'react';
import type { Order, ExtractedFieldKey, SelectionRect } from '../../types/orders';
import { tokens } from '../../styles/tokens';
import { OrderStatusBadge } from './OrderStatusBadge';
import { OrderFieldPanel } from './OrderFieldPanel';
import { DrawingViewer } from './DrawingViewer';
import { FieldConfirmDialog } from './FieldConfirmDialog';
import {
  isOrderAdvanceable,
  getAdvanceButtonLabel,
  orderStatusColors,
} from '../../data/orderStatus';

interface OrderDetailProps {
  order: Order;
  onClose: () => void;
  onAdvance: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onFieldSelection: (fieldKey: ExtractedFieldKey, rect: SelectionRect) => void;
  onFieldConfirm: (fieldKey: ExtractedFieldKey, value: string) => void;
  onSetDrawing: (imageData: string) => void;
}

type ViewMode = 'overview' | 'drawing' | 'confirm';

export function OrderDetail({
  order,
  onClose,
  onAdvance,
  onEdit,
  onDelete,
  onFieldSelection,
  onFieldConfirm,
  onSetDrawing,
}: OrderDetailProps) {
  const [activeField, setActiveField] = useState<ExtractedFieldKey | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('overview');
  const [pendingRawText, setPendingRawText] = useState('');

  const hasDrawing = !!order.images.drawingImage;
  const statusColor = orderStatusColors[order.status];
  const canAdvance = isOrderAdvanceable(order.status);
  const advanceLabel = getAdvanceButtonLabel(order.status);

  // Feld auswählen → Zeichnungsansicht öffnen
  const handleFieldClick = useCallback(
    (key: ExtractedFieldKey) => {
      if (!hasDrawing) return;
      setActiveField(key);
      setViewMode('drawing');
    },
    [hasDrawing],
  );

  // Markierung bestätigt → Rohtext simulieren (Phase 6 Platzhalter für echte OCR)
  const handleSelectionConfirm = useCallback(
    (rect: SelectionRect) => {
      if (!activeField) return;
      onFieldSelection(activeField, rect);

      // Phase 6: OCR-Platzhalter — in Zukunft wird hier echte Texterkennung stehen
      // Für jetzt: leerer Rohtext, Nutzer tippt manuell
      setPendingRawText('');
      setViewMode('confirm');
    },
    [activeField, onFieldSelection],
  );

  // Wert bestätigt
  const handleConfirm = useCallback(
    (value: string) => {
      if (!activeField) return;
      onFieldConfirm(activeField, value);
      setActiveField(null);
      setViewMode('overview');
    },
    [activeField, onFieldConfirm],
  );

  // Zeichnung hinzufügen/ersetzen
  const handleAddDrawing = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.capture = 'environment';
    input.onchange = () => {
      const file = input.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          onSetDrawing(reader.result);
        }
      };
      reader.readAsDataURL(file);
    };
    input.click();
  };

  // Anzeigetitel
  const displayTitle = order.article || 'Scan-Auftrag';

  // Zeichnungsansicht (Phase 5)
  if (viewMode === 'drawing' && order.images.drawingImage) {
    const existingRect = activeField
      ? order.extracted[activeField]?.selectionRect ?? null
      : null;

    return (
      <DrawingViewer
        imageData={order.images.drawingImage}
        activeField={activeField}
        existingRect={existingRect}
        onSelectionConfirm={handleSelectionConfirm}
        onClose={() => setViewMode('overview')}
      />
    );
  }

  // Bestätigungsdialog (Phase 6)
  if (viewMode === 'confirm' && activeField) {
    return (
      <>
        <FieldConfirmDialog
          fieldKey={activeField}
          rawText={pendingRawText}
          onConfirm={handleConfirm}
          onRetry={() => setViewMode('drawing')}
          onCancel={() => {
            setActiveField(null);
            setViewMode('overview');
          }}
        />
      </>
    );
  }

  // Hauptübersicht (Phase 4 + 7)
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 150,
        display: 'flex',
        flexDirection: 'column',
        background: tokens.bg,
        animation: 'fadeIn 0.15s ease',
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '14px',
          borderBottom: `1px solid ${tokens.border}`,
          flexShrink: 0,
        }}
      >
        <div style={{ minWidth: 0, flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
            <span style={{ fontSize: 16, fontWeight: 700, color: tokens.text }}>
              {displayTitle}
            </span>
            <OrderStatusBadge status={order.status} />
          </div>
          <div style={{ fontSize: 11, color: tokens.muted }}>
            Erstellt {new Date(order.createdAt).toLocaleString('de-DE')}
          </div>
        </div>
        <button
          onClick={onClose}
          style={{
            width: 36,
            height: 36,
            borderRadius: 10,
            border: `1px solid ${tokens.border}`,
            background: 'transparent',
            color: tokens.muted,
            fontSize: 16,
            cursor: 'pointer',
            display: 'grid',
            placeItems: 'center',
            flexShrink: 0,
          }}
        >
          ✕
        </button>
      </div>

      {/* Scrollbarer Inhalt */}
      <div style={{ flex: 1, overflowY: 'auto', padding: 14 }}>
        {/* Zeichnungs-Vorschau */}
        <div style={{ marginBottom: 16 }}>
          {hasDrawing ? (
            <div
              onClick={() => {
                if (activeField) setViewMode('drawing');
              }}
              style={{
                borderRadius: 14,
                border: `1px solid ${tokens.border}`,
                overflow: 'hidden',
                cursor: activeField ? 'pointer' : 'default',
                position: 'relative',
              }}
            >
              <img
                src={order.images.drawingImage!}
                alt="Zeichnung"
                style={{
                  width: '100%',
                  maxHeight: 200,
                  objectFit: 'cover',
                  display: 'block',
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  bottom: 8,
                  right: 8,
                  fontSize: 10,
                  fontWeight: 700,
                  color: tokens.accent,
                  background: 'rgba(6,7,9,0.8)',
                  padding: '3px 8px',
                  borderRadius: 6,
                }}
              >
                Zeichnung vorhanden
              </div>
            </div>
          ) : (
            <button
              onClick={handleAddDrawing}
              style={{
                width: '100%',
                height: 100,
                borderRadius: 14,
                border: `2px dashed ${tokens.border}`,
                background: 'transparent',
                color: tokens.muted,
                fontSize: 13,
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 6,
                fontFamily: tokens.font.ui,
              }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="2" y="5" width="20" height="15" rx="2" />
                <circle cx="12" cy="13" r="4" />
                <path d="M8 5V3h8v2" />
              </svg>
              Zeichnung hinzufügen
            </button>
          )}
        </div>

        {/* Phase 4+7: Klickbare Felder mit Säge-Priorisierung */}
        <OrderFieldPanel
          extracted={order.extracted}
          activeField={activeField}
          onFieldClick={handleFieldClick}
          hasDrawing={hasDrawing}
        />

        {/* Grunddaten (nachrangig, falls vorhanden) */}
        {(order.customer || order.orderNumber || order.deliveryDate || order.notes) && (
          <div style={{ marginTop: 20, paddingTop: 14, borderTop: `1px solid ${tokens.border}` }}>
            <div
              style={{
                fontSize: 10,
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                color: tokens.muted,
                marginBottom: 10,
              }}
            >
              Auftragsdaten
            </div>
            <div style={{ display: 'grid', gap: 6 }}>
              {order.customer && <InfoRow label="Kunde" value={order.customer} />}
              {order.orderNumber && <InfoRow label="Bestellnr." value={order.orderNumber} />}
              {order.deliveryDate && (
                <InfoRow
                  label="Lieferdatum"
                  value={new Date(order.deliveryDate).toLocaleDateString('de-DE')}
                />
              )}
              {order.dimensions && <InfoRow label="Maße (alt)" value={order.dimensions} />}
              {order.notes && <InfoRow label="Notizen" value={order.notes} />}
            </div>
          </div>
        )}
      </div>

      {/* Footer Actions */}
      <div
        style={{
          display: 'flex',
          gap: 8,
          padding: '12px 14px',
          borderTop: `1px solid ${tokens.border}`,
          flexShrink: 0,
        }}
      >
        {canAdvance && advanceLabel && (
          <button
            onClick={onAdvance}
            style={{
              flex: 2,
              height: 48,
              borderRadius: 12,
              border: 'none',
              background: statusColor,
              color: '#0b0d10',
              fontSize: 14,
              fontWeight: 700,
              cursor: 'pointer',
              fontFamily: tokens.font.ui,
            }}
          >
            {advanceLabel}
          </button>
        )}
        <button
          onClick={onEdit}
          style={{
            flex: 1,
            height: 48,
            borderRadius: 12,
            border: `1px solid ${tokens.border}`,
            background: 'transparent',
            color: tokens.accent,
            fontSize: 13,
            fontWeight: 600,
            cursor: 'pointer',
            fontFamily: tokens.font.ui,
          }}
        >
          ✎
        </button>
        <button
          onClick={onDelete}
          style={{
            height: 48,
            width: 48,
            borderRadius: 12,
            border: `1px solid ${tokens.danger}40`,
            background: `${tokens.danger}12`,
            color: tokens.danger,
            fontSize: 14,
            cursor: 'pointer',
            display: 'grid',
            placeItems: 'center',
          }}
        >
          ✕
        </button>
      </div>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: 'flex', gap: 10, fontSize: 13 }}>
      <span style={{ color: tokens.muted, minWidth: 90 }}>{label}</span>
      <span style={{ color: tokens.text, fontWeight: 500 }}>{value}</span>
    </div>
  );
}
