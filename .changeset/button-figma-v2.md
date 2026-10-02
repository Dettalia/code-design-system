---
'@dettalia/design-system': minor
---

Button now matches the Figma component Button_v2 in every type, size and state.

- New variants: `variant="tonal"` (Figma Tonal) and `variant="textSubtle"` (Figma Text-Subtle). New size: `size="xlarge"` (56px). Sizes are now Figma's 32/40/48/56px (`small`/`medium`/`large`/`xlarge`), each with its Figma padding and text style.
- Hover, pressed, focus and disabled colors come from the `color.button.*` tokens. Focus is a 2px ring (`color.border.focus`); pressed is a solid color instead of MUI's ripple.
- **Visual change:** `outlined` and `text` buttons with `color="primary"` now use dark text and a grey border (Figma Outlined/Text) instead of orange.
- Exports `BliroButtonVariant` and `BliroButtonSize` types.
