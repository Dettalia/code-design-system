import type {Meta, StoryObj} from '@storybook/react-vite';
import {TextField} from '../index';

const meta: Meta<typeof TextField> = {
  title: 'MUI/TextField',
  component: TextField,
  args: {label: 'Label', placeholder: 'Placeholder'},
};

export default meta;

type Story = StoryObj<typeof TextField>;

export const Default: Story = {};
export const WithHelperText: Story = {args: {helperText: 'Helper text'}};
export const Error: Story = {args: {error: true, helperText: 'Something went wrong'}};
export const Small: Story = {args: {size: 'small'}};
export const Disabled: Story = {args: {disabled: true}};
export const FullWidth: Story = {args: {fullWidth: true}};
