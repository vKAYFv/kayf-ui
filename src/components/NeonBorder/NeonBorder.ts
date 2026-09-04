import { baseCSS } from '../../core/tokens';

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
    const color = this.getAttribute('color') || '#8b7cff';
    const speed = Math.max(0.1, parseFloat(this.getAttribute('speed') || '4'));
    const thickness = Math.max(1, parseInt(this.getAttribute('thickness') || '1', 10));
    const glow = Math.max(0, parseInt(this.getAttribute('glow') || '10', 10));
    const radius = Math.max(thickness, parseInt(this.getAttribute('radius') || '16', 10));

    // Parse hex to rgb for glow
    const hex = color.replace('#', '');
    const r = parseInt(hex.slice(0, 2), 16);
    const g = parseInt(hex.slice(2, 4), 16);
    const b = parseInt(hex.slice(4, 6), 16);

    this.shadowRoot!.innerHTML = `
      <style>
        ${baseCSS}
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
            transparent 80deg,
            ${color}99 132deg,
            ${color} 168deg,
            ${color}99 204deg,
            transparent 256deg,
            transparent 360deg
          );
          box-shadow:
            0 0 ${glow}px rgba(${r},${g},${b},0.28),
            0 0 ${glow * 2}px rgba(${r},${g},${b},0.1),
            inset 0 0 ${glow}px rgba(${r},${g},${b},0.05);
        }

        .inner {
          border-radius: ${radius - thickness}px;
          background: var(--kayf-bg);
          overflow: hidden;
        }

        ::slotted(*) {
          display: block;
        }

        @media (prefers-reduced-motion: reduce) {
          :host { animation: none; }
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

if (!customElements.get('kayf-neon-border')) {
  customElements.define('kayf-neon-border', NeonBorder);
}
