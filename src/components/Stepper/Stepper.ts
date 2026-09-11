import { KayfElement } from '../../core/KayfElement'
import { baseCSS, getColor } from '../../core/tokens'
import { escapeHTML } from '../../core/formStyles'

export interface StepItem { id: string; title: string; description?: string }
export interface StepChangeDetail { value: string; previousValue: string; index: number }

/** A controlled workflow indicator with optional navigation to completed steps. */
export class Stepper extends KayfElement {
  private items: StepItem[] = []
  static override get observedAttributes() {
    return ['value', 'orientation', 'label', 'color', 'allow-navigation', 'complete', 'disabled']
  }
  get steps(): StepItem[] { return this.items.map(item => ({ ...item })) }
  set steps(steps: StepItem[]) {
    const ids = new Set<string>()
    this.items = steps.filter(step => {
      if (!step?.id || !step?.title || ids.has(step.id)) return false
      ids.add(step.id)
      return true
    }).map(step => ({ ...step }))
    this.update()
  }
  get value(): string { return this.items.find(item => item.id === this.attr('value'))?.id ?? this.items[0]?.id ?? '' }
  set value(value: string) { this.setAttribute('value', value) }
  private get index(): number { return this.items.findIndex(item => item.id === this.value) }

  protected override update(): void {
    const focused = Boolean(this.root.activeElement)
    super.update()
    if (focused && !this.boolAttr('disabled')) {
      const target = this.root.querySelector<HTMLElement>('.active .step') ?? this.root.querySelector<HTMLButtonElement>('button.step')
      target?.focus()
    }
  }

