import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';

const meta: Meta = {
  title: 'Components/SpotlightCard',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'A card with a radial spotlight that follows your cursor — revealing depth and texture through light. Move your mouse over the card to see the effect.',
      },
    },
  },
  argTypes: {
    color:  { control: 'select', options: ['indigo','cyan','pink','emerald','amber','red'], description: 'Spotlight tint color', defaultValue: 'indigo' },
    radius: { control: { type: 'range', min: 100, max: 500, step: 10 }, description: 'Spotlight radius in px', defaultValue: 250 },
  },
};
export default meta;
type Story = StoryObj;

export const Default: Story = {
  args: { color: 'indigo', radius: 250 },
  render: (args) => html`
    <kayf-spotlight-card color=${args.color} radius=${args.radius}>
      <div style="padding:48px 56px; font-family:'Segoe UI',system-ui,sans-serif; text-align:center; min-width:300px;">
        <div style="font-size:28px; margin-bottom:16px;">◈</div>
        <h3 style="margin:0 0 8px; font-size:20px; font-weight:700; color:#e8e8f0; letter-spacing:-0.03em;">SpotlightCard</h3>
        <p style="margin:0; font-size:13px; color:rgba(232,232,240,0.4); line-height:1.6;">Move your cursor across the card<br>to see the spotlight effect</p>
      </div>
    </kayf-spotlight-card>
  `,
};

export const AllColors: Story = {
  render: () => html`
    <div style="display:flex; gap:20px; flex-wrap:wrap; justify-content:center;">
      ${['indigo','cyan','pink','emerald','amber','red'].map(color => html`
        <kayf-spotlight-card color=${color} radius="200">
          <div style="padding:32px 36px; font-family:'Segoe UI',sans-serif; text-align:center; min-width:140px;">
            <div style="font-size:13px; font-weight:600; color:#e8e8f0; margin-bottom:4px; text-transform:capitalize;">${color}</div>
            <div style="font-size:11px; color:rgba(232,232,240,0.3);">hover me</div>
          </div>
        </kayf-spotlight-card>
      `)}
    </div>
  `,
};

export const GameCard: Story = {
  render: () => html`
    <kayf-spotlight-card color="indigo" radius="300">
      <div style="padding:28px; width:260px; font-family:'Segoe UI',sans-serif;">
        <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:20px;">
          <span style="font-size:10px; letter-spacing:0.15em; color:#6366f1; text-transform:uppercase; font-weight:600;">Epic · Rare</span>
          <span style="font-size:20px;">🗡</span>
        </div>
        <div style="font-size:24px; font-weight:800; color:#e8e8f0; letter-spacing:-0.04em; margin-bottom:4px;">Void Blade</div>
        <div style="font-size:12px; color:rgba(232,232,240,0.35); margin-bottom:20px;">Enchanted Weapon · Darkness</div>
        <div style="height:1px; background:rgba(255,255,255,0.06); margin-bottom:16px;"></div>
        <div style="display:grid; grid-template-columns:1fr 1fr 1fr; gap:8px;">
          ${[['ATK','740','#6366f1'],['DEF','120','#06b6d4'],['SPD','380','#10b981']].map(([stat, val, color]) => html`
            <div style="background:rgba(255,255,255,0.04); border:1px solid rgba(255,255,255,0.06); border-radius:8px; padding:10px; text-align:center;">
              <div style="font-size:16px; font-weight:700; color:${color};">${val}</div>
              <div style="font-size:9px; color:rgba(232,232,240,0.3); text-transform:uppercase; letter-spacing:0.08em; margin-top:2px;">${stat}</div>
            </div>
          `)}
        </div>
      </div>
    </kayf-spotlight-card>
  `,
};

export const Wide: Story = {
  args: { color: 'cyan', radius: 400 },
  render: (args) => html`
    <kayf-spotlight-card color=${args.color} radius=${args.radius}>
      <div style="padding:40px 56px; width:500px; font-family:'Segoe UI',sans-serif; display:flex; align-items:center; gap:32px;">
        <div style="font-size:48px; flex-shrink:0;">◉</div>
        <div>
          <h3 style="margin:0 0 6px; font-size:18px; font-weight:700; color:#e8e8f0;">Wide layout</h3>
          <p style="margin:0; font-size:13px; color:rgba(232,232,240,0.4); line-height:1.6;">SpotlightCard works great for horizontal layouts too. The spotlight radius adapts to content size.</p>
        </div>
      </div>
    </kayf-spotlight-card>
  `,
};
