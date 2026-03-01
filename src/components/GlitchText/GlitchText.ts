import { KayfElement } from '../../core/KayfElement'
import { baseCSS, getColor, ColorVariant } from '../../core/tokens'

/**
 * <kayf-glitch-text>
 *
 * Атрибуты:
 *   color     - cyan | violet | emerald | amber | red | white (default: cyan)
 *   intensity - subtle | medium | hard                     (default: medium)
 *   speed     - slow | normal | fast                       (default: normal)
 *   text      - fallback текст, если slot пустой
 *   static    - boolean, отключает анимации
 *   uppercase - boolean, включает text-transform: uppercase
 *
 * Пример:
 *   <kayf-glitch-text color="violet" intensity="hard">
 *     SIGNAL LOST
 *   </kayf-glitch-text>
 */

type Intensity = 'subtle' | 'medium' | 'hard'
type Speed = 'slow' | 'normal' | 'fast'

const INTENSITY_MAP: Record<Intensity, { shiftPx: number; layerOpacity: number; shadowAlpha: number }> = {
  subtle: { shiftPx: 1.2, layerOpacity: 0.55, shadowAlpha: 0.28 },
  medium: { shiftPx: 2.2, layerOpacity: 0.72, shadowAlpha: 0.35 },
  hard: { shiftPx: 3.2, layerOpacity: 0.84, shadowAlpha: 0.45 },
}

const SPEED_MAP: Record<Speed, { layerMs: number; flickerMs: number; burstMs: number }> = {
  slow: { layerMs: 3900, flickerMs: 5300, burstMs: 2400 },
  normal: { layerMs: 2500, flickerMs: 3600, burstMs: 1700 },
  fast: { layerMs: 1700, flickerMs: 2400, burstMs: 1100 },
}

export class GlitchText extends KayfElement {
  private _wrap?: HTMLElement
  private _slot?: HTMLSlotElement
  private _layerA?: HTMLElement
  private _layerB?: HTMLElement
  private _onSlotChange?: () => void
  private _onEnter?: () => void
  private _observer?: MutationObserver
  private _burstInterval = 0
  private _burstTimeout = 0

  static get observedAttributes() {
    return ['color', 'intensity', 'speed', 'text', 'static', 'uppercase']
  }

  get color(): ColorVariant { return this.attr('color', 'cyan') as ColorVariant }
  get intensity(): Intensity { return this.attr('intensity', 'medium') as Intensity }
  get speed(): Speed { return this.attr('speed', 'normal') as Speed }
  get isStatic(): boolean { return this.boolAttr('static') }
  get isUppercase(): boolean { return this.boolAttr('uppercase') }

  protected styles(): string {
    const color = getColor(this.color)
    const level = INTENSITY_MAP[this.intensity] ?? INTENSITY_MAP.medium
    const speed = SPEED_MAP[this.speed] ?? SPEED_MAP.normal

    return baseCSS + `
      *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
      :host {
        display: inline-block;
        position: relative;
        color: ${color};
      }

      .wrap {
        position: relative;
        display: inline-grid;
        align-items: center;
        justify-items: start;
        line-height: 1.05;
        letter-spacing: 0.03em;
        font-family: var(--kayf-font-sans);
        font-weight: 800;
        isolation: isolate;
        text-shadow: 0 0 16px rgba(255,255,255,${level.shadowAlpha});
        ${this.isUppercase ? 'text-transform: uppercase;' : ''}
      }

      .content,
      .layer {
        grid-area: 1 / 1;
        white-space: pre-wrap;
      }

      .content {
        position: relative;
        z-index: 2;
        color: rgba(255,255,255,0.96);
        filter: drop-shadow(0 0 6px ${color}44);
        animation: main-flicker ${speed.flickerMs}ms linear infinite;
      }

      .layer {
        position: relative;
        z-index: 1;
        pointer-events: none;
        opacity: ${level.layerOpacity};
        mix-blend-mode: screen;
      }

      .layer-a {
        color: ${color};
        transform: translateX(calc(var(--offset-x, 0px) * -1));
        animation:
          glitch-clip-a ${speed.layerMs}ms steps(2, end) infinite,
          glitch-shift-a ${Math.round(speed.layerMs * 0.9)}ms steps(1, end) infinite;
      }

      .layer-b {
        color: #ff4d8d;
        transform: translateX(var(--offset-x, 0px));
        animation:
          glitch-clip-b ${Math.round(speed.layerMs * 1.1)}ms steps(2, end) infinite,
          glitch-shift-b ${Math.round(speed.layerMs * 0.8)}ms steps(1, end) infinite;
      }

      .scanline {
        position: absolute;
        left: -2%;
        width: 104%;
        height: 2px;
        top: -15%;
        opacity: 0;
        pointer-events: none;
        background: linear-gradient(90deg, transparent, ${color}99, transparent);
        filter: blur(0.5px);
        z-index: 3;
        animation: scan ${Math.round(speed.layerMs * 1.25)}ms linear infinite;
      }

      .wrap.is-burst .layer-a,
      .wrap.is-burst .layer-b {
        opacity: 0.98;
      }

      .wrap.is-burst .layer-a { transform: translateX(${level.shiftPx * -1.65}px); }
      .wrap.is-burst .layer-b { transform: translateX(${level.shiftPx * 1.65}px); }
      .wrap.is-burst .content { opacity: 0.88; }

      :host([static]) .content,
      :host([static]) .layer,
      :host([static]) .scanline {
        animation: none !important;
      }

      :host([static]) .layer { opacity: 0.25; }
      :host([static]) .scanline { display: none; }

      @keyframes glitch-clip-a {
        0%, 7%, 58%, 100% { clip-path: inset(0 0 0 0); }
        8%  { clip-path: inset(12% 0 72% 0); }
        14% { clip-path: inset(50% 0 28% 0); }
        20% { clip-path: inset(72% 0 6% 0); }
        36% { clip-path: inset(32% 0 40% 0); }
      }

      @keyframes glitch-clip-b {
        0%, 9%, 62%, 100% { clip-path: inset(0 0 0 0); }
        10% { clip-path: inset(70% 0 8% 0); }
        16% { clip-path: inset(18% 0 62% 0); }
        28% { clip-path: inset(45% 0 29% 0); }
        43% { clip-path: inset(8% 0 77% 0); }
      }

      @keyframes glitch-shift-a {
        0%, 58%, 100% { transform: translateX(0); }
        7%  { transform: translateX(${level.shiftPx * -1.2}px); }
        13% { transform: translateX(${level.shiftPx * 0.45}px); }
        19% { transform: translateX(${level.shiftPx * -0.9}px); }
      }

      @keyframes glitch-shift-b {
        0%, 63%, 100% { transform: translateX(0); }
        8%  { transform: translateX(${level.shiftPx * 1.1}px); }
        15% { transform: translateX(${level.shiftPx * -0.35}px); }
        22% { transform: translateX(${level.shiftPx * 0.8}px); }
      }

      @keyframes main-flicker {
        0%, 13%, 40%, 64%, 100% { opacity: 1; }
        14% { opacity: 0.82; }
        41% { opacity: 0.9; }
        66% { opacity: 0.86; }
      }

      @keyframes scan {
        0%   { top: -15%; opacity: 0; }
        8%   { opacity: 0.4; }
        30%  { opacity: 0.2; }
        52%  { opacity: 0.35; }
        100% { top: 115%; opacity: 0; }
      }
    `
  }

