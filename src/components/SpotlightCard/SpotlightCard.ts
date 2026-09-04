import { KayfElement } from '../../core/KayfElement'
import { baseCSS, getColor, getGlow, getSpotlight, ColorVariant } from '../../core/tokens'

type GlowLevel = 'none' | 'soft' | 'medium' | 'strong'

const glowIntensity: Record<GlowLevel, number> = {
  none: 0,
  soft: 0.12,
  medium: 0.2,
  strong: 0.3,
}

/** A glass surface with a restrained pointer-following highlight. */
export class SpotlightCard extends KayfElement {
  private card?: HTMLElement
  private spotlight?: HTMLElement
  private onMove?: (event: PointerEvent) => void
  private onLeave?: () => void

  static get observedAttributes() {
    return ['color', 'glow', 'radius']
  }

  get color(): ColorVariant { return this.attr('color', 'cyan') as ColorVariant }
  get glowLevel(): GlowLevel { return this.attr('glow', 'soft') as GlowLevel }
  get radius(): number { return this.numAttr('radius', 20) }

  protected styles(): string {
    const color = getColor(this.color)
    const glowColor = getGlow(this.color)
    const spotlightColor = getSpotlight(this.color)
    const intensity = glowIntensity[this.glowLevel] ?? glowIntensity.soft
    const radius = Math.max(0, this.radius)
    const hoverGlow = glowColor.replace('0.18', String(intensity))

    return baseCSS + `
      *, *::before, *::after { box-sizing: border-box; }

      :host {
        display: block;
        position: relative;
        border-radius: ${radius}px;
      }

      .border {
        height: 100%;
        padding: 1px;
        border-radius: inherit;
        background: linear-gradient(145deg, rgba(255,255,255,0.15), rgba(255,255,255,0.045) 45%, ${color}2b);
        transition: background 220ms ease, box-shadow 220ms ease, transform 220ms ease;
      }

      .card {
        position: relative;
        height: 100%;
        min-height: 168px;
        overflow: hidden;
        border-radius: ${Math.max(0, radius - 1)}px;
        color: var(--kayf-text);
        background:
          radial-gradient(circle at 12% 0%, rgba(255,255,255,0.055), transparent 36%),
          linear-gradient(155deg, rgba(19,19,27,0.94), rgba(10,10,14,0.9));
        box-shadow: inset 0 1px 0 rgba(255,255,255,0.045), 0 18px 48px rgba(0,0,0,0.24);
      }

      .card::after {
        content: '';
        position: absolute;
        inset: 0;
        pointer-events: none;
        border-radius: inherit;
        background: linear-gradient(110deg, rgba(255,255,255,0.025), transparent 45%);
      }

      :host(:hover) .border {
        background: linear-gradient(145deg, rgba(255,255,255,0.2), ${color}4d);
        box-shadow: 0 24px 64px rgba(0,0,0,0.32), 0 0 42px ${hoverGlow};
        transform: translateY(-2px);
      }

      .spotlight {
        position: absolute;
        width: 480px;
        height: 480px;
        border-radius: 50%;
        pointer-events: none;
        transform: translate(-50%, -50%);
        background: radial-gradient(circle, ${spotlightColor}, transparent 68%);
        filter: blur(2px);
        opacity: 0;
        transition: opacity 220ms ease;
      }

      :host(:hover) .spotlight { opacity: 1; }

      .content {
        position: relative;
        z-index: 1;
        display: grid;
        align-content: start;
        gap: 10px;
        min-height: inherit;
        padding: clamp(22px, 5vw, 32px);
      }

      ::slotted(h1), ::slotted(h2), ::slotted(h3), ::slotted(h4) {
        margin: 0;
        color: var(--kayf-text);
        font-family: var(--kayf-font-sans);
        font-weight: 650;
        line-height: 1.15;
        letter-spacing: -0.025em;
      }

      ::slotted(p) {
        margin: 0;
        color: var(--kayf-muted);
        font-family: var(--kayf-font-sans);
        font-size: 14px;
        line-height: 1.65;
      }
    `
  }

  protected template(): string {
    return `
      <div class="border" part="border">
        <div class="card" part="card">
          <div class="spotlight" aria-hidden="true"></div>
          <div class="content" part="content"><slot></slot></div>
        </div>
      </div>
    `
  }

  protected setup(): void {
    this.cleanup()
    this.card = this.root.querySelector('.card') as HTMLElement | null ?? undefined
    this.spotlight = this.root.querySelector('.spotlight') as HTMLElement | null ?? undefined
    if (!this.card || !this.spotlight) return

    this.onMove = (event: PointerEvent) => {
      const rect = this.card!.getBoundingClientRect()
      this.spotlight!.style.left = `${event.clientX - rect.left}px`
      this.spotlight!.style.top = `${event.clientY - rect.top}px`
    }
    this.onLeave = () => {
      this.spotlight!.style.left = '50%'
      this.spotlight!.style.top = '50%'
    }

    this.card.addEventListener('pointermove', this.onMove)
    this.card.addEventListener('pointerleave', this.onLeave)
    this.onLeave()
  }

  protected cleanup(): void {
    if (this.card && this.onMove) this.card.removeEventListener('pointermove', this.onMove)
    if (this.card && this.onLeave) this.card.removeEventListener('pointerleave', this.onLeave)
  }
}

if (!customElements.get('kayf-spotlight-card')) {
  customElements.define('kayf-spotlight-card', SpotlightCard)
}
