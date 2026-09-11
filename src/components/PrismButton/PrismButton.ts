import {
  ActionButtonElement,
  actionButtonBaseCSS,
  actionButtonSizes,
} from '../../core/ActionButtonElement'
import { baseCSS, ColorVariant, getColor } from '../../core/tokens'

type PrismVariant = 'solid' | 'outline'

/** A premium CTA with localized refraction and a composed resting state. */
export class PrismButton extends ActionButtonElement {
  private onPointerMove?: (event: PointerEvent) => void
  private onPointerLeave?: () => void

  static override get observedAttributes() {
    return ['color', 'variant', 'size', 'disabled', 'loading', 'full-width']
  }

  private get color(): ColorVariant {
    return this.attr('color', 'violet') as ColorVariant
  }

  private get variant(): PrismVariant {
    return this.attr('variant', 'solid') === 'outline' ? 'outline' : 'solid'
  }

  protected styles(): string {
    const color = getColor(this.color)
    const size = actionButtonSizes[this.size]
    const edgeGradient = `conic-gradient(
          from 210deg at var(--prism-x) var(--prism-y),
          rgba(255,255,255,0.16),
          color-mix(in srgb, ${color} 74%, white) 18%,
          rgba(98,218,247,0.5) 31%,
          rgba(255,115,180,0.38) 48%,
          rgba(255,255,255,0.08) 70%,
          color-mix(in srgb, ${color} 48%, transparent)
        )`
    const variantStyles: Record<PrismVariant, string> = {
      solid: `
        color: #f9f9fb;
        background:
          radial-gradient(circle at var(--prism-x) var(--prism-y), color-mix(in srgb, ${color} 24%, transparent), transparent 45%),
          linear-gradient(180deg, rgba(31,31,42,0.98), rgba(15,15,22,0.99));
        box-shadow:
          inset 0 1px 0 rgba(255,255,255,0.1),
          0 12px 30px rgba(0,0,0,0.28),
          0 0 0 1px rgba(255,255,255,0.035);
      `,
      outline: `
        color: color-mix(in srgb, ${color} 76%, white);
        background:
          radial-gradient(circle at var(--prism-x) var(--prism-y), color-mix(in srgb, ${color} 13%, transparent), transparent 44%),
          rgba(255,255,255,0.025);
        box-shadow: inset 0 1px 0 rgba(255,255,255,0.055);
      `,
    }

    return baseCSS + actionButtonBaseCSS + `
      :host {
        --prism-x: 50%;
        --prism-y: 50%;
        --prism-color: ${color};
      }

      .button {
        position: relative;
        display: inline-grid;
        width: 100%;
        min-width: max-content;
        height: ${size.height};
        padding: 1px;
        overflow: hidden;
        border-radius: ${size.radius};
        color: inherit;
        cursor: pointer;
        isolation: isolate;
        outline: none;
        background: ${edgeGradient};
        box-shadow: 0 16px 34px rgba(0,0,0,0.26);
        transition: transform 180ms cubic-bezier(.2,.8,.2,1), box-shadow 220ms ease, filter 220ms ease;
        user-select: none;
      }

      ${this.variant === 'outline' ? `
        .button { background: transparent; }
        .button::before {
          content: '';
          position: absolute;
          inset: 0;
          padding: 1px;
          border-radius: inherit;
          background: ${edgeGradient};
          -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          mask-composite: exclude;
          pointer-events: none;
        }
        @media (forced-colors: active) {
          .button { outline: 1px solid ButtonText; outline-offset: -1px; }
          .button::before { display: none; }
        }
      ` : ''}

      .surface {
        position: relative;
        display: inline-flex;
        min-width: 0;
        align-items: center;
        justify-content: center;
        gap: 9px;
        height: 100%;
        padding: ${size.padding};
        overflow: hidden;
        border-radius: calc(${size.radius} - 1px);
        font-family: var(--kayf-font-sans);
        font-size: ${size.fontSize};
        font-weight: 650;
        line-height: 1;
        letter-spacing: -0.012em;
        ${variantStyles[this.variant]}
      }

      .surface::before {
        content: '';
        position: absolute;
        inset: -60% -25%;
        pointer-events: none;
        background: linear-gradient(112deg, transparent 32%, rgba(255,255,255,0.2) 48%, transparent 64%);
        opacity: 0;
        transform: translateX(-36%) rotate(5deg);
        transition: opacity 180ms ease, transform 520ms cubic-bezier(.2,.75,.2,1);
      }

      .content,
      .label,
      .spinner { position: relative; z-index: 1; }

      .content {
        display: contents;
      }

      .label {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .spinner {
        display: none;
        width: ${size.icon};
        height: ${size.icon};
        flex: none;
        border: 1.5px solid color-mix(in srgb, currentColor 30%, transparent);
        border-top-color: currentColor;
        border-radius: 50%;
        animation: prism-spin 720ms linear infinite;
      }

      :host([loading]) .spinner { display: block; }
      :host([loading]) slot[name='icon-left'] { display: none; }

      .button:hover:not(:disabled) {
        transform: translateY(-2px);
        filter: saturate(1.08);
        box-shadow:
          0 20px 42px rgba(0,0,0,0.34),
          0 0 28px color-mix(in srgb, ${color} 13%, transparent);
      }

      .button:hover:not(:disabled) .surface::before {
        opacity: 0.78;
        transform: translateX(36%) rotate(5deg);
      }

      .button:active:not(:disabled) {
        transform: translateY(0) scale(0.985);
        transition-duration: 80ms;
      }

      .button:focus-visible {
        outline: 2px solid color-mix(in srgb, ${color} 76%, white);
        outline-offset: 3px;
      }

      .button:disabled { cursor: not-allowed; filter: saturate(0.5); }
      :host([disabled]) .button { opacity: 0.42; }
      :host([loading]) .button { opacity: 0.72; }

      ::slotted([slot='icon-left']),
      ::slotted([slot='icon-right']) {
        width: ${size.icon};
        height: ${size.icon};
        flex: none;
      }

      @keyframes prism-spin { to { transform: rotate(360deg); } }

      @media (prefers-reduced-motion: reduce) {
        .surface::before { display: none; }
        .button:hover:not(:disabled) { transform: none; }
      }
    `
  }

