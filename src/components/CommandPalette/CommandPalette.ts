export interface CommandItem {
  id: string;
  label: string;
  description?: string;
  icon?: string;
  group?: string;
  shortcut?: string;
  action?: () => void;
}

export class CommandPalette extends HTMLElement {
  static get observedAttributes() {
    return ['placeholder', 'hotkey', 'open'];
  }

  private _items: CommandItem[] = [];
  private _filtered: CommandItem[] = [];
  private _selectedIdx = 0;
  private _overlay!: HTMLElement;
  private _input!: HTMLInputElement;
  private _list!: HTMLElement;
  private _isOpen = false;

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot!.innerHTML = `
      <style>
        :host { display: contents; }

        .overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.7);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          z-index: 9999;
          display: flex;
          align-items: flex-start;
          justify-content: center;
          padding-top: 15vh;
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.15s ease;
        }
        .overlay.open {
          opacity: 1;
          pointer-events: all;
        }

        .palette {
          width: min(640px, 90vw);
          background: #0d0d14;
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 16px;
          overflow: hidden;
          box-shadow:
            0 0 0 1px rgba(99,102,241,0.2),
            0 40px 80px rgba(0,0,0,0.7),
            0 0 60px rgba(99,102,241,0.08);
          transform: translateY(-8px) scale(0.98);
          transition: transform 0.15s ease;
        }
        .overlay.open .palette {
          transform: translateY(0) scale(1);
        }

        .search-row {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 16px 20px;
          border-bottom: 1px solid rgba(255,255,255,0.06);
        }

        .search-icon {
          color: rgba(255,255,255,0.3);
          font-size: 16px;
          flex-shrink: 0;
        }

        input {
          flex: 1;
          background: none;
          border: none;
          outline: none;
          font-family: 'Segoe UI', system-ui, sans-serif;
          font-size: 16px;
          color: #e8e8f0;
          caret-color: #6366f1;
        }
        input::placeholder { color: rgba(232,232,240,0.25); }

        .kbd {
          display: inline-flex;
          align-items: center;
          gap: 3px;
          padding: 3px 8px;
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 6px;
          font-family: 'Courier New', monospace;
          font-size: 11px;
          color: rgba(255,255,255,0.35);
          flex-shrink: 0;
        }

        .list {
          max-height: 360px;
          overflow-y: auto;
          padding: 8px 0;
          scrollbar-width: thin;
          scrollbar-color: rgba(255,255,255,0.1) transparent;
        }

        .group-label {
          padding: 8px 20px 4px;
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.2);
          font-family: 'Segoe UI', system-ui, sans-serif;
        }

        .item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 20px;
          cursor: pointer;
          border-radius: 0;
          transition: background 0.1s;
          position: relative;
        }
        .item:hover, .item.selected {
          background: rgba(99,102,241,0.12);
        }
        .item.selected::before {
          content: '';
          position: absolute;
          left: 0; top: 0; bottom: 0;
          width: 2px;
          background: #6366f1;
          border-radius: 0 2px 2px 0;
          box-shadow: 0 0 8px #6366f1;
        }

        .item-icon {
          font-size: 16px;
          width: 28px;
          height: 28px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(255,255,255,0.05);
          border-radius: 8px;
          flex-shrink: 0;
          color: rgba(255,255,255,0.6);
        }

        .item-content {
          flex: 1;
          min-width: 0;
        }
        .item-label {
          font-family: 'Segoe UI', system-ui, sans-serif;
          font-size: 14px;
          color: #e8e8f0;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .item-desc {
          font-family: 'Segoe UI', system-ui, sans-serif;
          font-size: 12px;
          color: rgba(232,232,240,0.35);
          margin-top: 1px;
        }

        .item-shortcut {
          display: flex;
          gap: 4px;
          flex-shrink: 0;
        }
        .item-shortcut .kbd {
          font-size: 10px;
          padding: 2px 6px;
        }

        .empty {
          padding: 40px 20px;
          text-align: center;
          font-family: 'Segoe UI', system-ui, sans-serif;
          font-size: 14px;
          color: rgba(232,232,240,0.2);
        }

        .footer {
          padding: 8px 20px;
          border-top: 1px solid rgba(255,255,255,0.05);
          display: flex;
          gap: 16px;
          align-items: center;
        }
        .footer-hint {
          display: flex;
          align-items: center;
          gap: 6px;
          font-family: 'Segoe UI', system-ui, sans-serif;
          font-size: 11px;
          color: rgba(255,255,255,0.2);
        }
      </style>

      <div class="overlay" part="overlay">
        <div class="palette" part="palette">
          <div class="search-row">
            <span class="search-icon">⌕</span>
            <input type="text" spellcheck="false" autocomplete="off"/>
            <span class="kbd">esc</span>
          </div>
          <div class="list" part="list"></div>
          <div class="footer">
            <span class="footer-hint"><span class="kbd">↑↓</span> navigate</span>
            <span class="footer-hint"><span class="kbd">↵</span> select</span>
            <span class="footer-hint"><span class="kbd">esc</span> close</span>
          </div>
        </div>
      </div>
    `;

