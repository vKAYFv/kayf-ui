import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';

const meta: Meta = {
  title: 'Components/Counter',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'Animated number counter with easeOutExpo easing, triggered by IntersectionObserver when scrolled into view. Scroll down to trigger, or reload to replay.',
      },
    },
  },
  argTypes: {
    value:    { control: { type: 'number' },                                           description: 'Target value',           defaultValue: 98742 },
    label:    { control: 'text',                                                       description: 'Label text',             defaultValue: 'Active Users' },
    suffix:   { control: 'text',                                                       description: 'Suffix (e.g. +, ms, %)', defaultValue: '+' },
    prefix:   { control: 'text',                                                       description: 'Prefix (e.g. $)',        defaultValue: '' },
    decimals: { control: { type: 'range', min: 0, max: 3, step: 1 },                  description: 'Decimal places',         defaultValue: 0 },
    color:    { control: 'color',                                                      description: 'Accent color (hex)',     defaultValue: '#6366f1' },
    duration: { control: { type: 'range', min: 500, max: 5000, step: 100 },           description: 'Animation duration (ms)',defaultValue: 2000 },
  },
};
export default meta;
type Story = StoryObj;

export const Default: Story = {
  args: { value: 98742, label: 'Active Users', suffix: '+', prefix: '', decimals: 0, color: '#6366f1', duration: 2000 },
  render: (args) => html`
    <kayf-counter
      value=${args.value}
      label=${args.label}
      suffix=${args.suffix}
      prefix=${args.prefix}
      decimals=${args.decimals}
      color=${args.color}
      duration=${args.duration}
      icon="◎"
    ></kayf-counter>
  `,
};

export const Dashboard: Story = {
  render: () => html`
    <div style="display:flex; gap:16px; flex-wrap:wrap; justify-content:center;">
      <kayf-counter value="98742" suffix="+" label="Active Users" color="#6366f1" icon="◎" duration="2000"></kayf-counter>
      <kayf-counter value="4.9"   suffix=""  label="Avg Rating"   color="#f472b6" icon="◈" duration="1500" decimals="1"></kayf-counter>
      <kayf-counter value="127"   suffix="ms" label="Response Time" color="#06b6d4" icon="◇" duration="1200"></kayf-counter>
      <kayf-counter value="99.9"  suffix="%"  label="Uptime SLA"   color="#10b981" icon="◉" duration="1800" decimals="1"></kayf-counter>
    </div>
  `,
};

export const Revenue: Story = {
  render: () => html`
    <div style="display:flex; gap:16px; flex-wrap:wrap; justify-content:center;">
      <kayf-counter value="2400000" prefix="$" label="Total Revenue"   color="#10b981" icon="◎" duration="2500"></kayf-counter>
      <kayf-counter value="142"     suffix="k"  label="Customers"       color="#6366f1" icon="◈" duration="1800"></kayf-counter>
      <kayf-counter value="38"      suffix="%"  label="Growth YoY"      color="#f59e0b" icon="◑" duration="1400"></kayf-counter>
    </div>
  `,
};

export const Single: Story = {
  render: () => html`
    <kayf-counter value="500" suffix="+" label="Downloads" color="#f472b6" icon="◉" duration="1500"
      style="font-size:1.2em;">
    </kayf-counter>
  `,
};
