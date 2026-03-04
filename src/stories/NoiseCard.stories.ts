import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import '../components/NoiseCard/NoiseCard';

const meta: Meta = {
  title: 'Components/NoiseCard',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'Glassmorphism card with procedural Canvas 2D noise texture overlay. Noise is generated once on mount for performance. Four surface variants and seven glow accent colors. Hover triggers border and shadow transitions.',
      },
    },
  },
  argTypes: {
    variant:         {
      control: 'select', options: ['default', 'elevated', 'flat', 'glass'],
      description: 'Surface style preset',
      defaultValue: 'default',
    },
    glow:            {
      control: 'select', options: ['blue', 'cyan', 'purple', 'green', 'red', 'orange', 'gold'],
      description: 'Accent glow color',
      defaultValue: 'cyan',
    },
    'noise-opacity': {
      control: { type: 'range', min: 0.01, max: 0.15, step: 0.01 },
      description: 'Noise texture intensity (0.01–0.15)',
      defaultValue: 0.04,
    },
    padding:         {
      control: 'text',
      description: 'Inner padding (any CSS value)',
      defaultValue: '24px',
    },
  },
};
export default meta;
type Story = StoryObj;

export const Default: Story = {
  args: { variant: 'default', glow: 'cyan', 'noise-opacity': 0.04, padding: '24px' },
  render: (args) => html`
    <div style="display:flex; align-items:center; justify-content:center; padding:60px;">
      <kayf-noise-card
        variant=${args.variant}
        glow=${args.glow}
        noise-opacity=${args['noise-opacity']}
        padding=${args.padding}
        style="width:340px;"
      >
        <div style="font-family:'Segoe UI',system-ui,sans-serif;">
          <h3 style="margin:0 0 8px; font-size:18px; font-weight:600; color:#e8e8f0; letter-spacing:-0.02em;">Card Title</h3>
          <p style="margin:0; font-size:13px; color:rgba(232,232,240,0.45); line-height:1.6;">
            Premium noise texture overlay creates depth and visual interest in dark interfaces.
          </p>
        </div>
      </kayf-noise-card>
    </div>
  `,
};

export const Variants: Story = {
  parameters: {
    docs: {
      description: { story: 'All four surface variants side by side — default, elevated, flat, and glass (backdrop-filter blur).' },
    },
  },
  render: () => html`
    <div style="display:grid; grid-template-columns:1fr 1fr; gap:20px; padding:40px; max-width:680px; margin:0 auto;">
      <kayf-noise-card variant="default"  glow="cyan"   padding="20px">
        <div style="font-family:'Segoe UI',sans-serif;">
          <div style="font-size:11px; letter-spacing:0.1em; color:rgba(0,212,255,0.7); text-transform:uppercase; margin-bottom:8px;">Default</div>
          <div style="font-size:14px; color:rgba(232,232,240,0.6);">Standard dark surface</div>
        </div>
      </kayf-noise-card>
      <kayf-noise-card variant="elevated" glow="purple" padding="20px">
        <div style="font-family:'Segoe UI',sans-serif;">
          <div style="font-size:11px; letter-spacing:0.1em; color:rgba(139,92,246,0.7); text-transform:uppercase; margin-bottom:8px;">Elevated</div>
          <div style="font-size:14px; color:rgba(232,232,240,0.6);">Deeper shadow & border</div>
        </div>
      </kayf-noise-card>
      <kayf-noise-card variant="flat"     glow="green"  padding="20px">
        <div style="font-family:'Segoe UI',sans-serif;">
          <div style="font-size:11px; letter-spacing:0.1em; color:rgba(0,255,136,0.7); text-transform:uppercase; margin-bottom:8px;">Flat</div>
          <div style="font-size:14px; color:rgba(232,232,240,0.6);">Minimal subtle border</div>
        </div>
      </kayf-noise-card>
      <kayf-noise-card variant="glass"    glow="gold"   padding="20px">
        <div style="font-family:'Segoe UI',sans-serif;">
          <div style="font-size:11px; letter-spacing:0.1em; color:rgba(255,215,0,0.7); text-transform:uppercase; margin-bottom:8px;">Glass</div>
          <div style="font-size:14px; color:rgba(232,232,240,0.6);">Frosted backdrop blur</div>
        </div>
      </kayf-noise-card>
    </div>
  `,
};

export const GlowColors: Story = {
  parameters: {
    docs: {
      description: { story: 'All seven glow accent colors applied to the elevated variant.' },
    },
  },
  render: () => html`
    <div style="display:flex; flex-wrap:wrap; gap:12px; padding:40px; justify-content:center;">
      ${(['blue','cyan','purple','green','red','orange','gold'] as const).map(g => html`
        <kayf-noise-card glow=${g} variant="elevated" padding="16px 20px" style="flex:1; min-width:110px; max-width:140px;">
          <div style="font-family:'Segoe UI',sans-serif; text-align:center;">
            <div style="font-size:13px; color:rgba(232,232,240,0.7); font-weight:500;">${g}</div>
          </div>
        </kayf-noise-card>
      `)}
    </div>
  `,
};