    this._overlay = this.shadowRoot!.querySelector('.overlay')!;
    this._input   = this.shadowRoot!.querySelector('input')!;
    this._list    = this.shadowRoot!.querySelector('.list')!;
  }

  connectedCallback() {
    // Global hotkey
    const hotkey = this.getAttribute('hotkey') || 'k';
    document.addEventListener('keydown', this._onGlobalKey);
    this._input.addEventListener('input', () => this._filter(this._input.value));
    this._input.addEventListener('keydown', this._onInputKey);
    this._overlay.addEventListener('click', (e) => {
      if (e.target === this._overlay) this.close();
    });

    // Set placeholder
    this._input.placeholder = this.getAttribute('placeholder') || 'Search commands...';
  }

  disconnectedCallback() {
    document.removeEventListener('keydown', this._onGlobalKey);
  }

  /** Set items programmatically */
  setItems(items: CommandItem[]) {
    this._items = items;
    this._filter('');
  }

  open() {
    this._isOpen = true;
    this._overlay.classList.add('open');
    this._input.value = '';
    this._filter('');
    requestAnimationFrame(() => this._input.focus());
    this.dispatchEvent(new CustomEvent('kayf-open', { bubbles: true }));
  }

  close() {
    this._isOpen = false;
    this._overlay.classList.remove('open');
    this.dispatchEvent(new CustomEvent('kayf-close', { bubbles: true }));
  }

  toggle() {
    this._isOpen ? this.close() : this.open();
  }

  private _onGlobalKey = (e: KeyboardEvent) => {
    const hotkey = this.getAttribute('hotkey') || 'k';
    if ((e.metaKey || e.ctrlKey) && e.key === hotkey) {
      e.preventDefault();
      this.toggle();
    }
    if (e.key === 'Escape' && this._isOpen) this.close();
  };

  private _onInputKey = (e: KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      this._selectedIdx = Math.min(this._selectedIdx + 1, this._filtered.length - 1);
      this._renderList();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      this._selectedIdx = Math.max(this._selectedIdx - 1, 0);
      this._renderList();
    } else if (e.key === 'Enter') {
      const item = this._filtered[this._selectedIdx];
      if (item) this._execute(item);
    }
  };

  private _filter(query: string) {
    const q = query.toLowerCase().trim();
    this._filtered = q
      ? this._items.filter(i =>
          i.label.toLowerCase().includes(q) ||
          i.description?.toLowerCase().includes(q) ||
          i.group?.toLowerCase().includes(q)
        )
      : [...this._items];
    this._selectedIdx = 0;
    this._renderList();
  }

  private _renderList() {
    if (this._filtered.length === 0) {
      this._list.innerHTML = `<div class="empty">No results found</div>`;
      return;
    }

    // Group items
    const groups = new Map<string, CommandItem[]>();
    for (const item of this._filtered) {
      const g = item.group || '';
      if (!groups.has(g)) groups.set(g, []);
      groups.get(g)!.push(item);
    }

    let html = '';
    let absIdx = 0;
    for (const [group, items] of groups) {
      if (group) html += `<div class="group-label">${group}</div>`;
      for (const item of items) {
        const selected = absIdx === this._selectedIdx ? 'selected' : '';
        const shortcut = item.shortcut
          ? `<div class="item-shortcut">${item.shortcut.split('+').map(k => `<span class="kbd">${k}</span>`).join('')}</div>`
          : '';
        html += `
          <div class="item ${selected}" data-id="${item.id}" data-idx="${absIdx}">
            <div class="item-icon">${item.icon || '◈'}</div>
            <div class="item-content">
              <div class="item-label">${item.label}</div>
              ${item.description ? `<div class="item-desc">${item.description}</div>` : ''}
            </div>
            ${shortcut}
          </div>`;
        absIdx++;
      }
    }

    this._list.innerHTML = html;

    // Scroll selected into view
    const sel = this._list.querySelector('.selected') as HTMLElement;
    sel?.scrollIntoView({ block: 'nearest' });

    // Click handlers
    this._list.querySelectorAll('.item').forEach(el => {
      el.addEventListener('click', () => {
        const id = (el as HTMLElement).dataset.id!;
        const item = this._filtered.find(i => i.id === id);
        if (item) this._execute(item);
      });
      el.addEventListener('mouseenter', () => {
        this._selectedIdx = parseInt((el as HTMLElement).dataset.idx!);
        this._renderList();
      });
    });
  }

  private _execute(item: CommandItem) {
    this.close();
    item.action?.();
    this.dispatchEvent(new CustomEvent('kayf-select', {
      detail: item,
      bubbles: true
    }));
  }
}

customElements.define('kayf-command-palette', CommandPalette);
