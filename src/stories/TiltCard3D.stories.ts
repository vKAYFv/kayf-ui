import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import '../components/TiltCard3D/TiltCard3D';

const meta: Meta = {
  title: 'Components/TiltCard3D',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'Smooth 3D perspective tilt card with mouse-tracking shine overlay. Uses a requestAnimationFrame loop with lerp easing for fluid motion. Wraps any slotted content — applies tilt externally without touching the inner DOM. Fires a `kayf-tilt` event with current rotation values.',
      },
    },
  },
  argTypes: {
    'max-tilt':  { control: { type: 'range', min: 5, max: 30, step: 1 },    description: 'Max tilt angle in degrees',   defaultValue: 15 },
    scale:       { control: { type: 'range', min: 1.0, max: 1.15, step: 0.01 }, description: 'Scale on hover',          defaultValue: 1.05 },
    perspective: { control: { type: 'range', min: 500, max: 2000, step: 100 }, description: 'CSS perspective in px',    defaultValue: 1000 },
    glow:        { control: 'color',                                          description: 'Edge glow & shadow color',   defaultValue: '#ffffff' },
  },
};
export default meta;
type Story = StoryObj;

export const Default: Story = {
  args: { 'max-tilt': 15, scale: 1.05, perspective: 1000, glow: '#ffffff' },
  render: (args) => html`
    <div style="display:flex; align-items:center; justify-content:center; padding:80px 60px;">
      <kayf-3d-tilt-card
        max-tilt=${args['max-tilt']}
        scale=${args.scale}
        perspective=${args.perspective}
        glow=${args.glow}
      >
        <div style="
          width:300px; padding:28px;
          background:rgba(255,255,255,0.04);
          border:1px solid rgba(255,255,255,0.1);
          border-radius:12px;
          font-family:'Segoe UI',system-ui,sans-serif;
        ">
          <div style="font-size:11px; letter-spacing:0.12em; color:rgba(0,212,255,0.8); text-transform:uppercase; margin-bottom:12px;">Premium Card</div>
          <h3 style="margin:0 0 10px; font-size:20px; font-weight:700; color:#e8e8f0; letter-spacing:-0.03em;">3D Tilt Effect</h3>
          <p style="margin:0; font-size:13px; color:rgba(232,232,240,0.45); line-height:1.7;">
            Hover over this card to see the smooth 3D tilt with shine overlay. Move to any corner for full effect.
          </p>
        </div>
      </kayf-3d-tilt-card>
    </div>
  `,
};

export const Subtle: Story = {
  parameters: {
    docs: {
      description: { story: 'Low tilt angle and scale — suitable for content cards where subtle depth is preferred over dramatic effect.' },
    },
  },
  args: { 'max-tilt': 6, scale: 1.02, perspective: 1500, glow: '#8b5cf6' },
  render: (args) => html`
    <div style="display:flex; align-items:center; justify-content:center; padding:80px 60px;">
      <kayf-3d-tilt-card
        max-tilt=${args['max-tilt']}
        scale=${args.scale}
        perspective=${args.perspective}
        glow=${args.glow}
      >
        <div style="
          width:300px; padding:28px;
          background:rgba(255,255,255,0.04);
          border:1px solid rgba(255,255,255,0.08);
          border-radius:12px;
          font-family:'Segoe UI',system-ui,sans-serif;
        ">
          <h3 style="margin:0 0 8px; font-size:18px; font-weight:600; color:#e8e8f0;">Subtle Tilt</h3>
          <p style="margin:0; font-size:13px; color:rgba(232,232,240,0.4); line-height:1.6;">Low angle, soft depth. Great for content cards.</p>
        </div>
      </kayf-3d-tilt-card>
    </div>
  `,
};

