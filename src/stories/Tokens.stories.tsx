import type {Meta, StoryObj} from '@storybook/react-vite';
import {Box, Stack, Typography, tokens} from '../index';

const meta: Meta = {
  title: 'Theme/Tokens',
};

export default meta;

type Story = StoryObj;

type ColorTree = {[key: string]: string | ColorTree};

function flatten(tree: ColorTree, prefix: string[] = []): [string, string][] {
  return Object.entries(tree).flatMap(([key, value]) =>
    typeof value === 'string'
      ? [[[...prefix, key].join('.'), value]]
      : flatten(value, [...prefix, key]),
  );
}

export const Colors: Story = {
  render: () => (
    <Stack spacing={1}>
      {flatten(tokens.colors).map(([name, value]) => (
        <Stack key={name} direction="row" spacing={2} sx={{alignItems: 'center'}}>
          <Box
            sx={{
              width: 40,
              height: 40,
              bgcolor: value,
              borderRadius: 1,
              border: 1,
              borderColor: 'divider',
            }}
          />
          <Typography variant="bodySmallRegular">
            {name} — {value}
          </Typography>
        </Stack>
      ))}
    </Stack>
  ),
};
