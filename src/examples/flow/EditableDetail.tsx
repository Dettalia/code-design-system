import React, {useRef, useState} from 'react';
import {
  Box,
  ButtonBase,
  ClickAwayListener,
  IconButton,
  InputBase,
  MenuItem,
  MenuList,
  Paper,
  Popper,
  tokens,
} from '../../index';
import chevronDown from '../company-assets/chevron-down-20.svg';
import chevronUp from '../company-assets/chevron-up.svg';
import xClear from '../company-assets/x-clear.svg';

// Inline-editable company detail values from Figma (Bliro Web app, component
// set "Component 75", 8117:120449). States: default (plain text), hover
// (neutral/200 border, dropdowns show a chevron), active (neutral/400 border;
// dropdowns show clear + chevron-up and open the menu), clear (placeholder).

const {color, radius, shadow} = tokens;

const fieldSx = {
  height: 32,
  width: '100%',
  minWidth: 0,
  border: '1px solid transparent',
  borderRadius: `${radius.lg}px`,
  typography: 'bodySmallRegular',
  color: 'text.primary',
  '&:hover': {borderColor: color.neutral['200']},
} as const;

const activeSx = {borderColor: `${color.neutral['400']} !important`};

// A 4px grey scrollbar thumb with no track. Chrome and Safari use the
// ::-webkit-scrollbar rules; setting scrollbar-width there would disable them,
// so the standard properties (Firefox, thin at its narrowest) apply only where
// the WebKit ones aren't supported.
const subtleScrollbarSx = {
  '&::-webkit-scrollbar': {width: 4},
  '&::-webkit-scrollbar-track': {background: 'transparent'},
  '&::-webkit-scrollbar-thumb': {
    background: color.neutral['200'],
    borderRadius: `${radius.full}px`,
  },
  '@supports not selector(::-webkit-scrollbar)': {
    scrollbarWidth: 'thin',
    scrollbarColor: `${color.neutral['200']} transparent`,
  },
} as const;

const Icon = ({src}: {src: string}) => (
  <Box component="img" src={src} alt="" sx={{display: 'block', flexShrink: 0}} />
);

export interface EditableTextProps {
  label: string;
  value: string;
  placeholder?: string;
  onSave: (value: string) => void;
}

/** Type=input: a borderless text field; Enter or leaving the field saves, Escape reverts. */
export function EditableText({label, value, placeholder, onSave}: EditableTextProps) {
  const [draft, setDraft] = useState<string | null>(null);
  const reverting = useRef(false);
  const editing = draft !== null;

  return (
    <InputBase
      value={draft ?? value}
      placeholder={placeholder}
      onFocus={() => setDraft(value)}
      onChange={event => setDraft(event.target.value)}
      onBlur={() => {
        if (!reverting.current && draft !== null && draft.trim() !== value) onSave(draft.trim());
        reverting.current = false;
        setDraft(null);
      }}
      onKeyDown={event => {
        if (event.key === 'Enter') (event.target as HTMLInputElement).blur();
        if (event.key === 'Escape') {
          reverting.current = true;
          (event.target as HTMLInputElement).blur();
        }
      }}
      inputProps={{'aria-label': label}}
      sx={theme => ({
        ...fieldSx,
        ...(editing ? activeSx : {}),
        '& input': {
          ...theme.typography.bodySmallRegular,
          p: '0 9px',
          height: 30,
          textOverflow: 'ellipsis',
          cursor: editing ? 'text' : 'pointer',
        },
        '& input::placeholder': {color: theme.palette.text.disabled, opacity: 1},
      })}
    />
  );
}

export interface EditableSelectProps {
  label: string;
  value: string;
  options: readonly string[];
  /** Shown when there's no value, e.g. after clearing it ("Select country"). */
  placeholder: string;
  onSave: (value: string) => void;
}

