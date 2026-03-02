export class NeonBorder extends HTMLElement {
  static get observedAttributes() {
    return ['color', 'speed', 'thickness', 'glow', 'radius'];
  }

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() { this.render(); }
  attributeChangedCallback() { this.render(); }

  private render() {
    const color = this.getAttribute('color') || '#6366f1';
    const speed = parseFloat(this.getAttribute('speed') || '3');
    const thickness = parseInt(this.getAttribute('thickness') || '2');
    const glow = parseInt(this.getAttribute('glow') || '10');
    const radius = parseInt(this.getAttribute('radius') || '12');

    // Parse hex to rgb for glow
    const hex = color.replace('#', '');
    const r = parseInt(hex.slice(0, 2), 16);
    const g = parseInt(hex.slice(2, 4), 16);
    const b = parseInt(hex.slice(4, 6), 16);

    this.shadowRoot!.innerHTML = `
      <style>
        @keyframes neon-rotate {
          from { --neon-angle: 0deg; }
          to   { --neon-angle: 360deg; }
        }
        @property --neon-angle {
          syntax: '<angle>';
          initial-value: 0deg;
          inherits: false;
        }

        :host {
          display: inline-block;
          position: relative;
          --neon-angle: 0deg;
          animation: neon-rotate ${speed}s linear infinite;
        }

        .border-wrap {
          position: relative;
          border-radius: ${radius}px;
          padding: ${thickness}px;
          background: conic-gradient(
            from var(--neon-angle),
            transparent 0deg,
            transparent 60deg,
            ${color} 120deg,
            ${color}cc 160deg,
            ${color} 200deg,
            transparent 260deg,
            transparent 360deg
          );
          box-shadow:
            0 0 ${glow}px rgba(${r},${g},${b},0.4),
            0 0 ${glow * 2}px rgba(${r},${g},${b},0.15),
            inset 0 0 ${glow}px rgba(${r},${g},${b},0.05);
        }

        .inner {
          border-radius: ${radius - thickness}px;
          background: #050508;
          overflow: hidden;
        }

        ::slotted(*) {
          display: block;
        }
      </style>
      <div class="border-wrap" part="border">
        <div class="inner" part="inner">
          <slot></slot>
        </div>
      </div>
    `;
  }
}

customElements.define('kayf-neon-border', NeonBorder);
