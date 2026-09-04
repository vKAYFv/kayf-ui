import { KayfElement } from '../../core/KayfElement'
import {
  ActionButtonSize,
  actionButtonBaseCSS,
  actionButtonSizes,
} from '../../core/ActionButtonElement'
import { baseCSS, ColorVariant, getColor } from '../../core/tokens'

const clamp = (value: number, min: number, max: number, fallback: number): number =>
  Number.isFinite(value) ? Math.min(max, Math.max(min, value)) : fallback

/** A deliberate press-and-hold control for consequential actions. */
export class HoldButton extends KayfElement {
  private control?: HTMLButtonElement
  private hint?: HTMLElement
  private frame = 0
  private resetTimer = 0
  private startedAt = 0
  private holding = false
  private confirmed = false
  private activePointer?: number
  private activeKey?: string
  private onPointerDown?: (event: PointerEvent) => void
  private onPointerMove?: (event: PointerEvent) => void
  private onPointerEnd?: (event: PointerEvent) => void
  private onKeyDown?: (event: KeyboardEvent) => void
  private onKeyUp?: (event: KeyboardEvent) => void
  private onClick?: (event: MouseEvent) => void

  static override get observedAttributes() {
    return ['color', 'size', 'duration', 'disabled', 'success-label', 'full-width']
  }

  private get color(): ColorVariant {
    return this.attr('color', 'red') as ColorVariant
  }

  private get size(): ActionButtonSize {
    const value = this.attr('size', 'md') as ActionButtonSize
    return actionButtonSizes[value] ? value : 'md'
  }

  private get duration(): number {
    return clamp(this.numAttr('duration', 1200), 500, 5000, 1200)
  }

  private get isDisabled(): boolean {
    return this.boolAttr('disabled')
  }

  private get successLabel(): string {
    return this.attr('success-label', 'Confirmed')
  }

  override focus(options?: FocusOptions): void {
    this.control?.focus(options)
  }

