import type {Meta, StoryObj} from '@storybook/react-vite';
import {expect, waitFor, within} from 'storybook/test';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '../index';

const meta = {
  component: Dialog,
  tags: ['ai-generated'],
  args: {
    open: true,
    children: (
      <>
        <DialogTitle>Share meeting summary?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            The summary and action items will be sent to all 4 attendees.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button>Cancel</Button>
          <Button variant="contained">Share</Button>
        </DialogActions>
      </>
    ),
  },
} satisfies Meta<typeof Dialog>;

export default meta;
type Story = StoryObj<typeof meta>;

// MUI portals the dialog into document.body, outside the story canvas, and
// fades it in, so wait for the transition before checking visibility.
export const Open: Story = {
  play: async ({canvasElement}) => {
    const body = within(canvasElement.ownerDocument.body);
    const dialog = await body.findByRole('dialog', {name: 'Share meeting summary?'});
    await waitFor(() => expect(dialog).toBeVisible());
  },
};

export const FullWidth: Story = {args: {fullWidth: true, maxWidth: 'sm'}};
