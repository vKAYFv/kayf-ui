import type { Meta, StoryObj } from '@storybook/web-components-vite'
import { html } from 'lit'
import '../components/FileDropzone/FileDropzone'
import { workflowStyles } from './workflowStyles'

const meta: Meta = {
  title: 'Components/FileDropzone', component: 'kayf-file-dropzone', tags: ['autodocs'],
  parameters: { docs: { description: { component: 'A local file intake surface with drag/drop, a native file picker, removable file rows, duplicate detection and explicit rejection messages. `files` returns a defensive array of File objects; `clear()` resets selection. `kayf-change` emits `{ files }`; `kayf-reject` emits `{ rejections: [{ file, reason, message }] }`, where reason is `type`, `size`, `count`, or `duplicate`. Use `FormData.append` with each File to connect your own upload service. Client checks are UX checks; validate uploads on your server. No transport, object URLs or background requests. Parts: `dropzone`, `browse`, `files`, `file`. In single mode, a valid new file replaces the selection; a rejected file preserves it. Changed constraints apply to the next selection; existing files remain until removed or cleared.' } } },
  argTypes: {
    accept: { control: 'text', description: 'Comma-separated extensions, MIME types or wildcards, e.g. .pdf,image/*.' },
    multiple: { control: 'boolean' }, 'max-size': { control: 'number', description: 'Bytes per file. Default: 10485760 (10 MB).' },
    'max-files': { control: 'number', description: 'Maximum total selection in multiple mode. Default: 5.' },
    disabled: { control: 'boolean' }, label: { control: 'text' }, hint: { control: 'text' },
    color: { control: 'select', options: ['cyan', 'violet', 'emerald', 'amber', 'red', 'white'] },
  },
}
export default meta
type Story = StoryObj
export const Default: Story = {
  args: { accept: 'image/*,.pdf', multiple: true, 'max-size': 10485760, 'max-files': 5, disabled: false, color: 'cyan', label: 'Drop something worth sharing', hint: 'Add project images or a PDF. Everything stays local until you decide to upload.' },
  render: args => html`${workflowStyles}<section class="workflow-stage"><div class="workflow-stack"><div><span class="eyebrow">From your desktop to your next release</span><h2>Good work starts here.</h2><p class="lead">A clear place for assets, with useful feedback before the upload begins.</p><kayf-file-dropzone accept=${args.accept} ?multiple=${args.multiple} max-size=${args['max-size']} max-files=${args['max-files']} ?disabled=${args.disabled} color=${args.color} label=${args.label} hint=${args.hint}></kayf-file-dropzone></div></div></section>`,
}
export const SingleDocument: Story = {
  render: () => html`${workflowStyles}<section class="workflow-stage"><div class="workflow-stack"><kayf-file-dropzone accept=".pdf" max-size="2097152" label="Add your project brief" hint="One PDF, up to 2 MB. Choose a new file to replace the current one." color="violet"></kayf-file-dropzone></div></section>`,
}
export const StrictLimits: Story = {
  render: () => html`${workflowStyles}<section class="workflow-stage"><div class="workflow-stack"><div><span class="eyebrow">Try the edge cases</span><h2>Helpful by design.</h2><p class="lead">Try a third file, a file over 100 KB, or an unsupported format to see a clear explanation.</p><kayf-file-dropzone multiple accept=".txt,.md" max-size="102400" max-files="2" label="Attach your notes" hint="Two text or Markdown files, up to 100 KB each." color="amber"></kayf-file-dropzone></div></div></section>`,
}
export const Disabled: Story = {
  render: () => html`${workflowStyles}<section class="workflow-stage"><div class="workflow-stack"><kayf-file-dropzone disabled label="Attachments are locked" hint="Finish the current submission before adding more files."></kayf-file-dropzone></div></section>`,
}
