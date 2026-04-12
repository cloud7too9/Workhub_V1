import { createContext, useContext, useState, useCallback, useEffect } from 'react';

export interface ThemeConfig {
  mode: 'dark' | 'light';
  accent: string;
  radius: number;
  spacing: number;
}

const defaultConfig: ThemeConfig = {
  mode: 'dark',
  accent: '#00e5ff',
  radius: 10,
  spacing: 1,
};

interface ThemeCtx {
  config: ThemeConfig;
  update: (partial: Partial<ThemeConfig>) => void;
  reset: () => void;
}

const Ctx = createContext<ThemeCtx>({
  config: defaultConfig,
  update: () => {},
  reset: () => {},
});

export const useTheme = () => useContext(Ctx);

const darkColors: Record<string, string> = {
  bg: '#060709',
  surface: '#0d0f14',
  'surface-alt': '#13161d',
  border: '#1e2230',
  'border-subtle': '#161a24',
  'text-1': '#e8eaed',
  'text-2': '#8b8fa3',
  'text-3': '#565a6e',
  success: '#34d399',
  warning: '#fbbf24',
  error: '#f87171',
  'shadow-sm': '0 1px 3px rgba(0,0,0,0.4)',
  'shadow-md': '0 4px 12px rgba(0,0,0,0.5)',
  'shadow-lg': '0 8px 24px rgba(0,0,0,0.6)',
};

const lightColors: Record<string, string> = {
  bg: '#f4f5f7',
  surface: '#ffffff',
  'surface-alt': '#ebedf0',
  border: '#d1d5db',
  'border-subtle': '#e5e7eb',
  'text-1': '#111827',
  'text-2': '#6b7280',
  'text-3': '#9ca3af',
  success: '#059669',
  warning: '#d97706',
  error: '#dc2626',
  'shadow-sm': '0 1px 3px rgba(0,0,0,0.08)',
  'shadow-md': '0 4px 12px rgba(0,0,0,0.1)',
  'shadow-lg': '0 8px 24px rgba(0,0,0,0.12)',
};

function hexToRgb(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `${r},${g},${b}`;
}

function applyConfig(config: ThemeConfig) {
  const root = document.documentElement;
  const colors = config.mode === 'dark' ? darkColors : lightColors;

  for (const [key, val] of Object.entries(colors)) {
    root.style.setProperty(`--${key}`, val);
  }

  root.style.setProperty('--accent', config.accent);
  root.style.setProperty('--accent-muted', `rgba(${hexToRgb(config.accent)},${config.mode === 'dark' ? '0.12' : '0.08'})`);
  root.style.setProperty('--accent-hover', config.accent);
  root.style.setProperty('--shadow-glow', `0 0 20px rgba(${hexToRgb(config.accent)},${config.mode === 'dark' ? '0.15' : '0.1'})`);

  const r = config.radius;
  root.style.setProperty('--radius-sm', `${Math.round(r * 0.6)}px`);
  root.style.setProperty('--radius-md', `${r}px`);
  root.style.setProperty('--radius-lg', `${Math.round(r * 1.4)}px`);
  root.style.setProperty('--radius-xl', `${r * 2}px`);

  const s = config.spacing;
  root.style.setProperty('--sp-xs', `${Math.round(4 * s)}px`);
  root.style.setProperty('--sp-sm', `${Math.round(8 * s)}px`);
  root.style.setProperty('--sp-md', `${Math.round(12 * s)}px`);
  root.style.setProperty('--sp-lg', `${Math.round(16 * s)}px`);
  root.style.setProperty('--sp-xl', `${Math.round(20 * s)}px`);
  root.style.setProperty('--sp-2xl', `${Math.round(24 * s)}px`);
  root.style.setProperty('--sp-3xl', `${Math.round(32 * s)}px`);
  root.style.setProperty('--pad', `${Math.round(20 * s)}px`);
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [config, setConfig] = useState<ThemeConfig>(defaultConfig);

  const update = useCallback((partial: Partial<ThemeConfig>) => {
    setConfig(prev => ({ ...prev, ...partial }));
  }, []);

  const reset = useCallback(() => setConfig(defaultConfig), []);

  useEffect(() => { applyConfig(config); }, [config]);

  return <Ctx.Provider value={{ config, update, reset }}>{children}</Ctx.Provider>;
}
