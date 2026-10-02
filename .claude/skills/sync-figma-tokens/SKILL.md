---
name: sync-figma-tokens
description: Sync design tokens from the Bliro Design System Figma file into this repo and update the MUI theme. Use when someone asks to sync, pull, update, refresh or re-export tokens, variables, colors, typography or shadows from Figma, or says the theme is out of date with Figma.
---

# Sync design tokens from Figma

Figma is the source of truth. This command exports its variables, text styles
and shadow styles, regenerates the MUI theme, checks it, and opens a PR.
Never edit `tokens/figma-export.json` by hand: the build rejects it (checksum).

## 0. Preconditions

- The Figma connector works: call `whoami` and confirm access to the file in
  `figma/source.json` (`fileKey`). If it fails, stop and ask the user to connect
  or authenticate the Figma connector.
- `git status` is clean. Start from up-to-date `main` (or the base branch the
  user names) and create a branch `tokens/sync-<YYYY-MM-DD>`.
- Load the Figma connector's `figma-use` guidance before calling `use_figma`
  (the connector requires it). The export script is read-only.

## 1. Export (paged)

1. Read `figma/export-tokens.js`. Pass it to `use_figma` **verbatim**, with
   exactly one line prepended: `const PAGE = 0;`. Don't edit, minify or strip
   comments. Use `fileKey` from `figma/source.json`.
2. Save the returned JSON, exactly as returned, to
   `tokens/.figma-export/page-0.json`. It contains `pageCount`, `summary` and
   `warnings`.
3. For every remaining page (1 to `pageCount - 1`), run the same script with
   `const PAGE = <n>;` (issue these calls in parallel) and save each result to
   `tokens/.figma-export/page-<n>.json`.
4. Run `npm run tokens:import`. It reassembles the pages, verifies the
   checksum, writes `tokens/figma-export.json`, and deletes the page files.
   - Checksum mismatch or missing page: re-run and re-save the affected pages
     exactly as returned. Never "fix" values by hand.
   - Pages from different runs (someone edited Figma in between): re-run all.
   - Script errors (name collision, alias to a library variable): report the
     error to the user; it has to be fixed in Figma.

## 2. Review the change

1. Run `npm run tokens:diff` (compares with `HEAD`). If it prints
   `No token changes.`, tell the user the theme is already in sync, delete the
   branch, and stop.
2. Surface every warning from the export (e.g. extra modes not exported).
3. Run `npm run tokens:build`. If it fails because `mui-mapping.mjs` points at
   a token that no longer exists, a token was renamed or removed in Figma:
   - If the diff makes the replacement obvious (same value, new name), update
     `style-dictionary/mui-mapping.mjs`.
   - Otherwise ask the user (or design) which token should fill that MUI slot.
4. Look at **added** tokens. If one clearly fills an unmapped MUI slot (see
   comments in `mui-mapping.mjs`), suggest the mapping to the user; don't
   change the mapping on your own judgement.

## 3. Verify

Run all of these; fix failures before continuing:

```bash
npm run typecheck   # catches removed tokens/variants still used in src/
npm run lint
npm test
npm run build-storybook
```

If `typecheck` fails because `src/theme/theme.ts` or a story references a
removed token or Typography variant, update it to the replacement token.

## 4. Changeset

Create `.changeset/figma-tokens-<YYYY-MM-DD>.md` for `@dettalia/design-system`:

- **patch**: only token values changed.
- **minor**: tokens or Typography variants added, no removals.
- **breaking**: a token or Typography variant was removed or renamed (anything
  in the diff's "Removed" section). Use `minor` while the package is `0.x` and
  start the summary with `**Breaking:**`; use `major` from `1.0.0` on.

Summarize the diff in plain words (e.g. "Primary hover color is now orange/600;
adds the `info` palette"). Don't paste the whole diff.

## 5. Commit and open the PR

Show the user the summary (counts of added/removed/changed, notable changes,
warnings) and ask before pushing. Then:

- Commit `tokens/figma-export.json` plus any mapping, theme or story fixes and
  the changeset: `Sync design tokens from Figma (<YYYY-MM-DD>)`.
- Push and open a PR. Body: the summary, the export warnings, any mapping
  decisions that need design sign-off, and the full `npm run tokens:diff`
  output inside a collapsed `<details>` block.
