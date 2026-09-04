import { baseCSS } from '../../core/tokens'

export interface CommandItem {
  id: string
  label: string
  description?: string
  icon?: string
  group?: string
  shortcut?: string
  action?: () => void
}

/** Accessible, keyboard-first command menu for app navigation and actions. */
export class CommandPalette extends HTMLElement {
  static get observedAttributes() {
    return ['placeholder', 'hotkey', 'open']
  }

  private items: CommandItem[] = []
  private filtered: CommandItem[] = []
  private selectedIndex = 0
  private overlay: HTMLElement
  private input: HTMLInputElement
  private list: HTMLElement
  private isOpen = false
  private previousFocus?: HTMLElement

  constructor() {
    super()
    this.attachShadow({ mode: 'open' })
    this.shadowRoot!.innerHTML = `
      <style>
        ${baseCSS}
        *, *::before, *::after { box-sizing: border-box; }
        :host { display: contents; }

        .overlay {
          position: fixed;
          inset: 0;
          z-index: 9999;
          display: grid;
          place-items: start center;
          padding: max(11vh, 64px) 20px 40px;
          overflow-y: auto;
          background: rgba(4,4,7,0.68);
          backdrop-filter: blur(16px) saturate(110%);
          -webkit-backdrop-filter: blur(16px) saturate(110%);
          opacity: 0;
          visibility: hidden;
          pointer-events: none;
          transition: opacity 160ms ease, visibility 0s linear 160ms;
        }

        .overlay.open {
          opacity: 1;
          visibility: visible;
          pointer-events: auto;
          transition-delay: 0s;
        }

        .palette {
          width: min(680px, 100%);
          overflow: hidden;
          border: 1px solid var(--kayf-border-strong);
          border-radius: 20px;
          color: var(--kayf-text);
          background: rgba(14,14,19,0.96);
          box-shadow: 0 40px 100px rgba(0,0,0,0.58), 0 0 0 1px rgba(139,124,255,0.08);
          transform: translateY(-10px) scale(0.985);
          transition: transform 180ms cubic-bezier(.2,.8,.2,1);
        }

        .overlay.open .palette { transform: translateY(0) scale(1); }

        .search-row {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 18px 20px;
          border-bottom: 1px solid var(--kayf-border);
          background: rgba(255,255,255,0.018);
        }

        .search-icon {
          flex: none;
          width: 20px;
          color: var(--kayf-subtle);
          font: 18px/1 var(--kayf-font-sans);
        }

        input {
          min-width: 0;
          flex: 1;
          border: 0;
          outline: 0;
          color: var(--kayf-text);
          background: transparent;
          caret-color: var(--kayf-violet);
          font: 500 16px/1.4 var(--kayf-font-sans);
          letter-spacing: -0.01em;
        }

        input::placeholder { color: var(--kayf-subtle); }

        .kbd {
          display: inline-flex;
          min-width: 24px;
          min-height: 22px;
          padding: 3px 7px;
          align-items: center;
          justify-content: center;
          border: 1px solid var(--kayf-border-strong);
          border-radius: 7px;
          color: var(--kayf-subtle);
          background: rgba(255,255,255,0.045);
          box-shadow: inset 0 -1px 0 rgba(255,255,255,0.035);
          font: 500 10px/1 var(--kayf-font-mono);
        }

        .list {
          max-height: min(420px, 54vh);
          overflow-y: auto;
          padding: 8px;
          scrollbar-width: thin;
          scrollbar-color: rgba(255,255,255,0.12) transparent;
        }

        .group-label {
          padding: 12px 10px 7px;
          color: var(--kayf-subtle);
          font: 650 10px/1.2 var(--kayf-font-sans);
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }

        .item {
          position: relative;
          display: flex;
          min-height: 54px;
          padding: 8px 10px;
          align-items: center;
          gap: 12px;
          border: 1px solid transparent;
          border-radius: 11px;
          cursor: pointer;
          transition: background 100ms ease, border-color 100ms ease;
        }

        .item:hover, .item.selected {
          border-color: rgba(139,124,255,0.18);
          background: rgba(139,124,255,0.1);
        }

        .item-icon {
          display: grid;
          width: 34px;
          height: 34px;
          flex: none;
          place-items: center;
          border: 1px solid var(--kayf-border);
          border-radius: 9px;
          color: var(--kayf-muted);
          background: rgba(255,255,255,0.035);
          font: 15px/1 var(--kayf-font-sans);
        }

        .item.selected .item-icon {
          border-color: rgba(139,124,255,0.28);
          color: #b9b1ff;
          background: rgba(139,124,255,0.12);
        }

        .item-content { min-width: 0; flex: 1; }
        .item-label {
          display: block;
          overflow: hidden;
          color: var(--kayf-text);
          font: 550 14px/1.35 var(--kayf-font-sans);
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .item-description {
          display: block;
          margin-top: 2px;
          overflow: hidden;
          color: var(--kayf-muted);
          font: 400 12px/1.35 var(--kayf-font-sans);
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .shortcut { display: flex; flex: none; gap: 4px; }

        .empty {
          padding: 48px 20px;
          color: var(--kayf-muted);
          text-align: center;
          font: 500 14px/1.5 var(--kayf-font-sans);
        }

        .footer {
          display: flex;
          min-height: 44px;
          padding: 9px 16px;
          align-items: center;
          gap: 16px;
          border-top: 1px solid var(--kayf-border);
          color: var(--kayf-subtle);
          background: rgba(255,255,255,0.018);
          font: 500 11px/1.3 var(--kayf-font-sans);
        }

        .hint { display: inline-flex; align-items: center; gap: 6px; }

        @media (max-width: 520px) {
          .footer { display: none; }
          .shortcut { display: none; }
        }
      </style>

      <div class="overlay" part="overlay" aria-hidden="true">
        <section class="palette" part="palette" role="dialog" aria-modal="true" aria-label="Command menu">
          <div class="search-row">
            <span class="search-icon" aria-hidden="true">⌕</span>
            <input type="text" role="combobox" aria-autocomplete="list" aria-controls="command-list" aria-expanded="false" spellcheck="false" autocomplete="off">
            <span class="kbd">esc</span>
          </div>
          <div class="list" id="command-list" part="list" role="listbox"></div>
          <footer class="footer" aria-hidden="true">
            <span class="hint"><span class="kbd">↑↓</span> navigate</span>
            <span class="hint"><span class="kbd">↵</span> select</span>
            <span class="hint"><span class="kbd">esc</span> close</span>
          </footer>
        </section>
      </div>
    `

    this.overlay = this.shadowRoot!.querySelector('.overlay')!
    this.input = this.shadowRoot!.querySelector('input')!
    this.list = this.shadowRoot!.querySelector('.list')!
  }

