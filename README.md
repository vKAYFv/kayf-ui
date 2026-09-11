![A dark @kayf/ui banner showing version 0.8.0 and 24 framework-agnostic Web Components](https://raw.githubusercontent.com/vKAYFv/kayf-ui/refs/heads/main/.github/assets/hero.svg)

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
- **Designed as a system.** Shared color, surface, radius, typography, and motion decisions keep all 24 components visually coherent.
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
<script src="https://unpkg.com/@kayf/ui@0.8.0/dist/kayf-ui.umd.js"></script>
```

> **SSR:** The package registers browser custom elements during import. In SSR frameworks, import `@kayf/ui` from a client-only entry or component.

## New in 0.8: workflow components

Five purposeful additions bring the catalog to **24 components**:

| Component | What it handles |
| --- | --- |
| [`<kayf-verification-code>`][verification-docs] | Segmented numeric entry, paste, SMS autofill, native form validation and reset |
| [`<kayf-file-dropzone>`][dropzone-docs] | Drag/drop and file selection with type, size, count and duplicate feedback |
| [`<kayf-stepper>`][stepper-docs] | Responsive progress, completed milestones and application-controlled navigation |
| [`<kayf-segmented-control>`][segmented-docs] | Native radio choices with descriptions, badges, keyboard navigation and form support |
| [`<kayf-toast-stack>`][toast-docs] | Notifications with optional actions, accessible announcements and pausable timers |

```html
<form>
  <kayf-verification-code name="code" length="6" required></kayf-verification-code>
  <button type="submit">Verify</button>
</form>

<kayf-file-dropzone
  multiple accept="image/*,.pdf" max-files="5" max-size="10485760"
></kayf-file-dropzone>

<kayf-stepper id="setup" value="assets" allow-navigation></kayf-stepper>
```

```ts
import type { Stepper, FileDropzone } from '@kayf/ui'

const setup = document.querySelector<Stepper>('#setup')!
setup.steps = [
  { id: 'details', title: 'The essentials', description: 'Name your project' },
  { id: 'assets', title: 'Make it yours', description: 'Bring your files' },
  { id: 'review', title: 'One last look', description: 'Review and confirm' },
]
setup.addEventListener('kayf-step-change', event => {
  // Validate any unsaved work before applying a navigation request.
  setup.value = (event as CustomEvent).detail.value
})

const dropzone = document.querySelector<FileDropzone>('kayf-file-dropzone')!
dropzone.addEventListener('kayf-change', () => {
  const body = new FormData()
  dropzone.files.forEach(file => body.append('files', file))
  // Send body to your upload service when the user confirms.
})
```

`VerificationCode` emits `kayf-input`, `kayf-change` and `kayf-complete` with `{ value, complete }`. `length` is clamped to 4–8 digits. `value` sets the default/reset code; typing updates the property without reflecting it into HTML. An `error` makes the field invalid. Completion describes a filled code; your service verifies it.

`FileDropzone` emits `kayf-reject` with `{ rejections: [{ file, reason, message }] }`. Reasons are `type`, `size`, `count` and `duplicate`. Defaults: 10 MB per file and five files in multiple mode. A valid single-file selection replaces the previous file; rejected replacements preserve it. Constraint changes apply to future selections. `clear()` removes the selection. Files remain local; validate them again on your upload server.

`Stepper` accepts unique `{ id, title, description? }` entries through its `steps` property. Earlier steps are marked complete. `complete` finishes the whole flow; `orientation="vertical"` provides a vertical layout, also used automatically on narrow screens. With `allow-navigation`, completed steps emit `kayf-step-change` containing `{ value, previousValue, index }`; the application owns the active `value` and validation.

### Choices and feedback

```html
<kayf-segmented-control id="billing" name="billing" value="yearly" required></kayf-segmented-control>
<kayf-toast-stack id="notifications"></kayf-toast-stack>
```

```ts
import type { SegmentedControl, ToastStack } from '@kayf/ui'

const billing = document.querySelector<SegmentedControl>('#billing')!
billing.options = [
  { value: 'monthly', label: 'Monthly', description: 'Billed every month' },
  { value: 'yearly', label: 'Yearly', description: 'One payment a year', badge: 'Save 20%' },
]
billing.addEventListener('kayf-change', event => {
  const { value, previousValue } = (event as CustomEvent).detail
  // Update your checkout summary.
})

const notices = document.querySelector<ToastStack>('#notifications')!
notices.show({ title: 'Changes saved', tone: 'success' })
notices.show({ id: 'archive', title: 'Project archived', actionLabel: 'Undo archive' })
notices.addEventListener('kayf-toast-action', event => {
  const { id } = (event as CustomEvent).detail
  // Restore the archived item for this id.
  // event.preventDefault() keeps the notice open while an async action runs.
})
```

`SegmentedControl` accepts unique `{ value, label, description?, badge?, disabled? }` options. Native arrow keys skip disabled choices, and Tab enters the group once. `name` participates in parent FormData; `required`, disabled fieldsets, reset and state restoration are supported. The `value` attribute is the reset default; the property and user edits update the current selection. A missing or disabled selection yields `''`. Use `orientation="vertical"` for larger choices; narrow screens stack automatically.

`ToastStack.show()` returns an id. Reusing an id updates that notice and restarts its timer. Tones are `info`, `success`, `warning` and `error`. `duration` is milliseconds: default 6000, 0 for persistent notices, maximum 600000. Notices with `actionLabel` default to persistent. Timers pause on hover, keyboard focus, hidden pages and disconnection. Five notices fit in a stack; the oldest is dismissed on overflow. Use `dismiss(id)`, `clear()` and the read-only `count` property. `kayf-toast-dismiss` emits `{ id, reason }`, where reason is `manual`, `timeout`, `action`, `overflow` or `clear`. Notifications are fixed at the bottom end by default; `position="top-end"` moves them up and `inline` keeps them in the document layout. Removing the element pauses its timers; call `clear()` to discard its notices.

## Product inputs and flows

Version 0.7 adds three functional components for familiar product tasks:

| Component | What it handles |
| --- | --- |
| [`<kayf-phone-input>`][phone-docs] | Country selection, calling-code detection, live formatting, native telephone autofill, and E.164 output |
| [`<kayf-language-switcher>`][language-docs] | Animated locale selection, compact mode, custom languages, and complete keyboard navigation |
| [`<kayf-auth-form>`][auth-docs] | Sign-in and registration UI, browser autofill, inline validation, password strength, error and loading states |

```html
<kayf-phone-input
  country="DE"
  label="Phone number"
  hint="Used only for delivery updates"
  required
></kayf-phone-input>

<kayf-language-switcher
  value="en"
  label="Interface language"
></kayf-language-switcher>

<kayf-auth-form mode="signup" color="violet"></kayf-auth-form>
```

`PhoneInput` includes all 245 countries and territories with assigned geographical calling codes. It automatically detects regions from pasted international values when the calling code or regional prefix is unique. For example, entering `+380 67 123 45 67` selects Ukraine and exposes `+380671234567` as E.164.

```ts
const phone = document.querySelector('kayf-phone-input')

phone?.addEventListener('kayf-change', event => {
  const { e164, country, valid } = (event as CustomEvent).detail
  console.log({ e164, country, valid })
})
```

Supply custom language choices through the `languages` property:

```ts
import type { LanguageSwitcher } from '@kayf/ui'

const switcher = document.querySelector<LanguageSwitcher>('kayf-language-switcher')!
switcher.languages = [
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'uk', label: 'Ukrainian', nativeLabel: 'Українська', flag: '🇺🇦' },
]
```

`AuthForm` deliberately owns only presentation and client-side validation. Connect `kayf-submit` to your authentication service:

```ts
document.querySelector('kayf-auth-form')?.addEventListener('kayf-submit', event => {
  const payload = (event as CustomEvent).detail
  // Send payload to your own auth service.
  console.log(payload.mode, payload.email)
})
```

Passwords are included in the submit event but are never stored, logged, or sent by the component.

## Action system

Three buttons cover deliberately different jobs:

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

`PrismButton` outline masks its refraction gradient to the edge, keeping the translucent center and label clear. `PrismButton` additionally supports `variant="solid|outline"`, `loading`, `icon-left`, and `icon-right` slots. `OrbitButton` supports `variant="solid|ghost"`, `loading`, and an `icon-right` slot.

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

### Workflows

| Element | Purpose |
| --- | --- |
| [`<kayf-verification-code>`][verification-docs] | Accessible verification entry with native form participation |
| [`<kayf-file-dropzone>`][dropzone-docs] | Validated local file intake with removable selections |
| [`<kayf-stepper>`][stepper-docs] | Responsive workflow milestones and controlled navigation |
| [`<kayf-segmented-control>`][segmented-docs] | Context-rich choices with native radio semantics |
| [`<kayf-toast-stack>`][toast-docs] | Actionable feedback with accessible, pausable notifications |

### Inputs and flows

| Element | Purpose |
| --- | --- |
| [`<kayf-phone-input>`][phone-docs] | International phone field with calling-code detection and E.164 output |
| [`<kayf-language-switcher>`][language-docs] | Animated keyboard-accessible locale picker |
| [`<kayf-auth-form>`][auth-docs] | Sign-in and registration flow with validation and autofill |

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
  type AuthSubmitDetail,
  type HoldButton,
  type LanguageSwitcher,
  type PhoneInput,
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
npm run type-check:stories
npx playwright install chromium
npm test
```

