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
    // Figma 8117:120063 layout: top nav with search, white sidebar and page.
    await expect(canvas.getByRole('textbox', {name: 'Search'})).toBeVisible();
    await expect(canvas.getByRole('button', {name: 'Start bliro'})).toBeVisible();
    const main = canvas.getByRole('main');
    await expect(getComputedStyle(main).backgroundColor).toBe('rgb(255, 255, 255)');
    // The page scrolls, without a visible scrollbar.
    await expect(getComputedStyle(main).overflowY).toBe('auto');
    await expect(getComputedStyle(main).scrollbarWidth).toBe('none');
    await expect(main.offsetWidth - main.clientWidth).toBe(0);
  },
};

export const Companies: Story = {args: {initialRoute: 'companies'}};

// Company detail page (Figma 8032:74223) with the Ask Vicky panel beside it.
export const CompanyDetail: Story = {
  args: {initialRoute: 'companies/strategio'},
  play: async ({canvas}) => {
    // 8px between tab items.
    const [overview, meetings] = await Promise.all([
      canvas.findByRole('tab', {name: 'Overview'}),
      canvas.findByRole('tab', {name: 'Meetings'}),
    ]);
    const gap = meetings.getBoundingClientRect().left - overview.getBoundingClientRect().right;
    await expect(Math.round(gap)).toBe(8);
  },
};

// Editing company details in place (Figma 8117:120063): text fields save on
// Enter, Escape reverts, dropdowns pick or clear a value.
export const EditCompanyDetails: Story = {
  args: {initialRoute: 'companies/strategio'},
  play: async ({canvas, canvasElement, userEvent}) => {
    const body = within(canvasElement.ownerDocument.body);

    const website = await canvas.findByRole('textbox', {name: 'Website'});
    await userEvent.click(website);
    await userEvent.clear(website);
    await userEvent.type(website, 'strategio.io{Enter}');
    await expect(website).toHaveValue('strategio.io');
    await expect(website).not.toHaveFocus();

    const employees = canvas.getByRole('textbox', {name: 'Employees'});
    await userEvent.click(employees);
    await userEvent.clear(employees);
    await userEvent.type(employees, '9{Escape}');
    await expect(employees).toHaveValue('2.500+');

    const location = canvas.getByRole('button', {name: 'Location: Germany'});
    await userEvent.click(location);
    // The menu is as wide as the field.
    const menu = await body.findByRole('listbox', {name: 'Location'});
    const fieldWidth = location.parentElement!.getBoundingClientRect().width;
    await expect(menu.parentElement!.getBoundingClientRect().width).toBeCloseTo(fieldWidth, 0);
    await userEvent.click(body.getByRole('option', {name: 'Romania'}));
    await expect(canvas.getByRole('button', {name: 'Location: Romania'})).toBeVisible();
    await waitFor(() => expect(body.queryByRole('listbox')).toBeNull());

    // Clear leaves the menu open with the placeholder, then pick a new value.
    await userEvent.click(canvas.getByRole('button', {name: 'ICP fit: Core ICP'}));
    await userEvent.click(canvas.getByRole('button', {name: 'Clear ICP fit'}));
    await expect(canvas.getByRole('button', {name: 'ICP fit: not set'})).toHaveTextContent('Select ICP fit');
    await expect(body.getByRole('listbox', {name: 'ICP fit'})).toBeVisible();
    await userEvent.click(await body.findByRole('option', {name: 'OK ICP'}));
    await expect(canvas.getByRole('button', {name: 'ICP fit: OK ICP'})).toBeVisible();

    // Edits stay when switching tabs.
    await userEvent.click(canvas.getByRole('tab', {name: 'People'}));
    await userEvent.click(canvas.getByRole('tab', {name: 'Overview'}));
    await expect(await canvas.findByRole('textbox', {name: 'Website'})).toHaveValue('strategio.io');
  },
};

