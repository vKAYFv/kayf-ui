import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import '../components/RippleGrid/RippleGrid';

const meta: Meta = {
  title: 'Components/RippleGrid',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Interactive Canvas 2D dot-matrix grid. Click anywhere to fire a radial ripple wave — dots light up as the wave passes through them. Hovering also emits small ambient ripples. Supports auto-ripple mode for unattended displays.',
      },
    },
  },
  argTypes: {
    color:         { control: 'color',                                                  description: 'Dot & ripple color (hex)', defaultValue: '#00d4ff' },
    'grid-size':   { control: { type: 'range', min: 15, max: 60, step: 5 },             description: 'Dot spacing in px',       defaultValue: 30 },
    width:         { control: { type: 'range', min: 200, max: 800, step: 50 },          description: 'Canvas width in px',      defaultValue: 500 },
    height:        { control: { type: 'range', min: 150, max: 500, step: 50 },          description: 'Canvas height in px',     defaultValue: 350 },
    'auto-ripple': { control: 'boolean',                                                description: 'Fire ripples automatically every 800ms', defaultValue: false },
  },
};
export default meta;
type Story = StoryObj;

export const Default: Story = {
  args: { color: '#00d4ff', 'grid-size': 30, width: 500, height: 350, 'auto-ripple': false },
  render: (args) => html`
    <div style="display:flex; flex-direction:column; align-items:center; padding:40px; gap:12px;">
      <kayf-ripple-grid
        color=${args.color}
        grid-size=${args['grid-size']}
        width=${args.width}
        height=${args.height}
        ?auto-ripple=${args['auto-ripple']}
      ></kayf-ripple-grid>
      <p style="margin:0; font-size:12px; color:rgba(255,255,255,0.25); font-family:'Segoe UI',sans-serif;">
        Click or hover the grid to trigger ripples
      </p>
    </div>
  `,
};

export const AutoRipple: Story = {
  parameters: {
    docs: {
      description: { story: 'Auto-ripple mode fires waves at random positions every 800ms — ideal for ambient backgrounds or idle screens.' },
    },
  },
  render: () => html`
    <div style="display:flex; flex-direction:column; align-items:center; padding:40px; gap:12px;">
      <kayf-ripple-grid
        color="#00d4ff"
        grid-size="30"
        width="500"
        height="350"
        auto-ripple
      ></kayf-ripple-grid>
      <p style="margin:0; font-size:12px; color:rgba(255,255,255,0.25); font-family:'Segoe UI',sans-serif;">
        Auto-ripple — no interaction required
      </p>
    </div>
  `,
};

export const ColorVariants: Story = {
  parameters: {
    docs: {
      description: { story: 'Four color presets running in auto-ripple mode.' },
    },
  },
  render: () => html`
    <div style="display:flex; gap:16px; flex-wrap:wrap; padding:40px; justify-content:center;">
      <kayf-ripple-grid color="#00d4ff" width="240" height="180" auto-ripple></kayf-ripple-grid>
      <kayf-ripple-grid color="#8b5cf6" width="240" height="180" auto-ripple></kayf-ripple-grid>
      <kayf-ripple-grid color="#00ff88" width="240" height="180" auto-ripple></kayf-ripple-grid>
      <kayf-ripple-grid color="#ff3366" width="240" height="180" auto-ripple></kayf-ripple-grid>
    </div>
  `,
};

export const DenseGrid: Story = {
  parameters: {
    docs: {
      description: { story: 'Dense 15px grid — more dots, finer ripple detail.' },
    },
  },
  render: () => html`
    <div style="display:flex; flex-direction:column; align-items:center; padding:40px; gap:12px;">
      <kayf-ripple-grid
        color="#ff3366"
        grid-size="15"
        width="500"
        height="350"
        auto-ripple
      ></kayf-ripple-grid>
    </div>
  `,
};

export const AsBackground: Story = {
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: { story: 'RippleGrid used as an interactive background with overlay content — e.g. a game lobby screen.' },
    },
  },
  render: () => html`
    <div style="display:flex; align-items:center; justify-content:center; padding:40px;">
      <div style="position:relative; display:inline-block; border-radius:12px; overflow:hidden;">
        <kayf-ripple-grid
          color="#8b5cf6"
          width="480"
          height="280"
          auto-ripple
          style="display:block;"
        ></kayf-ripple-grid>
        <div style="
          position:absolute; inset:0;
          display:flex; flex-direction:column;
          align-items:center; justify-content:center;
          gap:10px;
          background:rgba(6,8,14,0.45);
        ">
          <div style="font-family:'Segoe UI',sans-serif; font-size:24px; font-weight:800; color:#e8e8f0; letter-spacing:-0.03em; text-shadow:0 0 30px rgba(139,92,246,0.8);">
            Game Lobby
          </div>
          <div style="font-family:'Segoe UI',sans-serif; font-size:13px; color:rgba(232,232,240,0.4);">
            Waiting for players…
          </div>
          <div style="display:flex; gap:8px; margin-top:4px;">
            ${[1,2,3,4].map(i => html`
              <div style="
                width:10px; height:10px; border-radius:50%;
                background:${i <= 3 ? '#8b5cf6' : 'rgba(255,255,255,0.1)'};
                box-shadow:${i <= 3 ? '0 0 8px #8b5cf6' : 'none'};
              "></div>
            `)}
          </div>
        </div>
      </div>
    </div>
  `,
};