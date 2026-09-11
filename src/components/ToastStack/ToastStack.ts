import { KayfElement } from '../../core/KayfElement'
import { baseCSS } from '../../core/tokens'
import { escapeHTML } from '../../core/formStyles'

export type ToastTone = 'info' | 'success' | 'warning' | 'error'
export interface ToastOptions { id?: string; title: string; description?: string; tone?: ToastTone; duration?: number; actionLabel?: string }
export type ToastDismissReason = 'manual' | 'timeout' | 'action' | 'overflow' | 'clear'
export interface ToastDismissDetail { id: string; reason: ToastDismissReason }
interface ToastRecord { id: string; options: ToastOptions; remaining: number; timed: boolean; started?: number; origin?: HTMLElement }
const tones: Record<ToastTone, { color:string; symbol:string; label:string }> = {
  info: { color:'#62daf7', symbol:'i', label:'Information' },
  success: { color:'#51dfa4', symbol:'✓', label:'Success' },
  warning: { color:'#f8c868', symbol:'!', label:'Warning' },
  error: { color:'#ff7383', symbol:'!', label:'Error' },
}

/** Local notifications with persistent actions and timers that pause during interaction. */
export class ToastStack extends KayfElement {
  private records: ToastRecord[] = []
  private nextId = 0
  private timer?: ReturnType<typeof setTimeout>
  private hovered = false
  private onVisibility = () => this.schedule()
  private onEnter = () => { this.hovered = true; this.schedule() }
  private onLeave = () => { this.hovered = false; this.schedule() }
  private onFocus = () => this.schedule()
  private onBlur = () => queueMicrotask(() => this.schedule())

  static override get observedAttributes() { return ['inline', 'position', 'label'] }
  get count(): number { return this.records.length }

  protected override update(): void {
    const active = this.root.activeElement as HTMLElement | null
    const id = active?.closest<HTMLElement>('[data-toast]')?.dataset.toast
    const action = active?.dataset.action
    super.update()
    if (id) {
      const row = Array.from(this.root.querySelectorAll<HTMLElement>('[data-toast]')).find(row => row.dataset.toast === id)
      row?.querySelector<HTMLButtonElement>(action === 'action' ? '.action' : '.dismiss')?.focus()
    }
  }

  show(options: ToastOptions): string {
    let id = options.id
    if (!id) {
      do { id = `toast-${++this.nextId}` } while (this.records.some(record => record.id === id))
    }
    const existing = this.records.find(record => record.id === id)
    let origin = document.activeElement as HTMLElement | null
    while (origin?.shadowRoot?.activeElement) origin = origin.shadowRoot.activeElement as HTMLElement
    // Actionable notices stay until dismissed unless the caller supplies a duration.
    const raw = options.duration ?? (options.actionLabel ? 0 : 6000)
    const duration = Number.isFinite(raw) ? Math.max(0, Math.min(600000, raw)) : 6000
    const record: ToastRecord = { id, options:{ ...options }, remaining:duration, timed:duration > 0, origin:existing?.origin ?? (origin && !this.root.contains(origin) ? origin : undefined) }
    if (existing) this.records[this.records.indexOf(existing)] = record
    else {
      if (this.records.length >= 5) this.dismiss(this.records[0].id, 'overflow')
      this.records.push(record)
    }
    this.paint()
    const tone = options.tone && Object.prototype.hasOwnProperty.call(tones, options.tone) ? options.tone : 'info'
    const live = this.root.querySelector<HTMLElement>(tone === 'error' ? '[role="alert"]' : '[role="status"]')
    if (live) live.textContent = `${tones[tone].label}: ${options.title}${options.description ? '. ' + options.description : ''}${options.actionLabel ? '. Action available: ' + options.actionLabel : ''}`
    this.schedule()
    return id
  }

