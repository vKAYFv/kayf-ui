import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';

const meta: Meta = {
  title: 'Components/MagneticButton',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'A wrapper that applies a magnetic pull effect to any slotted element. Move your cursor near the element — it will be attracted toward the cursor with a physics-based lerp spring.',
      },
    },
  },
  argTypes: {
    strength: { control: { type: 'range', min: 0, max: 1, step: 0.05 }, description: 'Pull strength 0–1',          defaultValue: 0.4 },
    radius:   { control: { type: 'range', min: 0.5, max: 4, step: 0.1 }, description: 'Effect radius (× size)',    defaultValue: 1.5 },
  },
};
export default meta;
type Story = StoryObj;

const btnStyle = `
  padding: 14px 36px;
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  border: none;
  border-radius: 100px;
  font-family: 'Segoe UI', system-ui, sans-serif;
  font-size: 15px;
  font-weight: 600;
  color: white;
  cursor: pointer;
  letter-spacing: -0.01em;
  box-shadow: 0 0 20px rgba(99,102,241,0.3);
`;

export const Default: Story = {
  args: { strength: 0.4, radius: 1.5 },
  render: (args) => html`
    <div style="padding:60px; display:flex; justify-content:center;">
      <kayf-magnetic-btn strength=${args.strength} radius=${args.radius}>
        <button style=${btnStyle}>◈ Hover Near Me</button>
      </kayf-magnetic-btn>
    </div>
  `,
};

export const Strong: Story = {
  args: { strength: 0.8, radius: 2.5 },
  render: (args) => html`
    <div style="padding:80px; display:flex; justify-content:center;">
      <kayf-magnetic-btn strength=${args.strength} radius=${args.radius}>
        <button style="padding:14px 36px; background:linear-gradient(135deg,#f472b6,#ec4899); border:none; border-radius:100px; font-family:'Segoe UI',sans-serif; font-size:15px; font-weight:600; color:white; cursor:pointer; box-shadow:0 0 20px rgba(244,114,182,0.35);">
          ◉ Strong Pull
        </button>
      </kayf-magnetic-btn>
    </div>
  `,
};

export const MultipleButtons: Story = {
  render: () => html`
    <div style="padding:60px; display:flex; gap:40px; justify-content:center; flex-wrap:wrap;">
      <kayf-magnetic-btn strength="0.4" radius="1.5">
        <button style="padding:14px 32px; background:linear-gradient(135deg,#6366f1,#8b5cf6); border:none; border-radius:100px; font-family:'Segoe UI',sans-serif; font-size:14px; font-weight:600; color:white; cursor:pointer;">
          ◈ Get Started
        </button>
      </kayf-magnetic-btn>
      <kayf-magnetic-btn strength="0.4" radius="1.5">
        <button style="padding:14px 32px; background:rgba(255,255,255,0.06); border:1px solid rgba(255,255,255,0.12); border-radius:100px; font-family:'Segoe UI',sans-serif; font-size:14px; font-weight:600; color:#e8e8f0; cursor:pointer; backdrop-filter:blur(10px);">
          ◇ Learn More
        </button>
      </kayf-magnetic-btn>
      <kayf-magnetic-btn strength="0.4" radius="1.5">
        <button style="padding:14px 32px; background:linear-gradient(135deg,#06b6d4,#0891b2); border:none; border-radius:100px; font-family:'Segoe UI',sans-serif; font-size:14px; font-weight:600; color:white; cursor:pointer;">
          ◉ Contact
        </button>
      </kayf-magnetic-btn>
    </div>
  `,
};

export const WrapAnything: Story = {
  render: () => html`
    <div style="display:flex; gap:48px; justify-content:center; align-items:center; flex-wrap:wrap; padding:40px;">
      <!-- Wrap a card -->
      <kayf-magnetic-btn strength="0.25" radius="1.2">
        <div style="padding:24px 28px; background:rgba(255,255,255,0.04); border:1px solid rgba(255,255,255,0.08); border-radius:16px; font-family:'Segoe UI',sans-serif; text-align:center; cursor:pointer; width:140px;">
          <div style="font-size:24px; margin-bottom:8px;">◈</div>
          <div style="font-size:13px; font-weight:600; color:#e8e8f0;">Any Element</div>
          <div style="font-size:11px; color:rgba(232,232,240,0.3); margin-top:4px;">works too</div>
        </div>
      </kayf-magnetic-btn>
      <!-- Wrap an icon -->
      <kayf-magnetic-btn strength="0.6" radius="2">
        <div style="width:64px; height:64px; background:linear-gradient(135deg,#6366f1,#06b6d4); border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:24px; cursor:pointer; box-shadow:0 0 30px rgba(99,102,241,0.4);">◎</div>
      </kayf-magnetic-btn>
    </div>
  `,
};
