import { KayfElement } from '../../core/KayfElement'
import { baseCSS, getColor } from '../../core/tokens'
import { escapeHTML } from '../../core/formStyles'

export interface VerificationCodeDetail { value: string; complete: boolean }

/** One native input: accessible autofill and paste, with a segmented visual treatment. */
export class VerificationCode extends KayfElement {
  static formAssociated = true
  private internals = this.attachInternals()
  private code = ''
  private initialized = false
  private fieldsetDisabled = false
  private input?: HTMLInputElement

  static override get observedAttributes() {
    return ['value', 'length', 'label', 'hint', 'error', 'disabled', 'required', 'name', 'color']
  }

  get length(): number {
    const length = Number(this.attr('length', '6'))
    return Number.isFinite(length) ? Math.min(8, Math.max(4, Math.floor(length))) : 6
  }
  get value(): string { return this.code }
  set value(value: string) { this.setAttribute('value', value) }
  get complete(): boolean { return this.code.length === this.length }
  private get disabled(): boolean { return this.boolAttr('disabled') || this.fieldsetDisabled }
  override focus(options?: FocusOptions): void { this.input?.focus(options) }
  checkValidity(): boolean { return this.internals.checkValidity() }
  reportValidity(): boolean { return this.internals.reportValidity() }

  override connectedCallback(): void {
    if (!this.initialized) this.code = this.sanitize(this.attr('value'))
    this.initialized = true
    super.connectedCallback()
  }
  override attributeChangedCallback(name: string, previous: string | null, next: string | null): void {
    if (name === 'value') this.code = this.sanitize(next ?? '')
    if (name === 'length') this.code = this.sanitize(this.code)
    super.attributeChangedCallback(name, previous, next)
  }
  formDisabledCallback(disabled: boolean): void {
    this.fieldsetDisabled = disabled
    this.update()
  }
  formResetCallback(): void {
    this.code = this.sanitize(this.attr('value'))
    this.update()
  }
  formStateRestoreCallback(state: string | File | FormData): void {
    if (typeof state === 'string') { this.code = this.sanitize(state); this.update() }
  }
  protected override update(): void {
    const focused = Boolean(this.input) && this.root.activeElement === this.input
    const caret = this.input?.selectionStart ?? 0
    super.update()
    if (focused && !this.disabled) { this.focus(); this.input?.setSelectionRange(caret, caret); this.syncCells() }
  }
  protected styles(): string {
    return baseCSS + `
      :host { display:block; width:100%; max-width:440px; font-family:var(--kayf-font-sans); --accent:${getColor(this.attr('color', 'violet'))}; }
      *, *::before, *::after { box-sizing:border-box; }
      .label { display:block; margin-bottom:12px; color:var(--kayf-text); font-size:13px; font-weight:600; }
      .control { position:relative; border-radius:15px; }
      .cells { display:grid; grid-template-columns:repeat(${this.length},minmax(0,1fr)); gap:clamp(5px,1.5vw,10px); }
      .cell { display:grid; min-width:0; height:clamp(48px,12vw,62px); place-items:center; border:1px solid var(--kayf-border-strong); border-radius:12px; background:linear-gradient(160deg,#191820,#0e0e14); box-shadow:inset 0 1px 0 #ffffff08; color:var(--kayf-text); font:500 clamp(20px,5vw,27px)/1 var(--kayf-font-mono); transition:background 180ms,border-color 180ms,box-shadow 180ms; }
      .cell:empty::after { content:''; width:6px; height:6px; border-radius:50%; background:#ffffff26; }
      .cell.filled { border-color:color-mix(in srgb,var(--accent) 40%,transparent); background:color-mix(in srgb,var(--accent) 8%,#101016); }
      .control:focus-within .cell.active { border-color:var(--accent); box-shadow:0 0 0 3px color-mix(in srgb,var(--accent) 16%,transparent),0 8px 24px #0003; }
      .control.complete .cell { border-color:color-mix(in srgb,var(--accent) 65%,transparent); }
      input { position:absolute; inset:0; width:100%; height:100%; margin:0; padding:0; opacity:0; font-size:16px; cursor:text; }
      .message { display:flex; justify-content:space-between; gap:12px; margin-top:12px; color:var(--kayf-muted); font-size:12px; line-height:1.5; }
      .count { white-space:nowrap; font-family:var(--kayf-font-mono); font-size:11px; }
      .error .cell { border-color:var(--kayf-red); }
      .error + .message { color:#ff9aa6; }
      .disabled { opacity:.45; } .disabled input { cursor:not-allowed; }
      @media (forced-colors:active) { .cell { border-color:CanvasText; } .control:focus-within .cell.active { outline:2px solid Highlight; } }
    `
  }
  protected template(): string {
    return `
      <label class="label" for="code">${escapeHTML(this.attr('label', 'Verification code'))}</label>
      <div class="control ${this.attr('error') ? 'error' : ''} ${this.disabled ? 'disabled' : ''}" part="control">
        <div class="cells" aria-hidden="true">${Array.from({ length: this.length }, () => '<span class="cell" part="cell"></span>').join('')}</div>
        <input id="code" part="input" type="text" inputmode="numeric" autocomplete="one-time-code" spellcheck="false" aria-describedby="code-message" ${this.disabled ? 'disabled' : ''} ${this.boolAttr('required') ? 'required' : ''}/>
      </div>
      <div class="message" id="code-message"><span ${this.attr('error') ? 'role="alert"' : ''}>${escapeHTML(this.attr('error') || this.attr('hint', 'Enter the code sent to your device.'))}</span><span class="count" aria-hidden="true"></span></div>
    `
  }
  protected setup(): void {
    this.input = this.root.querySelector<HTMLInputElement>('input')!
    this.input.value = this.code
    this.input.addEventListener('input', () => {
      const raw = this.input!.value
      const caret = this.sanitize(raw.slice(0, this.input!.selectionStart ?? raw.length)).length
      const previous = this.code
      this.code = this.sanitize(raw)
      this.input!.value = this.code
      this.input!.setSelectionRange(caret, caret)
      this.syncCells()
      if (previous !== this.code) {
        this.emit('kayf-input')
        if (this.complete) this.emit('kayf-complete')
      }
    })
    this.input.addEventListener('change', () => this.emit('kayf-change'))
    for (const event of ['focus', 'click', 'keyup', 'select']) this.input.addEventListener(event, () => this.syncCells())
    this.syncCells()
  }
  private sanitize(value: string): string { return value.replace(/\D/g, '').slice(0, this.length) }
  private syncCells(): void {
    const index = Math.min(this.input?.selectionStart ?? this.code.length, this.length - 1)
    this.root.querySelectorAll<HTMLElement>('.cell').forEach((cell, i) => {
      cell.textContent = this.code[i] ?? ''
      cell.classList.toggle('filled', i < this.code.length)
      cell.classList.toggle('active', i === index)
    })
    this.root.querySelector('.control')?.classList.toggle('complete', this.complete)
    const count = this.root.querySelector('.count')
    if (count) count.textContent = `${this.code.length} / ${this.length}`
    this.internals.setFormValue(this.code)
    const error = this.attr('error')
    const missing = this.boolAttr('required') && !this.code
    const incomplete = Boolean(this.code) && !this.complete
    this.internals.setValidity(error ? { customError: true } : missing ? { valueMissing: true } : incomplete ? { patternMismatch: true } : {},
      error || (missing || incomplete ? `Enter all ${this.length} digits.` : ''), this.input)
    this.input?.setAttribute('aria-invalid', String(Boolean(error || incomplete)))
  }
  private emit(type: string): void {
    this.dispatchEvent(new CustomEvent<VerificationCodeDetail>(type, { bubbles: true, composed: true, detail: { value: this.code, complete: this.complete } }))
  }
}

if (!customElements.get('kayf-verification-code')) customElements.define('kayf-verification-code', VerificationCode)
