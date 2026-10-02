import React, {useId, useState} from 'react';
import {
  Avatar,
  Box,
  Button,
  Chip,
  Divider,
  MenuItem,
  Select,
  Typography,
  tokens,
} from '../../index';
import {DeleteAccountModal} from '../DeleteAccountModal';
import {ModalField} from '../ModalParts';
import avatarLarge from '../flow-assets/avatar-peter-120.png';
import banIcon from '../flow-assets/ban.svg';
import chevronDown from '../flow-assets/chevron-down.svg';
import flagGb from '../flow-assets/flag-gb.svg';
import flagRo from '../flow-assets/flag-ro.svg';

// "My Account" from the Bliro Web app Figma file (frame 8032:13057): profile
// form, VoiceID status and account deletion. 400px column, as in Figma.

const {color, radius, spacing, border} = tokens;

// Only languages with a Figma flag asset (Flags component: ro, gb).
const LANGUAGES = [
  {value: 'ro', label: 'Romanian', flag: flagRo},
  {value: 'en', label: 'English', flag: flagGb},
] as const;
type Language = (typeof LANGUAGES)[number]['value'];

type Profile = {firstName: string; lastName: string; primary: Language; secondary: Language};
const INITIAL: Profile = {firstName: 'Peter', lastName: 'Hoffmann', primary: 'ro', secondary: 'en'};

const Flag = ({src}: {src: string}) => (
  // Figma's flag is a 20x15 frame; the exported SVG includes its 1px outline.
  <Box component="img" src={src} alt="" sx={{display: 'block', width: 22, height: 17, m: '-1px'}} />
);

/** Figma "Dropdown": label above a 40px select with a flag, value and chevron-down. */
function LanguageSelect({
  label,
  value,
  onChange,
}: {
  label: string;
  value: Language;
  onChange: (v: Language) => void;
}) {
  const labelId = useId();
  return (
    <Box sx={{display: 'flex', flexDirection: 'column', gap: 0.5}}>
      <Typography id={labelId} variant="bodySmallSemibold" sx={{color: color.neutral['900']}}>
        {label}
      </Typography>
      <Select
        labelId={labelId}
        value={value}
        onChange={event => onChange(event.target.value as Language)}
        IconComponent={props => (
          <Box
            component="img"
            src={chevronDown}
            alt=""
            {...props}
            sx={{right: `${spacing.component.lg}px !important`, top: 'calc(50% - 10px) !important'}}
          />
        )}
        renderValue={selected => {
          const language = LANGUAGES.find(l => l.value === selected)!;
          return (
            <Box sx={{display: 'flex', alignItems: 'center', gap: 1}}>
              <Flag src={language.flag} />
              {language.label}
            </Box>
          );
        }}
        sx={theme => ({
          height: 40,
          '& .MuiSelect-select': {
            ...theme.typography.bodySmallRegular,
            color: color.neutral['900'],
            py: `${spacing.component.sm + border.width.thin}px`,
            pl: `${spacing.component.lg}px`,
            pr: '48px !important',
          },
        })}
      >
        {LANGUAGES.map(language => (
          <MenuItem
            key={language.value}
            value={language.value}
            sx={{gap: 1, typography: 'bodySmallRegular'}}
          >
            <Flag src={language.flag} />
            {language.label}
          </MenuItem>
        ))}
      </Select>
    </Box>
  );
}

const sectionTitleSx = {color: color.neutral['900']} as const;

