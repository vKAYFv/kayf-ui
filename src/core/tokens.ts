export const tokens = {
  colors: {
    cyan:    '#00d4ff',
    violet:  '#7c3aed',
    emerald: '#10b981',
    amber:   '#f59e0b',
    red:     '#ef4444',
    white:   '#e8e8f0',
  },
  glow: {
    cyan:    'rgba(0, 212, 255, 0.2)',
    violet:  'rgba(124, 58, 237, 0.2)',
    emerald: 'rgba(16, 185, 129, 0.2)',
    amber:   'rgba(245, 158, 11, 0.2)',
    red:     'rgba(239, 68, 68, 0.2)',
    white:   'rgba(232, 232, 240, 0.2)',
  },
  spotlight: {
    cyan:    'rgba(0, 212, 255, 0.12)',
    violet:  'rgba(124, 58, 237, 0.12)',
    emerald: 'rgba(16, 185, 129, 0.12)',
    amber:   'rgba(245, 158, 11, 0.12)',
    red:     'rgba(239, 68, 68, 0.12)',
    white:   'rgba(232, 232, 240, 0.12)',
  },
} as const

// ColorVariant выводится из colors — все три объекта теперь имеют одинаковые ключи
export type ColorVariant = keyof typeof tokens.colors

export const baseCSS = `
  :host {
    --kayf-cyan:    #00d4ff;
    --kayf-violet:  #7c3aed;
    --kayf-emerald: #10b981;
    --kayf-amber:   #f59e0b;
    --kayf-red:     #ef4444;
    --kayf-bg:      #050508;
    --kayf-surface: rgba(255, 255, 255, 0.03);
    --kayf-border:  rgba(255, 255, 255, 0.07);
    --kayf-text:    #e8e8f0;
    --kayf-muted:   rgba(232, 232, 240, 0.4);
    --kayf-font-sans: 'Syne', system-ui, sans-serif;
    --kayf-font-mono: 'JetBrains Mono', monospace;
  }
`

export function getColor(v: ColorVariant | string): string {
  return tokens.colors[v as ColorVariant] ?? v
}

export function getGlow(v: ColorVariant | string): string {
  return tokens.glow[v as ColorVariant] ?? 'rgba(255,255,255,0.1)'
}

export function getSpotlight(v: ColorVariant | string): string {
  return tokens.spotlight[v as ColorVariant] ?? 'rgba(255,255,255,0.08)'
}