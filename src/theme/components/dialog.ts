import type {Components, Theme} from '@mui/material/styles';
import {tokens} from '../tokens';

// Matches the Figma component "Modal" (Bliro Design System, node 12340:4304):
//
//   Modal_header  -> DialogTitle    16px padding, Subheading 2 (MUI h6), divider below
//   Modal content -> DialogContent  24px padding, 16px gap between items
//   Footer        -> DialogActions  16px padding, buttons 8px apart, right-aligned
//
// The surface is white with the "Shadow - modal" shadow (MUI elevation 24 maps
// to shadow.modal) and 16px corners. Figma's Modal uses radius/2xl directly,
// not the radius/modal token (12px). Width is 480px by default; Figma's wider
// variant is 560px (pass `slotProps={{paper: {sx: {width: 560}}}}`).

const {color, spacing, radius, border, shadow} = tokens;

export const MuiDialog: Components<Theme>['MuiDialog'] = {
  styleOverrides: {
    paper: {
      width: 480,
      borderRadius: radius['2xl'],
      backgroundColor: color.background.surface,
      boxShadow: shadow.modal,
    },
  },
};

export const MuiDialogTitle: Components<Theme>['MuiDialogTitle'] = {
  styleOverrides: {
    root: {
      padding: spacing['5'],
      // Figma's divider is Dark - 7 (#e7e8e9), the neutral/100 primitive.
      borderBottom: `${border.width.thin}px solid ${color.neutral['100']}`,
    },
  },
};

export const MuiDialogContent: Components<Theme>['MuiDialogContent'] = {
  styleOverrides: {
    root: {
      display: 'flex',
      flexDirection: 'column',
      gap: spacing['5'],
      padding: spacing['7'],
      // MUI drops the top padding after a title; Figma keeps 24px.
      '.MuiDialogTitle-root + &': {paddingTop: spacing['7']},
    },
  },
};

// Figma body copy in Modal content is Body/Normal/Regular (MUI body1) in the
// primary text color; MUI's DialogContentText defaults to text.secondary.
export const MuiDialogContentText: Components<Theme>['MuiDialogContentText'] = {
  styleOverrides: {
    root: {
      color: color.text.primary,
    },
  },
};

export const MuiDialogActions: Components<Theme>['MuiDialogActions'] = {
  styleOverrides: {
    root: {
      padding: spacing['5'],
      gap: spacing['3'],
      // Use `gap` instead of MUI's sibling margins.
      '& > :not(style) ~ :not(style)': {marginLeft: 0},
    },
  },
};
