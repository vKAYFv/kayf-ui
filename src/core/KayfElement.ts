/**
 * KayfElement - базовый класс для всех компонентов.
 */
export abstract class KayfElement extends HTMLElement {
  protected root: ShadowRoot

  constructor() {
    super()
    this.root = this.attachShadow({ mode: 'open' })
  }

  static get observedAttributes(): string[] {
    return []
  }

  attributeChangedCallback(
    _name: string,
    oldValue: string | null,
    newValue: string | null
  ): void {
    if (oldValue !== newValue) {
      this.update()
    }
  }

  connectedCallback(): void {
    this.render()
    this.setup()
  }

  disconnectedCallback(): void {
    this.cleanup()
  }

  protected update(): void {
    if (this.isConnected) {
      this.render()
      this.setup()
    }
  }

  protected abstract template(): string
  protected styles(): string { return '' }

  protected render(): void {
    this.root.innerHTML = '<style>' + this.styles() + '</style>' + this.template()
  }

  protected setup(): void {}
  protected cleanup(): void {}

  protected attr(name: string, fallback = ''): string {
    return this.getAttribute(name) ?? fallback
  }

  protected numAttr(name: string, fallback = 0): number {
    const val = this.getAttribute(name)
    return val !== null ? parseFloat(val) : fallback
  }

  protected boolAttr(name: string): boolean {
    return this.hasAttribute(name)
  }
}
