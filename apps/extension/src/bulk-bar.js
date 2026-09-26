// Sidebar bulk delete: a checkbox on every table row, plus a bar with
// select-all and a "Delete (N)" button that works through the checked tables
// one at a time. In-schema rows show a greyed-out, unclickable checkbox.

const CHECK_SVG =
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="5 12.5 10 17.5 19 7"/></svg>';

const selected = new Set(); // table names checked for deletion
let selectMode = false;
let bulkRunning = false;
let bulkDisarmTimer = null;

// Circular checkbox: a hidden real <input> with a styled circle on top.
function makeCircleCheck(className) {
  const wrap = document.createElement('span');
  wrap.className = 'cqd-check-wrap';
  const input = document.createElement('input');
  input.type = 'checkbox';
  input.className = className;
  const circle = document.createElement('span');
  circle.className = 'cqd-circle';
  circle.innerHTML = CHECK_SVG;
  wrap.append(input, circle);
  return { wrap, input };
}

// Make the bar reflect the current select mode: expanded with a compact ✕
// toggle when on, a single "Bulk Delete" button when off.
function applyModeToBar(bar) {
  bar.classList.toggle('cqd-active', selectMode);
  const toggle = bar.querySelector('.cqd-bulk-toggle');
  toggle.querySelector('.cqd-label').textContent = selectMode ? '✕' : 'Bulk Delete';
  toggle.title = selectMode ? 'Cancel' : '';
}

function setSelectMode(on) {
  selectMode = on;
  document.documentElement.classList.toggle('cqd-select-mode', on);
  if (!on) {
    selected.clear();
    syncCheckboxes();
  }
  const bar = document.querySelector('.cqd-bulk-bar');
  if (bar) applyModeToBar(bar);
  updateBulkBar();
}

function syncCheckboxes() {
  document.querySelectorAll('.cqd-check').forEach((cb) => {
    cb.checked = selected.has(cb.dataset.table);
  });
}

function updateBulkBar() {
  const bar = document.querySelector('.cqd-bulk-bar');
  if (!bar || bulkRunning) return;
  const btn = bar.querySelector('.cqd-bulk-delete');
  const count = selected.size;
  btn.disabled = count === 0;
  if (!btn.dataset.armed) {
    btn.querySelector('.cqd-label').textContent = `Delete (${count})`;
  }
  const eligible = sidebarLinks().filter((l) => l.outOfSchema);
  const selectAll = bar.querySelector('.cqd-select-all');
  selectAll.checked =
    eligible.length > 0 && eligible.every((l) => selected.has(l.name));
}

async function runBulkDelete(btn) {
  bulkRunning = true;
  const names = [...selected];
  const failures = [];
  for (let i = 0; i < names.length; i++) {
    const name = names[i];
    btn.querySelector('.cqd-label').textContent =
      `Deleting ${i + 1}/${names.length}…`;

    // A slow dashboard response shouldn't kill the whole run: retry each
    // table a few times, then move on to the rest.
    let err = null;
    for (let attempt = 1; attempt <= 3; attempt++) {
      err = await deleteOneTable(name);
      if (!err) break;
      console.warn(`[convex-quick-delete] "${name}" attempt ${attempt}/3: ${err}`);
      await closeStrayUI();
      await sleep(500 * attempt);
    }
    if (err) failures.push(`"${name}": ${err}`);
    else selected.delete(name);
  }
  bulkRunning = false;
  delete btn.dataset.armed;
  btn.classList.remove('cqd-armed');
  if (failures.length) {
    console.warn('[convex-quick-delete] bulk finished with failures:', failures);
    btn.classList.add('cqd-error');
    btn.querySelector('.cqd-label').textContent =
      `${failures.length} failed – see console`;
    // Failed tables stay selected, so one more click retries just them.
    setTimeout(() => {
      btn.classList.remove('cqd-error');
      updateBulkBar();
    }, 3500);
  } else {
    setSelectMode(false);
  }
}

