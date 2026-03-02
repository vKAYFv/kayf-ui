import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import '../components/NoiseCard/NoiseCard';

const CARD_CONTENT = html`
  <div style="color:rgba(255,255,255,0.9);">
    <h3 style="margin:0 0 8px; font-size:18px; font-weight:600; color:#fff;">Card Title</h3>
    <p style="margin:0; font-size:14px; color:rgba(255,255,255,0.5); line-height:1.6;">
      Premium noise texture overlay creates depth and visual interest.
    </p>
  </div>
`;

const meta: Meta = {
  title: 'Components/NoiseCard',
  tags: ['autodocs'],
  render: (args) => html`
    <div style="padding:40px; background:#060810; max-width:400px;">
      <kayf-noise-card
        variant=${args.variant}
        glow=${args.glow}
        noise-opacity=${args['noise-opacity']}
        padding=${args.padding}
      >
        ${CARD_CONTENT}
      </kayf-noise-card>
    </div>
  `,
  argTypes: {
    variant:         { control: 'select', options: ['default', 'elevated', 'flat', 'glass'] },
    glow:            { control: 'select', options: ['blue', 'cyan', 'purple', 'green', 'red', 'orange', 'gold'] },
    'noise-opacity': { control: { type: 'range', min: 0.01, max: 0.15, step: 0.01 } },
    padding:         { control: 'text' },
  },
  args: {
    variant:         'default',
    glow:            'cyan',
    'noise-opacity': 0.04,
    padding:         '24px',
  },
};
export default meta;
type Story = StoryObj;

export const Default: Story = {};

export const Variants: Story = {
  render: () => html`
    <div style="padding:40px; background:#060810; display:grid; grid-template-columns:1fr 1fr; gap:20px; max-width:680px;">
      <kayf-noise-card variant="default"  glow="cyan">
        <p style="color:#fff; margin:0; font-size:13px;"><strong style="display:block;margin-bottom:4px;">Default</strong>Standard noise card</p>
      </kayf-noise-card>
      <kayf-noise-card variant="elevated" glow="purple">
        <p style="color:#fff; margin:0; font-size:13px;"><strong style="display:block;margin-bottom:4px;">Elevated</strong>Deeper shadow</p>
      </kayf-noise-card>
      <kayf-noise-card variant="flat"     glow="green">
        <p style="color:#fff; margin:0; font-size:13px;"><strong style="display:block;margin-bottom:4px;">Flat</strong>Minimal style</p>
      </kayf-noise-card>
      <kayf-noise-card variant="glass"    glow="gold">
        <p style="color:#fff; margin:0; font-size:13px;"><strong style="display:block;margin-bottom:4px;">Glass</strong>Frosted blur</p>
      </kayf-noise-card>
    </div>
  `,
};

export const GlowColors: Story = {
  name: 'Glow Colors',
  render: () => html`
    <div style="padding:40px; background:#060810; display:flex; flex-wrap:wrap; gap:12px;">
      ${(['blue','cyan','purple','green','red','orange','gold'] as const).map(g => html`
        <kayf-noise-card glow=${g} variant="elevated" padding="16px" style="flex:1; min-width:110px;">
          <p style="color:#fff; margin:0; font-size:13px; text-align:center;">${g}</p>
        </kayf-noise-card>
      `)}
    </div>
  `,
};

export const GameStatCard: Story = {
  name: 'Game Stat Card',
  render: () => html`
    <div style="padding:40px; background:#060810; max-width:320px;">
      <kayf-noise-card variant="elevated" glow="gold" padding="20px">
        <div style="color:#fff;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
            <span style="font-size:12px; text-transform:uppercase; letter-spacing:0.1em; color:rgba(255,215,0,0.7);">Season Stats</span>
            <span style="font-size:11px; color:rgba(255,255,255,0.3);">2024</span>
          </div>
          <div style="display:grid; grid-template-columns:1fr 1fr 1fr; gap:12px; text-align:center;">
            <div>
              <div style="font-size:24px; font-weight:700; color:#ffd700;">47</div>
              <div style="font-size:11px; color:rgba(255,255,255,0.4);">Wins</div>
            </div>
            <div>
              <div style="font-size:24px; font-weight:700;">12</div>
              <div style="font-size:11px; color:rgba(255,255,255,0.4);">Losses</div>
            </div>
            <div>
              <div style="font-size:24px; font-weight:700; color:#00ff88;">79%</div>
              <div style="font-size:11px; color:rgba(255,255,255,0.4);">Win Rate</div>
            </div>
          </div>
        </div>
      </kayf-noise-card>
    </div>
  `,
};
