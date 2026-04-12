import { AlertCircle } from 'lucide-react';

export function ErrorState({ message = 'Etwas ist schiefgelaufen.' }: { message?: string }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '48px 24px', gap: '12px', textAlign: 'center' }}>
      <AlertCircle size={32} color="var(--error)" />
      <p style={{ fontSize: '15px', color: 'var(--text-2)', maxWidth: '280px' }}>{message}</p>
    </div>
  );
}
