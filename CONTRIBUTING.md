# Contributing

Thanks for taking an interest! This is a small extension, so the process is
informal:

- **Bugs**: open an issue with what you did, what happened, and anything
  relevant from the browser console (the extension logs under
  `[convex-quick-delete]`). The Convex dashboard changes over time, so
  "the button stopped appearing" reports are especially useful.
- **Extension changes**: open a PR. There's no build step — edit the files
  under `apps/extension/src/` (they load as plain content scripts, in the
  order listed in `manifest.json`), then reload the unpacked extension in
  `chrome://extensions` to test against a real dashboard.
- **Website changes**: `pnpm install`, then `pnpm dev` runs `apps/web`
  locally. If a change to the extension affects what data it touches or what
  permissions it needs, update the Privacy Policy
  (`apps/web/src/pages/Privacy.tsx`) in the same PR.

A note on scope: the extension deliberately only touches tables that are
**not** in the schema, and always drives the dashboard's own delete flow
rather than calling any API directly. Please keep both properties intact —
they're the safety story.

CI (`pnpm check`) checks that `manifest.json` parses and every script passes
`node --check`, typechecks the website, and builds both; there is no test
suite, so manual testing against a dashboard
(ideally with a few throwaway tables) is the bar for UI changes.
