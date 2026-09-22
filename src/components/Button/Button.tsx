import React from 'react';
import {
  Pressable,
  type PressableProps,
  type StyleProp,
  type TextStyle,
  type ViewStyle,
} from 'react-native';
import {useThemedStyles, type Theme} from '../../theme';
import {Text} from '../Text';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends Omit<PressableProps, 'style' | 'children'> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  /** Mirrors MUI Button's `fullWidth` prop. */
  fullWidth?: boolean;
  /** String children render through our `Text`; anything else renders as-is (e.g. an icon). */
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}

const createStyles = (theme: Theme) => ({
  base: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    borderRadius: theme.radius.button,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  // The token spacing scale tops out at 16, so "lg" only differs from "md"
  // by vertical padding until a larger step is added to the scale.
  sizeSm: {paddingVertical: theme.spacing['1'], paddingHorizontal: theme.spacing.component.sm},
  sizeMd: {paddingVertical: theme.spacing['2'], paddingHorizontal: theme.spacing['5']},
  sizeLg: {paddingVertical: theme.spacing['3'], paddingHorizontal: theme.spacing['5']},
  primary: {backgroundColor: theme.colors.button.primary.main},
  secondary: {
    backgroundColor: theme.colors.neutral['25'],
    borderColor: theme.colors.border.disabled,
  },
  ghost: {backgroundColor: 'transparent'},
  ghostPressed: {backgroundColor: theme.colors.action.hover},
  disabled: {
    backgroundColor: theme.colors.neutral['25'],
    borderColor: theme.colors.border.disabled,
  },
  pressed: {opacity: 0.8},
  fullWidth: {alignSelf: 'stretch' as const},
  textPrimary: {color: theme.colors.button.primary['on-primary']},
  textSecondary: {color: theme.colors.text.primary},
  textGhost: {color: theme.colors.button.primary.main},
  textDisabled: {color: theme.colors.text.disabled},
});

const sizeStyleKey = {sm: 'sizeSm', md: 'sizeMd', lg: 'sizeLg'} as const;
const textColorStyleKey = {
  primary: 'textPrimary',
  secondary: 'textSecondary',
  ghost: 'textGhost',
} as const;

export function Button({
  variant = 'primary',
  size = 'md',
  disabled = false,
  fullWidth = false,
  children,
  style,
  textStyle,
  ...rest
}: ButtonProps) {
  const styles = useThemedStyles(createStyles);

  return (
    <Pressable
      disabled={disabled}
      accessibilityRole="button"
      style={state => [
        styles.base,
        styles[sizeStyleKey[size]],
        disabled ? styles.disabled : styles[variant],
        !disabled && variant === 'ghost' && state.pressed ? styles.ghostPressed : undefined,
        !disabled && state.pressed ? styles.pressed : undefined,
        fullWidth ? styles.fullWidth : undefined,
        style,
      ]}
      {...rest}
    >
      {typeof children === 'string' ? (
        <Text
          variant="heading"
          style={[disabled ? styles.textDisabled : styles[textColorStyleKey[variant]], textStyle]}
        >
          {children}
        </Text>
      ) : (
        children
      )}
    </Pressable>
  );
}
