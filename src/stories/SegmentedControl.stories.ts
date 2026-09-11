import type { Meta, StoryObj } from '@storybook/web-components-vite'
import { html } from 'lit'
import '../components/SegmentedControl/SegmentedControl'
import { workflowStyles } from './workflowStyles'

const plans = [
  { value:'monthly', label:'Monthly', description:'A little flexibility. Billed every month.' },
  { value:'yearly', label:'Yearly', description:'A longer runway. One payment a year.', badge:'Save 20%' },
]
const meta: Meta = {
  title:'Components/SegmentedControl', component:'kayf-segmented-control', tags:['autodocs'],
  parameters:{docs:{description:{component:'A native radio group for mutually exclusive choices: billing periods, visibility, delivery or view modes. Set `.options` to `{ value, label, description?, badge?, disabled? }[]`. Native arrow keys skip disabled choices; Tab enters the group once. `kayf-change` emits `{ value, previousValue }`. A `name` includes the selected value in parent FormData, with `required`, disabled fieldsets, reset and state restoration. The `value` attribute supplies the reset default; the property and user edits set the current selection. Missing or disabled selections yield an empty value. Parts: `group`, `input`, `option`, `badge`. At narrow widths, choices stack vertically.'}}},
  argTypes:{
    value:{control:'select',options:['monthly','yearly']}, options:{control:'object'}, label:{control:'text'},hint:{control:'text'},error:{control:'text'},
    orientation:{control:'inline-radio',options:['horizontal','vertical']},color:{control:'select',options:['violet','cyan','emerald','amber','red','white']},disabled:{control:'boolean'},required:{control:'boolean'},name:{control:'text'},
  },
}
export default meta
type Story = StoryObj
export const Default: Story = {
  args:{value:'yearly',options:plans,label:'Your billing rhythm',hint:'Switch any time before checkout.',error:'',orientation:'horizontal',color:'violet',disabled:false,required:true,name:'billing'},
  render:args=>html`${workflowStyles}<section class="workflow-stage"><span class="eyebrow">One decision. A little more clarity.</span><h2>Choose what fits.</h2><p class="lead">Give each choice enough context to feel obvious, with a clear selected state and no hidden trade-offs.</p><kayf-segmented-control .options=${args.options} value=${args.value} label=${args.label} hint=${args.hint} error=${args.error} orientation=${args.orientation} color=${args.color} ?disabled=${args.disabled} ?required=${args.required} name=${args.name} @kayf-change=${(event: CustomEvent) => {
    (event.currentTarget as HTMLElement).nextElementSibling!.textContent = `Selected: ${event.detail.value}`
  }}></kayf-segmented-control><p class="feedback" role="status">Try the arrow keys to compare options.</p></section>`,
}
export const ViewMode: Story = {
  render:()=>html`${workflowStyles}<section class="workflow-stage"><div class="workflow-stack"><kayf-segmented-control label="Your workspace, your view" value="board" color="cyan" .options=${[{value:'list',label:'List'},{value:'board',label:'Board'},{value:'timeline',label:'Timeline'}]}></kayf-segmented-control></div></section>`,
}
export const DeliveryChoices: Story = {
  render:()=>html`${workflowStyles}<section class="workflow-stage"><div class="workflow-stack"><kayf-segmented-control label="How should it arrive?" orientation="vertical" value="standard" color="emerald" .options=${[
    {value:'standard',label:'Standard delivery',description:'3–5 business days',badge:'Free'},
    {value:'express',label:'Express delivery',description:'1–2 business days',badge:'€8'},
    {value:'same-day',label:'Same-day delivery',description:'Unavailable for this address',disabled:true},
  ]}></kayf-segmented-control></div></section>`,
}
export const FormValidation: Story = {
  render:()=>html`${workflowStyles}<section class="workflow-stage"><form @submit=${(event: SubmitEvent)=>{
    event.preventDefault()
    const form = event.currentTarget as HTMLFormElement
    form.querySelector('.feedback')!.textContent = `FormData billing: ${new FormData(form).get('billing')}`
  }}><kayf-segmented-control .options=${plans} name="billing" label="Choose your billing period" required></kayf-segmented-control><div class="demo-actions"><button class="demo-button">Continue</button><button class="demo-button" type="reset">Reset</button></div><p class="feedback" role="status">A selection is required before continuing.</p></form></section>`,
}
export const States: Story = {
  render:()=>html`${workflowStyles}<section class="workflow-stage"><div class="workflow-stack"><kayf-segmented-control .options=${plans} value="yearly" label="Billing is locked" disabled></kayf-segmented-control><kayf-segmented-control .options=${plans} label="Choose another billing period" error="This plan is unavailable in your region." color="red"></kayf-segmented-control><kayf-segmented-control label="No choices yet"></kayf-segmented-control></div></section>`,
}
