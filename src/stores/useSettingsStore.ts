const STOR_SETTINGS = 'workhub_settings';

export interface AppSettings {
  notifications: {
    push: boolean;
    sound: boolean;
    haptic: boolean;
  };
}

const DEFAULTS: AppSettings = {
  notifications: {
    push: false,
    sound: true,
    haptic: true,
  },
};

export function loadSettings(): AppSettings {
  try {
    const raw = localStorage.getItem(STOR_SETTINGS);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<AppSettings>;
      return {
        notifications: { ...DEFAULTS.notifications, ...parsed.notifications },
      };
    }
  } catch {
    // fall through
  }
  return DEFAULTS;
}

export function saveSettings(settings: AppSettings): void {
  localStorage.setItem(STOR_SETTINGS, JSON.stringify(settings));
}