/** Type=dropdown: opens a menu of options; the × clears the value. */
export function EditableSelect({label, value, options, placeholder, onSave}: EditableSelectProps) {
  const trigger = useRef<HTMLButtonElement>(null);
  // The field box the menu hangs from; set when it opens.
  const [anchor, setAnchor] = useState<HTMLElement | null>(null);
  const open = anchor !== null;
  const setOpen = (next: boolean) => setAnchor(next ? trigger.current!.parentElement : null);
  const close = () => {
    setOpen(false);
    trigger.current?.focus();
  };
  const menuId = `${label.toLowerCase().replace(/\s+/g, '-')}-options`;

  return (
    <Box
      sx={{
        ...fieldSx,
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        ...(open ? activeSx : {}),
        // Chevron only on hover or while open, as in Figma.
        '&:hover .chevron, &:focus-within .chevron': {visibility: 'visible'},
      }}
    >
      <ButtonBase
        ref={trigger}
        disableRipple
        onClick={() => setOpen(!open)}
        aria-label={`${label}: ${value || 'not set'}`}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? menuId : undefined}
        sx={{
          flex: 1,
          minWidth: 0,
          height: '100%',
          justifyContent: 'space-between',
          gap: 1,
          pl: '9px',
          pr: '4px',
          borderRadius: 'inherit',
          typography: 'bodySmallRegular',
        }}
      >
        <Box
          component="span"
          sx={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            color: value ? 'text.primary' : 'text.disabled',
            // Leave room for the clear button while open.
            pr: open && value ? '24px' : 0,
          }}
        >
          {value || placeholder}
        </Box>
        <Box component="span" className="chevron" sx={{visibility: open ? 'visible' : 'hidden'}}>
          <Icon src={open ? chevronUp : chevronDown} />
        </Box>
      </ButtonBase>
      {open && value ? (
        <IconButton
          aria-label={`Clear ${label}`}
          onClick={() => onSave('')}
          sx={{position: 'absolute', right: 30, width: 24, height: 24, p: '2px', borderRadius: `${radius.sm}px`}}
        >
          <Icon src={xClear} />
        </IconButton>
      ) : null}

      {/* Not a modal Menu: the field's clear button must stay clickable while it's open. */}
      <Popper open={open} anchorEl={anchor} placement="bottom-start" sx={{zIndex: 'modal'}}>
        <ClickAwayListener
          onClickAway={event => {
            // The clear button unmounts as it's clicked, so its click looks
            // like one outside the field; that one keeps the menu open.
            const target = event.target as Node;
            if (target.isConnected && !anchor?.contains(target)) setOpen(false);
          }}
        >
          <Paper
            sx={{
              mt: 0.5,
              // As wide as the field it opens from.
              width: anchor?.offsetWidth,
              p: 1,
              borderRadius: `${radius['2xl']}px`,
              boxShadow: shadow.modal,
            }}
          >
            <MenuList
              id={menuId}
              autoFocusItem
              role="listbox"
              aria-label={label}
              onKeyDown={event => {
                if (event.key === 'Escape' || event.key === 'Tab') close();
              }}
              sx={{
                p: 0,
                maxHeight: 216,
                overflowY: 'auto',
                display: 'flex',
                flexDirection: 'column',
                gap: 0.5,
                ...subtleScrollbarSx,
              }}
            >
              {options.map(option => (
                <MenuItem
                  key={option}
                  role="option"
                  selected={option === value}
                  aria-selected={option === value}
                  onClick={() => {
                    onSave(option);
                    close();
                  }}
                  sx={{
                    minHeight: 40,
                    px: 1,
                    py: '9px',
                    borderRadius: `${radius.lg}px`,
                    typography: 'bodySmallMedium',
                    color: color.neutral['950'],
                  }}
                >
                  {option}
                </MenuItem>
              ))}
            </MenuList>
          </Paper>
        </ClickAwayListener>
      </Popper>
    </Box>
  );
}
