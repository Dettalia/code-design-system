# Contributing

## Adding a new component

Each component gets its own folder under `src/components/`:

```
src/components/<Name>/
├── <Name>.tsx           # component, props type, theme-driven styles
├── <Name>.stories.tsx   # Storybook stories (required)
├── <Name>.test.tsx      # at least a render/interaction smoke test (recommended)
└── index.ts             # re-exports the component and its types
```

**`<Name>.tsx`** conventions (see [Button.tsx](src/components/Button/Button.tsx) or
[Card.tsx](src/components/Card/Card.tsx) for full examples):

- Extend the underlying React Native component's own props (`Omit<ViewProps, 'style'>`, etc.) rather
  than reinventing them, and keep a `style` prop so consumers can still override.
- Read the theme via `useThemedStyles(createStyles)` (from `../../theme`), where `createStyles` is a
  **module-level** `(theme: Theme) => ({...})` function — not an inline arrow function passed at the
  call site — so the hook can memoize the generated `StyleSheet` and only rebuild it when the theme
  actually changes.
- Never write a raw `style={{...}}` object literal in JSX (ESLint's `react-native/no-inline-styles`
  will catch this) — every style variant/size/state should be its own named key in `createStyles`,
  selected via a lookup object (see `sizeStyleKey`/`textColorStyleKey` in `Button.tsx`), then merged
  as `style={[styles.base, styles[variant], ..., style]}`.
- Only use colors, spacing, radii, and typography that already exist in `theme.tokens` (via
  `useTheme()` or the styles above) — never a hex literal. If the design doesn't have a token for
  what you need, that's a signal to raise it with design/Figma, not to invent one locally.
- Match MUI's prop _names_ where a reasonable equivalent exists (`variant`, `size`, `disabled`,
  `fullWidth`, `color`, `align`, ...), even if the literal enum values differ — see the existing
  components' prop docs for precedent, and note any deliberate naming deviation with a comment (e.g.
  `Badge`'s `label` prop borrows from MUI Chip, not MUI's own overlay-style Badge).

**`<Name>.stories.tsx`**: import `Meta`/`StoryObj` from `../../storybook/types` (a small local
type-only stand-in — see that file's comment for why we don't depend on `@storybook/react-native`
directly), and cover at least: each variant, each size, and any notable state (disabled, error, etc).

**`<Name>.test.tsx`**: RNTL's `render` and interaction helpers are **async** — `await render(...)`
and use `userEvent`, not the older synchronous `fireEvent`. See
[Button.test.tsx](src/components/Button/Button.test.tsx) for the pattern.

**Wire it up:** add `export * from './<Name>';` to [src/components/index.ts](src/components/index.ts)
(already re-exported from the package root via `src/index.ts`).

**Before opening a PR**, run (or just open one — [ci.yml](.github/workflows/ci.yml) runs these on
every PR and fails the check if any of them fail):

```bash
npm run typecheck
npm run lint
npm test
npm run build-storybook   # catches build errors; open npm run storybook to eyeball it
```

## Regenerating theme tokens after a Figma change

`tokens/figma-export.json` is the single source of truth for design tokens — replace it with a fresh
export from Figma, then regenerate both generated outputs:

```bash
npm run tokens:build
```

This runs [Style Dictionary](https://styledictionary.com) (config: `style-dictionary/sd.config.mjs`)
and rewrites:

- `src/theme/tokens.ts` — the RN-shaped theme object this library consumes.
- `web/mui-theme.ts` — the same tokens mapped into an MUI `createTheme()` config, for the web app.

Both are **generated and gitignored** — never hand-edit them; changes belong in
`tokens/figma-export.json` or, if the _shape_ of the output needs to change (not just values), in the
format functions under `style-dictionary/formats/`. `npm run build` also runs `tokens:build`
automatically before bundling, so `dist/` is always built from the latest tokens.

If the new export adds/renames/removes tokens in a way that changes what a component can express
(e.g. a new color role, a new type scale step), update the relevant component(s) to use it and add a
changeset (see below) — token changes that affect the public API are worth a release note.

## How a release gets published

Versioning and publishing go through [Changesets](https://github.com/changesets/changesets); nobody
runs `npm publish` by hand.

1. **When your change should ship, record it**, alongside your PR:

   ```bash
   npm run changeset
   ```

   Pick a bump type (patch/minor/major) and write a summary. This writes a file under `.changeset/` —
   commit it with your change.

2. **Merge your PR to `main`.** [release.yml](.github/workflows/release.yml) picks up any pending
   changesets and opens (or updates) a **"Version Packages" PR** that bumps `package.json`, updates
   `CHANGELOG.md`, and consumes the changeset file(s). Nothing is published at this point.

3. **Merge the "Version Packages" PR.** The workflow runs again, finds no changesets left, and:
   - publishes `@dettalia/design-system` to **GitHub Packages** (`npm.pkg.github.com`, not the public
     npm registry — see `publishConfig` in `package.json`)
   - creates a GitHub Release tagged `@dettalia/design-system@<version>` with the changelog

   using the repo's own `GITHUB_TOKEN` — no manual credentials needed to publish.

See the README's [Releasing](README.md#releasing) section for the one-time `.npmrc` setup a
developer needs to _install_ the published package.
