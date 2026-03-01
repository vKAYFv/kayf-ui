import { KayfElement } from '../../core/KayfElement'
import { baseCSS, getColor, getGlow, getSpotlight, ColorVariant } from '../../core/tokens'

/**
 * <kayf-hud-panel>
 *
 * Атрибуты:
 *   color   - cyan | violet | emerald | amber | red | white (default: cyan)
 *   glow    - none | soft | medium | strong                  (default: soft)
 *   radius  - border-radius px                               (default: 16)
 *   padding - внутренний отступ контента px                  (default: 20)
 *
 * Слоты:
 *   title  - заголовок в верхней части
 *   meta   - правый верхний блок (статус/значение)
 *   footer - нижняя строка/действия
 *   (default) - основной контент
 *
 * Пример:
 *   <kayf-hud-panel color="emerald" glow="medium">
 *     <span slot="title">Telemetry</span>
 *     <span slot="meta">ONLINE</span>
 *     <p>Signal quality 98%</p>
 *   </kayf-hud-panel>
 */

const GLOW_MAP: Record<string, number> = {
  none: 0, soft: 0.16, medium: 0.26, strong: 0.4,
}

export class HudPanel extends KayfElement {
  private _panel?: HTMLElement
  private _spot?: HTMLElement
  private _titleSlot?: HTMLSlotElement
  private _metaSlot?: HTMLSlotElement
  private _footerSlot?: HTMLSlotElement
  private _onMove?: (e: MouseEvent) => void
  private _onLeave?: () => void
  private _onSlotChange?: () => void

  static get observedAttributes() {
    return ['color', 'glow', 'radius', 'padding']
  }

  get color(): ColorVariant { return this.attr('color', 'cyan') as ColorVariant }
  get glowLevel(): string { return this.attr('glow', 'soft') }
  get radius(): number { return this.numAttr('radius', 16) }
  get padding(): number { return this.numAttr('padding', 20) }

  protected styles(): string {
    const color = getColor(this.color)
    const spot = getSpotlight(this.color)
    const glow = getGlow(this.color)
    const glowAlpha = GLOW_MAP[this.glowLevel] ?? GLOW_MAP.soft
    const glowHover = glow.replace('0.2', String(glowAlpha))
    const radius = Math.max(0, this.radius)
    const innerRadius = Math.max(0, radius - 1)
    const pad = Math.max(8, this.padding)

    return baseCSS + `
      *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
      :host { display: block; position: relative; border-radius: ${radius}px; }

      .hud-border {
        position: relative;
        border-radius: ${radius}px;
        padding: 1px;
        background:
          linear-gradient(150deg, ${color}44, rgba(255,255,255,0.08) 38%, rgba(255,255,255,0.03) 62%, ${color}22);
        transition: box-shadow 0.3s ease, background 0.3s ease;
      }

      .panel {
        position: relative;
        border-radius: ${innerRadius}px;
        overflow: hidden;
        min-height: 140px;
        background:
          radial-gradient(circle at 20% 15%, rgba(255,255,255,0.045), transparent 40%),
          linear-gradient(165deg, rgba(255,255,255,0.04), rgba(255,255,255,0.015) 30%, rgba(5,5,8,0.76) 100%);
        border: 1px solid rgba(255,255,255,0.06);
        box-shadow:
          inset 0 1px 0 rgba(255,255,255,0.06),
          0 10px 26px rgba(0,0,0,0.25);
        transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease;
      }

      :host(:hover) .hud-border {
        box-shadow: 0 0 34px ${glowHover};
      }

      :host(:hover) .panel {
        transform: translateY(-2px);
        border-color: ${color}66;
        box-shadow:
          inset 0 1px 0 rgba(255,255,255,0.08),
          0 14px 34px rgba(0,0,0,0.32),
          0 0 30px ${glowHover};
      }

      .spotlight {
        position: absolute;
        width: 360px;
        height: 360px;
        border-radius: 50%;
        pointer-events: none;
        transform: translate(-50%, -50%);
        background: radial-gradient(circle, ${spot}, transparent 72%);
        opacity: 0;
        transition: opacity 0.3s ease;
        z-index: 0;
      }

      :host(:hover) .spotlight { opacity: 1; }

      .grid {
        position: absolute;
        inset: 0;
        pointer-events: none;
        z-index: 0;
        opacity: 0.18;
        background-image:
          linear-gradient(${color}26 1px, transparent 1px),
          linear-gradient(90deg, ${color}1f 1px, transparent 1px);
        background-size: 24px 24px, 24px 24px;
        mask-image: linear-gradient(to bottom, rgba(0,0,0,0.55), transparent 75%);
      }

      .scanline {
        position: absolute;
        top: -20%;
        left: 0;
        width: 100%;
        height: 1px;
        background: linear-gradient(90deg, transparent, ${color}88, transparent);
        opacity: 0.24;
        pointer-events: none;
        z-index: 1;
        animation: scan 5.4s linear infinite;
      }

      .corner {
        position: absolute;
        width: 16px;
        height: 16px;
        border-color: ${color}88;
        border-style: solid;
        z-index: 2;
        pointer-events: none;
      }

      .corner.tl { top: 8px; left: 8px; border-width: 1px 0 0 1px; border-radius: 3px 0 0 0; }
      .corner.tr { top: 8px; right: 8px; border-width: 1px 1px 0 0; border-radius: 0 3px 0 0; }
      .corner.bl { bottom: 8px; left: 8px; border-width: 0 0 1px 1px; border-radius: 0 0 0 3px; }
      .corner.br { bottom: 8px; right: 8px; border-width: 0 1px 1px 0; border-radius: 0 0 3px 0; }

      .frame-line {
        position: absolute;
        left: ${pad}px;
        right: ${pad}px;
        height: 1px;
        background: linear-gradient(90deg, transparent, ${color}66 20%, ${color}66 80%, transparent);
        opacity: 0.42;
        z-index: 2;
        pointer-events: none;
      }

      .frame-line.top { top: ${pad - 1}px; }
      .frame-line.bottom { bottom: ${pad - 1}px; }

      .content {
        position: relative;
        z-index: 3;
        padding: ${pad}px;
        display: grid;
        gap: 14px;
      }

      .header,
      .footer {
        display: none;
      }

      .panel.has-header .header {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        gap: 12px;
        padding-bottom: 8px;
        border-bottom: 1px solid rgba(255,255,255,0.06);
      }

      .panel.has-footer .footer {
        display: block;
        padding-top: 8px;
        border-top: 1px solid rgba(255,255,255,0.06);
      }

      .title {
        font-family: var(--kayf-font-sans);
        font-size: 14px;
        font-weight: 700;
        letter-spacing: 0.08em;
        text-transform: uppercase;
        color: rgba(255,255,255,0.94);
      }

      .meta {
        font-family: var(--kayf-font-mono);
        font-size: 12px;
        line-height: 1.3;
        letter-spacing: 0.08em;
        text-transform: uppercase;
        color: ${color};
        text-shadow: 0 0 10px ${color}55;
      }

      .body {
        font-family: var(--kayf-font-mono);
        font-size: 13px;
        line-height: 1.65;
        color: var(--kayf-text);
      }

      ::slotted(p) {
        margin: 0;
        color: var(--kayf-muted);
      }

      @keyframes scan {
        0% { top: -20%; opacity: 0; }
        10% { opacity: 0.3; }
        55% { opacity: 0.14; }
        100% { top: 120%; opacity: 0; }
      }
    `
  }

