import type {StorybookConfig} from '@storybook/react-webpack5';

const config: StorybookConfig = {
  stories: ['../src/components/**/*.stories.tsx'],
  addons: ['@storybook/addon-react-native-web', '@storybook/addon-a11y'],
  framework: {
    name: '@storybook/react-webpack5',
    options: {},
  },
  webpackFinal: async webpackConfig => {
    // @testing-library/react-native (used by co-located *.test.tsx files, not
    // by any story) ends up reachable from the preview bundle and its
    // `dist/helpers` does `require('console')` — a Node core module with no
    // browser build. Stub it out rather than bundling a Node polyfill for it.
    webpackConfig.resolve ??= {};
    webpackConfig.resolve.fallback = {
      ...webpackConfig.resolve.fallback,
      console: false,
    };
    return webpackConfig;
  },
};

export default config;
