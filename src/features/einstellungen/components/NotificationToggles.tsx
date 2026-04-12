

interface ToggleRowProps {
  label: string;
  description?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

function ToggleRow({ label, description, checked, onChange }: ToggleRowProps) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 12,
        padding: '14px 14px',
        border: `1px solid ${'var(--border)'}`,
        borderRadius: 14,
        background: 'var(--bg)',
      }}
    >
      <div style={{ minWidth: 0 }}>
        <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--text-1)' }}>{label}</div>
        {description && (
          <div style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 2 }}>{description}</div>
        )}
      </div>

      {/* iOS-style toggle */}
      <div
        onClick={() => onChange(!checked)}
        role="switch"
        aria-checked={checked}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onChange(!checked);
          }
        }}
        style={{
          position: 'relative',
          width: 50,
          height: 28,
          borderRadius: 999,
          background: checked ? 'var(--accent)' : 'rgba(255,255,255,0.16)',
          border: `1px solid ${checked ? 'var(--accent)' + '80' : 'rgba(255,255,255,0.14)'}`,
          cursor: 'pointer',
          transition: 'background 0.18s, border-color 0.18s',
          flexShrink: 0,
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: 2,
            left: checked ? 24 : 2,
            width: 22,
            height: 22,
            borderRadius: 999,
            background: 'var(--surface)',
            border: '1px solid rgba(255,255,255,0.14)',
            transition: 'left 0.18s ease',
          }}
        />
      </div>
    </div>
  );
}

interface NotificationSettings {
  push: boolean;
  sound: boolean;
  haptic: boolean;
}

interface NotificationTogglesProps {
  settings: NotificationSettings;
  onChange: (settings: NotificationSettings) => void;
}

export function NotificationToggles({ settings, onChange }: NotificationTogglesProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <ToggleRow
        label="Push-Benachrichtigungen"
        description="Benachrichtigungen auf dem Gerät erhalten"
        checked={settings.push}
        onChange={(v) => onChange({ ...settings, push: v })}
      />
      <ToggleRow
        label="Benachrichtigungston"
        description="Akustisches Signal bei Benachrichtigungen"
        checked={settings.sound}
        onChange={(v) => onChange({ ...settings, sound: v })}
      />
      <ToggleRow
        label="Haptik"
        description="Vibration bei Benachrichtigungen"
        checked={settings.haptic}
        onChange={(v) => onChange({ ...settings, haptic: v })}
      />
    </div>
  );
}
