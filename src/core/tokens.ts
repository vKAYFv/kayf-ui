export const tokens = {
  colors: {
    cyan: '#62daf7',
    violet: '#8b7cff',
    emerald: '#51dfa4',
    amber: '#f8c868',
    red: '#ff7383',
    white: '#f4f4f7',
  },
  glow: {
    cyan: 'rgba(98, 218, 247, 0.18)',
    violet: 'rgba(139, 124, 255, 0.18)',
    emerald: 'rgba(81, 223, 164, 0.18)',
    amber: 'rgba(248, 200, 104, 0.18)',
    red: 'rgba(255, 115, 131, 0.18)',
    white: 'rgba(244, 244, 247, 0.16)',
  },
  spotlight: {
    cyan: 'rgba(98, 218, 247, 0.12)',
    violet: 'rgba(139, 124, 255, 0.12)',
    emerald: 'rgba(81, 223, 164, 0.12)',
    amber: 'rgba(248, 200, 104, 0.12)',
    red: 'rgba(255, 115, 131, 0.12)',
    white: 'rgba(244, 244, 247, 0.1)',
  },
} as const

export type ColorVariant = keyof typeof tokens.colors

/** Shared design tokens injected into every Kayf component shadow root. */
export const baseCSS = `
  :host {
    color-scheme: dark;
    --kayf-cyan: #62daf7;
    --kayf-violet: #8b7cff;
    --kayf-emerald: #51dfa4;
    --kayf-amber: #f8c868;
    --kayf-red: #ff7383;
    --kayf-bg: #07070a;
    --kayf-surface: rgba(17, 17, 24, 0.82);
    --kayf-surface-elevated: rgba(24, 24, 33, 0.9);
    --kayf-border: rgba(255, 255, 255, 0.08);
    --kayf-border-strong: rgba(255, 255, 255, 0.14);
    --kayf-text: #f4f4f7;
    --kayf-muted: rgba(228, 228, 231, 0.58);
    --kayf-subtle: rgba(228, 228, 231, 0.36);
    --kayf-radius-sm: 10px;
    --kayf-radius-md: 16px;
    --kayf-radius-lg: 22px;
    --kayf-shadow: 0 24px 64px rgba(0, 0, 0, 0.34);
    --kayf-font-sans: Inter, ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    --kayf-font-mono: "SFMono-Regular", Consolas, "Liberation Mono", monospace;
  }

  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
      scroll-behavior: auto !important;
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
    }
  }
`

export function getColor(value: ColorVariant | string): string {
  return tokens.colors[value as ColorVariant] ?? value
}

export function getGlow(value: ColorVariant | string): string {
  return tokens.glow[value as ColorVariant] ?? 'rgba(244, 244, 247, 0.12)'
}

export function getSpotlight(value: ColorVariant | string): string {
  return tokens.spotlight[value as ColorVariant] ?? 'rgba(244, 244, 247, 0.08)'
}