export const Aggressive: Story = {
  parameters: {
    docs: {
      description: { story: 'Maximum tilt and scale — cinematic effect for hero cards, banners, or game items.' },
    },
  },
  args: { 'max-tilt': 25, scale: 1.1, perspective: 800, glow: '#00d4ff' },
  render: (args) => html`
    <div style="display:flex; align-items:center; justify-content:center; padding:80px 60px;">
      <kayf-3d-tilt-card
        max-tilt=${args['max-tilt']}
        scale=${args.scale}
        perspective=${args.perspective}
        glow=${args.glow}
      >
        <div style="
          width:300px; padding:28px;
          background:linear-gradient(135deg, rgba(0,30,50,0.9), rgba(0,10,20,0.95));
          border:1px solid rgba(0,212,255,0.25);
          border-radius:12px;
          font-family:'Segoe UI',system-ui,sans-serif;
        ">
          <div style="font-size:11px; letter-spacing:0.12em; color:rgba(0,212,255,0.7); text-transform:uppercase; margin-bottom:12px;">Aggressive</div>
          <h3 style="margin:0 0 8px; font-size:20px; font-weight:700; color:#e8e8f0; letter-spacing:-0.03em;">Max Tilt · 25°</h3>
          <p style="margin:0; font-size:13px; color:rgba(232,232,240,0.45); line-height:1.6;">High perspective warp with scale 1.1 on hover.</p>
        </div>
      </kayf-3d-tilt-card>
    </div>
  `,
};

export const GameCharacterCards: Story = {
  parameters: {
    docs: {
      description: { story: 'Trading card style layout — each card has its own glow color matching the character rarity.' },
    },
  },
  render: () => html`
    <div style="display:flex; gap:28px; flex-wrap:wrap; justify-content:center; padding:80px 40px;">

      <kayf-3d-tilt-card max-tilt="18" scale="1.06" glow="#ffd700">
        <div style="
          width:196px; padding:22px;
          background:linear-gradient(160deg, rgba(22,18,6,0.95), rgba(12,9,2,0.98));
          border:1px solid rgba(255,215,0,0.25);
          border-radius:12px; text-align:center;
          font-family:'Segoe UI',system-ui,sans-serif;
        ">
          <div style="font-size:44px; margin-bottom:12px; line-height:1;">⚔️</div>
          <div style="font-size:15px; font-weight:700; color:#ffd700; letter-spacing:-0.01em;">Warrior</div>
          <div style="font-size:11px; color:rgba(255,215,0,0.45); margin-top:3px; letter-spacing:0.06em; text-transform:uppercase;">Legendary</div>
          <div style="margin-top:18px; display:grid; grid-template-columns:1fr 1fr 1fr; gap:8px;">
            <div>
              <div style="font-size:17px; font-weight:700; color:#ff6600;">95</div>
              <div style="font-size:9px; color:rgba(232,232,240,0.3); text-transform:uppercase; letter-spacing:0.06em;">ATK</div>
            </div>
            <div>
              <div style="font-size:17px; font-weight:700; color:#00d4ff;">72</div>
              <div style="font-size:9px; color:rgba(232,232,240,0.3); text-transform:uppercase; letter-spacing:0.06em;">DEF</div>
            </div>
            <div>
              <div style="font-size:17px; font-weight:700; color:#00ff88;">88</div>
              <div style="font-size:9px; color:rgba(232,232,240,0.3); text-transform:uppercase; letter-spacing:0.06em;">SPD</div>
            </div>
          </div>
        </div>
      </kayf-3d-tilt-card>

      <kayf-3d-tilt-card max-tilt="18" scale="1.06" glow="#8b5cf6">
        <div style="
          width:196px; padding:22px;
          background:linear-gradient(160deg, rgba(16,10,28,0.95), rgba(8,5,18,0.98));
          border:1px solid rgba(139,92,246,0.25);
          border-radius:12px; text-align:center;
          font-family:'Segoe UI',system-ui,sans-serif;
        ">
          <div style="font-size:44px; margin-bottom:12px; line-height:1;">🔮</div>
          <div style="font-size:15px; font-weight:700; color:#8b5cf6; letter-spacing:-0.01em;">Mage</div>
          <div style="font-size:11px; color:rgba(139,92,246,0.45); margin-top:3px; letter-spacing:0.06em; text-transform:uppercase;">Epic</div>
          <div style="margin-top:18px; display:grid; grid-template-columns:1fr 1fr 1fr; gap:8px;">
            <div>
              <div style="font-size:17px; font-weight:700; color:#ff6600;">112</div>
              <div style="font-size:9px; color:rgba(232,232,240,0.3); text-transform:uppercase; letter-spacing:0.06em;">MGK</div>
            </div>
            <div>
              <div style="font-size:17px; font-weight:700; color:#00d4ff;">45</div>
              <div style="font-size:9px; color:rgba(232,232,240,0.3); text-transform:uppercase; letter-spacing:0.06em;">DEF</div>
            </div>
            <div>
              <div style="font-size:17px; font-weight:700; color:#00ff88;">63</div>
              <div style="font-size:9px; color:rgba(232,232,240,0.3); text-transform:uppercase; letter-spacing:0.06em;">SPD</div>
            </div>
          </div>
        </div>
      </kayf-3d-tilt-card>

      <kayf-3d-tilt-card max-tilt="18" scale="1.06" glow="#00ff88">
        <div style="
          width:196px; padding:22px;
          background:linear-gradient(160deg, rgba(5,20,12,0.95), rgba(2,10,6,0.98));
          border:1px solid rgba(0,255,136,0.25);
          border-radius:12px; text-align:center;
          font-family:'Segoe UI',system-ui,sans-serif;
        ">
          <div style="font-size:44px; margin-bottom:12px; line-height:1;">🏹</div>
          <div style="font-size:15px; font-weight:700; color:#00ff88; letter-spacing:-0.01em;">Ranger</div>
          <div style="font-size:11px; color:rgba(0,255,136,0.45); margin-top:3px; letter-spacing:0.06em; text-transform:uppercase;">Rare</div>
          <div style="margin-top:18px; display:grid; grid-template-columns:1fr 1fr 1fr; gap:8px;">
            <div>
              <div style="font-size:17px; font-weight:700; color:#ff6600;">78</div>
              <div style="font-size:9px; color:rgba(232,232,240,0.3); text-transform:uppercase; letter-spacing:0.06em;">ATK</div>
            </div>
            <div>
              <div style="font-size:17px; font-weight:700; color:#00d4ff;">60</div>
              <div style="font-size:9px; color:rgba(232,232,240,0.3); text-transform:uppercase; letter-spacing:0.06em;">DEF</div>
            </div>
            <div>
              <div style="font-size:17px; font-weight:700; color:#00ff88;">105</div>
              <div style="font-size:9px; color:rgba(232,232,240,0.3); text-transform:uppercase; letter-spacing:0.06em;">SPD</div>
            </div>
          </div>
        </div>
      </kayf-3d-tilt-card>

    </div>
  `,
};

