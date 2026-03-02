import type { Preview } from '@storybook/web-components';
import '../src/index';

const preview: Preview = {
  parameters: {
    backgrounds: {
      default: 'kayf-dark',
      values: [
        { name: 'kayf-dark',  value: '#050508' },
        { name: 'kayf-mid',   value: '#0a0a14' },
        { name: 'light',      value: '#f8f8f8' },
      ],
    },
    layout: 'centered',
    docs: {
      theme: {
        base: 'dark',
        brandTitle: '@kayf/ui',
        brandUrl: 'https://www.npmjs.com/package/@kayf/ui',
        colorPrimary: '#6366f1',
        colorSecondary: '#06b6d4',
        appBg: '#050508',
        appContentBg: '#080810',
        appBorderColor: 'rgba(255,255,255,0.08)',
        appBorderRadius: 12,
        fontBase: "'Segoe UI', system-ui, sans-serif",
        fontCode: "'Courier New', monospace",
        textColor: '#e8e8f0',
        textInverseColor: '#050508',
        barBg: '#080810',
        barSelectedColor: '#6366f1',
        barTextColor: 'rgba(232,232,240,0.5)',
        inputBg: '#0d0d18',
        inputBorder: 'rgba(255,255,255,0.08)',
        inputTextColor: '#e8e8f0',
        inputBorderRadius: 8,
      },
    },
  },
  globalTypes: {
    theme: {
      name: 'Theme',
      defaultValue: 'dark',
      toolbar: {
        icon: 'circlehollow',
        items: ['dark', 'light'],
        showName: true,
      },
    },
  },
};

export default preview;
