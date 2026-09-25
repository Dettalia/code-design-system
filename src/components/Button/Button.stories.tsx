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

// Types, ranked by visual weight (Main > Tonal > Outlined > Text > Text-Subtle)
export const Main: Story = {args: {variant: 'main', children: 'Main'}};
export const Tonal: Story = {args: {variant: 'tonal', children: 'Tonal'}};
export const Outlined: Story = {args: {variant: 'outlined', children: 'Outlined'}};
export const TextVariant: Story = {args: {variant: 'text', children: 'Text'}};
export const TextSubtle: Story = {args: {variant: 'textSubtle', children: 'Text-Subtle'}};

// Sizes — 40 is the default; 32 is compact, 48/56 are special-case emphasis sizes
export const Size32: Story = {args: {size: 32, children: 'Size 32'}};
export const Size40: Story = {args: {size: 40, children: 'Size 40'}};
export const Size48: Story = {args: {size: 48, children: 'Size 48'}};
export const Size56: Story = {args: {size: 56, children: 'Size 56'}};

// Color — Error is only defined for the Main type
export const ErrorColor: Story = {args: {variant: 'main', color: 'error', children: 'Delete'}};

export const Disabled: Story = {args: {disabled: true, children: 'Disabled'}};
export const FullWidth: Story = {args: {fullWidth: true, children: 'Full width'}};

// Hover/Pressed/Focused aren't separate props — they come from real
// interaction (mouse hover, press, keyboard focus). Try it directly on any
// story above: hover over it, click and hold, or Tab to it.
