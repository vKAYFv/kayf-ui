<div align="center">

![hero](https://raw.githubusercontent.com/vKAYFv/kayf-ui/main/.github/assets/hero.png)

<br/>

[![npm version](https://img.shields.io/npm/v/%40kayf%2Fui?style=flat-square&color=6366f1&labelColor=0a0a0f&label=version)](https://www.npmjs.com/package/@kayf/ui)
[![npm downloads](https://img.shields.io/npm/dw/%40kayf%2Fui?style=flat-square&color=06b6d4&labelColor=0a0a0f&label=downloads%2Fweek)](https://www.npmjs.com/package/@kayf/ui)
[![license](https://img.shields.io/npm/l/%40kayf%2Fui?style=flat-square&color=f472b6&labelColor=0a0a0f)](./LICENSE)
[![bundle size](https://img.shields.io/bundlephobia/minzip/%40kayf%2Fui?style=flat-square&color=10b981&labelColor=0a0a0f&label=gzip)](https://bundlephobia.com/package/@kayf/ui)
[![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178c6?style=flat-square&labelColor=0a0a0f)](https://www.typescriptlang.org/)
[![Storybook](https://img.shields.io/badge/Storybook-live-FF4785?style=flat-square&logo=storybook&logoColor=white&labelColor=0a0a0f)](https://69a564b0b16ce689ef423df8-cxjiutvipa.chromatic.com/)

**[→ Live Storybook](https://69a564b0b16ce689ef423df8-cxjiutvipa.chromatic.com/)** · Interactive demos for all 12 components

</div>

---

## ✦ What is @kayf/ui?

`@kayf/ui` is a collection of **native Web Components** built around a dark, premium aesthetic — think game dashboards, dev tools, and next-gen SaaS interfaces. Every component ships with:

- **Zero framework dependencies** — works with React, Vue, Svelte, or vanilla HTML
- **Shadow DOM isolation** — no style leakage, ever
- **Glassmorphism 2.0** — dark surfaces, blur, glow, noise textures
- **TypeScript-first** — strict types, full IntelliSense support
- **Reactive attributes** — update via `setAttribute()` or HTML attributes

---

## ⚡ Quick Start

```bash
npm install @kayf/ui
```

```html
<!-- Option 1: Script tag (UMD) -->
<script src="node_modules/@kayf/ui/dist/kayf-ui.umd.js"></script>

<!-- Option 2: CDN -->
<script type="module" src="https://unpkg.com/@kayf/ui/dist/kayf-ui.esm.js"></script>
```

```ts
// Option 3: ES Module import
import '@kayf/ui'
```

---

## 🧩 Components

> **See all components live → [Storybook](https://69a564b0b16ce689ef423df8-pbjbpnksoj.chromatic.com/)**

### `<kayf-spotlight-card>`

A card with a radial spotlight that follows your cursor, revealing depth through light.

```html
<kayf-spotlight-card color="indigo" radius="300">
  <h3>Your content here</h3>
</kayf-spotlight-card>
```

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `color` | `ColorVariant` | `indigo` | Spotlight tint |
| `radius` | `number` | `250` | Spotlight radius in px |

---

### `<kayf-beam-button>`

A button with an animated light beam sweep on hover, plus ripple on click.

```html
<kayf-beam-button color="cyan" size="md">Launch Mission</kayf-beam-button>
```

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `color` | `ColorVariant` | `indigo` | Beam color |
| `size` | `sm \| md \| lg` | `md` | Button size |
| `disabled` | `boolean` | `false` | Disables the button |

---

### `<kayf-aurora-card>`

Canvas-animated aurora blobs drifting behind a glassmorphism surface.

```html
<kayf-aurora-card speed="0.5" blur="60" opacity="0.6">
  <p>Your content floats above the aurora.</p>
</kayf-aurora-card>
```

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `speed` | `number` | `0.5` | Animation speed multiplier |
| `blur` | `number` | `60` | Blob blur radius (px) |
| `opacity` | `number` | `0.6` | Blob opacity 0–1 |

---

### `<kayf-glitch-text>`

Text that randomly glitches with RGB channel splitting — perfect for terminals and game HUDs.

```html
<kayf-glitch-text intensity="0.5" interval="3000">SYSTEM ONLINE</kayf-glitch-text>
```

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `intensity` | `number` | `0.5` | Glitch strength 0–1 |
| `interval` | `number` | `3000` | Time between glitches (ms) |
| `color` | `ColorVariant` | `cyan` | Accent color |

---

### `<kayf-hud-panel>`

A sci-fi HUD panel with animated corner accents and scanline overlay.

```html
<kayf-hud-panel label="SYSTEM STATUS" color="cyan">
  <div>Your dashboard content</div>
</kayf-hud-panel>
```

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `label` | `string` | — | Panel header label |
| `color` | `ColorVariant` | `indigo` | Corner accent color |
| `scanlines` | `boolean` | `true` | Toggle scanline overlay |

---

### `<kayf-particle-field>` ✦ *v0.2.0*

Interactive canvas particle system — particles connect with lines and repel from the cursor.

```html
<kayf-particle-field
  color="#6366f1"
  count="120"
  speed="0.4"
  connect-distance="100"
></kayf-particle-field>
```

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `color` | `string` | `#6366f1` | Particle color (hex) |
| `count` | `number` | `100` | Number of particles |
| `speed` | `number` | `0.4` | Base movement speed |
| `connect-distance` | `number` | `100` | Max line distance (px) |

---

### `<kayf-counter>` ✦ *v0.2.0*

Animated number counter triggered on scroll into view with easeOutExpo easing.

```html
<kayf-counter value="98742" suffix="+" label="Active Users" color="#6366f1" duration="2000"></kayf-counter>
```

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `value` | `number` | `0` | Target number |
| `label` | `string` | `Metric` | Label below the number |
| `suffix` | `string` | — | Appended text (`+`, `ms`, `%`) |
| `prefix` | `string` | — | Prepended text (`$`) |
| `decimals` | `number` | `0` | Decimal places |
| `color` | `string` | `#6366f1` | Accent color (hex) |
| `icon` | `string` | `◎` | Icon above value |
| `duration` | `number` | `2000` | Animation duration (ms) |

---

### `<kayf-magnetic-btn>` ✦ *v0.2.0*

Wraps any element with a magnetic cursor attraction effect. Physics-based lerp spring.

```html
<kayf-magnetic-btn strength="0.4">
  <button>Get Started</button>
</kayf-magnetic-btn>
```

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `strength` | `number` | `0.4` | Pull strength 0–1 |
| `radius` | `number` | `1.5` | Effect radius (× element size) |

---

### `<kayf-holographic-card>` ✦ *v0.3.0*

3D perspective tilt card with rainbow holographic shine. Lerp-smoothed mouse tracking.

```html
<kayf-holographic-card tilt-max="15" shine-opacity="1" scale="1.03">
  <div style="padding: 40px;">Your content</div>
</kayf-holographic-card>
```

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `tilt-max` | `number` | `15` | Max tilt angle in degrees |
| `shine-opacity` | `number` | `1` | Rainbow shine intensity 0–1 |
| `scale` | `number` | `1.03` | Scale on hover |

---

### `<kayf-neon-border>` ✦ *v0.3.0*

Animated rotating neon border using CSS `@property` + `conic-gradient`. Wraps any content.

```html
<kayf-neon-border color="#6366f1" speed="3" thickness="2" glow="10" radius="12">
  <div style="padding: 24px 40px;">Your content</div>
</kayf-neon-border>
```

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `color` | `string` | `#6366f1` | Neon color (hex) |
| `speed` | `number` | `3` | Rotation speed (seconds) |
| `thickness` | `number` | `2` | Border thickness (px) |
| `glow` | `number` | `10` | Glow blur radius (px) |
| `radius` | `number` | `12` | Border radius (px) |

---

### `<kayf-typewriter>` ✦ *v0.3.0*

Typewriter effect with organic character jitter, multi-line cycling, and erase animation.

```html
<kayf-typewriter
  lines="Premium UI|Zero Dependencies|TypeScript First"
  speed="60"
  erase-speed="30"
  pause="1800"
  loop
></kayf-typewriter>
```

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `lines` | `string` | — | Pipe-separated `\|` phrases |
| `speed` | `number` | `60` | Typing speed (ms/char) |
| `erase-speed` | `number` | `30` | Erase speed (ms/char) |
| `pause` | `number` | `1800` | Pause after complete (ms) |
| `delay` | `number` | `500` | Initial delay (ms) |
| `loop` | `boolean` | `false` | Loop continuously |

---

### `<kayf-command-palette>` ✦ *v0.3.0*

Full-screen `⌘K` command palette with fuzzy search, grouped items, and keyboard navigation.

```html
<kayf-command-palette placeholder="Search commands..." hotkey="k"></kayf-command-palette>

<script>
  document.querySelector('kayf-command-palette').setItems([
    { id: 'home', group: 'Navigation', icon: '⌂', label: 'Go to Home', shortcut: '⌘+1' },
    { id: 'docs', group: 'Navigation', icon: '◇', label: 'Documentation' },
    { id: 'theme', group: 'Actions',   icon: '◕', label: 'Toggle Theme',
      action: () => document.body.classList.toggle('dark') },
  ])
</script>
```

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `placeholder` | `string` | `Search commands...` | Input placeholder |
| `hotkey` | `string` | `k` | `⌘/Ctrl +` key |

| Method | Description |
|--------|-------------|
| `setItems(items[])` | Set the command list |
| `open()` / `close()` / `toggle()` | Control visibility |

| Event | Detail | Description |
|-------|--------|-------------|
| `kayf-select` | `CommandItem` | Item selected |
| `kayf-open` / `kayf-close` | — | Open/close fired |

---

## 🎨 Color Variants

```ts
type ColorVariant =
  | 'indigo'   // #6366f1 — default
  | 'cyan'     // #06b6d4
  | 'pink'     // #f472b6
  | 'emerald'  // #10b981
  | 'amber'    // #f59e0b
  | 'red'      // #ef4444
```

Or pass any hex value: `color="#ff6b35"`

---

## 📦 Bundle Info

| Format | File | Size |
|--------|------|------|
| ESM | `dist/kayf-ui.esm.js` | ~22kb gzip |
| CJS | `dist/kayf-ui.cjs.js` | ~23kb gzip |
| UMD | `dist/kayf-ui.umd.js` | ~24kb gzip |
| Types | `dist/index.d.ts` | included |

---

## 🛠 TypeScript Usage

```ts
import '@kayf/ui'
import type { ColorVariant, CommandItem } from '@kayf/ui'

const palette = document.querySelector<HTMLElement & {
  setItems: (items: CommandItem[]) => void
}>('kayf-command-palette')

palette?.setItems([
  { id: '1', label: 'Launch', icon: '◈', action: () => console.log('launched') }
])
```

---

## 🧱 Framework Integration

<details>
<summary><strong>React</strong></summary>

```tsx
// global.d.ts
declare namespace JSX {
  interface IntrinsicElements {
    'kayf-spotlight-card':   React.HTMLAttributes<HTMLElement> & { color?: string; radius?: number }
    'kayf-beam-button':      React.HTMLAttributes<HTMLElement> & { color?: string; size?: string; disabled?: boolean }
    'kayf-aurora-card':      React.HTMLAttributes<HTMLElement> & { speed?: number; blur?: number; opacity?: number }
    'kayf-glitch-text':      React.HTMLAttributes<HTMLElement> & { intensity?: number; interval?: number; color?: string }
    'kayf-hud-panel':        React.HTMLAttributes<HTMLElement> & { label?: string; color?: string; scanlines?: boolean }
    'kayf-particle-field':   React.HTMLAttributes<HTMLElement> & { color?: string; count?: number; speed?: number }
    'kayf-counter':          React.HTMLAttributes<HTMLElement> & { value?: number; label?: string; suffix?: string; color?: string }
    'kayf-magnetic-btn':     React.HTMLAttributes<HTMLElement> & { strength?: number; radius?: number }
    'kayf-holographic-card': React.HTMLAttributes<HTMLElement> & { 'tilt-max'?: number; 'shine-opacity'?: number; scale?: number }
    'kayf-neon-border':      React.HTMLAttributes<HTMLElement> & { color?: string; speed?: number; thickness?: number; glow?: number }
    'kayf-typewriter':       React.HTMLAttributes<HTMLElement> & { lines?: string; speed?: number; loop?: boolean; pause?: number }
    'kayf-command-palette':  React.HTMLAttributes<HTMLElement> & { placeholder?: string; hotkey?: string }
  }
}
```

```tsx
import '@kayf/ui'

export default function Hero() {
  return (
    <kayf-magnetic-btn strength={0.4}>
      <button className="btn">Launch App</button>
    </kayf-magnetic-btn>
  )
}
```

</details>

<details>
<summary><strong>Vue 3</strong></summary>

```ts
// vite.config.ts
export default defineConfig({
  plugins: [vue({
    template: { compilerOptions: { isCustomElement: tag => tag.startsWith('kayf-') } }
  })]
})
```

```vue
<script setup>
import '@kayf/ui'
</script>
<template>
  <kayf-holographic-card tilt-max="20">
    <div class="card-content">Your content</div>
  </kayf-holographic-card>
</template>
```

</details>

<details>
<summary><strong>Vanilla HTML</strong></summary>

```html
<script type="module" src="https://unpkg.com/@kayf/ui/dist/kayf-ui.esm.js"></script>

<kayf-neon-border color="#06b6d4" speed="2">
  <button>Get Started</button>
</kayf-neon-border>

<kayf-command-palette placeholder="Search..."></kayf-command-palette>
```

</details>

---

## 🗺 Roadmap

| Component | Status |
|-----------|--------|
| `kayf-spotlight-card` | ✅ v0.1.0 |
| `kayf-beam-button` | ✅ v0.1.0 |
| `kayf-aurora-card` | ✅ v0.1.0 |
| `kayf-glitch-text` | ✅ v0.1.0 |
| `kayf-hud-panel` | ✅ v0.1.0 |
| `kayf-particle-field` | ✅ v0.2.0 |
| `kayf-counter` | ✅ v0.2.0 |
| `kayf-magnetic-btn` | ✅ v0.2.0 |
| `kayf-holographic-card` | ✅ v0.3.0 |
| `kayf-neon-border` | ✅ v0.3.0 |
| `kayf-typewriter` | ✅ v0.3.0 |
| `kayf-command-palette` | ✅ v0.3.0 |
| `kayf-liquid-button` | 🔜 v0.4.0 |
| `kayf-noise-card` | 🔜 v0.4.0 |
| `kayf-ripple-grid` | 🔜 v0.4.0 |
| `kayf-3d-tilt-card` | 🔜 v0.4.0 |

---

## 📄 License

MIT © [@kayf](https://www.npmjs.com/~kayf)

---

<div align="center">

*Built in the dark. Shipped with precision.*

</div>