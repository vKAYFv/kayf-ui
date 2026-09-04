import { KayfElement } from './KayfElement'

export type ActionButtonSize = 'sm' | 'md' | 'lg'

export const actionButtonSizes: Record<ActionButtonSize, {
  height: string
  padding: string
  fontSize: string
  radius: string
  icon: string
}> = {
  sm: { height: '36px', padding: '0 15px', fontSize: '12px', radius: '11px', icon: '14px' },
  md: { height: '44px', padding: '0 19px', fontSize: '13px', radius: '13px', icon: '16px' },
  lg: { height: '52px', padding: '0 23px', fontSize: '14px', radius: '15px', icon: '18px' },
}

export const actionButtonBaseCSS = `
  *, *::before, *::after { box-sizing: border-box; }

  :host {
    display: inline-block;
    max-width: 100%;
    vertical-align: middle;
  }

  :host([full-width]) { display: block; width: 100%; }

  button {
    margin: 0;
    border: 0;
    font: inherit;
    -webkit-tap-highlight-color: transparent;
  }

  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }
`

/** Shared native-button semantics for visual action components. */
export abstract class ActionButtonElement extends KayfElement {
  protected control?: HTMLButtonElement
  private onControlClick?: (event: MouseEvent) => void

  get size(): ActionButtonSize {
    const value = this.attr('size', 'md') as ActionButtonSize
    return actionButtonSizes[value] ? value : 'md'
  }

  get isDisabled(): boolean {
    return this.boolAttr('disabled')
  }

  get isLoading(): boolean {
    return this.boolAttr('loading')
  }

  get isUnavailable(): boolean {
    return this.isDisabled || this.isLoading
  }

  override focus(options?: FocusOptions): void {
    this.control?.focus(options)
  }

  override click(): void {
    this.control?.click()
  }

  protected setup(): void {
    this.cleanup()
    this.control = this.root.querySelector('button') as HTMLButtonElement | null ?? undefined
    if (!this.control) return

    this.control.disabled = this.isUnavailable
    this.control.setAttribute('aria-busy', String(this.isLoading))

    this.onControlClick = (event: MouseEvent) => {
      if (this.isUnavailable) {
        event.preventDefault()
        event.stopPropagation()
        return
      }

      this.dispatchEvent(new CustomEvent('kayf-click', {
        bubbles: true,
        composed: true,
        detail: { originalEvent: event },
      }))
    }

    this.control.addEventListener('click', this.onControlClick)
  }

  protected cleanup(): void {
    if (this.control && this.onControlClick) {
      this.control.removeEventListener('click', this.onControlClick)
    }
  }
}
