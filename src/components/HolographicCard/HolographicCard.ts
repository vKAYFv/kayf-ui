import { KayfElement } from '../../core/KayfElement'
import { baseCSS } from '../../core/tokens'

const clamp = (value: number, min: number, max: number, fallback = min): number =>
  Number.isFinite(value) ? Math.min(max, Math.max(min, value)) : fallback

/** An iridescent surface with pointer-driven depth and a calm resting state. */
export class HolographicCard extends KayfElement {
  private scene?: HTMLElement
  private card?: HTMLElement
  private frame = 0
  private targetRotateX = 0
  private targetRotateY = 0
  private currentRotateX = 0
  private currentRotateY = 0
  private targetScale = 1
  private currentScale = 1
  private reducedMotion = false
  private onPointerEnter?: (event: PointerEvent) => void
  private onPointerMove?: (event: PointerEvent) => void
  private onPointerLeave?: () => void

  static override get observedAttributes() {
    return ['tilt-max', 'shine-opacity', 'scale']
  }

  private get maxTilt(): number {
    return clamp(this.numAttr('tilt-max', 10), 0, 20, 10)
  }

  private get shineOpacity(): number {
    return clamp(this.numAttr('shine-opacity', 0.78), 0, 1, 0.78)
  }

  private get scaleValue(): number {
    return clamp(this.numAttr('scale', 1.025), 1, 1.08, 1.025)
  }

  protected styles(): string {
    return baseCSS + `
      *, *::before, *::after { box-sizing: border-box; }

      :host {
        --holo-x: 50%;
        --holo-y: 50%;
        --holo-opacity: ${this.shineOpacity};
        display: inline-block;
        max-width: 100%;
        vertical-align: top;
        border-radius: var(--kayf-radius-lg);
        outline: none;
      }

      .scene {
        position: relative;
        display: block;
        max-width: 100%;
        border-radius: inherit;
        perspective: 1200px;
        transform-style: preserve-3d;
        isolation: isolate;
      }

      .ambient {
        position: absolute;
        z-index: -1;
        inset: 16% 8% 2%;
        border-radius: inherit;
        pointer-events: none;
        background:
          linear-gradient(105deg, rgba(98,218,247,0.22), rgba(139,124,255,0.3) 48%, rgba(255,115,180,0.2));
        filter: blur(38px);
        opacity: 0.2;
        transform: translateY(16px) scale(0.94);
        transition: opacity 260ms ease, transform 360ms cubic-bezier(.2,.8,.2,1);
      }

      .card {
        position: relative;
        min-height: 188px;
        overflow: hidden;
        border: 1px solid rgba(255,255,255,0.105);
        border-radius: inherit;
        color: var(--kayf-text);
        background:
          radial-gradient(circle at 14% 0%, rgba(255,255,255,0.08), transparent 34%),
          linear-gradient(145deg, rgba(24,24,33,0.97), rgba(9,9,14,0.985));
        transform-style: preserve-3d;
        transform-origin: center;
        backface-visibility: hidden;
        will-change: transform;
        box-shadow:
          inset 0 1px 0 rgba(255,255,255,0.06),
          0 22px 54px rgba(0,0,0,0.28);
        transition: border-color 240ms ease, box-shadow 260ms ease;
      }

      .foil,
      .glare,
      .grain,
      .rim {
        position: absolute;
        inset: 0;
        border-radius: inherit;
        pointer-events: none;
      }

      .foil {
        z-index: 1;
        background:
          radial-gradient(
            circle at var(--holo-x) var(--holo-y),
            rgba(255,255,255,0.5) 0,
            rgba(255,255,255,0.1) 15%,
            transparent 37%
          ),
          linear-gradient(
            118deg,
            transparent 8%,
            rgba(98,218,247,0.2) 27%,
            rgba(81,223,164,0.13) 38%,
            rgba(248,200,104,0.18) 49%,
            rgba(255,115,180,0.18) 59%,
            rgba(139,124,255,0.24) 72%,
            transparent 92%
          );
        background-size: 100% 100%, 220% 220%;
        background-position: center, calc(100% - var(--holo-x)) calc(100% - var(--holo-y));
        mix-blend-mode: screen;
        opacity: calc(var(--holo-opacity) * 0.3);
        transition: opacity 220ms ease;
      }

      .glare {
        z-index: 2;
        background: radial-gradient(
          circle at var(--holo-x) var(--holo-y),
          rgba(255,255,255,0.16),
          transparent 24%
        );
        mix-blend-mode: screen;
        opacity: 0.25;
        transition: opacity 220ms ease;
      }

      .grain {
        z-index: 3;
        opacity: 0.13;
        background:
          repeating-linear-gradient(115deg, transparent 0 4px, rgba(255,255,255,0.025) 4px 5px),
          repeating-linear-gradient(15deg, transparent 0 7px, rgba(98,218,247,0.018) 7px 8px);
        mix-blend-mode: soft-light;
      }

      .rim {
        z-index: 5;
        border: 1px solid rgba(255,255,255,0.05);
        box-shadow:
          inset 0 1px 0 rgba(255,255,255,0.08),
          inset 0 0 30px rgba(139,124,255,0.025);
        transition: border-color 240ms ease, box-shadow 240ms ease;
      }

      .content {
        position: relative;
        z-index: 4;
        min-height: inherit;
        transform: translateZ(18px);
      }

      .scene.active .ambient,
      :host(:focus-visible) .ambient,
      :host(:focus-within) .ambient {
        opacity: 0.62;
        transform: translateY(12px) scale(1);
      }

      .scene.active .card,
      :host(:focus-visible) .card,
      :host(:focus-within) .card {
        border-color: rgba(255,255,255,0.16);
        box-shadow:
          inset 0 1px 0 rgba(255,255,255,0.11),
          0 30px 78px rgba(0,0,0,0.4),
          0 0 46px rgba(139,124,255,0.1);
      }

      .scene.active .foil,
      :host(:focus-visible) .foil,
      :host(:focus-within) .foil { opacity: var(--holo-opacity); }

      .scene.active .glare,
      :host(:focus-visible) .glare,
      :host(:focus-within) .glare { opacity: 0.78; }

      .scene.active .rim,
      :host(:focus-visible) .rim,
      :host(:focus-within) .rim {
        border-color: rgba(255,255,255,0.14);
        box-shadow:
          inset 0 1px 0 rgba(255,255,255,0.16),
          inset 0 0 32px rgba(139,124,255,0.055);
      }

      ::slotted(*) {
        display: block;
        max-width: 100%;
      }

      @media (prefers-reduced-motion: reduce) {
        .card { transform: none !important; will-change: auto; }
        .ambient { transform: translateY(12px); }
      }
    `
  }

