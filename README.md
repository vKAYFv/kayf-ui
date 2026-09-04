![A dark @kayf/ui banner showing version 0.6.0 and 16 framework-agnostic Web Components](https://raw.githubusercontent.com/vKAYFv/kayf-ui/refs/heads/main/.github/assets/hero.svg)

<div align="center">

[![npm version](https://img.shields.io/npm/v/%40kayf%2Fui?color=62daf7&labelColor=07070a&label=version)](https://www.npmjs.com/package/@kayf/ui)
[![npm downloads](https://img.shields.io/npm/dm/%40kayf%2Fui?color=8b7cff&labelColor=07070a)](https://www.npmjs.com/package/@kayf/ui)
[![Bundle Size](https://img.shields.io/bundlephobia/minzip/@kayf/ui?color=51dfa4&labelColor=07070a)](https://bundlephobia.com/package/@kayf/ui)
[![License](https://img.shields.io/npm/l/%40kayf%2Fui?color=f8c868&labelColor=07070a)](LICENSE)
[![Storybook](https://img.shields.io/badge/Storybook-live-ff4785?labelColor=07070a)](https://main--69a564b0b16ce689ef423df8.chromatic.com/)

Modern, expressive Web Components for dark interfaces. Native browser APIs, TypeScript, Shadow DOM, and no runtime dependencies.

[Storybook](https://main--69a564b0b16ce689ef423df8.chromatic.com/) · [npm](https://www.npmjs.com/package/@kayf/ui) · [Issues](https://github.com/vKAYFv/kayf-ui/issues)

</div>

## Install

```bash
npm install @kayf/ui
```

Import the package once to register every custom element:

```ts
import '@kayf/ui'
```

Then use the components in HTML:

```html
<kayf-spotlight-card color="violet" glow="medium">
  <h2>Built for the browser</h2>
  <p>Framework-agnostic, typed, and easy to compose.</p>
</kayf-spotlight-card>
```

For a script-tag setup, load the UMD bundle from a CDN:

```html
<script src="https://unpkg.com/@kayf/ui/dist/kayf-ui.umd.js"></script>
```

## Components

| Element | Purpose |
| --- | --- |
| `<kayf-spotlight-card>` | Glass card with a pointer-following highlight |
| `<kayf-beam-button>` | Accessible action button with solid, outline, and ghost variants |
| `<kayf-prism-button>` | High-emphasis CTA with a localized refraction edge |
| `<kayf-orbit-button>` | Directional action with an orbital status mark |
| `<kayf-hold-button>` | Hold-to-confirm control for consequential actions |
| `<kayf-aurora-card>` | Ambient animated aurora surface |
| `<kayf-particle-field>` | Interactive canvas particle field |
| `<kayf-counter>` | Viewport-triggered metric card |
| `<kayf-magnetic-btn>` | Motion wrapper attracted to the cursor |
| `<kayf-holographic-card>` | 3D card with an iridescent shine |
| `<kayf-neon-border>` | Animated conic-gradient border |
| `<kayf-typewriter>` | Multi-line typewriter text |
| `<kayf-command-palette>` | Keyboard-first command menu |
| `<kayf-noise-card>` | Glass surface with lightweight grain |
| `<kayf-ripple-grid>` | Clickable dot grid with ripple waves |
| `<kayf-3d-tilt-card>` | Perspective tilt wrapper for slotted content |

Explore every variant and control in the [interactive Storybook](https://main--69a564b0b16ce689ef423df8.chromatic.com/).

## Examples

### Action buttons

```html
<kayf-prism-button color="violet" size="lg">
  Create release
</kayf-prism-button>

<kayf-orbit-button color="cyan">
  Open preview
</kayf-orbit-button>

<kayf-hold-button color="red" duration="1200">
  Delete build
</kayf-hold-button>
```

```ts
document.querySelector('kayf-prism-button')?.addEventListener('kayf-click', event => {
  console.log('Button activated', event)
})

document.querySelector('kayf-hold-button')?.addEventListener('kayf-confirm', event => {
  console.log('Hold completed', event)
})
```

### Command palette

```html
<kayf-command-palette id="commands" placeholder="Search actions…"></kayf-command-palette>
```

```ts
import type { CommandItem, CommandPalette } from '@kayf/ui'

const palette = document.querySelector<CommandPalette>('#commands')!
const commands: CommandItem[] = [
  { id: 'home', label: 'Go home', group: 'Navigation', shortcut: 'G+H' },
  { id: 'theme', label: 'Change theme', group: 'Preferences' },
]

palette.setItems(commands)
palette.open()
```

The default shortcut is <kbd>⌘ K</kbd> on macOS or <kbd>Ctrl K</kbd> elsewhere. Listen for `kayf-select`, `kayf-open`, and `kayf-close` to integrate it with your app.

### Frameworks

The package registers standard custom elements, so the same markup works in React, Vue, Svelte, Astro, or plain HTML.

```tsx
import '@kayf/ui'

export function FeatureCard() {
  return (
    <kayf-noise-card variant="glass" glow="violet" padding="28px">
      <h3>One component, any stack.</h3>
    </kayf-noise-card>
  )
}
```

## Design and accessibility

- Shared dark-surface, border, radius, typography, and accent tokens keep the collection visually consistent.
- Motion-heavy components respect `prefers-reduced-motion`.
- Interactive components expose keyboard focus and composed custom events where appropriate.
- Shadow parts are available on primary surfaces such as cards, buttons, overlays, and content wrappers.

You can override the shared CSS custom properties on a component:

```css
kayf-noise-card {
  --kayf-radius-md: 24px;
  --kayf-font-sans: "Geist", system-ui, sans-serif;
}

kayf-prism-button {
  --kayf-surface: rgba(18, 18, 24, 0.72);
}
```

## TypeScript

Public component classes and `CommandItem` are exported from the package root:

```ts
import type { RippleGrid, SpotlightCard } from '@kayf/ui'

const grid = document.querySelector<RippleGrid>('kayf-ripple-grid')
const card = document.querySelector<SpotlightCard>('kayf-spotlight-card')
```

## Development

```bash
npm install
npm run storybook
```

Useful checks:

```bash
npm run type-check
npm run build
npm run build-storybook
```

Storybook 10 requires Node.js 20.19 or newer for local development. The published components themselves run in modern browsers and have no runtime package dependencies.

## What’s new in 0.6

- `PrismButton` adds a high-emphasis CTA with localized pointer refraction.
- `OrbitButton` provides a directional action pattern for navigation and launch flows.
- `HoldButton` adds pointer, touch, and keyboard hold-to-confirm behavior for consequential actions.
- The Storybook introduction and component API documentation were rebuilt around the complete 16-component catalog.

## Migrating to 0.5

`LiquidButton`, `HudPanel`, and `GlitchText` were removed from the public package because they no longer match the direction of the library. Remove imports and usages of:

- `LiquidButton` / `<kayf-liquid-button>`
- `HudPanel` / `<kayf-hud-panel>`
- `GlitchText` / `<kayf-glitch-text>`

## License

MIT © [KAYF](https://github.com/vKAYFv)
