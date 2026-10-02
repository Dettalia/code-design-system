import type {Meta, StoryObj} from '@storybook/react-vite';
import {expect, waitFor, within} from 'storybook/test';
import {FlowPrototype} from './FlowPrototype';

const meta = {
  component: FlowPrototype,
  tags: ['ai-generated'],
  args: {initialRoute: 'meetings'},
  parameters: {layout: 'fullscreen'},
} satisfies Meta<typeof FlowPrototype>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Meetings: Story = {
  play: async ({canvas}) => {
    // App background behind the sidebar and the white panel: #fafafa.
    const panel = canvas.getByRole('main');
    const app = panel.parentElement!.parentElement!;
    await expect(getComputedStyle(app).backgroundColor).toBe('rgb(250, 250, 250)');
    await expect(getComputedStyle(panel).backgroundColor).toBe('rgb(255, 255, 255)');
  },
};

export const Companies: Story = {args: {initialRoute: 'companies'}};

export const MyAccount: Story = {args: {initialRoute: 'settings/account'}};

// The Figma flow: Meetings -> Companies -> Settings / My account -> Back to home.
export const ClickThrough: Story = {
  play: async ({canvas, canvasElement, userEvent}) => {
    const main = canvas.getByRole('navigation', {name: 'Main'});
    await expect(within(main).getByRole('link', {name: 'Meetings'})).toHaveAttribute(
      'aria-current',
      'page',
    );

    await userEvent.click(within(main).getByRole('link', {name: 'Companies'}));
    await expect(await canvas.findByRole('heading', {level: 1, name: 'Companies'})).toBeVisible();

    await userEvent.click(within(main).getByRole('link', {name: 'Settings'}));
    await expect(await canvas.findByRole('heading', {level: 1, name: 'My Account'})).toBeVisible();
    const settings = canvas.getByRole('navigation', {name: 'Settings'});
    await expect(within(settings).getByRole('link', {name: 'My account'})).toHaveAttribute(
      'aria-current',
      'page',
    );

    // Save is enabled only after a change; saving shows a confirmation.
    const save = canvas.getByRole('button', {name: 'Save'});
    await expect(save).toBeDisabled();
    const firstName = canvas.getByLabelText('First Name');
    await userEvent.clear(firstName);
    await userEvent.type(firstName, 'Pete');
    await expect(save).toBeEnabled();
    await userEvent.click(save);
    const body = within(canvasElement.ownerDocument.body);
    // The confirmation animates in; wait for it to finish.
    const confirmation = await body.findByText('Changes saved');
    await waitFor(() => expect(confirmation).toBeVisible());
    await expect(save).toBeDisabled();

    // Delete account opens the Figma "Delete account" modal.
    await userEvent.click(canvas.getByRole('button', {name: 'Delete account'}));
    const dialog = await body.findByRole('dialog', {name: 'Delete account'});
    await waitFor(() => expect(dialog).toBeVisible());
    await userEvent.click(within(dialog).getByRole('button', {name: 'Cancel'}));
    await waitFor(() => expect(body.queryByRole('dialog')).toBeNull());

    await userEvent.click(canvas.getByRole('link', {name: 'Back to home'}));
    await expect(await canvas.findByRole('heading', {level: 1, name: 'My meetings'})).toBeVisible();
  },
};

// Sidebar sections without a design yet open a placeholder.
export const NotDesignedPage: Story = {
  play: async ({canvas, userEvent}) => {
    await userEvent.click(canvas.getByRole('link', {name: 'Contacts'}));
    await expect(await canvas.findByText("This page isn't designed yet")).toBeVisible();
  },
};