  protected template(): string {
    return `
      <div class="scene" part="scene">
        <div class="ambient" aria-hidden="true"></div>
        <div class="card" part="card">
          <div class="foil" part="foil" aria-hidden="true"></div>
          <div class="glare" aria-hidden="true"></div>
          <div class="grain" aria-hidden="true"></div>
          <div class="content" part="content"><slot></slot></div>
          <div class="rim" aria-hidden="true"></div>
        </div>
      </div>
    `
  }

  protected setup(): void {
    this.cleanup()
    this.targetRotateX = 0
    this.targetRotateY = 0
    this.currentRotateX = 0
    this.currentRotateY = 0
    this.targetScale = 1
    this.currentScale = 1
    this.scene = this.root.querySelector('.scene') as HTMLElement | null ?? undefined
    this.card = this.root.querySelector('.card') as HTMLElement | null ?? undefined
    if (!this.scene || !this.card) return

    this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    this.onPointerEnter = (event: PointerEvent) => {
      if (event.pointerType === 'touch') return
      this.scene?.classList.add('active')
      if (this.reducedMotion) return
      this.targetScale = this.scaleValue
      this.startAnimation()
    }

    this.onPointerMove = (event: PointerEvent) => {
      if (event.pointerType === 'touch' || !this.scene) return
      const rect = this.scene.getBoundingClientRect()
      if (!rect.width || !rect.height) return

      const pointerX = clamp((event.clientX - rect.left) / rect.width, 0, 1)
      const pointerY = clamp((event.clientY - rect.top) / rect.height, 0, 1)
      const normalizedX = pointerX * 2 - 1
      const normalizedY = pointerY * 2 - 1

      this.scene.style.setProperty('--holo-x', `${(pointerX * 100).toFixed(2)}%`)
      this.scene.style.setProperty('--holo-y', `${(pointerY * 100).toFixed(2)}%`)

      if (!this.reducedMotion) {
        this.targetRotateX = -normalizedY * this.maxTilt
        this.targetRotateY = normalizedX * this.maxTilt
        this.startAnimation()
      }
    }

    this.onPointerLeave = () => {
      this.scene?.classList.remove('active')
      this.scene?.style.setProperty('--holo-x', '50%')
      this.scene?.style.setProperty('--holo-y', '50%')
      this.targetRotateX = 0
      this.targetRotateY = 0
      this.targetScale = 1
      if (!this.reducedMotion) this.startAnimation()
    }

    this.scene.addEventListener('pointerenter', this.onPointerEnter)
    this.scene.addEventListener('pointermove', this.onPointerMove)
    this.scene.addEventListener('pointerleave', this.onPointerLeave)
    this.scene.addEventListener('pointercancel', this.onPointerLeave)
  }

  protected cleanup(): void {
    cancelAnimationFrame(this.frame)
    this.frame = 0
    if (this.scene && this.onPointerEnter) this.scene.removeEventListener('pointerenter', this.onPointerEnter)
    if (this.scene && this.onPointerMove) this.scene.removeEventListener('pointermove', this.onPointerMove)
    if (this.scene && this.onPointerLeave) {
      this.scene.removeEventListener('pointerleave', this.onPointerLeave)
      this.scene.removeEventListener('pointercancel', this.onPointerLeave)
    }
  }

  private startAnimation(): void {
    if (!this.frame) this.frame = requestAnimationFrame(this.tick)
  }

  private tick = (): void => {
    if (!this.card) {
      this.frame = 0
      return
    }

    const easing = 0.13
    this.currentRotateX += (this.targetRotateX - this.currentRotateX) * easing
    this.currentRotateY += (this.targetRotateY - this.currentRotateY) * easing
    this.currentScale += (this.targetScale - this.currentScale) * easing

    this.card.style.transform = `rotateX(${this.currentRotateX.toFixed(3)}deg) rotateY(${this.currentRotateY.toFixed(3)}deg) scale(${this.currentScale.toFixed(4)})`

    const isMoving =
      Math.abs(this.targetRotateX - this.currentRotateX) > 0.015 ||
      Math.abs(this.targetRotateY - this.currentRotateY) > 0.015 ||
      Math.abs(this.targetScale - this.currentScale) > 0.0002

    if (isMoving) {
      this.frame = requestAnimationFrame(this.tick)
    } else {
      this.currentRotateX = this.targetRotateX
      this.currentRotateY = this.targetRotateY
      this.currentScale = this.targetScale
      this.card.style.transform = `rotateX(${this.currentRotateX.toFixed(3)}deg) rotateY(${this.currentRotateY.toFixed(3)}deg) scale(${this.currentScale.toFixed(4)})`
      this.frame = 0
    }
  }
}

if (!customElements.get('kayf-holographic-card')) {
  customElements.define('kayf-holographic-card', HolographicCard)
}
