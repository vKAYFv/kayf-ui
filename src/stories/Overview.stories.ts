import type { Meta, StoryObj } from '@storybook/web-components-vite'
import { html } from 'lit'

const components = [
  { name: 'Prism Button', tag: 'kayf-prism-button', description: 'High-emphasis CTA with localized refraction.', docs: 'components-prismbutton--docs', group: 'Actions' },
  { name: 'Orbit Button', tag: 'kayf-orbit-button', description: 'Directional action with an orbital status mark.', docs: 'components-orbitbutton--docs', group: 'Actions' },
  { name: 'Hold Button', tag: 'kayf-hold-button', description: 'Deliberate hold-to-confirm interaction.', docs: 'components-holdbutton--docs', group: 'Actions' },
  { name: 'Beam Button', tag: 'kayf-beam-button', description: 'Versatile action with a focused light sweep.', docs: 'components-beambutton--docs', group: 'Actions' },
  { name: 'Magnetic Button', tag: 'kayf-magnetic-btn', description: 'Physics-based proximity wrapper.', docs: 'components-magneticbutton--docs', group: 'Actions' },
  { name: 'Phone Input', tag: 'kayf-phone-input', description: 'Country-aware international phone field.', docs: 'components-phoneinput--docs', group: 'Inputs & flows' },
  { name: 'Language Switcher', tag: 'kayf-language-switcher', description: 'Animated, keyboard-ready locale picker.', docs: 'components-languageswitcher--docs', group: 'Inputs & flows' },
  { name: 'Auth Form', tag: 'kayf-auth-form', description: 'Sign-in and registration flow with validation.', docs: 'components-authform--docs', group: 'Inputs & flows' },
  { name: 'Spotlight Card', tag: 'kayf-spotlight-card', description: 'Pointer-aware glass surface.', docs: 'components-spotlightcard--docs', group: 'Surfaces' },
  { name: 'Aurora Card', tag: 'kayf-aurora-card', description: 'Fluid ambient canvas background.', docs: 'components-auroracard--docs', group: 'Surfaces' },
  { name: 'Holographic Card', tag: 'kayf-holographic-card', description: 'Restrained iridescent 3D material.', docs: 'components-holographiccard--docs', group: 'Surfaces' },
  { name: 'Noise Card', tag: 'kayf-noise-card', description: 'Tactile grain and glass surface.', docs: 'components-noisecard--docs', group: 'Surfaces' },
  { name: '3D Tilt Card', tag: 'kayf-3d-tilt-card', description: 'Stable perspective interaction wrapper.', docs: 'components-tiltcard3d--docs', group: 'Surfaces' },
  { name: 'Neon Border', tag: 'kayf-neon-border', description: 'Configurable animated edge.', docs: 'components-neonborder--docs', group: 'Surfaces' },
  { name: 'Particle Field', tag: 'kayf-particle-field', description: 'Interactive canvas particle environment.', docs: 'components-particlefield--docs', group: 'Motion & data' },
  { name: 'Ripple Grid', tag: 'kayf-ripple-grid', description: 'Responsive dot-matrix ripples.', docs: 'components-ripplegrid--docs', group: 'Motion & data' },
  { name: 'Counter', tag: 'kayf-counter', description: 'Viewport-triggered numeric metric.', docs: 'components-counter--docs', group: 'Motion & data' },
  { name: 'Typewriter Text', tag: 'kayf-typewriter', description: 'Multi-line text sequencing.', docs: 'components-typewritertext--docs', group: 'Motion & data' },
  { name: 'Command Palette', tag: 'kayf-command-palette', description: 'Keyboard-first command navigation.', docs: 'components-commandpalette--docs', group: 'Motion & data' },
]

const groups = ['Actions', 'Inputs & flows', 'Surfaces', 'Motion & data']

const meta: Meta = {
  title: 'Welcome',
  parameters: {
    layout: 'fullscreen',
    controls: { disable: true },
    a11y: { disable: false },
  },
}

export default meta
type Story = StoryObj