  protected styles(): string {
    return baseCSS + `
      :host { display:block; width:100%; font-family:var(--kayf-font-sans); --accent:${getColor(this.attr('color', 'violet'))}; }
      *,*::before,*::after { box-sizing:border-box; }
      .header { display:flex; align-items:center; justify-content:space-between; gap:16px; margin-bottom:22px; }
      .label { margin:0; color:var(--kayf-text); font-size:13px; font-weight:600; }
      .status { color:var(--kayf-muted); font:11px/1.5 var(--kayf-font-mono); text-align:right; }
      ol { display:flex; margin:0; padding:0; list-style:none; }
      li { position:relative; flex:1; min-width:0; }
      li:not(:last-child)::after { content:''; position:absolute; top:19px; left:48px; right:10px; height:1px; background:var(--kayf-border-strong); }
      li.done:not(:last-child)::after { background:color-mix(in srgb,var(--accent) 50%,transparent); }
      .step { position:relative; display:flex; flex-direction:column; align-items:flex-start; width:100%; gap:12px; padding:0 12px 0 0; border:0; background:transparent; color:var(--kayf-muted); text-align:left; font:inherit; }
      button.step { cursor:pointer; } button.step:hover .marker { background:color-mix(in srgb,var(--accent) 22%,#14141b); }
      .step:focus-visible { outline:2px solid var(--accent); outline-offset:5px; border-radius:9px; }
      .marker { position:relative; z-index:1; display:grid; flex:none; width:38px; height:38px; place-items:center; border:1px solid #ffffff25; border-radius:13px; background:#14141b; color:var(--kayf-muted); font:500 12px/1 var(--kayf-font-mono); transition:background 200ms,border-color 200ms,box-shadow 200ms; }
      .active .marker { color:#fff; border-color:var(--accent); background:color-mix(in srgb,var(--accent) 20%,#14141b); box-shadow:0 0 0 4px color-mix(in srgb,var(--accent) 9%,transparent); }
      .done .marker { border-color:color-mix(in srgb,var(--accent) 40%,transparent); background:color-mix(in srgb,var(--accent) 12%,#14141b); color:var(--accent); }
      .marker svg { width:17px; }
      .copy { display:block; min-width:0; padding-bottom:2px; }
      .title { display:block; color:var(--kayf-muted); font-size:12px; font-weight:600; line-height:1.4; overflow-wrap:anywhere; }
      .active .title,.done .title { color:var(--kayf-text); }
      .description { display:block; margin-top:5px; color:var(--kayf-muted); font-size:11px; line-height:1.5; overflow-wrap:anywhere; }
      .progress { height:3px; margin-top:22px; overflow:hidden; border-radius:99px; background:#ffffff0c; }
      .fill { height:100%; border-radius:inherit; background:linear-gradient(90deg,color-mix(in srgb,var(--accent) 45%,transparent),var(--accent)); transition:width 300ms ease; }
      :host([orientation='vertical']) ol { flex-direction:column; gap:24px; }
      :host([orientation='vertical']) .step { flex-direction:row; gap:15px; }
      :host([orientation='vertical']) li:not(:last-child)::after { top:46px; bottom:-16px; left:19px; right:auto; width:1px; height:auto; }
      :host([orientation='vertical']) .copy { padding-top:2px; }
      :host([disabled]) { opacity:.5; }
      .empty { padding:20px; border:1px dashed var(--kayf-border-strong); border-radius:14px; color:var(--kayf-muted); font-size:12px; }
      @media (max-width:480px) {
        ol { flex-direction:column; gap:24px; } .step { flex-direction:row; gap:15px; }
        li:not(:last-child)::after { top:46px; bottom:-16px; left:19px; right:auto; width:1px; height:auto; }
      }
    `
  }
  protected template(): string {
    if (!this.items.length) return '<div class="empty" part="empty">No steps yet. Add your workflow steps to get started.</div>'
    const complete = this.boolAttr('complete')
    const completed = complete ? this.items.length : this.index
    const percentage = Math.round(completed / this.items.length * 100)
    return `
      <div class="header"><p class="label" id="step-label">${escapeHTML(this.attr('label', 'Your next milestone'))}</p><span class="status" role="status">${complete ? 'All steps complete' : `Step ${this.index + 1} of ${this.items.length}`}</span></div>
      <ol part="steps" aria-labelledby="step-label">${this.items.map((item, index) => {
        const done = complete || index < this.index
        const active = !complete && index === this.index
        const navigable = this.boolAttr('allow-navigation') && !this.boolAttr('disabled') && done
        const tag = navigable ? 'button' : 'div'
        return `<li class="${done ? 'done' : active ? 'active' : ''}" ${active ? 'aria-current="step"' : ''}>
          <${tag} class="step" part="step" ${navigable ? `type="button" data-index="${index}"` : active ? 'tabindex="-1"' : ''}>
            <span class="marker" part="marker" aria-hidden="true">${done ? '<svg viewBox="0 0 18 18" fill="none"><path d="m4 9 3.2 3.2L14 5.5" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>' : String(index + 1).padStart(2, '0')}</span>
            <span class="copy"><span class="title">${escapeHTML(item.title)}${done ? '<span class="sr-only"> (completed)</span>' : ''}</span>${item.description ? `<span class="description">${escapeHTML(item.description)}</span>` : ''}</span>
          </${tag}>
        </li>`
      }).join('')}</ol>
      <div class="progress" part="progress" role="progressbar" aria-label="Completed steps" aria-valuemin="0" aria-valuemax="${this.items.length}" aria-valuenow="${completed}"><div class="fill" style="width:${percentage}%"></div></div>
      <style>.sr-only{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip-path:inset(50%);white-space:nowrap;border:0}</style>
    `
  }
  protected setup(): void {
    this.root.querySelectorAll<HTMLButtonElement>('button[data-index]').forEach(button => {
      button.addEventListener('click', () => {
        const index = Number(button.dataset.index)
        const item = this.items[index]
        if (!item || this.boolAttr('disabled')) return
        const event = new CustomEvent<StepChangeDetail>('kayf-step-change', {
          bubbles: true, composed: true, cancelable: true,
          detail: { value: item.id, previousValue: this.value, index },
        })
        // Consumers own value and validation. No automatic advancement or data loss.
        this.dispatchEvent(event)
      })
    })
  }
}

if (!customElements.get('kayf-stepper')) customElements.define('kayf-stepper', Stepper)
