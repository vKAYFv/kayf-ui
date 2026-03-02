import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';

const meta: Meta = {
  title: 'Components/NeonBorder',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'Animated rotating neon border using CSS `@property` conic-gradient. Wraps any content with a glowing border that rotates continuously.',
      },
    },
  },
  argTypes: {
    color:     { control: 'color',                                               description: 'Neon color (hex)',          defaultValue: '#6366f1' },
    speed:     { control: { type: 'range', min: 0.5, max: 10, step: 0.5 },      description: 'Rotation speed (seconds)', defaultValue: 3 },
    thickness: { control: { type: 'range', min: 1, max: 6, step: 1 },           description: 'Border thickness (px)',    defaultValue: 2 },
    glow:      { control: { type: 'range', min: 0, max: 30, step: 1 },          description: 'Glow blur radius (px)',    defaultValue: 10 },
    radius:    { control: { type: 'range', min: 0, max: 32, step: 2 },          description: 'Border radius (px)',       defaultValue: 12 },
  },
};
export default meta;

type Story = StoryObj;

export const Default: Story = {
  args: { color: '#6366f1', speed: 3, thickness: 2, glow: 10, radius: 12 },
  render: (args) => html`
    <kayf-neon-border
      color=${args.color}
      speed=${args.speed}
      thickness=${args.thickness}
      glow=${args.glow}
      radius=${args.radius}
    >
      <div style="padding:32px 48px; text-align:center; font-family:'Segoe UI',sans-serif;">
        <div style="font-size:22px; font-weight:700; color:#e8e8f0;">NeonBorder</div>
        <div style="font-size:13px; color:rgba(232,232,240,0.4); margin-top:6px;">Animated rotating glow</div>
      </div>
    </kayf-neon-border>
  `,
};

export const AllColors: Story = {
  render: () => html`
    <div style="display:flex; gap:24px; flex-wrap:wrap; justify-content:center; align-items:center;">
      ${['#6366f1','#06b6d4','#f472b6','#10b981','#f59e0b','#ef4444'].map(color => html`
        <kayf-neon-border color=${color} speed="3" thickness="2" glow="12" radius="12">
          <div style="padding:20px 28px; font-family:'Segoe UI',sans-serif; text-align:center;">
            <div style="font-size:13px; font-weight:600; color:${color}; font-family:'Courier New',monospace;">${color}</div>
          </div>
        </kayf-neon-border>
      `)}
    </div>
  `,
};

export const FastSpin: Story = {
  args: { color: '#f472b6', speed: 1, thickness: 3, glow: 16, radius: 100 },
  render: (args) => html`
    <kayf-neon-border
      color=${args.color}
      speed=${args.speed}
      thickness=${args.thickness}
      glow=${args.glow}
      radius=${args.radius}
    >
      <div style="padding:24px; width:120px; height:120px; display:flex; align-items:center; justify-content:center; font-size:32px;">
        ◉
      </div>
    </kayf-neon-border>
  `,
};

export const WithButton: Story = {
  render: () => html`
    <kayf-neon-border color="#6366f1" speed="4" thickness="2" glow="14" radius="100">
      <button style="
        padding: 14px 40px;
        background: transparent;
        border: none;
        font-family: 'Segoe UI', sans-serif;
        font-size: 15px;
        font-weight: 600;
        color: #e8e8f0;
        cursor: pointer;
        letter-spacing: -0.01em;
      ">◈ Get Started</button>
    </kayf-neon-border>
  `,
};
