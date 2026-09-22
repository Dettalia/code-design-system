import React from 'react';
import {View, type StyleProp, type ViewProps, type ViewStyle} from 'react-native';
import {useThemedStyles, type Theme} from '../../theme';
import {Text} from '../Text';

/**
 * Named `Badge` per spec, but renders as a standalone status pill rather
 * than MUI Badge's overlay dot — so `label`/`color` intentionally mirror
 * MUI Chip's naming instead. Only colors backed by an actual token are
 * offered: the tokens have no distinct "success"/"info"/"secondary" hues.
 */
export type BadgeColor = 'default' | 'primary' | 'error' | 'warning';

export interface BadgeProps extends Omit<ViewProps, 'style'> {
  color?: BadgeColor;
  label: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

const createStyles = (theme: Theme) => ({
  base: {
    flexDirection: 'row' as const,
    alignSelf: 'flex-start' as const,
    alignItems: 'center' as const,
    borderRadius: theme.radius.full,
    paddingVertical: theme.spacing['1'],
    paddingHorizontal: theme.spacing['2'],
  },
  default: {backgroundColor: theme.colors.neutral['25']},
  primary: {backgroundColor: theme.colors.action['active-bg']},
  error: {backgroundColor: theme.colors.error.subtle},
  warning: {backgroundColor: theme.colors.warning.subtle},
  textDefault: {...theme.typography.body.xxsmall.regular, color: theme.colors.text.secondary},
  textPrimary: {...theme.typography.body.xxsmall.regular, color: theme.colors.button.primary.main},
  textError: {...theme.typography.body.xxsmall.regular, color: theme.colors.error.default},
  textWarning: {...theme.typography.body.xxsmall.regular, color: theme.colors.warning.text},
});

const textStyleKey = {
  default: 'textDefault',
  primary: 'textPrimary',
  error: 'textError',
  warning: 'textWarning',
} as const;

export function Badge({color = 'default', label, style, ...rest}: BadgeProps) {
  const styles = useThemedStyles(createStyles);

  return (
    <View style={[styles.base, styles[color], style]} {...rest}>
      {typeof label === 'string' ? <Text style={styles[textStyleKey[color]]}>{label}</Text> : label}
    </View>
  );
}
