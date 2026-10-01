---
'@dettalia/design-system': minor
---

**Breaking:** the package is now web-only and built on MUI instead of custom React Native components.

- Re-exports all of `@mui/material`. The custom `Button`, `Text`, `TextInput`, `Card` and `Badge` are removed; use MUI's `Button`, `Typography`, `TextField`, `Card` and `Chip` instead.
- `ThemeProvider` now wraps MUI's `ThemeProvider` (plus `CssBaseline`) and applies the Bliro theme generated from Figma tokens. New exports: `theme`, `themeOptions`, `tokens`.
- Figma text styles are available as Typography variants (e.g. `variant="bodySmallSemibold"`), and raw token scales as `theme.tokens`.
- New peer dependencies: `@mui/material`, `@emotion/react`, `@emotion/styled`, `react-dom`. `react-native` is no longer a peer dependency.
