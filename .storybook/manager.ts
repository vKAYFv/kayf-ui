import { addons } from 'storybook/manager-api';
import kayfTheme from './kayf-theme';

addons.setConfig({
  theme: kayfTheme,
  layout: {
    panelPosition: 'bottom',
  },
});
