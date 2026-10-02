import type {Meta, StoryObj} from '@storybook/react-vite';
import {expect} from 'storybook/test';
import {Alert} from '../index';

const meta = {
  component: Alert,
  tags: ['ai-generated'],
  args: {children: 'Summary ready to share.'},
} satisfies Meta<typeof Alert>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Success: Story = {
  args: {severity: 'success'},
  play: async ({canvas}) => {
    await expect(canvas.getByRole('alert')).toHaveTextContent('Summary ready to share.');
  },
};

export const Info: Story = {
  args: {severity: 'info', children: 'Recording starts when the host joins.'},
};

export const Warning: Story = {args: {severity: 'warning', children: 'Transcript is incomplete.'}};

export const Error: Story = {
  args: {severity: 'error', variant: 'filled', children: 'Upload failed.'},
};