  protected template(): string {
    return `
      <div class="hud-border">
        <section class="panel" part="panel">
          <div class="spotlight"></div>
          <div class="grid"></div>
          <div class="scanline"></div>
          <span class="corner tl"></span>
          <span class="corner tr"></span>
          <span class="corner bl"></span>
          <span class="corner br"></span>
          <span class="frame-line top"></span>
          <span class="frame-line bottom"></span>
          <div class="content">
            <header class="header">
              <div class="title"><slot name="title"></slot></div>
              <div class="meta"><slot name="meta"></slot></div>
            </header>
            <div class="body"><slot></slot></div>
            <footer class="footer"><slot name="footer"></slot></footer>
          </div>
        </section>
      </div>
    `
  }

  protected setup(): void {
    this.cleanup()

    this._panel = this.root.querySelector('.panel') as HTMLElement | null ?? undefined
    this._spot = this.root.querySelector('.spotlight') as HTMLElement | null ?? undefined
    this._titleSlot = this.root.querySelector('slot[name="title"]') as HTMLSlotElement | null ?? undefined
    this._metaSlot = this.root.querySelector('slot[name="meta"]') as HTMLSlotElement | null ?? undefined
    this._footerSlot = this.root.querySelector('slot[name="footer"]') as HTMLSlotElement | null ?? undefined
    if (!this._panel || !this._spot) return

    this._onMove = (e: MouseEvent) => {
      const rect = this._panel!.getBoundingClientRect()
      this._spot!.style.left = (e.clientX - rect.left) + 'px'
      this._spot!.style.top = (e.clientY - rect.top) + 'px'
    }

    this._onLeave = () => {
      this._spot!.style.left = '50%'
      this._spot!.style.top = '50%'
    }

    this._panel.addEventListener('mousemove', this._onMove)
    this._panel.addEventListener('mouseleave', this._onLeave)
    this._onLeave()

    this._onSlotChange = () => this._syncSlotState()

    if (this._titleSlot) this._titleSlot.addEventListener('slotchange', this._onSlotChange)
    if (this._metaSlot) this._metaSlot.addEventListener('slotchange', this._onSlotChange)
    if (this._footerSlot) this._footerSlot.addEventListener('slotchange', this._onSlotChange)
    this._syncSlotState()
  }

  protected cleanup(): void {
    if (this._panel && this._onMove) this._panel.removeEventListener('mousemove', this._onMove)
    if (this._panel && this._onLeave) this._panel.removeEventListener('mouseleave', this._onLeave)

    if (this._titleSlot && this._onSlotChange) this._titleSlot.removeEventListener('slotchange', this._onSlotChange)
    if (this._metaSlot && this._onSlotChange) this._metaSlot.removeEventListener('slotchange', this._onSlotChange)
    if (this._footerSlot && this._onSlotChange) this._footerSlot.removeEventListener('slotchange', this._onSlotChange)
  }

  private _syncSlotState(): void {
    if (!this._panel) return
    const hasTitle = this._slotHasContent(this._titleSlot)
    const hasMeta = this._slotHasContent(this._metaSlot)
    const hasFooter = this._slotHasContent(this._footerSlot)

    this._panel.classList.toggle('has-header', hasTitle || hasMeta)
    this._panel.classList.toggle('has-footer', hasFooter)
  }

  private _slotHasContent(slot: HTMLSlotElement | undefined): boolean {
    if (!slot) return false
    return slot.assignedNodes({ flatten: true }).some(node => {
      if (node.nodeType === Node.ELEMENT_NODE) return true
      if (node.nodeType === Node.TEXT_NODE) return (node.textContent ?? '').trim().length > 0
      return false
    })
  }
}

if (!customElements.get('kayf-hud-panel')) {
  customElements.define('kayf-hud-panel', HudPanel)
}
