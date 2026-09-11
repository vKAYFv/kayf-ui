import type { Meta, StoryObj } from '@storybook/web-components-vite'
import { html } from 'lit'
import { ifDefined } from 'lit/directives/if-defined.js'
import '../components/AuthForm/AuthForm'

const styles = html`
  <style>
    .auth-stage,.auth-stage *{box-sizing:border-box}.auth-stage{display:grid;width:min(940px,100%);min-height:700px;padding:clamp(24px,6vw,64px);place-items:center;border:1px solid rgba(255,255,255,.07);border-radius:28px;background:radial-gradient(circle at 12% 5%,rgba(98,218,247,.07),transparent 32%),radial-gradient(circle at 90% 0%,rgba(139,124,255,.1),transparent 38%),#07070a;font-family:Inter,system-ui,sans-serif}.auth-feedback{min-height:18px;margin:16px 0 0;color:rgba(228,228,231,.42);font:10px/1.4 ui-monospace,monospace;text-align:center}.auth-product{display:grid;width:min(960px,100%);grid-template-columns:1fr minmax(360px,440px);gap:clamp(35px,8vw,90px);align-items:center}.auth-pitch{padding:20px}.auth-pitch>span{color:#9e94ff;font:650 9px/1 ui-monospace,monospace;letter-spacing:.15em;text-transform:uppercase}.auth-pitch h3{max-width:470px;margin:18px 0;color:#f4f4f7;font-size:clamp(40px,6vw,67px);line-height:.94;letter-spacing:-.06em}.auth-pitch p{max-width:430px;margin:0;color:rgba(228,228,231,.46);font-size:14px;line-height:1.65}.auth-points{display:grid;gap:9px;margin-top:32px}.auth-points div{display:flex;align-items:center;gap:9px;color:rgba(228,228,231,.55);font-size:11px}.auth-points i{width:5px;height:5px;border-radius:50%;background:#62daf7;box-shadow:0 0 12px rgba(98,218,247,.5)}@media(max-width:760px){.auth-product{grid-template-columns:1fr}.auth-pitch{padding:0}.auth-pitch h3{font-size:42px}}
  </style>
`

const showSubmit = (event: Event): void => {
  const detail = (event as CustomEvent).detail
  const output = (event.currentTarget as HTMLElement).nextElementSibling
  if (output) output.textContent = `${detail.mode} payload ready for your auth service`
}

const meta: Meta = {
  title:'Components/AuthForm',
  component:'kayf-auth-form',
  tags:['autodocs'],
  parameters:{docs:{description:{component:'`<kayf-auth-form>` provides polished sign-in and registration flows with native autofill, inline validation, password visibility, signup strength feedback, responsive layout, and luminous hover/focus borders. Entries survive loading, error and appearance changes. Switching modes preserves email and clears passwords. Sign-in accepts existing passwords; the 8-character rule applies only to signup. It emits data through `kayf-submit` and intentionally does not own a backend or session.'}}},
  argTypes:{
    mode:{control:'inline-radio',options:['signin','signup'],description:'Authentication flow',table:{defaultValue:{summary:'signin'}}},
    color:{control:'select',options:['cyan','violet','emerald','amber','red','white'],description:'Focus, field, and CTA accent',table:{defaultValue:{summary:'violet'}}},
    loading:{control:'boolean',description:'Disable inputs and show submit progress',table:{defaultValue:{summary:'false'}}},
    error:{control:'text',description:'Server-level error displayed as an alert'},
    heading:{control:'text',description:'Custom form heading'},
    description:{control:'text',description:'Custom supporting copy'},
    'action-label':{control:'text',description:'Custom submit label'},
    'forgot-href':{control:'text',description:'Password recovery URL',table:{defaultValue:{summary:'#'}}},
    'terms-href':{control:'text',description:'Terms and privacy URL',table:{defaultValue:{summary:'#'}}},
    'hide-switch':{control:'boolean',description:'Hide the sign-in/sign-up mode switch',table:{defaultValue:{summary:'false'}}},
  },
}

export default meta
type Story = StoryObj

export const SignIn: Story = {
  args:{mode:'signin',color:'violet',loading:false,error:'',heading:'',description:'','action-label':'','forgot-href':'#','terms-href':'#','hide-switch':false},
  render:args=>html`${styles}<section class="auth-stage"><div><kayf-auth-form mode=${args.mode} color=${args.color} ?loading=${args.loading} error=${args.error} heading=${ifDefined(args.heading || undefined)} description=${ifDefined(args.description || undefined)} action-label=${ifDefined(args['action-label'] || undefined)} forgot-href=${args['forgot-href']} terms-href=${args['terms-href']} ?hide-switch=${args['hide-switch']} @kayf-submit=${showSubmit}></kayf-auth-form><p class="auth-feedback" aria-live="polite">Fill the form to inspect the submit event</p></div></section>`,
}

export const Registration: Story = {
  render:()=>html`${styles}<section class="auth-stage"><kayf-auth-form mode="signup" color="cyan"></kayf-auth-form></section>`,
}

export const ErrorAndLoading: Story = {
  render:()=>html`${styles}<section class="auth-stage"><div style="display:grid;width:100%;grid-template-columns:repeat(auto-fit,minmax(min(100%,360px),1fr));gap:22px;align-items:start"><kayf-auth-form error="We could not verify that email and password." color="red" hide-switch></kayf-auth-form><kayf-auth-form loading heading="Verifying access" description="Securely checking your workspace credentials." color="emerald" hide-switch></kayf-auth-form></div></section>`,
}

export const ProductAuthScreen: Story = {
  parameters:{layout:'fullscreen'},
  render:()=>html`${styles}<section class="auth-stage" style="width:100%;min-height:100vh;border:0;border-radius:0"><div class="auth-product"><div class="auth-pitch"><span>Native interface system</span><h3>A calmer way back to work.</h3><p>Clear field states and purposeful motion keep account access reassuring without turning a familiar task into a visual effect demo.</p><div class="auth-points"><div><i></i>Native password-manager autofill</div><div><i></i>Keyboard-first validation and focus</div><div><i></i>Your backend remains in control</div></div></div><kayf-auth-form color="violet"></kayf-auth-form></div></section>`,
}

export const RetryWithoutRetyping: Story = {
  parameters: { docs: { description: { story: 'Submit any valid email and a nonempty password. This local demo shows a loading state followed by a simulated error. Your entries and Remember me choice remain available for a retry. No request is sent.' } } },
  render: () => html`${styles}<section class="auth-stage"><div><kayf-auth-form hide-switch @kayf-submit=${async (event: Event) => {
    const form = event.currentTarget as HTMLElement
    form.removeAttribute('error')
    form.setAttribute('loading', '')
    await new Promise(resolve => setTimeout(resolve, 800))
    if (!form.isConnected) return
    form.setAttribute('error', 'Demo: the service could not be reached. Your details are still here — try again.')
    form.removeAttribute('loading')
  }}></kayf-auth-form><p class="auth-feedback">Local loading → error → retry demonstration</p></div></section>`,
}
