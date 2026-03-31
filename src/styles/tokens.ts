export const tokens = {
  // Backgrounds
  bg: '#060709',
  surface: '#0d0f14',
  surfaceHover: '#13161e',
  border: '#1a1d27',
  borderFocus: '#00e5ff40',

  // Text
  text: '#f1f5f9',
  textSecondary: '#94a3b8',
  muted: '#6b7280',

  // Accent
  accent: '#00e5ff',
  accentDim: '#00e5ff20',

  // Metallgruppen-Farben
  metal: {
    alu: '#B0C4CE',
    aluSi1: '#8FA8B7',
    messing: '#C8A84E',
    stahl: '#7A8A94',
    legierterStahl: '#5C6B73',
    va: '#D4D8DC',
  },

  // Status
  success: '#22c55e',
  warning: '#f59e0b',
  danger: '#ef4444',

  // Typography
  font: {
    ui: "'DM Sans', sans-serif",
    mono: "'JetBrains Mono', monospace",
  },

  // Spacing
  radius: {
    sm: 8,
    md: 12,
    lg: 16,
  },

  // Touch targets
  touch: {
    minHeight: 48,
  },

  // Layout
  layout: {
    topbarHeight: 56,
  },
} as const;

export type MetalColorKey = keyof typeof tokens.metal;
