// Minimal CSF3-shaped helper types so .stories.tsx files can be typed without
// depending on @storybook/react-native yet — its React Native peers
// (react-native-reanimated, gesture-handler, bottom-sheet, safe-area-context)
// are heavier than this scaffold needs. Not part of the public package API.
// Swap these imports for the real package's `Meta`/`StoryObj` once Storybook
// itself is wired up; the shapes match.
import type {ComponentProps, ComponentType, ReactElement} from 'react';

export interface Meta<C extends ComponentType<any>> {
  title: string;
  component: C;
  args?: Partial<ComponentProps<C>>;
}

export interface StoryObj<C extends ComponentType<any>> {
  args?: Partial<ComponentProps<C>>;
  render?: (args: ComponentProps<C>) => ReactElement;
}