  dismiss(id: string, reason: ToastDismissReason = 'manual'): void {
    const index = this.records.findIndex(record => record.id === id)
    if (index < 0) return
    const active = this.root.activeElement as HTMLElement | null
    const restoreFocus = active?.closest<HTMLElement>('[data-toast]')?.dataset.toast === id
    const [record] = this.records.splice(index, 1)
    if (!this.records.length) this.hovered = false
    this.paint()
    if (restoreFocus) {
      const next = this.root.querySelector<HTMLButtonElement>('button')
      if (next) next.focus()
      else if (record.origin?.isConnected) record.origin.focus()
    }
    this.schedule()
    this.dispatchEvent(new CustomEvent<ToastDismissDetail>('kayf-toast-dismiss', { bubbles:true, composed:true, detail:{ id, reason } }))
  }
  clear(): void { [...this.records].forEach(record => this.dismiss(record.id, 'clear')) }

  protected styles(): string {
    return baseCSS + `
      :host { position:fixed; z-index:1000; bottom:max(24px,env(safe-area-inset-bottom)); right:max(24px,env(safe-area-inset-right)); display:block; width:min(400px,calc(100vw - 32px)); pointer-events:none; font-family:var(--kayf-font-sans); }
      :host([position='top-end']) { top:max(24px,env(safe-area-inset-top)); bottom:auto; }
      :host([inline]) { position:relative; inset:auto; width:100%; max-width:440px; z-index:auto; }
      *,*::before,*::after { box-sizing:border-box; }
      ol { display:grid; gap:10px; margin:0; padding:0; list-style:none; }
      .toast { position:relative; display:grid; grid-template-columns:32px minmax(0,1fr) 28px; align-items:start; gap:12px; padding:18px; border:1px solid #ffffff20; border-radius:17px; color:var(--kayf-text); background:radial-gradient(ellipse at 0 0,color-mix(in srgb,var(--tone) 8%,transparent),transparent 65%),#131319; box-shadow:0 16px 45px #0005,inset 0 1px 0 #ffffff06; pointer-events:auto; animation:toast-arrive 200ms ease-out; }
      .icon { display:grid; width:30px; height:30px; place-items:center; border:1px solid color-mix(in srgb,var(--tone) 28%,transparent); border-radius:10px; background:color-mix(in srgb,var(--tone) 7%,transparent); color:var(--tone); font:600 15px/1 var(--kayf-font-mono); }
      .title { display:block; padding-top:2px; color:var(--kayf-text); font-size:13px; line-height:1.5; font-weight:600; overflow-wrap:anywhere; }
      .description { margin:5px 0 0; color:var(--kayf-muted); font-size:12px; line-height:1.6; overflow-wrap:anywhere; }
      button { cursor:pointer; font-family:inherit; }
      .dismiss { display:grid; width:28px; height:28px; padding:0; place-items:center; border:0; border-radius:7px; color:var(--kayf-muted); background:transparent; font-size:20px; }
      .dismiss:hover { background:#ffffff0c; color:#fff; }
      .action { min-height:32px; margin-top:12px; padding:5px 10px; border:1px solid color-mix(in srgb,var(--tone) 28%,transparent); border-radius:7px; color:color-mix(in srgb,var(--tone) 72%,white); background:color-mix(in srgb,var(--tone) 7%,transparent); font-size:11px; font-weight:600; }
      .action:hover { background:color-mix(in srgb,var(--tone) 15%,transparent); }
      button:focus-visible { outline:2px solid var(--tone); outline-offset:3px; }
      .sr-only { position:absolute; width:1px; height:1px; overflow:hidden; clip-path:inset(50%); white-space:nowrap; }
      @keyframes toast-arrive { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:none; } }
      @media (max-width:420px) { .toast { padding:14px; gap:9px; } }
    `
  }
  protected template(): string {
    return `<section aria-label="${escapeHTML(this.attr('label', 'Notifications'))}" part="region"><ol part="stack"></ol></section><div class="sr-only" role="status" aria-atomic="true"></div><div class="sr-only" role="alert" aria-atomic="true"></div>`
  }
  protected setup(): void {
    document.removeEventListener('visibilitychange', this.onVisibility)
    document.addEventListener('visibilitychange', this.onVisibility)
    const region = this.root.querySelector('section')!
    region.addEventListener('pointerenter', this.onEnter)
    region.addEventListener('pointerleave', this.onLeave)
    region.addEventListener('focusin', this.onFocus)
    region.addEventListener('focusout', this.onBlur)
    this.paint()
    this.schedule()
  }
  protected cleanup(): void {
    this.settle()
    clearTimeout(this.timer)
    this.records.forEach(record => record.started = undefined)
    this.hovered = false
    document.removeEventListener('visibilitychange', this.onVisibility)
  }
  private paint(): void {
    const list = this.root.querySelector('ol')
    if (!list) return
    const active = this.root.activeElement as HTMLElement | null
    const focusedId = active?.closest<HTMLElement>('[data-toast]')?.dataset.toast
    const focusedAction = active?.dataset.action
    // Reuse existing rows so arrivals never restart other animations or steal focus.
    const current = new Map(Array.from(list.children).map(child => [(child as HTMLElement).dataset.toast, child as HTMLElement]))
    for (const record of this.records) {
      const tone = record.options.tone && Object.prototype.hasOwnProperty.call(tones, record.options.tone) ? record.options.tone : 'info'
      const theme = tones[tone]
      const content = `<span class="icon" aria-hidden="true">${theme.symbol}</span><div><strong class="title">${escapeHTML(record.options.title)}</strong>${record.options.description ? `<p class="description">${escapeHTML(record.options.description)}</p>` : ''}${record.options.actionLabel ? `<button class="action" type="button" data-action="action">${escapeHTML(record.options.actionLabel)}</button>` : ''}</div><button class="dismiss" type="button" data-action="dismiss" aria-label="Dismiss ${escapeHTML(record.options.title)}">×</button>`
      const row = current.get(record.id) ?? document.createElement('li')
      if (row.innerHTML !== content) {
        row.innerHTML = content
        row.querySelector('[data-action="dismiss"]')?.addEventListener('click', () => this.dismiss(record.id))
        row.querySelector('[data-action="action"]')?.addEventListener('click', () => {
          const accepted = this.dispatchEvent(new CustomEvent('kayf-toast-action', { bubbles:true, composed:true, cancelable:true, detail:{ id:record.id } }))
          if (accepted) this.dismiss(record.id, 'action')
        })
      }
      row.className = 'toast'
      row.setAttribute('part', 'toast')
      row.dataset.toast = record.id
      row.style.setProperty('--tone', theme.color)
      if (!row.parentElement) list.append(row)
      current.delete(record.id)
    }
    current.forEach(row => row.remove())
    if (focusedId && !this.root.activeElement) {
      const row = Array.from(list.children).find(child => (child as HTMLElement).dataset.toast === focusedId)
      row?.querySelector<HTMLButtonElement>(focusedAction === 'action' ? '.action' : '.dismiss')?.focus()
    }
  }
  private settle(): void {
    const now = performance.now()
    this.records.forEach(record => {
      if (record.started !== undefined) record.remaining = Math.max(0, record.remaining - (now - record.started))
      record.started = undefined
    })
  }
  private schedule(): void {
    clearTimeout(this.timer)
    this.settle()
    if (!this.isConnected || this.hovered || this.root.activeElement || document.hidden) return
    const timed = this.records.filter(record => record.timed)
    if (!timed.length) return
    timed.forEach(record => record.started = performance.now())
    this.timer = setTimeout(() => {
      this.settle()
      this.records.filter(record => record.timed && record.remaining <= 1).forEach(record => this.dismiss(record.id, 'timeout'))
      this.schedule()
    }, Math.max(1, Math.min(...timed.map(record => record.remaining))))
  }
}

if (!customElements.get('kayf-toast-stack')) customElements.define('kayf-toast-stack', ToastStack)
