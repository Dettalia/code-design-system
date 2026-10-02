import type {Meta, StoryObj} from '@storybook/react-vite';
import {expect, fn} from 'storybook/test';
import {Chip} from '../index';

const meta = {
  component: Chip,
  tags: ['ai-generated'],
  args: {label: 'Recording'},
} satisfies Meta<typeof Chip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Primary: Story = {args: {color: 'primary'}};

export const Outlined: Story = {args: {variant: 'outlined', color: 'success', label: 'Shared'}};

export const Deletable: Story = {
  args: {label: 'Anna Weber', onDelete: fn()},
  play: async ({canvas, userEvent, args}) => {
    // MUI's delete icon is a <svg data-testid="CancelIcon">.
    await userEvent.click(canvas.getByTestId('CancelIcon'));
    await expect(args.onDelete).toHaveBeenCalledTimes(1);
  },
};
