// Small generic helpers with no knowledge of the Convex dashboard.
//
// All of these files load as plain content scripts into the same isolated
// world, in the order listed in manifest.json — so top-level declarations in
// earlier files are visible to later ones. No modules, no build step.

const ARM_TIMEOUT_MS = 4000; // how long a "Confirm?" state lasts before disarming

// The trash icon both delete buttons share.
const TRASH_SVG =
  '<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><rect x="9.2" y="2" width="5.6" height="2.4" rx="1.1"/><rect x="4" y="4.6" width="16" height="3" rx="1.5"/><path fill-rule="evenodd" d="M5.8,9 h12.4 v10.6 a2.4,2.4 0 0 1 -2.4,2.4 h-7.6 a2.4,2.4 0 0 1 -2.4,-2.4 Z M9.9,11.8 h1.7 v6.6 h-1.7 Z M13.2,11.8 h1.7 v6.6 h-1.7 Z"/></svg>';

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Poll `fn` until it returns something truthy, or give up and return null.
async function waitFor(fn, timeoutMs = 5000, intervalMs = 50) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    const result = fn();
    if (result) return result;
    await sleep(intervalMs);
  }
  return null;
}

// Synthetic mouse events on Radix menu items can wedge the page in a focus
// loop; the keyboard path behaves, so focus the item and press Enter on it.
function keyboardSelect(item) {
  item.focus();
  const opts = {
    key: 'Enter',
    code: 'Enter',
    keyCode: 13,
    which: 13,
    bubbles: true,
    cancelable: true,
  };
  item.dispatchEvent(new KeyboardEvent('keydown', opts));
  item.dispatchEvent(new KeyboardEvent('keyup', opts));
}

// React ignores a plain `input.value = x`. Going through the native setter
// and then firing an input event makes its onChange see the new value.
function setReactInputValue(input, value) {
  const setter = Object.getOwnPropertyDescriptor(
    window.HTMLInputElement.prototype,
    'value'
  ).set;
  setter.call(input, value);
  input.dispatchEvent(new Event('input', { bubbles: true }));
}
