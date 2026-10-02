import type {Meta, StoryObj} from '@storybook/react-vite';
import {expect, waitFor, within} from 'storybook/test';
import {CardExample} from './CardExample';

const meta = {
  component: CardExample,
  tags: ['ai-generated'],
} satisfies Meta<typeof CardExample>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({canvas}) => {
    await expect(canvas.getByRole('heading', {name: 'Discovery call with Acme'})).toBeVisible();
    await expect(canvas.getByRole('button', {name: 'Share summary'})).toHaveClass(
      'MuiButton-contained',
    );
    await expect(canvas.getByRole('button', {name: 'Review action items'})).toHaveClass(
      'MuiButton-outlined',
    );
    // Body copy uses color.text.secondary (#71767d). MUI v9 ignores the older
    // color="text.secondary" form, so this guards the color="textSecondary" prop.
    const body = canvas.getByText(/Budget is confirmed/);
    await expect(getComputedStyle(body).color).toBe('rgb(113, 118, 125)');
    // Cards use radius.2xl (16px), a code-only choice; see src/theme/theme.ts.
    const card = body.closest('.MuiCard-root') as HTMLElement;
    await expect(getComputedStyle(card).borderRadius).toBe('16px');
  },
};

// The main button opens the Figma Modal; checks its geometry against Figma.
export const OpensModal: Story = {
  play: async ({canvas, canvasElement, userEvent}) => {
    await userEvent.click(canvas.getByRole('button', {name: 'Share summary'}));
    const body = within(canvasElement.ownerDocument.body);
    const dialog = await body.findByRole('dialog', {name: 'Share summary'});
    await waitFor(() => expect(dialog).toBeVisible());

    const paper = getComputedStyle(dialog);
    await expect(paper.borderRadius).toBe('16px');
    await expect(dialog.getBoundingClientRect().width).toBe(480);
    const header = getComputedStyle(dialog.querySelector('.MuiDialogTitle-root')!);
    await expect(header.padding).toBe('16px');
    await expect(header.borderBottomColor).toBe('rgb(231, 232, 233)');
    await expect(getComputedStyle(dialog.querySelector('.MuiDialogContent-root')!).padding).toBe(
      '24px',
    );
    // 40px like Figma's input. Rounded: the 22px line height is stored as the
    // ratio 22/14, which renders at 21.998px.
    const input = within(dialog).getByLabelText('Recipients').closest('.MuiOutlinedInput-root')!;
    await expect(Math.round(input.getBoundingClientRect().height)).toBe(40);

    await userEvent.click(within(dialog).getByRole('button', {name: 'Cancel'}));
    await waitFor(() => expect(body.queryByRole('dialog')).toBeNull());
  },
};

export const ShortCopy: Story = {
  args: {
    title: 'Weekly sync',
    body: '3 action items, 2 decisions.',
    primaryAction: 'Open',
    secondaryAction: 'Dismiss',
  },
};
