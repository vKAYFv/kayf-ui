import { KayfElement } from '../../core/KayfElement'
import { baseCSS, ColorVariant, getColor } from '../../core/tokens'
import { escapeHTML, formControlCSS } from '../../core/formStyles'

export type AuthMode = 'signin' | 'signup'

export interface AuthSubmitDetail {
  mode: AuthMode
  name?: string
  email: string
  password: string
  remember: boolean
}

/** Polished sign-in and registration form that emits data without owning authentication. */
export class AuthForm extends KayfElement {
  private form?: HTMLFormElement
  private onSubmit?: (event: SubmitEvent) => void
  private onInput?: (event: Event) => void
  private onClick?: (event: Event) => void
  private onPointerMove?: (event: PointerEvent) => void
  private renderedMode?: AuthMode

  protected override update(): void {
    if (!this.isConnected) return
    // Keep user input across server state and appearance changes, never in attributes.
    const sameMode = this.renderedMode === this.mode
    const fields = Array.from(this.root.querySelectorAll<HTMLInputElement>('input'))
      .filter(input => sameMode || input.name === 'email')
      .map(input => ({ name: input.name, value: input.value, checked: input.checked }))
    const active = this.root.activeElement as HTMLInputElement | null
    const focusedName = active?.name
    super.update()
    for (const field of fields) {
      const input = this.form?.elements.namedItem(field.name) as HTMLInputElement | null
      if (input) { input.value = field.value; input.checked = field.checked }
    }
    const password = this.form?.elements.namedItem('password') as HTMLInputElement | null
    if (this.mode === 'signup') this.updateStrength(password?.value ?? '')
    if (focusedName && sameMode && !this.boolAttr('loading')) {
      (this.form?.elements.namedItem(focusedName) as HTMLElement | null)?.focus()
    }
  }

  static override get observedAttributes() {
    return ['mode', 'color', 'loading', 'error', 'heading', 'description', 'action-label', 'forgot-href', 'terms-href', 'hide-switch']
  }

  get mode(): AuthMode {
    return this.attr('mode', 'signin') === 'signup' ? 'signup' : 'signin'
  }

  set mode(next: AuthMode) {
    this.setAttribute('mode', next)
  }

  override focus(options?: FocusOptions): void {
    this.root.querySelector<HTMLInputElement>('input')?.focus(options)
  }

