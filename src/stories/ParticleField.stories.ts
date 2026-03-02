import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';

const meta: Meta = {
  title: 'Components/ParticleField',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Interactive canvas particle system. Particles drift and connect with lines when nearby. Move your cursor over the canvas — particles repel from it.',
      },
    },
  },
  argTypes: {
    color:            { control: 'color',                                              description: 'Particle color (hex)',     defaultValue: '#6366f1' },
    count:            { control: { type: 'range', min: 20, max: 300, step: 10 },       description: 'Number of particles',      defaultValue: 100 },
    speed:            { control: { type: 'range', min: 0.1, max: 2, step: 0.1 },       description: 'Movement speed',           defaultValue: 0.4 },
    'connect-distance': { control: { type: 'range', min: 40, max: 200, step: 5 },      description: 'Max connection distance',  defaultValue: 100 },
  },
};
export default meta;
type Story = StoryObj;

export const Default: Story = {
  args: { color: '#6366f1', count: 100, speed: 0.4, 'connect-distance': 100 },
  render: (args) => html`
    <kayf-particle-field
      color=${args.color}
      count=${args.count}
      speed=${args.speed}
      connect-distance=${args['connect-distance']}
      style="display:block; width:100%; height:400px;"
    ></kayf-particle-field>
  `,
};

export const Cyan: Story = {
  render: () => html`
    <kayf-particle-field color="#06b6d4" count="80" speed="0.3" connect-distance="120"
      style="display:block; width:100%; height:400px;">
    </kayf-particle-field>
  `,
};

export const Dense: Story = {
  render: () => html`
    <kayf-particle-field color="#f472b6" count="220" speed="0.2" connect-distance="80"
      style="display:block; width:100%; height:400px;">
    </kayf-particle-field>
  `,
};

export const Fast: Story = {
  render: () => html`
    <kayf-particle-field color="#10b981" count="60" speed="1.5" connect-distance="60"
      style="display:block; width:100%; height:400px;">
    </kayf-particle-field>
  `,
};

export const AsBackground: Story = {
  render: () => html`
    <div style="position:relative; width:100%; height:400px; overflow:hidden;">
      <kayf-particle-field color="#6366f1" count="120" speed="0.3" connect-distance="110"
        style="position:absolute; inset:0; width:100%; height:100%;">
      </kayf-particle-field>
      <div style="position:relative; z-index:1; display:flex; align-items:center; justify-content:center; height:100%; font-family:'Segoe UI',sans-serif; text-align:center;">
        <div>
          <h2 style="margin:0 0 8px; font-size:32px; font-weight:800; color:#e8e8f0; letter-spacing:-0.04em;">Particle Background</h2>
          <p style="margin:0; font-size:14px; color:rgba(232,232,240,0.4);">Use as a section background</p>
        </div>
      </div>
    </div>
  `,
};
