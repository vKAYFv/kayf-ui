import type { Meta, StoryObj } from '@storybook/web-components-vite'
import { html } from 'lit'
import { expect } from 'storybook/test'
import { VerificationCode } from '../components/VerificationCode/VerificationCode'
import { workflowStyles } from './workflowStyles'

const meta: Meta = {
  title: 'Components/VerificationCode', component: 'kayf-verification-code', tags: ['autodocs'],
  parameters: { docs: { description: { component: 'A segmented verification field powered by one native input. Supports numeric paste, SMS autofill, selection, Backspace, disabled fieldsets, form reset and native FormData via `name`. `kayf-input` / `kayf-change` emit `{ value, complete }`; `kayf-complete` fires when an edit fills the code. Completion means all digits are present; your service verifies them. Parts: `control`, `input`, `cell`. `value` sets the default/reset value; typing updates the property without reflecting sensitive codes into HTML.' } } },
  argTypes: {
    length: { control: { type: 'number', min: 4, max: 8 }, description: 'Digit count, clamped to 4–8. Default: 6.' },
    label: { control: 'text' }, hint: { control: 'text' }, error: { control: 'text', description: 'Server error; marks the field invalid.' },
    color: { control: 'select', options: ['violet', 'cyan', 'emerald', 'amber', 'red', 'white'] },
    disabled: { control: 'boolean' }, required: { control: 'boolean' }, value: { control: 'text' },
    name: { control: 'text', description: 'Key included in the parent form’s FormData.' },
  },
}
export default meta
type Story = StoryObj

export const Default: Story = {
  args: { length: 6, label: 'Verification code', hint: 'Enter the 6-digit code sent to your device.', color: 'violet', error: '', disabled: false, required: true, value: '', name: 'code' },
  render: args => html`${workflowStyles}<section class="workflow-stage"><div class="workflow-stack"><div><span class="eyebrow">A small step. A safer workspace.</span><h2>Keep your account yours.</h2><p class="lead">A familiar interaction with room to breathe. Paste the full code or enter it one digit at a time.</p><kayf-verification-code length=${args.length} label=${args.label} hint=${args.hint} color=${args.color} error=${args.error} ?disabled=${args.disabled} ?required=${args.required} value=${args.value} name=${args.name} @kayf-input=${(event: CustomEvent) => {
    const output = (event.currentTarget as HTMLElement).nextElementSibling!
    output.textContent = event.detail.complete ? 'Code complete — ready for your verification service.' : 'Waiting for all digits…'
  }}></kayf-verification-code><p class="feedback" role="status">Waiting for all digits…</p></div></div></section>`,
}
export const States: Story = {
  render: () => html`${workflowStyles}<section class="workflow-stage"><div class="workflow-stack"><kayf-verification-code value="123456" label="Ready to verify" color="emerald"></kayf-verification-code><kayf-verification-code value="1234" length="4" label="Try again" error="This code has expired. Request a new one."></kayf-verification-code><kayf-verification-code value="123456" label="Checking your code" hint="Please wait while your service verifies the code." disabled></kayf-verification-code></div></section>`,
}
export const NativeForm: Story = {
  render: () => html`${workflowStyles}<section class="workflow-stage"><form class="workflow-stack" @submit=${(event: SubmitEvent) => {
    event.preventDefault()
    const form = event.currentTarget as HTMLFormElement
    form.querySelector('.feedback')!.textContent = new FormData(form).has('verification') ? 'Verification value included in FormData.' : 'No value provided.'
  }}><div><span class="eyebrow">Native form participation</span><h2>One field. Every digit.</h2></div><kayf-verification-code name="verification" required></kayf-verification-code><div><div class="demo-actions"><button class="demo-button" type="submit">Verify code</button><button class="demo-button" type="reset">Reset</button></div><p class="feedback" role="status">No request is sent by this demo.</p></div></form></section>`,
}
export const KeyboardEntry: Story = {
  ...Default,
  play: async ({ canvasElement, userEvent }) => {
    const component = canvasElement.querySelector<VerificationCode>('kayf-verification-code')!
    const input = component.shadowRoot!.querySelector('input')!
    await userEvent.type(input, '12a3456')
    await expect(component.value).toBe('123456')
    await expect(component.complete).toBe(true)
    await userEvent.keyboard('{Backspace}')
    await expect(component.value).toBe('12345')
  },
}
