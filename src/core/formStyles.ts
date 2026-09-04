/** Shared field treatment for form-oriented components. */
export const formControlCSS = `
  .field-shell {
    position: relative;
    display: flex;
    min-height: 54px;
    align-items: center;
    overflow: hidden;
    border: 1px solid rgba(255,255,255,0.09);
    border-radius: 15px;
    color: var(--kayf-text);
    background: linear-gradient(180deg, rgba(22,22,30,0.94), rgba(13,13,18,0.98));
    box-shadow: inset 0 1px 0 rgba(255,255,255,0.035), 0 14px 36px rgba(0,0,0,0.2);
    isolation: isolate;
    transition: border-color 180ms ease, box-shadow 220ms ease, transform 180ms ease, background 180ms ease;
  }

  .field-shell::before {
    content: '';
    position: absolute;
    inset: 0;
    z-index: -1;
    pointer-events: none;
    background: radial-gradient(circle at var(--field-x, 50%) 0%, color-mix(in srgb, var(--field-accent) 14%, transparent), transparent 48%);
    opacity: 0;
    transition: opacity 220ms ease;
  }

  .field-shell:hover:not(.is-disabled) {
    border-color: color-mix(in srgb, var(--field-accent) 34%, rgba(255,255,255,0.12));
    background: linear-gradient(180deg, rgba(26,26,35,0.96), rgba(14,14,20,0.99));
  }

  .field-shell:hover:not(.is-disabled)::before,
  .field-shell:focus-within::before { opacity: 1; }

  .field-shell:focus-within {
    border-color: color-mix(in srgb, var(--field-accent) 66%, white);
    box-shadow:
      inset 0 1px 0 rgba(255,255,255,0.06),
      0 0 0 3px color-mix(in srgb, var(--field-accent) 13%, transparent),
      0 18px 42px rgba(0,0,0,0.26);
  }

  .field-shell.is-invalid {
    border-color: rgba(255,115,131,0.62);
    box-shadow: 0 0 0 3px rgba(255,115,131,0.1);
  }

  .field-shell.is-disabled { opacity: 0.48; }

  .field-label {
    display: block;
    margin: 0 0 9px 2px;
    color: rgba(228,228,231,0.68);
    font: 600 12px/1.2 var(--kayf-font-sans);
    letter-spacing: -0.01em;
  }

  .field-input {
    width: 100%;
    min-width: 0;
    padding: 0;
    border: 0;
    color: var(--kayf-text);
    background: transparent;
    outline: none;
    font: 540 14px/1 var(--kayf-font-sans);
    letter-spacing: -0.012em;
  }

  .field-input::placeholder { color: rgba(228,228,231,0.27); }
  .field-input:disabled { cursor: not-allowed; }

  .field-message {
    display: flex;
    min-height: 18px;
    margin: 8px 2px 0;
    align-items: flex-start;
    justify-content: space-between;
    gap: 12px;
    color: rgba(228,228,231,0.38);
    font: 500 10px/1.45 var(--kayf-font-sans);
  }

  .field-message.is-error { color: #ff8997; }

  @media (prefers-reduced-motion: reduce) {
    .field-shell, .field-shell::before { transition-duration: 0.01ms; }
  }
`

export const escapeHTML = (value: string): string => value.replace(/[&<>'"]/g, character => ({
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  "'": '&#39;',
  '"': '&quot;',
})[character] ?? character)
