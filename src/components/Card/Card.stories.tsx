import type {Meta, StoryObj} from '../../storybook/types';
import {Text} from '../Text';
import {Card} from './Card';

const meta: Meta<typeof Card> = {
  title: 'Components/Card',
  component: Card,
  args: {
    children: <Text>Card content</Text>,
  },
};

export default meta;

type Story = StoryObj<typeof Card>;

export const Elevation: Story = {args: {variant: 'elevation'}};
export const Outlined: Story = {args: {variant: 'outlined'}};

export const PaddingNone: Story = {args: {padding: 'none'}};
export const PaddingSmall: Story = {args: {padding: 'sm'}};
export const PaddingLarge: Story = {args: {padding: 'lg'}};
