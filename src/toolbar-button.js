// The per-table "Delete Table" button, injected next to the three-dot
// table-settings menu on the Data page.
//
// First click arms it ("Confirm?" slides open), second click runs the whole
// delete flow. For in-schema tables the button stays visible but inert, with
// a tooltip explaining why.

const BTN_CLASS = 'cqd-delete-btn';

const WARN_SVG =
  '<svg class="cqd-icon-warn" xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="currentColor" fill-rule="evenodd" aria-hidden="true"><path d="M13.53 3.4 a1.77 1.77 0 0 0 -3.06 0 L2.2 17.6 a1.77 1.77 0 0 0 1.53 2.65 h16.54 a1.77 1.77 0 0 0 1.53 -2.65 Z M10.9 8.6 h2.2 v6 h-2.2 Z M10.9 16.2 h2.2 v2.2 h-2.2 Z"/></svg>';

// There's only ever one toolbar button, so its transient arm state can live
// here instead of being tacked onto the element.
let disarmTimer = null;
let removeDisarmListeners = null;

function resetButton(btn) {
  btn.classList.remove('cqd-armed', 'cqd-error');
  btn.title = 'Delete table';
  delete btn.dataset.armed;
  delete btn.dataset.table;
  clearTimeout(disarmTimer);
  if (removeDisarmListeners) {
    removeDisarmListeners();
    removeDisarmListeners = null;
  }
}

function armButton(btn) {
  const name = currentTableName();
  btn.dataset.armed = '1';
  btn.dataset.table = name;
  btn.classList.add('cqd-armed');
  btn.title = `Delete "${name}"? Click again to confirm`;
  disarmTimer = setTimeout(() => resetButton(btn), ARM_TIMEOUT_MS);

  // Clicking anywhere else, or pressing Esc, disarms.
  const onPointerDown = (e) => {
    if (!btn.contains(e.target)) resetButton(btn);
  };
  const onKeyDown = (e) => {
    if (e.key === 'Escape') resetButton(btn);
  };
  document.addEventListener('pointerdown', onPointerDown, true);
  document.addEventListener('keydown', onKeyDown, true);
  removeDisarmListeners = () => {
    document.removeEventListener('pointerdown', onPointerDown, true);
    document.removeEventListener('keydown', onKeyDown, true);
  };
}

async function fireButton(btn) {
  resetButton(btn);
  btn.dataset.busy = '1';
  btn.classList.add('cqd-busy');
  btn.title = 'Deleting…';
  const err = await deleteCurrentTable();
  delete btn.dataset.busy;
  btn.classList.remove('cqd-busy');
  if (err) {
    console.warn('[convex-quick-delete]', err);
    btn.classList.add('cqd-error');
    btn.title = 'Failed – see console';
    setTimeout(() => resetButton(btn), 3000);
  } else {
    resetButton(btn);
  }
}

function makeButton(settingsBtn) {
  const btn = document.createElement('button');
  // Copy the dashboard's own utility classes so the button matches the
  // three-dot button exactly in both themes (minus its animations).
  btn.className =
    settingsBtn.className
      .split(/\s+/)
      .filter((c) => !c.startsWith('animate-'))
      .join(' ') + ` ${BTN_CLASS}`;
  btn.type = 'button';
  btn.title = 'Delete table';
  btn.innerHTML =
    '<span class="cqd-mini-label">Confirm?</span>' +
    `<span class="cqd-icons">${TRASH_SVG}${WARN_SVG}</span>`;
  btn.addEventListener('click', () => {
    if (btn.dataset.busy || btn.classList.contains('cqd-disabled')) return;
    if (btn.dataset.armed) fireButton(btn);
    else armButton(btn);
  });
  return btn;
}

function setButtonDisabled(btn, disabled) {
  if (disabled) {
    if (btn.dataset.armed) resetButton(btn);
    btn.classList.add('cqd-disabled');
    btn.title = IN_SCHEMA_TABLE_MSG;
  } else {
    btn.classList.remove('cqd-disabled');
    if (btn.title === IN_SCHEMA_TABLE_MSG) btn.title = 'Delete table';
  }
}

function injectToolbarButton() {
  const settingsBtn = document.querySelector(SETTINGS_BTN);
  let btn = document.querySelector('.' + BTN_CLASS);

  if (!settingsBtn) {
    if (btn) {
      resetButton(btn);
      btn.remove();
    }
    return;
  }
  if (!btn) {
    // Sits right after the three-dot button, at the end of the toolbar.
    btn = makeButton(settingsBtn);
    settingsBtn.parentElement.insertBefore(btn, settingsBtn.nextSibling);
  } else if (btn.dataset.armed && btn.dataset.table !== currentTableName()) {
    // Navigated to a different table while armed — don't carry the confirm
    // state over to it.
    resetButton(btn);
  }
  setButtonDisabled(btn, !currentTableIsOutOfSchema());
}
