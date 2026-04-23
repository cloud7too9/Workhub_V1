import { useEinstellungen } from '@/features/einstellungen/hooks/useEinstellungen';
import { EinstellungenView } from '@/features/einstellungen/views/EinstellungenView';

export function EinstellungenPage() {
  const { state, actions } = useEinstellungen();

  return (
    <EinstellungenView
      activeSection={state.activeSection}
      changelog={state.changelog}
      settings={state.settings}
      showReset={state.showReset}
      onSectionChange={(s) => actions.setActiveSection(s as 'changelog' | 'notifications' | 'bearbeiter')}
      onUndo={actions.handleUndo}
      onOpenReset={actions.openReset}
      onCancelReset={actions.cancelReset}
      onConfirmReset={actions.handleReset}
      onNotificationsChange={actions.updateNotifications}
    />
  );
}
