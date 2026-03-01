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
  sm: { padding: '0 14px', fontSize: '12px', height: '32px', radius: '8px'  },
  md: { padding: '0 22px', fontSize: '14px', height: '40px', radius: '10px' },
  lg: { padding: '0 32px', fontSize: '15px', height: '50px', radius: '12px' },
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
        background: ${color};
        color: #050508;
        border: 1px solid transparent;
        font-weight: 700;
        box-shadow: 0 0 20px ${color}44, inset 0 1px 0 rgba(255,255,255,0.2);
      `,
      outline: `
        background: ${color}12;
        color: ${color};
        border: 1px solid ${color}44;
        font-weight: 600;
        box-shadow: inset 0 1px 0 rgba(255,255,255,0.05);
      `,
      ghost: `
        background: rgba(255,255,255,0.04);
        color: rgba(232,232,240,0.7);
        border: 1px solid rgba(255,255,255,0.08);
        font-weight: 500;
      `,
    }

    const vh: Record<Variant, string> = {
      solid: `
        background: ${color}dd;
        box-shadow: 0 0 30px ${color}66, 0 4px 20px ${color}33, inset 0 1px 0 rgba(255,255,255,0.3);
        transform: translateY(-2px);
      `,
      outline: `
        background: ${color}1e;
        border-color: ${color}88;
        box-shadow: 0 0 20px ${color}22;
        transform: translateY(-2px);
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
      :host([disabled]), :host([loading]) { pointer-events: none; opacity: 0.45; }

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
        letter-spacing: 0.04em;
        cursor: pointer;
        overflow: hidden;
        transition: background 0.25s, border-color 0.25s, box-shadow 0.25s, transform 0.2s, color 0.25s;
        white-space: nowrap;
        user-select: none;
        outline: none;
        ${vs[this.variant]}
      }
      .btn:hover { ${vh[this.variant]} }
      .btn:active { transform: translateY(0) scale(0.98) !important; transition-duration: 0.1s; }
      .btn:focus-visible { outline: 2px solid ${color}88; outline-offset: 3px; }

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

      /* Icon slots */
      .icon-wrap { display: inline-flex; align-items: center; width: 16px; height: 16px; flex-shrink: 0; }
    `
  }

  protected template(): string {
    return `
      <button class="btn" part="button" type="button">
        <span class="beam"></span>
        <span class="spinner"></span>
        <span class="icon-wrap"><slot name="icon-left"></slot></span>
        <span class="label"><slot></slot></span>
        <span class="icon-wrap"><slot name="icon-right"></slot></span>
      </button>
    `
  }

  protected setup(): void {
    const btn = this.root.querySelector('.btn') as HTMLElement
    if (!btn) return

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