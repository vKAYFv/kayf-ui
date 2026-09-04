import type { Meta, StoryObj } from '@storybook/web-components-vite'
import { html } from 'lit'
import type { LanguageOption } from '../components/LanguageSwitcher/LanguageSwitcher'
import '../components/LanguageSwitcher/LanguageSwitcher'

const styles = html`
  <style>
    .language-stage,.language-stage *{box-sizing:border-box}.language-stage{display:grid;width:min(820px,100%);min-height:460px;padding:clamp(28px,7vw,72px);place-items:center;border:1px solid rgba(255,255,255,.07);border-radius:26px;background:radial-gradient(circle at 85% 5%,rgba(139,124,255,.1),transparent 35%),linear-gradient(145deg,#0d0c13,#07070a 72%);font-family:Inter,system-ui,sans-serif}.header-demo{display:flex;width:min(650px,100%);min-height:70px;padding:0 18px;align-items:center;justify-content:space-between;border:1px solid rgba(255,255,255,.07);border-radius:18px;background:rgba(255,255,255,.025);box-shadow:0 22px 60px rgba(0,0,0,.3)}.header-demo strong{color:#f4f4f7;font-size:13px}.header-demo span{display:block;margin-top:4px;color:rgba(228,228,231,.35);font-size:9px;letter-spacing:.08em;text-transform:uppercase}.language-feedback{min-height:16px;margin:18px 0 0;color:rgba(228,228,231,.45);font:10px/1.4 ui-monospace,monospace;text-align:center}
  </style>
`

const customLanguages: LanguageOption[] = [
  { code:'ja', label:'Japanese', nativeLabel:'日本語', flag:'🇯🇵' },
  { code:'ko', label:'Korean', nativeLabel:'한국어', flag:'🇰🇷' },
  { code:'zh', label:'Chinese', nativeLabel:'简体中文', flag:'🇨🇳' },
]

const announce = (event: Event): void => {
  const output = (event.currentTarget as HTMLElement).nextElementSibling
  if (output) output.textContent = `Selected ${(event as CustomEvent).detail.nativeLabel}`
}

const meta: Meta = {
  title:'Components/LanguageSwitcher',
  component:'kayf-language-switcher',
  tags:['autodocs'],
  parameters:{docs:{description:{component:'`<kayf-language-switcher>` is an animated language picker with native focus management, listbox semantics, arrow-key navigation, custom language data, compact mode, and a composed `kayf-language-change` event.'}}},
  argTypes:{
    value:{control:'select',options:['en','de','uk','fr','es'],description:'Selected language code',table:{defaultValue:{summary:'en'}}},
    label:{control:'text',description:'Accessible and visible picker label',table:{defaultValue:{summary:'Language'}}},
    color:{control:'select',options:['cyan','violet','emerald','amber','red','white'],description:'Interaction accent',table:{defaultValue:{summary:'violet'}}},
    compact:{control:'boolean',description:'Icon-sized trigger with a full popover',table:{defaultValue:{summary:'false'}}},
    disabled:{control:'boolean',description:'Disable language selection',table:{defaultValue:{summary:'false'}}},
    languages:{control:false,description:'`LanguageOption[]` property for custom language choices'},
  },
}

export default meta
type Story = StoryObj

export const Default: Story = {
  args:{value:'en',label:'Interface language',color:'violet',compact:false,disabled:false},
  render:args=>html`${styles}<section class="language-stage"><div><kayf-language-switcher value=${args.value} label=${args.label} color=${args.color} ?compact=${args.compact} ?disabled=${args.disabled} @kayf-language-change=${announce}></kayf-language-switcher><p class="language-feedback" aria-live="polite">Choose a language</p></div></section>`,
}

export const Compact: Story = {
  parameters:{docs:{description:{story:'Compact mode keeps the complete accessible menu while reducing the resting trigger to a toolbar-friendly control.'}}},
  render:()=>html`${styles}<section class="language-stage"><kayf-language-switcher value="uk" color="cyan" compact></kayf-language-switcher></section>`,
}

export const CustomLanguages: Story = {
  render:()=>html`${styles}<section class="language-stage"><kayf-language-switcher .languages=${customLanguages} value="ja" label="Asia Pacific" color="emerald"></kayf-language-switcher></section>`,
}

export const ProductHeader: Story = {
  render:()=>html`${styles}<section class="language-stage"><header class="header-demo"><div><strong>Interface settings</strong><span>Localization</span></div><kayf-language-switcher value="de" compact></kayf-language-switcher></header></section>`,
}
