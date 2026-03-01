interface Particle {
  x: number; y: number;
  vx: number; vy: number;
  r: number; alpha: number;
}

export class KayfParticleField extends HTMLElement {
  static get observedAttributes() { return ['color','count','speed','connect-distance']; }

  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private particles: Particle[] = [];
  private mouse = { x: null as number | null, y: null as number | null, radius: 120 };
  private raf = 0;
  private ro: ResizeObserver;

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot!.innerHTML = `<style>:host{display:block;width:100%;height:100%}canvas{display:block;width:100%;height:100%}</style><canvas></canvas>`;
    this.canvas = this.shadowRoot!.querySelector('canvas')!;
    this.ctx = this.canvas.getContext('2d')!;
    this.ro = new ResizeObserver(() => this.resize());
  }

  connectedCallback() {
    this.ro.observe(this);
    this.resize();
    this.init();
    this.tick();
    this.canvas.addEventListener('mousemove', this.onMouseMove);
    this.canvas.addEventListener('mouseleave', this.onMouseLeave);
  }

  disconnectedCallback() {
    cancelAnimationFrame(this.raf);
    this.ro.disconnect();
    this.canvas.removeEventListener('mousemove', this.onMouseMove);
    this.canvas.removeEventListener('mouseleave', this.onMouseLeave);
  }

  attributeChangedCallback() { this.init(); }

  private onMouseMove = (e: MouseEvent) => {
    const r = this.canvas.getBoundingClientRect();
    this.mouse.x = (e.clientX - r.left) * (this.canvas.width / r.width);
    this.mouse.y = (e.clientY - r.top) * (this.canvas.height / r.height);
  };

  private onMouseLeave = () => { this.mouse.x = null; this.mouse.y = null; };

  private resize() {
    const r = this.getBoundingClientRect();
    this.canvas.width = r.width || 800;
    this.canvas.height = r.height || 360;
    this.init();
  }

  private init() {
    const count = parseInt(this.getAttribute('count') || '100');
    const { width: w, height: h } = this.canvas;
    this.particles = Array.from({ length: count }, () => ({
      x: Math.random() * w, y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.6, vy: (Math.random() - 0.5) * 0.6,
      r: Math.random() * 2 + 0.5, alpha: Math.random() * 0.6 + 0.2,
    }));
  }

  private tick = () => {
    const { ctx, canvas, mouse, particles } = this;
    const { width: w, height: h } = canvas;
    const color = this.getAttribute('color') || '#6366f1';
    const speed = parseFloat(this.getAttribute('speed') || '0.4');
    const dist = parseInt(this.getAttribute('connect-distance') || '100');

    ctx.clearRect(0, 0, w, h);

    for (const p of particles) {
      if (mouse.x !== null && mouse.y !== null) {
        const dx = p.x - mouse.x, dy = p.y - mouse.y;
        const d = Math.hypot(dx, dy);
        if (d < mouse.radius) {
          const f = (mouse.radius - d) / mouse.radius;
          p.vx += (dx / d) * f * 0.3;
          p.vy += (dy / d) * f * 0.3;
        }
      }
      p.vx *= 0.98; p.vy *= 0.98;
      const spd = Math.hypot(p.vx, p.vy), max = speed * 1.5;
      if (spd > max) { p.vx = p.vx/spd*max; p.vy = p.vy/spd*max; }
      p.x = (p.x + p.vx + w) % w;
      p.y = (p.y + p.vy + h) % h;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = color + Math.round(p.alpha * 255).toString(16).padStart(2, '0');
      ctx.fill();
    }

    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const a = particles[i], b = particles[j];
        const d = Math.hypot(a.x - b.x, a.y - b.y);
        if (d < dist) {
          ctx.beginPath();
          ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = color + Math.round((1 - d/dist) * 0.3 * 255).toString(16).padStart(2,'0');
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
    this.raf = requestAnimationFrame(this.tick);
  };
}

customElements.define('kayf-particle-field', KayfParticleField);
