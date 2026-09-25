import React, {useState} from 'react';
import {
  Pressable,
  Text as RNText,
  View,
  type PressableProps,
  type StyleProp,
  type TextStyle,
  type ViewStyle,
} from 'react-native';
import {useThemedStyles, type Theme} from '../../theme';

/** Matches Bliro's Button_v2 spec (Notion: Design Library / Button), ranked by visual weight. */
export type ButtonVariant = 'main' | 'tonal' | 'outlined' | 'text' | 'textSubtle';
export type ButtonSize = 32 | 40 | 48 | 56;
/** Only `variant="main"` has a defined error treatment — no other variant has one in Figma. */
export type ButtonColor = 'default' | 'error';

export interface ButtonProps extends Omit<PressableProps, 'style' | 'children'> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  color?: ButtonColor;
  disabled?: boolean;
  /** Mirrors MUI Button's `fullWidth` prop. */
  fullWidth?: boolean;
  /** Mirror MUI Button's `startIcon`/`endIcon` naming. */
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  /** String children render as the button label; anything else renders as-is. */
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
    // The heights below are exact per the spec ("Size: 40px", etc.) — without
    // border-box, a variant's 1px border (Tonal/Outlined) would add 2px on
    // top of the height that padding + line-height alone would produce.
    boxSizing: 'border-box' as const,
  },
  fullWidth: {alignSelf: 'stretch' as const},

  // Wraps the whole button when keyboard-focused. Only meaningful on
  // RN-web/keyboard nav — native touch has no keyboard-focus concept, so
  // `focused` just never becomes true there.
  focusRing: {
    alignSelf: 'flex-start' as const,
    padding: 4,
    borderRadius: theme.radius.lg,
    borderWidth: 2,
    borderColor: theme.colors.border.focus,
  },
  focusRingFullWidth: {alignSelf: 'stretch' as const},

  size32: {
    height: 32,
    paddingVertical: theme.spacing.component.xxs,
    paddingHorizontal: theme.spacing['4'],
    gap: theme.spacing['1'],
  },
  size40: {
    height: 40,
    paddingVertical: theme.spacing.component.sm,
    paddingHorizontal: theme.spacing.component.lg,
    gap: theme.spacing.component.sm,
  },
  size48: {
    height: 48,
    paddingVertical: theme.spacing.component.md,
    paddingHorizontal: theme.spacing.component.lg,
    gap: theme.spacing.component.sm,
  },
  size56: {
    height: 56,
    paddingVertical: theme.spacing.component.lg,
    paddingHorizontal: theme.spacing.component.xl,
    gap: theme.spacing.component.sm,
  },

  text32: {...theme.typography.body.xsmall.semibold},
  text40: {...theme.typography.body.small.semibold},
  text48: {...theme.typography.body.normal.semibold},
  text56: {...theme.typography.body.normal.semibold},

  mainDefault: {backgroundColor: theme.colors.button.primary.main},
  mainHover: {backgroundColor: theme.colors.button.primary.hovered},
  mainPressed: {backgroundColor: theme.colors.button.primary.pressed},
  mainErrorDefault: {backgroundColor: theme.colors.error.default},
  // Figma defines the same shade for both the hover and pressed error states.
  mainErrorHoverPressed: {backgroundColor: theme.colors.error.text},
  disabledFilled: {backgroundColor: theme.colors.background.disabled},

  tonalDefault: {
    backgroundColor: theme.colors.button.tonal.main,
    borderColor: theme.colors.border.focus,
  },
  tonalHover: {
    backgroundColor: theme.colors.button.tonal.hover,
    borderColor: theme.colors.border.focus,
  },
  tonalPressed: {
    backgroundColor: theme.colors.button.tonal.pressed,
    borderColor: theme.colors.border.focus,
  },
  tonalDisabled: {
    backgroundColor: theme.colors.background.disabled,
    borderColor: theme.colors.border.disabled,
  },

  outlinedDefault: {
    backgroundColor: 'transparent',
    borderColor: theme.colors.button.outlined.border,
  },
  outlinedHover: {
    backgroundColor: theme.colors.button.outlined.hover,
    borderColor: theme.colors.button.outlined.border,
  },
  outlinedPressed: {
    backgroundColor: theme.colors.button.outlined.pressed,
    borderColor: theme.colors.button.outlined['border-pressed'],
  },
  outlinedDisabled: {backgroundColor: theme.colors.background.disabled, borderColor: 'transparent'},

  transparent: {backgroundColor: 'transparent'},
  textTypeHover: {backgroundColor: theme.colors.button.text.hover},
  textTypePressed: {backgroundColor: theme.colors.button.text.pressed},

  textOnColor: {color: theme.colors.button.primary['on-primary']},
  textMuted: {color: theme.colors.text.disabled},
  textDark: {color: theme.colors.button.text['on-text']},
  textTonal: {color: theme.colors.button.tonal['on-tonal']},
});

