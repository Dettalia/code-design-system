import {muiThemeFormat} from './formats/mui-theme.mjs';

export default {
  source: ['tokens/figma-export.json'],
  hooks: {
    formats: {
      [muiThemeFormat.name]: muiThemeFormat.format,
    },
  },
  platforms: {
    mui: {
      buildPath: 'src/theme/',
      files: [
        {
          destination: 'tokens.ts',
          format: muiThemeFormat.name,
        },
      ],
    },
  },
};
