import { defineMain } from '@storybook/web-components-vite/node';

export default defineMain({
  stories: ['../src/stories/**/*.stories.@(js|ts|mdx)'],
  addons: ['@storybook/addon-docs', '@storybook/addon-a11y'],
  framework: '@storybook/web-components-vite',
  docs: {
    autodocs: 'tag',
  },
});