  protected styles(): string {
    const color = getColor(this.color)
    const size = actionButtonSizes[this.size]
    const meterSize = this.size === 'lg' ? '27px' : this.size === 'sm' ? '21px' : '24px'

    return baseCSS + actionButtonBaseCSS + `
      .button {
        --hold-progress: 0;
        position: relative;
        display: inline-flex;
        width: 100%;
        min-width: ${this.size === 'sm' ? '170px' : this.size === 'lg' ? '226px' : '198px'};
        height: ${size.height};
        padding: 0 ${this.size === 'sm' ? '14px' : '17px'};
        align-items: center;
        gap: 11px;
        overflow: hidden;
        border: 1px solid color-mix(in srgb, ${color} 26%, rgba(255,255,255,0.09));
        border-radius: ${size.radius};
        color: #f4f4f7;
        background: linear-gradient(180deg, rgba(25,24,29,0.98), rgba(13,12,16,0.99));
        box-shadow: inset 0 1px 0 rgba(255,255,255,0.065), 0 14px 34px rgba(0,0,0,0.25);
        cursor: pointer;
        outline: none;
        font-family: var(--kayf-font-sans);
        user-select: none;
        touch-action: manipulation;
        transition: border-color 180ms ease, box-shadow 200ms ease, transform 120ms ease, opacity 180ms ease;
      }

      .fill {
        position: absolute;
        inset: 0;
        pointer-events: none;
        background:
          linear-gradient(90deg, color-mix(in srgb, ${color} 20%, transparent), color-mix(in srgb, ${color} 10%, transparent)),
          linear-gradient(180deg, rgba(255,255,255,0.035), transparent);
        transform: scaleX(var(--hold-progress));
        transform-origin: left;
      }

      .meter {
        position: relative;
        z-index: 1;
        display: grid;
        width: ${meterSize};
        height: ${meterSize};
        flex: none;
        place-items: center;
        border-radius: 50%;
        background: conic-gradient(
          color-mix(in srgb, ${color} 84%, white) calc(var(--hold-progress) * 1turn),
          rgba(255,255,255,0.09) 0
        );
        box-shadow: 0 0 0 1px rgba(255,255,255,0.055);
      }

      .meter::after {
        content: '';
        width: calc(${meterSize} - 6px);
        height: calc(${meterSize} - 6px);
        border-radius: 50%;
        background: #111116;
        box-shadow: inset 0 1px 0 rgba(255,255,255,0.07);
      }

      .meter-icon {
        position: absolute;
        z-index: 1;
        width: 7px;
        height: 7px;
        border: 1.5px solid color-mix(in srgb, ${color} 72%, white);
        border-radius: 2px;
        transform: rotate(45deg);
        transition: border-color 160ms ease, background 160ms ease, transform 180ms ease;
      }

      .copy {
        position: relative;
        z-index: 1;
        display: grid;
        min-width: 0;
        gap: 3px;
        text-align: left;
      }

      .label {
        overflow: hidden;
        font-size: ${size.fontSize};
        font-weight: 650;
        line-height: 1;
        letter-spacing: -0.01em;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .hint {
        color: rgba(228,228,231,0.38);
        font-size: ${this.size === 'sm' ? '8px' : '9px'};
        font-weight: 580;
        line-height: 1;
        letter-spacing: 0.08em;
        text-transform: uppercase;
      }

      .button:hover:not(:disabled) {
        border-color: color-mix(in srgb, ${color} 44%, rgba(255,255,255,0.12));
        box-shadow: inset 0 1px 0 rgba(255,255,255,0.085), 0 18px 40px rgba(0,0,0,0.32), 0 0 26px color-mix(in srgb, ${color} 8%, transparent);
      }

      .button.holding {
        border-color: color-mix(in srgb, ${color} 62%, white);
        transform: scale(0.99);
      }

      .button.confirmed {
        border-color: rgba(81,223,164,0.55);
        box-shadow: inset 0 1px 0 rgba(255,255,255,0.09), 0 0 30px rgba(81,223,164,0.12);
      }

      .button.confirmed .fill { background: rgba(81,223,164,0.12); }
      .button.confirmed .meter { background: #51dfa4; }
      .button.confirmed .meter-icon { border-color: #07110d; border-width: 0 2px 2px 0; border-radius: 0; transform: translateY(-1px) rotate(45deg); }
      .button.confirmed .hint { color: rgba(81,223,164,0.72); }

      .button:focus-visible { outline: 2px solid color-mix(in srgb, ${color} 72%, white); outline-offset: 3px; }
      .button:disabled { cursor: not-allowed; opacity: 0.4; }

      @media (prefers-reduced-motion: reduce) {
        .button, .meter-icon { transition-duration: 0.01ms; }
      }
    `
  }

  protected template(): string {
    return `
      <button class="button" part="button" type="button" aria-describedby="hold-instruction">
        <span class="fill" part="progress" aria-hidden="true"></span>
        <span class="meter" part="meter" aria-hidden="true"><span class="meter-icon"></span></span>
        <span class="copy">
          <span class="label" part="label"><slot></slot></span>
          <span class="hint" id="hold-instruction">Press and hold</span>
        </span>
        <span class="sr-only" aria-live="polite"></span>
      </button>
    `
  }

  protected setup(): void {
    this.cleanup()
    this.holding = false
    this.confirmed = false
    this.activePointer = undefined
    this.activeKey = undefined
    this.startedAt = 0
    this.control = this.root.querySelector('button') as HTMLButtonElement | null ?? undefined
    this.hint = this.root.querySelector('.hint') as HTMLElement | null ?? undefined
    if (!this.control) return

    this.control.disabled = this.isDisabled
    this.control.style.setProperty('--hold-progress', '0')

    this.onPointerDown = (event: PointerEvent) => {
      if (event.button !== 0 || !event.isPrimary || this.isDisabled) return
      event.preventDefault()
      this.activePointer = event.pointerId
      this.control?.setPointerCapture(event.pointerId)
      this.startHold()
    }

    this.onPointerMove = (event: PointerEvent) => {
      if (!this.holding || event.pointerId !== this.activePointer || !this.control) return
      const rect = this.control.getBoundingClientRect()
      const isOutside = event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom
      if (isOutside) this.cancelHold()
    }

    this.onPointerEnd = (event: PointerEvent) => {
      if (event.pointerId !== this.activePointer) return
      if (this.control?.hasPointerCapture(event.pointerId)) this.control.releasePointerCapture(event.pointerId)
      this.activePointer = undefined
      if (!this.confirmed) this.cancelHold()
    }

    this.onKeyDown = (event: KeyboardEvent) => {
      if ((event.key !== ' ' && event.key !== 'Enter') || event.repeat || this.isDisabled) return
      event.preventDefault()
      this.activeKey = event.key
      this.startHold()
    }

    this.onKeyUp = (event: KeyboardEvent) => {
      if (event.key !== this.activeKey) return
      event.preventDefault()
      this.activeKey = undefined
      if (!this.confirmed) this.cancelHold()
    }

    this.onClick = (event: MouseEvent) => {
      event.preventDefault()
      event.stopPropagation()
    }

    this.control.addEventListener('pointerdown', this.onPointerDown)
    this.control.addEventListener('pointermove', this.onPointerMove)
    this.control.addEventListener('pointerup', this.onPointerEnd)
    this.control.addEventListener('pointercancel', this.onPointerEnd)
    this.control.addEventListener('keydown', this.onKeyDown)
    this.control.addEventListener('keyup', this.onKeyUp)
    this.control.addEventListener('click', this.onClick)
  }

