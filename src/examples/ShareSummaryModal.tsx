import React, {useId, useState} from 'react';
import {Button, Dialog, DialogActions, DialogContent, SvgIcon, type SvgIconProps} from '../index';
import {ModalField, ModalHeader} from './ModalParts';

const MailIcon = (props: SvgIconProps) => (
  <SvgIcon {...props}>
    <path d="M20 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2zm0 2v.5l-8 5-8-5V6h16zM4 18V8.9l7.5 4.7a1 1 0 0 0 1 0L20 8.9V18H4z" />
  </SvgIcon>
);

export interface ShareSummaryModalProps {
  open: boolean;
  onClose: () => void;
  onShare?: (recipients: string) => void;
}

/**
 * Figma "Modal" (node 12340:4304) with a simple header, one input field and a
 * Cancel / primary footer. Spacing, divider, radius and shadow come from the
 * theme (src/theme/components/dialog.ts); the header and field from ModalParts.
 */
export function ShareSummaryModal({open, onClose, onShare}: ShareSummaryModalProps) {
  const titleId = useId();
  const [recipients, setRecipients] = useState('');

  return (
    <Dialog open={open} onClose={onClose} aria-labelledby={titleId}>
      <ModalHeader id={titleId} title="Share summary" onClose={onClose} />
      <DialogContent>
        <ModalField
          label="Recipients"
          icon={<MailIcon />}
          placeholder="name@company.com"
          value={recipients}
          onChange={event => setRecipients(event.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" onClick={onClose}>
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={() => {
            onShare?.(recipients);
            onClose();
          }}
        >
          Share
        </Button>
      </DialogActions>
    </Dialog>
  );
}
