import type {Meta, StoryObj} from '@storybook/react-vite';
import {expect, within} from 'storybook/test';
import {MeetingsPage} from './MeetingsPage';

const meta = {
  component: MeetingsPage,
  tags: ['ai-generated'],
  parameters: {layout: 'fullscreen'},
} satisfies Meta<typeof MeetingsPage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({canvas}) => {
    await expect(canvas.getByRole('heading', {level: 1, name: 'My meetings'})).toBeVisible();
    // 3 upcoming (dashed) and 9 previous (solid) meeting cards, as in Figma.
    const upcoming = within(canvas.getByRole('region', {name: 'Upcoming meetings'}));
    const previous = within(canvas.getByRole('region', {name: 'Previous meetings'}));
    await expect(upcoming.getAllByRole('heading', {level: 3})).toHaveLength(3);
    await expect(previous.getAllByRole('heading', {level: 3})).toHaveLength(9);
    const firstUpcoming = upcoming.getAllByRole('heading', {level: 3})[0].closest('.MuiCard-root')!;
    await expect(getComputedStyle(firstUpcoming).borderStyle).toBe('dashed');
    // The active menu item uses color.action.active-bg (#fef0ea).
    const active = canvas.getByRole('button', {name: 'My meetings'});
    await expect(active).toHaveClass('Mui-selected');
    await expect(getComputedStyle(active).backgroundColor).toBe('rgb(254, 240, 234)');
  },
};
