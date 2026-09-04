import type { Meta, StoryObj } from '@storybook/web-components-vite'
import { html } from 'lit'
import '../components/TiltCard3D/TiltCard3D'

const demoStyles = html`
  <style>
    .tilt-stage,
    .tilt-stage *,
    .tilt-stage *::before,
    .tilt-stage *::after,
    .tilt-grid,
    .tilt-grid *,
    .tilt-grid *::before,
    .tilt-grid *::after { box-sizing: border-box; }

    .tilt-stage {
      position: relative;
      display: grid;
      width: min(100%, 820px);
      min-height: 520px;
      padding: clamp(32px, 8vw, 84px);
      place-items: center;
      overflow: hidden;
      border: 1px solid rgba(255,255,255,0.07);
      border-radius: 28px;
      background:
        radial-gradient(circle at 18% 12%, rgba(98,218,247,0.08), transparent 32%),
        radial-gradient(circle at 86% 88%, rgba(139,124,255,0.1), transparent 34%),
        linear-gradient(145deg, #0b0b10, #07070a 68%);
      box-shadow: inset 0 1px 0 rgba(255,255,255,0.035);
      font-family: Inter, ui-sans-serif, system-ui, sans-serif;
    }

    .tilt-stage::before {
      content: '';
      position: absolute;
      inset: 0;
      pointer-events: none;
      opacity: 0.16;
      background-image: radial-gradient(rgba(255,255,255,0.2) 0.65px, transparent 0.65px);
      background-size: 18px 18px;
      mask-image: linear-gradient(to bottom, black, transparent 72%);
    }

    .depth-card {
      width: min(360px, calc(100vw - 104px));
      min-height: 248px;
      padding: 28px;
      border: 1px solid rgba(255,255,255,0.09);
      border-radius: 16px;
      color: #f4f4f7;
      background:
        radial-gradient(circle at 12% 0%, rgba(255,255,255,0.07), transparent 36%),
        linear-gradient(150deg, rgba(22,22,30,0.98), rgba(10,10,15,0.99));
      box-shadow: inset 0 1px 0 rgba(255,255,255,0.05);
    }

    .depth-topline,
    .depth-footer,
    .depth-stat {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .depth-kicker {
      color: #8b7cff;
      font-size: 10px;
      font-weight: 700;
      letter-spacing: 0.16em;
      text-transform: uppercase;
    }

    .depth-signal {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #51dfa4;
      box-shadow: 0 0 14px rgba(81,223,164,0.5);
    }

    .depth-card h2 {
      max-width: 290px;
      margin: 38px 0 10px;
      color: #f4f4f7;
      font-size: clamp(25px, 5vw, 32px);
      font-weight: 650;
      line-height: 1.04;
      letter-spacing: -0.045em;
    }

    .depth-card p {
      max-width: 295px;
      margin: 0;
      color: rgba(228,228,231,0.54);
      font-size: 13px;
      line-height: 1.65;
    }

    .depth-footer {
      gap: 20px;
      margin-top: 32px;
      padding-top: 18px;
      border-top: 1px solid rgba(255,255,255,0.07);
    }

    .depth-stat { gap: 8px; }
    .depth-stat strong { font-size: 12px; font-weight: 650; }
    .depth-stat span { color: rgba(228,228,231,0.38); font-size: 10px; text-transform: uppercase; letter-spacing: 0.1em; }

    .depth-action {
      color: #c5bbff;
      font-size: 12px;
      font-weight: 600;
      text-decoration: none;
    }

    .depth-action:focus-visible {
      border-radius: 4px;
      outline: 2px solid #8b7cff;
      outline-offset: 4px;
    }

    .tilt-grid {
      position: relative;
      z-index: 1;
      display: grid;
      width: min(100%, 880px);
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 18px;
      padding: 52px;
    }

    .mini-card {
      min-height: 190px;
      padding: 22px;
      border: 1px solid rgba(255,255,255,0.08);
      border-radius: 16px;
      background: linear-gradient(150deg, rgba(20,20,28,0.98), rgba(9,9,13,0.99));
      font-family: Inter, ui-sans-serif, system-ui, sans-serif;
    }

    .mini-index { color: rgba(228,228,231,0.32); font: 10px/1 ui-monospace, monospace; letter-spacing: 0.1em; }
    .mini-orb { width: 42px; height: 42px; margin: 28px 0 22px; border-radius: 50%; }
    .mini-card h3 { margin: 0 0 7px; color: #f4f4f7; font-size: 16px; letter-spacing: -0.025em; }
    .mini-card p { margin: 0; color: rgba(228,228,231,0.42); font-size: 12px; line-height: 1.55; }
    .orb-cyan { background: radial-gradient(circle at 32% 28%, #d9f9ff, #62daf7 22%, #122b49 68%); box-shadow: 0 0 28px rgba(98,218,247,0.2); }
    .orb-violet { background: radial-gradient(circle at 32% 28%, #f1edff, #8b7cff 22%, #291b50 68%); box-shadow: 0 0 28px rgba(139,124,255,0.22); }
    .orb-green { background: radial-gradient(circle at 32% 28%, #e3fff4, #51dfa4 22%, #13372a 68%); box-shadow: 0 0 28px rgba(81,223,164,0.18); }

    @media (max-width: 720px) {
      .tilt-stage { min-height: 460px; padding: 44px 28px; }
      .tilt-grid { grid-template-columns: 1fr; padding: 28px; }
      .tilt-grid kayf-3d-tilt-card { width: 100%; }
      .mini-card { min-height: 160px; }
      .mini-orb { margin: 24px 0 18px; }
    }
  </style>
`

