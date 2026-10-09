import React, {useId} from 'react';
import {Paper, Typography, tokens} from '../../../index';
import {Segmented} from './controls';
import type {SectionStyle} from './SettingsLayout';

// Prototype-only: compare the three Figma explorations (section 8183:146430)
// on the real settings pages.

const OPTIONS = [
  {value: 'banded', label: 'A'},
  {value: 'card', label: 'B'},
  {value: 'flat', label: 'C'},
] as const;

const NAMES: Record<SectionStyle, string> = {
  banded: 'Grey band (8145:86593)',
  card: 'Title + card (8153:91545)',
  flat: 'Flat rows (8153:92096)',
};

export function SectionStyleSwitcher({value, onChange}: {value: SectionStyle; onChange: (v: SectionStyle) => void}) {
  const labelId = useId();
  return (
    <Paper
      role="region"
      aria-label="Compare section styles"
      // Sits in the empty bottom of the settings sidebar, clear of the page.
      sx={{position: 'fixed', left: 16, bottom: 16, width: 208, zIndex: 'snackbar', p: 1.5, display: 'flex', flexDirection: 'column', gap: 1, borderRadius: `${tokens.radius['2xl']}px`, boxShadow: tokens.shadow['desktop-widget']}}
    >
      <div>
        <Typography id={labelId} variant="bodyXsmallMedium" component="div">
          Section style
        </Typography>
        <Typography variant="bodyXxsmallRegular" color="textSecondary" component="div">
          {NAMES[value]}
        </Typography>
      </div>
      <Segmented labelId={labelId} value={value} onChange={onChange} options={OPTIONS} />
    </Paper>
  );
}

/** The chosen style, remembered in this browser. */
export function useSectionStyle(initial?: SectionStyle) {
  const [style, setStyle] = React.useState<SectionStyle>(() => {
    if (initial) return initial;
    try {
      const saved = window.localStorage.getItem('bliro-settings-section-style');
      return saved === 'banded' || saved === 'flat' || saved === 'card' ? saved : 'card';
    } catch {
      return 'card';
    }
  });
  const set = (next: SectionStyle) => {
    setStyle(next);
    try {
      window.localStorage.setItem('bliro-settings-section-style', next);
    } catch {
      // Storage unavailable (private mode): the choice lasts for this visit.
    }
  };
  return [style, set] as const;
}
