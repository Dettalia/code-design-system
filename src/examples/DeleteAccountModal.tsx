import React, {useId, useState} from 'react';
import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  Typography,
  type DialogProps,
} from '../index';
import {AlertTriangleIcon, ModalHeader} from './ModalParts';

export type DeleteAccountModalProps = Pick<DialogProps, 'open'> & {
  onClose: () => void;
  onConfirm: () => void;
};

/**
 * Figma Modal "Delete account" (Bliro Design System, node 12340:6286): 560px,
 * warning icon, and a checkbox that has to be ticked before deleting.
 */
export function DeleteAccountModal({open, onClose, onConfirm}: DeleteAccountModalProps) {
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