export const GameStatCard: Story = {
  parameters: {
    docs: {
      description: { story: 'Example of a game season statistics card using the elevated gold variant.' },
    },
  },
  render: () => html`
    <div style="display:flex; align-items:center; justify-content:center; padding:60px;">
      <kayf-noise-card variant="elevated" glow="gold" padding="24px" style="width:300px;">
        <div style="font-family:'Segoe UI',system-ui,sans-serif;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px;">
            <span style="font-size:11px; text-transform:uppercase; letter-spacing:0.12em; color:rgba(255,215,0,0.7); font-weight:600;">Season Stats</span>
            <span style="font-size:11px; color:rgba(232,232,240,0.25);">2024</span>
          </div>
          <div style="display:grid; grid-template-columns:1fr 1fr 1fr; gap:16px; text-align:center;">
            <div>
              <div style="font-size:26px; font-weight:800; color:#ffd700; letter-spacing:-0.03em;">47</div>
              <div style="font-size:10px; color:rgba(232,232,240,0.35); text-transform:uppercase; letter-spacing:0.08em; margin-top:3px;">Wins</div>
            </div>
            <div>
              <div style="font-size:26px; font-weight:800; color:#e8e8f0; letter-spacing:-0.03em;">12</div>
              <div style="font-size:10px; color:rgba(232,232,240,0.35); text-transform:uppercase; letter-spacing:0.08em; margin-top:3px;">Losses</div>
            </div>
            <div>
              <div style="font-size:26px; font-weight:800; color:#00ff88; letter-spacing:-0.03em;">79%</div>
              <div style="font-size:10px; color:rgba(232,232,240,0.35); text-transform:uppercase; letter-spacing:0.08em; margin-top:3px;">Win Rate</div>
            </div>
          </div>
          <div style="margin-top:20px; height:3px; background:rgba(255,255,255,0.06); border-radius:2px; overflow:hidden;">
            <div style="width:79%; height:100%; background:linear-gradient(90deg, #ffd700, #00ff88); border-radius:2px;"></div>
          </div>
        </div>
      </kayf-noise-card>
    </div>
  `,
};

export const DashboardPanel: Story = {
  parameters: {
    docs: {
      description: { story: 'Grouped panel layout — common for dashboard sidebars or info widgets.' },
    },
  },
  render: () => html`
    <div style="display:flex; gap:16px; padding:40px; flex-wrap:wrap; justify-content:center;">
      <kayf-noise-card variant="elevated" glow="cyan" padding="20px" style="width:200px;">
        <div style="font-family:'Segoe UI',sans-serif;">
          <div style="font-size:11px; color:rgba(0,212,255,0.6); text-transform:uppercase; letter-spacing:0.1em; margin-bottom:10px;">CPU</div>
          <div style="font-size:28px; font-weight:800; color:#e8e8f0;">34%</div>
          <div style="margin-top:10px; height:2px; background:rgba(255,255,255,0.06); border-radius:1px;">
            <div style="width:34%; height:100%; background:#00d4ff; border-radius:1px;"></div>
          </div>
        </div>
      </kayf-noise-card>
      <kayf-noise-card variant="elevated" glow="purple" padding="20px" style="width:200px;">
        <div style="font-family:'Segoe UI',sans-serif;">
          <div style="font-size:11px; color:rgba(139,92,246,0.6); text-transform:uppercase; letter-spacing:0.1em; margin-bottom:10px;">Memory</div>
          <div style="font-size:28px; font-weight:800; color:#e8e8f0;">68%</div>
          <div style="margin-top:10px; height:2px; background:rgba(255,255,255,0.06); border-radius:1px;">
            <div style="width:68%; height:100%; background:#8b5cf6; border-radius:1px;"></div>
          </div>
        </div>
      </kayf-noise-card>
      <kayf-noise-card variant="elevated" glow="green" padding="20px" style="width:200px;">
        <div style="font-family:'Segoe UI',sans-serif;">
          <div style="font-size:11px; color:rgba(0,255,136,0.6); text-transform:uppercase; letter-spacing:0.1em; margin-bottom:10px;">Network</div>
          <div style="font-size:28px; font-weight:800; color:#e8e8f0;">12ms</div>
          <div style="margin-top:10px; height:2px; background:rgba(255,255,255,0.06); border-radius:1px;">
            <div style="width:12%; height:100%; background:#00ff88; border-radius:1px;"></div>
          </div>
        </div>
      </kayf-noise-card>
    </div>
  `,
};