  protected cleanup(): void {
    cancelAnimationFrame(this.frame)
    window.clearTimeout(this.resetTimer)
    this.frame = 0
    this.resetTimer = 0
    if (!this.control) return
    if (this.onPointerDown) this.control.removeEventListener('pointerdown', this.onPointerDown)
    if (this.onPointerMove) this.control.removeEventListener('pointermove', this.onPointerMove)
    if (this.onPointerEnd) {
      this.control.removeEventListener('pointerup', this.onPointerEnd)
      this.control.removeEventListener('pointercancel', this.onPointerEnd)
    }
    if (this.onKeyDown) this.control.removeEventListener('keydown', this.onKeyDown)
    if (this.onKeyUp) this.control.removeEventListener('keyup', this.onKeyUp)
    if (this.onClick) this.control.removeEventListener('click', this.onClick)
  }

  private startHold(): void {
    if (!this.control || this.holding || this.confirmed) return
    this.holding = true
    this.startedAt = performance.now()
    this.control.classList.add('holding')
    this.frame = requestAnimationFrame(this.updateProgress)
  }

  private cancelHold(): void {
    if (!this.control || this.confirmed) return
    this.holding = false
    cancelAnimationFrame(this.frame)
    this.frame = 0
    this.control.classList.remove('holding')
    this.control.style.setProperty('--hold-progress', '0')
    if (this.hint) this.hint.textContent = 'Press and hold'
  }

  private updateProgress = (now: number): void => {
    if (!this.control || !this.holding) {
      this.frame = 0
      return
    }

    const progress = Math.min(1, (now - this.startedAt) / this.duration)
    this.control.style.setProperty('--hold-progress', progress.toFixed(4))
    if (this.hint) this.hint.textContent = `${Math.round(progress * 100)}%`

    if (progress >= 1) {
      this.completeHold()
    } else {
      this.frame = requestAnimationFrame(this.updateProgress)
    }
  }

  private completeHold(): void {
    if (!this.control) return
    this.holding = false
    this.confirmed = true
    this.frame = 0
    this.control.classList.remove('holding')
    this.control.classList.add('confirmed')
    this.control.style.setProperty('--hold-progress', '1')
    if (this.hint) this.hint.textContent = this.successLabel

    const liveRegion = this.root.querySelector('[aria-live]')
    if (liveRegion) liveRegion.textContent = this.successLabel

    this.dispatchEvent(new CustomEvent('kayf-confirm', {
      bubbles: true,
      composed: true,
      detail: { duration: this.duration },
    }))

    this.resetTimer = window.setTimeout(() => this.reset(), 1400)
  }

  private reset(): void {
    this.confirmed = false
    this.activePointer = undefined
    this.activeKey = undefined
    this.control?.classList.remove('confirmed')
    this.control?.style.setProperty('--hold-progress', '0')
    if (this.hint) this.hint.textContent = 'Press and hold'
    const liveRegion = this.root.querySelector('[aria-live]')
    if (liveRegion) liveRegion.textContent = ''
  }
}

if (!customElements.get('kayf-hold-button')) {
  customElements.define('kayf-hold-button', HoldButton)
}
