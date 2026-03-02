import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import '../../components/RippleGrid/RippleGrid';

const meta: Meta = {
  title: 'Components/RippleGrid',
  tags: ['autodocs'],
  render: (args) => html`
    <div style="padding:40px; background:#060810;">
      <kayf-ripple-grid
        color=${args.color}
        grid-size=${args['grid-size']}
        width=${args.width}
        height=${args.height}
        ?auto-ripple=${args['auto-ripple']}
      ></kayf-ripple-grid>
      <p style="margin:12px 0 0; color:rgba(255,255,255,0.3); font-size:12px;">
        Click or move the mouse over the grid to create ripples.
      </p>
    </div>
  `,
  argTypes: {
    color:        { control: 'color' },
    'grid-size':  { control: { type: 'range', min: 15, max: 60, step: 5 } },
    width:        { control: { type: 'range', min: 200, max: 800, step: 50 } },
    height:       { control: { type: 'range', min: 150, max: 500, step: 50 } },
    'auto-ripple':{ control: 'boolean' },
  },
  args: {
    color:         '#00d4ff',
    'grid-size':   30,
    width:         500,
    height:        350,
    'auto-ripple': false,
  },
};
export default meta;
type Story = StoryObj;

export const Default: Story = {};

export const AutoRipple: Story = {
  name: 'Auto Ripple',
  render: () => html`
    <div style="padding:40px; background:#060810;">
      <p style="color:rgba(255,255,255,0.4); font-size:13px; margin:0 0 16px;">
        Ripples fire automatically — no interaction needed.
      </p>
      <kayf-ripple-grid
        color="#00d4ff"
        grid-size="30"
        width="500"
        height="350"
        auto-ripple
      ></kayf-ripple-grid>
    </div>
  `,
};

export const ColorVariants: Story = {
  name: 'Color Variants',
  render: () => html`
    <div style="padding:40px; background:#060810; display:flex; gap:16px; flex-wrap:wrap;">
      <kayf-ripple-grid color="#00d4ff" width="240" height="180" auto-ripple></kayf-ripple-grid>
      <kayf-ripple-grid color="#8b5cf6" width="240" height="180" auto-ripple></kayf-ripple-grid>
      <kayf-ripple-grid color="#00ff88" width="240" height="180" auto-ripple></kayf-ripple-grid>
      <kayf-ripple-grid color="#ff3366" width="240" height="180" auto-ripple></kayf-ripple-grid>
    </div>
  `,
};

export const DenseGrid: Story = {
  name: 'Dense Grid',
  render: () => html`
    <div style="padding:40px; background:#060810;">
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
  name: 'As Background',
  render: () => html`
    <div style="padding:40px; background:#060810;">
      <div style="position:relative; display:inline-block; border-radius:12px; overflow:hidden;">
        <kayf-ripple-grid
          color="#8b5cf6"
          width="420"
          height="260"
          auto-ripple
          style="display:block;"
        ></kayf-ripple-grid>
        <div style="
          position:absolute; inset:0;
          display:flex; flex-direction:column;
          align-items:center; justify-content:center;
          gap:8px;
        ">
          <div style="color:#fff; font-size:22px; font-weight:700; text-shadow:0 0 20px #8b5cf6;">
            Player Ready
          </div>
          <div style="color:rgba(255,255,255,0.5); font-size:13px;">Click to begin</div>
        </div>
      </div>
    </div>
  `,
};
