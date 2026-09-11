import { KayfElement } from '../../core/KayfElement'
import { baseCSS, ColorVariant, getColor } from '../../core/tokens'
import { escapeHTML, formControlCSS } from '../../core/formStyles'
import { phoneCountrySeeds } from './countryData'

export interface PhoneCountry {
  code: string
  name: string
  dialCode: string
  flag: string
  example: string
  groups: number[]
  minLength: number
  maxLength: number
  leadingDigits?: string
}

const flagFor = (code: string): string =>
  String.fromCodePoint(...[...code].map(letter => 127397 + letter.charCodeAt(0)))

/** All 245 countries and territories with an assigned geographical calling code. */
export const phoneCountries: readonly PhoneCountry[] = Object.freeze(phoneCountrySeeds
  .map(country => Object.freeze({ ...country, flag: flagFor(country.code) }))
  .sort((a, b) => a.name.localeCompare(b.name)))

const byCode = (code: string): PhoneCountry =>
  phoneCountries.find(country => country.code === code.toUpperCase())
  ?? phoneCountries.find(country => country.code === 'US')!

const detectCountry = (digits: string, preferred: string): PhoneCountry => {
  const matches = phoneCountries
    .filter(country => digits.startsWith(country.dialCode))
    .sort((a, b) => b.dialCode.length - a.dialCode.length)
  const longest = matches.filter(country => country.dialCode.length === matches[0]?.dialCode.length)
  const nationalNumber = digits.slice(longest[0]?.dialCode.length ?? 0)
  const regionalMatch = longest.find(country => {
    if (!country.leadingDigits) return false
    try {
      return new RegExp(`^(?:${country.leadingDigits})`).test(nationalNumber)
    } catch {
      return false
    }
  })
  return regionalMatch
    ?? longest.find(country => country.code === preferred)
    ?? longest[0]
    ?? byCode(preferred)
}

const groupDigits = (digits: string, groups: number[]): string => {
  const chunks: string[] = []
  let index = 0
  for (const size of groups) {
    if (index >= digits.length) break
    chunks.push(digits.slice(index, index + size))
    index += size
  }
  if (index < digits.length) chunks.push(digits.slice(index))
  return chunks.join(' ')
}

/** International phone field with country-code detection and E.164 output. */
export class PhoneInput extends KayfElement {
  private reflectingState = false
  private selectedCode = ''
  private nationalDigits = ''
  private lastCountryAttribute?: string
  private lastValueAttribute?: string
  private input?: HTMLInputElement
  private select?: HTMLSelectElement
  private onInput?: (event: Event) => void
  private onChange?: () => void
  private onCountryChange?: () => void
  private onClear?: () => void
  private onPointerMove?: (event: PointerEvent) => void
  private onKeydown?: (event: KeyboardEvent) => void

  protected override update(): void {
    const focused = this.root.activeElement === this.input && Boolean(this.input)
    const start = this.input?.selectionStart ?? 0
    const end = this.input?.selectionEnd ?? start
    super.update()
    if (focused && !this.boolAttr('disabled')) {
      this.input?.focus()
      this.input?.setSelectionRange(start, end)
    }
  }

  static override get observedAttributes() {
    return ['country', 'value', 'label', 'placeholder', 'hint', 'error', 'disabled', 'required', 'name', 'color']
  }

  override attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void {
    if (!this.reflectingState) super.attributeChangedCallback(name, oldValue, newValue)
  }

  get value(): string {
    const country = byCode(this.selectedCode || this.attr('country', 'US'))
    return this.nationalDigits ? `+${country.dialCode}${this.nationalDigits}` : ''
  }

  set value(next: string) {
    this.setAttribute('value', next)
  }

  get country(): string {
    return this.selectedCode || byCode(this.attr('country', 'US')).code
  }

  set country(next: string) {
    this.setAttribute('country', byCode(next).code)
  }

  override focus(options?: FocusOptions): void {
    this.input?.focus(options)
  }

