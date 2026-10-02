import type {Meta, StoryObj} from '@storybook/react-vite';
import {expect, fn, waitFor, within} from 'storybook/test';
import {ShareSummaryModal} from './ShareSummaryModal';

const meta = {
  component: ShareSummaryModal,
  tags: ['ai-generated'],
  args: {open: true, onClose: fn(), onShare: fn()},
  parameters: {layout: 'fullscreen'},
} satisfies Meta<typeof ShareSummaryModal>;

export default meta;
type Story = StoryObj<typeof meta>;

// The modal is portalled into document.body.
export const Open: Story = {
  play: async ({canvasElement, userEvent, args}) => {
    const body = within(canvasElement.ownerDocument.body);
    const dialog = await body.findByRole('dialog', {name: 'Share summary'});
    await waitFor(() => expect(dialog).toBeVisible());
    await userEvent.type(within(dialog).getByLabelText('Recipients'), 'anna@acme.com');
    await userEvent.click(within(dialog).getByRole('button', {name: 'Share'}));
    await expect(args.onShare).toHaveBeenCalledWith('anna@acme.com');
    await expect(args.onClose).toHaveBeenCalled();
  },
};
