import type {Meta, StoryObj} from '@storybook/react-vite';
import {expect} from 'storybook/test';
import {TextField} from '../index';

const meta = {
  component: TextField,
  tags: ['ai-generated'],
  args: {label: 'Meeting title', placeholder: 'Weekly sync'},
} satisfies Meta<typeof TextField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Outlined: Story = {
  play: async ({canvas, userEvent}) => {
    const input = canvas.getByLabelText('Meeting title');
    await userEvent.type(input, 'Discovery call');
    await expect(input).toHaveValue('Discovery call');
  },
};

export const WithHelperText: Story = {args: {helperText: 'Shown to attendees'}};

export const Error: Story = {
  args: {
    label: 'Email',
    error: true,
    defaultValue: 'not-an-email',
    helperText: 'Enter a valid email',
  },
};

export const Disabled: Story = {args: {disabled: true, defaultValue: 'Read only'}};

export const Small: Story = {args: {size: 'small'}};

export const Multiline: Story = {args: {label: 'Notes', multiline: true, minRows: 3}};
