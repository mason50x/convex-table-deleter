# Convex Table Deleter

[![CI](https://github.com/mason50x/convex-table-deleter/actions/workflows/ci.yml/badge.svg)](https://github.com/mason50x/convex-table-deleter/actions/workflows/ci.yml)

Chrome extension that adds one-click deletion for Convex dashboard tables that
are not in your schema (the ones marked `*`).

> Unofficial third-party tool, not affiliated with Convex, Inc.

Normally, deleting a table in the Convex dashboard means opening the table's
three-dot menu, choosing "Delete Table", typing a confirmation phrase like
`Delete production table myTable`, and clicking Delete — for every single
table. This extension automates that whole flow.

## Features

- **Delete Table button** in the table toolbar, styled to match the dashboard
  (light and dark mode). Only appears on tables that are not in your schema.
- **Bulk delete**: checkboxes next to every non-schema table in the sidebar,
  with a select-all + "Delete (N)" bar. Deletes the checked tables one after
  another with progress.
- Every action is confirm-armed: first click arms the button ("Confirm?"),
  second click runs it. It auto-disarms after 4 seconds.

## Code layout

Plain content scripts, no build step. They load in the order listed in
`manifest.json` and share one scope:

- `src/util.js` — generic helpers (polling, synthetic keyboard/input events)
- `src/dashboard.js` — everything that knows the dashboard's DOM: finding
  tables, schema status, and the automated delete flow
- `src/toolbar-button.js` — the per-table Delete button
- `src/bulk-bar.js` — sidebar checkboxes and the bulk-delete bar
- `src/main.js` — entry point; re-injects whenever the dashboard re-renders
- `styles.css` — all styling

## Install (unpacked)

1. Open `chrome://extensions`
2. Enable **Developer mode**
3. **Load unpacked** → select this folder

## Build the store zip

No build step for development — the zip only matters for Web Store uploads:

```sh
zip -r convex-table-deleter.zip manifest.json styles.css src \
  icons/icon-16.png icons/icon-32.png icons/icon-48.png icons/icon-128.png
```

CI builds the same zip on every push and attaches it as a workflow artifact.

## Contributing

Issues and PRs welcome — see [CONTRIBUTING.md](CONTRIBUTING.md).

## License

[MIT](LICENSE)

## Chrome Web Store listing

**Summary** (short description):
One-click delete for Convex dashboard tables that aren't in your schema.
Skips the menu clicks and typed confirmation phrase.

**Description**:
The Convex dashboard makes you work for every table deletion: open the
three-dot menu, click "Delete Table", type out a confirmation phrase like
"Delete production table myTable", then click Delete. Reasonable protection —
but painful when you're cleaning up a pile of leftover tables that are no
longer in your schema.

Convex Table Deleter adds:

• A "Delete Table" button right in the table toolbar — one click to arm,
  one click to run the entire flow for you.
• Sidebar checkboxes and a bulk-delete bar, so you can select all (or some)
  non-schema tables and delete them in one go.

Safety built in:

• Buttons and checkboxes only ever appear on tables that are NOT in your
  schema (marked * in the dashboard). Tables your schema defines are never
  touched.
• Two-step confirm on every delete, with auto-disarm.
• The extension drives the dashboard's own UI — the same confirmation dialog
  Convex shows is filled and submitted on your behalf, nothing bypasses the
  dashboard's permissions. If you can't delete a table, neither can it.

Privacy: runs only on dashboard.convex.dev, collects nothing, sends nothing
anywhere. No permissions beyond the content script.

**Category**: Developer Tools

**Privacy practices / justifications** (for the review form):
- Single purpose: delete out-of-schema tables in the Convex dashboard with
  fewer clicks.
- Host permission `https://dashboard.convex.dev/*`: the extension injects its
  buttons into the Convex dashboard UI; it does not run anywhere else.
- No data is collected, stored, or transmitted.
- No remote code.

**Note on the name/logo**: the icon is derived from the Convex logo and the
name contains the "Convex" trademark. The Web Store's impersonation policy can
flag this; if review rejects it, rename to something like "Table Deleter for
Convex" and state in the listing that it is an unofficial third-party tool not
affiliated with Convex, Inc.
