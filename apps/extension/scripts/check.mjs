// Sanity checks for the extension, since there's no build step or test suite:
//   - manifest.json parses, and its version matches package.json
//   - every content script passes `node --check`
//   - the scripts concatenated in manifest order also pass — they share one
//     scope, so this catches duplicate top-level declarations

import { execFileSync } from 'node:child_process';
import { mkdtempSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const root = new URL('..', import.meta.url).pathname;
const read = (p) => readFileSync(join(root, p), 'utf8');

const manifest = JSON.parse(read('manifest.json'));
const pkg = JSON.parse(read('package.json'));
if (manifest.version !== pkg.version) {
  throw new Error(
    `manifest.json version ${manifest.version} != package.json version ${pkg.version}`
  );
}

const check = (file) => execFileSync(process.execPath, ['--check', file], { stdio: 'inherit' });

for (const f of readdirSync(join(root, 'src')).filter((f) => f.endsWith('.js'))) {
  check(join(root, 'src', f));
}

const combined = join(mkdtempSync(join(tmpdir(), 'ctd-')), 'combined.js');
writeFileSync(combined, manifest.content_scripts[0].js.map(read).join('\n'));
check(combined);

console.log('extension: all checks passed');
