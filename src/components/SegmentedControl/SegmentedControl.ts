import { KayfElement } from '../../core/KayfElement'
import { baseCSS, getColor } from '../../core/tokens'
import { escapeHTML } from '../../core/formStyles'

export interface SegmentOption { value: string; label: string; description?: string; badge?: string; disabled?: boolean }
export interface SegmentChangeDetail { value: string; previousValue: string }

/** A native radio group with form participation and an expressive selected surface. */
export class SegmentedControl extends KayfElement {
  static formAssociated = true
  private internals = this.attachInternals()
  private items: SegmentOption[] = []
  private selection = ''
  private fieldsetDisabled = false

  static override get observedAttributes() { return ['value', 'name', 'label', 'hint', 'error', 'required', 'disabled', 'orientation', 'color'] }
  get options(): SegmentOption[] { return this.items.map(item => ({ ...item })) }
  set options(options: SegmentOption[]) {
    const seen = new Set<string>()
    this.items = options.filter(item => {
      if (!item?.value || !item?.label || seen.has(item.value)) return false
      seen.add(item.value)
      return true
    }).map(item => ({ ...item }))
    this.update()
  }
  get value(): string { return this.items.some(item => item.value === this.selection && !item.disabled) ? this.selection : '' }
  set value(value: string) { this.selection = value; this.update() }
  private get disabled(): boolean { return this.boolAttr('disabled') || this.fieldsetDisabled }
  override attributeChangedCallback(name: string, oldValue: string | null, value: string | null): void {
    if (name === 'value') this.selection = value ?? ''
    super.attributeChangedCallback(name, oldValue, value)
  }
  override focus(options?: FocusOptions): void {
    const input = this.root.querySelector<HTMLInputElement>('input:checked:not(:disabled)') ?? this.root.querySelector<HTMLInputElement>('input:not(:disabled)')
    input?.focus(options)
  }
  checkValidity(): boolean { return this.internals.checkValidity() }
  reportValidity(): boolean { return this.internals.reportValidity() }
  formDisabledCallback(disabled: boolean): void { this.fieldsetDisabled = disabled; this.update() }
  formResetCallback(): void { this.selection = this.attr('value'); this.update() }
  formStateRestoreCallback(state: string | File | FormData): void { if (typeof state === 'string') this.value = state }
  protected override update(): void {
    const focused = (this.root.activeElement as HTMLInputElement | null)?.value
    super.update()
    if (focused && !this.disabled) {
      const inputs = Array.from(this.root.querySelectorAll<HTMLInputElement>('input'))
      const previous = inputs.find(input => input.value === focused && !input.disabled)
      if (previous) previous.focus()
      else this.focus()
    }
  }
  protected styles(): string {
    return baseCSS + `
      :host { display:block; width:100%; font-family:var(--kayf-font-sans); --accent:${getColor(this.attr('color', 'violet'))}; }
      *,*::before,*::after { box-sizing:border-box; }
      .heading { display:block; margin-bottom:12px; color:var(--kayf-text); font-size:13px; font-weight:600; }
      .group { display:grid; grid-template-columns:repeat(${Math.max(1, this.items.length)},minmax(0,1fr)); gap:6px; padding:6px; border:1px solid var(--kayf-border); border-radius:18px; background:#0b0b11; }
      .option { position:relative; min-width:0; cursor:pointer; }
      input { position:absolute; z-index:2; inset:0; width:100%; height:100%; margin:0; opacity:0; cursor:inherit; }
      .surface { display:flex; flex-direction:column; height:100%; min-height:48px; justify-content:center; gap:7px; padding:13px 16px; border:1px solid transparent; border-radius:12px; background:transparent; transition:background 180ms,border-color 180ms,box-shadow 180ms; }
      .title-row { display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:8px; }
      .title { color:var(--kayf-muted); font-size:13px; font-weight:600; line-height:1.4; overflow-wrap:anywhere; }
      .description { color:var(--kayf-muted); font-size:12px; line-height:1.5; overflow-wrap:anywhere; }
      .badge { padding:3px 6px; border:1px solid #ffffff22; border-radius:5px; color:var(--kayf-text); font:10px/1.3 var(--kayf-font-mono); }
      input:not(:disabled):hover + .surface { background:#ffffff06; }
      input:checked + .surface { border-color:color-mix(in srgb,var(--accent) 48%,transparent); background:radial-gradient(ellipse at 0 0,color-mix(in srgb,var(--accent) 17%,transparent),transparent 80%),#191822; box-shadow:inset 0 1px 0 #ffffff0a,0 5px 15px #0003; }
      input:checked + .surface .title { color:var(--kayf-text); }
      input:checked + .surface .badge { color:color-mix(in srgb,var(--accent) 65%,white); border-color:color-mix(in srgb,var(--accent) 35%,transparent); }
      input:focus-visible + .surface { outline:2px solid var(--accent); outline-offset:2px; }
      input:disabled { cursor:not-allowed; } input:disabled + .surface { opacity:.4; }
      .message { margin:10px 2px 0; color:var(--kayf-muted); font-size:12px; line-height:1.5; }
      .message:empty { display:none; } :host([error]:not([error=''])) .message { color:#ff9aa6; }
      :host([orientation='vertical']) .group { grid-template-columns:1fr; }
      .empty { padding:16px; color:var(--kayf-muted); font-size:12px; }
      @media (max-width:420px) { .group { grid-template-columns:1fr; } }
      @media (forced-colors:active) { input:checked + .surface { border:2px solid Highlight; } input:focus-visible + .surface { outline-color:Highlight; } }
    `
  }
  protected template(): string {
    return `<span class="heading" id="segment-label">${escapeHTML(this.attr('label', 'Choose an option'))}</span>
      <div class="group" part="group" role="radiogroup" aria-labelledby="segment-label" aria-describedby="segment-message" aria-required="${this.boolAttr('required')}" aria-invalid="${Boolean(this.attr('error'))}">
        ${this.items.length ? this.items.map((item, index) => `<label class="option">
          <input part="input" type="radio" name="segment" value="${escapeHTML(item.value)}" aria-labelledby="segment-${index}-label" ${item.description ? `aria-describedby="segment-${index}-description"` : ''} ${item.disabled || this.disabled ? 'disabled' : ''} ${this.value === item.value ? 'checked' : ''}/>
          <span class="surface" part="option"><span class="title-row"><span class="title" id="segment-${index}-label">${escapeHTML(item.label)}</span>${item.badge ? `<span class="badge" part="badge">${escapeHTML(item.badge)}</span>` : ''}</span>${item.description ? `<span class="description" id="segment-${index}-description">${escapeHTML(item.description)}</span>` : ''}</span>
        </label>`).join('') : '<span class="empty">No options available.</span>'}
      </div><p class="message" id="segment-message" ${this.attr('error') ? 'role="alert"' : ''}>${escapeHTML(this.attr('error') || this.attr('hint'))}</p>`
  }
  protected setup(): void {
    this.root.querySelectorAll<HTMLInputElement>('input').forEach(input => {
      input.addEventListener('change', () => {
        if (this.disabled || input.disabled || !input.checked) return
        const previousValue = this.value
        this.selection = input.value
        this.syncForm()
        this.dispatchEvent(new CustomEvent<SegmentChangeDetail>('kayf-change', { bubbles:true, composed:true, detail:{ value:this.value, previousValue } }))
      })
    })
    this.syncForm()
  }
  private syncForm(): void {
    this.internals.setFormValue(this.value || null)
    const error = this.attr('error')
    const missing = this.boolAttr('required') && !this.value
    const anchor = this.root.querySelector<HTMLInputElement>('input:not(:disabled)') ?? undefined
    this.internals.setValidity(error ? { customError:true } : missing ? { valueMissing:true } : {}, error || (missing ? 'Choose an option.' : ''), anchor)
  }
}

if (!customElements.get('kayf-segmented-control')) customElements.define('kayf-segmented-control', SegmentedControl)
