import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';

const meta: Meta = {
  title: 'Components/GlitchText',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'Text that randomly glitches with RGB channel splitting and horizontal slice displacement. Perfect for terminals, game UIs, and cyberpunk aesthetics.',
      },
    },
  },
  argTypes: {
    intensity: { control: { type: 'range', min: 0, max: 1, step: 0.05 }, description: 'Glitch strength 0–1',         defaultValue: 0.5 },
    interval:  { control: { type: 'range', min: 500, max: 10000, step: 100 }, description: 'Time between glitches (ms)', defaultValue: 3000 },
    color:     { control: 'select', options: ['indigo','cyan','pink','emerald','amber','red'], description: 'Accent color', defaultValue: 'cyan' },
  },
};
export default meta;
type Story = StoryObj;

export const Default: Story = {
  args: { intensity: 0.5, interval: 3000, color: 'cyan' },
  render: (args) => html`
    <kayf-glitch-text intensity=${args.intensity} interval=${args.interval} color=${args.color}
      style="font-family:'Courier New',monospace; font-size:36px; font-weight:700; letter-spacing:4px; color:#e8e8f0;">
      SYSTEM ONLINE
    </kayf-glitch-text>
  `,
};

export const Aggressive: Story = {
  args: { intensity: 0.95, interval: 800 },
  render: (args) => html`
    <kayf-glitch-text intensity=${args.intensity} interval=${args.interval} color="red"
      style="font-family:'Courier New',monospace; font-size:36px; font-weight:700; letter-spacing:4px; color:#e8e8f0;">
      ERROR_404
    </kayf-glitch-text>
  `,
};

export const Subtle: Story = {
  args: { intensity: 0.2, interval: 5000 },
  render: (args) => html`
    <kayf-glitch-text intensity=${args.intensity} interval=${args.interval} color="indigo"
      style="font-family:'Courier New',monospace; font-size:36px; font-weight:700; letter-spacing:4px; color:#e8e8f0;">
      LOADING...
    </kayf-glitch-text>
  `,
};

export const HeroHeadline: Story = {
  render: () => html`
    <div style="text-align:center; padding:20px; font-family:'Courier New',monospace;">
      <div style="font-size:11px; color:rgba(6,182,212,0.5); letter-spacing:0.2em; margin-bottom:20px;">[ SYSTEM TERMINAL v2.4.1 ]</div>
      <kayf-glitch-text intensity="0.6" interval="2500" color="cyan"
        style="font-size:52px; font-weight:900; letter-spacing:6px; color:#e8e8f0; display:block; margin-bottom:12px;">
        KAYF_UI
      </kayf-glitch-text>
      <div style="font-size:13px; color:rgba(232,232,240,0.3); letter-spacing:3px;">PREMIUM · DARK · COMPONENTS</div>
    </div>
  `,
};

export const GameHUD: Story = {
  render: () => html`
    <div style="display:flex; flex-direction:column; gap:12px; font-family:'Courier New',monospace; padding:20px;">
      <kayf-glitch-text intensity="0.3" interval="4000" color="emerald"
        style="font-size:14px; letter-spacing:3px; color:#10b981;">
        SHIELDS: 87%
      </kayf-glitch-text>
      <kayf-glitch-text intensity="0.8" interval="1500" color="red"
        style="font-size:14px; letter-spacing:3px; color:#ef4444;">
        HULL: 23% ⚠
      </kayf-glitch-text>
      <kayf-glitch-text intensity="0.2" interval="6000" color="cyan"
        style="font-size:14px; letter-spacing:3px; color:#06b6d4;">
        WARP_DRIVE: ONLINE
      </kayf-glitch-text>
    </div>
  `,
};
