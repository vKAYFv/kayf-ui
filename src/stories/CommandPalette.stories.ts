import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import type { CommandItem } from '../components/CommandPalette/CommandPalette';

const meta: Meta = {
  title: 'Components/CommandPalette',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Full-screen command palette triggered by `Cmd+K` (or `Ctrl+K`). Supports grouped items, keyboard navigation, shortcuts display, and fuzzy search.',
      },
    },
  },
};
export default meta;

type Story = StoryObj;

const defaultItems: CommandItem[] = [
  // Navigation
  { id: 'home',       group: 'Navigation', icon: '⌂', label: 'Go to Home',        description: 'Navigate to dashboard',    shortcut: '⌘+1' },
  { id: 'components', group: 'Navigation', icon: '◈', label: 'Browse Components',  description: 'View all UI components' },
  { id: 'docs',       group: 'Navigation', icon: '◇', label: 'Documentation',      description: 'Read the full docs',       shortcut: '⌘+D' },
  { id: 'changelog',  group: 'Navigation', icon: '◉', label: 'Changelog',          description: 'What\'s new in @kayf/ui' },
  // Actions
  { id: 'copy-npm',   group: 'Actions',    icon: '⎘',  label: 'Copy npm install',   description: 'npm install @kayf/ui',    shortcut: '⌘+C' },
  { id: 'github',     group: 'Actions',    icon: '◑',  label: 'Open on GitHub',     description: 'View source code' },
  { id: 'npmjs',      group: 'Actions',    icon: '◐',  label: 'View on npmjs',      description: 'Package registry page' },
  // Theme
  { id: 'dark',       group: 'Theme',      icon: '◕',  label: 'Dark Mode',          description: 'Switch to dark theme' },
  { id: 'light',      group: 'Theme',      icon: '○',  label: 'Light Mode',         description: 'Switch to light theme' },
];

export const Default: Story = {
  render: () => html`
    <div style="
      min-height: 100vh;
      background: #050508;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      gap: 20px;
      font-family: 'Segoe UI', system-ui, sans-serif;
    ">
      <p style="color:rgba(232,232,240,0.4); font-size:14px;">Press <kbd style="background:rgba(255,255,255,0.08); border:1px solid rgba(255,255,255,0.12); padding:3px 8px; border-radius:6px; font-family:monospace; color:#e8e8f0;">⌘K</kbd> to open</p>
      <button
        onclick="document.querySelector('kayf-command-palette').open()"
        style="
          padding: 12px 28px;
          background: rgba(99,102,241,0.15);
          border: 1px solid rgba(99,102,241,0.3);
          border-radius: 100px;
          color: #6366f1;
          font-family: inherit;
          font-size: 14px;
          cursor: pointer;
        "
      >Open Palette</button>

      <kayf-command-palette
        placeholder="Search commands, components, docs..."
        hotkey="k"
        id="cp-demo"
      ></kayf-command-palette>

      <script>
        (function() {
          const cp = document.getElementById('cp-demo');
          if (cp && cp.setItems) {
            cp.setItems(${JSON.stringify(defaultItems)});
          } else {
            // retry after custom element upgrades
            customElements.whenDefined('kayf-command-palette').then(() => {
              const el = document.getElementById('cp-demo');
              el.setItems(${JSON.stringify(defaultItems)});
            });
          }
        })();
      </script>
    </div>
  `,
};

export const WithActions: Story = {
  render: () => html`
    <div style="min-height:100vh; background:#050508; display:flex; align-items:center; justify-content:center; flex-direction:column; gap:16px; font-family:'Segoe UI',sans-serif;">
      <div id="action-log" style="color:rgba(232,232,240,0.4); font-size:13px; font-family:'Courier New',monospace; min-height:20px;">
        Waiting for selection...
      </div>
      <button
        onclick="document.getElementById('cp-actions').open()"
        style="padding:12px 28px; background:rgba(6,182,212,0.15); border:1px solid rgba(6,182,212,0.3); border-radius:100px; color:#06b6d4; font-family:inherit; font-size:14px; cursor:pointer;"
      >Open (with actions)</button>

      <kayf-command-palette id="cp-actions" placeholder="Run a command..."></kayf-command-palette>

      <script>
        customElements.whenDefined('kayf-command-palette').then(() => {
          const cp = document.getElementById('cp-actions');
          const log = document.getElementById('action-log');
          const items = [
            { id: '1', icon: '◈', label: 'Copy to clipboard', group: 'Actions', action: () => { log.textContent = '✓ Copied to clipboard!'; } },
            { id: '2', icon: '◇', label: 'Download assets',   group: 'Actions', action: () => { log.textContent = '✓ Downloading...'; } },
            { id: '3', icon: '◉', label: 'Clear cache',       group: 'Actions', action: () => { log.textContent = '✓ Cache cleared'; } },
          ];
          cp.setItems(items);
          cp.addEventListener('kayf-select', e => {
            log.textContent = 'Selected: ' + e.detail.label;
          });
        });
      </script>
    </div>
  `,
};
