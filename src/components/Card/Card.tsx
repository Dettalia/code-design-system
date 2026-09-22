import React from 'react';
import {View, type StyleProp, type ViewProps, type ViewStyle} from 'react-native';
import {useThemedStyles, type Theme} from '../../theme';

/** Matches MUI Paper/Card's `variant` prop values exactly. */
export type CardVariant = 'elevation' | 'outlined';
export type CardPadding = 'none' | 'sm' | 'md' | 'lg';

export interface CardProps extends Omit<ViewProps, 'style'> {
  variant?: CardVariant;
  padding?: CardPadding;
  style?: StyleProp<ViewStyle>;
  children?: React.ReactNode;
}

const createStyles = (theme: Theme) => ({
  base: {
    borderRadius: theme.radius['2xl'],
    backgroundColor: theme.colors.background.surface,
  },
  elevation: {
    // No elevation/shadow token exists yet — this is a conservative fixed
    // baseline, not derived from the theme. Revisit once one is added.
    shadowColor: '#000000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  outlined: {
    borderWidth: 1,
    borderColor: theme.colors.border.disabled,
  },
  paddingNone: {padding: 0},
  paddingSm: {padding: theme.spacing['3']},
  // The token spacing scale tops out at 16, so "md" and "lg" are currently
  // identical until a larger step is added to the scale.
  paddingMd: {padding: theme.spacing['5']},
  paddingLg: {padding: theme.spacing.component.lg},
});

const paddingStyleKey = {
  none: 'paddingNone',
  sm: 'paddingSm',
  md: 'paddingMd',
  lg: 'paddingLg',
} as const;

export function Card({variant = 'elevation', padding = 'md', style, children, ...rest}: CardProps) {
  const styles = useThemedStyles(createStyles);

  return (
    <View style={[styles.base, styles[variant], styles[paddingStyleKey[padding]], style]} {...rest}>
      {children}
    </View>
  );
}
