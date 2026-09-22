import type {Meta, StoryObj} from '../../storybook/types';
import {Button} from './Button';

const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
  args: {
    children: 'Button',
  },
};

export default meta;

type Story = StoryObj<typeof Button>;

export const Primary: Story = {args: {variant: 'primary', children: 'Primary'}};
export const Secondary: Story = {args: {variant: 'secondary', children: 'Secondary'}};
export const Ghost: Story = {args: {variant: 'ghost', children: 'Ghost'}};

export const Small: Story = {args: {size: 'sm', children: 'Small'}};
export const Medium: Story = {args: {size: 'md', children: 'Medium'}};
export const Large: Story = {args: {size: 'lg', children: 'Large'}};

export const Disabled: Story = {args: {disabled: true, children: 'Disabled'}};
export const FullWidth: Story = {args: {fullWidth: true, children: 'Full width'}};