  connectedCallback(): void {
    document.addEventListener('keydown', this.onGlobalKey)
    this.input.addEventListener('input', this.onInput)
    this.input.addEventListener('keydown', this.onInputKey)
    this.overlay.addEventListener('click', this.onOverlayClick)
    this.list.addEventListener('click', this.onListClick)
    this.list.addEventListener('pointermove', this.onListPointerMove)
    this.input.placeholder = this.getAttribute('placeholder') || 'Search commands…'
    if (this.hasAttribute('open')) this.open()
  }

  disconnectedCallback(): void {
    document.removeEventListener('keydown', this.onGlobalKey)
    this.input.removeEventListener('input', this.onInput)
    this.input.removeEventListener('keydown', this.onInputKey)
    this.overlay.removeEventListener('click', this.onOverlayClick)
    this.list.removeEventListener('click', this.onListClick)
    this.list.removeEventListener('pointermove', this.onListPointerMove)
  }

  attributeChangedCallback(name: string): void {
    if (!this.isConnected) return
    if (name === 'placeholder') this.input.placeholder = this.getAttribute('placeholder') || 'Search commands…'
    if (name === 'open' && this.hasAttribute('open') !== this.isOpen) {
      this.hasAttribute('open') ? this.open() : this.close()
    }
  }

  setItems(items: CommandItem[]): void {
    this.items = [...items]
    this.filter('')
  }

  open(): void {
    if (this.isOpen) return
    this.isOpen = true
    this.previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : undefined
    if (!this.hasAttribute('open')) this.setAttribute('open', '')
    this.overlay.classList.add('open')
    this.overlay.setAttribute('aria-hidden', 'false')
    this.input.setAttribute('aria-expanded', 'true')
    this.input.value = ''
    this.filter('')
    requestAnimationFrame(() => this.input.focus())
    this.dispatchEvent(new CustomEvent('kayf-open', { bubbles: true, composed: true }))
  }

  close(): void {
    if (!this.isOpen) return
    this.isOpen = false
    if (this.hasAttribute('open')) this.removeAttribute('open')
    this.previousFocus?.focus()
    this.overlay.classList.remove('open')
    this.overlay.setAttribute('aria-hidden', 'true')
    this.input.setAttribute('aria-expanded', 'false')
    this.dispatchEvent(new CustomEvent('kayf-close', { bubbles: true, composed: true }))
  }