Browser checks cover the built library and Storybook examples. To use an installed Google Chrome instead, run `PLAYWRIGHT_CHANNEL=chrome npm test`.

Storybook 10 requires Node.js 20.19 or newer for local development. The published components run in modern browsers and do not install runtime dependencies.

## Publishing to npm

From the repository root, after running the quality checks above:

```bash
npm login --registry=https://registry.npmjs.org
npm whoami --registry=https://registry.npmjs.org
npm publish --dry-run --access public --registry=https://registry.npmjs.org
npm publish --access public --registry=https://registry.npmjs.org
```

`prepublishOnly` rebuilds the library before publishing. Review the dry-run file list first. npm opens browser authentication when required. The package is already prepared as `0.8.0`; each published version must be unique. For a later release, update `package.json`, `package-lock.json` and the exported `version` in `src/index.ts` together before publishing. Publishing npm does not deploy Storybook; that is handled separately by the Chromatic workflow.

## What changed in 0.8

- Added VerificationCode, FileDropzone, Stepper, SegmentedControl and ToastStack with typed APIs, parts and interactive Storybook examples.
- Fixed PrismButton outline: refraction stays on the border, preserving center transparency and text contrast. Added all-color, size, loading, disabled and background examples.
- AuthForm preserves entries across loading/error updates, associates inline errors with fields, and applies signup password rules only during registration. Changing modes preserves email and clears passwords.
- PhoneInput preserves the caret during formatting, deletes across formatting spaces, and clamps E.164 output to 15 digits.
- LanguageSwitcher has named compact controls, bounded scrolling, ArrowUp entry, reliable Tab dismissal, and defensive custom options.
- Updated the Storybook introduction to 24 components; added workflow states, guided demos and browser regression checks. Storybook packages remain on the current stable 10.6.0.

