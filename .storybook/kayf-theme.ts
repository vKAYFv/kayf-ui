import { create } from 'storybook/theming/create';

const kayfTheme = create({
  base: 'dark',
  brandTitle: '@kayf/ui',
  brandUrl: 'https://github.com/vKAYFv/kayf-ui',
  brandTarget: '_blank',
  colorPrimary: '#7c6cff',
  colorSecondary: '#64d8f4',
  appBg: '#07070a',
  appContentBg: '#0c0c11',
  appPreviewBg: '#07070a',
  appBorderColor: 'rgba(255, 255, 255, 0.08)',
  appBorderRadius: 12,
  fontBase: 'Inter, ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  fontCode: '"SFMono-Regular", Consolas, "Liberation Mono", monospace',
  textColor: '#f4f4f7',
  textInverseColor: '#09090b',
  barBg: '#0c0c11',
  barSelectedColor: '#8b7cff',
  barHoverColor: '#b4aaff',
  barTextColor: '#a1a1aa',
  inputBg: '#111118',
  inputBorder: 'rgba(255, 255, 255, 0.1)',
  inputTextColor: '#f4f4f7',
  inputBorderRadius: 8,
});

export default kayfTheme;
