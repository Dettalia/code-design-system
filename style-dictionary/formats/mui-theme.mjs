import {walk, serialize, fileHeader, pathToCamel} from '../utils.mjs';

// Flattens the typography tree into MUI custom variant entries, e.g.
// typography.body.small.semibold -> variant name "bodySmallSemibold".
// Names are mechanically derived from the token path — rename once real
// semantic variant names (e.g. "labelLarge") are assigned upstream.
//
// lineHeight is converted from Figma's absolute px value into the unitless
// ratio MUI/CSS expects (lineHeight / fontSize) — a direct mathematical
// derivation from the two source values, not a guess.
function collectTypographyVariants(typographyNode, pathPrefix = []) {
  const out = [];
  for (const [key, child] of Object.entries(typographyNode)) {
    const path = [...pathPrefix, key];
    if (child && typeof child === 'object' && 'value' in child) {
      const {fontFamily, fontWeight, fontSize, lineHeight, letterSpacing} = child.value;
      out.push({
        name: pathToCamel(path),
        style: {
          fontFamily,
          fontWeight,
          fontSize,
          lineHeight: Number((lineHeight / fontSize).toFixed(4)),
          letterSpacing,
        },
      });
    } else if (child && typeof child === 'object') {
      out.push(...collectTypographyVariants(child, path));
    }
  }
  return out;
}

// Maps the same tokens onto an MUI theme:
// - palette slots are only filled where a token has an unambiguous MUI
//   semantic match (see inline comments for what was intentionally left out
//   and why, rather than guessed).
// - the full raw token scales are exposed under `theme.tokens` (via module
//   augmentation) for anything the palette/spacing/shape APIs don't cover.
export const muiThemeFormat = {
  name: 'bliro/mui-theme',
  format: ({dictionary}) => {
    const colors = walk(dictionary.tokens.color, token => token.value);
    const spacing = walk(dictionary.tokens.spacing, token => Number(token.value));
    const radius = walk(dictionary.tokens.radius, token => Number(token.value));
    const variants = collectTypographyVariants(dictionary.tokens.typography);

    const variantFields = variants.map(v => `    ${v.name}: CSSProperties;`).join('\n');
    const variantOptionFields = variants.map(v => `    ${v.name}?: CSSProperties;`).join('\n');
    const variantPropOverrides = variants.map(v => `    ${v.name}: true;`).join('\n');
    const typographyEntries = variants
      .map(v => `    ${v.name}: ${serialize(v.style, 2)},`)
      .join('\n');

    return `${fileHeader([
      'This file maps Bliro design tokens onto an MUI theme so the web app and',
      '@dettalia/design-system share one source of truth.',
    ])}
import { createTheme, type ThemeOptions } from '@mui/material/styles';
import type { CSSProperties } from 'react';

declare module '@mui/material/styles' {
  interface TypographyVariants {
${variantFields}
  }

  interface TypographyVariantsOptions {
${variantOptionFields}
  }

  interface Theme {
    tokens: {
      colors: typeof colors;
      spacing: typeof spacing;
      radius: typeof radius;
    };
  }

  interface ThemeOptions {
    tokens?: Theme['tokens'];
  }
}

declare module '@mui/material/Typography' {
  interface TypographyPropsVariantOverrides {
${variantPropOverrides}
  }
}

// Raw token scales, for anything the palette/spacing/shape mappings below don't cover
// (e.g. the full spacing/radius scale, or color groups with no MUI slot, like "neutral"/"dark").
const colors = ${serialize(colors, 0)} as const;
const spacing = ${serialize(spacing, 0)} as const;
const radius = ${serialize(radius, 0)} as const;

const themeOptions: ThemeOptions = {
  palette: {
    primary: {
      main: colors.button.primary.main,
      contrastText: colors.button.primary['on-primary'],
    },
    error: {
      main: colors.error.default,
    },
    text: {
      primary: colors.text.primary,
      secondary: colors.text.secondary,
      disabled: colors.text.disabled,
    },
    background: {
      paper: colors.background.surface,
    },
    action: {
      hover: colors.action.hover,
      active: colors.action['active-icon'],
      selected: colors.action['active-bg'],
    },
    // NOT mapped, on purpose: the source tokens have no "warning main" (only
    // warning.text / warning.subtle, which read as text-on-subtle-background
    // roles, not a MUI PaletteColor.main) and no generic "divider" or
    // "action.disabledBackground" token. Left unset so MUI's defaults apply
    // rather than guessing — use \`colors.warning\` / \`colors.border\` directly
    // if you need those.
  },
  shape: {
    // radius.button (4) doubles as MUI's sitewide default corner radius.
    // radius['2xl'] and radius.full have no MUI Shape slot (it's a single
    // scalar) — use the raw \`radius\` object above for those.
    borderRadius: radius.button,
  },
  typography: {
${typographyEntries}
  },
  tokens: {
    colors,
    spacing,
    radius,
  },
};

export const theme = createTheme(themeOptions);

export default theme;
`;
  },
};
