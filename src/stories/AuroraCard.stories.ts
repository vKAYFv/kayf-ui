import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';

const meta: Meta = {
  title: 'Components/AuroraCard',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'Canvas-animated aurora blobs drifting behind a glassmorphism card surface. The aurora animation runs continuously using Canvas 2D.',
      },
    },
  },
  argTypes: {
    speed:   { control: 'select', options: ['slow', 'normal', 'fast'], description: 'Animation speed preset' },
    blur:    { control: 'select', options: ['sm', 'md', 'lg'], description: 'Aurora softness preset' },
    opacity: { control: { type: 'range', min: 0.1, max: 1, step: 0.05 }, description: 'Blob opacity from 0 to 1' },
    static:  { control: 'boolean', description: 'Render a still aurora frame' },
  },
};
export default meta;
type Story = StoryObj;

export const Default: Story = {
  args: { speed: 'normal', blur: 'md', opacity: 0.52, static: false },
  render: (args) => html`
    <kayf-aurora-card speed=${args.speed} blur=${args.blur} opacity=${args.opacity} ?static=${args.static}>
      <div style="padding:48px 56px; font-family:Inter,system-ui,sans-serif; text-align:center; min-width:320px;">
        <div style="font-size:28px; margin-bottom:16px;">◈</div>
        <h3 style="margin:0 0 8px; font-size:20px; font-weight:700; color:#f4f4f7; letter-spacing:-0.03em;">AuroraCard</h3>
        <p style="margin:0; font-size:13px; color:rgba(228,228,231,0.5); line-height:1.6;">Canvas aurora drifting beneath glass</p>
      </div>
    </kayf-aurora-card>
  `,
};

export const Slow: Story = {
  args: { speed: 'slow', blur: 'lg', opacity: 0.45 },
  render: (args) => html`
    <kayf-aurora-card speed=${args.speed} blur=${args.blur} opacity=${args.opacity}>
      <div style="padding:40px 56px; font-family:Inter,system-ui,sans-serif; text-align:center; min-width:300px;">
        <h3 style="margin:0 0 8px; font-size:18px; font-weight:700; color:#f4f4f7;">Slow & Dreamy</h3>
        <p style="margin:0; font-size:13px; color:rgba(228,228,231,0.4);">speed=slow · blur=lg</p>
      </div>
    </kayf-aurora-card>
  `,
};

export const Intense: Story = {
  args: { speed: 'fast', blur: 'sm', opacity: 0.8 },
  render: (args) => html`
    <kayf-aurora-card speed=${args.speed} blur=${args.blur} opacity=${args.opacity}>
      <div style="padding:40px 56px; font-family:Inter,system-ui,sans-serif; text-align:center; min-width:300px;">
        <h3 style="margin:0 0 8px; font-size:18px; font-weight:700; color:#f4f4f7;">Intense</h3>
        <p style="margin:0; font-size:13px; color:rgba(228,228,231,0.4);">speed=fast · blur=sm · opacity=0.8</p>
      </div>
    </kayf-aurora-card>
  `,
};

export const PricingCard: Story = {
  render: () => html`
    <kayf-aurora-card speed="slow" blur="md" opacity="0.55">
      <div style="padding:36px; width:280px; font-family:Inter,system-ui,sans-serif;">
        <div style="font-size:11px; letter-spacing:0.15em; color:#8b7cff; text-transform:uppercase; font-weight:600; margin-bottom:16px;">Pro Plan</div>
        <div style="font-size:42px; font-weight:800; color:#f4f4f7; letter-spacing:-0.04em; margin-bottom:4px;">$29<span style="font-size:16px; font-weight:400; color:rgba(228,228,231,0.4)">/mo</span></div>
        <div style="font-size:13px; color:rgba(228,228,231,0.4); margin-bottom:24px;">Everything you need</div>
        <div style="display:flex; flex-direction:column; gap:10px; margin-bottom:28px;">
          ${['Unlimited components','Dark theme only','TypeScript support','Community access'].map(f => html`
            <div style="display:flex; align-items:center; gap:10px; font-size:13px; color:rgba(228,228,231,0.7);">
              <span style="color:#51dfa4; font-size:12px;">✓</span> ${f}
            </div>
          `)}
        </div>
        <kayf-beam-button color="violet" variant="solid" size="md" style="width:100%;">Get Started</kayf-beam-button>
      </div>
    </kayf-aurora-card>
  `,
};