  protected styles(): string {
    const accent = getColor(this.attr('color', 'violet') as ColorVariant)
    return baseCSS + formControlCSS + `
      :host { display: block; width: 100%; max-width: 440px; --field-accent: ${accent}; font-family: var(--kayf-font-sans); }
      .auth-card {
        position: relative;
        padding: clamp(24px, 6vw, 36px);
        overflow: hidden;
        border: 1px solid rgba(255,255,255,0.085);
        border-radius: 26px;
        color: var(--kayf-text);
        background:
          radial-gradient(circle at 0% 0%, color-mix(in srgb, ${accent} 10%, transparent), transparent 35%),
          linear-gradient(145deg, rgba(18,18,25,0.97), rgba(9,9,13,0.99));
        box-shadow: 0 32px 90px rgba(0,0,0,0.44), inset 0 1px 0 rgba(255,255,255,0.055);
      }

      .auth-card::before {
        content: '';
        position: absolute;
        top: -90px;
        right: -70px;
        width: 220px;
        height: 220px;
        border: 1px solid color-mix(in srgb, ${accent} 18%, transparent);
        border-radius: 50%;
        box-shadow: inset 0 0 70px color-mix(in srgb, ${accent} 5%, transparent);
        pointer-events: none;
      }

      .brand { display: flex; margin-bottom: 32px; align-items: center; gap: 10px; }
      .brand-mark { display: grid; width: 31px; height: 31px; place-items: center; border: 1px solid color-mix(in srgb, ${accent} 35%, rgba(255,255,255,0.12)); border-radius: 10px; color: color-mix(in srgb, ${accent} 78%, white); background: color-mix(in srgb, ${accent} 8%, transparent); box-shadow: 0 0 22px color-mix(in srgb, ${accent} 9%, transparent); font: 700 9px/1 var(--kayf-font-mono); }
      .brand-name { color: rgba(244,244,247,0.68); font-size: 12px; font-weight: 680; letter-spacing: -0.01em; }
      .eyebrow { margin: 0 0 9px; color: color-mix(in srgb, ${accent} 70%, white); font: 650 9px/1 var(--kayf-font-mono); letter-spacing: 0.13em; text-transform: uppercase; }
      h2 { margin: 0; font-size: clamp(27px, 8vw, 34px); font-weight: 680; line-height: 1; letter-spacing: -0.045em; }
      .description { margin: 12px 0 27px; color: rgba(228,228,231,0.66); font-size: 12px; line-height: 1.55; }

      .server-error { display: flex; margin: -8px 0 18px; padding: 11px 12px; align-items: flex-start; gap: 9px; border: 1px solid rgba(255,115,131,0.2); border-radius: 12px; color: #ff9aa6; background: rgba(255,115,131,0.065); font-size: 11px; line-height: 1.45; }
      .server-error::before { content: '!'; display: grid; width: 17px; height: 17px; flex: none; place-items: center; border: 1px solid rgba(255,115,131,0.32); border-radius: 50%; font: 700 9px/1 var(--kayf-font-mono); }

      form { display: grid; gap: 16px; }
      .field-group { display: block; }
      .field-label { margin-bottom: 8px; }
      .field-shell { min-height: 52px; padding: 0 13px; gap: 11px; }
      .field-icon { width: 17px; flex: none; color: rgba(228,228,231,0.3); transition: color 180ms ease, transform 180ms ease; }
      .field-shell:focus-within .field-icon { color: color-mix(in srgb, ${accent} 72%, white); transform: translateY(-1px); }
      .field-input { height: 50px; }

      .reveal {
        display: grid;
        width: 30px;
        height: 30px;
        flex: none;
        place-items: center;
        border: 0;
        border-radius: 9px;
        color: rgba(228,228,231,0.34);
        background: transparent;
        cursor: pointer;
        outline: none;
        transition: color 150ms ease, background 150ms ease;
      }
      .reveal:hover { color: #f4f4f7; background: rgba(255,255,255,0.055); }
      .reveal:focus-visible { outline: 2px solid ${accent}; outline-offset: 1px; }
      .reveal svg { width: 16px; }

      .strength { display: grid; grid-template-columns: repeat(4, 1fr); gap: 4px; margin: 8px 2px 0; }
      .strength span { height: 3px; border-radius: 99px; background: rgba(255,255,255,0.07); transition: background 180ms ease, box-shadow 180ms ease; }
      .strength[data-score='1'] span:nth-child(-n+1) { background: #ff7383; }
      .strength[data-score='2'] span:nth-child(-n+2) { background: #f8c868; }
      .strength[data-score='3'] span:nth-child(-n+3) { background: ${accent}; }
      .strength[data-score='4'] span:nth-child(-n+4) { background: #51dfa4; box-shadow: 0 0 8px rgba(81,223,164,0.18); }

      .validation { min-height: 0; margin: 6px 2px 0; color: #ff8997; font-size: 10px; line-height: 1.35; }
      .field-group:not(.is-invalid) .validation { display: none; }
      .field-group.is-invalid .field-shell { border-color: rgba(255,115,131,0.62); box-shadow: 0 0 0 3px rgba(255,115,131,0.09); }

      .form-row { display: flex; margin-top: -2px; align-items: center; justify-content: space-between; gap: 16px; }
      .remember { position: relative; display: inline-flex; align-items: center; gap: 8px; color: rgba(228,228,231,0.68); cursor: pointer; font-size: 11px; }
      .remember input { position: absolute; z-index: 1; left: 0; top: 0; width: 17px; height: 17px; margin: 0; opacity: 0; cursor: pointer; }
      .check-box { display: grid; width: 17px; height: 17px; place-items: center; border: 1px solid rgba(255,255,255,0.13); border-radius: 5px; background: rgba(255,255,255,0.025); transition: border-color 160ms ease, background 160ms ease, box-shadow 160ms ease; }
      .check-box svg { width: 11px; color: #09090b; opacity: 0; transform: scale(0.55); transition: opacity 160ms ease, transform 180ms ease; }
      .remember input:checked + .check-box { border-color: ${accent}; background: ${accent}; box-shadow: 0 0 16px color-mix(in srgb, ${accent} 18%, transparent); }
      .remember input:checked + .check-box svg { opacity: 1; transform: scale(1); }
      .remember input:focus-visible + .check-box { outline: 2px solid color-mix(in srgb, ${accent} 70%, white); outline-offset: 2px; }
      .forgot { color: color-mix(in srgb, ${accent} 70%, white); font-size: 11px; text-decoration: none; }
      .forgot:hover { text-decoration: underline; text-underline-offset: 3px; }

      .terms { display: grid; grid-template-columns: auto 1fr; align-items: start; }
      .terms a { color: color-mix(in srgb, ${accent} 70%, white); }
      .terms.is-invalid .check-box { border-color: rgba(255,115,131,0.7); box-shadow: 0 0 0 3px rgba(255,115,131,0.09); }
      .terms-validation { display: none; margin: -8px 2px 0 25px; color: #ff8997; font-size: 10px; line-height: 1.35; }
      .terms.is-invalid + .terms-validation { display: block; }

      .submit {
        position: relative;
        display: flex;
        min-height: 50px;
        margin-top: 3px;
        padding: 0 17px;
        align-items: center;
        justify-content: center;
        gap: 9px;
        overflow: hidden;
        border: 1px solid color-mix(in srgb, ${accent} 68%, white);
        border-radius: 14px;
        color: #09090c;
        background: linear-gradient(135deg, color-mix(in srgb, ${accent} 48%, white), ${accent});
        box-shadow: 0 16px 35px color-mix(in srgb, ${accent} 17%, transparent), inset 0 1px 0 rgba(255,255,255,0.48);
        cursor: pointer;
        outline: none;
        font: 720 13px/1 var(--kayf-font-sans);
        transition: transform 180ms cubic-bezier(.2,.8,.2,1), box-shadow 200ms ease, filter 180ms ease;
      }
      .submit::before { content: ''; position: absolute; inset: -100% -35%; background: linear-gradient(110deg, transparent 38%, rgba(255,255,255,0.38) 50%, transparent 62%); transform: translateX(-48%); transition: transform 600ms cubic-bezier(.2,.75,.2,1); }
      .submit:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 21px 44px color-mix(in srgb, ${accent} 22%, transparent), inset 0 1px 0 rgba(255,255,255,0.5); }
      .submit:hover:not(:disabled)::before { transform: translateX(48%); }
      .submit:active:not(:disabled) { transform: scale(0.987); }
      .submit:focus-visible { outline: 2px solid color-mix(in srgb, ${accent} 70%, white); outline-offset: 3px; }
      .submit:disabled { cursor: wait; filter: saturate(0.65); opacity: 0.7; }
      .submit-label, .spinner { position: relative; z-index: 1; }
      .spinner { display: none; width: 15px; height: 15px; border: 2px solid rgba(9,9,12,0.25); border-top-color: #09090c; border-radius: 50%; animation: auth-spin 720ms linear infinite; }
      :host([loading]) .spinner { display: block; }

      .switch-copy { margin: 7px 0 0; color: rgba(228,228,231,0.64); font-size: 11px; text-align: center; }
      .mode-switch { padding: 5px; border: 0; color: color-mix(in srgb, ${accent} 70%, white); background: transparent; cursor: pointer; font: 650 11px/1 var(--kayf-font-sans); }
      .mode-switch:hover { text-decoration: underline; text-underline-offset: 3px; }
      .mode-switch:focus-visible { outline: 2px solid ${accent}; outline-offset: 2px; border-radius: 6px; }

      @keyframes auth-spin { to { transform: rotate(360deg); } }
      @media (max-width: 420px) { .auth-card { border-radius: 21px; } .form-row { align-items: flex-start; flex-direction: column; gap: 12px; } }
      @media (prefers-reduced-motion: reduce) { .field-icon, .reveal, .strength span, .check-box, .check-box svg, .submit, .submit::before { transition-duration: 0.01ms; } .submit:hover:not(:disabled) { transform: none; } }
    `
  }

