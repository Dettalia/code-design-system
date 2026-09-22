import type {Meta, StoryObj} from '../../storybook/types';
import {TextInput} from './TextInput';

const meta: Meta<typeof TextInput> = {
  title: 'Components/TextInput',
  component: TextInput,
  args: {
    placeholder: 'Placeholder',
  },
};

export default meta;

type Story = StoryObj<typeof TextInput>;

export const Default: Story = {args: {}};

export const WithLabelAndHelper: Story = {
  args: {label: 'Email', helperText: "We'll never share your email."},
};

export const ErrorState: Story = {
  args: {label: 'Email', error: true, helperText: 'Enter a valid email address.'},
};

export const Disabled: Story = {
  args: {label: 'Email', disabled: true, value: 'disabled@example.com'},
};

export const FullWidth: Story = {args: {label: 'Email', fullWidth: true}};

export const Small: Story = {args: {size: 'sm', label: 'Small'}};
export const Medium: Story = {args: {size: 'md', label: 'Medium'}};
export const Large: Story = {args: {size: 'lg', label: 'Large'}};