  protected styles(): string {
    const accent = getColor(this.attr('color', 'cyan') as ColorVariant)
    return baseCSS + formControlCSS + `
      :host { display: block; width: 100%; max-width: 520px; --field-accent: ${accent}; }
      .phone-field { display: block; }
      .field-shell { padding: 0 12px 0 0; }

      .country-picker {
        position: relative;
        display: grid;
        min-width: 114px;
        height: 100%;
        grid-template-columns: auto 1fr auto;
        align-items: center;
        gap: 8px;
        padding: 0 13px;
        border-right: 1px solid rgba(255,255,255,0.075);
        transition: background 180ms ease;
      }

      .country-picker:hover { background: rgba(255,255,255,0.035); }
      .country-picker:focus-within { background: color-mix(in srgb, ${accent} 7%, transparent); }
      .flag { font-size: 17px; filter: saturate(0.9); }
      .dial { color: rgba(244,244,247,0.72); font: 600 12px/1 var(--kayf-font-mono); }
      .chevron { width: 12px; color: rgba(228,228,231,0.34); transition: transform 180ms ease, color 180ms ease; }
      .country-picker:focus-within .chevron { color: ${accent}; transform: translateY(1px); }

      .country-select {
        position: absolute;
        inset: 0;
        width: 100%;
        cursor: pointer;
        opacity: 0;
      }

      .country-select:disabled { cursor: not-allowed; }
      .input-wrap { display: flex; min-width: 0; flex: 1; align-items: center; padding-left: 15px; }
      .field-input { height: 52px; font-family: var(--kayf-font-mono); letter-spacing: 0.015em; }

      .clear {
        display: grid;
        width: 28px;
        height: 28px;
        flex: none;
        place-items: center;
        border: 0;
        border-radius: 9px;
        color: rgba(228,228,231,0.38);
        background: transparent;
        cursor: pointer;
        opacity: 0;
        pointer-events: none;
        transform: scale(0.85);
        transition: opacity 160ms ease, transform 160ms ease, color 160ms ease, background 160ms ease;
      }

      .clear.is-visible { opacity: 1; pointer-events: auto; transform: scale(1); }
      .clear:hover { color: #f4f4f7; background: rgba(255,255,255,0.07); }
      .clear:focus-visible { outline: 2px solid ${accent}; outline-offset: 2px; }
      .validity { color: color-mix(in srgb, ${accent} 62%, white); }

      @media (max-width: 420px) {
        .country-picker { min-width: 100px; padding-inline: 10px; }
        .input-wrap { padding-left: 11px; }
      }
    `
  }

  protected template(): string {
    const selected = byCode(this.selectedCode || this.attr('country', 'US'))
    const label = this.attr('label', 'Phone number')
    const error = this.attr('error')
    const hint = this.attr('hint', `Example: +${selected.dialCode} ${groupDigits(selected.example, selected.groups)}`)
    const disabled = this.boolAttr('disabled')
    const required = this.boolAttr('required')
    return `
      <div class="phone-field">
        <label class="field-label" for="phone-number">${escapeHTML(label)}${required ? ' <span aria-hidden="true">*</span>' : ''}</label>
        <span class="field-shell${error ? ' is-invalid' : ''}${disabled ? ' is-disabled' : ''}">
          <span class="country-picker">
            <span class="flag" aria-hidden="true">${selected.flag}</span>
            <span class="dial">+${selected.dialCode}</span>
            <svg class="chevron" viewBox="0 0 12 12" fill="none" aria-hidden="true"><path d="m3 4.75 3 3 3-3" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg>
            <select class="country-select" aria-label="Country calling code" ${disabled ? 'disabled' : ''}>
              ${phoneCountries.map(country => `<option value="${country.code}"${country.code === selected.code ? ' selected' : ''}>${country.flag} ${escapeHTML(country.name)} (+${country.dialCode})</option>`).join('')}
            </select>
          </span>
          <span class="input-wrap">
            <input
              class="field-input"
              id="phone-number"
              type="tel"
              inputmode="tel"
              autocomplete="tel"
              name="${escapeHTML(this.attr('name', 'phone'))}"
              placeholder="${escapeHTML(this.attr('placeholder', `+${selected.dialCode} ${groupDigits(selected.example, selected.groups)}`))}"
              aria-invalid="${Boolean(error)}"
              aria-describedby="phone-message"
              ${required ? 'required' : ''}
              ${disabled ? 'disabled' : ''}
            />
          </span>
          <button class="clear" type="button" aria-label="Clear phone number" aria-hidden="true" tabindex="-1" ${disabled ? 'disabled' : ''}>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true"><path d="m3 3 6 6M9 3 3 9" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>
          </button>
        </span>
        <span class="field-message${error ? ' is-error' : ''}" id="phone-message">
          <span class="message-copy">${escapeHTML(error || hint)}</span>
          <span class="validity" aria-live="polite"></span>
        </span>
      </div>
    `
  }

