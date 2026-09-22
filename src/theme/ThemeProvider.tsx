import React, {createContext, useContext, useMemo} from 'react';
import {theme as defaultTheme, type Theme} from './tokens';

const ThemeContext = createContext<Theme>(defaultTheme);

export interface ThemeProviderProps {
  /** Overrides the default token theme. Replaces it entirely — no deep merge. */
  theme?: Theme;
  children: React.ReactNode;
}

export function ThemeProvider({theme = defaultTheme, children}: ThemeProviderProps) {
  const value = useMemo(() => theme, [theme]);
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): Theme {
  return useContext(ThemeContext);
}