function makeBulkBar() {
  const bar = document.createElement('div');
  bar.className = 'cqd-bulk-bar';

  const toggle = document.createElement('button');
  toggle.type = 'button';
  toggle.className = 'cqd-bulk-toggle';
  toggle.innerHTML = TRASH_SVG + '<span class="cqd-label">Bulk Delete</span>';
  toggle.addEventListener('click', () => {
    if (bulkRunning || toggle.classList.contains('cqd-disabled')) return;
    setSelectMode(!selectMode);
  });

  const label = document.createElement('label');
  label.className = 'cqd-bulk-label';
  const { wrap: allWrap, input: selectAll } = makeCircleCheck('cqd-select-all');
  selectAll.addEventListener('change', () => {
    const eligible = sidebarLinks().filter((l) => l.outOfSchema);
    if (selectAll.checked) eligible.forEach((l) => selected.add(l.name));
    else selected.clear();
    syncCheckboxes();
    updateBulkBar();
  });
  label.append(allWrap, document.createTextNode('All'));

  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'cqd-bulk-delete';
  btn.innerHTML = TRASH_SVG + '<span class="cqd-label">Delete (0)</span>';
  btn.addEventListener('click', () => {
    if (bulkRunning || selected.size === 0) return;
    if (btn.dataset.armed) {
      clearTimeout(bulkDisarmTimer);
      runBulkDelete(btn);
    } else {
      btn.dataset.armed = '1';
      btn.classList.add('cqd-armed');
      btn.querySelector('.cqd-label').textContent = `Confirm ${selected.size}?`;
      bulkDisarmTimer = setTimeout(() => {
        delete btn.dataset.armed;
        btn.classList.remove('cqd-armed');
        updateBulkBar();
      }, ARM_TIMEOUT_MS);
    }
  });

  const controls = document.createElement('div');
  controls.className = 'cqd-bulk-controls';
  controls.append(label, btn);
  bar.append(toggle, controls);
  return bar;
}

function injectSidebar() {
  const links = sidebarLinks();
  if (links.length === 0) {
    document.querySelector('.cqd-bulk-bar')?.remove();
    return;
  }

  // Drop selections for tables that no longer exist or are back in schema.
  const eligibleNames = new Set(
    links.filter((l) => l.outOfSchema).map((l) => l.name)
  );
  [...selected].forEach((n) => {
    if (!eligibleNames.has(n)) selected.delete(n);
  });

  for (const { a, name, outOfSchema } of links) {
    let existing = a.querySelector('.cqd-check-wrap');
    // Re-create the checkbox when the table moves in/out of the schema.
    if (existing && (existing.dataset.inSchema === '1') !== !outOfSchema) {
      existing.remove();
      existing = null;
    }
    if (existing) continue;

    const { wrap, input } = makeCircleCheck('cqd-check');
    wrap.classList.add('cqd-row-check');
    input.dataset.table = name;
    if (!outOfSchema) {
      // Visible in select mode but inert: only out-of-schema tables can be
      // deleted.
      wrap.dataset.inSchema = '1';
      wrap.classList.add('cqd-in-schema');
      wrap.title = IN_SCHEMA_TABLE_MSG;
      input.disabled = true;
    } else {
      input.checked = selected.has(name);
    }
    // The checkbox lives inside an <a>: preventDefault stops navigation, so
    // toggle the selection by hand.
    wrap.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (!selectMode || input.disabled) return;
      if (selected.has(name)) selected.delete(name);
      else selected.add(name);
      input.checked = selected.has(name);
      updateBulkBar();
    });
    a.prepend(wrap);
  }

  const anyEligible = eligibleNames.size > 0;
  if (!anyEligible && selectMode) setSelectMode(false);

  let bar = document.querySelector('.cqd-bulk-bar');
  if (!bar) {
    // Mount above the table list: the common parent of the sidebar links.
    const list = links[0].a.parentElement;
    bar = makeBulkBar();
    list.parentElement.insertBefore(bar, list);
    applyModeToBar(bar);
  }

  // Align the bar's edges exactly with the row edges (the scrollable list
  // reserves a scrollbar gutter that the bar's parent does not).
  const rowRect = links[0].a.getBoundingClientRect();
  const parentRect = bar.parentElement.getBoundingClientRect();
  bar.style.marginLeft = Math.max(0, rowRect.left - parentRect.left) + 'px';
  bar.style.marginRight = Math.max(0, parentRect.right - rowRect.right) + 'px';

  const toggle = bar.querySelector('.cqd-bulk-toggle');
  toggle.classList.toggle('cqd-disabled', !anyEligible);
  if (!anyEligible) toggle.title = IN_SCHEMA_ALL_MSG;
  else if (toggle.title === IN_SCHEMA_ALL_MSG) toggle.title = '';

  syncCheckboxes();
  updateBulkBar();
}
