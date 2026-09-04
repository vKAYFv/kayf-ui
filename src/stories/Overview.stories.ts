import type { Meta, StoryObj } from '@storybook/web-components-vite'
import { html } from 'lit'

const meta: Meta = {
  title: 'Overview/Welcome',
  parameters: {
    layout: 'fullscreen',
    controls: { disable: true },
    a11y: { disable: false },
  },
}

export default meta
type Story = StoryObj

const components = [
  ['Spotlight Card', 'Pointer-aware glass surface'],
  ['Beam Button', 'Polished action with three variants'],
  ['Aurora Card', 'Fluid ambient canvas background'],
  ['Particle Field', 'Interactive particle environment'],
  ['Counter', 'Viewport-triggered metric card'],
  ['Magnetic Button', 'Cursor-responsive wrapper'],
  ['Holographic Card', 'Iridescent 3D surface'],
  ['Neon Border', 'Configurable animated frame'],
  ['Typewriter', 'Multi-line text animation'],
  ['Command Palette', 'Keyboard-first command menu'],
  ['Noise Card', 'Tactile grain surface'],
  ['Ripple Grid', 'Interactive dot matrix'],
  ['3D Tilt Card', 'Perspective interaction wrapper'],
]

export const Introduction: Story = {
  render: () => html`
    <style>
      .overview {
        min-height: 100vh;
        padding: clamp(32px, 7vw, 96px);
        color: #f4f4f7;
        background:
          radial-gradient(circle at 12% 8%, rgba(98,218,247,.1), transparent 32rem),
          radial-gradient(circle at 88% 0%, rgba(139,124,255,.13), transparent 34rem),
          #07070a;
        font-family: Inter, ui-sans-serif, system-ui, sans-serif;
      }
      .overview__inner { width: min(1080px, 100%); margin: 0 auto; }
      .eyebrow {
        margin: 0 0 22px;
        color: #9e94ff;
        font: 650 12px/1.2 "SFMono-Regular", Consolas, monospace;
        letter-spacing: .12em;
        text-transform: uppercase;
      }
      h1 {
        max-width: 820px;
        margin: 0;
        font-size: clamp(48px, 8vw, 88px);
        font-weight: 680;
        line-height: .96;
        letter-spacing: -.06em;
      }
      .gradient {
        color: transparent;
        background: linear-gradient(110deg, #f4f4f7 10%, #62daf7 46%, #9e94ff 82%);
        background-clip: text;
        -webkit-background-clip: text;
      }
      .lead {
        max-width: 620px;
        margin: 28px 0 0;
        color: rgba(228,228,231,.64);
        font-size: clamp(17px, 2.4vw, 21px);
        line-height: 1.55;
        letter-spacing: -.015em;
      }
      .actions { display: flex; flex-wrap: wrap; gap: 12px; margin-top: 34px; }
      .install {
        display: inline-flex;
        min-height: 42px;
        padding: 0 16px;
        align-items: center;
        border: 1px solid rgba(255,255,255,.1);
        border-radius: 12px;
        color: rgba(244,244,247,.72);
        background: rgba(255,255,255,.035);
        font: 500 13px/1 "SFMono-Regular", Consolas, monospace;
      }
      .showcase { display: grid; grid-template-columns: 1.15fr .85fr; gap: 18px; margin-top: 72px; }
      .surface { min-height: 220px; }
      .surface__content { padding: clamp(24px, 4vw, 38px); }
      .surface__label { margin: 0 0 10px; color: rgba(228,228,231,.46); font-size: 12px; }
      .surface__title { margin: 0 0 10px; font-size: 26px; font-weight: 640; letter-spacing: -.035em; }
      .surface__copy { margin: 0; color: rgba(228,228,231,.58); line-height: 1.6; }
      .catalog {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 10px;
        margin-top: 64px;
      }
      .component {
        min-height: 114px;
        padding: 18px;
        border: 1px solid rgba(255,255,255,.075);
        border-radius: 14px;
        background: rgba(255,255,255,.025);
      }
      .component strong { display: block; margin-bottom: 7px; font-size: 14px; font-weight: 600; }
      .component span { color: rgba(228,228,231,.46); font-size: 12px; line-height: 1.45; }
      @media (max-width: 760px) {
        .showcase { grid-template-columns: 1fr; }
        .catalog { grid-template-columns: repeat(2, minmax(0, 1fr)); }
      }
      @media (max-width: 480px) { .catalog { grid-template-columns: 1fr; } }
    </style>

    <main class="overview">
      <div class="overview__inner">
        <p class="eyebrow">@kayf/ui · v0.5</p>
        <h1>Expressive components, <span class="gradient">without framework lock-in.</span></h1>
        <p class="lead">Thirteen native Web Components for modern dark interfaces. Typed, dependency-free at runtime, and designed to compose with any frontend stack.</p>
        <div class="actions">
          <kayf-beam-button variant="solid" color="violet" size="lg">Explore components</kayf-beam-button>
          <code class="install">npm install @kayf/ui</code>
        </div>

        <section class="showcase" aria-label="Featured components">
          <kayf-spotlight-card class="surface" color="cyan" glow="medium">
            <div class="surface__content">
              <p class="surface__label">Spotlight Card</p>
              <h2 class="surface__title">Depth that responds.</h2>
              <p class="surface__copy">Subtle pointer light, quiet borders, and a composable content slot.</p>
            </div>
          </kayf-spotlight-card>
          <kayf-noise-card class="surface" variant="glass" glow="violet">
            <div class="surface__content">
              <p class="surface__label">Noise Card</p>
              <h2 class="surface__title">Texture, not clutter.</h2>
              <p class="surface__copy">A lightweight grain layer gives glass surfaces a tactile finish.</p>
            </div>
          </kayf-noise-card>
        </section>

        <section class="catalog" aria-label="Component catalog">
          ${components.map(([name, description]) => html`
            <article class="component"><strong>${name}</strong><span>${description}</span></article>
          `)}
        </section>
      </div>
    </main>
  `,
}
