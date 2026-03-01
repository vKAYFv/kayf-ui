export class KayfCounter extends HTMLElement {
  static get observedAttributes() { return ['value','label','suffix','prefix','color','icon','duration','decimals']; }

  private animated = false;

  connectedCallback() { this.render(); this.observe(); }
  attributeChangedCallback() { this.render(); }

  private render() {
    const color = this.getAttribute('color') || '#6366f1';
    const icon = this.getAttribute('icon') || '◎';
    const label = this.getAttribute('label') || 'Metric';
    const suffix = this.getAttribute('suffix') || '';
    const prefix = this.getAttribute('prefix') || '';

    this.shadowRoot?.innerHTML ?? this.attachShadow({ mode: 'open' });
    this.shadowRoot!.innerHTML = `
      <style>
        :host { display: block; }
        .wrap {
          background: rgba(255,255,255,0.025);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 16px;
          padding: 32px 24px;
          position: relative;
          overflow: hidden;
          transition: border-color 0.3s, transform 0.3s;
        }
        .wrap:hover { border-color: rgba(255,255,255,0.14); transform: translateY(-2px); }
        .wrap::before {
          content: ''; position: absolute; top: 0; left: 0; right: 0; height: 1px;
          background: linear-gradient(90deg, transparent, ${color}44, transparent);
        }
        .glow {
          position: absolute; bottom: -40px; right: -40px;
          width: 120px; height: 120px; border-radius: 50%;
          background: ${color}; opacity: 0.12; filter: blur(30px);
        }
        .icon { display: block; font-size: 18px; color: ${color}; margin-bottom: 16px; text-shadow: 0 0 20px ${color}88; }
        .value {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 48px; font-weight: 700; letter-spacing: -0.03em;
          line-height: 1; margin-bottom: 10px;
          background: linear-gradient(135deg, #fff 0%, ${color} 100%);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          font-variant-numeric: tabular-nums;
        }
        .label {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 12px; color: rgba(232,232,240,0.4);
          letter-spacing: 0.08em; text-transform: uppercase; font-weight: 500;
        }
        .bar {
          position: absolute; bottom: 0; left: 0; height: 2px;
          background: linear-gradient(90deg, transparent, ${color}, transparent);
          width: 0%; transition: width 2s ease;
        }
        .bar.active { width: 100%; }
      </style>
      <div class="wrap">
        <div class="glow"></div>
        <span class="icon">${icon}</span>
        <div class="value" id="val">${prefix}0${suffix}</div>
        <div class="label">${label}</div>
        <div class="bar" id="bar"></div>
      </div>`;

    if (this.animated) this.startCount();
  }

  private observe() {
    const io = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && !this.animated) {
        this.animated = true;
        this.startCount();
        io.disconnect();
      }
    }, { threshold: 0.3 });
    io.observe(this);
  }

  private startCount() {
    const target = parseFloat(this.getAttribute('value') || '0');
    const decimals = parseInt(this.getAttribute('decimals') || '0');
    const duration = parseInt(this.getAttribute('duration') || '2000');
    const prefix = this.getAttribute('prefix') || '';
    const suffix = this.getAttribute('suffix') || '';
    const el = this.shadowRoot?.getElementById('val');
    const bar = this.shadowRoot?.getElementById('bar');
    if (!el) return;

    const start = performance.now();
    const easeOutExpo = (t: number) => t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
    requestAnimationFrame(() => bar?.classList.add('active'));

    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      el.textContent = prefix + (target * easeOutExpo(t)).toFixed(decimals) + suffix;
      if (t < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }
}

customElements.define('kayf-counter', KayfCounter);
