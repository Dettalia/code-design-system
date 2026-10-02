// Which Figma token feeds which MUI theme slot. This file is the one place to
// edit when a design decision changes how tokens map onto MUI. Values are
// token paths in tokens/figma-export.json; the build fails if a path doesn't
// exist, so a rename in Figma can't silently drop a theme value.
//
// Rule of thumb: map a slot only when a Figma token clearly means the same
// thing. Unmapped slots keep MUI's defaults, and every token is still reachable
// through `theme.tokens` / `tokens`.

export const palette = {
  primary: {
    main: 'color.button.primary.main',
    // MUI uses `dark` for the contained button's hover background.
    dark: 'color.button.primary.hovered',
    contrastText: 'color.button.primary.on-primary',
  },
  // Only `main` is mapped for status colors: the Figma `subtle`/`text` roles
  // (tinted background, text on it) aren't MUI's `light`/`dark` shades.
  error: {main: 'color.error.default'},
  warning: {main: 'color.warning.default'},
  info: {main: 'color.info.default'},
  success: {main: 'color.success.default'},
  text: {
    primary: 'color.text.primary',
    secondary: 'color.text.secondary',
    disabled: 'color.text.disabled',
  },
  background: {
    default: 'color.background.page',
    paper: 'color.background.surface',
  },
  divider: 'color.border.default',
  action: {
    hover: 'color.action.hover',
    selected: 'color.action.active-bg',
    disabled: 'color.text.disabled',
    disabledBackground: 'color.background.disabled',
    // Not mapped: `active`. MUI uses it as the default icon color (IconButton,
    // ListItemIcon), so the orange `action.active-icon` would tint every icon.
  },
  common: {white: 'color.neutral.0'},
  // MUI's grey scale shares keys with the Figma neutral ramp where both exist.
  grey: {
    50: 'color.neutral.50',
    100: 'color.neutral.100',
    200: 'color.neutral.200',
    400: 'color.neutral.400',
    600: 'color.neutral.600',
    800: 'color.neutral.800',
    900: 'color.neutral.900',
  },
};

// MUI's default corner radius, used by components without their own radius
// token (Alert, Menu, Tooltip, ...) and by `borderRadius: 1` in `sx`. Buttons
// use radius.button via src/theme/components/button.ts.
export const shape = {
  borderRadius: 'radius.sm',
};

// MUI typography variant -> Figma text style. Every Figma text style is also
// generated as its own variant (e.g. `bodySmallSemibold`), mapped or not.
// `overline` is left at MUI's default: no Figma style matches it.
export const typography = {
  h1: 'typography.heading.h1',
  h2: 'typography.heading.h2',
  h3: 'typography.heading.h3',
  h4: 'typography.heading.h4',
  h5: 'typography.subheading.subheading-1',
  h6: 'typography.subheading.subheading-2',
  subtitle1: 'typography.subheading.subheading-3',
  subtitle2: 'typography.subheading.subheading-4',
  body1: 'typography.body.normal.regular',
  body2: 'typography.body.small.regular',
  button: 'typography.body.small.semibold',
  caption: 'typography.body.xsmall.regular',
};

// MUI elevation (0-24) -> Figma shadow. An elevation without an entry reuses
// the closest lower mapped one; 0 is always "none". MUI components pick their
// own elevation: Card/Paper 1, AppBar 4, Menu/Popover 8, Drawer 16, Dialog 24.
export const shadows = {
  1: 'shadow.1',
  2: 'shadow.2',
  8: 'shadow.modal',
};
