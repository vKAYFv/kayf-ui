import { KayfElement } from '../../core/KayfElement';

type GlowKey = 'blue' | 'cyan' | 'purple' | 'green' | 'red' | 'orange' | 'gold';
type Variant  = 'default' | 'elevated' | 'flat' | 'glass';

const GLOW_MAP: Record<GlowKey, string> = {
  blue:   '#0066ff',
  cyan:   '#00d4ff',
  purple: '#8b5cf6',
  green:  '#00ff88',
  red:    '#ff3366',
  orange: '#ff6600',
  gold:   '#ffd700',
};

export class NoiseCard extends KayfElement {
  static override get observedAttributes() {
    return ['variant', 'glow', 'noise-opacity', 'padding'];
  }

  private get variant()      { return this.attr('variant', 'default') as Variant; }
  private get glow()         { return this.attr('glow', 'cyan'); }
  private get noiseOpacity() { return this.numAttr('noise-opacity', 0.04); }
  private get padding()      { return this.attr('padding', '24px'); }

  private get glowHex(): string {
    return GLOW_MAP[this.glow as GlowKey] ?? this.glow;
  }

  private get rgb(): [number, number, number] {
    const hex = this.glowHex.replace('#', '');
    return [
      parseInt(hex.slice(0, 2), 16),
      parseInt(hex.slice(2, 4), 16),
      parseInt(hex.slice(4, 6), 16),
    ];
  }

  protected styles(): string {
    const [r, g, b] = this.rgb;

    const variantCSS: Record<Variant, string> = {
      default:  `background: rgba(10,12,20,0.7); border: 1px solid rgba(${r},${g},${b},0.2);`,
      elevated: `background: rgba(15,18,28,0.85); border: 1px solid rgba(${r},${g},${b},0.35); box-shadow: 0 8px 32px rgba(0,0,0,0.4);`,
      flat:     `background: rgba(8,10,16,0.9);   border: 1px solid rgba(255,255,255,0.06);`,
      glass:    `background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);`,
    };

    return `
      :host { display: block; }
      .card {
        position: relative; overflow: hidden;
        border-radius: 12px; padding: ${this.padding};
        ${variantCSS[this.variant] ?? variantCSS.default}
        transition: box-shadow 0.3s, border-color 0.3s;
      }
      .card::before {
        content: '';
        position: absolute; inset: 0;
        background: radial-gradient(ellipse at top left, rgba(${r},${g},${b},0.08) 0%, transparent 60%);
        pointer-events: none;
      }
      .card::after {
        content: '';
        position: absolute; top: 0; left: 0; right: 0; height: 1px;
        background: linear-gradient(90deg, transparent, rgba(${r},${g},${b},0.6), transparent);
        pointer-events: none;
      }
      canvas.noise {
        position: absolute; inset: 0;
        width: 100%; height: 100%;
        pointer-events: none;
        mix-blend-mode: overlay;
        opacity: ${this.noiseOpacity * 10};
      }
      .glow-dot {
        position: absolute; top: -20px; right: 20px;
        width: 60px; height: 60px; border-radius: 50%;
        background: radial-gradient(circle, rgba(${r},${g},${b},0.4), transparent 70%);
        filter: blur(10px); pointer-events: none;
      }
      .content { position: relative; z-index: 1; }
      :host(:hover) .card {
        border-color: rgba(${r},${g},${b},0.5);
        box-shadow: 0 0 30px rgba(${r},${g},${b},0.1), 0 8px 40px rgba(0,0,0,0.4);
      }
      ::slotted(*) { color: rgba(255,255,255,0.9); }
    `;
  }

  protected template(): string {
    return `
      <div class="card">
        <canvas class="noise" id="noise"></canvas>
        <div class="glow-dot"></div>
        <div class="content"><slot></slot></div>
      </div>
    `;
  }

  protected setup(): void {
    // Defer so the canvas has layout dimensions
    requestAnimationFrame(() => this.generateNoise());
  }

  private generateNoise(): void {
    const canvas = this.root.querySelector('#noise') as HTMLCanvasElement;
    if (!canvas) return;

    const w = canvas.offsetWidth  || 300;
    const h = canvas.offsetHeight || 200;
    canvas.width  = w;
    canvas.height = h;

    const ctx       = canvas.getContext('2d')!;
    const imageData = ctx.createImageData(w, h);
    const data      = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
      const v    = Math.random() * 255;
      data[i]    = v;
      data[i + 1] = v;
      data[i + 2] = v;
      data[i + 3] = Math.random() * 255 * this.noiseOpacity * 20;
    }

    ctx.putImageData(imageData, 0, 0);
  }
}

customElements.define('kayf-noise-card', NoiseCard);