import {alpha, type Components, type CSSObject, type Theme} from '@mui/material/styles';
import {tokens} from '../tokens';

// Matches the Figma component "Button_v2" (Bliro Design System, node 12265:4048).
//
//   Figma Type   -> MUI variant     Figma Size -> MUI size
//   Main         -> contained       32px       -> small
//   Tonal        -> tonal (new)     40px       -> medium
//   Outlined     -> outlined        48px       -> large
//   Text         -> text            56px       -> xlarge (new)
//   Text-Subtle  -> textSubtle (new)
//
// Figma Color Default/Error -> color primary/error (Error exists for Main
// only). States: Hover -> :hover, Pressed -> :active, Focused ->
// :focus-visible, Disabled -> disabled. Other MUI colors (secondary, info, ...)
// have no Figma design and keep MUI's styling.

declare module '@mui/material/Button' {
  interface ButtonPropsVariantOverrides {
    tonal: true;
    textSubtle: true;
  }
  interface ButtonPropsSizeOverrides {
    xlarge: true;
  }
}

/** Button variants in the Bliro theme (Figma types Main, Tonal, Outlined, Text, Text-Subtle). */
export type BliroButtonVariant = 'contained' | 'tonal' | 'outlined' | 'text' | 'textSubtle';
/** Button sizes in the Bliro theme (Figma 32, 40, 48, 56px). */
export type BliroButtonSize = 'small' | 'medium' | 'large' | 'xlarge';

const {color, spacing, radius, border} = tokens;
const ICON_SIZE = 20; // every size uses 20px icons in Figma

type Size = 'small' | 'medium' | 'large' | 'xlarge';

const sizes: Record<
  Size,
  {py: number; px: number; gap: number; typography: keyof Theme['typography']}
> = {
  small: {
    py: spacing.component.xxs,
    px: spacing['4'],
    gap: spacing['1'],
    typography: 'bodyXsmallSemibold',
  },
  medium: {
    py: spacing.component.sm,
    px: spacing.component.lg,
    gap: spacing['3'],
    typography: 'bodySmallSemibold',
  },
  large: {
    py: spacing.component.md,
    px: spacing.component.lg,
    gap: spacing['3'],
    typography: 'bodyNormalSemibold',
  },
  xlarge: {
    py: spacing.component.lg,
    px: spacing.component.xl,
    gap: spacing['3'],
    typography: 'bodyNormalSemibold',
  },
};

// Figma draws strokes inside the frame, so a bordered button is the same size
// as a borderless one. In CSS the border adds to the box, so bordered variants
// take it out of the padding.
function padding(size: Size, bordered: boolean, px = sizes[size].px) {
  const inset = bordered ? border.width.thin : 0;
  return `${sizes[size].py - inset}px ${px - inset}px`;
}

function focusRing(ringColor: string, extra: CSSObject = {}): CSSObject {
  return {
    '&.Mui-focusVisible': {
      outline: `${border.width.thick}px solid ${ringColor}`,
      outlineOffset: border.width.thick,
      ...extra,
    },
  };
}

// Focused Text and Text-Subtle buttons also get the outlined button's 1px
// stroke inside the ring. An inset shadow draws it without changing the size.
const textFocus = focusRing(color.button.outlined.border, {
  boxShadow: `inset 0 0 0 ${border.width.thin}px ${color.button.outlined.border}`,
  color: color.button.text['on-text'],
});

const disabled = (styles: CSSObject): CSSObject => ({
  '&.Mui-disabled': {color: color.text.disabled, ...styles},
});

const main = (bg: string, hover: string, pressed: string, ring: string): CSSObject => ({
  backgroundColor: bg,
  color: color.button.primary['on-primary'],
  '&:hover': {backgroundColor: hover},
  '&:active': {backgroundColor: pressed},
  ...focusRing(ring),
  ...disabled({backgroundColor: color.background.disabled}),
});

