<div align="center">

![hero](https://raw.githubusercontent.com/kayf-dev/kayf-ui/main/.github/assets/hero.png)

<br/>

[![npm version](https://img.shields.io/npm/v/%40kayf%2Fui?style=flat-square&color=6366f1&labelColor=0a0a0f&label=version)](https://www.npmjs.com/package/@kayf/ui)
[![npm downloads](https://img.shields.io/npm/dw/%40kayf%2Fui?style=flat-square&color=06b6d4&labelColor=0a0a0f&label=downloads%2Fweek)](https://www.npmjs.com/package/@kayf/ui)
[![license](https://img.shields.io/npm/l/%40kayf%2Fui?style=flat-square&color=f472b6&labelColor=0a0a0f)](./LICENSE)
[![bundle size](https://img.shields.io/bundlephobia/minzip/%40kayf%2Fui?style=flat-square&color=10b981&labelColor=0a0a0f&label=gzip)](https://bundlephobia.com/package/@kayf/ui)
[![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178c6?style=flat-square&labelColor=0a0a0f)](https://www.typescriptlang.org/)
[![Storybook](https://img.shields.io/badge/Storybook-live-FF4785?style=flat-square&logo=storybook&logoColor=white&labelColor=0a0a0f)](https://69a564b0b16ce689ef423df8-pbjbpnksoj.chromatic.com/)

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

### `<kayf-spotlight-card>`

![spotlight-card](https://raw.githubusercontent.com/kayf-dev/kayf-ui/main/.github/assets/spotlight-card.png)

> A card that casts a radial spotlight following your cursor — revealing depth through light.

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

![beam-button](https://raw.githubusercontent.com/kayf-dev/kayf-ui/main/.github/assets/beam-button.png)

> A button with an animated light beam sweep on hover, plus ripple on click.

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

![aurora-card](https://raw.githubusercontent.com/kayf-dev/kayf-ui/main/.github/assets/aurora-card.png)

> Canvas-animated aurora blobs drifting behind a glassmorphism surface.

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

![glitch-text](https://raw.githubusercontent.com/kayf-dev/kayf-ui/main/.github/assets/glitch-text.png)

> Text that randomly glitches with RGB channel splitting — perfect for terminal UIs and game HUDs.

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

![hud-panel](https://raw.githubusercontent.com/kayf-dev/kayf-ui/main/.github/assets/hud-panel.png)

> A scanline-overlay panel with animated HUD corner accents — straight out of a sci-fi cockpit.

```html
<kayf-hud-panel label="SYSTEM STATUS" color="cyan">
  <div>Your dashboard content here</div>
</kayf-hud-panel>
```

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `label` | `string` | — | Panel header label |
| `color` | `ColorVariant` | `indigo` | Corner accent color |
| `scanlines` | `boolean` | `true` | Toggle scanline overlay |

---

### `<kayf-particle-field>` ✦ *v0.2.0*

![particle-field](https://raw.githubusercontent.com/kayf-dev/kayf-ui/main/.github/assets/particle-field.png)

> An interactive canvas particle system — particles connect with lines and repel from the cursor.

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

![counter](https://raw.githubusercontent.com/kayf-dev/kayf-ui/main/.github/assets/counter.png)

> Animated number counter that triggers on scroll into view with easeOutExpo easing.

```html
<kayf-counter
  value="98742"
  suffix="+"
  label="Active Users"
  color="#6366f1"
  icon="◎"
  duration="2000"
></kayf-counter>
```

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `value` | `number` | `0` | Target number to count to |
| `label` | `string` | `Metric` | Label below the number |
| `suffix` | `string` | — | Appended text (e.g. `+`, `ms`, `%`) |
| `prefix` | `string` | — | Prepended text (e.g. `$`) |
| `decimals` | `number` | `0` | Decimal places |
| `color` | `string` | `#6366f1` | Accent color (hex) |
| `icon` | `string` | `◎` | Icon character above value |
| `duration` | `number` | `2000` | Animation duration (ms) |

---

### `<kayf-magnetic-btn>` ✦ *v0.2.0*

![magnetic-btn](https://raw.githubusercontent.com/kayf-dev/kayf-ui/main/.github/assets/magnetic-btn.png)

> A wrapper that makes any element magnetically attracted to the cursor. Physics-based lerp animation.

```html
<kayf-magnetic-btn strength="0.4">
  <button class="your-button">Get Started</button>
</kayf-magnetic-btn>
```

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `strength` | `number` | `0.4` | Pull strength 0–1 |
| `radius` | `number` | `1.5` | Effect radius (× element size) |

---

### `<kayf-holographic-card>` ✦ *v0.3.0*

![holographic-card](https://raw.githubusercontent.com/kayf-dev/kayf-ui/main/.github/assets/holographic-card.png)

> 3D perspective tilt card with rainbow holographic shine. Lerp-smoothed mouse tracking, conic-gradient rainbow that follows your cursor.

```html
<kayf-holographic-card tilt-max="15" shine-opacity="1" scale="1.03">
  <div style="padding: 40px;">Your content here</div>
</kayf-holographic-card>
```

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `tilt-max` | `number` | `15` | Max tilt angle in degrees |
| `shine-opacity` | `number` | `1` | Rainbow shine intensity 0–1 |
| `scale` | `number` | `1.03` | Scale on hover |

---

### `<kayf-neon-border>` ✦ *v0.3.0*

![neon-border](https://raw.githubusercontent.com/kayf-dev/kayf-ui/main/.github/assets/neon-border.png)

> Animated rotating neon border using CSS `@property` + `conic-gradient`. Wraps any content. A glowing dot travels continuously around the perimeter.

```html
<kayf-neon-border color="#6366f1" speed="3" thickness="2" glow="10" radius="12">
  <div style="padding: 24px 40px;">Your content here</div>
</kayf-neon-border>
```

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `color` | `string` | `#6366f1` | Neon color (hex) |
| `speed` | `number` | `3` | Rotation speed in seconds |
| `thickness` | `number` | `2` | Border thickness (px) |
| `glow` | `number` | `10` | Glow blur radius (px) |
| `radius` | `number` | `12` | Border radius (px) |

---

### `<kayf-typewriter>` ✦ *v0.3.0*

![typewriter](https://raw.githubusercontent.com/kayf-dev/kayf-ui/main/.github/assets/typewriter.png)

> Typewriter effect with organic character jitter, multi-line cycling, erase animation, and a blinking cursor.

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
| `lines` | `string` | — | Pipe-separated `\|` phrases to cycle |
| `speed` | `number` | `60` | Typing speed (ms per char) |
| `erase-speed` | `number` | `30` | Erase speed (ms per char) |
| `pause` | `number` | `1800` | Pause after complete (ms) |
| `delay` | `number` | `500` | Initial delay before start (ms) |
| `loop` | `boolean` | `false` | Loop through lines continuously |

---

### `<kayf-command-palette>` ✦ *v0.3.0*

![command-palette](https://raw.githubusercontent.com/kayf-dev/kayf-ui/main/.github/assets/command-palette.png)

> Full-screen `⌘K` command palette with fuzzy search, grouped items, keyboard navigation, and shortcut display.

```html
<kayf-command-palette
  placeholder="Search commands..."
  hotkey="k"
></kayf-command-palette>

<script>
  const palette = document.querySelector('kayf-command-palette')

  palette.setItems([
    { id: 'home',  group: 'Navigation', icon: '⌂', label: 'Go to Home',   shortcut: '⌘+1' },
    { id: 'docs',  group: 'Navigation', icon: '◇', label: 'Documentation', shortcut: '⌘+D' },
    { id: 'theme', group: 'Actions',    icon: '◕', label: 'Toggle Theme',
      action: () => document.body.classList.toggle('dark') },
  ])

  palette.addEventListener('kayf-select', (e) => {
    console.log('Selected:', e.detail)
  })
</script>
```

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `placeholder` | `string` | `Search commands...` | Input placeholder |
| `hotkey` | `string` | `k` | Key for `⌘/Ctrl +` shortcut |

| Method | Description |
|--------|-------------|
| `setItems(items[])` | Set the command list |
| `open()` | Open programmatically |
| `close()` | Close programmatically |
| `toggle()` | Toggle open/close |

| Event | Detail | Description |
|-------|--------|-------------|
| `kayf-select` | `CommandItem` | Fired when item is selected |
| `kayf-open` | — | Fired on open |
| `kayf-close` | — | Fired on close |

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

Or pass any hex value directly: `color="#ff6b35"`

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

// Typed element access
const palette = document.querySelector<HTMLElement & {
  setItems: (items: CommandItem[]) => void
  open: () => void
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
// global.d.ts — add JSX types for all components
declare namespace JSX {
  interface IntrinsicElements {
    'kayf-spotlight-card':   React.HTMLAttributes<HTMLElement> & { color?: string; radius?: number }
    'kayf-beam-button':      React.HTMLAttributes<HTMLElement> & { color?: string; size?: string }
    'kayf-aurora-card':      React.HTMLAttributes<HTMLElement> & { speed?: number; blur?: number }
    'kayf-glitch-text':      React.HTMLAttributes<HTMLElement> & { intensity?: number; interval?: number }
    'kayf-hud-panel':        React.HTMLAttributes<HTMLElement> & { label?: string; color?: string }
    'kayf-particle-field':   React.HTMLAttributes<HTMLElement> & { color?: string; count?: number }
    'kayf-counter':          React.HTMLAttributes<HTMLElement> & { value?: number; label?: string; suffix?: string }
    'kayf-magnetic-btn':     React.HTMLAttributes<HTMLElement> & { strength?: number; radius?: number }
    'kayf-holographic-card': React.HTMLAttributes<HTMLElement> & { 'tilt-max'?: number; 'shine-opacity'?: number }
    'kayf-neon-border':      React.HTMLAttributes<HTMLElement> & { color?: string; speed?: number }
    'kayf-typewriter':       React.HTMLAttributes<HTMLElement> & { lines?: string; speed?: number; loop?: boolean }
    'kayf-command-palette':  React.HTMLAttributes<HTMLElement> & { placeholder?: string; hotkey?: string }
  }
}
```

```tsx
import '@kayf/ui'

export default function Hero() {
  return (
    <kayf-magnetic-btn strength={0.4}>
      <button className="btn-primary">Launch App</button>
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
    template: {
      compilerOptions: { isCustomElement: tag => tag.startsWith('kayf-') }
    }
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

<kayf-command-palette placeholder="Search..."></kayf-command-palette>
<kayf-neon-border color="#06b6d4" speed="2">
  <button>Get Started</button>
</kayf-neon-border>
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
| `kayf-3d-tilt-card` | 🔜 v0.4.0 |
| `kayf-liquid-button` | 🔜 v0.4.0 |
| `kayf-noise-card` | 🔜 v0.4.0 |
| `kayf-ripple-grid` | 🔜 v0.4.0 |

---

## 📄 License

MIT © [@kayf](https://www.npmjs.com/~kayf)

---

<div align="center">

*Built in the dark. Shipped with precision.*

</div>