  protected template(): string {
    const signup = this.mode === 'signup'
    const loading = this.boolAttr('loading')
    const error = this.attr('error')
    const heading = this.attr('heading', signup ? 'Create your account' : 'Welcome back')
    const description = this.attr('description', signup ? 'Start building expressive interfaces in a few seconds.' : 'Enter your details to continue to your workspace.')
    const actionLabel = this.attr('action-label', signup ? 'Create account' : 'Sign in')
    const field = (name: string, label: string, type: string, autocomplete: string, icon: string, placeholder: string) => `
      <div class="field-group" data-field="${name}">
        <label class="field-label" for="auth-${name}">${label}</label>
        <span class="field-shell">
          ${icon}
          <input class="field-input" id="auth-${name}" part="input" type="${type}" name="${name}" autocomplete="${autocomplete}" placeholder="${placeholder}" aria-describedby="${name}-validation" required ${loading ? 'disabled' : ''}/>
          ${type === 'password' ? `<button class="reveal" type="button" data-reveal="${name}" aria-label="Show ${label.toLowerCase()}" aria-pressed="false" ${loading ? 'disabled' : ''}>${this.eyeIcon}</button>` : ''}
        </span>
        ${name === 'password' && signup ? '<span class="strength" data-score="0" role="meter" aria-valuemin="0" aria-valuemax="4" aria-valuenow="0" aria-label="Password strength"><span></span><span></span><span></span><span></span></span>' : ''}
        <span class="validation" id="${name}-validation" aria-live="polite"></span>
      </div>
    `

    return `
      <section class="auth-card" part="card">
        <div class="brand"><span class="brand-mark">K/</span><span class="brand-name">Secure workspace</span></div>
        <p class="eyebrow">${signup ? 'New account' : 'Account access'}</p>
        <h2>${escapeHTML(heading)}</h2>
        <p class="description">${escapeHTML(description)}</p>
        ${error ? `<div class="server-error" role="alert">${escapeHTML(error)}</div>` : ''}
        <form novalidate aria-busy="${loading}">
          ${signup ? field('name', 'Full name', 'text', 'name', this.userIcon, 'Alex Morgan') : ''}
          ${field('email', 'Email address', 'email', 'email', this.mailIcon, 'you@company.com')}
          ${field('password', 'Password', 'password', signup ? 'new-password' : 'current-password', this.lockIcon, signup ? 'At least 8 characters' : 'Enter your password')}
          ${signup ? field('confirm', 'Confirm password', 'password', 'new-password', this.lockIcon, 'Repeat your password') : ''}
          ${signup ? `
            <label class="remember terms">
              <input type="checkbox" name="terms" aria-describedby="terms-validation" required ${loading ? 'disabled' : ''}/>
              <span class="check-box">${this.checkIcon}</span>
              <span>I agree to the <a href="${escapeHTML(this.attr('terms-href', '#'))}">Terms and Privacy Policy</a>.</span>
            </label>
            <span class="terms-validation" id="terms-validation" aria-live="polite">Accept the terms to create your account.</span>
          ` : `
            <div class="form-row">
              <label class="remember"><input type="checkbox" name="remember" ${loading ? 'disabled' : ''}/><span class="check-box">${this.checkIcon}</span><span>Remember me</span></label>
              <a class="forgot" href="${escapeHTML(this.attr('forgot-href', '#'))}">Forgot password?</a>
            </div>
          `}
          <button class="submit" part="submit" type="submit" ${loading ? 'disabled' : ''}><span class="spinner" aria-hidden="true"></span><span class="submit-label">${escapeHTML(loading ? 'Please wait…' : actionLabel)}</span></button>
          ${this.boolAttr('hide-switch') ? '' : `<p class="switch-copy">${signup ? 'Already have an account?' : 'New to the workspace?'} <button class="mode-switch" type="button" ${loading ? 'disabled' : ''}>${signup ? 'Sign in' : 'Create account'}</button></p>`}
        </form>
      </section>
    `
  }

