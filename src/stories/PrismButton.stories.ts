import type { Meta, StoryObj } from '@storybook/web-components-vite'
import { html } from 'lit'
import '../components/PrismButton/PrismButton'

const stageStyles = html`
  <style>
    .button-stage, .button-stage * { box-sizing: border-box; }
    .button-stage {
      display: grid;
      width: min(760px, 100%);
      min-height: 420px;
      padding: clamp(32px, 8vw, 76px);
      place-items: center;
      border: 1px solid rgba(255,255,255,0.07);
      border-radius: 26px;
      background:
        radial-gradient(circle at 20% 10%, rgba(98,218,247,0.08), transparent 34%),
        radial-gradient(circle at 84% 82%, rgba(139,124,255,0.11), transparent 36%),
        linear-gradient(145deg, #0b0b11, #07070a);
      font-family: Inter, ui-sans-serif, system-ui, sans-serif;
    }
    .button-stack { display: flex; flex-wrap: wrap; align-items: center; justify-content: center; gap: 14px; }
    .button-panel {
      width: min(420px, 100%);
      padding: 28px;
      border: 1px solid rgba(255,255,255,0.08);
      border-radius: 20px;
      background: rgba(255,255,255,0.025);
      box-shadow: inset 0 1px 0 rgba(255,255,255,0.04);
    }
    .button-panel__kicker { margin: 0 0 26px; color: #9e94ff; font-size: 10px; font-weight: 700; letter-spacing: .15em; text-transform: uppercase; }
    .button-panel h3 { margin: 0 0 9px; color: #f4f4f7; font-size: 26px; line-height: 1.05; letter-spacing: -.04em; }
    .button-panel p { margin: 0 0 28px; color: rgba(228,228,231,.5); font-size: 13px; line-height: 1.6; }
    .button-panel__actions { display: flex; flex-wrap: wrap; gap: 10px; }
    .story-icon { display: block; width: 16px; height: 16px; }
  </style>
`

const meta: Meta = {
  title: 'Components/PrismButton',
  component: 'kayf-prism-button',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: '`<kayf-prism-button>` is the high-emphasis CTA in the action family. It uses a localized refraction edge without sacrificing contrast, native button semantics, or touch behavior. Supports icon slots and emits `kayf-click` after a valid activation.',
      },
    },
  },
  argTypes: {
    color: { control: 'select', options: ['violet', 'cyan', 'emerald', 'amber', 'red'], description: 'Refraction accent', table: { defaultValue: { summary: 'violet' } } },
    variant: { control: 'select', options: ['solid', 'outline'], description: 'Visual emphasis', table: { defaultValue: { summary: 'solid' } } },
    size: { control: 'select', options: ['sm', 'md', 'lg'], description: 'Control size', table: { defaultValue: { summary: 'md' } } },
    disabled: { control: 'boolean', description: 'Disable activation', table: { defaultValue: { summary: 'false' } } },
    loading: { control: 'boolean', description: 'Show progress and disable activation', table: { defaultValue: { summary: 'false' } } },
    'full-width': { control: 'boolean', description: 'Fill the available width', table: { defaultValue: { summary: 'false' } } },
  },
}

export default meta
type Story = StoryObj

export const Default: Story = {
  args: { color: 'violet', variant: 'solid', size: 'md', disabled: false, loading: false, 'full-width': false },
  render: (args) => html`
    ${stageStyles}
    <section class="button-stage">
      <kayf-prism-button
        color=${args.color}
        variant=${args.variant}
        size=${args.size}
        ?disabled=${args.disabled}
        ?loading=${args.loading}
        ?full-width=${args['full-width']}
      >
        <svg class="story-icon" slot="icon-left" viewBox="0 0 18 18" fill="none" aria-hidden="true">
          <path d="m9 2 1.7 4.3L15 8l-4.3 1.7L9 14l-1.7-4.3L3 8l4.3-1.7L9 2Z" stroke="currentColor" stroke-width="1.35" stroke-linejoin="round"/>
        </svg>
        Create workspace
      </kayf-prism-button>
    </section>
  `,
}

export const Variants: Story = {
  parameters: { docs: { description: { story: 'Solid is reserved for the primary decision. Outline keeps the optical character at lower emphasis.' } } },
  render: () => html`
    ${stageStyles}
    <section class="button-stage">
      <div class="button-stack">
        <kayf-prism-button color="violet" variant="solid">Start building</kayf-prism-button>
        <kayf-prism-button color="cyan" variant="outline">Read the docs</kayf-prism-button>
        <kayf-prism-button color="emerald" variant="outline">View release</kayf-prism-button>
      </div>
    </section>
  `,
}

export const States: Story = {
  parameters: { docs: { description: { story: 'Loading preserves the label and announces progress. Disabled remains legible while clearly unavailable.' } } },
  render: () => html`
    ${stageStyles}
    <section class="button-stage">
      <div class="button-stack">
        <kayf-prism-button color="violet">Available</kayf-prism-button>
        <kayf-prism-button color="violet" loading>Publishing</kayf-prism-button>
        <kayf-prism-button color="violet" disabled>Unavailable</kayf-prism-button>
      </div>
    </section>
  `,
}

export const ProductCTA: Story = {
  parameters: { docs: { description: { story: 'A realistic primary/secondary action group with clear hierarchy.' } } },
  render: () => html`
    ${stageStyles}
    <section class="button-stage">
      <article class="button-panel">
        <p class="button-panel__kicker">Workspace 01</p>
        <h3>Ship the interface.</h3>
        <p>Publish a typed component set with a reviewable visual baseline.</p>
        <div class="button-panel__actions">
          <kayf-prism-button color="violet">Create release</kayf-prism-button>
          <kayf-prism-button color="violet" variant="outline">Preview changes</kayf-prism-button>
        </div>
      </article>
    </section>
  `,
}
