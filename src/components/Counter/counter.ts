import { KayfElement } from '../../core/KayfElement'
import { baseCSS, getColor } from '../../core/tokens'

/** Animated metric card that starts counting when it enters the viewport. */
export class KayfCounter extends KayfElement {
  private hasAnimated = false
  private observer?: IntersectionObserver
  private frame = 0

  static get observedAttributes() {
    return ['value', 'label', 'suffix', 'prefix', 'color', 'icon', 'duration', 'decimals']
  }

  private get color() { return getColor(this.attr('color', 'violet')) }

  protected styles(): string {
    return baseCSS + `
      *, *::before, *::after { box-sizing: border-box; }
      :host { display: block; }

      .card {
        position: relative;
        min-height: 172px;
        overflow: hidden;
        padding: 26px;
        border: 1px solid var(--kayf-border);
        border-radius: var(--kayf-radius-md);
        color: var(--kayf-text);
        background:
          radial-gradient(circle at 100% 0, ${this.color}1f, transparent 44%),
          linear-gradient(155deg, rgba(20,20,28,0.92), rgba(10,10,14,0.94));
        box-shadow: inset 0 1px 0 rgba(255,255,255,0.045), 0 18px 48px rgba(0,0,0,0.22);
        transition: transform 220ms ease, border-color 220ms ease, box-shadow 220ms ease;
      }

      .card:hover {
        transform: translateY(-2px);
        border-color: color-mix(in srgb, ${this.color} 32%, var(--kayf-border-strong));
        box-shadow: inset 0 1px 0 rgba(255,255,255,0.065), 0 24px 60px rgba(0,0,0,0.3);
      }

      .icon {
        display: inline-grid;
        width: 34px;
        height: 34px;
        margin-bottom: 24px;
        place-items: center;
        border: 1px solid ${this.color}3b;
        border-radius: 10px;
        color: ${this.color};
        background: ${this.color}12;
        font: 16px/1 var(--kayf-font-sans);
      }

      .value {
        margin-bottom: 9px;
        color: var(--kayf-text);
        font: 680 clamp(34px, 7vw, 46px)/1 var(--kayf-font-sans);
        font-variant-numeric: tabular-nums;
        letter-spacing: -0.045em;
      }

      .label {
        color: var(--kayf-muted);
        font: 600 12px/1.4 var(--kayf-font-sans);
        letter-spacing: 0.08em;
        text-transform: uppercase;
      }

      .progress {
        position: absolute;
        inset: auto 0 0;
        height: 2px;
        background: linear-gradient(90deg, ${this.color}, color-mix(in srgb, ${this.color} 35%, transparent));
        transform: scaleX(0);
        transform-origin: left;
        transition: transform var(--count-duration, 1600ms) cubic-bezier(.16, 1, .3, 1);
      }

      .progress.active { transform: scaleX(1); }
    `
  }

  protected template(): string {
    return `
      <article class="card" part="card">
        <span class="icon" id="icon" aria-hidden="true"></span>
        <div class="value" id="value" part="value" aria-live="polite"></div>
        <div class="label" id="label"></div>
        <div class="progress" id="progress" aria-hidden="true"></div>
      </article>
    `
  }

  protected setup(): void {
    this.cleanup()
    const icon = this.root.getElementById('icon')
    const label = this.root.getElementById('label')
    const value = this.root.getElementById('value')
    if (!icon || !label || !value) return

    icon.textContent = this.attr('icon', '↗')
    label.textContent = this.attr('label', 'Metric')
    value.textContent = `${this.attr('prefix')}0${this.attr('suffix')}`

    if (this.hasAnimated || matchMedia('(prefers-reduced-motion: reduce)').matches) {
      this.startCount()
      return
    }

    this.observer = new IntersectionObserver(entries => {
      if (!entries[0]?.isIntersecting) return
      this.hasAnimated = true
      this.startCount()
      this.observer?.disconnect()
    }, { threshold: 0.25 })
    this.observer.observe(this)
  }

  protected cleanup(): void {
    this.observer?.disconnect()
    cancelAnimationFrame(this.frame)
  }

  private startCount(): void {
    const value = this.root.getElementById('value')
    const progress = this.root.getElementById('progress')
    if (!value) return

    const target = this.numAttr('value', 0)
    const decimals = Math.max(0, Math.min(8, Math.trunc(this.numAttr('decimals', 0))))
    const duration = Math.max(0, this.numAttr('duration', 1600))
    const prefix = this.attr('prefix')
    const suffix = this.attr('suffix')
    const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches

    progress?.style.setProperty('--count-duration', `${duration}ms`)
    requestAnimationFrame(() => progress?.classList.add('active'))

    if (reducedMotion || duration === 0) {
      value.textContent = `${prefix}${target.toFixed(decimals)}${suffix}`
      return
    }

    const startedAt = performance.now()
    const tick = (now: number) => {
      const elapsed = Math.min((now - startedAt) / duration, 1)
      const eased = 1 - Math.pow(1 - elapsed, 4)
      value.textContent = `${prefix}${(target * eased).toFixed(decimals)}${suffix}`
      if (elapsed < 1) this.frame = requestAnimationFrame(tick)
    }
    this.frame = requestAnimationFrame(tick)
  }
}

if (!customElements.get('kayf-counter')) {
  customElements.define('kayf-counter', KayfCounter)
}
