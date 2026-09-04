import {
  ActionButtonElement,
  actionButtonBaseCSS,
  actionButtonSizes,
} from '../../core/ActionButtonElement'
import { baseCSS, ColorVariant, getColor } from '../../core/tokens'

type OrbitVariant = 'solid' | 'ghost'

/** A directional action with an orbital status mark and clear forward motion. */
export class OrbitButton extends ActionButtonElement {
  static override get observedAttributes() {
    return ['color', 'variant', 'size', 'disabled', 'loading', 'full-width']
  }

  private get color(): ColorVariant {
    return this.attr('color', 'cyan') as ColorVariant
  }

  private get variant(): OrbitVariant {
    return this.attr('variant', 'solid') === 'ghost' ? 'ghost' : 'solid'
  }

  protected styles(): string {
    const color = getColor(this.color)
    const size = actionButtonSizes[this.size]
    const orbitSize = this.size === 'lg' ? '25px' : this.size === 'sm' ? '19px' : '22px'
    const variantStyles: Record<OrbitVariant, string> = {
      solid: `
        color: #f7f8fa;
        border-color: color-mix(in srgb, ${color} 26%, rgba(255,255,255,0.1));
        background:
          radial-gradient(circle at 10% 0%, color-mix(in srgb, ${color} 13%, transparent), transparent 38%),
          linear-gradient(180deg, rgba(24,25,31,0.98), rgba(12,13,17,0.99));
        box-shadow: inset 0 1px 0 rgba(255,255,255,0.075), 0 14px 34px rgba(0,0,0,0.27);
      `,
      ghost: `
        color: rgba(244,244,247,0.78);
        border-color: rgba(255,255,255,0.085);
        background: rgba(255,255,255,0.025);
        box-shadow: inset 0 1px 0 rgba(255,255,255,0.035);
      `,
    }

    return baseCSS + actionButtonBaseCSS + `
      .button {
        position: relative;
        display: inline-flex;
        width: 100%;
        min-width: max-content;
        height: ${size.height};
        padding: 0 5px 0 ${this.size === 'sm' ? '9px' : '11px'};
        align-items: center;
        gap: ${this.size === 'sm' ? '8px' : '11px'};
        overflow: hidden;
        border: 1px solid;
        border-radius: ${size.radius};
        cursor: pointer;
        outline: none;
        font-family: var(--kayf-font-sans);
        font-size: ${size.fontSize};
        font-weight: 640;
        line-height: 1;
        letter-spacing: -0.012em;
        user-select: none;
        transition: transform 180ms cubic-bezier(.2,.8,.2,1), border-color 220ms ease, background 220ms ease, box-shadow 220ms ease, opacity 180ms ease;
        ${variantStyles[this.variant]}
      }

      .orbit {
        position: relative;
        width: ${orbitSize};
        height: ${orbitSize};
        flex: none;
        border: 1px solid color-mix(in srgb, ${color} 42%, transparent);
        border-radius: 50%;
        transition: transform 420ms cubic-bezier(.2,.8,.2,1), border-color 220ms ease;
      }

      .orbit::before {
        content: '';
        position: absolute;
        width: 4px;
        height: 4px;
        top: -2px;
        left: calc(50% - 2px);
        border-radius: 50%;
        background: color-mix(in srgb, ${color} 88%, white);
        box-shadow: 0 0 9px ${color};
      }

      .orbit::after {
        content: '';
        position: absolute;
        width: 4px;
        height: 4px;
        inset: calc(50% - 2px);
        border-radius: 50%;
        background: ${color};
        box-shadow: 0 0 10px color-mix(in srgb, ${color} 55%, transparent);
      }

      .label {
        flex: 1;
        overflow: hidden;
        text-align: left;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .direction {
        display: grid;
        width: calc(${size.height} - 10px);
        height: calc(${size.height} - 10px);
        flex: none;
        place-items: center;
        border-left: 1px solid rgba(255,255,255,0.075);
        border-radius: calc(${size.radius} - 4px);
        color: color-mix(in srgb, ${color} 78%, white);
        background: color-mix(in srgb, ${color} 7%, rgba(255,255,255,0.025));
        transition: color 180ms ease, background 180ms ease;
      }

      .direction svg {
        width: ${size.icon};
        height: ${size.icon};
        transition: transform 220ms cubic-bezier(.2,.8,.2,1);
      }

      .button:hover:not(:disabled) {
        border-color: color-mix(in srgb, ${color} 48%, rgba(255,255,255,0.12));
        transform: translateY(-2px);
        box-shadow:
          inset 0 1px 0 rgba(255,255,255,0.1),
          0 18px 42px rgba(0,0,0,0.33),
          0 0 30px color-mix(in srgb, ${color} 10%, transparent);
      }

      .button:hover:not(:disabled) .orbit { transform: rotate(145deg); border-color: color-mix(in srgb, ${color} 70%, transparent); }
      .button:hover:not(:disabled) .direction { color: #09090b; background: color-mix(in srgb, ${color} 84%, white); }
      .button:hover:not(:disabled) .direction svg { transform: translateX(2px); }

      .button:active:not(:disabled) { transform: translateY(0) scale(0.985); transition-duration: 80ms; }
      .button:focus-visible { outline: 2px solid color-mix(in srgb, ${color} 72%, white); outline-offset: 3px; }
      .button:disabled { cursor: not-allowed; }
      :host([disabled]) .button { opacity: 0.4; }
      :host([loading]) .button { opacity: 0.72; }
      :host([loading]) .orbit { animation: orbit-spin 780ms linear infinite; }

      ::slotted([slot='icon-right']) {
        width: ${size.icon};
        height: ${size.icon};
      }

      @keyframes orbit-spin { to { transform: rotate(360deg); } }

      @media (prefers-reduced-motion: reduce) {
        .button:hover:not(:disabled),
        .button:hover:not(:disabled) .orbit,
        .button:hover:not(:disabled) .direction svg { transform: none; }
      }
    `
  }

  protected template(): string {
    return `
      <button class="button" part="button" type="button">
        <span class="orbit" part="orbit" aria-hidden="true"></span>
        <span class="label" part="label"><slot></slot></span>
        <span class="direction" part="direction" aria-hidden="true">
          <slot name="icon-right">
            <svg viewBox="0 0 18 18" fill="none">
              <path d="M4 9h9M9.5 5.5 13 9l-3.5 3.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </slot>
        </span>
        <span class="sr-only" aria-live="polite">${this.isLoading ? 'Loading' : ''}</span>
      </button>
    `
  }
}

if (!customElements.get('kayf-orbit-button')) {
  customElements.define('kayf-orbit-button', OrbitButton)
}
