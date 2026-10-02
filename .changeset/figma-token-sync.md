---
'@dettalia/design-system': minor
---

**Breaking:** the theme is now generated from the complete Figma token set, exported by the new `/sync-figma-tokens` process.

- `tokens` now holds every Figma token: `color` (primitive ramps and semantic roles), `spacing`, `radius`, `border`, `font` and `shadow`. `tokens.colors` is renamed to `tokens.color`.
- MUI's own variants (`h1`–`h6`, `subtitle1/2`, `body1/2`, `button`, `caption`) now use the Figma text styles, and all 38 Figma text styles are available as Typography variants (e.g. `bodyLargeMedium`, `headingH1`).
- Letter spacing is fixed: Figma's `-2%` is now `-0.02em` (it was previously applied as `-1px`). Font sizes are in `rem`.
- Palette adds `success`, `info`, `warning`, `background.default`, `divider`, `grey` and disabled states. `action.active` is no longer orange, so default icons aren't tinted.
- MUI elevations use the Figma shadows. Cards, inputs, chips and dialogs use the semantic radius tokens.
