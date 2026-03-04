import { KayfElement } from '../../core/KayfElement';

export class LiquidButton extends KayfElement {
  private canvas: HTMLCanvasElement | null = null;
  private ctx: CanvasRenderingContext2D | null = null;
  private rafId: number = 0;
  private points: Array<{ x: number; y: number; ox: number; oy: number; vx: number; vy: number }> = [];
  private mouseX = 0;
  private mouseY = 0;
  private hovered = false;
  private pressed = false;

  static override get observedAttributes() {
    return ['label', 'color', 'size', 'disabled'];
  }

  private get label()    { return this.attr('label', 'Click me'); }
  private get color()    { return this.attr('color', '#00d4ff'); }
  private get btnSize()  { return this.attr('size', 'md'); }
  private get disabled() { return this.boolAttr('disabled'); }

  private get dims(): { w: number; h: number; fs: number } {
    switch (this.btnSize) {
      case 'sm': return { w: 100, h: 36, fs: 13 };
      case 'lg': return { w: 180, h: 60, fs: 18 };
      default:   return { w: 140, h: 48, fs: 15 };
    }
  }

  protected styles(): string {
    const { w, h, fs } = this.dims;
    return `
      :host { display: inline-block; cursor: ${this.disabled ? 'not-allowed' : 'pointer'}; user-select: none; }
      .wrapper { position: relative; width: ${w}px; height: ${h}px; }
      canvas {
        position: absolute; inset: -8px;
        width: calc(100% + 16px); height: calc(100% + 16px);
        pointer-events: none;
      }
      .label {
        position: absolute; inset: 0;
        display: flex; align-items: center; justify-content: center;
        font-family: 'Segoe UI', system-ui, sans-serif;
        font-size: ${fs}px; font-weight: 600; letter-spacing: 0.05em;
        color: ${this.disabled ? 'rgba(255,255,255,0.3)' : '#fff'};
        text-shadow: 0 0 20px ${this.color};
        transition: color 0.2s; z-index: 2; pointer-events: none;
      }
    `;
  }

  protected template(): string {
    return `
      <div class="wrapper" id="wrapper">
        <canvas id="c"></canvas>
        <div class="label">${this.label}</div>
      </div>
    `;
  }

  protected setup(): void {
    this.initCanvas();
    this.addListeners();
  }

  protected cleanup(): void {
    cancelAnimationFrame(this.rafId);
  }

  private initCanvas(): void {
    const wrapper = this.root.querySelector('#wrapper') as HTMLElement;
    this.canvas   = this.root.querySelector('#c') as HTMLCanvasElement;
    if (!this.canvas || !wrapper) return;

    const { w, h } = this.dims;
    const cw = w + 16;
    const ch = h + 16;
    this.canvas.width  = cw;
    this.canvas.height = ch;
    this.ctx = this.canvas.getContext('2d');

    const cx = cw / 2;
    const cy = ch / 2;
    const rx = w / 2 + 4;
    const ry = h / 2 + 4;
    const num = 12;

    this.points = Array.from({ length: num }, (_, i) => {
      const angle = (i / num) * Math.PI * 2;
      const x = cx + Math.cos(angle) * rx;
      const y = cy + Math.sin(angle) * ry;
      return { x, y, ox: x, oy: y, vx: 0, vy: 0 };
    });

    cancelAnimationFrame(this.rafId);
    this.tick();
  }

  private tick(): void {
    this.rafId = requestAnimationFrame(() => this.tick());
    if (!this.ctx || !this.canvas) return;

    const ctx = this.ctx;
    const { w, h } = this.dims;
    const cw = w + 16;
    const ch = h + 16;

    ctx.clearRect(0, 0, cw, ch);

    const tension  = this.pressed ? 0.8 : this.hovered ? 0.4 : 0.15;
    const friction = 0.85;

    this.points.forEach(p => {
      p.vx += (p.ox - p.x) * tension;
      p.vy += (p.oy - p.y) * tension;

      if (this.hovered) {
        const dx   = p.x - (this.mouseX + 8);
        const dy   = p.y - (this.mouseY + 8);
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 50 && dist > 0) {
          const force = (50 - dist) / 50;
          p.vx += (dx / dist) * force * 3;
          p.vy += (dy / dist) * force * 3;
        }
      }

      p.vx *= friction;
      p.vy *= friction;
      p.x  += p.vx;
      p.y  += p.vy;
    });

