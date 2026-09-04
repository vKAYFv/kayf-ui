import type { Meta, StoryObj } from '@storybook/web-components-vite'
import { html } from 'lit'
import '../components/HolographicCard/HolographicCard'

const demoStyles = html`
  <style>
    .holo-stage,
    .holo-stage *,
    .holo-stage *::before,
    .holo-stage *::after { box-sizing: border-box; }

    .holo-stage {
      position: relative;
      display: grid;
      width: min(100%, 820px);
      min-height: 540px;
      padding: clamp(32px, 8vw, 84px);
      place-items: center;
      overflow: hidden;
      border: 1px solid rgba(255,255,255,0.07);
      border-radius: 28px;
      background:
        radial-gradient(circle at 82% 12%, rgba(139,124,255,0.11), transparent 34%),
        radial-gradient(circle at 12% 90%, rgba(98,218,247,0.075), transparent 30%),
        linear-gradient(145deg, #0b0b11, #060609 72%);
      font-family: Inter, ui-sans-serif, system-ui, sans-serif;
    }

    .holo-stage::after {
      content: '';
      position: absolute;
      width: 380px;
      height: 380px;
      border: 1px solid rgba(255,255,255,0.035);
      border-radius: 50%;
      box-shadow: 0 0 0 74px rgba(255,255,255,0.012), 0 0 0 148px rgba(255,255,255,0.008);
      pointer-events: none;
    }

    .holo-pass {
      position: relative;
      width: min(380px, calc(100vw - 100px));
      min-height: 236px;
      padding: 26px 28px 24px;
      border-radius: 22px;
      color: #f4f4f7;
    }

    .pass-top,
    .pass-bottom,
    .pass-status {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .pass-mark {
      display: grid;
      width: 34px;
      height: 34px;
      place-items: center;
      border: 1px solid rgba(255,255,255,0.15);
      border-radius: 10px;
      color: rgba(255,255,255,0.84);
      background: rgba(255,255,255,0.035);
      font: 700 11px/1 ui-monospace, monospace;
      letter-spacing: -0.04em;
    }

    .pass-edition {
      color: rgba(228,228,231,0.46);
      font: 600 9px/1 ui-monospace, monospace;
      letter-spacing: 0.16em;
      text-transform: uppercase;
    }

    .holo-pass h2 {
      margin: 42px 0 7px;
      color: #fff;
      font-size: clamp(30px, 6vw, 40px);
      font-weight: 650;
      line-height: 0.95;
      letter-spacing: -0.055em;
    }

    .pass-copy {
      margin: 0;
      color: rgba(228,228,231,0.48);
      font-size: 12px;
      letter-spacing: 0.01em;
    }

    .pass-bottom {
      gap: 24px;
      margin-top: 34px;
      padding-top: 18px;
      border-top: 1px solid rgba(255,255,255,0.08);
    }

    .pass-id { color: rgba(228,228,231,0.34); font: 10px/1 ui-monospace, monospace; letter-spacing: 0.12em; }
    .pass-status { gap: 7px; color: rgba(228,228,231,0.66); font-size: 10px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.1em; }
    .pass-status::before { content: ''; width: 6px; height: 6px; border-radius: 50%; background: #51dfa4; box-shadow: 0 0 10px rgba(81,223,164,0.55); }

    .collector-card {
      width: min(300px, calc(100vw - 100px));
      padding: 18px;
      border-radius: 22px;
      color: #f4f4f7;
    }

    .collector-art {
      position: relative;
      display: grid;
      height: 210px;
      place-items: center;
      overflow: hidden;
      border: 1px solid rgba(255,255,255,0.08);
      border-radius: 15px;
      background:
        radial-gradient(circle at 50% 48%, rgba(139,124,255,0.26), transparent 24%),
        radial-gradient(circle at 50% 110%, rgba(98,218,247,0.16), transparent 44%),
        #09090e;
    }

    .collector-art::before,
    .collector-art::after {
      content: '';
      position: absolute;
      border-radius: 50%;
    }

    .collector-art::before {
      width: 104px;
      height: 104px;
      background: radial-gradient(circle at 34% 28%, #f7f5ff 0 3%, #b8abff 9%, #7968df 34%, #241b4b 72%);
      box-shadow: 0 0 50px rgba(139,124,255,0.28);
    }

    .collector-art::after {
      width: 174px;
      height: 46px;
      border: 1px solid rgba(197,187,255,0.48);
      transform: rotate(-15deg);
      box-shadow: inset 0 0 20px rgba(98,218,247,0.1);
    }

    .collector-meta {
      display: flex;
      align-items: flex-end;
      justify-content: space-between;
      gap: 20px;
      padding: 20px 4px 3px;
    }

    .collector-label { margin-bottom: 7px; color: #8b7cff; font-size: 9px; font-weight: 700; letter-spacing: 0.15em; text-transform: uppercase; }
    .collector-card h3 { margin: 0; color: #f4f4f7; font-size: 19px; letter-spacing: -0.035em; }
    .collector-number { color: rgba(228,228,231,0.4); font: 10px/1 ui-monospace, monospace; }

    .subtle-card {
      width: min(360px, calc(100vw - 100px));
      padding: 28px;
      border-radius: 22px;
      color: #f4f4f7;
    }

    .subtle-label { color: #62daf7; font-size: 10px; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase; }
    .subtle-card h3 { margin: 28px 0 8px; font-size: 24px; letter-spacing: -0.04em; }
    .subtle-card p { max-width: 280px; margin: 0; color: rgba(228,228,231,0.48); font-size: 13px; line-height: 1.6; }

    @media (max-width: 600px) {
      .holo-stage { min-height: 470px; padding: 42px 28px; }
      .holo-pass { padding: 23px; }
      .holo-pass h2 { margin-top: 36px; }
    }
  </style>
`

