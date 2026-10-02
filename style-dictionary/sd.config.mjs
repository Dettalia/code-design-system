import {readFileSync} from 'node:fs';
import {checksum} from '../scripts/lib/token-export.mjs';
import {muiThemeFormat} from './formats/mui-theme.mjs';

const SOURCE = 'tokens/figma-export.json';

// SOURCE is written only by `npm run tokens:import`. A checksum mismatch means
// it was edited by hand: change the token in Figma and re-sync instead, so
// Figma stays the single source of truth.
const {$metadata, ...exported} = JSON.parse(readFileSync(SOURCE, 'utf8'));
const {checksum: expected, ...metadata} = $metadata ?? {};
if (checksum(JSON.stringify({$metadata: metadata, ...exported})) !== expected) {
  throw new Error(
    `${SOURCE} does not match its Figma export checksum, so it was edited by hand. ` +
      'Make the change in Figma and run /sync-figma-tokens instead.',
  );
}

export default {
  source: [SOURCE],
  preprocessors: ['bliro/strip-metadata'],
  hooks: {
    preprocessors: {
      // Export bookkeeping (source file, checksum), not tokens.
      'bliro/strip-metadata': document => {
        const tokens = {...document};
        delete tokens.$metadata;
        return tokens;
      },
    },
    formats: {
      [muiThemeFormat.name]: muiThemeFormat.format,
    },
  },
  platforms: {
    mui: {
      // Full-path names, so tokens like color.text.disabled and
      // color.border.disabled don't collide.
      transforms: ['name/kebab'],
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
