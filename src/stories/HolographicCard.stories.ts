import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';

const meta: Meta = {
  title: 'Components/HolographicCard',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: '3D perspective tilt card with rainbow holographic shine effect. Move your cursor over the card to see the effect.',
      },
    },
  },
  argTypes: {
    'tilt-max':       { control: { type: 'range', min: 5, max: 30, step: 1 },  description: 'Max tilt angle in degrees', defaultValue: 15 },
    'shine-opacity':  { control: { type: 'range', min: 0, max: 1,  step: 0.1 }, description: 'Rainbow shine intensity', defaultValue: 1 },
    'scale':          { control: { type: 'range', min: 1, max: 1.2, step: 0.01 }, description: 'Scale on hover', defaultValue: 1.03 },
  },
};
export default meta;

type Story = StoryObj;

export const Default: Story = {
  args: { 'tilt-max': 15, 'shine-opacity': 1, scale: 1.03 },
  render: (args) => html`
    <kayf-holographic-card
      tilt-max=${args['tilt-max']}
      shine-opacity=${args['shine-opacity']}
      scale=${args['scale']}
    >
      <div style="padding:40px 48px; text-align:center;">
        <div style="font-size:32px; margin-bottom:12px;">◈</div>
        <h3 style="margin:0 0 8px; font-family:'Segoe UI',sans-serif; font-size:20px; color:#e8e8f0; letter-spacing:-0.03em;">Holographic</h3>
        <p style="margin:0; font-family:'Segoe UI',sans-serif; font-size:13px; color:rgba(232,232,240,0.4);">Hover to see the effect</p>
      </div>
    </kayf-holographic-card>
  `,
};

export const GameCard: Story = {
  render: () => html`
    <kayf-holographic-card tilt-max="20" shine-opacity="1" scale="1.05">
      <div style="padding:24px; width:240px; font-family:'Segoe UI',sans-serif;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
          <span style="font-size:11px; letter-spacing:0.1em; color:#6366f1; text-transform:uppercase;">Legendary</span>
          <span style="font-size:18px;">⚔</span>
        </div>
        <div style="font-size:22px; font-weight:700; color:#e8e8f0; letter-spacing:-0.03em; margin-bottom:4px;">Shadow Blade</div>
        <div style="font-size:12px; color:rgba(232,232,240,0.4); margin-bottom:20px;">Mythical Weapon · +847 ATK</div>
        <div style="display:flex; gap:8px;">
          <div style="flex:1; background:rgba(99,102,241,0.1); border:1px solid rgba(99,102,241,0.2); border-radius:8px; padding:8px; text-align:center;">
            <div style="font-size:16px; font-weight:700; color:#6366f1;">847</div>
            <div style="font-size:10px; color:rgba(232,232,240,0.3); text-transform:uppercase; letter-spacing:0.05em;">ATK</div>
          </div>
          <div style="flex:1; background:rgba(6,182,212,0.1); border:1px solid rgba(6,182,212,0.2); border-radius:8px; padding:8px; text-align:center;">
            <div style="font-size:16px; font-weight:700; color:#06b6d4;">320</div>
            <div style="font-size:10px; color:rgba(232,232,240,0.3); text-transform:uppercase; letter-spacing:0.05em;">SPD</div>
          </div>
        </div>
      </div>
    </kayf-holographic-card>
  `,
};

export const Subtle: Story = {
  args: { 'tilt-max': 8, 'shine-opacity': 0.5, scale: 1.01 },
  render: (args) => html`
    <kayf-holographic-card
      tilt-max=${args['tilt-max']}
      shine-opacity=${args['shine-opacity']}
      scale=${args['scale']}
    >
      <div style="padding:32px 40px; text-align:center; font-family:'Segoe UI',sans-serif;">
        <h3 style="margin:0 0 8px; font-size:18px; color:#e8e8f0;">Subtle Mode</h3>
        <p style="margin:0; font-size:13px; color:rgba(232,232,240,0.4);">Low tilt, soft shine</p>
      </div>
    </kayf-holographic-card>
  `,
};
