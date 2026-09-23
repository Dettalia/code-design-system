# @dettalia/design-system

Bliro's cross-platform design system for React Native and React Native Web.

## Status

Build tooling, theme/token pipeline, and a first set of primitives (Button, Text, TextInput,
Card, Badge).

## Development

```bash
npm install
npm run build             # tokens:build -> tsup -> dist (ESM + CJS + .d.ts)
npm run dev                # tsup --watch
npm run typecheck
npm run lint
npm run format
npm test                   # jest
npm run storybook          # browser preview at http://localhost:6006
npm run build-storybook    # static Storybook build
npm run changeset          # record a change for the next release
```

## Structure

- `src/tokens` — design tokens (color, spacing, typography, etc.)
- `src/theme` — theme composition and context, including the generated `tokens.ts` (see below)
- `src/components` — UI components

## Design tokens

`tokens/figma-export.json` is the single source of truth for tokens, exported from Figma.
[Style Dictionary](https://styledictionary.com) reads it and generates two platform-specific outputs
(via `style-dictionary/sd.config.mjs` and the custom formats in `style-dictionary/formats/`):

- `src/theme/tokens.ts` — a plain TS theme object shaped for React Native (numeric spacing/radii,
  string `fontWeight`, hex color strings). Consumed directly by this library.
- `web/mui-theme.ts` — the same tokens mapped into an MUI `createTheme()` config, for the web app.
  Not part of this package's own build — copy/import it from whatever repo hosts the web app.

Both files are generated, not hand-edited — they're gitignored and rebuilt from the JSON.

**After changing `tokens/figma-export.json`, regenerate both outputs with:**

```bash
npm run tokens:build
```

`npm run build` also runs this automatically before bundling the library, so `dist/` is always
built from the latest tokens.

Notes baked into the generated files themselves:

- `letterSpacing` is passed through exactly as Figma exported it. The source `_meta.note` flags
  that its unit (px vs. %) hasn't been confirmed — check before relying on it for layout-critical text.
- The MUI typography variant names (e.g. `bodySmallSemibold`) are mechanically derived from the
  token path, not semantic names — rename once real variant names are assigned upstream.
- A few color tokens (`warning.text`/`warning.subtle`, `border.disabled`) have no unambiguous slot
  in MUI's palette API and are intentionally left out of `palette`; use `theme.tokens.colors` for those.

## Storybook (browser preview)

Components are React Native primitives (`View`/`Text`/`Pressable`/...), so previewing them in a
normal browser goes through [react-native-web](https://necolas.github.io/react-native-web/) rather
than a simulator. `.storybook/main.ts` picks up every `src/components/**/*.stories.tsx` file and
builds with `@storybook/react-webpack5`; `@storybook/addon-react-native-web` injects the webpack
config that aliases `react-native` to `react-native-web` and runs RN source through
`@react-native/babel-preset` + `babel-plugin-react-native-web`. `.storybook/preview.tsx` wraps every
story in `ThemeProvider`.

```bash
npm run storybook
```

Opens at `http://localhost:6006` with all five components' stories in the sidebar.

Notes:

- The addon (`@storybook/addon-react-native-web`) is a small, infrequently-updated package last
  tested against Storybook 8; it's being used here with Storybook 10 and verified working, but its
  `webpackFinal` hook is the part of Storybook's addon API least likely to break across majors — if
  a future Storybook upgrade breaks it, that hook is the first place to check.
- `react-docgen` (Storybook's automatic prop-table generator) fails to parse these `.tsx` files and
  logs a harmless "Failed to parse ... with react-docgen" warning at startup; stories still render
  correctly, and the Controls panel is populated from each story's own `args` regardless.
- Not part of the published package — `.storybook/`, `react-dom`, `react-native-web`, and the addon
  are devDependencies used only for this local preview.
- `.storybook/main.ts` stubs webpack's `console` resolve to `false`: co-located `*.test.tsx` files
  (not any story) end up reachable from the preview bundle because they import
  `@testing-library/react-native`, and that package's `dist/helpers` does `require('console')` — a
  Node core module with no browser polyfill by default in webpack 5.

## Testing

[Jest](https://jestjs.io) with React Native's own preset (`@react-native/jest-preset`) and
[React Native Testing Library](https://callstack.github.io/react-native-testing-library/). Run with:

```bash
npm test
```

RNTL v14 made `render` and interaction helpers **async by default** — `await render(...)` and use
`userEvent` (not the older synchronous `fireEvent`) for interactions; see
[Button.test.tsx](src/components/Button/Button.test.tsx) for the pattern.

## Continuous Integration

[.github/workflows/ci.yml](.github/workflows/ci.yml) runs on every pull request: install
(`npm ci`), lint, test, and `build-storybook` (to catch build errors, not to deploy anything — the
static output isn't published or uploaded anywhere). Any step failing fails the check.

## Releasing

Versioning and publishing go through [Changesets](https://github.com/changesets/changesets), and
the package publishes to **GitHub Packages** (`https://npm.pkg.github.com`), not the public npm
registry — see `publishConfig` in [package.json](package.json).

**1. When you make a change that should ship, record it:**

```bash
npm run changeset
```

This prompts you to pick a bump type (patch/minor/major) and write a summary, then writes a file
under `.changeset/`. Commit it alongside your change and open a PR as usual.

**2. Once that PR merges to `main`,** [.github/workflows/release.yml](.github/workflows/release.yml)
picks up the pending changeset(s) and opens (or updates) a **"Version Packages" PR** — bumping
`package.json`, updating `CHANGELOG.md`, and consuming the changeset file(s). Nothing is published yet.

**3. Once the "Version Packages" PR is merged,** the workflow runs again, finds no changesets left,
and:

- publishes `@dettalia/design-system` to `npm.pkg.github.com`
- creates a GitHub Release (with the changelog entries) tagged `@dettalia/design-system@<version>`

using the repo's own `GITHUB_TOKEN` — no extra secret needed for _publishing_ (GitHub Packages
accepts the Actions token for the repo it belongs to). Installing the package elsewhere is a
different story — see below.

### One-time setup to install this package

`npm install`/`npm ci` for `@dettalia/design-system` doesn't work out of the box outside this
repo's own CI — GitHub Packages always requires authentication, even for a private-scope **read**.
Each developer (or CI system) that wants to install it needs:

1. **A GitHub Personal Access Token** with the `read:packages` scope (classic PAT — Settings →
   Developer settings → Personal access tokens → Tokens (classic) → generate one with just that
   scope checked).

2. **A `.npmrc` entry** telling npm to resolve the `@dettalia` scope from GitHub Packages and how to
   authenticate to it. Either add this to your **global** `~/.npmrc` (once, for your whole machine):

   ```ini
   @dettalia:registry=https://npm.pkg.github.com
   //npm.pkg.github.com/:_authToken=YOUR_GITHUB_TOKEN_HERE
   ```

   or, to keep the token out of a file at all, put this in the **consuming project's** `.npmrc`
   (safe to commit) and export `GITHUB_TOKEN` in your shell/CI environment instead:

   ```ini
   @dettalia:registry=https://npm.pkg.github.com
   //npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}
   ```

3. Then `npm install @dettalia/design-system` (or `react-native`/`react` peer deps as needed) works
   normally.

This is a one-time setup per machine/CI environment, not per install.
