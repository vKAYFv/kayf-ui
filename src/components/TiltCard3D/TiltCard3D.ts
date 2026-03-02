import { KayfElement } from '../../core/KayfElement';

export class TiltCard3D extends KayfElement {
  private inner: HTMLElement | null = null;
  private shine: HTMLElement | null = null;
  private rafId: number = 0;
  private targetRx = 0;
  private targetRy = 0;
  private currentRx = 0;
  private currentRy = 0;
  private isHovered = false;

  static override get observedAttributes() {
    return ['max-tilt', 'scale', 'perspective', 'glow', 'no-shine'];
  }

  private get maxTilt()   { return this.numAttr('max-tilt', 15); }
  private get scaleVal()  { return this.numAttr('scale', 1.05); }
  private get persp()     { return this.numAttr('perspective', 1000); }
  private get glowColor() { return this.attr('glow', '#ffffff'); }

  private get rgb(): [number, number, number] {
    const hex = this.glowColor.replace('#', '');
    return [
      parseInt(hex.slice(0, 2), 16) || 255,
      parseInt(hex.slice(2, 4), 16) || 255,
      parseInt(hex.slice(4, 6), 16) || 255,
    ];
  }

  protected styles(): string {
    const [r, g, b] = this.rgb;
    return `
      :host { display: inline-block; }
      .wrapper {
        display: inline-block;
        perspective: ${this.persp}px;
        transform-style: preserve-3d;
      }
      .inner {
        position: relative;
        transform-style: preserve-3d;
        border-radius: 12px;
        overflow: hidden;
        transition: box-shadow 0.3s;
        will-change: transform;
      }
      .inner.hovered {
        box-shadow:
          0 30px 60px rgba(0,0,0,0.5),
          0 0 40px rgba(${r},${g},${b},0.15),
          inset 0 1px 0 rgba(255,255,255,0.1);
      }
      .shine {
        position: absolute; inset: 0;
        pointer-events: none;
        border-radius: inherit;
        z-index: 10;
        opacity: 0;
        transition: opacity 0.2s;
        mix-blend-mode: overlay;
        background: radial-gradient(circle at 50% 50%, rgba(255,255,255,0.3) 0%, transparent 60%);
      }
      .inner.hovered .shine { opacity: 1; }
      .edge-top {
        position: absolute;
        top: 0; left: 0; right: 0; height: 1px;
        background: linear-gradient(90deg, transparent, rgba(${r},${g},${b},0.5), transparent);
        z-index: 11;
        pointer-events: none;
      }
      .content { display: block; transform: translateZ(20px); }
      ::slotted(*) { display: block; }
    `;
  }

  protected template(): string {
    return `
      <div class="wrapper">
        <div class="inner" id="inner">
          <div class="shine" id="shine"></div>
          <div class="edge-top"></div>
          <div class="content"><slot></slot></div>
        </div>
      </div>
    `;
  }

  protected setup(): void {
    this.inner = this.root.querySelector('#inner');
    this.shine = this.root.querySelector('#shine');
    this.addListeners();
    cancelAnimationFrame(this.rafId);
    this.tick();
  }

  protected cleanup(): void {
    cancelAnimationFrame(this.rafId);
  }

  private addListeners(): void {
    if (!this.inner) return;

    this.inner.addEventListener('mousemove', (e: MouseEvent) => {
      const rect = this.inner!.getBoundingClientRect();
      const nx   = (e.clientX - rect.left - rect.width  / 2) / (rect.width  / 2);
      const ny   = (e.clientY - rect.top  - rect.height / 2) / (rect.height / 2);

      this.targetRy  = nx * this.maxTilt;
      this.targetRx  = -ny * this.maxTilt;
      this.isHovered = true;
      this.inner!.classList.add('hovered');

      if (this.shine) {
        const px = (e.clientX - rect.left) / rect.width  * 100;
        const py = (e.clientY - rect.top)  / rect.height * 100;
        this.shine.style.background =
          `radial-gradient(circle at ${px}% ${py}%, rgba(255,255,255,0.25) 0%, transparent 60%)`;
      }

      this.dispatchEvent(new CustomEvent('kayf-tilt', {
        detail:  { rotateX: this.targetRx, rotateY: this.targetRy },
        bubbles: true,
      }));
    });

    this.inner.addEventListener('mouseleave', () => {
      this.targetRx  = 0;
      this.targetRy  = 0;
      this.isHovered = false;
      this.inner!.classList.remove('hovered');
    });
  }

  private tick(): void {
    this.rafId = requestAnimationFrame(() => this.tick());
    if (!this.inner) return;

    this.currentRx += (this.targetRx - this.currentRx) * 0.12;
    this.currentRy += (this.targetRy - this.currentRy) * 0.12;

    const s = this.isHovered ? this.scaleVal : 1;
    this.inner.style.transform =
      `rotateX(${this.currentRx}deg) rotateY(${this.currentRy}deg) scale(${s})`;
  }
}

customElements.define('kayf-3d-tilt-card', TiltCard3D);