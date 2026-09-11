import { KayfElement } from '../../core/KayfElement'
import { baseCSS, ColorVariant, getColor } from '../../core/tokens'
import { escapeHTML } from '../../core/formStyles'

export interface LanguageOption {
  code: string
  label: string
  nativeLabel?: string
  flag?: string
}

export const defaultLanguages: readonly LanguageOption[] = [
  { code: 'en', label: 'English', nativeLabel: 'English', flag: '🇬🇧' },
  { code: 'de', label: 'German', nativeLabel: 'Deutsch', flag: '🇩🇪' },
  { code: 'uk', label: 'Ukrainian', nativeLabel: 'Українська', flag: '🇺🇦' },
  { code: 'fr', label: 'French', nativeLabel: 'Français', flag: '🇫🇷' },
  { code: 'es', label: 'Spanish', nativeLabel: 'Español', flag: '🇪🇸' },
] as const

/** Animated, keyboard-accessible language picker. */
export class LanguageSwitcher extends KayfElement {
  private options: LanguageOption[] = [...defaultLanguages]
  private trigger?: HTMLButtonElement
  private menu?: HTMLElement
  private onTriggerClick?: () => void
  private onTriggerKeydown?: (event: KeyboardEvent) => void
  private onMenuClick?: (event: Event) => void
  private onMenuKeydown?: (event: KeyboardEvent) => void
  private onDocumentPointerDown?: (event: PointerEvent) => void
  private onFocusOut?: () => void
  private focusFrame = 0

  static override get observedAttributes() {
    return ['value', 'label', 'compact', 'disabled', 'color']
  }

  get languages(): LanguageOption[] {
    return this.options.map(option => ({ ...option }))
  }

  set languages(next: LanguageOption[]) {
    const seen = new Set<string>()
    this.options = next.filter(option => {
      if (!option?.code || !option?.label || seen.has(option.code)) return false
      seen.add(option.code)
      return true
    }).map(option => ({ ...option }))
    if (this.isConnected) this.update()
  }

  get value(): string {
    return this.options.find(option => option.code === this.attr('value'))?.code ?? this.options[0]?.code ?? ''
  }

  set value(next: string) {
    this.setAttribute('value', next)
  }

  setLanguages(next: LanguageOption[]): void {
    this.languages = next
  }

  override focus(options?: FocusOptions): void {
    this.trigger?.focus(options)
  }

