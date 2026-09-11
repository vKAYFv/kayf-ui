import type { Meta, StoryObj } from '@storybook/web-components-vite'
import { html } from 'lit'
import { ref } from 'lit/directives/ref.js'
import { ToastStack, type ToastOptions } from '../components/ToastStack/ToastStack'
import { workflowStyles } from './workflowStyles'

const seed = (notices: ToastOptions[]) => (element?: Element) => {
  if (element) notices.forEach(notice => (element as ToastStack).show(notice))
}
const meta: Meta = {
  title:'Components/ToastStack',component:'kayf-toast-stack',tags:['autodocs'],
  parameters:{docs:{description:{component:'Local notification stack. Call `show({ id?, title, description?, tone?, duration?, actionLabel? })` to receive an id. Tones: info, success, warning, error. Duration is milliseconds, 0 persists; defaults to 6000, or 0 for actionable notices, capped at 10 minutes. At most five notices remain visible; the oldest is dismissed on overflow. Reusing an id updates its content and restarts its timer. Timers pause while hovered, focused, hidden or disconnected. `dismiss(id)` and `clear()` remove notices. `kayf-toast-action` emits `{ id }`; preventDefault keeps the notice open, otherwise it dismisses. `kayf-toast-dismiss` emits `{ id, reason }`. Info/success/warning use a polite live region; errors use an alert. Actions never take focus on arrival. Parts: `region`, `stack`, `toast`. Default positioning is fixed bottom-end; `top-end` moves it up and `inline` keeps it in layout. Unmount pauses notices; call clear() to discard them.'}}},
  argTypes:{inline:{control:'boolean'},position:{control:'inline-radio',options:['bottom-end','top-end']},label:{control:'text'}},
}
export default meta
type Story = StoryObj
export const Default: Story = {
  args:{inline:true,position:'bottom-end',label:'Workspace notifications'},
  render:args=>html`${workflowStyles}<section class="workflow-stage"><div class="workflow-stack"><div><span class="eyebrow">Feedback that leaves room to work</span><h2>Keep the moment moving.</h2><p class="lead">A clear result, an optional next step, and a calm way back to what matters.</p></div><kayf-toast-stack ?inline=${args.inline} position=${args.position} label=${args.label} ${ref(seed([
    {id:'saved',title:'Your changes are saved',description:'The whole team is up to date.',tone:'success',duration:0},
    {id:'archive',title:'Project moved to archive',description:'You can bring it back without losing any work.',tone:'info',actionLabel:'Undo archive'},
  ]))} @kayf-toast-action=${(event: CustomEvent)=>{
    (event.currentTarget as HTMLElement).nextElementSibling!.textContent = `Action requested for ${event.detail.id}. Connect your own undo handler.`
  }}></kayf-toast-stack><p class="feedback" role="status">These notices stay until you dismiss them.</p></div></section>`,
}
export const AllTones: Story = {
  render:()=>html`${workflowStyles}<section class="workflow-stage"><div class="workflow-stack"><kayf-toast-stack inline ${ref(seed([
    {title:'Invite sent',description:'Your teammate can join when they are ready.',tone:'success',duration:0},
    {title:'A fresh version is available',description:'Reload when it works for you.',tone:'info',actionLabel:'Reload preview'},
    {title:'You are almost out of storage',description:'Review your files before the next upload.',tone:'warning',duration:0},
    {title:'We could not save your changes',description:'Your draft is still here. Please try again.',tone:'error',actionLabel:'Retry'},
  ]))}></kayf-toast-stack></div></section>`,
}
export const TimedFeedback: Story = {
  render:()=>html`${workflowStyles}<section class="workflow-stage"><span class="eyebrow">No race against the clock</span><h2>Take your time.</h2><p class="lead">Show a notification, then hover it or focus its close button. The countdown pauses until you leave.</p><div class="demo-actions" style="margin-bottom:28px"><button class="demo-button" @click=${(event: Event)=>{
    (event.currentTarget as HTMLElement).closest('section')!.querySelector<ToastStack>('kayf-toast-stack')!.show({title:'Draft saved',description:'This notice stays for 6 seconds, excluding time you spend interacting with it.',tone:'success'})
  }}>Save draft</button><button class="demo-button" @click=${(event: Event)=>(event.currentTarget as HTMLElement).closest('section')!.querySelector<ToastStack>('kayf-toast-stack')!.clear()}>Clear notifications</button></div><kayf-toast-stack inline></kayf-toast-stack></section>`,
}
export const UndoAction: Story = {
  render:()=>html`${workflowStyles}<section class="workflow-stage"><span class="eyebrow">A second chance, built in</span><h2>Room to change your mind.</h2><p class="lead">Archive the demo project, then undo. Actionable notices remain visible until you decide.</p><p class="feedback" data-project role="status">Project: active</p><div class="demo-actions" style="margin-bottom:28px"><button class="demo-button" @click=${(event: Event)=>{
    const stage = (event.currentTarget as HTMLElement).closest('section')!
    stage.querySelector('[data-project]')!.textContent = 'Project: archived'
    stage.querySelector<ToastStack>('kayf-toast-stack')!.show({id:'project',title:'Project archived',description:'Restore it whenever you are ready.',tone:'info',actionLabel:'Undo archive'})
  }}>Archive project</button></div><kayf-toast-stack inline @kayf-toast-action=${(event: CustomEvent)=>{
    if (event.detail.id === 'project') (event.currentTarget as HTMLElement).closest('section')!.querySelector('[data-project]')!.textContent = 'Project: active'
  }}></kayf-toast-stack></section>`,
}
