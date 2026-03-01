import { KayfElement } from '../../core/KayfElement'
import { baseCSS, getColor, getGlow, getSpotlight, ColorVariant } from '../../core/tokens'

/**
 * <kayf-spotlight-card>
 *
 * Атрибуты:
 *   color  - cyan | violet | emerald | amber | red  (default: cyan)
 *   glow   - none | soft | medium | strong          (default: soft)
 *   radius - border-radius px                       (default: 16)
 *
 * Пример:
 *   <kayf-spotlight-card color="violet" glow="medium">
 *     <h3>Title</h3>
 *     <p>Description</p>
 *   </kayf-spotlight-card>
 */

const glowIntensity: Record<string, number> = {
  none: 0, soft: 0.15, medium: 0.25, strong: 0.4,
}

export class SpotlightCard extends KayfElement {
  private _card?: HTMLElement
  private _spot?: HTMLElement
  private _onMove?: (e: MouseEvent) => void
  private _onLeave?: () => void

  static get observedAttributes() {
    return ['color', 'glow', 'radius']
  }

  get color(): ColorVariant { return this.attr('color', 'cyan') as ColorVariant }
  get glowLevel(): string   { return this.attr('glow', 'soft') }
  get radius(): number      { return this.numAttr('radius', 16) }

  protected styles(): string {
    const color     = getColor(this.color)
    const glowColor = getGlow(this.color)
    const spotColor = getSpotlight(this.color)
    const intensity = glowIntensity[this.glowLevel] ?? 0.15
    const r         = Math.max(0, this.radius)
    const innerR    = Math.max(0, r - 1)
    const glowHover = glowColor.replace('0.2', String(intensity))

    return baseCSS + `
      *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
      :host {
        display: block;
        position: relative;
        border-radius: ${r}px;
        perspective: 1000px;
      }

      .card-border {
        position: relative;
        border-radius: ${r}px;
        padding: 1px;
        background:
          linear-gradient(145deg, ${color}46, rgba(255,255,255,0.08) 38%, rgba(255,255,255,0.03) 62%, ${color}22);
        transition: background 0.3s ease, box-shadow 0.3s ease;
        height: 100%;
      }

      :host(:hover) .card-border {
        box-shadow: 0 0 30px ${glowHover};
      }

      .card {
        position: relative;
        background:
          radial-gradient(circle at 14% 10%, rgba(255,255,255,0.045), transparent 34%),
          linear-gradient(165deg, rgba(255,255,255,0.04), rgba(255,255,255,0.015) 36%, rgba(5,5,8,0.82) 100%);
        border-radius: ${innerR}px;
        overflow: hidden;
        height: 100%;
        min-height: 170px;
        border: 1px solid rgba(255,255,255,0.06);
        box-shadow:
          inset 0 1px 0 rgba(255,255,255,0.06),
          0 10px 26px rgba(0,0,0,0.24);
        transition: box-shadow 0.3s ease, transform 0.3s ease, border-color 0.3s ease;
      }

      :host(:hover) .card {
        border-color: ${color}66;
        box-shadow:
          inset 0 1px 0 rgba(255,255,255,0.08),
          0 14px 34px rgba(0,0,0,0.34),
          0 0 40px ${glowHover};
        transform: translateY(-2px);
      }

      .spotlight {
        position: absolute;
        width: 360px;
        height: 360px;
        border-radius: 50%;
        pointer-events: none;
        transform: translate(-50%, -50%);
        background: radial-gradient(circle, ${spotColor}, transparent 72%);
        opacity: 0;
        transition: opacity 0.3s ease;
        z-index: 0;
      }

      :host(:hover) .spotlight { opacity: 1; }

      .grid {
        position: absolute;
        inset: 0;
        z-index: 0;
        opacity: 0.16;
        pointer-events: none;
        background-image:
          linear-gradient(${color}24 1px, transparent 1px),
          linear-gradient(90deg, ${color}1d 1px, transparent 1px);
        background-size: 24px 24px, 24px 24px;
        mask-image: linear-gradient(to bottom, rgba(0,0,0,0.7), transparent 80%);
      }

      .vignette {
        position: absolute;
        inset: 0;
        z-index: 1;
        pointer-events: none;
        background:
          radial-gradient(circle at 50% 140%, rgba(0,0,0,0.45), transparent 60%),
          linear-gradient(to bottom, rgba(0,0,0,0.1), transparent 35%);
      }

      .shine {
        position: absolute;
        inset: 0;
        overflow: hidden;
        border-radius: inherit;
        z-index: 2;
        pointer-events: none;
      }

      .shine::before {
        content: '';
        position: absolute;
        top: -20%;
        left: -130%;
        width: 46%;
        height: 150%;
        background: linear-gradient(
          90deg,
          transparent,
          rgba(255,255,255,0.12) 48%,
          rgba(255,255,255,0.2) 50%,
          rgba(255,255,255,0.12) 52%,
          transparent
        );
        transform: rotate(14deg);
        opacity: 0;
      }

      :host(:hover) .shine::before {
        animation: shine-pass 0.75s ease forwards;
      }

      .accent {
        position: absolute;
        top: 0;
        left: 20%;
        right: 20%;
        height: 1px;
        background: linear-gradient(90deg, transparent, ${color}88, transparent);
        opacity: 0;
        transition: opacity 0.3s ease;
        z-index: 3;
      }

      :host(:hover) .accent { opacity: 1; }

      .corner {
        position: absolute;
        width: 16px;
        height: 16px;
        border-color: ${color}88;
        border-style: solid;
        z-index: 3;
        pointer-events: none;
        opacity: 0.8;
      }

      .corner.tl { top: 10px; left: 10px; border-width: 1px 0 0 1px; border-radius: 3px 0 0 0; }
      .corner.tr { top: 10px; right: 10px; border-width: 1px 1px 0 0; border-radius: 0 3px 0 0; }
      .corner.bl { bottom: 10px; left: 10px; border-width: 0 0 1px 1px; border-radius: 0 0 0 3px; }
      .corner.br { bottom: 10px; right: 10px; border-width: 0 1px 1px 0; border-radius: 0 0 3px 0; }

      .content {
        position: relative;
        z-index: 4;
        padding: 24px;
        height: 100%;
        display: grid;
        gap: 10px;
      }

      ::slotted(h1), ::slotted(h2), ::slotted(h3), ::slotted(h4) {
        font-family: var(--kayf-font-sans);
        color: rgba(255,255,255,0.96);
        line-height: 1.15;
        letter-spacing: 0.01em;
      }

      ::slotted(p) {
        font-family: var(--kayf-font-mono);
        font-size: 13px;
        color: var(--kayf-muted);
        line-height: 1.65;
        font-weight: 300;
      }

      @keyframes shine-pass {
        0% { left: -130%; opacity: 0; }
        12% { opacity: 1; }
        100% { left: 160%; opacity: 0; }
      }
    `
  }

