import {walk, serialize, fileHeader} from '../utils.mjs';

// Shapes the token tree for React Native consumption:
// - colors: passed through as-is (already RN-compatible hex strings)
// - spacing / radius: numeric (RN style props take points, not CSS strings)
// - typography: fontWeight coerced to a string, since RN's TextStyle.fontWeight
//   type is a string union ('400' | '600' | 'bold' | ...), not a number.
export const reactNativeThemeFormat = {
  name: 'bliro/react-native-theme',
  format: ({dictionary}) => {
    const colors = walk(dictionary.tokens.color, token => token.value);
    const spacing = walk(dictionary.tokens.spacing, token => Number(token.value));
    const radius = walk(dictionary.tokens.radius, token => Number(token.value));
    const typography = walk(dictionary.tokens.typography, token => ({
      fontFamily: token.value.fontFamily,
      fontWeight: String(token.value.fontWeight),
      fontSize: token.value.fontSize,
      lineHeight: token.value.lineHeight,
      letterSpacing: token.value.letterSpacing,
    }));

    return `${fileHeader()}
export const colors = ${serialize(colors)} as const;

export const spacing = ${serialize(spacing)} as const;

export const radius = ${serialize(radius)} as const;

export const typography = ${serialize(typography)} as const;

export const theme = {
  colors,
  spacing,
  radius,
  typography,
} as const;

export type Theme = typeof theme;

export default theme;
`;
  },
};