  protected setup(): void {
    this.cleanup()
    const attrCountry = byCode(this.attr('country', this.selectedCode || 'US'))
    const attrValue = this.attr('value')
    const countryAttribute = this.attr('country', 'US')
    if (countryAttribute !== this.lastCountryAttribute) {
      this.selectedCode = attrCountry.code
      this.nationalDigits = this.nationalDigits.slice(0, attrCountry.maxLength)
      this.lastCountryAttribute = countryAttribute
    }
    if (attrValue !== this.lastValueAttribute) {
      this.nationalDigits = ''
      if (attrValue) this.consumeRawValue(attrValue)
      this.lastValueAttribute = attrValue
    }

    this.input = this.root.querySelector('.field-input') as HTMLInputElement | null ?? undefined
    this.select = this.root.querySelector('.country-select') as HTMLSelectElement | null ?? undefined
    this.syncView()

    this.onInput = () => {
      if (!this.input) return
      const digitsAfterCaret = this.input.value.slice(this.input.selectionStart ?? this.input.value.length).replace(/\D/g, '').length
      this.consumeRawValue(this.input.value)
      this.reflectValue()
      this.syncView()
      let caret = this.input.value.length
      let remaining = digitsAfterCaret
      while (caret > 0 && remaining > 0) {
        caret--
        if (/\d/.test(this.input.value[caret])) remaining--
      }
      this.input.setSelectionRange(caret, caret)
      this.emitPhoneEvent('kayf-input')
    }

    this.onKeydown = (event: KeyboardEvent) => {
      if (!this.input || event.altKey || event.ctrlKey || event.metaKey || this.input.selectionStart !== this.input.selectionEnd) return
      const caret = this.input.selectionStart ?? 0
      // Treat formatting spaces as transparent to deletion.
      if (event.key === 'Backspace' && this.input.value[caret - 1] === ' ') {
        this.input.setSelectionRange(Math.max(0, caret - 2), caret)
      } else if (event.key === 'Delete' && this.input.value[caret] === ' ') {
        this.input.setSelectionRange(caret, caret + 2)
      }
    }

    this.onChange = () => {
      this.reflectValue()
      this.emitPhoneEvent('kayf-change')
    }

    this.onCountryChange = () => {
      if (!this.select) return
      this.selectedCode = this.select.value
      const country = byCode(this.selectedCode)
      this.nationalDigits = this.nationalDigits.slice(0, Math.min(country.maxLength, 15 - country.dialCode.length))
      this.syncView()
      this.reflectValue()
      this.emitPhoneEvent('kayf-change')
    }

    this.onClear = () => {
      this.nationalDigits = ''
      this.reflectValue()
      this.syncView()
      this.input?.focus()
      this.emitPhoneEvent('kayf-input')
      this.emitPhoneEvent('kayf-change')
    }

    this.onPointerMove = (event: PointerEvent) => {
      const shell = this.root.querySelector('.field-shell') as HTMLElement | null
      if (!shell || event.pointerType === 'touch') return
      const rect = shell.getBoundingClientRect()
      const x = Math.min(100, Math.max(0, ((event.clientX - rect.left) / rect.width) * 100))
      shell.style.setProperty('--field-x', `${x.toFixed(1)}%`)
    }

    this.input?.addEventListener('input', this.onInput)
    this.input?.addEventListener('keydown', this.onKeydown)
    this.input?.addEventListener('change', this.onChange)
    this.select?.addEventListener('change', this.onCountryChange)
    this.root.querySelector('.clear')?.addEventListener('click', this.onClear)
    this.root.querySelector<HTMLElement>('.field-shell')?.addEventListener('pointermove', this.onPointerMove)
  }

