import type {Meta, StoryObj} from '../../storybook/types';
import {Text} from './Text';

const meta: Meta<typeof Text> = {
  title: 'Components/Text',
  component: Text,
  args: {
    children: 'The quick brown fox jumps over the lazy dog',
  },
};

export default meta;

type Story = StoryObj<typeof Text>;

export const Display: Story = {args: {variant: 'display'}};
export const Heading: Story = {args: {variant: 'heading'}};
export const Body: Story = {args: {variant: 'body'}};
export const Caption: Story = {args: {variant: 'caption'}};

export const ColorSecondary: Story = {args: {color: 'secondary'}};
export const ColorDisabled: Story = {args: {color: 'disabled'}};

export const AlignCenter: Story = {args: {align: 'center'}};
export const AlignRight: Story = {args: {align: 'right'}};
