import * as mapping from '../mui-mapping.mjs';
import {fileHeader, pathToCamel, serialize} from '../utils.mjs';

const ROOT_FONT_SIZE_PX = 16;

// Generates src/theme/tokens.ts from the resolved Figma tokens:
// - `tokens`: every color/spacing/radius/border/font/shadow token, resolved to
//   plain values (numbers for px dimensions, CSS strings for shadows). Also
//   attached to the theme as `theme.tokens`.
// - `themeOptions`: MUI palette, shape, typography and shadows, filled in from
//   style-dictionary/mui-mapping.mjs.
// - Module augmentation so every Figma text style is a typed Typography
//   variant and `theme.tokens` is typed.
export const muiThemeFormat = {
  name: 'bliro/mui-theme',
  format: ({dictionary}) => {
    const byPath = new Map(dictionary.allTokens.map(t => [t.path.join('.'), t]));

    const lookup = (path, type, slot) => {
      const token = byPath.get(path);
      if (!token) {
        throw new Error(
          `mui-mapping.mjs: ${slot} points to "${path}", which isn't in tokens/figma-export.json. Was it renamed in Figma?`,
        );
      }
      if (token.$type !== type) {
        throw new Error(
          `mui-mapping.mjs: ${slot} needs a ${type} token, but "${path}" is ${token.$type}.`,
        );
      }
      return token;
    };

    // --- tokens -------------------------------------------------------------
    const tokens = {};
    for (const token of dictionary.allTokens) {
      if (token.$type === 'typography') continue; // exposed as Typography variants
      let node = tokens;
      for (const key of token.path.slice(0, -1)) node = node[key] ??= {};
      node[token.path[token.path.length - 1]] = plainValue(token);
    }

    // --- typography ---------------------------------------------------------
    const textStyles = dictionary.allTokens.filter(t => t.$type === 'typography');
    const variantName = token => pathToCamel(token.path.slice(1));
    const styles = Object.fromEntries(
      textStyles.map(t => [variantName(t), typographyStyle(t.$value)]),
    );
    const families = [...new Set(textStyles.map(t => t.$value.fontFamily))];

    const muiVariants = Object.entries(mapping.typography).map(([variant, path]) => {
      const token = lookup(path, 'typography', `typography.${variant}`);
      return `    ${variant}: typographyStyles.${variantName(token)},`;
    });
    const customVariants = Object.keys(styles).map(
      name => `    ${name}: typographyStyles.${name},`,
    );

    // --- palette & shape ----------------------------------------------------
    const ref = path =>
      'tokens' +
      path
        .split('.')
        .map(k => (/^[A-Za-z_$][\w$]*$/.test(k) ? `.${k}` : `[${JSON.stringify(k)}]`))
        .join('');
    const paletteLines = [];
    for (const [slot, value] of Object.entries(mapping.palette)) {
      if (typeof value === 'string') {
        lookup(value, 'color', `palette.${slot}`);
        paletteLines.push(`    ${slot}: ${ref(value)},`);
        continue;
      }
      paletteLines.push(`    ${slot}: {`);
      for (const [key, path] of Object.entries(value)) {
        lookup(path, 'color', `palette.${slot}.${key}`);
        paletteLines.push(`      ${key}: ${ref(path)},`);
      }
      paletteLines.push('    },');
    }
    const shapeLines = Object.entries(mapping.shape).map(([slot, path]) => {
      lookup(path, 'dimension', `shape.${slot}`);
      return `    ${slot}: ${ref(path)},`;
    });

    // --- shadows ------------------------------------------------------------
    const shadowLines = ["    'none',"];
    let current = "'none'";
    for (let elevation = 1; elevation <= 24; elevation++) {
      const path = mapping.shadows[elevation];
      if (path) {
        lookup(path, 'shadow', `shadows[${elevation}]`);
        current = ref(path);
      }
      shadowLines.push(`    ${current}, // ${elevation}`);
    }

    const variantNames = Object.keys(styles);
    return `${fileHeader([
      'Maps Bliro design tokens onto MUI ThemeOptions. Which token feeds which',
      'MUI slot is configured in style-dictionary/mui-mapping.mjs.',
      'src/theme/theme.ts passes these to createTheme() with the component defaults.',
    ])}
import type {Shadows, ThemeOptions} from '@mui/material/styles';
import type {CSSProperties} from 'react';

declare module '@mui/material/styles' {
  interface TypographyVariants {
${variantNames.map(n => `    ${n}: CSSProperties;`).join('\n')}
  }

  interface TypographyVariantsOptions {
${variantNames.map(n => `    ${n}?: CSSProperties;`).join('\n')}
  }

  interface Theme {
    tokens: BliroTokens;
  }

  interface ThemeOptions {
    tokens?: BliroTokens;
  }
}

declare module '@mui/material/Typography' {
  interface TypographyPropsVariantOverrides {
${variantNames.map(n => `    ${n}: true;`).join('\n')}
  }
}

/** Every Figma token except text styles, resolved. Dimensions are px numbers. */
export const tokens = ${serialize(tokens, 0)} as const;

export type BliroTokens = typeof tokens;

/** One entry per Figma text style, named after its path (Body/Small/SemiBold -> bodySmallSemibold). */
const typographyStyles = ${serialize(styles, 0)} satisfies Record<string, CSSProperties>;

export const themeOptions: ThemeOptions = {
  palette: {
${paletteLines.join('\n')}
  },
  shape: {
${shapeLines.join('\n')}
  },
  typography: {
${families.length === 1 ? `    fontFamily: ${JSON.stringify(fontStack(families[0]))},\n` : ''}${muiVariants.join('\n')}
${customVariants.join('\n')}
  },
  shadows: [
${shadowLines.join('\n')}
  ] as Shadows,
  tokens,
};
`;
  },
};

function pxNumber(value, label) {
  if (typeof value === 'number') return value;
  const match = /^(-?\d+(?:\.\d+)?)px$/.exec(value);
  if (!match) throw new Error(`Expected a px dimension for ${label}, got "${value}".`);
  return Number(match[1]);
}

function plainValue(token) {
  const label = token.path.join('.');
  switch (token.$type) {
    case 'dimension':
      return pxNumber(token.$value, label);
    case 'shadow':
      return token.$value
        .map(s =>
          [s.inset ? 'inset' : null, s.offsetX, s.offsetY, s.blur, s.spread, s.color]
            .filter(Boolean)
            .join(' '),
        )
        .join(', ');
    default:
      return token.$value;
  }
}

function fontStack(family) {
  return `"${family}", sans-serif`;
}

// Figma px values -> MUI-friendly CSS: font size in rem, unitless line height.
function typographyStyle(value) {
  const fontSize = pxNumber(value.fontSize, 'fontSize');
  const style = {
    fontFamily: fontStack(value.fontFamily),
    fontWeight: value.fontWeight,
    fontSize: `${Number((fontSize / ROOT_FONT_SIZE_PX).toFixed(4))}rem`,
    lineHeight:
      typeof value.lineHeight === 'string' && value.lineHeight.endsWith('px')
        ? Number((pxNumber(value.lineHeight, 'lineHeight') / fontSize).toFixed(4))
        : value.lineHeight,
    letterSpacing: value.letterSpacing,
  };
  if (value.textTransform) style.textTransform = value.textTransform;
  return style;
}
