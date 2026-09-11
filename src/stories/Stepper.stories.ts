import type { Meta, StoryObj } from '@storybook/web-components-vite'
import { html } from 'lit'
import type { StepChangeDetail, Stepper } from '../components/Stepper/Stepper'
import '../components/Stepper/Stepper'
import { workflowStyles } from './workflowStyles'

export const releaseSteps = [
  { id: 'details', title: 'The essentials', description: 'Name your project' },
  { id: 'assets', title: 'Make it yours', description: 'Bring your files' },
  { id: 'review', title: 'One last look', description: 'Review and confirm' },
]
const meta: Meta = {
  title: 'Components/Stepper', component: 'kayf-stepper', tags: ['autodocs'],
  parameters: { docs: { description: { component: 'A controlled workflow indicator with numbered milestones, completed states, responsive vertical layout and a completed-step progress bar. Set the `steps` property to `{ id, title, description? }[]` and `value` to the active id. Earlier steps are complete; `complete` finishes the whole flow. `allow-navigation` turns completed steps into native buttons emitting `kayf-step-change` with `{ value, previousValue, index }`. Your application validates and applies the requested `value`; the component never changes screens by itself. Parts: `steps`, `step`, `marker`, `progress`, `empty`.' } } },
  argTypes: {
    value: { control: 'select', options: ['details', 'assets', 'review'] },
    orientation: { control: 'inline-radio', options: ['horizontal', 'vertical'] },
    label: { control: 'text' }, complete: { control: 'boolean' }, disabled: { control: 'boolean' },
    'allow-navigation': { control: 'boolean' }, steps: { control: 'object', description: 'Unique ids, titles and optional descriptions.' },
    color: { control: 'select', options: ['violet', 'cyan', 'emerald', 'amber', 'red', 'white'] },
  },
}
export default meta
type Story = StoryObj
export const Default: Story = {
  args: { value: 'assets', orientation: 'horizontal', label: 'Create your next release', complete: false, disabled: false, 'allow-navigation': true, steps: releaseSteps, color: 'violet' },
  render: args => html`${workflowStyles}<section class="workflow-stage"><span class="eyebrow">A little clarity goes a long way</span><h2>Every step, in sight.</h2><p class="lead">Show where people are, what they have finished, and what comes next.</p><kayf-stepper .steps=${args.steps} value=${args.value} orientation=${args.orientation} label=${args.label} color=${args.color} ?complete=${args.complete} ?disabled=${args.disabled} ?allow-navigation=${args['allow-navigation']} @kayf-step-change=${(event: CustomEvent<StepChangeDetail>) => {
    const stepper = event.currentTarget as Stepper
    stepper.value = event.detail.value
    stepper.removeAttribute('complete')
  }}></kayf-stepper></section>`,
}
export const Vertical: Story = { ...Default, args: { ...Default.args, orientation: 'vertical', color: 'cyan' } }
export const Completed: Story = { ...Default, args: { ...Default.args, value: 'review', complete: true, color: 'emerald', 'allow-navigation': false } }
export const Empty: Story = { ...Default, args: { ...Default.args, steps: [] } }
export const GuidedFlow: Story = {
  render: () => {
    const advance = (event: Event, direction: number) => {
      const stage = (event.currentTarget as HTMLElement).closest('.workflow-stage')!
      const stepper = stage.querySelector<Stepper>('kayf-stepper')!
      const index = releaseSteps.findIndex(step => step.id === stepper.value)
      if (direction > 0 && index === releaseSteps.length - 1) stepper.setAttribute('complete', '')
      else { stepper.removeAttribute('complete'); stepper.value = releaseSteps[Math.max(0, Math.min(releaseSteps.length - 1, index + direction))].id }
      const completed = stepper.hasAttribute('complete')
      stage.querySelector('.feedback')!.textContent = completed ? 'All done. Your release is ready.' : releaseSteps.find(step => step.id === stepper.value)!.description!
      const next = stage.querySelector<HTMLButtonElement>('[data-next]')!
      next.disabled = completed
      next.textContent = stepper.value === 'review' ? 'Finish setup' : 'Continue'
      stage.querySelector<HTMLButtonElement>('[data-back]')!.disabled = stepper.value === 'details'
    }
    return html`${workflowStyles}<section class="workflow-stage"><span class="eyebrow">Application-controlled flow</span><h2>A clear path forward.</h2><p class="lead">The application owns validation and advancement. The stepper makes progress visible.</p><kayf-stepper .steps=${releaseSteps} value="details" label="Workspace setup"></kayf-stepper><p class="feedback" role="status">Name your project</p><div class="demo-actions"><button class="demo-button" data-back disabled @click=${(event: Event) => advance(event, -1)}>Back</button><button class="demo-button" data-next @click=${(event: Event) => advance(event, 1)}>Continue</button></div></section>`
  },
}
