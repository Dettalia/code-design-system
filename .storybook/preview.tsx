import React from 'react';
import type {Preview} from '@storybook/react-webpack5';
import {ThemeProvider} from '../src/theme';

const preview: Preview = {
  decorators: [
    Story => (
      <ThemeProvider>
        <Story />
      </ThemeProvider>
    ),
  ],
};

export default preview;
