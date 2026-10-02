import type {Meta, StoryObj} from '@storybook/react-vite';
import {expect, within} from 'storybook/test';
import {FormControl, InputLabel, MenuItem, Select} from '../index';

const meta = {
  component: Select,
  tags: ['ai-generated'],
  args: {
    labelId: 'share-via-label',
    label: 'Share via',
    defaultValue: 'email',
    children: [
      <MenuItem key="email" value="email">
        Email
      </MenuItem>,
      <MenuItem key="slack" value="slack">
        Slack
      </MenuItem>,
      <MenuItem key="crm" value="crm">
        CRM
      </MenuItem>,
    ],
  },
  render: args => (
    <FormControl sx={{minWidth: 200}}>
      <InputLabel id="share-via-label">Share via</InputLabel>
      <Select {...args} />
    </FormControl>
  ),
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

// The option list is portalled into document.body.
export const Default: Story = {
  play: async ({canvas, canvasElement, userEvent}) => {
    await userEvent.click(canvas.getByRole('combobox'));
    const body = within(canvasElement.ownerDocument.body);
    await userEvent.click(await body.findByRole('option', {name: 'Slack'}));
    await expect(canvas.getByRole('combobox')).toHaveTextContent('Slack');
  },
};

export const Small: Story = {args: {size: 'small'}};

export const Disabled: Story = {args: {disabled: true}};
