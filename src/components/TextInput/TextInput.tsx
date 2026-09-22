import React, {useState} from 'react';
import {
  TextInput as RNTextInput,
  View,
  type StyleProp,
  type TextInputFocusEvent,
  type TextInputProps as RNTextInputProps,
  type TextStyle,
  type ViewStyle,
} from 'react-native';
import {useTheme, useThemedStyles, type Theme} from '../../theme';
import {Text} from '../Text';

export type TextInputSize = 'sm' | 'md' | 'lg';

export interface TextInputProps extends Omit<RNTextInputProps, 'style'> {
  label?: string;
  helperText?: string;
  /** Mirrors MUI TextField's `error` prop. */
  error?: boolean;
  size?: TextInputSize;
  /** Mirrors MUI TextField's `fullWidth` prop. */
  fullWidth?: boolean;
  disabled?: boolean;
  containerStyle?: StyleProp<ViewStyle>;
  /** Style for the input text itself. */
  style?: StyleProp<TextStyle>;
}

const createStyles = (theme: Theme) => ({
  fullWidth: {alignSelf: 'stretch' as const},
  label: {marginBottom: theme.spacing['1']},
  fieldBase: {
    borderWidth: 1,
    borderRadius: theme.radius.button,
    borderColor: theme.colors.border.disabled,
    backgroundColor: theme.colors.background.surface,
  },
  fieldFocused: {borderColor: theme.colors.button.primary.main},
  fieldError: {borderColor: theme.colors.error.default},
  fieldDisabled: {backgroundColor: theme.colors.neutral['25']},
  // The token spacing scale tops out at 16, so "lg" only differs from "md"
  // by vertical padding until a larger step is added to the scale.
  sizeSm: {paddingVertical: theme.spacing['1'], paddingHorizontal: theme.spacing.component.sm},
  sizeMd: {paddingVertical: theme.spacing['2'], paddingHorizontal: theme.spacing['5']},
  sizeLg: {paddingVertical: theme.spacing['3'], paddingHorizontal: theme.spacing['5']},
  inputTextSm: {...theme.typography.body.xsmall.regular, color: theme.colors.text.primary},
  inputTextMd: {...theme.typography.body.small.regular, color: theme.colors.text.primary},
  inputTextLg: {...theme.typography.body.small.medium, color: theme.colors.text.primary},
  helper: {marginTop: theme.spacing['1']},
  errorText: {color: theme.colors.error.default},
});

const sizeStyleKey = {sm: 'sizeSm', md: 'sizeMd', lg: 'sizeLg'} as const;
const inputTextStyleKey = {sm: 'inputTextSm', md: 'inputTextMd', lg: 'inputTextLg'} as const;

export function TextInput({
  label,
  helperText,
  error = false,
  size = 'md',
  fullWidth = false,
  disabled = false,
  containerStyle,
  style,
  onFocus,
  onBlur,
  ...rest
}: TextInputProps) {
  const theme = useTheme();
  const styles = useThemedStyles(createStyles);
  const [focused, setFocused] = useState(false);

  const handleFocus = (e: TextInputFocusEvent) => {
    setFocused(true);
    onFocus?.(e);
  };

  const handleBlur = (e: TextInputFocusEvent) => {
    setFocused(false);
    onBlur?.(e);
  };

  return (
    <View style={[fullWidth ? styles.fullWidth : undefined, containerStyle]}>
      {label ? (
        <Text variant="caption" color="secondary" style={styles.label}>
          {label}
        </Text>
      ) : null}
      <View
        style={[
          styles.fieldBase,
          styles[sizeStyleKey[size]],
          focused ? styles.fieldFocused : undefined,
          error ? styles.fieldError : undefined,
          disabled ? styles.fieldDisabled : undefined,
        ]}
      >
        <RNTextInput
          editable={!disabled}
          placeholderTextColor={theme.colors.text.secondary}
          onFocus={handleFocus}
          onBlur={handleBlur}
          style={[styles[inputTextStyleKey[size]], style]}
          {...rest}
        />
      </View>
      {helperText ? (
        <Text
          variant="caption"
          color={error ? undefined : 'secondary'}
          style={[styles.helper, error ? styles.errorText : undefined]}
        >
          {helperText}
        </Text>
      ) : null}
    </View>
  );
}
