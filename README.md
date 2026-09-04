![A dark @kayf/ui banner showing version 0.6.0 and 16 framework-agnostic Web Components](https://raw.githubusercontent.com/vKAYFv/kayf-ui/refs/heads/main/.github/assets/hero.svg)

<div align="center">

[![npm version](https://img.shields.io/npm/v/%40kayf%2Fui?color=62daf7&labelColor=07070a&label=version)](https://www.npmjs.com/package/@kayf/ui)
[![npm downloads](https://img.shields.io/npm/dm/%40kayf%2Fui?color=8b7cff&labelColor=07070a)](https://www.npmjs.com/package/@kayf/ui)
[![Bundle Size](https://img.shields.io/bundlephobia/minzip/@kayf/ui?color=51dfa4&labelColor=07070a)](https://bundlephobia.com/package/@kayf/ui)
[![License](https://img.shields.io/npm/l/%40kayf%2Fui?color=f8c868&labelColor=07070a)](LICENSE)
[![Storybook](https://img.shields.io/badge/Storybook-live-ff4785?labelColor=07070a)](https://main--69a564b0b16ce689ef423df8.chromatic.com/)

Expressive Web Components for dark interfaces. Native browser APIs, TypeScript, Shadow DOM, and zero runtime dependencies.

[Explore Storybook](https://main--69a564b0b16ce689ef423df8.chromatic.com/) · [Install from npm](https://www.npmjs.com/package/@kayf/ui) · [Report an issue](https://github.com/vKAYFv/kayf-ui/issues)

</div>

## Why @kayf/ui

- **Framework-agnostic.** Use the same custom elements in plain HTML, React, Vue, Svelte, Astro, or any other client-side stack.
- **Designed as a system.** Shared color, surface, radius, typography, and motion decisions keep all 16 components visually coherent.
- **Interaction-ready.** Keyboard focus, touch behavior, loading and disabled states, composed events, and reduced-motion fallbacks are built in.
- **Easy to extend.** Attributes configure behavior, slots accept your content, and CSS Shadow Parts expose intentional styling hooks.

## Quick start

Install the package:

```bash
npm install @kayf/ui
```

Import it once in your browser entry point to register every custom element:

```ts
import '@kayf/ui'
```

Use the components as regular HTML:

```html
<kayf-spotlight-card color="violet" glow="medium">
  <h2>Built for the browser</h2>
  <p>Framework-agnostic, typed, and easy to compose.</p>

  <kayf-prism-button color="violet">
    Create workspace
  </kayf-prism-button>
</kayf-spotlight-card>
```

For a script-tag setup, use the versioned UMD build:

```html
<script src="https://unpkg.com/@kayf/ui@0.6.0/dist/kayf-ui.umd.js"></script>
```

> **SSR:** The package registers browser custom elements during import. In SSR frameworks, import `@kayf/ui` from a client-only entry or component.

## New action system

Version 0.6 introduces three buttons with deliberately different jobs:

| Component | Use it for | Character |
| --- | --- | --- |
| [`<kayf-prism-button>`][prism-docs] | The primary decision on a screen | High-emphasis refraction that follows the pointer |
| [`<kayf-orbit-button>`][orbit-docs] | Navigation, launch, and forward actions | Directional layout with an orbital status mark |
| [`<kayf-hold-button>`][hold-docs] | Destructive or consequential confirmation | Hold progress with release-to-cancel behavior |

```html
<kayf-prism-button color="violet" size="lg">
  <span slot="icon-left" aria-hidden="true">✦</span>
  Create release
</kayf-prism-button>

<kayf-orbit-button color="cyan" variant="ghost">
  Open preview
</kayf-orbit-button>

<kayf-hold-button color="red" duration="1200" success-label="Build deleted">
  Delete build
</kayf-hold-button>
```

### Shared button API

| Attribute | Values | Default | Notes |
| --- | --- | --- | --- |
| `color` | `cyan`, `violet`, `emerald`, `amber`, `red`, `white` | Component-specific | Accent, focus ring, and interaction color |
| `size` | `sm`, `md`, `lg` | `md` | Uses 36px, 44px, and 52px control heights |
| `disabled` | Boolean attribute | `false` | Prevents activation and preserves native disabled semantics |
| `full-width` | Boolean attribute | `false` | Expands the host and internal control to available width |

`PrismButton` additionally supports `variant="solid|outline"`, `loading`, `icon-left`, and `icon-right` slots. `OrbitButton` supports `variant="solid|ghost"`, `loading`, and an `icon-right` slot.

`HoldButton` adds:

| Attribute | Default | Notes |
| --- | --- | --- |
| `duration` | `1200` | Required hold time in milliseconds, clamped between 500 and 5000 |
| `success-label` | `Confirmed` | Temporary confirmation text announced after completion |

Pointer, touch, <kbd>Space</kbd>, and <kbd>Enter</kbd> are supported. Releasing early or moving the pointer outside the control cancels the action.

### Events

`PrismButton`, `OrbitButton`, and `BeamButton` emit `kayf-click`. `HoldButton` emits `kayf-confirm` only after the full hold duration.

```ts
const createButton = document.querySelector('kayf-prism-button')
const deleteButton = document.querySelector('kayf-hold-button')

createButton?.addEventListener('kayf-click', event => {
  console.log('Action activated', event)
})

deleteButton?.addEventListener('kayf-confirm', event => {
  const { duration } = (event as CustomEvent<{ duration: number }>).detail
  console.log(`Confirmed after ${duration}ms`)
})
```

All public component events bubble and cross the Shadow DOM boundary with `composed: true`.

## Component catalog

### Actions

| Element | Purpose |
| --- | --- |
| [`<kayf-prism-button>`][prism-docs] | Primary CTA with localized pointer refraction |
| [`<kayf-orbit-button>`][orbit-docs] | Directional action with an orbital status mark |
| [`<kayf-hold-button>`][hold-docs] | Hold-to-confirm control for consequential actions |
| [`<kayf-beam-button>`][beam-docs] | General-purpose solid, outline, or ghost action |
| [`<kayf-magnetic-btn>`][magnetic-docs] | Proximity-based motion wrapper for slotted content |

### Surfaces

| Element | Purpose |
| --- | --- |
| [`<kayf-spotlight-card>`][spotlight-docs] | Glass card with a pointer-following highlight |
| [`<kayf-aurora-card>`][aurora-docs] | Ambient animated aurora surface |
| [`<kayf-holographic-card>`][holographic-docs] | Restrained 3D card with an iridescent foil layer |
| [`<kayf-noise-card>`][noise-docs] | Glass surface with lightweight procedural grain |
| [`<kayf-3d-tilt-card>`][tilt-docs] | Stable perspective wrapper for slotted content |
| [`<kayf-neon-border>`][neon-docs] | Configurable animated conic-gradient edge |

### Motion and data

| Element | Purpose |
| --- | --- |
| [`<kayf-particle-field>`][particle-docs] | Interactive canvas particle environment |
| [`<kayf-ripple-grid>`][ripple-docs] | Dot matrix with pointer-generated ripple waves |
| [`<kayf-counter>`][counter-docs] | Viewport-triggered animated metric |
| [`<kayf-typewriter>`][typewriter-docs] | Multi-line text sequencing |
| [`<kayf-command-palette>`][command-docs] | Keyboard-first command navigation |

Every component has an interactive Storybook page with controls, documented attributes, source examples, states, and realistic compositions.

## Command palette

```html
<kayf-command-palette
  id="commands"
  placeholder="Search commands, components, docs…"
></kayf-command-palette>
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

The default shortcut is <kbd>⌘ K</kbd> on macOS and <kbd>Ctrl K</kbd> elsewhere. Listen for `kayf-select`, `kayf-open`, and `kayf-close` to connect it to your application.

## Styling

Components ship with their own dark defaults. Override shared tokens on an individual component or a parent scope:

```css
.product-shell {
  --kayf-font-sans: "Geist", system-ui, sans-serif;
  --kayf-radius-md: 20px;
  --kayf-surface: rgba(18, 18, 24, 0.78);
  --kayf-text: #fafafa;
}
```

Use Shadow Parts for targeted visual adjustments without depending on internal class names:

```css
kayf-prism-button::part(button) {
  letter-spacing: 0;
}

kayf-holographic-card::part(card) {
  border-radius: 28px;
}
```

Primary parts include `button`, `surface`, `label`, `card`, `content`, `border`, `progress`, `meter`, `foil`, and `shine`. Check the component's Storybook Docs page for its exact API.

## Accessibility and motion

- Action components use internal native `<button>` elements with visible focus and disabled states.
- Hold confirmation works with pointer, touch, <kbd>Space</kbd>, and <kbd>Enter</kbd>.
- Loading and confirmation feedback is exposed through live regions where appropriate.
- Motion-heavy components respond to `prefers-reduced-motion`.
- Decorative canvas and effect layers are hidden from the accessibility tree.

## TypeScript

Public classes, shared types, and the package version are exported from the package root:

```ts
import {
  version,
  type CommandItem,
  type HoldButton,
  type PrismButton,
  type SpotlightCard,
} from '@kayf/ui'

const primary = document.querySelector<PrismButton>('kayf-prism-button')
console.log(version, primary)
```

> TypeScript JSX projects may need to declare the custom tags in their framework's intrinsic element map. The components themselves remain standard DOM custom elements.

## Development

```bash
npm install
npm run storybook
```

Quality checks:

```bash
npm run type-check
npm run build
npm run build-storybook
```

Storybook 10 requires Node.js 20.19 or newer for local development. The published components run in modern browsers and do not install runtime dependencies.

## What changed in 0.6

- Added `PrismButton`, `OrbitButton`, and `HoldButton` as a focused action family.
- Rebuilt `Welcome → Introduction` around the complete 16-component catalog.
- Added working Autodocs, API controls, descriptions, and examples for every component.
- Refined the public exports, package metadata, GitHub hero, and npm documentation.

## Migration notes

`LiquidButton`, `HudPanel`, and `GlitchText` were removed in 0.5 because they no longer fit the direction of the library. Remove imports and usages of:

- `LiquidButton` / `<kayf-liquid-button>`
- `HudPanel` / `<kayf-hud-panel>`
- `GlitchText` / `<kayf-glitch-text>`

For new primary actions, use [`<kayf-prism-button>`][prism-docs]. Use [`<kayf-hold-button>`][hold-docs] when accidental activation would be costly.

## License

MIT © [KAYF](https://github.com/vKAYFv)

[prism-docs]: https://main--69a564b0b16ce689ef423df8.chromatic.com/?path=/docs/components-prismbutton--docs
[orbit-docs]: https://main--69a564b0b16ce689ef423df8.chromatic.com/?path=/docs/components-orbitbutton--docs
[hold-docs]: https://main--69a564b0b16ce689ef423df8.chromatic.com/?path=/docs/components-holdbutton--docs
[beam-docs]: https://main--69a564b0b16ce689ef423df8.chromatic.com/?path=/docs/components-beambutton--docs
[magnetic-docs]: https://main--69a564b0b16ce689ef423df8.chromatic.com/?path=/docs/components-magneticbutton--docs
[spotlight-docs]: https://main--69a564b0b16ce689ef423df8.chromatic.com/?path=/docs/components-spotlightcard--docs
[aurora-docs]: https://main--69a564b0b16ce689ef423df8.chromatic.com/?path=/docs/components-auroracard--docs
[holographic-docs]: https://main--69a564b0b16ce689ef423df8.chromatic.com/?path=/docs/components-holographiccard--docs
[noise-docs]: https://main--69a564b0b16ce689ef423df8.chromatic.com/?path=/docs/components-noisecard--docs
[tilt-docs]: https://main--69a564b0b16ce689ef423df8.chromatic.com/?path=/docs/components-tiltcard3d--docs
[neon-docs]: https://main--69a564b0b16ce689ef423df8.chromatic.com/?path=/docs/components-neonborder--docs
[particle-docs]: https://main--69a564b0b16ce689ef423df8.chromatic.com/?path=/docs/components-particlefield--docs
[ripple-docs]: https://main--69a564b0b16ce689ef423df8.chromatic.com/?path=/docs/components-ripplegrid--docs
[counter-docs]: https://main--69a564b0b16ce689ef423df8.chromatic.com/?path=/docs/components-counter--docs
[typewriter-docs]: https://main--69a564b0b16ce689ef423df8.chromatic.com/?path=/docs/components-typewritertext--docs
[command-docs]: https://main--69a564b0b16ce689ef423df8.chromatic.com/?path=/docs/components-commandpalette--docs
