// Everything that knows what the Convex dashboard's DOM actually looks like:
// finding tables, telling whether they're in the schema, and driving the
// dashboard's own delete flow (menu -> confirm dialog -> Delete) end to end.

const SETTINGS_BTN = 'button[aria-label="Open table settings"]';

const IN_SCHEMA_TABLE_MSG =
  'This table is in the schema — remove it from the schema first to fully delete it';
const IN_SCHEMA_ALL_MSG =
  'All tables are in the schema — remove them from the schema first to fully delete them';

function currentTableName() {
  return new URLSearchParams(location.search).get('table') || 'this table';
}

// The dashboard marks tables that aren't in the schema with a bare "*" span.
function hasStar(el) {
  return [...el.querySelectorAll('*')].some(
    (s) => s.childElementCount === 0 && s.textContent.trim() === '*'
  );
}

// One entry per sidebar table link: the anchor, the table name, and whether
// the table is out of the schema (and therefore deletable).
function sidebarLinks() {
  return [...document.querySelectorAll('a[href*="table="]')]
    .map((a) => {
      let name = null;
      try {
        name = new URL(a.href).searchParams.get('table');
      } catch {}
      return name ? { a, name, outOfSchema: hasStar(a) } : null;
    })
    .filter(Boolean);
}

// The Data page header renders the table name in an <h3> with a trailing
// "<span>*</span>" when the table is not in the schema.
function currentTableIsOutOfSchema() {
  const header = [...document.querySelectorAll('h3')].find(
    (h) => h.textContent.replace('*', '').trim() === currentTableName()
  );
  return !!header && hasStar(header);
}

// Dismiss any half-open menu or dialog left behind by a failed attempt —
// leftover UI steals focus and blocks the next one.
async function closeStrayUI() {
  const dialog = document.querySelector('[role="dialog"]');
  if (dialog) {
    const cancel = [...dialog.querySelectorAll('button')].find(
      (b) => b.textContent.trim() === 'Cancel'
    );
    if (cancel) cancel.click();
  }
  if (document.querySelector('[role="menu"]')) {
    document.body.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Escape', bubbles: true })
    );
  }
  await waitFor(
    () =>
      !document.querySelector('[role="dialog"]') &&
      !document.querySelector('[role="menu"]'),
    3000
  );
}

// Open the table-settings menu and return its "Delete Table" item. The menu
// sometimes fails to open (or closes itself) right after a previous delete,
// so retry a few times with cleanup in between.
async function openDeleteMenuItem() {
  for (let attempt = 1; attempt <= 4; attempt++) {
    const settingsBtn = document.querySelector(SETTINGS_BTN);
    if (!settingsBtn) return null;
    settingsBtn.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }));
    settingsBtn.click();
    const item = await waitFor(
      () =>
        [...document.querySelectorAll('[role="menu"] [role="menuitem"]')].find(
          (i) => i.textContent.trim() === 'Delete Table'
        ),
      2500
    );
    if (item) return item;
    await closeStrayUI();
    await sleep(250 * attempt);
  }
  return null;
}

// Delete the table currently open in the Data view. Resolves to null on
// success, or a short error message.
async function deleteCurrentTable() {
  if (!document.querySelector(SETTINGS_BTN)) {
    return 'Settings button not found';
  }
  if (
    document.querySelector('[role="dialog"]') ||
    document.querySelector('[role="menu"]')
  ) {
    await closeStrayUI();
  }

  const deleteItem = await openDeleteMenuItem();
  if (!deleteItem) return '"Delete Table" menu item not found';
  if (deleteItem.getAttribute('aria-disabled') === 'true' || deleteItem.disabled) {
    document.body.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Escape', bubbles: true })
    );
    return '"Delete Table" is disabled for this table';
  }
  keyboardSelect(deleteItem);

  const dialog = await waitFor(() => {
    const d = document.querySelector('[role="dialog"]');
    return d && /Delete table/i.test(d.textContent) ? d : null;
  }, 8000);
  if (!dialog) return 'Confirmation dialog did not open';

  // Production asks you to type "Delete production table <name>"; the input's
  // placeholder always holds the exact phrase. Dev deployments may not show
  // an input at all.
  const input = dialog.querySelector('input#validation, input[name="validation"]');
  if (input) setReactInputValue(input, input.placeholder);

  const confirmBtn = await waitFor(() =>
    [...dialog.querySelectorAll('button')].find(
      (b) => b.textContent.trim() === 'Delete' && !b.disabled
    )
  );
  if (!confirmBtn) return 'Delete button never enabled';
  confirmBtn.click();

  await waitFor(() => !document.querySelector('[role="dialog"]'), 8000);
  return null;
}

// Open the named table from the sidebar, then delete it. Resolves to null on
// success (including when the table is already gone).
async function deleteOneTable(name) {
  const link = sidebarLinks().find((l) => l.name === name);
  if (!link) return null;
  link.a.click();
  const ready = await waitFor(
    () => currentTableName() === name && document.querySelector(SETTINGS_BTN),
    8000
  );
  if (!ready) return `Could not open table "${name}"`;
  const err = await deleteCurrentTable();
  if (err) return err;
  // Wait for the sidebar to drop the entry, then let React settle before
  // the next table.
  await waitFor(() => !sidebarLinks().some((l) => l.name === name), 8000);
  await sleep(250);
  return null;
}
