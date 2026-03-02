import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';

const meta: Meta = {
  title: 'Components/TypewriterText',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'Typewriter effect component with organic character jitter, multi-line cycling, and configurable speed. Use the `lines` attribute with `|` separator for multiple phrases.',
      },
    },
  },
  argTypes: {
    lines:         { control: 'text',                                              description: 'Pipe-separated lines to cycle through' },
    speed:         { control: { type: 'range', min: 20, max: 200, step: 10 },     description: 'Typing speed (ms per char)', defaultValue: 60 },
    'erase-speed': { control: { type: 'range', min: 10, max: 100, step: 5 },      description: 'Erase speed (ms per char)',  defaultValue: 30 },
    pause:         { control: { type: 'range', min: 500, max: 5000, step: 100 },  description: 'Pause after complete (ms)', defaultValue: 1800 },
    delay:         { control: { type: 'range', min: 0, max: 2000, step: 100 },    description: 'Initial delay (ms)',        defaultValue: 500 },
    loop:          { control: 'boolean',                                           description: 'Loop through lines',        defaultValue: true },
  },
};
export default meta;

type Story = StoryObj;

export const Default: Story = {
  args: {
    lines: 'Premium Web Components|Dark Glassmorphism 2.0|Zero Dependencies|TypeScript First',
    speed: 60,
    'erase-speed': 30,
    pause: 1800,
    loop: true,
  },
  render: (args) => html`
    <div style="font-family:'Segoe UI',system-ui,sans-serif; font-size:28px; font-weight:700; color:#e8e8f0; letter-spacing:-0.03em;">
      <kayf-typewriter
        lines=${args.lines}
        speed=${args.speed}
        erase-speed=${args['erase-speed']}
        pause=${args.pause}
        delay="300"
        loop
      ></kayf-typewriter>
    </div>
  `,
};

export const HeroHeadline: Story = {
  render: () => html`
    <div style="text-align:center; padding:40px;">
      <p style="font-family:'Courier New',monospace; font-size:11px; color:#6366f1; letter-spacing:0.2em; text-transform:uppercase; margin:0 0 16px;">@kayf/ui</p>
      <h1 style="font-family:'Segoe UI',sans-serif; font-size:42px; font-weight:800; color:#e8e8f0; letter-spacing:-0.04em; margin:0; line-height:1.1;">
        Build interfaces<br>that feel
        <span style="background:linear-gradient(135deg,#6366f1,#06b6d4); -webkit-background-clip:text; -webkit-text-fill-color:transparent;">
          <kayf-typewriter
            lines="alive.|premium.|different.|unforgettable."
            speed="80"
            erase-speed="40"
            pause="2000"
            loop
          ></kayf-typewriter>
        </span>
      </h1>
    </div>
  `,
};

export const Terminal: Story = {
  render: () => html`
    <div style="font-family:'Courier New',monospace; font-size:14px; color:#10b981; background:#050508; padding:24px 28px; border-radius:12px; border:1px solid rgba(255,255,255,0.06); min-width:400px;">
      <div style="color:rgba(255,255,255,0.3); margin-bottom:12px; font-size:11px;">$ kayf-ui --status</div>
      <kayf-typewriter
        lines="Initializing components...|Loading design tokens...|Shadow DOM ready.|All systems operational."
        speed="45"
        erase-speed="20"
        pause="1500"
        loop
      ></kayf-typewriter>
    </div>
  `,
};

export const SingleLine: Story = {
  args: { loop: false, speed: 70 },
  render: (args) => html`
    <div style="font-family:'Segoe UI',sans-serif; font-size:20px; color:#e8e8f0;">
      <kayf-typewriter
        speed=${args.speed}
        delay="300"
      >Hello, @kayf/ui ✦</kayf-typewriter>
    </div>
  `,
};
