import {createTheme, type ThemeOptions} from '@mui/material/styles';
import {MuiButton} from './components/button';
import {themeOptions, tokens} from './tokens';

// Bliro defaults for MUI components, on top of the token-derived palette,
// shape, typography and shadows in `./tokens` (generated). Only token values
// are used here; if a design needs a value with no token, raise it with design.
const components: ThemeOptions['components'] = {
  MuiButton,
  MuiCard: {
    styleOverrides: {
      root: {
        borderRadius: tokens.radius.card,
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
  MuiDialog: {
    styleOverrides: {
      paper: {
        borderRadius: tokens.radius.modal,
      },
    },
  },
};

export const theme = createTheme({...themeOptions, components});