// Customizable company fields, from the company page: show all, add a
// multiple-choice field, fill it in, and hide a field.
export const EditFieldsOnCompanyPage: Story = {
  args: {initialRoute: 'companies/strategio'},
  play: async ({canvas, canvasElement, userEvent}) => {
    const body = within(canvasElement.ownerDocument.body);
    const details = await canvas.findByRole('region', {name: 'Company details'});
    // Seven fields: six shown until "Show all fields".
    await expect(within(details).queryByText('Renewal date')).toBeNull();
    await userEvent.click(within(details).getByRole('button', {name: 'Show all fields (7)'}));
    await expect(within(details).getByText('Renewal date')).toBeVisible();

    await userEvent.click(canvas.getByRole('button', {name: 'Edit fields'}));
    const popover = await body.findByRole('dialog', {name: 'Company details fields'});
    await userEvent.click(within(popover).getByRole('button', {name: 'Hide Industry'}));
    await expect(within(details).queryByText('Industry')).toBeNull();

    await userEvent.click(within(popover).getByRole('button', {name: 'Add field'}));
    const dialog = await body.findByRole('dialog', {name: 'Add company field'});
    await userEvent.type(within(dialog).getByLabelText('Field name'), 'Competitors');
    await userEvent.click(within(dialog).getByRole('radio', {name: /Multiple choice/}));
    await userEvent.type(within(dialog).getByRole('textbox', {name: 'Option 1'}), 'Gong{Enter}');
    await userEvent.type(within(dialog).getByRole('textbox', {name: 'Option 2'}), 'Chorus');
    await userEvent.click(within(dialog).getByRole('button', {name: 'Add field'}));
    await waitFor(() => expect(body.queryByRole('dialog', {name: 'Add company field'})).toBeNull());
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(body.queryByRole('dialog', {name: 'Company details fields'})).toBeNull());

    // The new field is on the page and takes several values.
    await userEvent.click(within(details).getByRole('button', {name: 'Competitors: not set'}));
    await userEvent.click(await body.findByRole('option', {name: 'Gong'}));
    await userEvent.click(body.getByRole('option', {name: 'Chorus'}));
    await expect(within(details).getByRole('button', {name: 'Competitors: Gong, Chorus'})).toBeVisible();
  },
};

// Settings › Company fields: reorder, edit options, delete a custom field;
// built-in fields can't be deleted.
export const CompanyFieldsSettings: Story = {
  args: {initialRoute: 'settings/company-fields'},
  play: async ({canvas, canvasElement, userEvent}) => {
    const body = within(canvasElement.ownerDocument.body);
    const list = await canvas.findByRole('list', {name: 'Company fields'});
    const names = () => within(list).getAllByRole('listitem').map(li => li.getAttribute('aria-label'));
    await expect(names()).toEqual(['Location', 'Website', 'Employees', 'ICP fit', 'Industry', 'Account owner', 'Renewal date']);

    await userEvent.click(canvas.getByRole('button', {name: 'More actions for Renewal date'}));
    await userEvent.click(await body.findByRole('menuitem', {name: 'Move up'}));
    await expect(names()[5]).toBe('Renewal date');

    // Built-in: no Delete.
    await userEvent.click(canvas.getByRole('button', {name: 'More actions for ICP fit'}));
    await expect(body.queryByRole('menuitem', {name: 'Delete'})).toBeNull();
    await userEvent.click(body.getByRole('menuitem', {name: 'Edit'}));
    const edit = await body.findByRole('dialog', {name: 'Edit “ICP fit”'});
    await userEvent.click(within(edit).getByRole('button', {name: 'Add option'}));
    await userEvent.type(within(edit).getByRole('textbox', {name: 'Option 4'}), 'Partner');
    await userEvent.click(within(edit).getByRole('button', {name: 'Save'}));
    await expect(await within(list).findByText('Single choice · 4 options')).toBeVisible();

    await userEvent.click(canvas.getByRole('button', {name: 'More actions for Industry'}));
    await userEvent.click(await body.findByRole('menuitem', {name: 'Delete'}));
    const confirm = await body.findByRole('dialog', {name: 'Delete “Industry”?'});
    await userEvent.click(within(confirm).getByRole('button', {name: 'Delete field'}));
    await waitFor(() => expect(names()).not.toContain('Industry'));

    // Names must be unique.
    await userEvent.click(canvas.getByRole('button', {name: 'Add field'}));
    const add = await body.findByRole('dialog', {name: 'Add company field'});
    await userEvent.type(within(add).getByLabelText('Field name'), 'website');
    await userEvent.click(within(add).getByRole('button', {name: 'Add field'}));
    await expect(within(add).getByText('Another field already has this name.')).toBeVisible();
  },
};

