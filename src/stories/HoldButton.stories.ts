import type { Meta, StoryObj } from '@storybook/web-components-vite'
import { html } from 'lit'
import '../components/HoldButton/HoldButton'

const stageStyles = html`
  <style>
    .hold-stage, .hold-stage * { box-sizing: border-box; }
    .hold-stage {
      display: grid;
      width: min(760px, 100%);
      min-height: 420px;
      padding: clamp(32px, 8vw, 76px);
      place-items: center;
      border: 1px solid rgba(255,255,255,.07);
      border-radius: 26px;
      background:
        radial-gradient(circle at 50% 92%, rgba(255,115,131,.07), transparent 36%),
        linear-gradient(145deg, #0c0b0f, #07070a 70%);
      font-family: Inter, ui-sans-serif, system-ui, sans-serif;
    }
    .hold-demo { display: grid; justify-items: center; gap: 18px; }
    .hold-feedback { min-height: 18px; margin: 0; color: rgba(228,228,231,.46); font-size: 11px; letter-spacing: .08em; text-transform: uppercase; }
    .hold-stack { display: flex; flex-wrap: wrap; align-items: center; justify-content: center; gap: 14px; }
    .danger-panel {
      width: min(430px, 100%);
      padding: 28px;
      border: 1px solid rgba(255,115,131,.16);
      border-radius: 20px;
      background: linear-gradient(145deg, rgba(27,20,24,.94), rgba(12,10,13,.98));
    }
    .danger-panel__label { margin: 0 0 24px; color: #ff8c99; font-size: 10px; font-weight: 700; letter-spacing: .15em; text-transform: uppercase; }
    .danger-panel h3 { margin: 0 0 9px; color: #f4f4f7; font-size: 24px; letter-spacing: -.04em; }
    .danger-panel p { margin: 0 0 26px; color: rgba(228,228,231,.48); font-size: 13px; line-height: 1.6; }
  </style>
`

const announceConfirmation = (event: Event): void => {
  const output = (event.currentTarget as HTMLElement).nextElementSibling
  if (output) output.textContent = 'Confirmation received'
}

const meta: Meta = {
  title: 'Components/HoldButton',
  component: 'kayf-hold-button',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: '`<kayf-hold-button>` reduces accidental activation for consequential actions. Hold with pointer, touch, Space, or Enter until progress completes; leaving the control or releasing early cancels safely. Emits `kayf-confirm` with the configured duration.',
      },
    },
  },
  argTypes: {
    color: { control: 'select', options: ['red', 'amber', 'violet', 'cyan', 'emerald'], description: 'Progress and focus accent', table: { defaultValue: { summary: 'red' } } },
    size: { control: 'select', options: ['sm', 'md', 'lg'], description: 'Control size', table: { defaultValue: { summary: 'md' } } },
    duration: { control: { type: 'range', min: 500, max: 3000, step: 100 }, description: 'Required hold time in milliseconds', table: { defaultValue: { summary: '1200' } } },
    disabled: { control: 'boolean', description: 'Disable confirmation', table: { defaultValue: { summary: 'false' } } },
    'success-label': { control: 'text', description: 'Temporary success message', table: { defaultValue: { summary: 'Confirmed' } } },
    'full-width': { control: 'boolean', description: 'Fill the available width', table: { defaultValue: { summary: 'false' } } },
  },
}

export default meta
type Story = StoryObj

export const Default: Story = {
  args: { color: 'red', size: 'md', duration: 1200, disabled: false, 'success-label': 'Confirmed', 'full-width': false },
  render: (args) => html`
    ${stageStyles}
    <section class="hold-stage">
      <div class="hold-demo">
        <kayf-hold-button
          color=${args.color}
          size=${args.size}
          duration=${args.duration}
          success-label=${args['success-label']}
          ?disabled=${args.disabled}
          ?full-width=${args['full-width']}
          @kayf-confirm=${announceConfirmation}
        >Confirm action</kayf-hold-button>
        <p class="hold-feedback" aria-live="polite">Release early to cancel</p>
      </div>
    </section>
  `,
}

export const IntentColors: Story = {
  parameters: { docs: { description: { story: 'Use red for destructive actions, amber for risky changes, and brand accents for deliberate non-destructive confirmation.' } } },
  render: () => html`
    ${stageStyles}
    <section class="hold-stage">
      <div class="hold-stack">
        <kayf-hold-button color="red" duration="900">Delete release</kayf-hold-button>
        <kayf-hold-button color="amber" duration="900">Reset settings</kayf-hold-button>
        <kayf-hold-button color="violet" duration="900">Publish version</kayf-hold-button>
      </div>
    </section>
  `,
}

export const Sizes: Story = {
  render: () => html`
    ${stageStyles}
    <section class="hold-stage">
      <div class="hold-stack">
        <kayf-hold-button size="sm" duration="800">Small hold</kayf-hold-button>
        <kayf-hold-button size="md" duration="800">Medium hold</kayf-hold-button>
        <kayf-hold-button size="lg" duration="800">Large hold</kayf-hold-button>
      </div>
    </section>
  `,
}

export const DestructiveAction: Story = {
  render: () => html`
    ${stageStyles}
    <section class="hold-stage">
      <article class="danger-panel">
        <p class="danger-panel__label">Danger zone</p>
        <h3>Delete visual baseline?</h3>
        <p>This removes the accepted snapshots for the current release. The hold gesture protects against an accidental click.</p>
        <kayf-hold-button color="red" duration="1400" success-label="Baseline deleted" full-width>Delete baseline</kayf-hold-button>
      </article>
    </section>
  `,
}
