import type {Meta, StoryObj} from '@storybook/react-vite';
import {Stack, Typography, type TypographyProps} from '../index';

const meta: Meta<typeof Typography> = {
  title: 'MUI/Typography',
  component: Typography,
};

export default meta;

type Story = StoryObj<typeof Typography>;

// MUI's own variants, mapped to Figma text styles in style-dictionary/mui-mapping.mjs.
const muiVariants: TypographyProps['variant'][] = [
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'subtitle1',
  'subtitle2',
  'body1',
  'body2',
  'button',
  'caption',
];

// Every Figma text style is also its own variant (see src/theme/tokens.ts).
const bliroVariants: TypographyProps['variant'][] = [
  'bodyLargeRegular',
  'bodyNormalMedium',
  'bodySmallSemibold',
  'bodyXsmallBold',
  'bodyXxsmallRegular',
  'mobileNavBarSemibold',
];

export const MuiVariants: Story = {
  render: () => (
    <Stack spacing={2}>
      {muiVariants.map(variant => (
        <Typography key={variant} variant={variant} sx={{display: 'block'}}>
          {variant} — The quick brown fox jumps over the lazy dog
        </Typography>
      ))}
    </Stack>
  ),
};

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
