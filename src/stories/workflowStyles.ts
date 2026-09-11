import { html } from 'lit'

export const workflowStyles = html`<style>
  .workflow-stage,.workflow-stage *{box-sizing:border-box}
  .workflow-stage{width:100%;max-width:960px;margin:auto;padding:clamp(24px,6vw,64px);border:1px solid #ffffff12;border-radius:28px;color:#f4f4f7;background:radial-gradient(ellipse at 85% 0%,#8b7cff10,transparent 55%),#0b0b10;font-family:Inter,system-ui,sans-serif}
  .workflow-stage .eyebrow{display:block;margin-bottom:14px;color:#afa5ff;font:600 10px/1.5 ui-monospace,monospace;letter-spacing:.14em;text-transform:uppercase}
  .workflow-stage h2{margin:0 0 14px;font-size:clamp(27px,5vw,40px);line-height:1.1;letter-spacing:-.045em;font-weight:600}
  .workflow-stage .lead{max-width:470px;margin:0 0 32px;color:#a5a5b3;font-size:14px;line-height:1.7}
  .workflow-stage .feedback{min-height:20px;margin:20px 0 0;color:#a5a5b3;font:12px/1.6 ui-monospace,monospace}
  .workflow-stack{display:grid;gap:28px;max-width:560px;margin:auto}.workflow-stack>div{min-width:0}
  .workflow-stage .demo-actions{display:flex;flex-wrap:wrap;gap:10px;margin-top:28px}
  .workflow-stage .demo-button{min-height:42px;padding:10px 16px;border:1px solid #ffffff25;border-radius:11px;color:#f4f4f7;background:#ffffff08;font:600 12px system-ui;cursor:pointer}
  .workflow-stage .demo-button:hover{background:#ffffff12}.workflow-stage .demo-button:focus-visible{outline:2px solid #b1a7ff;outline-offset:3px}
  .workflow-stage .demo-button:disabled{opacity:.4;cursor:not-allowed}
</style>`
