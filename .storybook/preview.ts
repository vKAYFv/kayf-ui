import { definePreview } from '@storybook/web-components-vite';
import '../src/index';
import './preview.css';
import kayfTheme from './kayf-theme';

export default definePreview({
  parameters: {
    layout: 'centered',
    backgrounds: {
      options: {
        midnight: { name: 'Midnight', value: '#07070a' },
        graphite: { name: 'Graphite', value: '#111116' },
        daylight: { name: 'Daylight', value: '#f4f4f5' },
      },
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
      expanded: true,
    },
    docs: {
      theme: kayfTheme,
    },
    options: {
      storySort: {
        order: ['Overview', 'Components'],
      },
    },
  },
  initialGlobals: {
    backgrounds: { value: 'midnight' },
  },
});
