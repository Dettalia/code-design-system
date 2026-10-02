import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  {ignores: ['dist', 'node_modules', 'storybook-static', 'src/theme/tokens.ts']},
  js.configs.recommended,
  tseslint.configs.recommended,
  reactHooks.configs.flat.recommended,
  {
    languageOptions: {
      globals: {...globals.browser, ...globals.node, ...globals.jest},
    },
  },
  {
    // Runs inside Figma as a plugin script body (see the file's header).
    files: ['figma/export-tokens.js'],
    languageOptions: {
      sourceType: 'script',
      parserOptions: {ecmaFeatures: {globalReturn: true}},
      globals: {figma: 'readonly', PAGE: 'readonly'},
    },
  },
);