const meta: Meta = {
  title: 'Components/TiltCard3D',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'A composable 3D surface with stable pointer tracking, restrained depth, keyboard focus feedback, touch-safe behavior, and reduced-motion support. Wrap any card content without changing its internal layout.',
      },
    },
  },
  argTypes: {
    'max-tilt': { control: { type: 'range', min: 0, max: 20, step: 1 }, description: 'Maximum tilt in degrees', defaultValue: 9 },
    scale: { control: { type: 'range', min: 1, max: 1.08, step: 0.005 }, description: 'Pointer-hover scale', defaultValue: 1.025 },
    perspective: { control: { type: 'range', min: 600, max: 2000, step: 100 }, description: 'Perspective depth in pixels', defaultValue: 1200 },
    glow: { control: 'color', description: 'Ambient glow and edge color', defaultValue: '#8b7cff' },
    'no-shine': { control: 'boolean', description: 'Disable the pointer-following highlight', defaultValue: false },
  },
}

export default meta
type Story = StoryObj

export const Default: Story = {
  args: { 'max-tilt': 9, scale: 1.025, perspective: 1200, glow: '#8b7cff', 'no-shine': false },
  render: (args) => html`
    ${demoStyles}
    <section class="tilt-stage">
      <kayf-3d-tilt-card
        max-tilt=${args['max-tilt']}
        scale=${args.scale}
        perspective=${args.perspective}
        glow=${args.glow}
        ?no-shine=${args['no-shine']}
      >
        <article class="depth-card">
          <div class="depth-topline">
            <span class="depth-kicker">Interaction layer</span>
            <span class="depth-signal" aria-label="Ready"></span>
          </div>
          <h2>Depth, without the distraction.</h2>
          <p>A quiet spatial response that keeps the content readable and the pointer in control.</p>
          <footer class="depth-footer">
            <div class="depth-stat"><strong>9°</strong><span>range</span></div>
            <a class="depth-action" href="#tilt-details">Explore spec →</a>
          </footer>
        </article>
      </kayf-3d-tilt-card>
    </section>
  `,
}

export const QuietSurface: Story = {
  parameters: {
    docs: { description: { story: 'A low-motion treatment for dashboards and content-heavy surfaces. The shine layer is disabled while elevation and focus feedback remain.' } },
  },
  args: { 'max-tilt': 4, scale: 1.01, perspective: 1600, glow: '#62daf7', 'no-shine': true },
  render: (args) => html`
    ${demoStyles}
    <section class="tilt-stage">
      <kayf-3d-tilt-card
        max-tilt=${args['max-tilt']}
        scale=${args.scale}
        perspective=${args.perspective}
        glow=${args.glow}
        ?no-shine=${args['no-shine']}
      >
        <article class="depth-card">
          <div class="depth-topline"><span class="depth-kicker" style="color:#62daf7">System health</span><span class="depth-signal"></span></div>
          <h2>All services operational.</h2>
          <p>Low-amplitude motion gives status cards hierarchy without competing with the data.</p>
          <footer class="depth-footer"><div class="depth-stat"><strong>99.99%</strong><span>uptime</span></div><span class="depth-action">Live</span></footer>
        </article>
      </kayf-3d-tilt-card>
    </section>
  `,
}

export const Collection: Story = {
  parameters: {
    layout: 'fullscreen',
    docs: { description: { story: 'The wrapper stays composable across repeated cards and responsive layouts.' } },
  },
  render: () => html`
    ${demoStyles}
    <div class="tilt-grid">
      <kayf-3d-tilt-card max-tilt="7" scale="1.02" glow="#62daf7">
        <article class="mini-card"><span class="mini-index">01 / ORBIT</span><div class="mini-orb orb-cyan"></div><h3>Signal</h3><p>Responsive movement with a cool ambient edge.</p></article>
      </kayf-3d-tilt-card>
      <kayf-3d-tilt-card max-tilt="7" scale="1.02" glow="#8b7cff">
        <article class="mini-card"><span class="mini-index">02 / ORBIT</span><div class="mini-orb orb-violet"></div><h3>Vector</h3><p>Consistent depth across every surface in the group.</p></article>
      </kayf-3d-tilt-card>
      <kayf-3d-tilt-card max-tilt="7" scale="1.02" glow="#51dfa4">
        <article class="mini-card"><span class="mini-index">03 / ORBIT</span><div class="mini-orb orb-green"></div><h3>Pulse</h3><p>Touch-safe behavior with motion preferences respected.</p></article>
      </kayf-3d-tilt-card>
    </div>
  `,
}