    // Blob path
    ctx.beginPath();
    for (let i = 0; i < this.points.length; i++) {
      const p    = this.points[i];
      const next = this.points[(i + 1) % this.points.length];
      const mx   = (p.x + next.x) / 2;
      const my   = (p.y + next.y) / 2;
      if (i === 0) ctx.moveTo(mx, my);
      else ctx.quadraticCurveTo(p.x, p.y, mx, my);
    }
    ctx.closePath();

    const [r, g, b] = this.parseColor(this.color);
    const alpha = this.hovered ? 1 : 0.85;

    // Solid fill — the blob IS the button shape
    const grd = ctx.createRadialGradient(cw / 2, ch / 2, 0, cw / 2, ch / 2, cw / 2);
    grd.addColorStop(0,   `rgba(${r},${g},${b},${alpha * 0.35})`);
    grd.addColorStop(0.5, `rgba(${r},${g},${b},${alpha * 0.18})`);
    grd.addColorStop(1,   `rgba(${r},${g},${b},0)`);
    ctx.fillStyle = grd;
    ctx.fill();

    // Glow stroke
    ctx.shadowColor = this.color;
    ctx.shadowBlur  = this.hovered ? 24 : 14;
    ctx.strokeStyle = `rgba(${r},${g},${b},${alpha})`;
    ctx.lineWidth   = this.hovered ? 2 : 1.5;
    ctx.stroke();
    ctx.shadowBlur  = 0;

    // Inner highlight line on top edge
    ctx.beginPath();
    for (let i = 0; i < this.points.length; i++) {
      const p    = this.points[i];
      const next = this.points[(i + 1) % this.points.length];
      const mx   = (p.x + next.x) / 2;
      const my   = (p.y + next.y) / 2;
      if (i === 0) ctx.moveTo(mx, my);
      else ctx.quadraticCurveTo(p.x, p.y, mx, my);
    }
    ctx.closePath();
    const highlight = ctx.createLinearGradient(0, 0, 0, ch);
    highlight.addColorStop(0,   `rgba(255,255,255,0.12)`);
    highlight.addColorStop(0.4, `rgba(255,255,255,0)`);
    ctx.fillStyle = highlight;
    ctx.fill();
  }

  private parseColor(hex: string): [number, number, number] {
    const h = hex.replace('#', '');
    return [
      parseInt(h.slice(0, 2), 16),
      parseInt(h.slice(2, 4), 16),
      parseInt(h.slice(4, 6), 16),
    ];
  }

  private addListeners(): void {
    const wrapper = this.root.querySelector('#wrapper') as HTMLElement;
    if (!wrapper) return;

    wrapper.addEventListener('mouseenter', () => {
      if (!this.disabled) this.hovered = true;
    });
    wrapper.addEventListener('mouseleave', () => {
      this.hovered = false;
      this.pressed = false;
    });
    wrapper.addEventListener('mousemove', (e: MouseEvent) => {
      const rect  = wrapper.getBoundingClientRect();
      this.mouseX = e.clientX - rect.left;
      this.mouseY = e.clientY - rect.top;
    });
    wrapper.addEventListener('mousedown', () => {
      if (!this.disabled) this.pressed = true;
    });
    wrapper.addEventListener('mouseup', () => {
      this.pressed = false;
      if (!this.disabled) this.dispatchEvent(new CustomEvent('kayf-click', { bubbles: true }));
    });
  }
}

customElements.define('kayf-liquid-button', LiquidButton);