  protected cleanup(): void {
    this.input?.removeEventListener('input', this.onInput as EventListener)
    this.input?.removeEventListener('keydown', this.onKeydown as EventListener)
    this.input?.removeEventListener('change', this.onChange as EventListener)
    this.select?.removeEventListener('change', this.onCountryChange as EventListener)
    this.root.querySelector('.clear')?.removeEventListener('click', this.onClear as EventListener)
    this.root.querySelector('.field-shell')?.removeEventListener('pointermove', this.onPointerMove as EventListener)
  }

  private consumeRawValue(raw: string): void {
    const digits = raw.replace(/\D/g, '')
    const hasInternationalPrefix = raw.trim().startsWith('+')
    if (hasInternationalPrefix && digits) {
      const country = detectCountry(digits, this.selectedCode || this.attr('country', 'US'))
      this.selectedCode = country.code
      this.nationalDigits = digits.slice(country.dialCode.length, Math.min(15, country.dialCode.length + country.maxLength))
      return
    }
    const country = byCode(this.selectedCode || this.attr('country', 'US'))
    this.nationalDigits = digits.slice(0, Math.min(country.maxLength, 15 - country.dialCode.length))
  }

  private syncView(): void {
    if (!this.input) return
    const country = byCode(this.selectedCode || this.attr('country', 'US'))
    const formattedNational = groupDigits(this.nationalDigits, country.groups)
    this.input.value = this.nationalDigits ? `+${country.dialCode} ${formattedNational}` : ''
    this.input.placeholder = this.attr('placeholder', `+${country.dialCode} ${groupDigits(country.example, country.groups)}`)
    if (this.select) this.select.value = country.code
    const flag = this.root.querySelector('.flag')
    const dial = this.root.querySelector('.dial')
    if (flag) flag.textContent = country.flag
    if (dial) dial.textContent = `+${country.dialCode}`
    const clear = this.root.querySelector<HTMLButtonElement>('.clear')
    clear?.classList.toggle('is-visible', Boolean(this.nationalDigits))
    if (clear) {
      clear.tabIndex = this.nationalDigits && !this.boolAttr('disabled') ? 0 : -1
      clear.setAttribute('aria-hidden', String(!this.nationalDigits))
    }
    const validity = this.root.querySelector('.validity')
    if (validity) validity.textContent = this.nationalDigits ? (this.isValid(country) ? 'Ready' : `${this.nationalDigits.length}/${country.minLength}`) : ''
  }

  private isValid(country = byCode(this.selectedCode || 'US')): boolean {
    return this.nationalDigits.length >= country.minLength && this.nationalDigits.length <= country.maxLength
  }

  private reflectValue(): void {
    const value = this.value
    const country = this.selectedCode || this.attr('country', 'US')
    this.reflectingState = true
    try {
      this.lastCountryAttribute = country
      this.setAttribute('country', country)
      this.lastValueAttribute = value
      if (value) this.setAttribute('value', value)
      else this.removeAttribute('value')
    } finally {
      this.reflectingState = false
    }
  }

  private emitPhoneEvent(type: 'kayf-input' | 'kayf-change'): void {
    const country = byCode(this.selectedCode || this.attr('country', 'US'))
    this.dispatchEvent(new CustomEvent(type, {
      bubbles: true,
      composed: true,
      detail: {
        value: this.input?.value ?? '',
        e164: this.value,
        country: country.code,
        dialCode: `+${country.dialCode}`,
        nationalNumber: this.nationalDigits,
        valid: this.isValid(country),
      },
    }))
  }
}

if (!customElements.get('kayf-phone-input')) {
  customElements.define('kayf-phone-input', PhoneInput)
}
