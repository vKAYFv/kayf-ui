export class HolographicCard extends HTMLElement {
  static get observedAttributes() {
    return ['tilt-max', 'shine-opacity', 'scale'];
  }

  private inner!: HTMLElement;
  private shine!: HTMLElement;
  private raf = 0;
  private targetX = 0;
  private targetY = 0;
  private currentX = 0;
  private currentY = 0;
  private isHovered = false;

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot!.innerHTML = `
      <style>
        :host {
          display: inline-block;
          perspective: 800px;
          cursor: pointer;
        }
        .card {
          position: relative;
          border-radius: 16px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.1);
          transform-style: preserve-3d;
          transition: box-shadow 0.3s ease;
          will-change: transform;
          overflow: hidden;
        }
        .card::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg,
            rgba(255,255,255,0.03) 0%,
            rgba(255,255,255,0.06) 50%,
            rgba(255,255,255,0.02) 100%
          );
          border-radius: inherit;
          pointer-events: none;
          z-index: 1;
        }
        /* Top shimmer line */
        .card::after {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 1px;
          background: linear-gradient(90deg,
            transparent,
            rgba(255,255,255,0.3),
            transparent
          );
          pointer-events: none;
          z-index: 2;
        }
        .shine {
          position: absolute;
          inset: -50%;
          width: 200%;
          height: 200%;
          background: conic-gradient(
            from 0deg,
            rgba(255,0,128,0) 0deg,
            rgba(255,0,128,0.15) 30deg,
            rgba(255,128,0,0.15) 60deg,
            rgba(255,255,0,0.12) 90deg,
            rgba(0,255,128,0.15) 120deg,
            rgba(0,128,255,0.15) 150deg,
            rgba(128,0,255,0.15) 180deg,
            rgba(255,0,128,0.12) 210deg,
            rgba(255,0,128,0) 240deg,
            transparent 360deg
          );
          opacity: 0;
          mix-blend-mode: screen;
          pointer-events: none;
          transition: opacity 0.3s;
          z-index: 3;
          border-radius: 50%;
        }
        .slot-wrap {
          position: relative;
          z-index: 4;
        }
        ::slotted(*) {
          display: block;
        }
      </style>
      <div class="card" part="card">
        <div class="shine"></div>
        <div class="slot-wrap"><slot></slot></div>
      </div>
    `;

    this.inner = this.shadowRoot!.querySelector('.card')!;
    this.shine = this.shadowRoot!.querySelector('.shine')!;
  }

  connectedCallback() {
    this.addEventListener('mousemove', this.onMove);
    this.addEventListener('mouseenter', this.onEnter);
    this.addEventListener('mouseleave', this.onLeave);
  }

  disconnectedCallback() {
    this.removeEventListener('mousemove', this.onMove);
    this.removeEventListener('mouseenter', this.onEnter);
    this.removeEventListener('mouseleave', this.onLeave);
    cancelAnimationFrame(this.raf);
  }

  private onEnter = () => {
    this.isHovered = true;
    this.shine.style.opacity = String(parseFloat(this.getAttribute('shine-opacity') || '1'));
    this.inner.style.boxShadow = '0 30px 60px rgba(0,0,0,0.5), 0 0 40px rgba(99,102,241,0.2)';
    if (!this.raf) this.loop();
  };

  private onLeave = () => {
    this.isHovered = false;
    this.targetX = 0;
    this.targetY = 0;
    this.shine.style.opacity = '0';
    this.inner.style.boxShadow = '';
  };

  private onMove = (e: MouseEvent) => {
    const rect = this.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const max = parseFloat(this.getAttribute('tilt-max') || '15');
    this.targetX = ((e.clientY - cy) / (rect.height / 2)) * max;
    this.targetY = -((e.clientX - cx) / (rect.width / 2)) * max;

    // Move shine based on cursor position
    const px = ((e.clientX - rect.left) / rect.width) * 100;
    const py = ((e.clientY - rect.top) / rect.height) * 100;
    this.shine.style.transform = `translate(${px - 100}%, ${py - 100}%) rotate(${px * 1.2}deg)`;
  };

  private loop = () => {
    this.currentX += (this.targetX - this.currentX) * 0.12;
    this.currentY += (this.targetY - this.currentY) * 0.12;

    const scale = this.isHovered ? parseFloat(this.getAttribute('scale') || '1.03') : 1;
    this.inner.style.transform =
      `rotateX(${this.currentX.toFixed(3)}deg) rotateY(${this.currentY.toFixed(3)}deg) scale(${scale})`;

    const stillMoving = Math.abs(this.currentX) > 0.05 || Math.abs(this.currentY) > 0.05 || this.isHovered;
    if (stillMoving) {
      this.raf = requestAnimationFrame(this.loop);
    } else {
      this.inner.style.transform = '';
      this.raf = 0;
    }
  };
}

customElements.define('kayf-holographic-card', HolographicCard);