type SizeStyleKey = 'size32' | 'size40' | 'size48' | 'size56';
type TextSizeStyleKey = 'text32' | 'text40' | 'text48' | 'text56';
type FillStyleKey =
  | 'mainDefault'
  | 'mainHover'
  | 'mainPressed'
  | 'mainErrorDefault'
  | 'mainErrorHoverPressed'
  | 'disabledFilled'
  | 'tonalDefault'
  | 'tonalHover'
  | 'tonalPressed'
  | 'tonalDisabled'
  | 'outlinedDefault'
  | 'outlinedHover'
  | 'outlinedPressed'
  | 'outlinedDisabled'
  | 'transparent'
  | 'textTypeHover'
  | 'textTypePressed';
type TextColorStyleKey = 'textOnColor' | 'textMuted' | 'textDark' | 'textTonal';

const sizeStyleKey: Record<ButtonSize, SizeStyleKey> = {
  32: 'size32',
  40: 'size40',
  48: 'size48',
  56: 'size56',
};
const textSizeStyleKey: Record<ButtonSize, TextSizeStyleKey> = {
  32: 'text32',
  40: 'text40',
  48: 'text48',
  56: 'text56',
};

function getFillStyleKey(
  variant: ButtonVariant,
  color: ButtonColor,
  disabled: boolean,
  pressed: boolean,
  hovered: boolean,
): FillStyleKey {
  if (variant === 'main') {
    if (color === 'error') {
      if (disabled) return 'disabledFilled';
      if (pressed || hovered) return 'mainErrorHoverPressed';
      return 'mainErrorDefault';
    }
    if (disabled) return 'disabledFilled';
    if (pressed) return 'mainPressed';
    if (hovered) return 'mainHover';
    return 'mainDefault';
  }
  if (variant === 'tonal') {
    if (disabled) return 'tonalDisabled';
    if (pressed) return 'tonalPressed';
    if (hovered) return 'tonalHover';
    return 'tonalDefault';
  }
  if (variant === 'outlined') {
    if (disabled) return 'outlinedDisabled';
    if (pressed) return 'outlinedPressed';
    if (hovered) return 'outlinedHover';
    return 'outlinedDefault';
  }
  // 'text' and 'textSubtle' share the same background behavior.
  if (!disabled && pressed) return 'textTypePressed';
  if (!disabled && hovered) return 'textTypeHover';
  return 'transparent';
}

function getTextStyleKey(variant: ButtonVariant, disabled: boolean): TextColorStyleKey {
  if (disabled) return 'textMuted';
  switch (variant) {
    case 'main':
      return 'textOnColor';
    case 'tonal':
      return 'textTonal';
    case 'outlined':
    case 'text':
      return 'textDark';
    case 'textSubtle':
      // Deliberately reuses the muted/disabled tone at rest — see Figma.
      return 'textMuted';
  }
}

export function Button({
  variant = 'main',
  size = 40,
  color = 'default',
  disabled = false,
  fullWidth = false,
  startIcon,
  endIcon,
  children,
  style,
  textStyle,
  onHoverIn,
  onHoverOut,
  onFocus,
  onBlur,
  ...rest
}: ButtonProps) {
  const styles = useThemedStyles(createStyles);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);

  const pressable = (
    <Pressable
      disabled={disabled}
      accessibilityRole="button"
      onHoverIn={event => {
        setHovered(true);
        onHoverIn?.(event);
      }}
      onHoverOut={event => {
        setHovered(false);
        onHoverOut?.(event);
      }}
      onFocus={event => {
        setFocused(true);
        onFocus?.(event);
      }}
      onBlur={event => {
        setFocused(false);
        onBlur?.(event);
      }}
      style={state => [
        styles.base,
        styles[sizeStyleKey[size]],
        styles[getFillStyleKey(variant, color, disabled, state.pressed, hovered)],
        fullWidth ? styles.fullWidth : undefined,
        style,
      ]}
      {...rest}
    >
      {startIcon}
      {typeof children === 'string' ? (
        <RNText
          style={[
            styles[textSizeStyleKey[size]],
            styles[getTextStyleKey(variant, disabled)],
            textStyle,
          ]}
        >
          {children}
        </RNText>
      ) : (
        children
      )}
      {endIcon}
    </Pressable>
  );

  // Only wrap in the focus-ring container while actually focused: an
  // always-present wrapping View shifts sizing behavior in some host
  // layouts (e.g. a block-level ancestor), which would affect every button,
  // not just the rare moments one is keyboard-focused.
  return focused ? (
    <View style={[styles.focusRing, fullWidth ? styles.focusRingFullWidth : undefined]}>
      {pressable}
    </View>
  ) : (
    pressable
  );
}
