import {createTheme, type ThemeOptions} from '@mui/material/styles';
import {themeOptions, tokens} from './tokens';

// Bliro defaults for MUI components, on top of the token-derived palette,
// shape, and typography in `./tokens` (generated). Only token values are used
// here — if a design needs a value with no token, raise it with design first.
const components: ThemeOptions['components'] = {
  MuiButton: {
    defaultProps: {
      disableElevation: true,
    },
    styleOverrides: {
      root: ({theme}) => ({
        ...theme.typography.bodySmallSemibold,
        textTransform: 'none',
      }),
    },
  },
  MuiCard: {
    styleOverrides: {
      root: {
        borderRadius: tokens.radius['2xl'],
      },
    },
  },
  MuiPaper: {
    styleOverrides: {
      outlined: {
        borderColor: tokens.colors.border.disabled,
      },
    },
  },
  MuiOutlinedInput: {
    styleOverrides: {
      notchedOutline: {
        borderColor: tokens.colors.border.disabled,
      },
    },
  },
};

export const theme = createTheme({...themeOptions, components});
