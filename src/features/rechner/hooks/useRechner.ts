import { useState, useEffect, useCallback } from 'react';
import type { RechnerCard, Operation } from '@/types/rechner';
import { loadCards, saveCards, loadOperations, saveOperations } from '@/stores/rechnerStorage';

let _id = Date.now();
function uid() {
  return `r_${_id++}`;
}

export function useRechner() {
  const [cards, setCards] = useState<RechnerCard[]>(() => loadCards());
  const [operations, setOperations] = useState<Operation[]>(() => loadOperations());
  const [settingsOpen, setSettingsOpen] = useState(false);

  useEffect(() => { saveCards(cards); }, [cards]);
  useEffect(() => { saveOperations(operations); }, [operations]);

  const addCard = useCallback(() => {
    setCards((prev) => [
      ...prev,
      {
        id: uid(),
        operationId: operations.length === 1 ? operations[0]!.id : '',
        inputs: {},
        history: [],
      },
    ]);
  }, [operations]);

  const updateCard = useCallback((updated: RechnerCard) => {
    setCards((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
  }, []);

  const removeCard = useCallback((id: string) => {
    setCards((prev) => prev.filter((c) => c.id !== id));
  }, []);

  return {
    state: {
      cards,
      operations,
      settingsOpen,
    },
    actions: {
      addCard,
      updateCard,
      removeCard,
      setOperations,
      openSettings: () => setSettingsOpen(true),
      closeSettings: () => setSettingsOpen(false),
    },
  };
}
