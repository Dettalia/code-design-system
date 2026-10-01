import type {Meta, StoryObj} from '@storybook/react-vite';
import {Stack, Typography, type TypographyProps} from '../index';

const meta: Meta<typeof Typography> = {
  title: 'MUI/Typography',
  component: Typography,
};

export default meta;

type Story = StoryObj<typeof Typography>;

// Custom variants generated from the Figma text styles (see src/theme/tokens.ts).
const bliroVariants: TypographyProps['variant'][] = [
  'subheadingSubheading2',
  'bodySmallSemibold',
  'bodySmallMedium',
  'bodySmallRegular',
  'bodyXsmallRegular',
  'bodyXxsmallRegular',
];

export const BliroVariants: Story = {
  render: () => (
    <Stack spacing={2}>
      {bliroVariants.map(variant => (
        <Typography key={variant} variant={variant} sx={{display: 'block'}}>
          {variant} — The quick brown fox jumps over the lazy dog
        </Typography>
      ))}
    </Stack>
  ),
};
