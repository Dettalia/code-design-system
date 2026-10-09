import type {Meta, StoryObj} from '@storybook/react-vite';
import {expect, waitFor} from 'storybook/test';
import {Switch} from '../index';

// Figma "Toggle" (Bliro Design System): 40x20, orange when on, neutral/200 when off.
const meta = {
  component: Switch,
  tags: ['ai-generated'],
  args: {slotProps: {input: {'aria-label': 'Summary disclaimer'}}},
} satisfies Meta<typeof Switch>;

export default meta;
type Story = StoryObj<typeof meta>;

export const On: Story = {
  args: {defaultChecked: true},
  play: async ({canvas, canvasElement, userEvent}) => {
    const root = canvasElement.querySelector('.MuiSwitch-root')!;
    await expect(root.getBoundingClientRect().width).toBe(40);
    await expect(root.getBoundingClientRect().height).toBe(20);
    const track = canvasElement.querySelector('.MuiSwitch-track')!;
    await expect(getComputedStyle(track).backgroundColor).toBe('rgb(242, 104, 53)');
    await userEvent.click(canvas.getByRole('switch', {name: 'Summary disclaimer'}));
    // The track color animates; wait for it to settle.
    await waitFor(() => expect(getComputedStyle(track).backgroundColor).toBe('rgb(208, 209, 212)'));
  },
};

export const Off: Story = {};

export const Disabled: Story = {args: {defaultChecked: true, disabled: true}};