  protected template(): string {
    return `
      <button class="button" part="button" type="button">
        <span class="surface" part="surface">
          <span class="content">
            <span class="spinner" part="spinner" aria-hidden="true"></span>
            <slot name="icon-left"></slot>
            <span class="label" part="label"><slot></slot></span>
            <slot name="icon-right"></slot>
          </span>
        </span>
        <span class="sr-only" aria-live="polite">${this.isLoading ? 'Loading' : ''}</span>
      </button>
    `
  }

  protected override setup(): void {
    super.setup()
    if (!this.control) return

    this.onPointerMove = (event: PointerEvent) => {
      if (event.pointerType === 'touch' || !this.control) return
      const rect = this.control.getBoundingClientRect()
      if (!rect.width || !rect.height) return
      const x = Math.min(100, Math.max(0, ((event.clientX - rect.left) / rect.width) * 100))
      const y = Math.min(100, Math.max(0, ((event.clientY - rect.top) / rect.height) * 100))
      this.control.style.setProperty('--prism-x', `${x.toFixed(1)}%`)
      this.control.style.setProperty('--prism-y', `${y.toFixed(1)}%`)
    }

    this.onPointerLeave = () => {
      this.control?.style.setProperty('--prism-x', '50%')
      this.control?.style.setProperty('--prism-y', '50%')
    }

    this.control.addEventListener('pointermove', this.onPointerMove)
    this.control.addEventListener('pointerleave', this.onPointerLeave)
  }

  protected override cleanup(): void {
    if (this.control && this.onPointerMove) this.control.removeEventListener('pointermove', this.onPointerMove)
    if (this.control && this.onPointerLeave) this.control.removeEventListener('pointerleave', this.onPointerLeave)
    super.cleanup()
  }
}

if (!customElements.get('kayf-prism-button')) {
  customElements.define('kayf-prism-button', PrismButton)
}