  protected template(): string {
    return `
      <span class="wrap">
        <span class="scanline" aria-hidden="true"></span>
        <span class="layer layer-a" aria-hidden="true"></span>
        <span class="layer layer-b" aria-hidden="true"></span>
        <span class="content"><slot></slot></span>
      </span>
    `
  }

  protected setup(): void {
    this.cleanup()

    this._wrap = this.root.querySelector('.wrap') as HTMLElement | null ?? undefined
    this._slot = this.root.querySelector('slot') as HTMLSlotElement | null ?? undefined
    this._layerA = this.root.querySelector('.layer-a') as HTMLElement | null ?? undefined
    this._layerB = this.root.querySelector('.layer-b') as HTMLElement | null ?? undefined
    if (!this._wrap || !this._slot || !this._layerA || !this._layerB) return

    const syncText = () => {
      const text = this._resolveText(this._slot!)
      this._layerA!.textContent = text
      this._layerB!.textContent = text
      this._wrap!.style.setProperty('--offset-x', `${(INTENSITY_MAP[this.intensity] ?? INTENSITY_MAP.medium).shiftPx}px`)
    }

    this._onSlotChange = syncText
    this._slot.addEventListener('slotchange', this._onSlotChange)
    syncText()

    this._observer = new MutationObserver(syncText)
    this._observer.observe(this, { subtree: true, childList: true, characterData: true })

    if (this.isStatic) return

    this._onEnter = () => this._burst()
    this._wrap.addEventListener('pointerenter', this._onEnter)

    const step = SPEED_MAP[this.speed] ?? SPEED_MAP.normal
    this._burstInterval = window.setInterval(() => {
      if (Math.random() > 0.52) this._burst()
    }, step.burstMs)
  }

  protected cleanup(): void {
    if (this._slot && this._onSlotChange) {
      this._slot.removeEventListener('slotchange', this._onSlotChange)
    }

    if (this._wrap && this._onEnter) {
      this._wrap.removeEventListener('pointerenter', this._onEnter)
    }

    this._observer?.disconnect()

    if (this._burstInterval) {
      window.clearInterval(this._burstInterval)
      this._burstInterval = 0
    }

    if (this._burstTimeout) {
      window.clearTimeout(this._burstTimeout)
      this._burstTimeout = 0
    }
  }

  private _resolveText(slot: HTMLSlotElement): string {
    const assigned = slot.assignedNodes({ flatten: true })
    const fromSlot = assigned.map(node => node.textContent ?? '').join(' ')
      .replace(/\s+/g, ' ')
      .trim()
    return fromSlot || this.attr('text', '').trim()
  }

  private _burst(): void {
    if (!this._wrap) return
    this._wrap.classList.add('is-burst')
    if (this._burstTimeout) window.clearTimeout(this._burstTimeout)
    this._burstTimeout = window.setTimeout(() => {
      this._wrap?.classList.remove('is-burst')
      this._burstTimeout = 0
    }, 130)
  }
}

if (!customElements.get('kayf-glitch-text')) {
  customElements.define('kayf-glitch-text', GlitchText)
}
