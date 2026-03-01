import { KayfElement } from '../../core/KayfElement'
import { baseCSS } from '../../core/tokens'

/**
 * <kayf-aurora-card>
 *
 * Атрибуты:
 *   speed    — slow | normal | fast (default: normal)
 *   blur     — sm | md | lg (default: md)
 *   opacity  — 0.0–1.0 (default: 0.6)
 *   colors   — через запятую: "cyan,violet,emerald" (default: cyan,violet,emerald,amber)
 *   static   — boolean, отключает анимацию
 *
 * Слоты:
 *   (default) — контент поверх aurora
 *
 * Пример:
 *   <kayf-aurora-card colors="cyan,violet" speed="slow">
 *     <h2>Title</h2>
 *     <p>Content</p>
 *   </kayf-aurora-card>
 */

const COLOR_MAP: Record<string, number[]> = {
  cyan:    [0,   212, 255],
  violet:  [124, 58,  237],
  emerald: [16,  185, 129],
  amber:   [245, 158, 11 ],
  red:     [239, 68,  68 ],
  white:   [232, 232, 240],
}

const SPEED_MAP: Record<string, number> = {
  slow: 0.00015, normal: 0.0003, fast: 0.0006,
}

const BLUR_MAP: Record<string, number> = {
  sm: 80, md: 120, lg: 180,
}

interface Blob {
  x: number
  y: number
  rgb: number[]
  phase: number
  speed: number
}

export class AuroraCard extends KayfElement {
  private _canvas!: HTMLCanvasElement
  private _ctx!: CanvasRenderingContext2D
  private _blobs: Blob[] = []
  private _raf = 0
  private _resizeOb!: ResizeObserver

  static get observedAttributes() {
    return ['speed', 'blur', 'opacity', 'colors', 'static']
  }

  // Переименованы чтобы не конфликтовать с HTMLElement.blur()
  get speedValue(): number  { return SPEED_MAP[this.attr('speed', 'normal')] ?? 0.0003 }
  get blurSize(): number    { return BLUR_MAP[this.attr('blur', 'md')] ?? 120 }
  get opacityValue(): number { return this.numAttr('opacity', 0.6) }
  get isStatic(): boolean   { return this.boolAttr('static') }

  get colorList(): number[][] {
    return this.attr('colors', 'cyan,violet,emerald,amber')
      .split(',')
      .map(s => COLOR_MAP[s.trim()] ?? COLOR_MAP.cyan)
  }

  protected styles(): string {
    return baseCSS + `
      *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

      :host {
        display: block;
        position: relative;
        border-radius: 20px;
        overflow: hidden;
      }

      .wrap {
        position: relative;
        border-radius: 20px;
        overflow: hidden;
        border: 1px solid rgba(255,255,255,0.07);
      }

      canvas {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        border-radius: 20px;
      }

      .content {
        position: relative;
        z-index: 1;
        background: rgba(5, 5, 8, 0.55);
        backdrop-filter: blur(12px);
        -webkit-backdrop-filter: blur(12px);
        border-radius: 19px;
        min-height: 200px;
        padding: 40px;
      }

      ::slotted(h1), ::slotted(h2), ::slotted(h3) {
        font-family: var(--kayf-font-sans);
        font-weight: 800;
        color: #fff;
        margin-bottom: 12px;
        line-height: 1.1;
      }

      ::slotted(p) {
        font-family: var(--kayf-font-mono);
        font-size: 13px;
        color: rgba(232,232,240,0.5);
        line-height: 1.7;
        font-weight: 300;
      }
    `
  }

  protected template(): string {
    return `
      <div class="wrap">
        <canvas part="canvas"></canvas>
        <div class="content">
          <slot></slot>
        </div>
      </div>
    `
  }

  protected setup(): void {
    // Останавливаем предыдущий цикл при реактивном обновлении атрибутов
    cancelAnimationFrame(this._raf)
    this._resizeOb?.disconnect()

    const canvas = this.root.querySelector('canvas') as HTMLCanvasElement
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    this._canvas = canvas
    this._ctx    = ctx

    this._initBlobs()
    this._resize()

    this._resizeOb = new ResizeObserver(() => this._resize())
    this._resizeOb.observe(this)

    if (this.isStatic) {
      this._drawFrame(0)
    } else {
      this._startLoop()
    }
  }

  protected cleanup(): void {
    cancelAnimationFrame(this._raf)
    this._resizeOb?.disconnect()
  }

  private _initBlobs(): void {
    const colors = this.colorList
    this._blobs = colors.map((rgb, i) => ({
      x:     0.15 + (i / colors.length) * 0.7,
      y:     0.2  + Math.sin(i * 1.3) * 0.35 + 0.15,
      rgb,
      phase: i * (Math.PI * 2 / colors.length),
      speed: this.speedValue * (0.7 + Math.random() * 0.6),
    }))
  }

  private _resize(): void {
    this._canvas.width  = this.offsetWidth  || 600
    this._canvas.height = this.offsetHeight || 300
    if (this.isStatic) this._drawFrame(0)
  }

  private _startLoop(): void {
    const tick = (t: number) => {
      this._drawFrame(t)
      this._raf = requestAnimationFrame(tick)
    }
    this._raf = requestAnimationFrame(tick)
  }

  private _drawFrame(t: number): void {
    const { _ctx: ctx, _canvas: canvas, _blobs: blobs } = this
    const { width: w, height: h } = canvas
    if (!w || !h) return

    ctx.clearRect(0, 0, w, h)

    const blurPx  = this.blurSize
    const opac    = this.opacityValue
    const minDim  = Math.min(w, h)

    blobs.forEach(b => {
      const bx = this.isStatic
        ? b.x
        : b.x + Math.sin(t * b.speed + b.phase) * 0.18

      const by = this.isStatic
        ? b.y
        : b.y + Math.cos(t * b.speed * 0.7 + b.phase) * 0.12

      const px = bx * w
      const py = by * h
      const r  = 0.32 * minDim + blurPx

      const grad = ctx.createRadialGradient(px, py, 0, px, py, r)
      grad.addColorStop(0,   `rgba(${b.rgb.join(',')},${opac})`)
      grad.addColorStop(0.5, `rgba(${b.rgb.join(',')},${opac * 0.35})`)
      grad.addColorStop(1,   `rgba(${b.rgb.join(',')},0)`)

      ctx.fillStyle = grad
      ctx.beginPath()
      ctx.arc(px, py, r, 0, Math.PI * 2)
      ctx.fill()
    })
  }
}

if (!customElements.get('kayf-aurora-card')) {
  customElements.define('kayf-aurora-card', AuroraCard)
}