import React, {useId} from 'react';
import {
  Box,
  DialogTitle,
  IconButton,
  OutlinedInput,
  SvgIcon,
  Typography,
  tokens,
  type OutlinedInputProps,
  type SvgIconProps,
} from '../index';

// Building blocks for the Figma "Modal" component (node 12340:4304). The theme
// styles Dialog, DialogTitle, DialogContent and DialogActions; these add the
// parts MUI doesn't have: the header's close button and lead icon, and the
// Figma "Input field" / "Text Area" layout (label above the field).

const ICON_SIZE = 20;

export const CloseIcon = (props: SvgIconProps) => (
  <SvgIcon {...props}>
    <path d="M18.3 5.7a1 1 0 0 0-1.4 0L12 10.6 7.1 5.7a1 1 0 0 0-1.4 1.4l4.9 4.9-4.9 4.9a1 1 0 1 0 1.4 1.4l4.9-4.9 4.9 4.9a1 1 0 0 0 1.4-1.4L13.4 12l4.9-4.9a1 1 0 0 0 0-1.4z" />
  </SvgIcon>
);

export const AlertTriangleIcon = (props: SvgIconProps) => (
  <SvgIcon {...props}>
    <path d="M12 2.5a2 2 0 0 1 1.7 1l8.5 14.7a2 2 0 0 1-1.7 3H3.5a2 2 0 0 1-1.7-3l8.5-14.7a2 2 0 0 1 1.7-1zm0 2L3.5 19.2h17L12 4.5zM12 9a1 1 0 0 1 1 1v4a1 1 0 1 1-2 0v-4a1 1 0 0 1 1-1zm0 7a1.2 1.2 0 1 1 0 2.4 1.2 1.2 0 0 1 0-2.4z" />
  </SvgIcon>
);

export interface ModalHeaderProps {
  /** Must match the Dialog's `aria-labelledby`. */
  id: string;
  title: React.ReactNode;
  onClose: () => void;
  /** Figma "leadIcon": a 24px icon before the title, e.g. <AlertTriangleIcon color="error" />. */
  icon?: React.ReactElement<SvgIconProps>;
}

/** Figma Modal_header, Header=simple: [lead icon] title, then a 32px close button. */
export function ModalHeader({id, title, onClose, icon}: ModalHeaderProps) {
  return (
    <DialogTitle id={id} sx={{display: 'flex', alignItems: 'center', gap: 1}}>
      {icon ? React.cloneElement(icon, {sx: {fontSize: 24, ...icon.props.sx}}) : null}
      <Box component="span" sx={{flex: 1, minWidth: 0}}>
        {title}
      </Box>
      <IconButton
        aria-label="Close"
        onClick={onClose}
        sx={{
          width: 32,
          height: 32,
          p: `${tokens.spacing['1']}px`,
          borderRadius: `${tokens.radius.lg}px`,
          color: 'text.secondary',
        }}
      >
        <CloseIcon sx={{fontSize: ICON_SIZE}} />
      </IconButton>
    </DialogTitle>
  );
}

export interface ModalFieldProps extends Omit<OutlinedInputProps, 'id'> {
  label: string;
  /** A 20px icon before the value, as in Figma's Input field. */
  icon?: React.ReactElement<SvgIconProps>;
}

/**
 * Figma "Input field" (40px, label above) or, with `multiline`, "Text Area"
 * (78px box). Body/Small text, 16px side padding.
 */
export function ModalField({label, icon, multiline, sx, ...inputProps}: ModalFieldProps) {
  const inputId = useId();
  const {spacing, border, color} = tokens;
  return (
    <Box sx={{display: 'flex', flexDirection: 'column', gap: 0.5}}>
      <Typography
        component="label"
        htmlFor={inputId}
        variant="bodySmallSemibold"
        sx={{color: color.neutral['900']}}
      >
        {label}
      </Typography>
      <OutlinedInput
        id={inputId}
        fullWidth
        multiline={multiline}
        startAdornment={
          icon ? (
            <Box
              component="span"
              sx={{display: 'flex', mr: 1, color: 'text.secondary', alignSelf: 'center'}}
            >
              {React.cloneElement(icon, {sx: {fontSize: ICON_SIZE}})}
            </Box>
          ) : undefined
        }
        {...inputProps}
        sx={[
          theme => ({
            px: `${spacing.component.lg}px`,
            // Figma draws the 1px outline inside the frame: 8px padding + 1px.
            py: `${spacing.component.sm + border.width.thin}px`,
            alignItems: multiline ? 'flex-start' : 'center',
            '& .MuiOutlinedInput-input': {
              ...theme.typography.bodySmallRegular,
              p: 0,
              height: 'auto',
              // Text Area: 78px box = 60px of text area + padding + outline.
              ...(multiline ? {minHeight: 60} : {}),
            },
          }),
          ...(Array.isArray(sx) ? sx : [sx]),
        ]}
      />
    </Box>
  );
}