export const CompanyMeetings: Story = {args: {initialRoute: 'companies/strategio/meetings'}};

export const CompanyPeople: Story = {args: {initialRoute: 'companies/strategio/people'}};

// Companies -> Strategio -> tabs -> Vicky chat -> back to Companies.
export const CompanyClickThrough: Story = {
  args: {initialRoute: 'companies'},
  play: async ({canvas, userEvent}) => {
    await userEvent.click(await canvas.findByText('Strategio'));
    await expect(await canvas.findByRole('heading', {level: 1, name: 'Strategio'})).toBeVisible();
    await expect(canvas.getByText('Germany')).toBeVisible();
    await expect(canvas.getByRole('tab', {name: 'Overview'})).toHaveAttribute('aria-selected', 'true');
    // The Companies link stays selected on its sub-pages.
    const main = canvas.getByRole('navigation', {name: 'Main'});
    await expect(within(main).getByRole('link', {name: 'Companies'})).toHaveAttribute('aria-current', 'page');

    // "View all" meetings switches to the Meetings tab.
    await userEvent.click(canvas.getByRole('button', {name: 'View all meetings'}));
    await expect(canvas.getByRole('tab', {name: 'Meetings'})).toHaveAttribute('aria-selected', 'true');
    await expect(canvas.getByRole('region', {name: 'Upcoming meetings'})).toBeVisible();

    await userEvent.click(canvas.getByRole('tab', {name: 'People'}));
    await expect(await canvas.findByText('Maya Chen')).toBeVisible();

    await userEvent.click(canvas.getByRole('button', {name: 'Back to companies'}));
    await expect(await canvas.findByRole('heading', {level: 1, name: 'Companies'})).toBeVisible();
  },
};

// The Ask Vicky panel: a suggestion starts a chat, New chat clears it, and it collapses.
export const VickyChat: Story = {
  args: {initialRoute: 'companies/strategio'},
  play: async ({canvas, userEvent}) => {
    const vicky = await canvas.findByRole('complementary', {name: 'Ask Vicky'});
    const panel = within(vicky);
    await userEvent.click(panel.getByRole('button', {name: /main concerns/}));
    await expect(panel.getByRole('log', {name: 'Conversation'})).toHaveTextContent("Strategio's meetings");

    await userEvent.type(panel.getByRole('textbox', {name: 'Ask Vicky'}), 'Who joined last time?{Enter}');
    await expect(panel.getByText('Who joined last time?')).toBeVisible();

    await userEvent.click(panel.getByRole('button', {name: 'New chat'}));
    await expect(panel.getByText('Ask Vicky anything about this call')).toBeVisible();

    await userEvent.click(panel.getByRole('button', {name: 'Close Vicky'}));
    await expect(await canvas.findByRole('button', {name: 'Open Vicky'})).toBeVisible();
  },
};

export const MyAccount: Story = {
  args: {initialRoute: 'settings/account'},
  play: async ({canvas}) => {
    // Settings menu categories (Figma 8097:115318): 13px labels, not collapsible.
    const nav = within(await canvas.findByRole('navigation', {name: 'Settings'}));
    for (const label of ['Meetings', 'Organization', 'Connections', 'Developers']) {
      await expect(nav.queryByRole('button', {name: label})).toBeNull();
      await expect(getComputedStyle(nav.getByText(label)).fontSize).toBe('13px');
    }
  },
};

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
    const main = canvas.getByRole('navigation', {name: 'Main'});
    await userEvent.click(within(main).getByRole('link', {name: 'People'}));
    await expect(await canvas.findByText("This page isn't designed yet")).toBeVisible();
  },
};
