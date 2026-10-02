import type {Meta, StoryObj} from '@storybook/react-vite';
import {
  ButtonsSection,
  DataDisplaySection,
  FeedbackSection,
  InputsSection,
  NavigationSection,
  SurfacesSection,
} from './showcase/ComponentSections';

// MUI components with the theme applied. Use the "Theme" toolbar switch to
// compare against MUI's default theme. The chips on each demo list the theme
// inputs (token mappings and overrides) that shape it.
const meta: Meta = {
  title: 'Themed components',
  parameters: {layout: 'padded'},
};

export default meta;

type Story = StoryObj;

export const Buttons: Story = {render: () => <ButtonsSection />};
export const Inputs: Story = {render: () => <InputsSection />};
export const Feedback: Story = {render: () => <FeedbackSection />};
export const DataDisplay: Story = {name: 'Data display', render: () => <DataDisplaySection />};
export const Navigation: Story = {render: () => <NavigationSection />};
export const Surfaces: Story = {render: () => <SurfacesSection />};