export const MuiButton: Components<Theme>['MuiButton'] = {
  defaultProps: {
    disableElevation: true,
    // Figma's pressed state is a solid color, not a ripple.
    disableRipple: true,
  },
  styleOverrides: {
    root: ({theme}) => ({
      textTransform: 'none',
      // Figma's label layer is whitespace-nowrap: labels never wrap, so every
      // size keeps its exact height.
      whiteSpace: 'nowrap',
      minWidth: 0,
      borderRadius: radius.button,
      boxShadow: 'none',
      '&:hover, &:active': {boxShadow: 'none'},
      '& .MuiButton-startIcon, & .MuiButton-endIcon': {marginLeft: 0, marginRight: 0},
      '& .MuiButton-icon > *:nth-of-type(1)': {fontSize: ICON_SIZE},
      variants: [
        // --- sizes (padding, gap, type style) ---
        ...(Object.keys(sizes) as Size[]).map(size => ({
          props: {size},
          style: {
            ...(theme.typography[sizes[size].typography] as CSSObject),
            gap: sizes[size].gap,
            padding: padding(size, false),
          },
        })),
        ...(Object.keys(sizes) as Size[]).flatMap(size => [
          {
            props: {size, variant: 'outlined' as const},
            style: {
              padding: padding(size, true, size === 'xlarge' ? spacing.component.lg : undefined),
            },
          },
          {props: {size, variant: 'tonal' as const}, style: {padding: padding(size, true)}},
          // Outlined and both Text types keep 16px side padding at 56px.
          ...(size === 'xlarge'
            ? [
                {
                  props: {size, variant: 'text' as const},
                  style: {padding: padding(size, false, spacing.component.lg)},
                },
                {
                  props: {size, variant: 'textSubtle' as const},
                  style: {padding: padding(size, false, spacing.component.lg)},
                },
              ]
            : []),
        ]),

        // --- Main ---
        {
          props: {variant: 'contained', color: 'primary'},
          style: main(
            color.button.primary.main,
            color.button.primary.hovered,
            color.button.primary.pressed,
            color.border.focus,
          ),
        },
        {
          props: {variant: 'contained', color: 'error'},
          style: main(
            color.error.default,
            color.error.text,
            color.error.text,
            alpha(color.error.default, 0.3),
          ),
        },

        // --- Tonal ---
        {
          props: {variant: 'tonal'},
          style: {
            backgroundColor: color.button.tonal.main,
            color: color.button.tonal['on-tonal'],
            border: `${border.width.thin}px solid ${color.border.focus}`,
            '&:hover': {backgroundColor: color.button.tonal.hover},
            '&:active': {backgroundColor: color.button.tonal.pressed},
            ...focusRing(color.border.focus),
            ...disabled({
              backgroundColor: color.background.disabled,
              borderColor: color.border.disabled,
            }),
          },
        },

        // --- Outlined ---
        {
          props: {variant: 'outlined', color: 'primary'},
          style: {
            color: color.button.outlined['on-outlined'],
            borderColor: color.button.outlined.border,
            '&:hover': {
              backgroundColor: color.button.outlined.hover,
              borderColor: color.button.outlined.border,
            },
            '&:active': {
              backgroundColor: color.button.outlined.pressed,
              borderColor: color.button.outlined['border-pressed'],
            },
            ...focusRing(color.button.outlined.border),
            // Figma's disabled outlined button is filled and has no stroke.
            ...disabled({backgroundColor: color.background.disabled, borderColor: 'transparent'}),
          },
        },

        // --- Text and Text-Subtle ---
        {
          props: {variant: 'text', color: 'primary'},
          style: {
            color: color.button.text['on-text'],
            '&:hover': {backgroundColor: color.button.text.hover},
            '&:active': {backgroundColor: color.button.text.pressed},
            ...textFocus,
            ...disabled({}),
          },
        },
        {
          props: {variant: 'textSubtle'},
          style: {
            color: color.text.disabled,
            '&:hover': {
              backgroundColor: color.button.text.hover,
              color: color.button.text['on-text'],
            },
            '&:active': {
              backgroundColor: color.button.text.pressed,
              color: color.button.text['on-text'],
            },
            ...textFocus,
            ...disabled({}),
          },
        },
      ],
    }),
  },
};
