export class KayfMagneticBtn extends HTMLElement {
  static get observedAttributes() { return ['strength', 'radius']; }

  private wrap!: HTMLElement;
  private tx = 0; private ty = 0;
  private cx = 0; private cy = 0;
  private raf = 0;

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot!.innerHTML = `
      <style>
        :host { display: inline-block; }
        .w { display: inline-block; will-change: transform; }
        ::slotted(*) { display: block; }
      </style>
      <div class="w"><slot></slot></div>`;
    this.wrap = this.shadowRoot!.querySelector('.w')!;
  }

  connectedCallback() {
    this.addEventListener('mousemove', this.onMove);
    this.addEventListener('mouseleave', this.onLeave);
  }

  disconnectedCallback() {
    this.removeEventListener('mousemove', this.onMove);
    this.removeEventListener('mouseleave', this.onLeave);
    cancelAnimationFrame(this.raf);
  }

  private onMove = (e: MouseEvent) => {
    const r = this.getBoundingClientRect();
    const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
    const dx = e.clientX - cx, dy = e.clientY - cy;
    const strength = parseFloat(this.getAttribute('strength') || '0.4');
    const radius = parseFloat(this.getAttribute('radius') || '1.5');
    const maxD = Math.max(r.width, r.height) * radius;
    const d = Math.hypot(dx, dy);
    const power = d < maxD ? (1 - d / maxD) * strength : 0;
    this.tx = dx * power;
    this.ty = dy * power;
    if (!this.raf) this.loop();
  };

  private onLeave = () => { this.tx = 0; this.ty = 0; if (!this.raf) this.loop(); };

  private loop = () => {
    this.cx += (this.tx - this.cx) * 0.15;
    this.cy += (this.ty - this.cy) * 0.15;
    this.wrap.style.transform = `translate(${this.cx.toFixed(2)}px,${this.cy.toFixed(2)}px)`;
    if (Math.abs(this.cx) > 0.05 || Math.abs(this.cy) > 0.05) {
      this.raf = requestAnimationFrame(this.loop);
    } else {
      this.wrap.style.transform = 'translate(0,0)';
      this.raf = 0;
    }
  };
}

customElements.define('kayf-magnetic-btn', KayfMagneticBtn);
