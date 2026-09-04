import { KayfElement } from '../../core/KayfElement'
import { baseCSS, getColor, ColorVariant } from '../../core/tokens'

/**
 * <kayf-beam-button>
 *
 * Атрибуты:
 *   color    — cyan | violet | emerald | amber | red (default: cyan)
 *   variant  — solid | outline | ghost (default: outline)
 *   size     — sm | md | lg (default: md)
 *   disabled — boolean
 *   loading  — boolean, показывает spinner
 *
 * Слоты:
 *   (default)  — текст кнопки
 *   icon-left  — иконка слева
 *   icon-right — иконка справа
 *
 * События:
 *   kayf-click — не срабатывает если disabled/loading
 *
 * Пример:
 *   <kayf-beam-button color="cyan" variant="solid" size="lg">
 *     Launch Eclipse
 *   </kayf-beam-button>
 */

type Variant = 'solid' | 'outline' | 'ghost'
type Size    = 'sm' | 'md' | 'lg'

const sizes: Record<Size, { padding: string; fontSize: string; height: string; radius: string }> = {
  sm: { padding: '0 14px', fontSize: '12px', height: '34px', radius: '10px' },
  md: { padding: '0 20px', fontSize: '14px', height: '42px', radius: '12px' },
  lg: { padding: '0 26px', fontSize: '15px', height: '50px', radius: '14px' },
}

export class BeamButton extends KayfElement {
  static get observedAttributes() {
    return ['color', 'variant', 'size', 'disabled', 'loading']
  }

  get color(): ColorVariant { return this.attr('color', 'cyan') as ColorVariant }
  get variant(): Variant    { return this.attr('variant', 'outline') as Variant }
  get size(): Size          { return this.attr('size', 'md') as Size }
  get isDisabled(): boolean { return this.boolAttr('disabled') }
  get isLoading(): boolean  { return this.boolAttr('loading') }

  protected styles(): string {
    const color = getColor(this.color)
    const sz    = sizes[this.size] ?? sizes.md

    const vs: Record<Variant, string> = {
      solid: `
        background: linear-gradient(180deg, color-mix(in srgb, ${color} 92%, white), ${color});
        color: #09090b;
        border: 1px solid color-mix(in srgb, ${color} 78%, white);
        font-weight: 700;
        box-shadow: 0 8px 24px ${color}28, inset 0 1px 0 rgba(255,255,255,0.35);
      `,
      outline: `
        background: color-mix(in srgb, ${color} 9%, var(--kayf-surface));
        color: color-mix(in srgb, ${color} 88%, white);
        border: 1px solid color-mix(in srgb, ${color} 38%, transparent);
        font-weight: 600;
        box-shadow: inset 0 1px 0 rgba(255,255,255,0.07);
      `,
      ghost: `
        background: rgba(255,255,255,0.035);
        color: var(--kayf-muted);
        border: 1px solid var(--kayf-border);
        font-weight: 600;
      `,
    }

    const vh: Record<Variant, string> = {
      solid: `
        box-shadow: 0 12px 30px ${color}38, inset 0 1px 0 rgba(255,255,255,0.4);
        transform: translateY(-1px);
      `,
      outline: `
        background: color-mix(in srgb, ${color} 14%, var(--kayf-surface));
        border-color: color-mix(in srgb, ${color} 58%, transparent);
        box-shadow: 0 10px 28px ${color}1f;
        transform: translateY(-1px);
      `,
      ghost: `
        background: rgba(255,255,255,0.07);
        border-color: rgba(255,255,255,0.15);
        color: rgba(232,232,240,0.9);
        transform: translateY(-1px);
      `,
    }

    return baseCSS + `
      *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
      :host { display: inline-block; }
      :host([disabled]), :host([loading]) { opacity: 0.5; }

      .btn {
        position: relative;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        height: ${sz.height};
        padding: ${sz.padding};
        border-radius: ${sz.radius};
        font-family: var(--kayf-font-sans);
        font-size: ${sz.fontSize};
        letter-spacing: -0.01em;
        cursor: pointer;
        overflow: hidden;
        transition: background 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease, color 0.2s ease;
        white-space: nowrap;
        user-select: none;
        outline: none;
        ${vs[this.variant]}
      }
      .btn:hover { ${vh[this.variant]} }
      .btn:active { transform: translateY(0) scale(0.98) !important; transition-duration: 0.1s; }
      .btn:focus-visible { outline: 2px solid ${color}; outline-offset: 3px; }
      .btn:disabled { cursor: not-allowed; }

      /* Beam sweep */
      .beam {
        position: absolute; inset: 0;
        pointer-events: none; overflow: hidden; border-radius: inherit;
      }
      .beam::before {
        content: '';
        position: absolute;
        top: 0; left: -120%; width: 60%; height: 100%;
        background: linear-gradient(90deg, transparent, rgba(255,255,255,0.08) 40%, rgba(255,255,255,0.18) 50%, rgba(255,255,255,0.08) 60%, transparent);
        transform: skewX(-20deg);
      }
      .btn:hover .beam::before { animation: beam-sweep 0.55s cubic-bezier(0.4,0,0.2,1) forwards; }
      @keyframes beam-sweep { to { left: 160%; } }

      /* Ripple */
      .ripple {
        position: absolute; border-radius: 50%;
        background: rgba(255,255,255,0.15);
        transform: scale(0);
        animation: ripple-out 0.5s ease-out forwards;
        pointer-events: none;
      }
      @keyframes ripple-out { to { transform: scale(4); opacity: 0; } }

      /* Spinner */
      .spinner {
        display: none; width: 14px; height: 14px;
        border: 2px solid currentColor; border-top-color: transparent;
        border-radius: 50%; animation: spin 0.7s linear infinite; flex-shrink: 0;
      }
      :host([loading]) .spinner { display: block; }
      :host([loading]) .label   { opacity: 0.6; }
      @keyframes spin { to { transform: rotate(360deg); } }

      ::slotted([slot='icon-left']), ::slotted([slot='icon-right']) {
        width: 16px;
        height: 16px;
        flex: none;
      }
    `
  }

