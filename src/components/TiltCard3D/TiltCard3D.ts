import { KayfElement } from '../../core/KayfElement'
import { baseCSS } from '../../core/tokens'

const clamp = (value: number, min: number, max: number, fallback = min): number =>
  Number.isFinite(value) ? Math.min(max, Math.max(min, value)) : fallback

/** Adds restrained pointer-driven depth to arbitrary slotted content. */
export class TiltCard3D extends KayfElement {
  private wrapper?: HTMLElement
  private inner?: HTMLElement
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
    return ['max-tilt', 'scale', 'perspective', 'glow', 'no-shine']
  }

  private get maxTilt(): number {
    return clamp(this.numAttr('max-tilt', 9), 0, 24, 9)
  }

  private get scaleValue(): number {
    return clamp(this.numAttr('scale', 1.025), 1, 1.1, 1.025)
  }

  private get perspectiveValue(): number {
    return clamp(this.numAttr('perspective', 1200), 400, 2400, 1200)
  }

  private get glowColor(): string {
    return this.attr('glow', '#8b7cff')
  }

  protected styles(): string {
    return baseCSS + `
      *, *::before, *::after { box-sizing: border-box; }

      :host {
        --tilt-glow: ${this.glowColor};
        --tilt-pointer-x: 50%;
        --tilt-pointer-y: 50%;
        display: inline-block;
        max-width: 100%;
        vertical-align: top;
        border-radius: var(--kayf-radius-md);
        outline: none;
      }

      .wrapper {
        position: relative;
        display: block;
        max-width: 100%;
        border-radius: inherit;
        perspective: ${this.perspectiveValue}px;
        transform-style: preserve-3d;
        isolation: isolate;
      }

      .ambient {
        position: absolute;
        z-index: -1;
        inset: 14% 10% 4%;
        border-radius: inherit;
        pointer-events: none;
        background: color-mix(in srgb, var(--tilt-glow) 38%, transparent);
        filter: blur(32px);
        opacity: 0;
        transform: translateY(16px) scale(0.92);
        transition: opacity 240ms ease, transform 320ms cubic-bezier(.2,.8,.2,1);
      }

      .inner {
        position: relative;
        display: block;
        max-width: 100%;
        overflow: hidden;
        border-radius: inherit;
        transform-style: preserve-3d;
        transform-origin: center;
        backface-visibility: hidden;
        will-change: transform;
        box-shadow: 0 18px 44px rgba(0,0,0,0.18);
        transition: box-shadow 240ms ease;
      }

      .inner::after {
        content: '';
        position: absolute;
        z-index: 3;
        inset: 0;
        border: 1px solid rgba(255,255,255,0.08);
        border-radius: inherit;
        pointer-events: none;
        box-shadow: inset 0 1px 0 rgba(255,255,255,0.055);
        transition: border-color 240ms ease, box-shadow 240ms ease;
      }

      .shine {
        position: absolute;
        z-index: 2;
        inset: 0;
        border-radius: inherit;
        pointer-events: none;
        background:
          radial-gradient(
            circle at var(--tilt-pointer-x) var(--tilt-pointer-y),
            rgba(255,255,255,0.24) 0,
            rgba(255,255,255,0.075) 18%,
            transparent 48%
          ),
          linear-gradient(115deg, transparent 24%, rgba(255,255,255,0.045) 46%, transparent 68%);
        mix-blend-mode: soft-light;
        opacity: 0;
        transition: opacity 200ms ease;
      }

      .content {
        position: relative;
        z-index: 1;
        display: block;
        transform: translateZ(0);
      }

      .wrapper.active .ambient,
      :host(:focus-visible) .ambient,
      :host(:focus-within) .ambient {
        opacity: 0.58;
        transform: translateY(12px) scale(1);
      }

      .wrapper.active .inner,
      :host(:focus-visible) .inner,
      :host(:focus-within) .inner {
        box-shadow:
          0 26px 70px rgba(0,0,0,0.34),
          0 0 42px color-mix(in srgb, var(--tilt-glow) 13%, transparent);
      }

      .wrapper.active .inner::after,
      :host(:focus-visible) .inner::after,
      :host(:focus-within) .inner::after {
        border-color: color-mix(in srgb, var(--tilt-glow) 36%, rgba(255,255,255,0.12));
        box-shadow:
          inset 0 1px 0 rgba(255,255,255,0.1),
          inset 0 0 24px color-mix(in srgb, var(--tilt-glow) 6%, transparent);
      }

      .wrapper.active .shine,
      :host(:focus-visible) .shine,
      :host(:focus-within) .shine { opacity: 1; }

      :host([no-shine]) .shine { display: none; }

      ::slotted(*) {
        display: block;
        max-width: 100%;
        border-radius: inherit;
      }

      @media (prefers-reduced-motion: reduce) {
        .inner { transform: none !important; will-change: auto; }
        .ambient { transform: translateY(12px); }
      }
    `
  }

  protected template(): string {
    return `
      <div class="wrapper" part="wrapper">
        <div class="ambient" aria-hidden="true"></div>
        <div class="inner" part="surface">
          <div class="content" part="content"><slot></slot></div>
          <div class="shine" part="shine" aria-hidden="true"></div>
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
    this.wrapper = this.root.querySelector('.wrapper') as HTMLElement | null ?? undefined
    this.inner = this.root.querySelector('.inner') as HTMLElement | null ?? undefined
    if (!this.wrapper || !this.inner) return

    this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    this.onPointerEnter = (event: PointerEvent) => {
      if (event.pointerType === 'touch') return
      this.wrapper?.classList.add('active')
      if (this.reducedMotion) return
      this.targetScale = this.scaleValue
      this.startAnimation()
    }

    this.onPointerMove = (event: PointerEvent) => {
      if (event.pointerType === 'touch' || !this.wrapper) return
      const rect = this.wrapper.getBoundingClientRect()
      if (!rect.width || !rect.height) return

      const pointerX = clamp((event.clientX - rect.left) / rect.width, 0, 1)
      const pointerY = clamp((event.clientY - rect.top) / rect.height, 0, 1)
      const normalizedX = pointerX * 2 - 1
      const normalizedY = pointerY * 2 - 1

      this.wrapper.style.setProperty('--tilt-pointer-x', `${(pointerX * 100).toFixed(2)}%`)
      this.wrapper.style.setProperty('--tilt-pointer-y', `${(pointerY * 100).toFixed(2)}%`)

      if (!this.reducedMotion) {
        this.targetRotateX = -normalizedY * this.maxTilt
        this.targetRotateY = normalizedX * this.maxTilt
        this.startAnimation()
      }

      this.dispatchEvent(new CustomEvent('kayf-tilt', {
        detail: { rotateX: this.targetRotateX, rotateY: this.targetRotateY },
        bubbles: true,
        composed: true,
      }))
    }

    this.onPointerLeave = () => {
      this.wrapper?.classList.remove('active')
      this.wrapper?.style.setProperty('--tilt-pointer-x', '50%')
      this.wrapper?.style.setProperty('--tilt-pointer-y', '50%')
      this.targetRotateX = 0
      this.targetRotateY = 0
      this.targetScale = 1
      if (!this.reducedMotion) this.startAnimation()
    }

    this.wrapper.addEventListener('pointerenter', this.onPointerEnter)
    this.wrapper.addEventListener('pointermove', this.onPointerMove)
    this.wrapper.addEventListener('pointerleave', this.onPointerLeave)
    this.wrapper.addEventListener('pointercancel', this.onPointerLeave)
  }

  protected cleanup(): void {
    cancelAnimationFrame(this.frame)
    this.frame = 0
    if (this.wrapper && this.onPointerEnter) this.wrapper.removeEventListener('pointerenter', this.onPointerEnter)
    if (this.wrapper && this.onPointerMove) this.wrapper.removeEventListener('pointermove', this.onPointerMove)
    if (this.wrapper && this.onPointerLeave) {
      this.wrapper.removeEventListener('pointerleave', this.onPointerLeave)
      this.wrapper.removeEventListener('pointercancel', this.onPointerLeave)
    }
  }

  private startAnimation(): void {
    if (!this.frame) this.frame = requestAnimationFrame(this.tick)
  }

  private tick = (): void => {
    if (!this.inner) {
      this.frame = 0
      return
    }

    const easing = 0.14
    this.currentRotateX += (this.targetRotateX - this.currentRotateX) * easing
    this.currentRotateY += (this.targetRotateY - this.currentRotateY) * easing
    this.currentScale += (this.targetScale - this.currentScale) * easing

    this.inner.style.transform = `rotateX(${this.currentRotateX.toFixed(3)}deg) rotateY(${this.currentRotateY.toFixed(3)}deg) scale(${this.currentScale.toFixed(4)})`

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
      this.inner.style.transform = `rotateX(${this.currentRotateX.toFixed(3)}deg) rotateY(${this.currentRotateY.toFixed(3)}deg) scale(${this.currentScale.toFixed(4)})`
      this.frame = 0
    }
  }
}

if (!customElements.get('kayf-3d-tilt-card')) {
  customElements.define('kayf-3d-tilt-card', TiltCard3D)
}
