import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import '../components/LiquidButton/LiquidButton';

const meta: Meta = {
  title: 'Components/LiquidButton',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'Physics-based liquid blob button. The border morphs with spring physics — it deforms around the cursor on hover and snaps back on leave. The blob shape is drawn entirely on Canvas 2D with no background rectangle. Click triggers a `kayf-click` custom event.',
      },
    },
  },
  argTypes: {
    label:    { control: 'text',                                                        description: 'Button label text',       defaultValue: 'Click me' },
    color:    { control: 'color',                                                       description: 'Blob & glow color (hex)', defaultValue: '#00d4ff' },
    size:     { control: 'select', options: ['sm', 'md', 'lg'],                         description: 'Button size preset',      defaultValue: 'md' },
    disabled: { control: 'boolean',                                                     description: 'Disabled state',          defaultValue: false },
  },
};
export default meta;
type Story = StoryObj;

export const Default: Story = {
  args: { label: 'Click me', color: '#00d4ff', size: 'md', disabled: false },
  render: (args) => html`
    <div style="display:flex; align-items:center; justify-content:center; min-height:200px;">
      <kayf-liquid-button
        label=${args.label}
        color=${args.color}
        size=${args.size}
        ?disabled=${args.disabled}
      ></kayf-liquid-button>
    </div>
  `,
};

export const Sizes: Story = {
  parameters: {
    docs: {
      description: { story: 'Three size presets — sm (100×36), md (140×48), lg (180×60).' },
    },
  },
  render: () => html`
    <div style="display:flex; gap:40px; align-items:center; justify-content:center; min-height:200px; flex-wrap:wrap;">
      <kayf-liquid-button label="Small"  size="sm" color="#00d4ff"></kayf-liquid-button>
      <kayf-liquid-button label="Medium" size="md" color="#00d4ff"></kayf-liquid-button>
      <kayf-liquid-button label="Large"  size="lg" color="#00d4ff"></kayf-liquid-button>
    </div>
  `,
};

export const Colors: Story = {
  parameters: {
    docs: {
      description: { story: 'Any hex color can be passed — the blob fill, stroke, glow, and text-shadow all derive from the same value.' },
    },
  },
  render: () => html`
    <div style="display:flex; gap:32px; align-items:center; justify-content:center; min-height:200px; flex-wrap:wrap;">
      <kayf-liquid-button label="Cyan"   color="#00d4ff"></kayf-liquid-button>
      <kayf-liquid-button label="Purple" color="#8b5cf6"></kayf-liquid-button>
      <kayf-liquid-button label="Green"  color="#00ff88"></kayf-liquid-button>
      <kayf-liquid-button label="Red"    color="#ff3366"></kayf-liquid-button>
      <kayf-liquid-button label="Gold"   color="#ffd700"></kayf-liquid-button>
    </div>
  `,
};

export const GameUI: Story = {
  parameters: {
    docs: {
      description: { story: 'Common game menu layout — primary action, settings, and destructive button. Hover each to see the blob deform.' },
    },
  },
  render: () => html`
    <div style="display:flex; gap:28px; align-items:center; justify-content:center; min-height:200px; flex-wrap:wrap;">
      <kayf-liquid-button label="▶  Play"     color="#00ff88" size="lg"></kayf-liquid-button>
      <kayf-liquid-button label="⚙  Settings" color="#8b5cf6" size="md"></kayf-liquid-button>
      <kayf-liquid-button label="✕  Quit"     color="#ff3366" size="md"></kayf-liquid-button>
    </div>
  `,
};

export const Disabled: Story = {
  parameters: {
    docs: {
      description: { story: 'Disabled state — blob still renders at reduced opacity but interaction and events are suppressed.' },
    },
  },
  render: () => html`
    <div style="display:flex; gap:32px; align-items:center; justify-content:center; min-height:200px; flex-wrap:wrap;">
      <kayf-liquid-button label="Disabled" color="#00d4ff" size="md" disabled></kayf-liquid-button>
      <kayf-liquid-button label="Disabled" color="#8b5cf6" size="lg" disabled></kayf-liquid-button>
    </div>
  `,
};