import type {Meta, StoryObj} from '@storybook/react-vite';
import {Button} from '../index';

const meta: Meta<typeof Button> = {
  title: 'MUI/Button',
  component: Button,
  args: {children: 'Button'},
};

export default meta;

type Story = StoryObj<typeof Button>;

export const Contained: Story = {args: {variant: 'contained'}};
export const Outlined: Story = {args: {variant: 'outlined'}};
export const Text: Story = {args: {variant: 'text'}};
export const Small: Story = {args: {variant: 'contained', size: 'small'}};
export const Large: Story = {args: {variant: 'contained', size: 'large'}};
export const Disabled: Story = {args: {variant: 'contained', disabled: true}};
export const FullWidth: Story = {args: {variant: 'contained', fullWidth: true}};
