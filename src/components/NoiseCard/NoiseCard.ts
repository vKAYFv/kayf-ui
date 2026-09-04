import { KayfElement } from '../../core/KayfElement'
import { baseCSS, getColor } from '../../core/tokens'

type Variant = 'default' | 'elevated' | 'flat' | 'glass'

const aliases: Record<string, string> = {
  blue: '#5b8cff',
  purple: '#8b7cff',
  green: '#51dfa4',
  orange: '#ff9c66',
  gold: '#f8c868',
}

function toRgb(value: string): [number, number, number] {
  const normalized = value.replace('#', '')
  const hex = normalized.length === 3
    ? normalized.split('').map(char => char + char).join('')
    : normalized
  if (!/^[\da-f]{6}$/i.test(hex)) return [139, 124, 255]
  return [0, 2, 4].map(index => Number.parseInt(hex.slice(index, index + 2), 16)) as [number, number, number]
}

/** A tactile glass surface with a lightweight monochrome grain layer. */
export class NoiseCard extends KayfElement {
  private noiseFrame = 0

  static override get observedAttributes() {
    return ['variant', 'glow', 'noise-opacity', 'padding']
  }

  private get variant() { return this.attr('variant', 'default') as Variant }
  private get glow() { return this.attr('glow', 'cyan') }
  private get noiseOpacity() { return Math.min(0.15, Math.max(0, this.numAttr('noise-opacity', 0.035))) }
  private get padding() { return this.attr('padding', '24px') }
  private get glowHex() { return aliases[this.glow] ?? getColor(this.glow) }

  protected styles(): string {
    const [red, green, blue] = toRgb(this.glowHex)
    const variantCSS: Record<Variant, string> = {
      default: `background: rgba(15,15,21,0.88); border-color: rgba(255,255,255,0.09);`,
      elevated: `background: rgba(20,20,28,0.94); border-color: rgba(${red},${green},${blue},0.24); box-shadow: var(--kayf-shadow);`,
      flat: `background: #0e0e13; border-color: rgba(255,255,255,0.065);`,
      glass: `background: rgba(18,18,25,0.62); border-color: rgba(255,255,255,0.11); backdrop-filter: blur(24px) saturate(125%); -webkit-backdrop-filter: blur(24px) saturate(125%);`,
    }

    return baseCSS + `
      *, *::before, *::after { box-sizing: border-box; }
      :host { display: block; }

      .card {
        position: relative;
        overflow: hidden;
        min-height: 100%;
        padding: ${this.padding};
        border: 1px solid;
        border-radius: var(--kayf-radius-md);
        color: var(--kayf-text);
        ${variantCSS[this.variant] ?? variantCSS.default}
        transition: border-color 220ms ease, box-shadow 220ms ease, transform 220ms ease;
      }

      .card::before {
        content: '';
        position: absolute;
        inset: 0;
        pointer-events: none;
        background:
          radial-gradient(circle at 0 0, rgba(${red},${green},${blue},0.12), transparent 44%),
          linear-gradient(135deg, rgba(255,255,255,0.04), transparent 48%);
      }

      .card::after {
        content: '';
        position: absolute;
        inset: 0 18% auto;
        height: 1px;
        pointer-events: none;
        background: linear-gradient(90deg, transparent, rgba(${red},${green},${blue},0.72), transparent);
        opacity: 0.72;
      }

      canvas {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        mix-blend-mode: soft-light;
        opacity: ${Math.min(0.55, this.noiseOpacity * 5)};
      }

      .content { position: relative; z-index: 1; }

      :host(:hover) .card {
        border-color: rgba(${red},${green},${blue},0.34);
        box-shadow: 0 22px 56px rgba(0,0,0,0.3), 0 0 36px rgba(${red},${green},${blue},0.08);
        transform: translateY(-2px);
      }

      ::slotted(*) { color: inherit; font-family: var(--kayf-font-sans); }
    `
  }

  protected template(): string {
    return `
      <div class="card" part="card">
        <canvas id="noise" width="128" height="128" aria-hidden="true"></canvas>
        <div class="content" part="content"><slot></slot></div>
      </div>
    `
  }

  protected setup(): void {
    cancelAnimationFrame(this.noiseFrame)
    this.noiseFrame = requestAnimationFrame(() => this.generateNoise())
  }

  protected cleanup(): void {
    cancelAnimationFrame(this.noiseFrame)
  }

  private generateNoise(): void {
    const canvas = this.root.querySelector('#noise') as HTMLCanvasElement | null
    const context = canvas?.getContext('2d')
    if (!canvas || !context) return

    const image = context.createImageData(canvas.width, canvas.height)
    for (let index = 0; index < image.data.length; index += 4) {
      const value = Math.random() * 255
      image.data[index] = value
      image.data[index + 1] = value
      image.data[index + 2] = value
      image.data[index + 3] = 90
    }
    context.putImageData(image, 0, 0)
  }
}

if (!customElements.get('kayf-noise-card')) {
  customElements.define('kayf-noise-card', NoiseCard)
}
