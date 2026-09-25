import {reactNativeThemeFormat} from './formats/react-native-theme.mjs';
import {muiThemeFormat} from './formats/mui-theme.mjs';

export default {
  source: ['tokens/figma-export.json', 'tokens/typography-export.json'],
  hooks: {
    formats: {
      [reactNativeThemeFormat.name]: reactNativeThemeFormat.format,
      [muiThemeFormat.name]: muiThemeFormat.format,
    },
  },
  platforms: {
    reactNative: {
      buildPath: 'src/theme/',
      files: [
        {
          destination: 'tokens.ts',
          format: reactNativeThemeFormat.name,
        },
      ],
    },
    mui: {
      buildPath: 'web/',
      files: [
        {
          destination: 'mui-theme.ts',
          format: muiThemeFormat.name,
        },
      ],
    },
  },
};
