import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';

const meta: Meta = {
  title: 'Components/BeamButton',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'A button with an animated light beam that sweeps across on hover, plus a ripple effect on click. Hover to see the beam, click to see the ripple.',
      },
    },
  },
  argTypes: {
    color:    { control: 'select', options: ['violet','cyan','emerald','amber','red'], description: 'Beam color', defaultValue: 'violet' },
    variant:  { control: 'select', options: ['solid','outline','ghost'], description: 'Visual emphasis' },
    size:     { control: 'select', options: ['sm','md','lg'], description: 'Button size', defaultValue: 'md' },
    disabled: { control: 'boolean', description: 'Disable the button', defaultValue: false },
    loading:  { control: 'boolean', description: 'Show progress and disable interaction' },
  },
};
export default meta;
type Story = StoryObj;

export const Default: Story = {
  args: { color: 'violet', variant: 'solid', size: 'md', disabled: false, loading: false },
  render: (args) => html`
    <kayf-beam-button color=${args.color} variant=${args.variant} size=${args.size} ?disabled=${args.disabled} ?loading=${args.loading}>
      ◈ Launch Mission
    </kayf-beam-button>
  `,
};

export const AllColors: Story = {
  render: () => html`
    <div style="display:flex; gap:16px; flex-wrap:wrap; align-items:center; justify-content:center;">
      <kayf-beam-button color="violet">◈ Violet</kayf-beam-button>
      <kayf-beam-button color="cyan">◇ Cyan</kayf-beam-button>
      <kayf-beam-button color="emerald">◎ Emerald</kayf-beam-button>
      <kayf-beam-button color="amber">◑ Amber</kayf-beam-button>
      <kayf-beam-button color="red">◐ Red</kayf-beam-button>
    </div>
  `,
};

export const AllSizes: Story = {
  render: () => html`
    <div style="display:flex; gap:16px; align-items:center; flex-wrap:wrap; justify-content:center;">
      <kayf-beam-button color="violet" size="sm">◈ Small</kayf-beam-button>
      <kayf-beam-button color="violet" size="md">◈ Medium</kayf-beam-button>
      <kayf-beam-button color="violet" size="lg">◈ Large</kayf-beam-button>
    </div>
  `,
};

export const Disabled: Story = {
  render: () => html`
    <div style="display:flex; gap:16px; align-items:center; justify-content:center;">
      <kayf-beam-button color="violet" size="md">◈ Active</kayf-beam-button>
      <kayf-beam-button color="violet" size="md" disabled>◈ Disabled</kayf-beam-button>
    </div>
  `,
};

export const CTAGroup: Story = {
  render: () => html`
    <div style="display:flex; flex-direction:column; align-items:center; gap:32px; padding:20px;">
      <div style="font-family:Inter,system-ui,sans-serif; text-align:center;">
        <h2 style="margin:0 0 8px; font-size:28px; font-weight:800; color:#f4f4f7; letter-spacing:-0.04em;">Ready to launch?</h2>
        <p style="margin:0 0 24px; font-size:14px; color:rgba(228,228,231,0.4);">Start building with @kayf/ui today</p>
        <div style="display:flex; gap:12px; justify-content:center; flex-wrap:wrap;">
          <kayf-beam-button color="violet" size="lg">◈ Get Started</kayf-beam-button>
          <kayf-beam-button color="cyan" size="lg">◇ View Docs</kayf-beam-button>
        </div>
      </div>
    </div>
  `,
};
