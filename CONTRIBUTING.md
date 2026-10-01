# Contributing

## Components come from MUI

This package doesn't build its own components. It re-exports all of `@mui/material`, and the Bliro
look comes from the theme. To change how a component looks or behaves by default:

1. **Prefer the theme.** Add or adjust an entry in the `components` object in
   [src/theme/theme.ts](src/theme/theme.ts) (`defaultProps` / `styleOverrides` / `variants`; see
   MUI's [theme components docs](https://mui.com/material-ui/customization/theme-components/)).
   This keeps the MUI API untouched for consumers.
2. **Use only token values**: `tokens.*` or the `theme` passed to style callbacks, never a hex
   literal. If the design needs a value with no token, raise it with design/Figma rather than
   inventing one locally.
3. **Wrap a component only as a last resort**, e.g. for a genuinely Bliro-specific composite. Put
   it under `src/components/<Name>/` and export it **by name** from `src/index.ts`. A named export
   shadows MUI's `export *` of the same name, so don't reuse an MUI component name without good
   reason.

**Stories:** add or extend a `src/stories/*.stories.tsx` file (typed with `Meta`/`StoryObj` from
`@storybook/react-vite`) to show the change, covering the affected variants, sizes and states.

**Tests:** Jest + React Testing Library in jsdom. See [src/index.test.tsx](src/index.test.tsx).
Prefer `@testing-library/user-event` for interactions. Note that a disabled MUI `Button` has
`pointer-events: none`, so assert `toBeDisabled()` instead of clicking it.

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
export from Figma, then regenerate the generated theme file:

```bash
npm run tokens:build
```

This runs [Style Dictionary](https://styledictionary.com) (config: `style-dictionary/sd.config.mjs`)
and rewrites `src/theme/tokens.ts` (MUI `themeOptions`, the raw `tokens`, and the MUI type
augmentation).

It is **generated and gitignored** — never hand-edit them; changes belong in
`tokens/figma-export.json` or, if the _shape_ of the output needs to change (not just values), in the
format functions under `style-dictionary/formats/`. `build`, `test`, `typecheck`, `storybook` and
`build-storybook` all run `tokens:build` first, so they always use the latest tokens.

If the new export adds/renames/removes tokens in a way that changes what a component can express
(e.g. a new color role, a new type scale step), update the component defaults in `src/theme/theme.ts` to use it and add a
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
