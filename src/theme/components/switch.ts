import type {Components, Theme} from '@mui/material/styles';
import {tokens} from '../tokens';

// Matches the Figma component "Toggle" (Bliro Design System): a 40x20 pill,
// button/primary/main when on and neutral/200 when off, with a 16px white knob
// 2px from the edge. No ripple halo; focus shows an outline around the pill.

const {color, radius} = tokens;

export const MuiSwitch: Components<Theme>['MuiSwitch'] = {
  defaultProps: {disableRipple: true},
  styleOverrides: {
    root: {
      width: 40,
      height: 20,
      padding: 0,
      overflow: 'visible',
    },
    switchBase: {
      padding: 2,
      '&.Mui-checked': {
        transform: 'translateX(20px)',
        color: color.neutral['0'],
        '& + .MuiSwitch-track': {backgroundColor: color.button.primary.main, opacity: 1},
      },
      '&.Mui-focusVisible + .MuiSwitch-track': {
        outline: `2px solid ${color.button.primary.main}`,
        outlineOffset: 2,
      },
      '&.Mui-disabled + .MuiSwitch-track': {opacity: 0.4},
      '&.Mui-disabled .MuiSwitch-thumb': {color: color.neutral['0']},
    },
    thumb: {
      width: 16,
      height: 16,
      boxShadow: 'none',
      color: color.neutral['0'],
    },
    track: {
      borderRadius: radius.full,
      backgroundColor: color.neutral['200'],
      opacity: 1,
    },
  },
};
