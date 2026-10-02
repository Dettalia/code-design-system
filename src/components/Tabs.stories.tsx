import React, {useState} from 'react';
import type {Meta, StoryObj} from '@storybook/react-vite';
import {expect} from 'storybook/test';
import {Tab, Tabs, type TabsProps} from '../index';

function MeetingTabs(props: TabsProps) {
  const [value, setValue] = useState(0);
  return (
    <Tabs value={value} onChange={(_, next) => setValue(next)} {...props}>
      <Tab label="Summary" />
      <Tab label="Transcript" />
      <Tab label="Action items" />
      <Tab label="Archived" disabled />
    </Tabs>
  );
}

const meta = {
  component: Tabs,
  tags: ['ai-generated'],
  render: args => <MeetingTabs {...args} />,
} satisfies Meta<typeof Tabs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({canvas, userEvent}) => {
    const transcript = canvas.getByRole('tab', {name: 'Transcript'});
    await userEvent.click(transcript);
    await expect(transcript).toHaveAttribute('aria-selected', 'true');
  },
};

export const SecondaryIndicator: Story = {
  args: {textColor: 'secondary', indicatorColor: 'secondary'},
};

export const Centered: Story = {args: {centered: true}};
