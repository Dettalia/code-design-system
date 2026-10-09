import React from 'react';
import {
  Box,
  MenuItem,
  OutlinedInput,
  Select,
  Switch,
  ToggleButton,
  ToggleButtonGroup,
  tokens,
  type OutlinedInputProps,
} from '../../../index';
import chevronDown from '../../settings-assets/chevron-down-20.svg';

// Controls for SettingRow. One size (40px inputs, 240px wide by default) so
// rows line up across pages. Labels come from the row via aria-labelledby.

const {color, radius} = tokens;
const CONTROL_WIDTH = 240;

export function SettingSwitch({checked, onChange, labelId}: {checked: boolean; onChange: (v: boolean) => void; labelId: string}) {
  return <Switch checked={checked} onChange={(_, v) => onChange(v)} slotProps={{input: {'aria-labelledby': labelId}}} />;
}

export function SettingSelect<T extends string>({
  value,
  options,
  onChange,
  labelId,
  ariaLabel,
  width = CONTROL_WIDTH,
}: {
  value: T;
  options: readonly {value: T; label: string}[];
  onChange: (v: T) => void;
  /** Labelled by the row's label, or by `ariaLabel` (e.g. inside a table). */
  labelId?: string;
  ariaLabel?: string;
  width?: number;
}) {
  return (
    <Select
      value={value}
      onChange={event => onChange(event.target.value as T)}
      inputProps={labelId ? {'aria-labelledby': labelId} : {'aria-label': ariaLabel}}
      IconComponent={props => <Box component="img" src={chevronDown} alt="" {...props} sx={{right: '12px !important', top: 'calc(50% - 10px) !important'}} />}
      sx={theme => ({
        width,
        maxWidth: '100%',
        height: 40,
        '& .MuiSelect-select': {...theme.typography.bodySmallRegular, py: '9px', pl: 2, pr: '44px !important'},
      })}
    >
      {options.map(o => (
        <MenuItem key={o.value} value={o.value} sx={{typography: 'bodySmallRegular'}}>
          {o.label}
        </MenuItem>
      ))}
    </Select>
  );
}

export function SettingInput({width = CONTROL_WIDTH, sx, ...props}: OutlinedInputProps & {width?: number | string}) {
  return (
    <OutlinedInput
      {...props}
      sx={[
        theme => ({
          width,
          maxWidth: '100%',
          height: 40,
          px: 2,
          '& .MuiOutlinedInput-input': {...theme.typography.bodySmallRegular, p: 0},
        }),
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    />
  );
}

/** Segmented control for 2–4 exclusive options (Figma exploration: Never / Instantly / Periodically). */
export function Segmented<T extends string>({
  value,
  options,
  onChange,
  labelId,
}: {
  value: T;
  options: readonly {value: T; label: string}[];
  onChange: (v: T) => void;
  labelId: string;
}) {
  return (
    <ToggleButtonGroup
      exclusive
      value={value}
      onChange={(_, v: T | null) => v && onChange(v)}
      aria-labelledby={labelId}
      sx={{
        p: 0.5,
        gap: 0.5,
        bgcolor: color.neutral['50'],
        borderRadius: `${radius.lg}px`,
        '& .MuiToggleButton-root': {
          border: 0,
          borderRadius: `${radius.md}px !important`,
          px: 1.5,
          py: 0.5,
          textTransform: 'none',
          typography: 'bodySmallMedium',
          color: 'text.secondary',
          '&.Mui-selected': {bgcolor: 'background.paper', color: 'text.primary', boxShadow: tokens.shadow['1']},
          '&.Mui-selected:hover': {bgcolor: 'background.paper'},
        },
      }}
    >
      {options.map(o => (
        <ToggleButton key={o.value} value={o.value}>
          {o.label}
        </ToggleButton>
      ))}
    </ToggleButtonGroup>
  );
}

/** Tracks a form's saved and edited values; Save/Cancel enable only when something changed. */
export function useSettingsForm<T extends object>(initial: T) {
  const [saved, setSaved] = React.useState(initial);
  const [values, setValues] = React.useState(initial);
  const dirty = JSON.stringify(values) !== JSON.stringify(saved);
  const set = <K extends keyof T>(key: K, value: T[K]) => setValues(v => ({...v, [key]: value}));
  return {values, set, dirty, save: () => setSaved(values), reset: () => setValues(saved)};
}