  toggle(): void {
    this.isOpen ? this.close() : this.open()
  }

  private onGlobalKey = (event: KeyboardEvent) => {
    const hotkey = (this.getAttribute('hotkey') || 'k').toLowerCase()
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === hotkey) {
      event.preventDefault()
      this.toggle()
    }
    if (event.key === 'Escape' && this.isOpen) this.close()
  }

  private onInput = () => this.filter(this.input.value)

  private onInputKey = (event: KeyboardEvent) => {
    if (event.key === 'ArrowDown' && this.filtered.length) {
      event.preventDefault()
      this.selectedIndex = (this.selectedIndex + 1) % this.filtered.length
      this.renderList()
    } else if (event.key === 'ArrowUp' && this.filtered.length) {
      event.preventDefault()
      this.selectedIndex = (this.selectedIndex - 1 + this.filtered.length) % this.filtered.length
      this.renderList()
    } else if (event.key === 'Enter') {
      const item = this.filtered[this.selectedIndex]
      if (item) this.execute(item)
    }
  }

  private onOverlayClick = (event: MouseEvent) => {
    if (event.target === this.overlay) this.close()
  }

  private onListClick = (event: MouseEvent) => {
    const element = (event.target as Element).closest<HTMLElement>('.item')
    const index = Number(element?.dataset.index)
    if (Number.isInteger(index) && this.filtered[index]) this.execute(this.filtered[index])
  }

  private onListPointerMove = (event: PointerEvent) => {
    const element = (event.target as Element).closest<HTMLElement>('.item')
    const index = Number(element?.dataset.index)
    if (!Number.isInteger(index) || index === this.selectedIndex || !this.filtered[index]) return
    this.selectedIndex = index
    this.renderList()
  }

  private filter(query: string): void {
    const normalized = query.toLocaleLowerCase().trim()
    this.filtered = normalized
      ? this.items.filter(item => [item.label, item.description, item.group]
          .some(value => value?.toLocaleLowerCase().includes(normalized)))
      : [...this.items]
    this.selectedIndex = 0
    this.renderList()
  }

  private renderList(): void {
    this.list.replaceChildren()
    if (!this.filtered.length) {
      const empty = document.createElement('div')
      empty.className = 'empty'
      empty.textContent = 'No matching commands'
      this.list.append(empty)
      this.input.removeAttribute('aria-activedescendant')
      return
    }

    const fragment = document.createDocumentFragment()
    let previousGroup: string | undefined

    this.filtered.forEach((item, index) => {
      const group = item.group || ''
      if (group && group !== previousGroup) {
        const heading = document.createElement('div')
        heading.className = 'group-label'
        heading.textContent = group
        fragment.append(heading)
      }
      previousGroup = group

      const row = document.createElement('div')
      row.className = `item${index === this.selectedIndex ? ' selected' : ''}`
      row.id = `kayf-command-${index}`
      row.dataset.index = String(index)
      row.setAttribute('role', 'option')
      row.setAttribute('aria-selected', String(index === this.selectedIndex))

      const icon = document.createElement('span')
      icon.className = 'item-icon'
      icon.setAttribute('aria-hidden', 'true')
      icon.textContent = item.icon || '↗'

      const content = document.createElement('span')
      content.className = 'item-content'
      const label = document.createElement('span')
      label.className = 'item-label'
      label.textContent = item.label
      content.append(label)
      if (item.description) {
        const description = document.createElement('span')
        description.className = 'item-description'
        description.textContent = item.description
        content.append(description)
      }

      row.append(icon, content)
      if (item.shortcut) {
        const shortcut = document.createElement('span')
        shortcut.className = 'shortcut'
        shortcut.setAttribute('aria-hidden', 'true')
        for (const key of item.shortcut.split('+')) {
          const keycap = document.createElement('span')
          keycap.className = 'kbd'
          keycap.textContent = key
          shortcut.append(keycap)
        }
        row.append(shortcut)
      }
      fragment.append(row)
    })

    this.list.append(fragment)
    const selected = this.list.querySelector<HTMLElement>('.selected')
    selected?.scrollIntoView({ block: 'nearest' })
    if (selected) this.input.setAttribute('aria-activedescendant', selected.id)
  }

  private execute(item: CommandItem): void {
    this.close()
    item.action?.()
    this.dispatchEvent(new CustomEvent('kayf-select', {
      detail: item,
      bubbles: true,
      composed: true,
    }))
  }
}

if (!customElements.get('kayf-command-palette')) {
  customElements.define('kayf-command-palette', CommandPalette)
}
