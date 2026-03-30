import { useState, useRef, useCallback, useEffect } from 'react';
import type { SelectionRect, ExtractedFieldKey } from '../../types/orders';
import { extractedFieldLabels } from '../../types/orders';
import { tokens } from '../../styles/tokens';

interface DrawingViewerProps {
  imageData: string;
  activeField: ExtractedFieldKey | null;
  existingRect: SelectionRect | null;
  onSelectionConfirm: (rect: SelectionRect) => void;
  onClose: () => void;
}

export function DrawingViewer({
  imageData,
  activeField,
  existingRect,
  onSelectionConfirm,
  onClose,
}: DrawingViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [drawing, setDrawing] = useState(false);
  const [startPos, setStartPos] = useState<{ x: number; y: number } | null>(null);
  const [currentRect, setCurrentRect] = useState<SelectionRect | null>(existingRect);

  // Reset bei Feldwechsel
  useEffect(() => {
    setCurrentRect(existingRect);
  }, [existingRect, activeField]);

  const getPercentPos = useCallback(
    (clientX: number, clientY: number) => {
      const el = containerRef.current;
      if (!el) return { x: 0, y: 0 };
      const rect = el.getBoundingClientRect();
      return {
        x: Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100)),
        y: Math.max(0, Math.min(100, ((clientY - rect.top) / rect.height) * 100)),
      };
    },
    [],
  );

  const handlePointerDown = (e: React.PointerEvent) => {
    if (!activeField) return;
    const pos = getPercentPos(e.clientX, e.clientY);
    setStartPos(pos);
    setDrawing(true);
    setCurrentRect(null);
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!drawing || !startPos) return;
    const pos = getPercentPos(e.clientX, e.clientY);
    setCurrentRect({
      x: Math.min(startPos.x, pos.x),
      y: Math.min(startPos.y, pos.y),
      width: Math.abs(pos.x - startPos.x),
      height: Math.abs(pos.y - startPos.y),
    });
  };

  const handlePointerUp = () => {
    setDrawing(false);
    setStartPos(null);
  };

  const handleConfirm = () => {
    if (currentRect && currentRect.width > 1 && currentRect.height > 1) {
      onSelectionConfirm(currentRect);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 200,
        background: tokens.bg,
        display: 'flex',
        flexDirection: 'column',
        animation: 'fadeIn 0.15s ease',
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '12px 14px',
          borderBottom: `1px solid ${tokens.border}`,
          flexShrink: 0,
        }}
      >
        <div>
          <div style={{ fontSize: 14, fontWeight: 700, color: tokens.text }}>
            Bereich markieren
          </div>
          {activeField && (
            <div style={{ fontSize: 12, color: tokens.accent, fontWeight: 600 }}>
              Ziel: {extractedFieldLabels[activeField]}
            </div>
          )}
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
          }}
        >
          ✕
        </button>
      </div>

      {/* Zeichnung + Markierung */}
      <div
        ref={containerRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        style={{
          flex: 1,
          position: 'relative',
          overflow: 'auto',
          touchAction: activeField ? 'none' : 'auto',
          cursor: activeField ? 'crosshair' : 'default',
        }}
      >
        <img
          src={imageData}
          alt="Technische Zeichnung"
          draggable={false}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            userSelect: 'none',
          }}
        />

        {/* Aktuelles Rechteck */}
        {currentRect && (
          <div
            style={{
              position: 'absolute',
              left: `${currentRect.x}%`,
              top: `${currentRect.y}%`,
              width: `${currentRect.width}%`,
              height: `${currentRect.height}%`,
              border: `2px solid ${tokens.accent}`,
              background: `${tokens.accent}15`,
              borderRadius: 4,
              pointerEvents: 'none',
              transition: drawing ? 'none' : 'all 0.15s ease',
            }}
          />
        )}

        {/* Hint wenn kein Feld aktiv */}
        {!activeField && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'rgba(0,0,0,0.5)',
            }}
          >
            <div
              style={{
                background: tokens.surface,
                border: `1px solid ${tokens.border}`,
                borderRadius: 14,
                padding: '16px 24px',
                textAlign: 'center',
                color: tokens.muted,
                fontSize: 13,
              }}
            >
              Wähle zuerst ein Zielfeld aus
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
        <button
          onClick={onClose}
          style={{
            flex: 1,
            height: 48,
            borderRadius: 12,
            border: `1px solid ${tokens.border}`,
            background: 'transparent',
            color: tokens.muted,
            fontSize: 14,
            fontWeight: 600,
            cursor: 'pointer',
            fontFamily: tokens.font.ui,
          }}
        >
          Zurück
        </button>
        <button
          onClick={handleConfirm}
          disabled={!currentRect || currentRect.width < 1}
          style={{
            flex: 2,
            height: 48,
            borderRadius: 12,
            border: 'none',
            background: currentRect && currentRect.width > 1 ? tokens.accent : tokens.border,
            color: currentRect && currentRect.width > 1 ? '#0b0d10' : tokens.muted,
            fontSize: 14,
            fontWeight: 700,
            cursor: currentRect && currentRect.width > 1 ? 'pointer' : 'default',
            fontFamily: tokens.font.ui,
          }}
        >
          Bereich übernehmen
        </button>
      </div>
    </div>
  );
}
