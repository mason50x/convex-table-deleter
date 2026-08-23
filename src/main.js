// Convex Quick Table Delete — entry point.
//
// The extension adds two things to the Convex dashboard's Data page:
//   - a "Delete Table" button next to the three-dot table-settings menu
//   - checkboxes plus a bulk-delete bar on the sidebar table list
// Both drive the dashboard's own delete flow (menu -> confirm dialog ->
// Delete), and only for tables NOT in the schema (marked "*") — in-schema
// tables render greyed out with a tooltip explaining why.
//
// The dashboard is a React app that re-renders constantly, so we re-inject on
// every DOM change, throttled to one pass per frame. Both injectors are
// idempotent: they check what already exists before touching anything.

function inject() {
  injectToolbarButton();
  injectSidebar();
}

let injectScheduled = false;
new MutationObserver(() => {
  if (injectScheduled) return;
  injectScheduled = true;
  requestAnimationFrame(() => {
    injectScheduled = false;
    inject();
  });
}).observe(document.body, { childList: true, subtree: true });

inject();