const meta: Meta = {
  title: 'Components/HolographicCard',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'A polished iridescent card with a readable resting state, localized pointer light, stable perspective, keyboard focus feedback, touch-safe behavior, and reduced-motion support.',
      },
    },
  },
  argTypes: {
    'tilt-max': { control: { type: 'range', min: 0, max: 20, step: 1 }, description: 'Maximum tilt in degrees', defaultValue: 10 },
    'shine-opacity': { control: { type: 'range', min: 0, max: 1, step: 0.05 }, description: 'Peak foil intensity', defaultValue: 0.78 },
    scale: { control: { type: 'range', min: 1, max: 1.08, step: 0.005 }, description: 'Pointer-hover scale', defaultValue: 1.025 },
  },
}

export default meta
type Story = StoryObj

export const Default: Story = {
  args: { 'tilt-max': 10, 'shine-opacity': 0.78, scale: 1.025 },
  render: (args) => html`
    ${demoStyles}
    <section class="holo-stage">
      <kayf-holographic-card
        tilt-max=${args['tilt-max']}
        shine-opacity=${args['shine-opacity']}
        scale=${args.scale}
      >
        <article class="holo-pass">
          <header class="pass-top"><span class="pass-mark">K/</span><span class="pass-edition">Founding edition</span></header>
          <h2>Prism<br />Protocol</h2>
          <p class="pass-copy">A digital access object for the next interface layer.</p>
          <footer class="pass-bottom"><span class="pass-id">ID · 0051—KAYF</span><span class="pass-status">Active</span></footer>
        </article>
      </kayf-holographic-card>
    </section>
  `,
}

export const Collector: Story = {
  parameters: {
    docs: { description: { story: 'A richer foil treatment for collectible art while the content stays sharp and legible.' } },
  },
  args: { 'tilt-max': 12, 'shine-opacity': 0.9, scale: 1.03 },
  render: (args) => html`
    ${demoStyles}
    <section class="holo-stage">
      <kayf-holographic-card tilt-max=${args['tilt-max']} shine-opacity=${args['shine-opacity']} scale=${args.scale}>
        <article class="collector-card">
          <div class="collector-art" aria-hidden="true"></div>
          <div class="collector-meta">
            <div><div class="collector-label">Celestial archive</div><h3>Violet Orbit</h3></div>
            <span class="collector-number">07 / 24</span>
          </div>
        </article>
      </kayf-holographic-card>
    </section>
  `,
}

export const Subtle: Story = {
  parameters: {
    docs: { description: { story: 'Lower foil intensity and movement for product cards, settings, and content-first layouts.' } },
  },
  args: { 'tilt-max': 5, 'shine-opacity': 0.38, scale: 1.01 },
  render: (args) => html`
    ${demoStyles}
    <section class="holo-stage">
      <kayf-holographic-card tilt-max=${args['tilt-max']} shine-opacity=${args['shine-opacity']} scale=${args.scale}>
        <article class="subtle-card">
          <span class="subtle-label">New material</span>
          <h3>Soft-spectrum foil</h3>
          <p>Just enough iridescence to separate the surface, without pulling attention away from the message.</p>
        </article>
      </kayf-holographic-card>
    </section>
  `,
}
