import React from 'react';
import type {Preview} from '@storybook/react-vite';
import {createTheme} from '@mui/material/styles';
import {ThemeProvider, theme as bliroTheme} from '../src';

const themes = {
  bliro: bliroTheme,
  // For side-by-side comparison: what the components look like without Bliro's tokens.
  mui: createTheme(),
};

const preview: Preview = {
  globalTypes: {
    theme: {
      description: 'Theme applied to the stories',
      toolbar: {
        title: 'Theme',
        icon: 'paintbrush',
        items: [
          {value: 'bliro', title: 'Bliro theme'},
          {value: 'mui', title: 'MUI default'},
        ],
        dynamicTitle: true,
      },
    },
  },

  initialGlobals: {theme: 'bliro'},

  decorators: [
    (Story, context) => (
      <ThemeProvider theme={themes[context.globals.theme as keyof typeof themes] ?? bliroTheme}>
        <Story />
      </ThemeProvider>
    ),
  ],

  parameters: {
    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: 'todo',
    },
  },
};

export default preview;
