import type {Meta, StoryObj} from '@storybook/react-vite';
import {expect} from 'storybook/test';
import {Typography} from '../index';

const meta = {
  component: Typography,
  tags: ['ai-generated'],
  args: {children: 'The quick brown fox jumps over the lazy dog'},
} satisfies Meta<typeof Typography>;

export default meta;
type Story = StoryObj<typeof meta>;

// h1 comes from the Figma text style Heading/H1 and must render a real <h1>.
export const Heading1: Story = {
  args: {variant: 'h1', children: 'Meeting summary'},
  play: async ({canvas}) => {
    await expect(canvas.getByRole('heading', {level: 1, name: 'Meeting summary'})).toBeVisible();
  },
};

export const Body1: Story = {args: {variant: 'body1'}};

// Every Figma text style is also its own variant.
export const FigmaStyleBodySmallSemibold: Story = {args: {variant: 'bodySmallSemibold'}};

export const Caption: Story = {args: {variant: 'caption', color: 'text.secondary'}};
