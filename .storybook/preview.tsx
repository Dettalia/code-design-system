import React from 'react';
import type {Preview} from '@storybook/react-vite';
import {ThemeProvider} from '../src';

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
