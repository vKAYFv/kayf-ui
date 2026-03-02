import { KayfElement } from '../../core/KayfElement';

interface RippleWave {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  alpha: number;
  speed: number;
  rgb: string;
}

interface GridPoint {
  x: number;
  y: number;
  baseAlpha: number;
}

export class RippleGrid extends KayfElement {
  private canvas: HTMLCanvasElement | null = null;
  private ctx: CanvasRenderingContext2D | null = null;
  private rafId: number = 0;
  private autoTimer: number = 0;
  private ripples: RippleWave[] = [];
  private gridPoints: GridPoint[] = [];

  static override get observedAttributes() {
    return ['color', 'grid-size', 'auto-ripple', 'width', 'height'];
  }

  private get color()      { return this.attr('color', '#00d4ff'); }
  private get gridSize()   { return this.numAttr('grid-size', 30); }
  private get autoRipple() { return this.boolAttr('auto-ripple'); }
  private get cWidth()     { return this.numAttr('width', 400); }
  private get cHeight()    { return this.numAttr('height', 300); }

  private get rgb(): string {
    const hex = this.color.replace('#', '');
    return [
      parseInt(hex.slice(0, 2), 16),
      parseInt(hex.slice(2, 4), 16),
      parseInt(hex.slice(4, 6), 16),
    ].join(',');
  }

  protected styles(): string {
    return `
      :host { display: inline-block; }
      canvas { display: block; cursor: crosshair; border-radius: 8px; }
    `;
  }

  protected template(): string {
    return `<canvas id="c" width="${this.cWidth}" height="${this.cHeight}"></canvas>`;
  }

  protected setup(): void {
    this.canvas = this.root.querySelector('#c') as HTMLCanvasElement;
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');

    this.buildGrid();
    this.addListeners();

    if (this.autoRipple) {
      this.autoTimer = window.setInterval(() => {
        this.addRipple(Math.random() * this.cWidth, Math.random() * this.cHeight);
      }, 800);
    }

    cancelAnimationFrame(this.rafId);
    this.tick();
  }

  protected cleanup(): void {
    cancelAnimationFrame(this.rafId);
    clearInterval(this.autoTimer);
  }

  private buildGrid(): void {
    this.gridPoints = [];
    const gs = this.gridSize;
    for (let x = gs / 2; x < this.cWidth; x += gs) {
      for (let y = gs / 2; y < this.cHeight; y += gs) {
        this.gridPoints.push({ x, y, baseAlpha: 0.15 + Math.random() * 0.1 });
      }
    }
  }

  private addListeners(): void {
    if (!this.canvas) return;

    this.canvas.addEventListener('click', (e: MouseEvent) => {
      const rect   = this.canvas!.getBoundingClientRect();
      const scaleX = this.cWidth  / rect.width;
      const scaleY = this.cHeight / rect.height;
      this.addRipple((e.clientX - rect.left) * scaleX, (e.clientY - rect.top) * scaleY);
    });

    this.canvas.addEventListener('mousemove', (e: MouseEvent) => {
      if (Math.random() > 0.05) return;
      const rect   = this.canvas!.getBoundingClientRect();
      const scaleX = this.cWidth  / rect.width;
      const scaleY = this.cHeight / rect.height;
      this.addRipple((e.clientX - rect.left) * scaleX, (e.clientY - rect.top) * scaleY, true);
    });
  }

  private addRipple(x: number, y: number, small = false): void {
    this.ripples.push({
      x, y,
      radius:    0,
      maxRadius: small ? 80 : Math.max(this.cWidth, this.cHeight) * 0.7,
      alpha:     small ? 0.4 : 0.8,
      speed:     small ? 2   : 3,
      rgb:       this.rgb,
    });

    if (this.ripples.length > 8) this.ripples.shift();

    this.dispatchEvent(new CustomEvent('kayf-ripple', { detail: { x, y }, bubbles: true }));
  }

  private tick(): void {
    this.rafId = requestAnimationFrame(() => this.tick());
    if (!this.ctx || !this.canvas) return;

    const ctx = this.ctx;
    const w   = this.cWidth;
    const h   = this.cHeight;

    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = 'rgba(6,8,14,0.95)';
    ctx.fillRect(0, 0, w, h);

    // Advance ripples
    this.ripples = this.ripples.filter(r => r.alpha > 0.01);
    this.ripples.forEach(r => {
      r.radius += r.speed;
      r.alpha  *= 0.97;
    });

    // Draw grid dots
    this.gridPoints.forEach(pt => {
      let alpha   = pt.baseAlpha;
      let dotSize = 1.5;

      this.ripples.forEach(r => {
        const dx   = pt.x - r.x;
        const dy   = pt.y - r.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const diff = Math.abs(dist - r.radius);
        if (diff < 20) {
          const inf = (1 - diff / 20) * r.alpha;
          alpha   = Math.min(1, alpha + inf * 0.8);
          dotSize = Math.max(dotSize, 1.5 + inf * 3);
        }
      });

      ctx.beginPath();
      ctx.arc(pt.x, pt.y, dotSize / 2, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${this.rgb},${alpha})`;
      ctx.fill();

      if (alpha > 0.3) {
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, dotSize, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${this.rgb},${(alpha - 0.3) * 0.3})`;
        ctx.fill();
      }
    });

    // Draw ripple rings
    this.ripples.forEach(r => {
      ctx.beginPath();
      ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(${r.rgb},${r.alpha * 0.3})`;
      ctx.lineWidth   = 1;
      ctx.stroke();
    });
  }
}

customElements.define('kayf-ripple-grid', RippleGrid);