  protected setup(): void {
    this.cleanup()
    this.renderedMode = this.mode
    this.form = this.root.querySelector('form') as HTMLFormElement | null ?? undefined

    this.onSubmit = (event: SubmitEvent) => {
      event.preventDefault()
      if (!this.form || this.boolAttr('loading')) return
      const valid = this.validate()
      if (!valid) return
      const data = new FormData(this.form)
      const detail: AuthSubmitDetail = {
        mode: this.mode,
        email: String(data.get('email') ?? '').trim(),
        password: String(data.get('password') ?? ''),
        remember: data.get('remember') === 'on',
      }
      if (this.mode === 'signup') detail.name = String(data.get('name') ?? '').trim()
      this.dispatchEvent(new CustomEvent<AuthSubmitDetail>('kayf-submit', { bubbles: true, composed: true, detail }))
    }

    this.onInput = (event: Event) => {
      const input = event.target as HTMLInputElement
      input.removeAttribute('aria-invalid')
      const group = input.closest<HTMLElement>('.field-group')
      group?.classList.remove('is-invalid')
      const validation = group?.querySelector('.validation')
      if (validation) validation.textContent = ''
      if (input.name === 'terms') input.closest('.terms')?.classList.remove('is-invalid')
      if (input.name === 'password' && this.mode === 'signup') this.updateStrength(input.value)
    }

    this.onClick = (event: Event) => {
      const target = event.target as HTMLElement
      const reveal = target.closest<HTMLButtonElement>('[data-reveal]')
      if (reveal?.dataset.reveal) {
        const input = this.form?.elements.namedItem(reveal.dataset.reveal) as HTMLInputElement | null
        if (!input) return
        const visible = input.type === 'text'
        input.type = visible ? 'password' : 'text'
        reveal.setAttribute('aria-pressed', String(!visible))
        reveal.setAttribute('aria-label', `${visible ? 'Show' : 'Hide'} ${reveal.dataset.reveal === 'confirm' ? 'confirm password' : 'password'}`)
        input.focus()
        return
      }
      if (target.closest('.mode-switch')) {
        const next: AuthMode = this.mode === 'signin' ? 'signup' : 'signin'
        this.setAttribute('mode', next)
        this.focus()
        this.dispatchEvent(new CustomEvent('kayf-mode-change', { bubbles: true, composed: true, detail: { mode: next } }))
      }
    }

    this.onPointerMove = (event: PointerEvent) => {
      const shell = (event.target as HTMLElement).closest<HTMLElement>('.field-shell')
      if (!shell || event.pointerType === 'touch') return
      const rect = shell.getBoundingClientRect()
      shell.style.setProperty('--field-x', `${Math.min(100, Math.max(0, ((event.clientX - rect.left) / rect.width) * 100)).toFixed(1)}%`)
    }

    this.form?.addEventListener('submit', this.onSubmit)
    this.form?.addEventListener('input', this.onInput)
    this.form?.addEventListener('click', this.onClick)
    this.form?.addEventListener('pointermove', this.onPointerMove)
  }

