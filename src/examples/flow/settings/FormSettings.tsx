import React, {useId, useState} from 'react';
import {Avatar, Box, Button, Chip, tokens} from '../../../index';
import {DeleteAccountModal} from '../../DeleteAccountModal';
import avatarLarge from '../../flow-assets/avatar-peter-120.png';
import banIcon from '../../flow-assets/ban.svg';
import {SettingInput, SettingSelect, SettingSwitch, Segmented, useSettingsForm} from './controls';
import {SettingRow, SettingsPage, SettingsSection} from './SettingsLayout';

// Form template pages: General (Figma exploration 8153:91545) and Account.

const {color, radius} = tokens;

function SaveActions({dirty, onCancel, onSave}: {dirty: boolean; onCancel: () => void; onSave: () => void}) {
  return (
    <>
      <Button variant="outlined" disabled={!dirty} onClick={onCancel}>
        Cancel
      </Button>
      <Button variant="contained" disabled={!dirty} onClick={onSave}>
        Save
      </Button>
    </>
  );
}

/** A row whose label id is generated, for controls that need aria-labelledby. */
function Row(props: Omit<React.ComponentProps<typeof SettingRow>, 'control' | 'labelId'> & {control: (labelId: string) => React.ReactNode}) {
  const id = useId();
  return <SettingRow {...props} labelId={id} control={props.control(id)} />;
}

// --- General -------------------------------------------------------------------

const GENERAL = {
  name: 'Peter M’s Team',
  disableAppDownload: true,
  disableAutoUpdates: true,
  disableVoiceId: true,
  disclaimer: true,
  disclaimerText: 'This summary is written by AI and not by a human being.',
  remoteControl: 'visible' as 'visible' | 'stealth',
  deletion: 'periodically' as 'never' | 'instantly' | 'periodically',
  deletionDays: '14',
  meetingData: 'none' as 'none' | 'org' | 'participants',
};

export function GeneralSettings({onSaved}: {onSaved: () => void}) {
  const form = useSettingsForm(GENERAL);
  const {values: v, set} = form;
  return (
    <SettingsPage
      title="Organization"
      description="Manage your organization here."
      actions={<SaveActions dirty={form.dirty} onCancel={form.reset} onSave={() => (form.save(), onSaved())} />}
    >
      <SettingsSection title="General">
        <Row
          label="Organization name"
          help="Shown to members and in invitations."
          control={id => <SettingInput value={v.name} onChange={e => set('name', e.target.value)} inputProps={{'aria-labelledby': id}} />}
        />
        <Row
          label="Disable member app download"
          help="Members can’t download the desktop app; admins still can."
          control={id => <SettingSwitch labelId={id} checked={v.disableAppDownload} onChange={x => set('disableAppDownload', x)} />}
        />
        <Row
          label="Disable auto app updates for members"
          help="Bliro won’t update the desktop app automatically for members."
          control={id => <SettingSwitch labelId={id} checked={v.disableAutoUpdates} onChange={x => set('disableAutoUpdates', x)} />}
        />
        <Row
          label="Disable VoiceID for members"
          help="Members can’t turn on VoiceID."
          control={id => <SettingSwitch labelId={id} checked={v.disableVoiceId} onChange={x => set('disableVoiceId', x)} />}
        />
      </SettingsSection>

      <SettingsSection title="Summary">
        <Row
          label="Summary disclaimer"
          help="Added at the end of every summary."
          control={id => <SettingSwitch labelId={id} checked={v.disclaimer} onChange={x => set('disclaimer', x)} />}
        >
          {v.disclaimer ? (
            <SettingInput
              width="100%"
              value={v.disclaimerText}
              onChange={e => set('disclaimerText', e.target.value)}
              inputProps={{'aria-label': 'Disclaimer text'}}
            />
          ) : null}
        </Row>
      </SettingsSection>

      <SettingsSection title="Desktop app">
        <Row
          label="Remote control"
          help="How the desktop app appears when someone controls a member’s screen."
          description={v.remoteControl === 'visible' ? 'Shows the desktop app on remote control.' : 'Shows a notification only; the desktop app is hidden.'}
          control={id => (
            <SettingSelect
              labelId={id}
              value={v.remoteControl}
              onChange={x => set('remoteControl', x)}
              options={[
                {value: 'visible', label: 'Visible'},
                {value: 'stealth', label: 'Stealth'},
              ]}
            />
          )}
        />
      </SettingsSection>

      <SettingsSection title="Privacy">
        <Row
          label="Transcript data deletion"
          help="When transcripts are deleted. Summaries and notes are kept."
          control={id => (
            <Segmented
              labelId={id}
              value={v.deletion}
              onChange={x => set('deletion', x)}
              options={[
                {value: 'never', label: 'Never'},
                {value: 'instantly', label: 'Instantly'},
                {value: 'periodically', label: 'Periodically'},
              ]}
            />
          )}
        >
          {v.deletion === 'periodically' ? (
            <Box sx={{display: 'flex', alignItems: 'center', gap: 1.5, typography: 'bodySmallRegular', color: 'text.secondary'}}>
              Delete transcription data after
              <SettingInput
                width={64}
                value={v.deletionDays}
                onChange={e => set('deletionDays', e.target.value.replace(/\D/g, ''))}
                inputProps={{'aria-label': 'Days before deletion', inputMode: 'numeric', style: {textAlign: 'center'}}}
                sx={{px: 1}}
              />
              days
            </Box>
          ) : null}
        </Row>
        <Row
          label="Meeting data"
          help="Who can see meeting recordings and summaries by default."
          control={id => (
            <SettingSelect
              labelId={id}
              value={v.meetingData}
              onChange={x => set('meetingData', x)}
              options={[
                {value: 'none', label: 'No sharing'},
                {value: 'participants', label: 'Meeting participants'},
                {value: 'org', label: 'Whole organization'},
              ]}
            />
          )}
        />
      </SettingsSection>
    </SettingsPage>
  );
}

