import React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import {ThemeProvider as MuiThemeProvider, type Theme} from '@mui/material/styles';
import {theme as bliroTheme} from './theme';

export interface ThemeProviderProps {
  /** Defaults to the Bliro theme. Pass your own `createTheme()` result to override it. */
  theme?: Theme;
  /** Renders MUI's `CssBaseline` (CSS reset + body typography/background). Defaults to `true`. */
  cssBaseline?: boolean;
  children: React.ReactNode;
}

/**
 * Drop-in for MUI's `ThemeProvider` that applies the Bliro theme by default.
 * It shadows MUI's export of the same name at the package root.
 */
export function ThemeProvider({
  theme = bliroTheme,
  cssBaseline = true,
  children,
}: ThemeProviderProps) {
  return (
    <MuiThemeProvider theme={theme}>
      {cssBaseline ? <CssBaseline /> : null}
      {children}
    </MuiThemeProvider>
  );
}
