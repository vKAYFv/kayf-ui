import type { Meta, StoryObj } from '@storybook/web-components-vite'
import { html } from 'lit'
import '../components/OrbitButton/OrbitButton'

const stageStyles = html`
  <style>
    .orbit-stage, .orbit-stage * { box-sizing: border-box; }
    .orbit-stage {
      display: grid;
      width: min(760px, 100%);
      min-height: 420px;
      padding: clamp(32px, 8vw, 76px);
      place-items: center;
      overflow: hidden;
      border: 1px solid rgba(255,255,255,0.07);
      border-radius: 26px;
      background:
        radial-gradient(circle at 50% 110%, rgba(98,218,247,0.09), transparent 42%),
        linear-gradient(155deg, #0c0d11, #07070a 72%);
      font-family: Inter, ui-sans-serif, system-ui, sans-serif;
    }
    .orbit-stage::before {
      content: '';
      width: 320px;
      height: 320px;
      position: absolute;
      border: 1px solid rgba(255,255,255,.025);
      border-radius: 50%;
      box-shadow: 0 0 0 64px rgba(255,255,255,.01);
      pointer-events: none;
    }
    .orbit-stack { position: relative; display: flex; flex-wrap: wrap; align-items: center; justify-content: center; gap: 14px; }
    .launch-card {
      position: relative;
      width: min(430px, 100%);
      padding: 30px;
      border: 1px solid rgba(255,255,255,.08);
      border-radius: 20px;
      background: linear-gradient(145deg, rgba(20,21,27,.96), rgba(10,10,14,.98));
    }
    .launch-card__meta { display: flex; justify-content: space-between; color: rgba(228,228,231,.38); font: 9px/1 ui-monospace, monospace; letter-spacing: .13em; text-transform: uppercase; }
    .launch-card h3 { margin: 42px 0 8px; color: #f4f4f7; font-size: 28px; line-height: 1; letter-spacing: -.045em; }
    .launch-card p { max-width: 310px; margin: 0 0 28px; color: rgba(228,228,231,.48); font-size: 13px; line-height: 1.6; }
  </style>
`

const meta: Meta = {
  title: 'Components/OrbitButton',
  component: 'kayf-orbit-button',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: '`<kayf-orbit-button>` communicates forward movement through a compact status orbit and a separated direction control. It is suited to navigation, launch, and continuation actions. Uses a native button internally and emits `kayf-click`.',
      },
    },
  },
  argTypes: {
    color: { control: 'select', options: ['violet', 'cyan', 'emerald', 'amber', 'red'], description: 'Orbit and direction accent', table: { defaultValue: { summary: 'cyan' } } },
    variant: { control: 'select', options: ['solid', 'ghost'], description: 'Surface emphasis', table: { defaultValue: { summary: 'solid' } } },
    size: { control: 'select', options: ['sm', 'md', 'lg'], description: 'Control size', table: { defaultValue: { summary: 'md' } } },
    disabled: { control: 'boolean', description: 'Disable activation', table: { defaultValue: { summary: 'false' } } },
    loading: { control: 'boolean', description: 'Animate the orbit and disable activation', table: { defaultValue: { summary: 'false' } } },
    'full-width': { control: 'boolean', description: 'Fill the available width', table: { defaultValue: { summary: 'false' } } },
  },
}

export default meta
type Story = StoryObj

export const Default: Story = {
  args: { color: 'cyan', variant: 'solid', size: 'md', disabled: false, loading: false, 'full-width': false },
  render: (args) => html`
    ${stageStyles}
    <section class="orbit-stage">
      <kayf-orbit-button
        color=${args.color}
        variant=${args.variant}
        size=${args.size}
        ?disabled=${args.disabled}
        ?loading=${args.loading}
        ?full-width=${args['full-width']}
      >Continue to preview</kayf-orbit-button>
    </section>
  `,
}

export const Colors: Story = {
  render: () => html`
    ${stageStyles}
    <section class="orbit-stage">
      <div class="orbit-stack">
        <kayf-orbit-button color="cyan">Open canvas</kayf-orbit-button>
        <kayf-orbit-button color="violet">View system</kayf-orbit-button>
        <kayf-orbit-button color="emerald">Deploy build</kayf-orbit-button>
      </div>
    </section>
  `,
}

export const SizesAndStates: Story = {
  render: () => html`
    ${stageStyles}
    <section class="orbit-stage">
      <div class="orbit-stack">
        <kayf-orbit-button size="sm" variant="ghost">Small</kayf-orbit-button>
        <kayf-orbit-button size="md">Medium</kayf-orbit-button>
        <kayf-orbit-button size="lg" loading>Connecting</kayf-orbit-button>
        <kayf-orbit-button size="md" disabled>Unavailable</kayf-orbit-button>
      </div>
    </section>
  `,
}

export const LaunchPanel: Story = {
  parameters: { docs: { description: { story: 'Directional hierarchy inside a focused launch surface.' } } },
  render: () => html`
    ${stageStyles}
    <section class="orbit-stage">
      <article class="launch-card">
        <div class="launch-card__meta"><span>Build 018</span><span>Ready</span></div>
        <h3>Visual baseline complete.</h3>
        <p>Review the captured stories, then continue to the release workspace.</p>
        <kayf-orbit-button color="cyan" size="lg">Open Chromatic</kayf-orbit-button>
      </article>
    </section>
  `,
}
