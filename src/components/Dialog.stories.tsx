import React, {useId, useState} from 'react';
import type {Meta, StoryObj} from '@storybook/react-vite';
import {expect, fn, waitFor, within} from 'storybook/test';
import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  SvgIcon,
  Typography,
  type DialogProps,
  type SvgIconProps,
} from '../index';
import {AlertTriangleIcon, ModalField, ModalHeader} from '../examples/ModalParts';

// The Figma "Modal" examples (Bliro Design System, section 12340:4936). Dialog,
// DialogTitle, DialogContent and DialogActions are styled by the theme; the
// header and fields come from src/examples/ModalParts.tsx.

const ScrollIcon = (props: SvgIconProps) => (
  <SvgIcon {...props}>
    <path d="M7 3h11a3 3 0 0 1 3 3v1h-3v11a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3v-2h3V6a3 3 0 0 1 1-2.2V3zm2 2a1 1 0 0 0-1 1v10h7v2a1 1 0 1 0 2 0V6a3 3 0 0 1 .2-1H9zm1 3h5v2h-5V8zm0 4h5v2h-5v-2z" />
  </SvgIcon>
);

type ModalProps = Pick<DialogProps, 'open'> & {onClose: () => void; onConfirm: () => void};

function DeleteMeetingModal({open, onClose, onConfirm}: ModalProps) {
  const titleId = useId();
  return (
    <Dialog open={open} onClose={onClose} aria-labelledby={titleId}>
      <ModalHeader id={titleId} title="Delete meeting" onClose={onClose} />
      <DialogContent>
        <DialogContentText>
          Are you sure you want to delete this meeting? This action cannot be undone.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="contained" color="error" onClick={onConfirm}>
          Yes, delete meeting
        </Button>
      </DialogActions>
    </Dialog>
  );
}

function CreateGroupModal({open, onClose, onConfirm}: ModalProps) {
  const titleId = useId();
  return (
    <Dialog open={open} onClose={onClose} aria-labelledby={titleId}>
      <ModalHeader id={titleId} title="Create group" onClose={onClose} />
      <DialogContent>
        <ModalField label="Title" icon={<ScrollIcon />} defaultValue="Memory scrolls" />
        <ModalField label="Description" multiline placeholder="What is your group about?" />
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="contained" onClick={onConfirm}>
          Continue
        </Button>
      </DialogActions>
    </Dialog>
  );
}

function DeleteAccountModal({open, onClose, onConfirm}: ModalProps) {
  const titleId = useId();
  const checkboxId = useId();
  const [acknowledged, setAcknowledged] = useState(false);
  return (
    // Figma's wide variant: 560px.
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby={titleId}
      slotProps={{paper: {sx: {width: 560}}}}
    >
      <ModalHeader
        id={titleId}
        title="Delete account"
        onClose={onClose}
        icon={<AlertTriangleIcon color="error" />}
      />
      <DialogContent>
        <DialogContentText>
          Deleting your account will permanently remove all your data, including meeting history,
          summaries, and any personalized settings. This action cannot be undone. If you simply want
          to stop using the service, you can log out instead.
        </DialogContentText>
        <Box sx={{display: 'flex', alignItems: 'center', gap: 2}}>
          <Checkbox
            id={checkboxId}
            color="success"
            checked={acknowledged}
            onChange={event => setAcknowledged(event.target.checked)}
            sx={{p: 0}}
          />
          <Typography component="label" htmlFor={checkboxId} variant="bodySmallSemibold">
            I acknowledge this is an irreversible action and that this account will be permanently
            deleted.
          </Typography>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="contained" color="error" disabled={!acknowledged} onClick={onConfirm}>
          Delete account
        </Button>
      </DialogActions>
    </Dialog>
  );
}

const meta = {
  component: DeleteMeetingModal,
  tags: ['ai-generated'],
  args: {open: true, onClose: fn(), onConfirm: fn()},
  parameters: {layout: 'fullscreen'},
} satisfies Meta<typeof DeleteMeetingModal>;

export default meta;
type Story = StoryObj<typeof meta>;

const dialogIn = async (canvasElement: HTMLElement, name: string) => {
  const body = within(canvasElement.ownerDocument.body);
  const dialog = await body.findByRole('dialog', {name});
  // MUI fades dialogs in; wait for the transition before checking visibility.
  await waitFor(() => expect(dialog).toBeVisible());
  return dialog;
};

// Figma: "Delete meeting" (node 12340:6244)
export const DeleteMeeting: Story = {
  play: async ({canvasElement}) => {
    const dialog = await dialogIn(canvasElement, 'Delete meeting');
    // Title is Subheading 2; body copy is Body/Normal/Regular in text.primary.
    const title = dialog.querySelector('.MuiDialogTitle-root')!;
    await expect(getComputedStyle(title).fontSize).toBe('20px');
    const text = within(dialog).getByText(/Are you sure/);
    await expect(getComputedStyle(text).fontSize).toBe('16px');
    await expect(getComputedStyle(text).color).toBe('rgb(19, 26, 38)');
  },
};

// Figma: "Create group" (node 12340:6198)
export const CreateGroup: Story = {
  render: args => <CreateGroupModal {...args} />,
};

// Figma: "Delete account" (node 12340:6286), 560px with a lead icon. The
// destructive action stays disabled until the checkbox is ticked.
export const DeleteAccount: Story = {
  render: args => <DeleteAccountModal {...args} />,
  play: async ({canvasElement, userEvent, args}) => {
    const dialog = await dialogIn(canvasElement, 'Delete account');
    await expect(dialog.getBoundingClientRect().width).toBe(560);
    const confirm = within(dialog).getByRole('button', {name: 'Delete account'});
    await expect(confirm).toBeDisabled();
    await userEvent.click(within(dialog).getByRole('checkbox'));
    await expect(confirm).toBeEnabled();
    await userEvent.click(confirm);
    await expect(args.onConfirm).toHaveBeenCalledTimes(1);
  },
};
