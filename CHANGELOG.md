# @dettalia/design-system

## 0.2.0

### Minor Changes

- [#4](https://github.com/Dettalia/code-design-system/pull/4) [`02f266b`](https://github.com/Dettalia/code-design-system/commit/02f266b244d9b22f520936589c94a3109f5cda8f) Thanks [@Dettalia](https://github.com/Dettalia)! - Button now matches the Figma component Button_v2 in every type, size and state.

  - New variants: `variant="tonal"` (Figma Tonal) and `variant="textSubtle"` (Figma Text-Subtle). New size: `size="xlarge"` (56px). Sizes are now Figma's 32/40/48/56px (`small`/`medium`/`large`/`xlarge`), each with its Figma padding and text style.
  - Hover, pressed, focus and disabled colors come from the `color.button.*` tokens. Focus is a 2px ring (`color.border.focus`); pressed is a solid color instead of MUI's ripple.
  - **Visual change:** `outlined` and `text` buttons with `color="primary"` now use dark text and a grey border (Figma Outlined/Text) instead of orange.
  - Exports `BliroButtonVariant` and `BliroButtonSize` types.

- [#4](https://github.com/Dettalia/code-design-system/pull/4) [`8499962`](https://github.com/Dettalia/code-design-system/commit/849996253a2cd597819df23e9af3b0585a24e27c) Thanks [@Dettalia](https://github.com/Dettalia)! - `Dialog` now matches the Figma Modal component: 480px wide, 16px corners (`radius.2xl`, as in Figma, instead of `radius.modal`), the "Shadow - modal" shadow, a 16px header (`DialogTitle`) with a divider below it, 24px content padding with 16px between items (`DialogContent`), and a 16px footer with buttons 8px apart (`DialogActions`).

- [#4](https://github.com/Dettalia/code-design-system/pull/4) [`4d25a85`](https://github.com/Dettalia/code-design-system/commit/4d25a859e778c517f4c860dbd2c5828492c11fbc) Thanks [@Dettalia](https://github.com/Dettalia)! - **Breaking:** the theme is now generated from the complete Figma token set, exported by the new `/sync-figma-tokens` process.

  - `tokens` now holds every Figma token: `color` (primitive ramps and semantic roles), `spacing`, `radius`, `border`, `font` and `shadow`. `tokens.colors` is renamed to `tokens.color`.
  - MUI's own variants (`h1`–`h6`, `subtitle1/2`, `body1/2`, `button`, `caption`) now use the Figma text styles, and all 38 Figma text styles are available as Typography variants (e.g. `bodyLargeMedium`, `headingH1`).
  - Letter spacing is fixed: Figma's `-2%` is now `-0.02em` (it was previously applied as `-1px`). Font sizes are in `rem`.
  - Palette adds `success`, `info`, `warning`, `background.default`, `divider`, `grey` and disabled states. `action.active` is no longer orange, so default icons aren't tinted.
  - MUI elevations use the Figma shadows. Cards, inputs, chips and dialogs use the semantic radius tokens.

- [#3](https://github.com/Dettalia/code-design-system/pull/3) [`8a69e2c`](https://github.com/Dettalia/code-design-system/commit/8a69e2c6f4f671108030f5929de375328455ebfd) Thanks [@Dettalia](https://github.com/Dettalia)! - **Breaking:** the package is now web-only and built on MUI instead of custom React Native components.

  - Re-exports all of `@mui/material`. The custom `Button`, `Text`, `TextInput`, `Card` and `Badge` are removed; use MUI's `Button`, `Typography`, `TextField`, `Card` and `Chip` instead.
  - `ThemeProvider` now wraps MUI's `ThemeProvider` (plus `CssBaseline`) and applies the Bliro theme generated from Figma tokens. New exports: `theme`, `themeOptions`, `tokens`.
  - Figma text styles are available as Typography variants (e.g. `variant="bodySmallSemibold"`), and raw token scales as `theme.tokens`.
  - New peer dependencies: `@mui/material`, `@emotion/react`, `@emotion/styled`, `react-dom`. `react-native` is no longer a peer dependency.

### Patch Changes

- [#4](https://github.com/Dettalia/code-design-system/pull/4) [`8499962`](https://github.com/Dettalia/code-design-system/commit/849996253a2cd597819df23e9af3b0585a24e27c) Thanks [@Dettalia](https://github.com/Dettalia)! - Button labels no longer wrap onto two lines (Figma's label is `whitespace-nowrap`), so buttons keep their exact Figma height in narrow layouts.

- [#4](https://github.com/Dettalia/code-design-system/pull/4) [`02f266b`](https://github.com/Dettalia/code-design-system/commit/02f266b244d9b22f520936589c94a3109f5cda8f) Thanks [@Dettalia](https://github.com/Dettalia)! - Buttons now have an 8px corner radius: the Figma token `radius/button` points to `radius/lg` (8px) instead of `radius/sm` (4px). MUI's default corner radius (`theme.shape.borderRadius`) is now mapped to `radius.sm`, so it stays 4px and only buttons change.

- [#4](https://github.com/Dettalia/code-design-system/pull/4) [`8499962`](https://github.com/Dettalia/code-design-system/commit/849996253a2cd597819df23e9af3b0585a24e27c) Thanks [@Dettalia](https://github.com/Dettalia)! - Cards now have a 16px corner radius (`radius.2xl`). This is a code-only decision: Figma's `radius/card` token is still 8px.
