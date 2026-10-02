import type {Meta, StoryObj} from '@storybook/react-vite';
import {Button, Card, CardActions, CardContent, Chip, Stack, Typography} from '../index';

const meta: Meta = {
  title: 'MUI/Surfaces',
};

export default meta;

type Story = StoryObj;

export const CardElevated: Story = {
  render: () => (
    <Card sx={{maxWidth: 360}}>
      <CardContent>
        <Typography variant="subheadingSubheading2">Card title</Typography>
        <Typography variant="bodySmallRegular" color="text.secondary">
          Cards use the radius.card token.
        </Typography>
      </CardContent>
      <CardActions>
        <Button>Action</Button>
      </CardActions>
    </Card>
  ),
};

export const CardOutlined: Story = {
  render: () => (
    <Card variant="outlined" sx={{maxWidth: 360}}>
      <CardContent>
        <Typography variant="bodySmallRegular">Outlined card</Typography>
      </CardContent>
    </Card>
  ),
};

export const Chips: Story = {
  render: () => (
    <Stack direction="row" spacing={1}>
      <Chip label="Default" />
      <Chip label="Primary" color="primary" />
      <Chip label="Error" color="error" />
      <Chip label="Outlined" variant="outlined" />
    </Stack>
  ),
};
