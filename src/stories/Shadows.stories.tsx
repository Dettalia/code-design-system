import type {Meta, StoryObj} from '@storybook/react-vite';
import {Paper, Stack, Typography, tokens} from '../index';

const meta: Meta = {
  title: 'Theme/Shadows',
};

export default meta;

type Story = StoryObj;

export const FigmaShadows: Story = {
  render: () => (
    <Stack direction="row" spacing={4} sx={{p: 4, flexWrap: 'wrap'}}>
      {Object.entries(tokens.shadow).map(([name, boxShadow]) => (
        <Paper key={name} sx={{width: 160, height: 100, p: 2, boxShadow}}>
          <Typography variant="bodySmallMedium">shadow.{name}</Typography>
        </Paper>
      ))}
    </Stack>
  ),
};
