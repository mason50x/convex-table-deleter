import type { ReactNode } from 'react';
import { site } from '../site';

const navLink =
  'rounded-md px-3 py-1.5 text-sm font-medium text-stone-600 hover:bg-stone-200/60 hover:text-stone-900 dark:text-stone-400 dark:hover:bg-stone-800 dark:hover:text-stone-100';

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-10 border-b border-stone-200/80 bg-stone-50/85 backdrop-blur dark:border-stone-800 dark:bg-stone-950/85">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
          <a href="/" className="flex items-center gap-2.5 font-semibold text-stone-900 dark:text-stone-50">
            <img src="/icon-128.png" alt="" width={28} height={28} className="size-7" />
            <span className="hidden sm:inline">{site.name}</span>
          </a>
          <nav className="flex items-center gap-1">
            <a href="/#features" className={navLink}>
              Features
            </a>
            <a href="/privacy/" className={navLink}>
              Privacy
            </a>
            <a href="/terms/" className={navLink}>
              Terms
            </a>
            <a href={site.repoUrl} className={navLink}>
              GitHub
            </a>
          </nav>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="border-t border-stone-200 dark:border-stone-800">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-8 text-sm text-stone-500 sm:flex-row sm:items-center sm:justify-between sm:px-6 dark:text-stone-400">
          <p>
            © 2026 {site.company}. Unofficial third-party tool, not affiliated with or endorsed by
            Convex, Inc.
          </p>
          <div className="flex gap-4">
            <a href="/privacy/" className="hover:text-stone-900 dark:hover:text-stone-100">
              Privacy Policy
            </a>
            <a href="/terms/" className="hover:text-stone-900 dark:hover:text-stone-100">
              Terms of Service
            </a>
            <a href={site.repoUrl} className="hover:text-stone-900 dark:hover:text-stone-100">
              Source
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
