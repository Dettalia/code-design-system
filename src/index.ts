// The full MUI component library, re-exported as-is. Components pick up the
// Bliro look from the theme applied by `ThemeProvider`, not from wrappers.
export * from '@mui/material';

// Bliro theme. Explicit named exports take precedence over the `export *`
// above, so `ThemeProvider`/`ThemeProviderProps` here are the Bliro ones.
export {
  ThemeProvider,
  type ThemeProviderProps,
  theme,
  themeOptions,
  tokens,
  type BliroTokens,
  type BliroButtonVariant,
  type BliroButtonSize,
} from './theme';
