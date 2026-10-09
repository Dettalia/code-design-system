# Settings layout

Every settings page uses one of three templates. They share the same parts
(`src/examples/flow/settings/SettingsLayout.tsx`), so a new setting or page
slots in without a new layout.

| Template | Use it when | Pages | Built from |
| --- | --- | --- | --- |
| **Form** | A fixed set of options the user changes and saves | My account, General, Usage | `SettingsPage` › `SettingsSection` › `SettingRow` |
| **Collection** | A list of things the user adds, edits and removes | Members, Dictionary, Company fields, API Access, Webhook Management | `SettingsPage` › `SettingsSection card={false}` › `DataTable` / `EmptyState` |
| **List–detail** | Items with rich detail of their own | Templates, Skills, Integrations | `ListDetail` › `ListPane` + `DetailHeader` + sections |

## Shared rules

- **Page header:** title (Subheading 1), one-line description, optional "Go to Help Center" link, and the page's actions on the right.
- **Width:** content is 880px wide and centered. List–detail pages fill the page: a 280px list and the detail, both scrolling on their own.
- **Sections:** a Subheading 3 title (optionally a description or an action on the right), 32px apart.
- **Rows (Form):** one setting per row. Label (Body/Small/Medium) with an optional "?" help tooltip and description on the left, the control on the right. Rows are separated by dividers inside a bordered 16px-radius card (Figma exploration 8153:91545).
- **Controls:** 40px tall, 240px wide by default: `SettingInput`, `SettingSelect`, `SettingSwitch` (the Figma Toggle), `Segmented` for 2–4 exclusive options.
- **Dependent settings:** go under their row, full width, and only show when they apply (e.g. "Delete after N days" under Transcript data deletion).
- **Saving (Form):** Cancel and Save sit in the page header and are disabled until something changes.
- **Collections:** the primary action ("Invite people", "Add word") is in the page header; search sits on the section's right. An empty collection shows an `EmptyState` with the primary action inside it instead.
- **List–detail:** the list pane has the title, description and icon actions (search, add); groups are labelled, not collapsible. The detail starts with `DetailHeader` (title, status toggle and actions on the right), then uses the same sections and rows as Form pages.

## Adding a page

1. Pick the template from the table above.
2. Build it from the parts; don't add one-off spacing or headers.
3. Add the route to `SETTINGS` in `FlowShell.tsx` and to `settingsPage()` in `FlowPrototype.tsx`. List–detail routes also go in `LIST_DETAIL`.