export const Introduction: Story = {
  render: () => html`
    <style>
      .intro, .intro *, .intro *::before, .intro *::after { box-sizing: border-box; }
      .intro {
        min-height: 100vh;
        overflow: hidden;
        color: #f4f4f7;
        background:
          radial-gradient(circle at 10% 4%, rgba(98,218,247,.095), transparent 31rem),
          radial-gradient(circle at 88% 0%, rgba(139,124,255,.13), transparent 34rem),
          #07070a;
        font-family: Inter, ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      }

      .intro__shell { width: min(1120px, calc(100% - 48px)); margin: 0 auto; }

      .intro__nav {
        display: flex;
        min-height: 72px;
        align-items: center;
        justify-content: space-between;
        border-bottom: 1px solid rgba(255,255,255,.065);
      }

      .intro__brand { display: flex; align-items: center; gap: 11px; color: #f4f4f7; font-size: 14px; font-weight: 700; letter-spacing: -.02em; }
      .intro__mark { display: grid; width: 28px; height: 28px; place-items: center; border: 1px solid rgba(255,255,255,.12); border-radius: 9px; background: rgba(255,255,255,.035); font: 700 9px/1 ui-monospace, monospace; }
      .intro__navlinks { display: flex; gap: 20px; }
      .intro__navlinks a { color: rgba(228,228,231,.5); font-size: 12px; text-decoration: none; transition: color 160ms ease; }
      .intro__navlinks a:hover { color: #f4f4f7; }

      .intro__hero { position: relative; padding: clamp(82px, 12vw, 150px) 0 88px; }
      .intro__eyebrow { display: inline-flex; margin: 0 0 25px; padding: 7px 10px; border: 1px solid rgba(139,124,255,.2); border-radius: 999px; color: #aaa2ff; background: rgba(139,124,255,.06); font: 650 10px/1 ui-monospace, monospace; letter-spacing: .13em; text-transform: uppercase; }
      .intro h1 { max-width: 900px; margin: 0; font-size: clamp(48px, 8.4vw, 96px); font-weight: 680; line-height: .91; letter-spacing: -.067em; }
      .intro__gradient { color: transparent; background: linear-gradient(112deg, #f4f4f7 7%, #83e7ff 42%, #a99fff 70%, #ffadc9); background-clip: text; -webkit-background-clip: text; }
      .intro__lead { max-width: 650px; margin: 32px 0 0; color: rgba(228,228,231,.58); font-size: clamp(17px, 2.2vw, 21px); line-height: 1.55; letter-spacing: -.018em; }
      .intro__actions { display: flex; flex-wrap: wrap; align-items: center; gap: 12px; margin-top: 36px; }
      .intro__cta { display: inline-flex; min-height: 46px; padding: 0 20px; align-items: center; border: 1px solid rgba(139,124,255,.42); border-radius: 13px; color: #0a0910; background: linear-gradient(135deg, #d9d4ff, #9f94ff 62%, #8b7cff); box-shadow: 0 14px 34px rgba(139,124,255,.18), inset 0 1px 0 rgba(255,255,255,.45); font-size: 13px; font-weight: 720; text-decoration: none; transition: transform 180ms ease, box-shadow 180ms ease; }
      .intro__cta:hover { transform: translateY(-2px); box-shadow: 0 19px 42px rgba(139,124,255,.24), inset 0 1px 0 rgba(255,255,255,.48); }
      .intro__cta:focus-visible, .intro a:focus-visible { outline: 2px solid #9f94ff; outline-offset: 4px; }
      .intro__install { display: inline-flex; min-height: 46px; padding: 0 17px; align-items: center; border: 1px solid rgba(255,255,255,.09); border-radius: 13px; color: rgba(244,244,247,.68); background: rgba(255,255,255,.026); font: 500 12px/1 ui-monospace, monospace; }

      .intro__metrics { display: grid; grid-template-columns: repeat(4, 1fr); border-top: 1px solid rgba(255,255,255,.065); border-bottom: 1px solid rgba(255,255,255,.065); }
      .intro__metric { padding: 25px 24px; border-right: 1px solid rgba(255,255,255,.065); }
      .intro__metric:first-child { padding-left: 0; }
      .intro__metric:last-child { border-right: 0; }
      .intro__metric strong { display: block; margin-bottom: 7px; font-size: 19px; font-weight: 650; letter-spacing: -.03em; }
      .intro__metric span { color: rgba(228,228,231,.38); font-size: 10px; letter-spacing: .1em; text-transform: uppercase; }

      .intro__section { padding: 96px 0; border-bottom: 1px solid rgba(255,255,255,.065); }
      .intro__section-head { display: grid; grid-template-columns: .75fr 1.25fr; gap: 48px; margin-bottom: 46px; }
      .intro__section-label { margin: 2px 0 0; color: #9e94ff; font: 650 10px/1.2 ui-monospace, monospace; letter-spacing: .15em; text-transform: uppercase; }
      .intro__section h2 { max-width: 660px; margin: 0; font-size: clamp(34px, 5vw, 54px); font-weight: 650; line-height: 1; letter-spacing: -.05em; }
      .intro__section-copy { max-width: 610px; margin: 17px 0 0; color: rgba(228,228,231,.5); font-size: 15px; line-height: 1.65; }

      .intro__quickstart { display: grid; grid-template-columns: .84fr 1.16fr; gap: 18px; }
      .intro__steps { display: grid; gap: 10px; }
      .intro__step { display: grid; grid-template-columns: 32px 1fr; gap: 14px; padding: 19px; border: 1px solid rgba(255,255,255,.065); border-radius: 15px; background: rgba(255,255,255,.018); }
      .intro__step-number { color: rgba(228,228,231,.32); font: 10px/1 ui-monospace, monospace; }
      .intro__step strong { display: block; margin-bottom: 6px; font-size: 13px; font-weight: 620; }
      .intro__step span { color: rgba(228,228,231,.43); font-size: 12px; line-height: 1.5; }
      .intro__code { margin: 0; padding: 25px; overflow-x: auto; border: 1px solid rgba(255,255,255,.075); border-radius: 18px; color: rgba(228,228,231,.72); background: #0a0a0e; box-shadow: inset 0 1px 0 rgba(255,255,255,.025); font: 12px/1.75 ui-monospace, SFMono-Regular, Consolas, monospace; }
      .intro__code .comment { color: rgba(228,228,231,.28); }
      .intro__code .tag { color: #8ee9ff; }
      .intro__code .attr { color: #b7adff; }
      .intro__code .string { color: #8ee5bd; }

      .intro__button-lab { position: relative; display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; padding: 42px; overflow: hidden; border: 1px solid rgba(255,255,255,.075); border-radius: 24px; background: radial-gradient(circle at 50% 110%, rgba(139,124,255,.11), transparent 48%), linear-gradient(145deg, #0d0d13, #09090d); }
      .intro__button-cell { display: grid; min-height: 180px; padding: 24px; place-items: center; border: 1px solid rgba(255,255,255,.055); border-radius: 17px; background: rgba(255,255,255,.018); }
      .intro__button-cell > div { display: grid; justify-items: center; gap: 18px; }
      .intro__button-name { color: rgba(228,228,231,.34); font: 9px/1 ui-monospace, monospace; letter-spacing: .13em; text-transform: uppercase; }

      .intro__product-lab { display: grid; grid-template-columns: minmax(0, .86fr) minmax(360px, 1.14fr); gap: 16px; padding: 18px; border: 1px solid rgba(255,255,255,.075); border-radius: 26px; background: radial-gradient(circle at 0 0, rgba(98,218,247,.07), transparent 35%), linear-gradient(145deg, #0d0d13, #09090d); }
      .intro__product-stack { display: grid; align-content: center; gap: 26px; padding: clamp(18px, 5vw, 40px); border: 1px solid rgba(255,255,255,.055); border-radius: 19px; background: rgba(255,255,255,.016); }
      .intro__product-copy span { color: #84e5fa; font: 650 9px/1 ui-monospace, monospace; letter-spacing: .14em; text-transform: uppercase; }
      .intro__product-copy h3 { margin: 13px 0 9px; font-size: 25px; letter-spacing: -.04em; }
      .intro__product-copy p { max-width: 400px; margin: 0; color: rgba(228,228,231,.43); font-size: 12px; line-height: 1.6; }
      .intro__input-demo { display: grid; gap: 18px; }
      .intro__language-row { display: flex; align-items: end; justify-content: space-between; gap: 12px; }
      .intro__language-note { color: rgba(228,228,231,.32); font: 9px/1.5 ui-monospace, monospace; text-transform: uppercase; }
      .intro__auth-demo { display: grid; place-items: center; padding: 14px; }
      .intro__auth-demo kayf-auth-form { max-width: 390px; }

      .intro__principles { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }
      .intro__principle { min-height: 190px; padding: 25px; border: 1px solid rgba(255,255,255,.065); border-radius: 17px; background: rgba(255,255,255,.018); }
      .intro__principle-index { display: block; margin-bottom: 44px; color: #9e94ff; font: 10px/1 ui-monospace, monospace; }
      .intro__principle h3 { margin: 0 0 9px; font-size: 17px; letter-spacing: -.025em; }
      .intro__principle p { margin: 0; color: rgba(228,228,231,.45); font-size: 12px; line-height: 1.6; }

      .intro__group + .intro__group { margin-top: 48px; }
      .intro__group-title { display: flex; align-items: center; gap: 12px; margin: 0 0 16px; color: rgba(228,228,231,.42); font: 650 10px/1 ui-monospace, monospace; letter-spacing: .13em; text-transform: uppercase; }
      .intro__group-title::after { content: ''; height: 1px; flex: 1; background: rgba(255,255,255,.06); }
      .intro__catalog { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 10px; }
      .intro__component { position: relative; min-height: 130px; padding: 20px; border: 1px solid rgba(255,255,255,.065); border-radius: 15px; background: rgba(255,255,255,.018); transition: transform 180ms ease, border-color 180ms ease, background 180ms ease; }
      .intro__component:hover { transform: translateY(-2px); border-color: rgba(139,124,255,.24); background: rgba(139,124,255,.035); }
      .intro__component strong { display: block; margin-bottom: 7px; font-size: 14px; font-weight: 620; letter-spacing: -.02em; }
      .intro__component p { margin: 0; color: rgba(228,228,231,.4); font-size: 11px; line-height: 1.5; }
      .intro__component code { position: absolute; right: 18px; bottom: 17px; left: 18px; overflow: hidden; color: rgba(158,148,255,.66); font: 9px/1 ui-monospace, monospace; text-overflow: ellipsis; white-space: nowrap; }
      .intro__component a { position: absolute; inset: 0; border-radius: inherit; }

      .intro__footer { display: flex; padding: 34px 0 52px; align-items: center; justify-content: space-between; color: rgba(228,228,231,.32); font-size: 11px; }
      .intro__footer a { color: rgba(228,228,231,.5); text-decoration: none; }

      @media (max-width: 820px) {
        .intro__section-head, .intro__quickstart { grid-template-columns: 1fr; }
        .intro__button-lab, .intro__product-lab, .intro__principles { grid-template-columns: 1fr; }
        .intro__button-cell { min-height: 130px; }
        .intro__catalog { grid-template-columns: repeat(2, minmax(0, 1fr)); }
        .intro__metrics { grid-template-columns: repeat(2, 1fr); }
        .intro__metric:nth-child(2) { border-right: 0; }
        .intro__metric:nth-child(-n+2) { border-bottom: 1px solid rgba(255,255,255,.065); }
        .intro__metric:nth-child(3) { padding-left: 0; }
      }

      @media (max-width: 520px) {
        .intro__shell { width: min(100% - 32px, 1120px); }
        .intro__navlinks a:first-child { display: none; }
        .intro__hero { padding-top: 72px; }
        .intro__metrics { grid-template-columns: 1fr; }
        .intro__metric { padding-left: 0; border-right: 0; border-bottom: 1px solid rgba(255,255,255,.065); }
        .intro__metric:last-child { border-bottom: 0; }
        .intro__section { padding: 72px 0; }
        .intro__button-lab { padding: 18px; }
        .intro__product-lab { padding: 10px; }
        .intro__product-stack { padding: 20px 14px; }
        .intro__language-row { align-items: stretch; flex-direction: column; }
        .intro__language-note { display: none; }
        .intro__auth-demo { padding: 4px; }
        .intro__catalog { grid-template-columns: 1fr; }
        .intro__footer { align-items: flex-start; flex-direction: column; gap: 8px; }
      }

      @media (prefers-reduced-motion: reduce) {
        .intro__cta:hover, .intro__component:hover { transform: none; }
      }
    </style>

    <main class="intro">
      <div class="intro__shell">
        <nav class="intro__nav" aria-label="Project links">
          <div class="intro__brand"><span class="intro__mark">K/</span><span>@kayf/ui</span></div>
          <div class="intro__navlinks">
            <a href="https://www.npmjs.com/package/@kayf/ui" target="_blank" rel="noreferrer">npm</a>
            <a href="https://github.com/vKAYFv/kayf-ui" target="_blank" rel="noreferrer">GitHub</a>
          </div>
        </nav>

        <header class="intro__hero">
          <p class="intro__eyebrow">Native interface system · v0.7.0</p>
          <h1>Components that <span class="intro__gradient">earn their motion.</span></h1>
          <p class="intro__lead">Nineteen expressive Web Components for dark interfaces—built with native browser APIs, typed in TypeScript, and designed to stay useful beyond the first impression.</p>
          <div class="intro__actions">
            <a class="intro__cta" href="/?path=/docs/components-prismbutton--docs" target="_top">Explore components →</a>
            <code class="intro__install">npm install @kayf/ui</code>
          </div>
        </header>

        <section class="intro__metrics" aria-label="Library highlights">
          <div class="intro__metric"><strong>19</strong><span>Components</span></div>
          <div class="intro__metric"><strong>0</strong><span>Runtime dependencies</span></div>
          <div class="intro__metric"><strong>Native</strong><span>Web Components</span></div>
          <div class="intro__metric"><strong>Typed</strong><span>TypeScript API</span></div>
        </section>

        <section class="intro__section">
          <div class="intro__section-head">
            <p class="intro__section-label">01 · Quick start</p>
            <div><h2>From install to interface in three steps.</h2><p class="intro__section-copy">Import the bundle once, then use every component as regular HTML. The same markup works in React, Vue, Svelte, static sites, and anywhere Custom Elements are supported.</p></div>
          </div>
          <div class="intro__quickstart">
            <div class="intro__steps">
              <article class="intro__step"><span class="intro__step-number">01</span><div><strong>Install</strong><span>Add @kayf/ui with your package manager.</span></div></article>
              <article class="intro__step"><span class="intro__step-number">02</span><div><strong>Register</strong><span>Import the package once at your app entry.</span></div></article>
              <article class="intro__step"><span class="intro__step-number">03</span><div><strong>Compose</strong><span>Use semantic slots and documented attributes.</span></div></article>
            </div>
            <pre class="intro__code"><span class="comment">// app.ts</span>
import <span class="string">'@kayf/ui'</span>

<span class="comment">// your markup</span>
<span class="tag">&lt;kayf-prism-button</span> <span class="attr">color</span>=<span class="string">"violet"</span> <span class="attr">size</span>=<span class="string">"lg"</span><span class="tag">&gt;</span>
  Create workspace
<span class="tag">&lt;/kayf-prism-button&gt;</span></pre>
          </div>
        </section>

        <section class="intro__section">
          <div class="intro__section-head">
            <p class="intro__section-label">02 · Action system</p>
            <div><h2>Three buttons, three clear intentions.</h2><p class="intro__section-copy">The new action family separates primary emphasis, forward navigation, and consequential confirmation instead of disguising every task behind the same visual treatment.</p></div>
          </div>
          <div class="intro__button-lab">
            <div class="intro__button-cell"><div><span class="intro__button-name">Primary action</span><kayf-prism-button color="violet">Create release</kayf-prism-button></div></div>
            <div class="intro__button-cell"><div><span class="intro__button-name">Forward action</span><kayf-orbit-button color="cyan">Open preview</kayf-orbit-button></div></div>
            <div class="intro__button-cell"><div><span class="intro__button-name">Safe confirmation</span><kayf-hold-button color="red" duration="900">Delete build</kayf-hold-button></div></div>
          </div>
        </section>

        <section class="intro__section">
          <div class="intro__section-head">
            <p class="intro__section-label">03 · Product inputs</p>
            <div><h2>Useful before they become beautiful.</h2><p class="intro__section-copy">Country-aware contact data, locale selection, and account access now share the same luminous field language while keeping browser autofill and native semantics intact.</p></div>
          </div>
          <div class="intro__product-lab">
            <div class="intro__product-stack">
              <div class="intro__product-copy"><span>International onboarding</span><h3>Less friction in familiar flows.</h3><p>Paste a calling code to detect the country, change locale without leaving the keyboard, and hand validated auth data to your own service.</p></div>
              <div class="intro__input-demo">
                <kayf-phone-input country="UA" value="+380671234567" label="Phone number" hint="Country detected from calling code" color="cyan"></kayf-phone-input>
                <div class="intro__language-row"><span class="intro__language-note">Interface<br/>preference</span><kayf-language-switcher value="en" color="violet"></kayf-language-switcher></div>
              </div>
            </div>
            <div class="intro__auth-demo"><kayf-auth-form mode="signin" color="violet" heading="Welcome back" description="Continue to your interface workspace." action-label="Continue"></kayf-auth-form></div>
          </div>
        </section>

        <section class="intro__section">
          <div class="intro__section-head">
            <p class="intro__section-label">04 · Principles</p>
            <div><h2>Visual character with product discipline.</h2><p class="intro__section-copy">Every effect has a job: clarify hierarchy, communicate state, or make spatial interaction easier to understand.</p></div>
          </div>
          <div class="intro__principles">
            <article class="intro__principle"><span class="intro__principle-index">01 / RESTRAINT</span><h3>Calm by default</h3><p>Resting states stay readable. Richer effects appear only when interaction gives them meaning.</p></article>
            <article class="intro__principle"><span class="intro__principle-index">02 / ACCESS</span><h3>Input inclusive</h3><p>Native semantics, visible focus, touch-safe behavior, and reduced-motion handling are part of the component.</p></article>
            <article class="intro__principle"><span class="intro__principle-index">03 / CONTROL</span><h3>Composable APIs</h3><p>Attributes, slots, parts, and events expose the useful decisions without leaking implementation detail.</p></article>
          </div>
        </section>

        <section class="intro__section">
          <div class="intro__section-head">
            <p class="intro__section-label">05 · Catalog</p>
            <div><h2>Every component, documented.</h2><p class="intro__section-copy">Open a component to inspect its controls, states, API table, source examples, and accessibility checks.</p></div>
          </div>
          ${groups.map(group => html`
            <div class="intro__group">
              <h3 class="intro__group-title">${group}</h3>
              <div class="intro__catalog">
                ${components.filter(component => component.group === group).map(component => html`
                  <article class="intro__component">
                    <strong>${component.name}</strong>
                    <p>${component.description}</p>
                    <code>&lt;${component.tag}&gt;</code>
                    <a href=${`/?path=/docs/${component.docs}`} target="_top" aria-label=${`Open ${component.name} documentation`}></a>
                  </article>
                `)}
              </div>
            </div>
          `)}
        </section>

        <footer class="intro__footer">
          <span>@kayf/ui · MIT licensed</span>
          <a href="https://github.com/vKAYFv/kayf-ui/issues" target="_blank" rel="noreferrer">Report an issue</a>
        </footer>
      </div>
    </main>
  `,
}
