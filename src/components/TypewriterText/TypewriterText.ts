import { baseCSS } from '../../core/tokens'

/** Multi-line typewriter text with optional looping and reduced-motion support. */
export class TypewriterText extends HTMLElement {
  static get observedAttributes() {
    return ['lines', 'speed', 'delay', 'cursor', 'loop', 'erase-speed', 'pause']
  }

  private lines: string[] = []
  private lineIndex = 0
  private characterIndex = 0
  private erasing = false
  private timer = 0
  private display: HTMLElement
  private cursor: HTMLElement

  constructor() {
    super()
    this.attachShadow({ mode: 'open' })
    this.shadowRoot!.innerHTML = `
      <style>
        ${baseCSS}
        :host { display: inline; }
        .wrap { display: inline; color: inherit; font: inherit; }
        .text { display: inline; }
        .cursor {
          display: inline;
          margin-left: 0.08em;
          color: currentColor;
          animation: blink 900ms steps(1, end) infinite;
        }
        @keyframes blink { 50% { opacity: 0; } }
        @media (prefers-reduced-motion: reduce) { .cursor { display: none; } }
      </style>
      <span class="wrap"><span class="text" aria-live="polite"></span><span class="cursor" aria-hidden="true"></span></span>
    `
    this.display = this.shadowRoot!.querySelector('.text')!
    this.cursor = this.shadowRoot!.querySelector('.cursor')!
  }

  connectedCallback(): void {
    this.restart()
  }

  disconnectedCallback(): void {
    clearTimeout(this.timer)
  }

  attributeChangedCallback(): void {
    if (this.isConnected) this.restart()
  }

  private get speed() { return Math.max(0, Number.parseInt(this.getAttribute('speed') || '60', 10)) }
  private get eraseSpeed() { return Math.max(0, Number.parseInt(this.getAttribute('erase-speed') || '30', 10)) }
  private get pause() { return Math.max(0, Number.parseInt(this.getAttribute('pause') || '1800', 10)) }
  private get shouldLoop() { return this.hasAttribute('loop') }

  private restart(): void {
    clearTimeout(this.timer)
    const configuredLines = this.getAttribute('lines')
    this.lines = configuredLines
      ? configuredLines.split('|').map(line => line.trim()).filter(Boolean)
      : [this.textContent?.trim() || '']
    this.lineIndex = 0
    this.characterIndex = 0
    this.erasing = false
    this.display.textContent = ''
    this.cursor.textContent = this.getAttribute('cursor') || '|'

    if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
      this.display.textContent = this.lines[0] || ''
      return
    }

    const delay = Math.max(0, Number.parseInt(this.getAttribute('delay') || '500', 10))
    this.timer = window.setTimeout(() => this.tick(), delay)
  }

  private tick(): void {
    const line = this.lines[this.lineIndex] || ''
    if (!this.erasing) {
      this.characterIndex += 1
      this.display.textContent = line.slice(0, this.characterIndex)
      if (this.characterIndex >= line.length) {
        if (this.shouldLoop || this.lineIndex < this.lines.length - 1) {
          this.timer = window.setTimeout(() => {
            this.erasing = true
            this.tick()
          }, this.pause)
        }
        return
      }
    } else {
      this.characterIndex -= 1
      this.display.textContent = line.slice(0, this.characterIndex)
      if (this.characterIndex <= 0) {
        this.erasing = false
        this.lineIndex = (this.lineIndex + 1) % this.lines.length
        if (!this.shouldLoop && this.lineIndex === 0) return
        this.timer = window.setTimeout(() => this.tick(), 280)
        return
      }
    }

    const interval = this.erasing ? this.eraseSpeed : this.speed
    const jitter = Math.random() * interval * 0.25
    this.timer = window.setTimeout(() => this.tick(), interval + jitter)
  }
}

if (!customElements.get('kayf-typewriter')) {
  customElements.define('kayf-typewriter', TypewriterText)
}