  protected styles(): string {
    const accent = getColor(this.attr('color', 'violet') as ColorVariant)
    return baseCSS + `
      *, *::before, *::after { box-sizing: border-box; }
      :host { position: relative; display: inline-block; min-width: 210px; font-family: var(--kayf-font-sans); }
      :host([compact]) { min-width: 74px; }

      .switcher { position: relative; }
      .label { display: block; margin: 0 0 8px 2px; color: rgba(228,228,231,0.66); font-size: 10px; font-weight: 650; letter-spacing: 0.1em; text-transform: uppercase; }
      :host([compact]) .label { display: none; }

      .trigger {
        position: relative;
        display: grid;
        width: 100%;
        min-height: 46px;
        grid-template-columns: auto 1fr auto;
        align-items: center;
        gap: 10px;
        padding: 5px 10px 5px 12px;
        overflow: hidden;
        border: 1px solid rgba(255,255,255,0.09);
        border-radius: 14px;
        color: var(--kayf-text);
        background: linear-gradient(180deg, rgba(24,24,32,0.95), rgba(13,13,18,0.98));
        box-shadow: inset 0 1px 0 rgba(255,255,255,0.05), 0 14px 34px rgba(0,0,0,0.24);
        cursor: pointer;
        outline: none;
        text-align: left;
        isolation: isolate;
        transition: border-color 180ms ease, box-shadow 220ms ease, transform 180ms ease;
      }

      .trigger::before {
        content: '';
        position: absolute;
        inset: 0;
        z-index: -1;
        background: radial-gradient(circle at 14% 0%, color-mix(in srgb, ${accent} 15%, transparent), transparent 45%);
        opacity: 0.5;
        transition: opacity 180ms ease;
      }

      .trigger:hover:not(:disabled) { border-color: color-mix(in srgb, ${accent} 38%, rgba(255,255,255,0.12)); transform: translateY(-1px); }
      .trigger:hover:not(:disabled)::before, :host([open]) .trigger::before { opacity: 1; }
      .trigger:focus-visible { border-color: color-mix(in srgb, ${accent} 70%, white); box-shadow: 0 0 0 3px color-mix(in srgb, ${accent} 13%, transparent), 0 16px 36px rgba(0,0,0,0.28); }
      .trigger:disabled { cursor: not-allowed; opacity: 0.45; }

      .flag { font-size: 18px; line-height: 1; }
      .current { min-width: 0; }
      .current strong, .current span { display: block; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
      .current strong { font-size: 12px; font-weight: 650; line-height: 1.2; }
      .current span { margin-top: 2px; color: rgba(228,228,231,0.66); font: 9px/1.2 var(--kayf-font-mono); text-transform: uppercase; }
      :host([compact]) .current { display: none; }

      .chevron-box { display: grid; width: 28px; height: 28px; place-items: center; border: 1px solid rgba(255,255,255,0.065); border-radius: 9px; color: rgba(228,228,231,0.42); background: rgba(255,255,255,0.025); }
      .chevron-box svg { width: 13px; transition: transform 220ms cubic-bezier(.2,.8,.2,1); }
      :host([open]) .chevron-box svg { transform: rotate(180deg); }

      .menu {
        position: absolute;
        z-index: 20;
        top: calc(100% + 9px);
        right: 0;
        left: 0;
        display: grid;
        gap: 3px;
        padding: 6px;
        max-height: min(320px, 60vh);
        overflow-y: auto;
        overscroll-behavior: contain;
        border: 1px solid rgba(255,255,255,0.1);
        border-radius: 16px;
        background: rgba(12,12,17,0.96);
        box-shadow: 0 24px 70px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.045);
        backdrop-filter: blur(20px);
        opacity: 0;
        pointer-events: none;
        transform: translateY(-7px) scale(0.98);
        transform-origin: top;
        transition: opacity 170ms ease, transform 220ms cubic-bezier(.2,.8,.2,1);
      }

      :host([open]) .menu { opacity: 1; pointer-events: auto; transform: translateY(0) scale(1); }
      :host([compact]) .menu { right: 0; left: auto; width: 220px; }

      .option {
        display: grid;
        width: 100%;
        min-height: 44px;
        grid-template-columns: 28px 1fr auto;
        align-items: center;
        gap: 9px;
        padding: 6px 9px;
        border: 0;
        border-radius: 11px;
        color: rgba(244,244,247,0.72);
        background: transparent;
        cursor: pointer;
        outline: none;
        text-align: left;
        transition: color 150ms ease, background 150ms ease, transform 150ms ease;
      }

      .option:hover, .option:focus-visible { color: #f4f4f7; background: rgba(255,255,255,0.055); transform: translateX(2px); }
      .option[aria-selected='true'] { color: #f4f4f7; background: color-mix(in srgb, ${accent} 11%, transparent); }
      .option-copy strong, .option-copy span { display: block; }
      .option-copy strong { font-size: 12px; font-weight: 620; }
      .option-copy span { margin-top: 3px; color: rgba(228,228,231,0.66); font-size: 10px; }
      .check { width: 16px; color: ${accent}; opacity: 0; transform: scale(0.6); transition: opacity 160ms ease, transform 180ms ease; }
      .option[aria-selected='true'] .check { opacity: 1; transform: scale(1); }

      @media (prefers-reduced-motion: reduce) {
        .trigger, .trigger::before, .chevron-box svg, .menu, .option, .check { transition-duration: 0.01ms; }
        .trigger:hover:not(:disabled), .option:hover, .option:focus-visible { transform: none; }
      }
    `
  }

  protected template(): string {
    const current = this.options.find(option => option.code === this.value) ?? this.options[0]
    const disabled = this.boolAttr('disabled')
    if (!current) return '<span>No languages available</span>'
    return `
      <div class="switcher">
        <span class="label">${escapeHTML(this.attr('label', 'Language'))}</span>
        <button class="trigger" part="trigger" type="button" aria-label="${escapeHTML(this.attr('label', 'Language'))}: ${escapeHTML(current.nativeLabel ?? current.label)}" aria-controls="language-menu" aria-haspopup="listbox" aria-expanded="false" ${disabled ? 'disabled' : ''}>
          <span class="flag" aria-hidden="true">${escapeHTML(current.flag ?? current.code.toUpperCase())}</span>
          <span class="current"><strong>${escapeHTML(current.nativeLabel ?? current.label)}</strong><span>${escapeHTML(current.code)}</span></span>
          <span class="chevron-box" aria-hidden="true"><svg viewBox="0 0 14 14" fill="none"><path d="m3.5 5.25 3.5 3.5 3.5-3.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg></span>
        </button>
        <div class="menu" id="language-menu" part="menu" role="listbox" aria-label="${escapeHTML(this.attr('label', 'Language'))}" aria-hidden="true" inert>
          ${this.options.map(option => `
            <button class="option" part="option" type="button" role="option" data-code="${escapeHTML(option.code)}" aria-selected="${option.code === current.code}" tabindex="-1">
              <span class="flag" aria-hidden="true">${escapeHTML(option.flag ?? option.code.toUpperCase())}</span>
              <span class="option-copy"><strong>${escapeHTML(option.nativeLabel ?? option.label)}</strong><span>${escapeHTML(option.label)}</span></span>
              <svg class="check" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="m3.5 8.2 2.8 2.8 6.2-6.3" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </button>
          `).join('')}
        </div>
      </div>
    `
  }