export function MyAccountPage({
  onSaved,
  onDeleteAccount,
}: {
  onSaved?: () => void;
  onDeleteAccount?: () => void;
}) {
  const [saved, setSaved] = useState(INITIAL);
  const [profile, setProfile] = useState(INITIAL);
  const [deleting, setDeleting] = useState(false);
  const dirty = JSON.stringify(profile) !== JSON.stringify(saved);
  const set = <K extends keyof Profile>(key: K, value: Profile[K]) =>
    setProfile(p => ({...p, [key]: value}));

  return (
    <>
      <Box sx={{width: '100%', maxWidth: 1024}}>
        <Typography variant="h5" component="h1">
          My Account
        </Typography>
      </Box>

      <Box sx={{width: '100%', maxWidth: 1024, display: 'flex', flexDirection: 'column', gap: 3}}>
        <Avatar src={avatarLarge} alt="Peter Hoffmann" sx={{width: 120, height: 120}} />

        <Box sx={{width: '100%', maxWidth: 400, display: 'flex', flexDirection: 'column', gap: 5}}>
          {/* Profile form */}
          <Box
            component="form"
            aria-label="Profile"
            onSubmit={event => {
              event.preventDefault();
              setSaved(profile);
              onSaved?.();
            }}
            sx={{display: 'flex', flexDirection: 'column', gap: 4}}
          >
            <Box sx={{display: 'flex', flexDirection: 'column', gap: 2}}>
              <ModalField
                label="First Name"
                value={profile.firstName}
                onChange={e => set('firstName', e.target.value)}
              />
              <ModalField
                label="Last Name"
                value={profile.lastName}
                onChange={e => set('lastName', e.target.value)}
              />
              <LanguageSelect
                label="Primary Conversation Language"
                value={profile.primary}
                onChange={v => set('primary', v)}
              />
              <LanguageSelect
                label="Secondary Conversation Language"
                value={profile.secondary}
                onChange={v => set('secondary', v)}
              />
            </Box>
            <Box sx={{display: 'flex', gap: 1, justifyContent: 'flex-end'}}>
              {/* Cancel is always enabled (Figma) and reverts unsaved changes. */}
              <Button variant="outlined" onClick={() => setProfile(saved)}>
                Cancel
              </Button>
              {/* Save stays disabled until something changes, as in Figma. */}
              <Button variant="contained" type="submit" disabled={!dirty}>
                Save
              </Button>
            </Box>
          </Box>

          <Divider sx={{borderColor: color.neutral['100']}} />

          {/* VoiceID */}
          <Box
            component="section"
            aria-label="VoiceID"
            sx={{display: 'flex', flexDirection: 'column', gap: 1}}
          >
            <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start'}}>
              <Typography variant="bodySmallSemibold" component="h2" sx={sectionTitleSx}>
                VoiceID
              </Typography>
              <Chip
                icon={<Box component="img" src={banIcon} alt="" />}
                label="Deactivated"
                sx={{
                  height: 28,
                  px: 1.5,
                  gap: 0.5,
                  borderRadius: `${radius.full}px`,
                  bgcolor: color.background.disabled,
                  color: 'text.disabled',
                  '& .MuiChip-icon': {m: 0},
                  '& .MuiChip-label': {p: 0, typography: 'bodyXsmallSemibold'},
                }}
              />
            </Box>
            <Typography variant="bodyXsmallMedium" sx={{color: color.neutral['800']}}>
              With VoiceID, Bliro learns your voice and identifies your voice within other speakers
              in a meeting. This feature is currently unavailable because your organization
              deactivated it.
            </Typography>
          </Box>

          <Divider sx={{borderColor: color.neutral['100']}} />

          {/* Delete account */}
          <Box
            component="section"
            aria-label="Delete account"
            sx={{display: 'flex', alignItems: 'center', gap: 3}}
          >
            <Box sx={{flex: 1, display: 'flex', flexDirection: 'column', gap: 0.5}}>
              <Typography variant="bodySmallSemibold" component="h2" sx={sectionTitleSx}>
                Delete your Bliro account.
              </Typography>
              <Typography variant="bodySmallRegular" sx={{color: color.neutral['800']}}>
                This action is permanent and all of your meeting notes will be lost.
              </Typography>
            </Box>
            <Button
              variant="text"
              color="error"
              onClick={() => setDeleting(true)}
              // Figma: error.subtle background with error.default text. The
              // design system has no tonal error variant yet; hover isn't in Figma.
              sx={{
                flexShrink: 0,
                bgcolor: color.error.subtle,
                color: color.error.default,
                '&:hover': {bgcolor: color.red['100']},
              }}
            >
              Delete account
            </Button>
          </Box>
        </Box>
      </Box>

      <DeleteAccountModal
        open={deleting}
        onClose={() => setDeleting(false)}
        onConfirm={() => {
          setDeleting(false);
          onDeleteAccount?.();
        }}
      />
    </>
  );
}