  protected template(): string {
    return `
      <div class="card-border">
        <div class="card">
          <div class="spotlight"></div>
          <div class="grid"></div>
          <div class="vignette"></div>
          <div class="shine"></div>
          <div class="accent"></div>
          <span class="corner tl"></span>
          <span class="corner tr"></span>
          <span class="corner bl"></span>
          <span class="corner br"></span>
          <div class="content"><slot></slot></div>
        </div>
      </div>
    `
  }

  protected setup(): void {
    this.cleanup()

    this._card = this.root.querySelector('.card') as HTMLElement | null ?? undefined
    this._spot = this.root.querySelector('.spotlight') as HTMLElement | null ?? undefined
    if (!this._card || !this._spot) return

    this._onMove = (e: MouseEvent) => {
      const rect = this._card!.getBoundingClientRect()
      this._spot!.style.left = (e.clientX - rect.left) + 'px'
      this._spot!.style.top = (e.clientY - rect.top) + 'px'
    }

    this._onLeave = () => {
      this._spot!.style.left = '50%'
      this._spot!.style.top = '50%'
    }

    this._card.addEventListener('mousemove', this._onMove)
    this._card.addEventListener('mouseleave', this._onLeave)
    this._onLeave()
  }

  protected cleanup(): void {
    if (this._card && this._onMove) this._card.removeEventListener('mousemove', this._onMove)
    if (this._card && this._onLeave) this._card.removeEventListener('mouseleave', this._onLeave)
  }
}

if (!customElements.get('kayf-spotlight-card')) {
  customElements.define('kayf-spotlight-card', SpotlightCard)
}
