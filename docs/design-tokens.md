# Design tokens: Figma → theme

The [Bliro Design System Figma file](https://www.figma.com/design/PNfRHPC6U3OTPIhKs9QMwv) is the
single source of truth for colors, spacing, radii, typography and shadows. This repo never invents
token values; it exports them from Figma and maps them onto MUI.

## How to sync

In Claude Code, with the Figma connector connected, run:

```
/sync-figma-tokens
```

It exports the tokens, rebuilds the theme, runs every check, writes a changeset, and opens a PR
with a diff of what changed. The steps are defined in
[.claude/skills/sync-figma-tokens/SKILL.md](../.claude/skills/sync-figma-tokens/SKILL.md).

**When to sync:** whenever design changes variables, text styles or shadow styles in Figma. Run it
before starting UI work that depends on a new token, too.

## Pipeline

```
Figma file ──(figma/export-tokens.js, via Figma connector, paged)──▶ tokens/.figma-export/page-N.json
          ──(npm run tokens:import: reassemble + verify checksum)──▶ tokens/figma-export.json   (committed)
          ──(npm run tokens:build: Style Dictionary + mui-mapping)──▶ src/theme/tokens.ts       (generated)
          ──(src/theme/theme.ts: component defaults)──────────────▶ theme / ThemeProvider
```

| Step                | File                                     | Edit it?                                                  |
| ------------------- | ---------------------------------------- | --------------------------------------------------------- |
| Export              | `figma/export-tokens.js`                 | Only to change _what_ is exported (e.g. support modes).   |
| Source of truth     | `tokens/figma-export.json`               | **Never by hand.** The build rejects edits (checksum).    |
| Token → MUI mapping | `style-dictionary/mui-mapping.mjs`       | Yes: this is where design decisions about MUI slots live. |
| Code generation     | `style-dictionary/formats/mui-theme.mjs` | Only to change the shape of the generated code.           |
| Generated theme     | `src/theme/tokens.ts`                    | Never. Gitignored, rebuilt by `tokens:build`.             |
| Component defaults  | `src/theme/theme.ts`                     | Yes, using `tokens.*` values only.                        |

### What gets exported

- **All local variables** at their collection's default mode. Semantic tokens stay aliases of
  primitives (`color.text.primary` → `{color.neutral.950}`), so the layering is preserved.
- **All local text styles** under `typography.*`. Font size and line height in px, letter spacing
  in `em` (Figma stores it as a percentage: `-2%` → `-0.02em`).
- **All shadow effect styles** under `shadow.*`.
- **Not exported:** paint styles. In this file they're legacy duplicates of the color variables.

Names are normalized: lowercased, spaces become `-`, `/` becomes nesting. `Body/Small/SemiBold` →
`typography.body.small.semibold`; `color/action/active BG` → `color.action.active-bg`. Two Figma
names that normalize to the same token fail the export instead of overwriting each other.

### Why paging and a checksum

Figma's Variables REST API needs an Enterprise plan; Bliro's team is on Pro. The export
therefore runs through the Plugin API via the Figma connector, whose responses are capped at about
20 KB, so the script returns the export in pages. Each page is saved to disk, and
`npm run tokens:import` reassembles them and checks an FNV-1a checksum computed in Figma. That
detects any page that's missing, from a different run, or altered on the way.

## How tokens reach MUI

[`style-dictionary/mui-mapping.mjs`](../style-dictionary/mui-mapping.mjs) states which token
fills which MUI slot:

- **palette:** primary, error/warning/info/success, text, background, divider, action, grey.
- **typography:** `h1`–`h6`, `subtitle1/2`, `body1/2`, `button`, `caption` come from Figma text
  styles. Every Figma text style is _also_ its own variant, named after its path
  (`<Typography variant="bodySmallSemibold">`), and typed for consuming apps.
- **shape:** MUI's default `borderRadius` from `radius.sm`. Components with a semantic radius
  token use it through overrides in `src/theme/`: buttons `radius.button`, inputs `radius.input`,
  chips `radius.tag`. **Exceptions:** cards use `radius.2xl` (16px), not Figma's `radius.card`
  (8px). That's a code-only decision; switch back to `radius.card` once Figma is updated. Dialogs
  use `radius.2xl` (16px) because the Figma Modal component does, even though a `radius.modal`
  token (12px) exists.
- **Dialogs** follow the Figma Modal component (`src/theme/components/dialog.ts`): `DialogTitle`
  is the header with its divider, `DialogContent` the content slot, `DialogActions` the footer.
- **shadows:** MUI elevations 1, 2 and 8 come from Figma shadows; elevations in between reuse the
  closest lower one.

Every token, mapped or not, is available as `tokens` / `theme.tokens` (dimensions as px numbers,
shadows as CSS strings). The build fails if the mapping references a token that doesn't exist,
so a rename in Figma shows up as a build error rather than as a silent theme change.

**Spacing** keeps MUI's default 8px factor. Bliro's spacing scale (2, 4, 6, 8, 12, 16, 20, 24, 32,
…) sits almost entirely on MUI's 4px half-steps, so `sx={{p: 2}}` = 16px = `spacing.5`. For exact
values use `tokens.spacing`.

## Reviewing a sync PR

- Read the **Removed** and **Changed** sections of the diff in the PR description. Removed tokens
  or renamed text styles are breaking for apps that use them.
- Mapping changes in `mui-mapping.mjs` are design decisions. Get design sign-off on them.
- Open Storybook (`npm run storybook`) and check **Tokens** (every token, its alias, and its MUI slot) and **Themed components** (MUI components with the theme applied). The **Theme** toolbar switch compares against MUI's default theme.

## Not covered yet

- **Modes (e.g. dark mode):** only each collection's default mode is exported, and the export
  warns if a collection has more. Supporting modes means exporting each mode and generating MUI
  `colorSchemes`.
- **Fully automatic sync:** needs the Figma Variables REST API (Enterprise) for a scheduled CI job.
