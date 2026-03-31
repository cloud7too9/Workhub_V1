import { useState, useEffect, useCallback } from 'react';
import type { RechnerCard as RechnerCardType, Operation } from '../types/rechner';
import { loadCards, saveCards, loadOperations, saveOperations } from '../stores/rechnerStore';
import { uid } from '../utils/uid';
import { tokens } from '../styles/tokens';
import { RechnerCard } from '../components/rechner/RechnerCard';
import { SettingsDrawer } from '../components/rechner/SettingsDrawer';

export function Rechner() {
  const [cards, setCards] = useState<RechnerCardType[]>(() => loadCards());
  const [operations, setOperations] = useState<Operation[]>(() => loadOperations());
  const [settingsOpen, setSettingsOpen] = useState(false);

  // Persist on change
  useEffect(() => {
    saveCards(cards);
  }, [cards]);
  useEffect(() => {
    saveOperations(operations);
  }, [operations]);

  const addCard = useCallback(() => {
    setCards((prev) => [
      ...prev,
      {
        id: uid('r'),
        operationId: operations.length === 1 ? operations[0]!.id : '',
        inputs: {},
        history: [],
      },
    ]);
  }, [operations]);

  // When operations change, reset any cards whose operation was deleted
  const handleOpsChange = useCallback((newOps: Operation[]) => {
    setOperations(newOps);
    const validIds = new Set(newOps.map((o) => o.id));
    setCards((prev) =>
      prev.map((c) =>
        c.operationId && !validIds.has(c.operationId)
          ? { ...c, operationId: '', inputs: {} }
          : c,
      ),
    );
  }, []);

  const updateCard = useCallback((updated: RechnerCardType) => {
    setCards((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
  }, []);

  const removeCard = useCallback((id: string) => {
    setCards((prev) => prev.filter((c) => c.id !== id));
  }, []);

  return (
    <div>
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '20px 14px 14px',
        }}
      >
        <div>
          <h2
            style={{
              fontSize: 20,
              fontWeight: 700,
              color: tokens.text,
              letterSpacing: '-0.02em',
              marginBottom: 4,
            }}
          >
            Rechner
          </h2>
          <p style={{ fontSize: 13, color: tokens.muted }}>
            {cards.length === 0 ? 'Füge einen Rechner hinzu' : `${cards.length} aktiv`}
          </p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {/* Settings */}
          <button
            onClick={() => setSettingsOpen(true)}
            title="Rechner-Einstellungen"
            style={{
              width: 44,
              height: 44,
              borderRadius: 12,
              border: `1px solid ${tokens.border}`,
              background: tokens.surface,
              color: tokens.muted,
              fontSize: 18,
              cursor: 'pointer',
              display: 'grid',
              placeItems: 'center',
            }}
          >
            ⚙
          </button>
          {/* Add */}
          <button
            onClick={addCard}
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
            <span style={{ fontSize: 18, lineHeight: 1 }}>+</span> Rechner
          </button>
        </div>
      </div>

      {/* Cards */}
      <div style={{ padding: '0 14px 14px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        {cards.map((c) => (
          <RechnerCard
            key={c.id}
            card={c}
            operations={operations}
            onUpdate={updateCard}
            onRemove={removeCard}
          />
        ))}
      </div>

      {/* Empty State */}
      {cards.length === 0 && (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: tokens.muted }}>
          <div style={{ fontSize: 40, marginBottom: 12, opacity: 0.3 }}>⊕</div>
          <div style={{ fontSize: 14, marginBottom: 4 }}>Noch keine Rechner aktiv</div>
          <div style={{ fontSize: 12 }}>Klicke oben auf „+ Rechner" um loszulegen</div>
        </div>
      )}

      {/* Settings Drawer */}
      <SettingsDrawer
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        operations={operations}
        onOpsChange={handleOpsChange}
      />
    </div>
  );
}