  protected template(): string {
    return `
      <button class="btn" part="button" type="button">
        <span class="beam"></span>
        <span class="spinner"></span>
        <slot name="icon-left"></slot>
        <span class="label"><slot></slot></span>
        <slot name="icon-right"></slot>
      </button>
    `
  }

  protected setup(): void {
    const btn = this.root.querySelector('.btn') as HTMLButtonElement
    if (!btn) return

    btn.disabled = this.isDisabled || this.isLoading
    btn.setAttribute('aria-busy', String(this.isLoading))

    const onPointerDown = (e: PointerEvent) => {
      const rect   = btn.getBoundingClientRect()
      const size   = Math.max(rect.width, rect.height)
      const x      = e.clientX - rect.left - size / 2
      const y      = e.clientY - rect.top  - size / 2
      const ripple = document.createElement('span')
      ripple.className     = 'ripple'
      ripple.style.cssText = `width:${size}px;height:${size}px;left:${x}px;top:${y}px;`
      btn.appendChild(ripple)
      ripple.addEventListener('animationend', () => ripple.remove())
    }

    const onClick = (e: MouseEvent) => {
      if (this.isDisabled || this.isLoading) { e.stopPropagation(); return }
      this.dispatchEvent(new CustomEvent('kayf-click', {
        bubbles: true, composed: true, detail: { originalEvent: e },
      }))
    }

    btn.addEventListener('pointerdown', onPointerDown)
    btn.addEventListener('click', onClick)
    ;(this as any)._btn = btn
    ;(this as any)._pd  = onPointerDown
    ;(this as any)._oc  = onClick
  }

  protected cleanup(): void {
    const btn = (this as any)._btn as HTMLElement | undefined
    if (btn) {
      btn.removeEventListener('pointerdown', (this as any)._pd)
      btn.removeEventListener('click', (this as any)._oc)
    }
  }
}

if (!customElements.get('kayf-beam-button')) {
  customElements.define('kayf-beam-button', BeamButton)
}