export const ImageCard: Story = {
  parameters: {
    docs: {
      description: { story: 'Card with a visual header area and metadata tags — a common content card pattern.' },
    },
  },
  render: () => html`
    <div style="display:flex; align-items:center; justify-content:center; padding:80px 60px;">
      <kayf-3d-tilt-card max-tilt="18" scale="1.05" glow="#00d4ff">
        <div style="
          width:300px;
          background:rgba(8,10,18,0.95);
          border:1px solid rgba(0,212,255,0.15);
          border-radius:12px; overflow:hidden;
          font-family:'Segoe UI',system-ui,sans-serif;
        ">
          <div style="
            height:156px;
            background:linear-gradient(135deg, #081428 0%, #0d2244 50%, #060e1a 100%);
            display:flex; align-items:center; justify-content:center;
            font-size:56px; border-bottom:1px solid rgba(0,212,255,0.1);
          ">🌌</div>
          <div style="padding:18px;">
            <div style="font-size:16px; font-weight:700; color:#e8e8f0; letter-spacing:-0.02em; margin-bottom:6px;">
              Deep Space Module
            </div>
            <div style="font-size:13px; color:rgba(232,232,240,0.4); line-height:1.6; margin-bottom:14px;">
              Explore the void beyond the edge of the known universe.
            </div>
            <div style="display:flex; gap:8px; flex-wrap:wrap;">
              <span style="background:rgba(0,212,255,0.08); color:#00d4ff; border:1px solid rgba(0,212,255,0.25); padding:3px 10px; border-radius:4px; font-size:11px; letter-spacing:0.04em;">Space</span>
              <span style="background:rgba(139,92,246,0.08); color:#8b5cf6; border:1px solid rgba(139,92,246,0.25); padding:3px 10px; border-radius:4px; font-size:11px; letter-spacing:0.04em;">Sci-Fi</span>
              <span style="background:rgba(0,255,136,0.08); color:#00ff88; border:1px solid rgba(0,255,136,0.25); padding:3px 10px; border-radius:4px; font-size:11px; letter-spacing:0.04em;">New</span>
            </div>
          </div>
        </div>
      </kayf-3d-tilt-card>
    </div>
  `,
};