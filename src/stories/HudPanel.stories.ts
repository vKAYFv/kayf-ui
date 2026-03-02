import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';

const meta: Meta = {
  title: 'Components/HudPanel',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'A sci-fi HUD panel with animated corner accents, scanline overlay, and a labeled header. Perfect for dashboards, game interfaces, and monitoring tools.',
      },
    },
  },
  argTypes: {
    label:     { control: 'text',    description: 'Panel header label',    defaultValue: 'SYSTEM STATUS' },
    color:     { control: 'select',  options: ['indigo','cyan','pink','emerald','amber','red'], description: 'Accent color', defaultValue: 'cyan' },
    scanlines: { control: 'boolean', description: 'Show scanline overlay', defaultValue: true },
  },
};
export default meta;
type Story = StoryObj;

export const Default: Story = {
  args: { label: 'SYSTEM STATUS', color: 'cyan', scanlines: true },
  render: (args) => html`
    <kayf-hud-panel label=${args.label} color=${args.color} ?scanlines=${args.scanlines}>
      <div style="padding:20px 24px; font-family:'Courier New',monospace; display:flex; flex-direction:column; gap:14px; min-width:380px;">
        ${[['CPU LOAD','75%','#06b6d4',75],['MEMORY','51%','#6366f1',51],['NETWORK','90%','#10b981',90]].map(([label, val, color, pct]) => html`
          <div>
            <div style="display:flex; justify-content:space-between; margin-bottom:6px;">
              <span style="font-size:10px; letter-spacing:0.12em; color:${color}; opacity:0.7;">${label}</span>
              <span style="font-size:10px; color:${color}; opacity:0.6;">${val}</span>
            </div>
            <div style="height:4px; background:rgba(255,255,255,0.05); border-radius:2px; overflow:hidden;">
              <div style="height:100%; width:${pct}%; background:${color}; border-radius:2px; opacity:0.7;"></div>
            </div>
          </div>
        `)}
      </div>
    </kayf-hud-panel>
  `,
};

export const AllColors: Story = {
  render: () => html`
    <div style="display:flex; gap:20px; flex-wrap:wrap; justify-content:center;">
      ${[['cyan','RADAR'],['indigo','SHIELDS'],['pink','VITALS'],['emerald','NETWORK']].map(([color, label]) => html`
        <kayf-hud-panel label=${label} color=${color}>
          <div style="padding:16px 20px; font-family:'Courier New',monospace; width:160px;">
            <div style="font-size:24px; font-weight:700; color:#e8e8f0; text-align:center; margin-bottom:4px;">OK</div>
            <div style="font-size:10px; color:rgba(232,232,240,0.3); text-align:center; letter-spacing:0.1em;">NOMINAL</div>
          </div>
        </kayf-hud-panel>
      `)}
    </div>
  `,
};

export const NoScanlines: Story = {
  args: { label: 'ANALYTICS', color: 'indigo', scanlines: false },
  render: (args) => html`
    <kayf-hud-panel label=${args.label} color=${args.color} ?scanlines=${args.scanlines}>
      <div style="padding:24px; font-family:'Segoe UI',sans-serif; min-width:340px;">
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px;">
          ${[['◎','98.7k','Users','#6366f1'],['◈','4.9','Rating','#f472b6'],['◇','127ms','Latency','#06b6d4'],['◉','99.9%','Uptime','#10b981']].map(([icon, val, label, color]) => html`
            <div style="background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.06); border-radius:10px; padding:14px; text-align:center;">
              <div style="font-size:16px; margin-bottom:6px; opacity:0.4;">${icon}</div>
              <div style="font-size:20px; font-weight:700; color:${color}; letter-spacing:-0.03em;">${val}</div>
              <div style="font-size:10px; color:rgba(232,232,240,0.3); text-transform:uppercase; letter-spacing:0.08em; margin-top:3px;">${label}</div>
            </div>
          `)}
        </div>
      </div>
    </kayf-hud-panel>
  `,
};

export const SpaceshipDashboard: Story = {
  render: () => html`
    <div style="display:flex; flex-direction:column; gap:16px; max-width:480px;">
      <kayf-hud-panel label="NAVIGATION" color="cyan">
        <div style="padding:16px 20px; font-family:'Courier New',monospace; display:flex; justify-content:space-between; align-items:center;">
          <div>
            <div style="font-size:10px; color:rgba(6,182,212,0.5); letter-spacing:0.1em; margin-bottom:4px;">HEADING</div>
            <div style="font-size:22px; font-weight:700; color:#e8e8f0;">247° NNW</div>
          </div>
          <div style="text-align:right;">
            <div style="font-size:10px; color:rgba(6,182,212,0.5); letter-spacing:0.1em; margin-bottom:4px;">SPEED</div>
            <div style="font-size:22px; font-weight:700; color:#06b6d4;">0.74c</div>
          </div>
        </div>
      </kayf-hud-panel>
      <kayf-hud-panel label="WEAPONS" color="red">
        <div style="padding:16px 20px; font-family:'Courier New',monospace; display:flex; gap:12px;">
          ${[['LASER','READY','#10b981'],['MISSILES','4/8','#f59e0b'],['SHIELD','23%','#ef4444']].map(([sys, status, color]) => html`
            <div style="flex:1; text-align:center; background:rgba(255,255,255,0.03); border-radius:8px; padding:10px;">
              <div style="font-size:9px; color:rgba(232,232,240,0.3); letter-spacing:0.1em; margin-bottom:6px;">${sys}</div>
              <div style="font-size:13px; font-weight:700; color:${color};">${status}</div>
            </div>
          `)}
        </div>
      </kayf-hud-panel>
    </div>
  `,
};
