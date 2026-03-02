import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import '../components/TiltCard3D/TiltCard3D';

const meta: Meta = {
  title: 'Components/TiltCard3D',
  tags: ['autodocs'],
  render: (args) => html`
    <div style="padding:60px; background:#060810; display:flex; justify-content:center;">
      <kayf-3d-tilt-card
        max-tilt=${args['max-tilt']}
        scale=${args.scale}
        perspective=${args.perspective}
        glow=${args.glow}
      >
        <div style="
          width:280px; padding:24px;
          background:rgba(255,255,255,0.04);
          border:1px solid rgba(255,255,255,0.1);
          border-radius:12px;
        ">
          <div style="color:rgba(0,212,255,0.8); font-size:12px; letter-spacing:0.1em; text-transform:uppercase; margin-bottom:12px;">
            Premium Card
          </div>
          <h3 style="color:#fff; margin:0 0 8px; font-size:20px; font-weight:600;">3D Tilt Effect</h3>
          <p style="color:rgba(255,255,255,0.5); font-size:13px; margin:0; line-height:1.6;">
            Hover over this card to see the smooth 3D tilt with shine overlay.
          </p>
        </div>
      </kayf-3d-tilt-card>
    </div>
  `,
  argTypes: {
    'max-tilt':  { control: { type: 'range', min: 5, max: 30, step: 1 } },
    scale:       { control: { type: 'range', min: 1.0, max: 1.15, step: 0.01 } },
    perspective: { control: { type: 'range', min: 500, max: 2000, step: 100 } },
    glow:        { control: 'color' },
  },
  args: {
    'max-tilt':  15,
    scale:       1.05,
    perspective: 1000,
    glow:        '#ffffff',
  },
};
export default meta;
type Story = StoryObj;

export const Default: Story = {};

export const AggressiveTilt: Story = {
  name: 'Aggressive Tilt',
  args: { 'max-tilt': 25, scale: 1.08, glow: '#00d4ff' },
};

export const SubtleTilt: Story = {
  name: 'Subtle Tilt',
  args: { 'max-tilt': 6, scale: 1.02, perspective: 1500, glow: '#8b5cf6' },
};

