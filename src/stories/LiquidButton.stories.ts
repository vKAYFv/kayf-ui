import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import '../../components/LiquidButton/LiquidButton';

const meta: Meta = {
  title: 'Components/LiquidButton',
  tags: ['autodocs'],
  render: (args) => html`
    <div style="display:flex; gap:20px; align-items:center; padding:40px; background:#060810; min-height:120px;">
      <kayf-liquid-button
        label=${args.label}
        color=${args.color}
        size=${args.size}
        ?disabled=${args.disabled}
      ></kayf-liquid-button>
    </div>
  `,
  argTypes: {
    label:    { control: 'text' },
    color:    { control: 'color' },
    size:     { control: 'select', options: ['sm', 'md', 'lg'] },
    disabled: { control: 'boolean' },
  },
  args: {
    label:    'Click me',
    color:    '#00d4ff',
    size:     'md',
    disabled: false,
  },
};
export default meta;
type Story = StoryObj;

export const Default: Story = {};

export const Sizes: Story = {
  render: () => html`
    <div style="display:flex; gap:24px; align-items:center; padding:40px; background:#060810; min-height:120px;">
      <kayf-liquid-button label="Small"  size="sm" color="#00d4ff"></kayf-liquid-button>
      <kayf-liquid-button label="Medium" size="md" color="#00d4ff"></kayf-liquid-button>
      <kayf-liquid-button label="Large"  size="lg" color="#00d4ff"></kayf-liquid-button>
    </div>
  `,
};

export const Colors: Story = {
  render: () => html`
    <div style="display:flex; gap:24px; align-items:center; padding:40px; background:#060810; min-height:120px; flex-wrap:wrap;">
      <kayf-liquid-button label="Cyan"   color="#00d4ff"></kayf-liquid-button>
      <kayf-liquid-button label="Purple" color="#8b5cf6"></kayf-liquid-button>
      <kayf-liquid-button label="Green"  color="#00ff88"></kayf-liquid-button>
      <kayf-liquid-button label="Red"    color="#ff3366"></kayf-liquid-button>
      <kayf-liquid-button label="Gold"   color="#ffd700"></kayf-liquid-button>
    </div>
  `,
};

export const GameUI: Story = {
  name: 'Game UI',
  render: () => html`
    <div style="display:flex; gap:16px; align-items:center; padding:40px; background:#060810; min-height:120px; flex-wrap:wrap;">
      <kayf-liquid-button label="▶ Play"     color="#00ff88" size="lg"></kayf-liquid-button>
      <kayf-liquid-button label="⚙ Settings" color="#8b5cf6" size="md"></kayf-liquid-button>
      <kayf-liquid-button label="✕ Quit"     color="#ff3366" size="md"></kayf-liquid-button>
    </div>
  `,
};

export const Disabled: Story = {
  args: { label: 'Disabled', disabled: true },
};