  protected cleanup(): void {
    this.form?.removeEventListener('submit', this.onSubmit as EventListener)
    this.form?.removeEventListener('input', this.onInput as EventListener)
    this.form?.removeEventListener('click', this.onClick as EventListener)
    this.form?.removeEventListener('pointermove', this.onPointerMove as EventListener)
  }

  private validate(): boolean {
    if (!this.form) return false
    this.form.querySelectorAll('.is-invalid').forEach(group => group.classList.remove('is-invalid'))
    this.form.querySelectorAll('[aria-invalid]').forEach(input => input.removeAttribute('aria-invalid'))
    this.form.querySelectorAll('.validation').forEach(output => output.textContent = '')
    let firstInvalid: HTMLInputElement | undefined
    const setInvalid = (name: string, message: string): void => {
      const input = this.form?.elements.namedItem(name) as HTMLInputElement | null
      input?.setAttribute('aria-invalid', 'true')
      const group = input?.closest<HTMLElement>('.field-group')
      group?.classList.add('is-invalid')
      const output = group?.querySelector('.validation')
      if (output) output.textContent = message
      if (!firstInvalid && input) firstInvalid = input
    }

    const data = new FormData(this.form)
    const name = String(data.get('name') ?? '').trim()
    const email = String(data.get('email') ?? '').trim()
    const password = String(data.get('password') ?? '')
    const confirm = String(data.get('confirm') ?? '')
    if (this.mode === 'signup' && name.length < 2) setInvalid('name', 'Enter at least 2 characters.')
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) setInvalid('email', 'Enter a valid email address.')
    if (this.mode === 'signup' && password.length < 8) setInvalid('password', 'Password must contain at least 8 characters.')
    if (this.mode === 'signin' && !password) setInvalid('password', 'Enter your password.')
    if (this.mode === 'signup' && confirm !== password) setInvalid('confirm', 'Passwords do not match.')
    if (this.mode === 'signup' && data.get('terms') !== 'on') {
      const terms = this.form.querySelector<HTMLInputElement>('input[name="terms"]')
      terms?.setAttribute('aria-invalid', 'true')
      terms?.closest('.terms')?.classList.add('is-invalid')
      if (!firstInvalid && terms) firstInvalid = terms
    }
    firstInvalid?.focus()
    return !firstInvalid
  }

  private updateStrength(password: string): void {
    let score = 0
    if (password.length >= 8) score++
    if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score++
    if (/\d/.test(password)) score++
    if (/[^\w\s]/.test(password)) score++
    const strength = this.root.querySelector('.strength')
    strength?.setAttribute('data-score', String(score))
    strength?.setAttribute('aria-valuenow', String(score))
    strength?.setAttribute('aria-label', `Password strength: ${['Empty or very weak', 'Weak', 'Fair', 'Good', 'Strong'][score]}`)
  }

  private get mailIcon(): string { return '<svg class="field-icon" viewBox="0 0 20 20" fill="none" aria-hidden="true"><rect x="2.5" y="4" width="15" height="12" rx="3" stroke="currentColor" stroke-width="1.4"/><path d="m4 6 6 4.5L16 6" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg>' }
  private get lockIcon(): string { return '<svg class="field-icon" viewBox="0 0 20 20" fill="none" aria-hidden="true"><rect x="3.5" y="8" width="13" height="9" rx="3" stroke="currentColor" stroke-width="1.4"/><path d="M6.5 8V6.2a3.5 3.5 0 0 1 7 0V8M10 11.5v2" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>' }
  private get userIcon(): string { return '<svg class="field-icon" viewBox="0 0 20 20" fill="none" aria-hidden="true"><circle cx="10" cy="6.5" r="3" stroke="currentColor" stroke-width="1.4"/><path d="M4.5 16c.5-3 2.35-4.5 5.5-4.5s5 1.5 5.5 4.5" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>' }
  private get eyeIcon(): string { return '<svg viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M2.5 10s2.7-4.5 7.5-4.5 7.5 4.5 7.5 4.5-2.7 4.5-7.5 4.5S2.5 10 2.5 10Z" stroke="currentColor" stroke-width="1.4"/><circle cx="10" cy="10" r="2" stroke="currentColor" stroke-width="1.4"/></svg>' }
  private get checkIcon(): string { return '<svg viewBox="0 0 12 12" fill="none" aria-hidden="true"><path d="m2.5 6.1 2.1 2.1 4.9-4.9" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>' }
}

if (!customElements.get('kayf-auth-form')) {
  customElements.define('kayf-auth-form', AuthForm)
}
