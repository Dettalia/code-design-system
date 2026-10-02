import type {Meta, StoryObj} from '@storybook/react-vite';
import {createTheme} from '@mui/material/styles';
import {expect} from 'storybook/test';
import {Button, Stack, Typography} from '../index';
import {ThemeProvider} from './ThemeProvider';

const meta = {
  component: ThemeProvider,
  tags: ['ai-generated'],
  args: {
    children: (
      <Stack spacing={2} sx={{alignItems: 'flex-start'}}>
        <Typography variant="h4">Weekly sync</Typography>
        <Typography variant="body1">3 action items, 2 decisions.</Typography>
        <Button variant="contained">Share summary</Button>
      </Stack>
    ),
  },
} satisfies Meta<typeof ThemeProvider>;

export default meta;
type Story = StoryObj<typeof meta>;

export const BliroTheme: Story = {};

export const WithoutCssBaseline: Story = {args: {cssBaseline: false}};

// Passing `theme` replaces the Bliro theme for everything inside.
export const CustomTheme: Story = {
  args: {theme: createTheme({palette: {primary: {main: '#1a60e7'}}})},
  play: async ({canvas}) => {
    const button = canvas.getByRole('button', {name: /share summary/i});
    await expect(getComputedStyle(button).backgroundColor).toBe('rgb(26, 96, 231)');
  },
};
