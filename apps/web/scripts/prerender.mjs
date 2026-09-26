// Renders every route to static HTML after `vite build`, so each page works
// without JavaScript (and on any static host, with no rewrite rules), then
// hydrates on load.

import { mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { dirname } from 'node:path';

const dist = new URL('../dist/', import.meta.url);
const ssrDir = new URL('../dist-ssr/', import.meta.url);
const template = readFileSync(new URL('index.html', dist), 'utf8');
const { render, routes } = await import(new URL('entry-server.js', ssrDir).href);

const escape = (s) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

for (const [path, route] of Object.entries(routes)) {
  const html = template
    .replace(/<title>.*?<\/title>/, `<title>${escape(route.title)}</title>`)
    .replace(
      /<meta name="description" content=".*?" \/>/,
      `<meta name="description" content="${escape(route.description)}" />`
    )
    .replace('<!--app-->', render(path));
  const out = new URL(route.file, dist);
  mkdirSync(dirname(out.pathname), { recursive: true });
  writeFileSync(out, html);
  console.log(`prerendered ${path} -> dist/${route.file}`);
}

rmSync(ssrDir, { recursive: true, force: true });
