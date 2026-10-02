import type {Meta, StoryObj} from '@storybook/react-vite';
import {expect, fn, waitFor, within} from 'storybook/test';
import {CompaniesPage} from './CompaniesPage';

const meta = {
  component: CompaniesPage,
  tags: ['ai-generated'],
  args: {onOpenCompany: fn()},
  parameters: {layout: 'fullscreen'},
} satisfies Meta<typeof CompaniesPage>;

export default meta;
type Story = StoryObj<typeof meta>;

const rowNames = (table: HTMLElement) =>
  within(table)
    .getAllByRole('row')
    .slice(1)
    .map(row => row.getAttribute('aria-label')?.replace('Open ', ''));

export const Default: Story = {
  play: async ({canvas, userEvent, args}) => {
    await expect(canvas.getByRole('heading', {level: 1, name: 'Companies'})).toBeVisible();
    const table = canvas.getByRole('table', {name: 'Companies'});
    // The table frame is neutral/50 (#eff0f0).
    const frame = table.parentElement!.parentElement!;
    await expect(getComputedStyle(frame).backgroundColor).toBe('rgb(239, 240, 240)');
    // Sorted by company name, A to Z, as in Figma.
    await expect(rowNames(table)[0]).toBe('ACME');
    await expect(canvas.getByRole('columnheader', {name: /Company/})).toHaveAttribute(
      'aria-sort',
      'ascending',
    );

    // Sorting by meetings puts the most meetings first.
    await userEvent.click(canvas.getByRole('button', {name: 'Meetings'}));
    await expect(rowNames(table)[0]).toBe('Meridian Bank');

    // Rows open the company, by mouse or keyboard.
    await userEvent.click(within(table).getByRole('row', {name: 'Open Strategio'}));
    await expect(args.onOpenCompany).toHaveBeenCalledWith(
      expect.objectContaining({id: 'strategio'}),
    );
  },
};

export const SearchAndNoResults: Story = {
  play: async ({canvas, userEvent}) => {
    const search = canvas.getByRole('searchbox', {name: 'Search for a company'});
    await userEvent.type(search, 'durran');
    await expect(rowNames(canvas.getByRole('table'))).toEqual(['Durran']);

    // The × in the field clears the query.
    await userEvent.click(canvas.getByRole('button', {name: 'Clear search'}));
    await expect(search).toHaveValue('');
    await expect(rowNames(canvas.getByRole('table'))).toHaveLength(8);

    // No results: a message with its own Clear search button.
    await userEvent.type(search, 'zzz');
    const status = canvas.getByRole('status');
    await expect(status).toHaveTextContent('No companies match “zzz”');
    await userEvent.click(within(status).getByRole('button', {name: 'Clear search'}));
    await expect(canvas.getByRole('table')).toBeVisible();
  },
};

export const AddCompany: Story = {
  play: async ({canvas, canvasElement, userEvent}) => {
    await userEvent.click(canvas.getByRole('button', {name: 'Add company'}));
    const body = within(canvasElement.ownerDocument.body);
    const dialog = await body.findByRole('dialog', {name: 'Add company'});
    await waitFor(() => expect(dialog).toBeVisible());
    const submit = within(dialog).getByRole('button', {name: 'Add company'});
    await expect(submit).toBeDisabled();
    await userEvent.type(within(dialog).getByLabelText(/Company name/), 'Bliro');
    await userEvent.type(within(dialog).getByLabelText('Website'), 'https://bliro.io');
    await userEvent.click(submit);
    await waitFor(() => expect(body.queryByRole('dialog')).toBeNull());
    const row = within(canvas.getByRole('table')).getByRole('row', {name: 'Open Bliro'});
    await expect(row).toHaveTextContent('bliro.io');
    await expect(row).toHaveTextContent('—');
  },
};