  protected setup(): void {
    this.cleanup()
    this.removeAttribute('open')
    this.trigger = this.root.querySelector('.trigger') as HTMLButtonElement | null ?? undefined
    this.menu = this.root.querySelector('.menu') as HTMLElement | null ?? undefined

    this.onTriggerClick = () => this.toggleMenu()
    this.onTriggerKeydown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowDown' || event.key === 'ArrowUp' || event.key === 'Enter' || event.key === ' ') {
        event.preventDefault()
        this.openMenu(event.key === 'ArrowUp' ? this.options.length - 1 : this.selectedIndex)
      }
    }
    this.onMenuClick = (event: Event) => {
      const option = (event.target as HTMLElement).closest<HTMLButtonElement>('.option')
      if (option?.dataset.code) this.selectLanguage(option.dataset.code)
    }
    this.onMenuKeydown = (event: KeyboardEvent) => {
      const buttons = this.optionButtons
      const index = buttons.indexOf(this.root.activeElement as HTMLButtonElement)
      if (event.key === 'Escape') {
        event.preventDefault()
        this.closeMenu(true)
      } else if (event.key === 'Tab') {
        // Resume the browser's normal tab order from the trigger.
        this.closeMenu(true)
      } else if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
        event.preventDefault()
        const direction = event.key === 'ArrowDown' ? 1 : -1
        buttons[(index + direction + buttons.length) % buttons.length]?.focus()
      } else if (event.key === 'Home' || event.key === 'End') {
        event.preventDefault()
        buttons[event.key === 'Home' ? 0 : buttons.length - 1]?.focus()
      }
    }
    this.onDocumentPointerDown = (event: PointerEvent) => {
      if (!event.composedPath().includes(this)) this.closeMenu()
    }
    this.onFocusOut = () => queueMicrotask(() => {
      if (!this.root.activeElement) this.closeMenu()
    })

    this.trigger?.addEventListener('click', this.onTriggerClick)
    this.trigger?.addEventListener('keydown', this.onTriggerKeydown)
    this.menu?.addEventListener('click', this.onMenuClick)
    this.menu?.addEventListener('keydown', this.onMenuKeydown)
    document.addEventListener('pointerdown', this.onDocumentPointerDown)
    this.root.addEventListener('focusout', this.onFocusOut)
  }

  protected cleanup(): void {
    this.trigger?.removeEventListener('click', this.onTriggerClick as EventListener)
    this.trigger?.removeEventListener('keydown', this.onTriggerKeydown as EventListener)
    this.menu?.removeEventListener('click', this.onMenuClick as EventListener)
    this.menu?.removeEventListener('keydown', this.onMenuKeydown as EventListener)
    document.removeEventListener('pointerdown', this.onDocumentPointerDown as EventListener)
    this.root.removeEventListener('focusout', this.onFocusOut as EventListener)
    cancelAnimationFrame(this.focusFrame)
  }

  private get selectedIndex(): number {
    const index = this.options.findIndex(option => option.code === this.value)
    return Math.max(0, index)
  }

  private get optionButtons(): HTMLButtonElement[] {
    return Array.from(this.root.querySelectorAll<HTMLButtonElement>('.option'))
  }

  private toggleMenu(): void {
    if (this.hasAttribute('open')) this.closeMenu(true)
    else this.openMenu(this.selectedIndex)
  }

  private openMenu(index: number): void {
    if (this.boolAttr('disabled')) return
    this.setAttribute('open', '')
    this.trigger?.setAttribute('aria-expanded', 'true')
    this.menu?.removeAttribute('inert')
    this.menu?.setAttribute('aria-hidden', 'false')
    this.focusFrame = requestAnimationFrame(() => {
      if (this.isConnected && this.hasAttribute('open')) this.optionButtons[index]?.focus()
    })
  }

  private closeMenu(restoreFocus = false): void {
    if (!this.hasAttribute('open')) return
    cancelAnimationFrame(this.focusFrame)
    this.removeAttribute('open')
    this.trigger?.setAttribute('aria-expanded', 'false')
    this.menu?.setAttribute('inert', '')
    this.menu?.setAttribute('aria-hidden', 'true')
    this.optionButtons.forEach(button => button.tabIndex = -1)
    if (restoreFocus) this.trigger?.focus()
  }

  private selectLanguage(code: string): void {
    const option = this.options.find(language => language.code === code)
    if (!option || option.code === this.value) {
      this.closeMenu(true)
      return
    }
    this.setAttribute('value', option.code)
    this.trigger?.focus()
    this.dispatchEvent(new CustomEvent('kayf-language-change', {
      bubbles: true,
      composed: true,
      detail: { ...option },
    }))
  }
}

if (!customElements.get('kayf-language-switcher')) {
  customElements.define('kayf-language-switcher', LanguageSwitcher)
}
