import type {Meta, StoryObj} from '../../storybook/types';
import {Badge} from './Badge';

const meta: Meta<typeof Badge> = {
  title: 'Components/Badge',
  component: Badge,
  args: {
    label: 'Badge',
  },
};

export default meta;

type Story = StoryObj<typeof Badge>;

export const Default: Story = {args: {color: 'default', label: 'Default'}};
export const Primary: Story = {args: {color: 'primary', label: 'Primary'}};
export const ErrorState: Story = {args: {color: 'error', label: 'Error'}};
export const Warning: Story = {args: {color: 'warning', label: 'Warning'}};
