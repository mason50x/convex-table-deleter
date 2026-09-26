import type { ComponentType } from 'react';
import Home from './pages/Home';
import NotFound from './pages/NotFound';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import { site } from './site';

export type Route = {
  // The file the prerender step writes this page to, relative to dist/.
  file: string;
  title: string;
  description: string;
  component: ComponentType;
};

export const routes: Record<string, Route> = {
  '/': {
    file: 'index.html',
    title: `${site.name} — one-click delete for Convex tables`,
    description:
      "Chrome extension that deletes Convex dashboard tables that aren't in your schema in one click. Skips the menu clicks and typed confirmation phrase.",
    component: Home,
  },
  '/privacy': {
    file: 'privacy/index.html',
    title: `Privacy Policy — ${site.name}`,
    description: `How ${site.name} handles your data: it collects nothing and sends nothing anywhere.`,
    component: Privacy,
  },
  '/terms': {
    file: 'terms/index.html',
    title: `Terms of Service — ${site.name}`,
    description: `The terms for using the ${site.name} Chrome extension and website.`,
    component: Terms,
  },
  '/404': {
    file: '404.html',
    title: `Page not found — ${site.name}`,
    description: 'This page does not exist.',
    component: NotFound,
  },
};

// "/privacy/", "/privacy.html" and "/privacy/index.html" all mean "/privacy".
export function resolveRoute(pathname: string): Route {
  const path =
    pathname
      .replace(/\/index\.html$/, '/')
      .replace(/\.html$/, '')
      .replace(/\/+$/, '') || '/';
  return routes[path] ?? routes['/404'];
}
