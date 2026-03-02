export class TypewriterText extends HTMLElement {
  static get observedAttributes() {
    return ['speed', 'delay', 'cursor', 'loop', 'erase-speed', 'pause'];
  }

  private _lines: string[] = [];
  private _lineIdx = 0;
  private _charIdx = 0;
  private _erasing = false;
  private _timer = 0;
  private _display!: HTMLElement;
  private _cursor!: HTMLElement;

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot!.innerHTML = `
      <style>
        :host { display: inline; }

        .wrap {
          display: inline;
          font: inherit;
          color: inherit;
        }

        .text {
          display: inline;
        }

        .cursor {
          display: inline-block;
          width: 2px;
          height: 1.1em;
          vertical-align: text-bottom;
          margin-left: 2px;
          background: currentColor;
          animation: blink 1s step-end infinite;
          border-radius: 1px;
        }

        @keyframes blink {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0; }
        }
      </style>
      <span class="wrap"><span class="text"></span><span class="cursor"></span></span>
    `;
    this._display = this.shadowRoot!.querySelector('.text')!;
    this._cursor  = this.shadowRoot!.querySelector('.cursor')!;
  }

  connectedCallback() {
    // Collect lines from slot text + data-lines attr
    const attr = this.getAttribute('lines');
    if (attr) {
      this._lines = attr.split('|').map(s => s.trim()).filter(Boolean);
    } else {
      this._lines = [this.textContent?.trim() || ''];
    }

    const delay = parseInt(this.getAttribute('delay') || '500');
    this._timer = window.setTimeout(() => this.tick(), delay);
  }

  disconnectedCallback() {
    clearTimeout(this._timer);
  }

  private get speed()      { return parseInt(this.getAttribute('speed') || '60'); }
  private get eraseSpeed() { return parseInt(this.getAttribute('erase-speed') || '30'); }
  private get pause()      { return parseInt(this.getAttribute('pause') || '1800'); }
  private get shouldLoop() { return this.hasAttribute('loop'); }
  private get cursorChar() { return this.getAttribute('cursor') || '|'; }

  private tick() {
    const line = this._lines[this._lineIdx] || '';

    if (!this._erasing) {
      // Typing forward
      this._charIdx++;
      this._display.textContent = line.slice(0, this._charIdx);

      if (this._charIdx >= line.length) {
        // Finished typing — pause then erase (if loop) or stop
        if (this.shouldLoop || this._lineIdx < this._lines.length - 1) {
          this._timer = window.setTimeout(() => {
            this._erasing = true;
            this.tick();
          }, this.pause);
        }
        return;
      }
    } else {
      // Erasing
      this._charIdx--;
      this._display.textContent = line.slice(0, this._charIdx);

      if (this._charIdx <= 0) {
        this._erasing = false;
        this._lineIdx = (this._lineIdx + 1) % this._lines.length;
        if (!this.shouldLoop && this._lineIdx === 0) return;
        this._timer = window.setTimeout(() => this.tick(), 300);
        return;
      }
    }

    const ms = this._erasing ? this.eraseSpeed : this.speed;
    // Small jitter for organic feel
    const jitter = Math.random() * (ms * 0.3);
    this._timer = window.setTimeout(() => this.tick(), ms + jitter);
  }
}

customElements.define('kayf-typewriter', TypewriterText);
