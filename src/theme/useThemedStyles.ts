import {useMemo} from 'react';
import {StyleSheet, type ImageStyle, type TextStyle, type ViewStyle} from 'react-native';
import {useTheme} from './ThemeProvider';
import type {Theme} from './tokens';

/**
 * Builds a `StyleSheet` from the current theme. `factory` must be a stable
 * reference declared once at module scope (e.g. `const createStyles = (theme: Theme) => ({...})`)
 * so this only recomputes the StyleSheet when the theme itself changes.
 */
export function useThemedStyles<T extends Record<string, ViewStyle | TextStyle | ImageStyle>>(
  factory: (theme: Theme) => T,
): T {
  const theme = useTheme();
  return useMemo(() => StyleSheet.create(factory(theme)), [theme, factory]);
}