### Previously in 0.7

- Expanded `PhoneInput` to all 245 countries and territories, with calling-code detection, regional formatting, and E.164 events.
- Added `LanguageSwitcher` with custom language data, compact mode, and keyboard navigation.
- Added `AuthForm` with sign-in/sign-up modes, native autofill, validation, strength feedback, and polished field interaction states.
- Expanded `Welcome → Introduction`, Storybook Autodocs, the GitHub hero, and npm documentation to the complete 19-component catalog.

### Previously in 0.6

- Added `PrismButton`, `OrbitButton`, and `HoldButton` as a focused action family.
- Rebuilt the Storybook introduction and component documentation.

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
[phone-docs]: https://main--69a564b0b16ce689ef423df8.chromatic.com/?path=/docs/components-phoneinput--docs
[language-docs]: https://main--69a564b0b16ce689ef423df8.chromatic.com/?path=/docs/components-languageswitcher--docs
[auth-docs]: https://main--69a564b0b16ce689ef423df8.chromatic.com/?path=/docs/components-authform--docs
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

[verification-docs]: https://main--69a564b0b16ce689ef423df8.chromatic.com/?path=/docs/components-verificationcode--docs
[dropzone-docs]: https://main--69a564b0b16ce689ef423df8.chromatic.com/?path=/docs/components-filedropzone--docs
[stepper-docs]: https://main--69a564b0b16ce689ef423df8.chromatic.com/?path=/docs/components-stepper--docs

[segmented-docs]: https://main--69a564b0b16ce689ef423df8.chromatic.com/?path=/docs/components-segmentedcontrol--docs
[toast-docs]: https://main--69a564b0b16ce689ef423df8.chromatic.com/?path=/docs/components-toaststack--docs
