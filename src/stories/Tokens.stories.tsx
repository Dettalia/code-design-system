import type {Meta, StoryObj} from '@storybook/react-vite';
import {theme} from '../index';
import {
  ColorSection,
  PaletteMappingSection,
  RadiusBorderSection,
  ShadowSection,
  SpacingSection,
  TypographySection,
} from './showcase/TokenSections';

// The Figma tokens (tokens/figma-export.json) and how style-dictionary/mui-mapping.mjs
// applies them to the MUI theme. Always shows the Bliro values.
const meta: Meta = {
  title: 'Tokens',
  parameters: {layout: 'padded'},
};

export default meta;

type Story = StoryObj;

export const Colors: Story = {render: () => <ColorSection />};
export const MuiPalette: Story = {
  name: 'MUI palette',
  render: () => <PaletteMappingSection theme={theme} />,
};
export const Typography: Story = {render: () => <TypographySection />};
export const Spacing: Story = {render: () => <SpacingSection theme={theme} />};
export const RadiusAndBorders: Story = {
  name: 'Radius & borders',
  render: () => <RadiusBorderSection />,
};
export const Shadows: Story = {
  name: 'Shadows & elevation',
  render: () => <ShadowSection theme={theme} />,
};
