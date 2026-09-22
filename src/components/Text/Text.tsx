import React from 'react';
import {Text as RNText, type TextProps as RNTextProps} from 'react-native';
import {useThemedStyles, type Theme} from '../../theme';

export type TextVariant = 'display' | 'heading' | 'body' | 'caption';
export type TextColor = 'primary' | 'secondary' | 'disabled';

export interface TextProps extends Omit<RNTextProps, 'style'> {
  /**
   * Maps to the token typography scale. The scale currently only has two
   * distinct sizes (~11-14 and 20), so "display" and "heading" share the
   * 20px/subheading token while "heading" borrows its bold weight from the
   * "small" body group — revisit once a fuller type scale is tokenized.
   */
  variant?: TextVariant;
  /** Mirrors MUI Typography's `color` prop; maps to theme.colors.text.*. */
  color?: TextColor;
  /** Mirrors MUI Typography's `align` prop name (applied as RN's `textAlign`). */
  align?: 'left' | 'center' | 'right';
  style?: RNTextProps['style'];
  children?: React.ReactNode;
}

const createStyles = (theme: Theme) => ({
  display: {
    ...theme.typography.subheading['subheading-2'],
    color: theme.colors.text.primary,
  },
  heading: {
    ...theme.typography.body.small.semibold,
    color: theme.colors.text.primary,
  },
  body: {
    ...theme.typography.body.small.regular,
    color: theme.colors.text.primary,
  },
  caption: {
    ...theme.typography.body.xsmall.regular,
    color: theme.colors.text.secondary,
  },
  colorPrimary: {color: theme.colors.text.primary},
  colorSecondary: {color: theme.colors.text.secondary},
  colorDisabled: {color: theme.colors.text.disabled},
  alignLeft: {textAlign: 'left' as const},
  alignCenter: {textAlign: 'center' as const},
  alignRight: {textAlign: 'right' as const},
});

const colorStyleKey = {
  primary: 'colorPrimary',
  secondary: 'colorSecondary',
  disabled: 'colorDisabled',
} as const;

const alignStyleKey = {
  left: 'alignLeft',
  center: 'alignCenter',
  right: 'alignRight',
} as const;

export function Text({variant = 'body', color, align, style, children, ...rest}: TextProps) {
  const styles = useThemedStyles(createStyles);

  return (
    <RNText
      style={[
        styles[variant],
        color ? styles[colorStyleKey[color]] : undefined,
        align ? styles[alignStyleKey[align]] : undefined,
        style,
      ]}
      {...rest}
    >
      {children}
    </RNText>
  );
}
