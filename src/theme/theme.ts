import {createTheme, type ThemeOptions} from '@mui/material/styles';
import {MuiButton} from './components/button';
import {
  MuiDialog,
  MuiDialogActions,
  MuiDialogContent,
  MuiDialogContentText,
  MuiDialogTitle,
} from './components/dialog';
import {MuiSwitch} from './components/switch';
import {themeOptions, tokens} from './tokens';

// Bliro defaults for MUI components, on top of the token-derived palette,
// shape, typography and shadows in `./tokens` (generated). Only token values
// are used here; if a design needs a value with no token, raise it with design.
const components: ThemeOptions['components'] = {
  MuiButton,
  MuiCard: {
    styleOverrides: {
      root: {
        // Deliberately differs from Figma: the radius/card token is radius/lg
        // (8px), but cards use radius.2xl (16px) in code. Code-only decision
        // (2026-10-02). Once Figma's radius/card is updated, switch back to
        // tokens.radius.card.
        borderRadius: tokens.radius['2xl'],
      },
    },
  },
  MuiPaper: {
    styleOverrides: {
      outlined: {
        borderColor: tokens.color.border.default,
      },
    },
  },
  MuiOutlinedInput: {
    styleOverrides: {
      root: {
        borderRadius: tokens.radius.input,
      },
      notchedOutline: {
        borderColor: tokens.color.border.default,
      },
    },
  },
  MuiChip: {
    styleOverrides: {
      root: {
        borderRadius: tokens.radius.tag,
      },
    },
  },
  MuiDialog,
  MuiDialogTitle,
  MuiDialogContent,
  MuiDialogContentText,
  MuiDialogActions,
  MuiSwitch,
};

export const theme = createTheme({...themeOptions, components});