// --- Account -------------------------------------------------------------------

const ACCOUNT = {firstName: 'Peter', lastName: 'Hoffmann', primary: 'ro' as 'ro' | 'en', secondary: 'en' as 'ro' | 'en'};
const LANGUAGES = [
  {value: 'ro', label: 'Romanian'},
  {value: 'en', label: 'English'},
] as const;

export function AccountSettings({onSaved, onDeleteAccount}: {onSaved: () => void; onDeleteAccount: () => void}) {
  const form = useSettingsForm(ACCOUNT);
  const {values: v, set} = form;
  const [deleting, setDeleting] = useState(false);
  return (
    <SettingsPage
      title="My account"
      description="Manage your personal details and preferences."
      actions={<SaveActions dirty={form.dirty} onCancel={form.reset} onSave={() => (form.save(), onSaved())} />}
    >
      <SettingsSection title="Profile">
        <SettingRow
          label="Photo"
          description="Shown to your team and in meeting notes."
          control={<Avatar src={avatarLarge} alt="Peter Hoffmann" sx={{width: 56, height: 56}} />}
        />
        <Row
          label="First name"
          control={id => <SettingInput value={v.firstName} onChange={e => set('firstName', e.target.value)} inputProps={{'aria-labelledby': id}} />}
        />
        <Row
          label="Last name"
          control={id => <SettingInput value={v.lastName} onChange={e => set('lastName', e.target.value)} inputProps={{'aria-labelledby': id}} />}
        />
      </SettingsSection>

      <SettingsSection title="Conversation languages" description="Bliro transcribes your meetings in these languages.">
        <Row
          label="Primary language"
          control={id => <SettingSelect labelId={id} value={v.primary} onChange={x => set('primary', x)} options={LANGUAGES} />}
        />
        <Row
          label="Secondary language"
          control={id => <SettingSelect labelId={id} value={v.secondary} onChange={x => set('secondary', x)} options={LANGUAGES} />}
        />
      </SettingsSection>

      <SettingsSection title="VoiceID">
        <SettingRow
          label="VoiceID"
          description="Bliro learns your voice and identifies it among other speakers. Unavailable because your organization turned it off."
          control={
            <Chip
              icon={<Box component="img" src={banIcon} alt="" />}
              label="Deactivated"
              sx={{height: 28, px: 1.5, gap: 0.5, borderRadius: `${radius.full}px`, bgcolor: color.background.disabled, color: 'text.disabled', '& .MuiChip-icon': {m: 0}, '& .MuiChip-label': {p: 0, typography: 'bodyXsmallSemibold'}}}
            />
          }
        />
      </SettingsSection>

      <SettingsSection title="Danger zone">
        <SettingRow
          label="Delete your Bliro account"
          description="This is permanent: all of your meeting notes will be lost."
          control={
            <Button
              variant="text"
              color="error"
              onClick={() => setDeleting(true)}
              sx={{bgcolor: color.error.subtle, color: color.error.default, '&:hover': {bgcolor: color.red['100']}}}
            >
              Delete account
            </Button>
          }
        />
      </SettingsSection>

      <DeleteAccountModal
        open={deleting}
        onClose={() => setDeleting(false)}
        onConfirm={() => {
          setDeleting(false);
          onDeleteAccount();
        }}
      />
    </SettingsPage>
  );
}
