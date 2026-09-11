import { KayfElement } from '../../core/KayfElement'
import { baseCSS, getColor } from '../../core/tokens'
import { escapeHTML } from '../../core/formStyles'

export type FileRejectionReason = 'type' | 'size' | 'count' | 'duplicate'
export interface FileRejection { file: File; reason: FileRejectionReason; message: string }
export interface FileDropzoneDetail { files: File[] }

const fileKey = (file: File): string => JSON.stringify([file.name, file.size, file.type, file.lastModified])
const fileSize = (size: number): string => size < 1024 * 1024 ? `${Math.max(1, Math.ceil(size / 1024))} KB` : `${(size / (1024 * 1024)).toFixed(1)} MB`

/** Local file selection and validation. Upload transport belongs to the consumer. */
export class FileDropzone extends KayfElement {
  private selected: File[] = []
  private rejections: FileRejection[] = []
  private dragDepth = 0

  static override get observedAttributes() {
    return ['accept', 'multiple', 'max-size', 'max-files', 'disabled', 'label', 'hint', 'color']
  }
  get files(): File[] { return [...this.selected] }
  clear(): void {
    const changed = this.selected.length > 0
    this.selected = []
    this.rejections = []
    this.update()
    if (changed) this.emitChange()
  }
  override focus(options?: FocusOptions): void { this.root.querySelector<HTMLButtonElement>('.browse')?.focus(options) }
  private limit(name: string, fallback: number): number {
    const value = Number(this.attr(name, String(fallback)))
    return Number.isFinite(value) && value > 0 ? Math.max(1, Math.floor(value)) : fallback
  }
  protected styles(): string {
    return baseCSS + `
      :host { display:block; width:100%; max-width:560px; font-family:var(--kayf-font-sans); --accent:${getColor(this.attr('color', 'cyan'))}; }
      *,*::before,*::after { box-sizing:border-box; }
      .dropzone { position:relative; padding:32px 24px; border:1px dashed #ffffff30; border-radius:20px; background:radial-gradient(ellipse at 50% 0%,color-mix(in srgb,var(--accent) 7%,transparent),transparent 70%),#0f0f15; text-align:center; transition:border-color 180ms,background 180ms,box-shadow 180ms; }
      .dropzone:hover,.dropzone:focus-within,.dropzone.dragging { border-color:var(--accent); box-shadow:0 0 0 4px color-mix(in srgb,var(--accent) 8%,transparent); }
      .dropzone.dragging { background:color-mix(in srgb,var(--accent) 10%,#0f0f15); }
      .icon { display:grid; width:52px; height:52px; margin:0 auto 18px; place-items:center; border:1px solid color-mix(in srgb,var(--accent) 28%,transparent); border-radius:16px; color:var(--accent); background:color-mix(in srgb,var(--accent) 7%,transparent); transform:rotate(-5deg); transition:transform 180ms; }
      .dragging .icon { transform:translateY(-4px) rotate(0); }
      .icon svg { width:25px; }
      h3 { margin:0 0 8px; color:var(--kayf-text); font-size:15px; letter-spacing:-.02em; font-weight:600; }
      .hint { margin:0 auto 20px; max-width:340px; color:var(--kayf-muted); font-size:12px; line-height:1.6; overflow-wrap:anywhere; }
      button { font:600 12px/1.4 var(--kayf-font-sans); cursor:pointer; }
      .browse { min-height:40px; padding:8px 16px; border:1px solid #ffffff25; border-radius:10px; color:var(--kayf-text); background:#ffffff09; transition:background 180ms; }
      .browse:hover { background:#ffffff14; }
      button:focus-visible { outline:2px solid var(--accent); outline-offset:3px; }
      .limits { display:flex; flex-wrap:wrap; justify-content:center; gap:6px 16px; margin-top:16px; color:var(--kayf-muted); font:10px/1.5 var(--kayf-font-mono); }
      .files { display:grid; gap:8px; padding:0; margin:14px 0 0; list-style:none; }
      .file { display:flex; gap:12px; align-items:center; padding:12px; border:1px solid var(--kayf-border); border-radius:13px; background:#111117; }
      .file-icon { display:grid; flex:none; width:35px; height:40px; place-items:center; border:1px solid #ffffff16; border-radius:8px; color:var(--accent); font:700 9px var(--kayf-font-mono); }
      .copy { flex:1; min-width:0; } .name { display:block; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; color:var(--kayf-text); font-size:12px; }
      .meta { display:block; margin-top:4px; color:var(--kayf-muted); font-size:11px; }
      .remove { display:grid; flex:none; width:36px; height:36px; place-items:center; border:0; border-radius:8px; background:transparent; color:var(--kayf-muted); font-size:20px; }
      .remove:hover { color:#ff9aa6; background:#ff738312; }
      .errors { padding:0; margin:12px 0 0; list-style:none; color:#ff9aa6; font-size:12px; line-height:1.6; overflow-wrap:anywhere; }
      .status { margin:12px 2px 0; color:var(--kayf-muted); font-size:11px; }
      :host([disabled]) { opacity:.45; } :host([disabled]) button { cursor:not-allowed; }
      @media (max-width:360px) { .dropzone { padding:24px 16px; } }
    `
  }
  protected template(): string {
    const disabled = this.boolAttr('disabled')
    const multiple = this.boolAttr('multiple')
    return `
      <div class="dropzone" part="dropzone" role="group" aria-labelledby="drop-label" aria-describedby="drop-hint">
        <div class="icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none"><path d="M12 16V3m-5 5 5-5 5 5M4 15v4a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg></div>
        <h3 id="drop-label">${escapeHTML(this.attr('label', 'Make room for your next idea'))}</h3>
        <p class="hint" id="drop-hint">${escapeHTML(this.attr('hint', 'Drop files here, or choose them from your device.'))}</p>
        <button type="button" class="browse" part="browse" ${disabled ? 'disabled' : ''}>Choose ${multiple ? 'files' : 'a file'}</button>
        <input type="file" hidden aria-label="Choose files" accept="${escapeHTML(this.attr('accept'))}" ${multiple ? 'multiple' : ''} ${disabled ? 'disabled' : ''}/>
        <div class="limits"><span>${escapeHTML(this.attr('accept') || 'All file types')}</span><span>Up to ${fileSize(this.limit('max-size', 10 * 1024 * 1024))} each</span><span>${multiple ? this.limit('max-files', 5) : 1} ${multiple ? 'files' : 'file'}</span></div>
      </div>
      <ul class="files" part="files" aria-label="Selected files">${this.selected.map((file, index) => `
        <li class="file" part="file"><span class="file-icon" aria-hidden="true">${escapeHTML(file.name.split('.').pop()!.slice(0, 4).toUpperCase())}</span><span class="copy"><span class="name" title="${escapeHTML(file.name)}">${escapeHTML(file.name)}</span><span class="meta">${fileSize(file.size)} · Ready to upload</span></span><button class="remove" type="button" data-index="${index}" aria-label="Remove ${escapeHTML(file.name)}" ${disabled ? 'disabled' : ''}>×</button></li>
      `).join('')}</ul>
      <ul class="errors" role="alert">${this.rejections.map(rejection => `<li>${escapeHTML(rejection.file.name)}: ${escapeHTML(rejection.message)}</li>`).join('')}</ul>
      <p class="status" role="status">${this.selected.length ? `${this.selected.length} ${this.selected.length === 1 ? 'file' : 'files'} selected. Nothing uploaded yet.` : 'Your files stay on this device until you upload them.'}</p>
    `
  }
  protected setup(): void {
    this.dragDepth = 0
    const zone = this.root.querySelector<HTMLElement>('.dropzone')!
    const input = this.root.querySelector<HTMLInputElement>('input')!
    this.root.querySelector('.browse')?.addEventListener('click', () => { if (!this.boolAttr('disabled')) input.click() })
    input.addEventListener('change', () => {
      this.addFiles(Array.from(input.files ?? []))
      input.value = ''
    })
    zone.addEventListener('dragenter', event => {
      event.preventDefault()
      if (!this.boolAttr('disabled') && event.dataTransfer?.types.includes('Files')) {
        this.dragDepth++
        zone.classList.add('dragging')
      }
    })
    zone.addEventListener('dragover', event => {
      event.preventDefault()
      if (event.dataTransfer) event.dataTransfer.dropEffect = this.boolAttr('disabled') ? 'none' : 'copy'
    })
    zone.addEventListener('dragleave', () => {
      this.dragDepth = Math.max(0, this.dragDepth - 1)
      if (!this.dragDepth) zone.classList.remove('dragging')
    })
    zone.addEventListener('drop', event => {
      event.preventDefault()
      this.dragDepth = 0
      zone.classList.remove('dragging')
      this.addFiles(Array.from(event.dataTransfer?.files ?? []))
    })
    this.root.querySelectorAll<HTMLButtonElement>('.remove').forEach(button => button.addEventListener('click', () => {
      if (this.boolAttr('disabled')) return
      const index = Number(button.dataset.index)
      this.selected.splice(index, 1)
      this.rejections = []
      this.update()
      const next = this.root.querySelectorAll<HTMLButtonElement>('.remove')
      if (next.length) next[Math.min(index, next.length - 1)].focus()
      else this.focus()
      this.emitChange()
    }))
  }
  private accepts(file: File): boolean {
    const rules = this.attr('accept').split(',').map(rule => rule.trim().toLowerCase()).filter(Boolean)
    return !rules.length || rules.some(rule => rule.startsWith('.') ? file.name.toLowerCase().endsWith(rule)
      : rule.endsWith('/*') ? file.type.toLowerCase().startsWith(rule.slice(0, -1)) : file.type.toLowerCase() === rule)
  }
  private addFiles(files: File[]): void {
    if (this.boolAttr('disabled') || !files.length) return
    const next = this.boolAttr('multiple') ? [...this.selected] : []
    const limit = this.boolAttr('multiple') ? this.limit('max-files', 5) : 1
    this.rejections = []
    for (const file of files) {
      let reason: FileRejectionReason | undefined
      let message = ''
      if (!this.accepts(file)) { reason = 'type'; message = 'This file type is not accepted.' }
      else if (file.size > this.limit('max-size', 10 * 1024 * 1024)) { reason = 'size'; message = 'This file exceeds the size limit.' }
      else if (next.some(item => fileKey(item) === fileKey(file))) { reason = 'duplicate'; message = 'This file is already selected.' }
      else if (next.length >= limit) { reason = 'count'; message = `Select up to ${limit} ${limit === 1 ? 'file' : 'files'}.` }
      if (reason) this.rejections.push({ file, reason, message })
      else next.push(file)
    }
    const changed = next.length > 0 && (next.length !== this.selected.length || next.some((file, index) => file !== this.selected[index]))
    if (changed) this.selected = next
    const rejected = [...this.rejections]
    this.update()
    this.focus()
    if (changed) this.emitChange()
    if (rejected.length) this.dispatchEvent(new CustomEvent('kayf-reject', { bubbles: true, composed: true, detail: { rejections: rejected } }))
  }
  private emitChange(): void {
    this.dispatchEvent(new CustomEvent<FileDropzoneDetail>('kayf-change', { bubbles: true, composed: true, detail: { files: this.files } }))
  }
}

if (!customElements.get('kayf-file-dropzone')) customElements.define('kayf-file-dropzone', FileDropzone)
