import type { Meta, StoryObj } from '@storybook/web-components-vite'
import { html } from 'lit'
import { ifDefined } from 'lit/directives/if-defined.js'
import { phoneCountries } from '../components/PhoneInput/PhoneInput'

const styles = html`
  <style>
    .phone-stage, .phone-stage * { box-sizing: border-box; }
    .phone-stage { display:grid; width:min(820px,100%); min-height:460px; padding:clamp(28px,7vw,72px); place-items:center; border:1px solid rgba(255,255,255,.07); border-radius:26px; background:radial-gradient(circle at 15% 10%,rgba(98,218,247,.09),transparent 34%),linear-gradient(145deg,#0d0e13,#07070a 72%); font-family:Inter,system-ui,sans-serif; }
    .phone-demo { width:min(480px,100%); }
    .phone-output { display:grid; grid-template-columns:repeat(3,1fr); gap:8px; margin-top:18px; }
    .phone-output div { padding:11px; border:1px solid rgba(255,255,255,.06); border-radius:11px; background:rgba(255,255,255,.02); }
    .phone-output span,.phone-output strong { display:block; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
    .phone-output span { margin-bottom:5px; color:rgba(228,228,231,.32); font:8px/1 ui-monospace,monospace; letter-spacing:.1em; text-transform:uppercase; }
    .phone-output strong { color:rgba(244,244,247,.7); font:550 10px/1.3 ui-monospace,monospace; }
    .phone-grid { display:grid; width:100%; gap:18px; }
    .checkout { display:grid; width:min(720px,100%); grid-template-columns:1fr 1fr; gap:24px; align-items:start; }
    .checkout-copy { padding-top:14px; }
    .checkout-copy p { margin:0 0 8px; color:#62daf7; font:650 9px/1 ui-monospace,monospace; letter-spacing:.14em; text-transform:uppercase; }
    .checkout-copy h3 { margin:0 0 11px; color:#f4f4f7; font-size:28px; letter-spacing:-.04em; }
    .checkout-copy span { color:rgba(228,228,231,.45); font-size:12px; line-height:1.6; }
    @media(max-width:620px){.checkout{grid-template-columns:1fr}.phone-output{grid-template-columns:1fr}}
  </style>
`

const updateOutput = (event: Event): void => {
  const detail = (event as CustomEvent).detail
  const root = (event.currentTarget as HTMLElement).nextElementSibling
  if (!root || !detail) return
  root.querySelector('[data-e164]')!.textContent = detail.e164 || '—'
  root.querySelector('[data-country]')!.textContent = `${detail.country} · ${detail.dialCode}`
  root.querySelector('[data-valid]')!.textContent = detail.valid ? 'Ready' : 'Incomplete'
}

const meta: Meta = {
  title: 'Components/PhoneInput',
  component: 'kayf-phone-input',
  tags: ['autodocs'],
  parameters: { docs: { description: { component: '`<kayf-phone-input>` covers all 245 countries and territories with assigned geographical calling codes. It combines native autofill, country selection, live formatting, automatic detection from pasted calling codes, and E.164 output through composed events.' } } },
  argTypes: {
    country: { control: 'select', options: phoneCountries.map(country => country.code), description: 'ISO country or territory used for calling code and formatting', table: { defaultValue: { summary: 'US' } } },
    value: { control: 'text', description: 'Initial or controlled international phone value' },
    label: { control: 'text', description: 'Visible field label', table: { defaultValue: { summary: 'Phone number' } } },
    placeholder: { control: 'text', description: 'Custom placeholder; defaults to the selected country example' },
    hint: { control: 'text', description: 'Supporting text below the control' },
    error: { control: 'text', description: 'Error message and invalid visual state' },
    color: { control: 'select', options: ['cyan','violet','emerald','amber','red','white'], description: 'Focus and hover accent', table: { defaultValue: { summary: 'cyan' } } },
    disabled: { control: 'boolean', description: 'Disable country and number controls', table: { defaultValue: { summary: 'false' } } },
    required: { control: 'boolean', description: 'Expose required native input semantics', table: { defaultValue: { summary: 'false' } } },
    name: { control: 'text', description: 'Native input name used by forms', table: { defaultValue: { summary: 'phone' } } },
  },
}

export default meta
type Story = StoryObj

export const Default: Story = {
  args: { country:'DE', value:'', label:'Phone number', placeholder:'', hint:'Used only for delivery updates', error:'', color:'cyan', disabled:false, required:true, name:'phone' },
  render: args => html`
    ${styles}
    <section class="phone-stage">
      <div class="phone-demo">
        <kayf-phone-input country=${args.country} value=${args.value} label=${args.label} placeholder=${ifDefined(args.placeholder || undefined)} hint=${args.hint} error=${args.error} color=${args.color} name=${args.name} ?disabled=${args.disabled} ?required=${args.required} @kayf-input=${updateOutput}></kayf-phone-input>
        <div class="phone-output" aria-live="polite">
          <div><span>E.164</span><strong data-e164>—</strong></div>
          <div><span>Country</span><strong data-country>DE · +49</strong></div>
          <div><span>Status</span><strong data-valid>Incomplete</strong></div>
        </div>
      </div>
    </section>
  `,
}

export const CallingCodeDetection: Story = {
  parameters: { docs: { description: { story: 'Pasting an international value detects the longest matching calling code and synchronizes the selected country automatically.' } } },
  render: () => html`${styles}<section class="phone-stage"><div class="phone-demo"><kayf-phone-input country="US" value="+380671234567" label="Contact number" hint="Detected from the +380 calling code" color="violet"></kayf-phone-input></div></section>`,
}

export const GlobalCoverage: Story = {
  parameters: { docs: { description: { story: 'The selector includes every geographical region from the embedded metadata snapshot—not only the most common markets.' } } },
  render: () => html`${styles}<section class="phone-stage"><div class="phone-grid"><kayf-phone-input country="AC" label="Ascension Island" color="cyan"></kayf-phone-input><kayf-phone-input country="XK" label="Kosovo" color="violet"></kayf-phone-input><kayf-phone-input country="FJ" label="Fiji" color="emerald"></kayf-phone-input></div></section>`,
}

export const States: Story = {
  render: () => html`${styles}<section class="phone-stage"><div class="phone-grid"><kayf-phone-input country="GB" value="+447700900123" label="Ready" color="emerald"></kayf-phone-input><kayf-phone-input country="US" value="+1415" label="Needs attention" error="Enter a complete US phone number." color="red"></kayf-phone-input><kayf-phone-input country="UA" label="Unavailable" disabled></kayf-phone-input></div></section>`,
}

export const CheckoutContact: Story = {
  render: () => html`${styles}<section class="phone-stage"><div class="checkout"><div class="checkout-copy"><p>Shipping contact</p><h3>Where can the courier reach you?</h3><span>Country-aware formatting reduces errors without hiding the international number that will be submitted.</span></div><kayf-phone-input country="PL" label="Mobile number" hint="We will send one delivery update." required color="violet"></kayf-phone-input></div></section>`,
}