export const GameCharacterCards: Story = {
  name: 'Game Character Cards',
  render: () => html`
    <div style="padding:60px; background:#060810; display:flex; gap:32px; justify-content:center; flex-wrap:wrap;">

      <kayf-3d-tilt-card max-tilt="18" scale="1.06" glow="#ffd700">
        <div style="
          width:200px; padding:20px;
          background:linear-gradient(135deg, rgba(20,16,5,0.9), rgba(10,8,2,0.95));
          border:1px solid rgba(255,215,0,0.3);
          border-radius:12px; text-align:center;
        ">
          <div style="font-size:48px; margin-bottom:12px;">⚔️</div>
          <div style="color:#ffd700; font-size:16px; font-weight:700;">Warrior</div>
          <div style="color:rgba(255,255,255,0.4); font-size:12px; margin-top:4px;">Legendary</div>
          <div style="margin-top:16px; display:flex; justify-content:space-between;">
            <div style="text-align:center;">
              <div style="color:#ff6600; font-size:18px; font-weight:700;">95</div>
              <div style="color:rgba(255,255,255,0.3); font-size:10px;">ATK</div>
            </div>
            <div style="text-align:center;">
              <div style="color:#00d4ff; font-size:18px; font-weight:700;">72</div>
              <div style="color:rgba(255,255,255,0.3); font-size:10px;">DEF</div>
            </div>
            <div style="text-align:center;">
              <div style="color:#00ff88; font-size:18px; font-weight:700;">88</div>
              <div style="color:rgba(255,255,255,0.3); font-size:10px;">SPD</div>
            </div>
          </div>
        </div>
      </kayf-3d-tilt-card>

      <kayf-3d-tilt-card max-tilt="18" scale="1.06" glow="#8b5cf6">
        <div style="
          width:200px; padding:20px;
          background:linear-gradient(135deg, rgba(15,10,25,0.9), rgba(8,5,18,0.95));
          border:1px solid rgba(139,92,246,0.3);
          border-radius:12px; text-align:center;
        ">
          <div style="font-size:48px; margin-bottom:12px;">🔮</div>
          <div style="color:#8b5cf6; font-size:16px; font-weight:700;">Mage</div>
          <div style="color:rgba(255,255,255,0.4); font-size:12px; margin-top:4px;">Epic</div>
          <div style="margin-top:16px; display:flex; justify-content:space-between;">
            <div style="text-align:center;">
              <div style="color:#ff6600; font-size:18px; font-weight:700;">112</div>
              <div style="color:rgba(255,255,255,0.3); font-size:10px;">MGK</div>
            </div>
            <div style="text-align:center;">
              <div style="color:#00d4ff; font-size:18px; font-weight:700;">45</div>
              <div style="color:rgba(255,255,255,0.3); font-size:10px;">DEF</div>
            </div>
            <div style="text-align:center;">
              <div style="color:#00ff88; font-size:18px; font-weight:700;">63</div>
              <div style="color:rgba(255,255,255,0.3); font-size:10px;">SPD</div>
            </div>
          </div>
        </div>
      </kayf-3d-tilt-card>

      <kayf-3d-tilt-card max-tilt="18" scale="1.06" glow="#00ff88">
        <div style="
          width:200px; padding:20px;
          background:linear-gradient(135deg, rgba(5,20,12,0.9), rgba(2,10,6,0.95));
          border:1px solid rgba(0,255,136,0.3);
          border-radius:12px; text-align:center;
        ">
          <div style="font-size:48px; margin-bottom:12px;">🏹</div>
          <div style="color:#00ff88; font-size:16px; font-weight:700;">Ranger</div>
          <div style="color:rgba(255,255,255,0.4); font-size:12px; margin-top:4px;">Rare</div>
          <div style="margin-top:16px; display:flex; justify-content:space-between;">
            <div style="text-align:center;">
              <div style="color:#ff6600; font-size:18px; font-weight:700;">78</div>
              <div style="color:rgba(255,255,255,0.3); font-size:10px;">ATK</div>
            </div>
            <div style="text-align:center;">
              <div style="color:#00d4ff; font-size:18px; font-weight:700;">60</div>
              <div style="color:rgba(255,255,255,0.3); font-size:10px;">DEF</div>
            </div>
            <div style="text-align:center;">
              <div style="color:#00ff88; font-size:18px; font-weight:700;">105</div>
              <div style="color:rgba(255,255,255,0.3); font-size:10px;">SPD</div>
            </div>
          </div>
        </div>
      </kayf-3d-tilt-card>

    </div>
  `,
};

export const ImageCard: Story = {
  name: 'Image Card',
  render: () => html`
    <div style="padding:60px; background:#060810; display:flex; justify-content:center;">
      <kayf-3d-tilt-card max-tilt="20" scale="1.05" glow="#00d4ff">
        <div style="
          width:280px;
          background:rgba(10,12,20,0.9);
          border:1px solid rgba(0,212,255,0.2);
          border-radius:12px; overflow:hidden;
        ">
          <div style="
            height:160px;
            background:linear-gradient(135deg, #0a1628, #0d2244, #061420);
            display:flex; align-items:center; justify-content:center;
            font-size:56px;
          ">🌌</div>
          <div style="padding:16px;">
            <div style="color:#fff; font-weight:600; margin-bottom:6px;">Deep Space Module</div>
            <div style="color:rgba(255,255,255,0.4); font-size:13px; line-height:1.5;">
              Explore the void beyond the edge of the known universe.
            </div>
            <div style="margin-top:12px; display:flex; gap:8px;">
              <span style="background:rgba(0,212,255,0.1); color:#00d4ff; border:1px solid rgba(0,212,255,0.3); padding:3px 8px; border-radius:4px; font-size:11px;">Space</span>
              <span style="background:rgba(139,92,246,0.1); color:#8b5cf6; border:1px solid rgba(139,92,246,0.3); padding:3px 8px; border-radius:4px; font-size:11px;">Sci-Fi</span>
            </div>
          </div>
        </div>
      </kayf-3d-tilt-card>
    </div>
  `,
};
