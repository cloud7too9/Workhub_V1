import { useRechner } from '@/features/rechner/hooks/useRechner';
import { RechnerView } from '@/features/rechner/views/RechnerView';

export function RechnerPage() {
  const { state, actions } = useRechner();

  return (
    <RechnerView
      cards={state.cards}
      operations={state.operations}
      settingsOpen={state.settingsOpen}
      onAddCard={actions.addCard}
      onUpdateCard={actions.updateCard}
      onRemoveCard={actions.removeCard}
      onOpsChange={actions.setOperations}
      onOpenSettings={actions.openSettings}
      onCloseSettings={actions.closeSettings}
    />
  );
}
