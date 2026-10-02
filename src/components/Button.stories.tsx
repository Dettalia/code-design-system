import React from 'react';
import type {Meta, StoryObj} from '@storybook/react-vite';
import {expect, fn} from 'storybook/test';
import {Box, Button, SvgIcon, Typography, type ButtonProps, type SvgIconProps} from '../index';

const ArrowLeft = (props: SvgIconProps) => (
  <SvgIcon {...props}>
    <path d="M20 11H7.8l5.6-5.6L12 4l-8 8 8 8 1.4-1.4L7.8 13H20z" />
  </SvgIcon>
);
const ArrowRight = (props: SvgIconProps) => (
  <SvgIcon {...props}>
    <path d="M4 11h12.2l-5.6-5.6L12 4l8 8-8 8-1.4-1.4 5.6-5.6H4z" />
  </SvgIcon>
);

const meta = {
  component: Button,
  tags: ['ai-generated'],
  args: {children: 'Label', onClick: fn()},
  argTypes: {
    variant: {control: 'select', options: ['contained', 'tonal', 'outlined', 'text', 'textSubtle']},
    size: {control: 'select', options: ['small', 'medium', 'large', 'xlarge']},
    color: {control: 'select', options: ['primary', 'error']},
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

// Figma: Type=Main
export const Contained: Story = {
  args: {variant: 'contained'},
  play: async ({canvas, userEvent, args}) => {
    await userEvent.click(canvas.getByRole('button', {name: 'Label'}));
    await expect(args.onClick).toHaveBeenCalledTimes(1);
  },
};

// Figma: Type=Main, Color=Error
export const ContainedError: Story = {args: {variant: 'contained', color: 'error'}};

// Figma: Type=Tonal
export const Tonal: Story = {args: {variant: 'tonal'}};

// Figma: Type=Outlined
export const Outlined: Story = {args: {variant: 'outlined'}};

// Figma: Type=Text
export const Text: Story = {args: {variant: 'text'}};

// Figma: Type=Text-Subtle
export const TextSubtle: Story = {args: {variant: 'textSubtle'}};

export const WithIcons: Story = {
  args: {variant: 'contained', startIcon: <ArrowLeft />, endIcon: <ArrowRight />},
};

export const Disabled: Story = {args: {variant: 'contained', disabled: true}};

// Proves the Bliro theme reached the component: palette.primary.main comes
// from the Figma token color.button.primary.main (#f26835), see
// style-dictionary/mui-mapping.mjs.
export const CssCheck: Story = {
  args: {variant: 'contained', children: 'Submit'},
  play: async ({canvas}) => {
    const button = canvas.getByRole('button', {name: /submit/i});
    await expect(getComputedStyle(button).backgroundColor).toBe('rgb(242, 104, 53)');
  },
};

// --- The Figma component sheet: every type x size x state ---------------------

const TYPES: {label: string; variant: ButtonProps['variant']; color?: ButtonProps['color']}[] = [
  {label: 'Main', variant: 'contained'},
  {label: 'Tonal', variant: 'tonal'},
  {label: 'Outlined', variant: 'outlined'},
  {label: 'Text', variant: 'text'},
  {label: 'Text-Subtle', variant: 'textSubtle'},
  {label: 'Main · Error', variant: 'contained', color: 'error'},
];
const SIZES: {label: string; size: ButtonProps['size']}[] = [
  {label: '56', size: 'xlarge'},
  {label: '48', size: 'large'},
  {label: '40', size: 'medium'},
  {label: '32', size: 'small'},
];
const STATES = ['Default', 'Hover', 'Focused', 'Pressed', 'Disabled'] as const;

export const FigmaSheet: Story = {
  name: 'Figma sheet (all states)',
  parameters: {
    layout: 'padded',
    // storybook-addon-pseudo-states forces :hover / :active on these rows.
    pseudo: {
      hover: ['.state-hover .MuiButton-root'],
      active: ['.state-pressed .MuiButton-root'],
    },
  },
  render: () => (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: `90px repeat(${TYPES.length * SIZES.length}, auto)`,
        gap: 1.5,
        alignItems: 'center',
        justifyItems: 'start',
      }}
    >
      <Box />
      {TYPES.map(type => (
        <Typography key={type.label} variant="bodyXsmallSemibold" sx={{gridColumn: 'span 4'}}>
          {type.label}
        </Typography>
      ))}
      <Box />
      {TYPES.flatMap(type =>
        SIZES.map(size => (
          <Typography
            key={type.label + size.label}
            variant="bodyXxsmallRegular"
            color="textSecondary"
          >
            {size.label}px
          </Typography>
        )),
      )}
      {STATES.map(state => (
        <React.Fragment key={state}>
          <Typography variant="bodyXsmallSemibold">{state}</Typography>
          {TYPES.flatMap(type =>
            SIZES.map(size => (
              <Box
                key={state + type.label + size.label}
                className={`state-${state.toLowerCase()}`}
                sx={{p: 0.5}}
              >
                <Button
                  variant={type.variant}
                  color={type.color}
                  size={size.size}
                  disabled={state === 'Disabled'}
                  className={state === 'Focused' ? 'Mui-focusVisible' : undefined}
                  data-testid={`${type.label}-${size.label}-${state}`}
                >
                  Label
                </Button>
              </Box>
            )),
          )}
        </React.Fragment>
      ))}
    </Box>
  ),
  // Each Figma size is an exact height, and every button uses radius.button
  // (8px, Figma radius/button -> radius/lg), for every type.
  play: async ({canvas}) => {
    const heights = {'56': 56, '48': 48, '40': 40, '32': 32};
    for (const type of TYPES) {
      for (const [label, height] of Object.entries(heights)) {
        const button = canvas.getByTestId(`${type.label}-${label}-Default`);
        await expect(button.getBoundingClientRect().height).toBe(height);
        await expect(getComputedStyle(button).borderRadius).toBe('8px');
      }
    }
  },
};
