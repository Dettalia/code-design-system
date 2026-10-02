import type {Meta, StoryObj} from '@storybook/react-vite';
import {Button, Card, CardActions, CardContent, Typography} from '../index';

const content = (
  <CardContent>
    <Typography variant="h6">Discovery call — Acme</Typography>
    <Typography variant="body2" color="text.secondary">
      Budget confirmed for Q4. Next step: technical demo with IT.
    </Typography>
  </CardContent>
);

const meta = {
  component: Card,
  tags: ['ai-generated'],
  args: {children: content, sx: {maxWidth: 360}},
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Elevated: Story = {};

export const Outlined: Story = {args: {variant: 'outlined'}};

export const WithActions: Story = {
  args: {
    children: (
      <>
        {content}
        <CardActions>
          <Button size="small">Open</Button>
          <Button size="small">Share</Button>
        </CardActions>
      </>
    ),
  },
};
