import type { ReactNode } from 'react';
import Demo from '../components/Demo';
import { site } from '../site';

const installUrl = site.chromeWebStoreUrl || `${site.repoUrl}#install-unpacked`;
const installLabel = site.chromeWebStoreUrl ? 'Add to Chrome — it’s free' : 'Install from GitHub';

const MANUAL_STEPS = [
  'Open the table’s ⋮ menu',
  'Choose “Delete Table”',
  <>
    Type <code className="font-mono text-[0.85em]">Delete production table myTable</code>
  </>,
  'Click Delete',
  'Repeat for every table',
];

const FEATURES: { title: string; body: string; icon: ReactNode }[] = [
  {
    title: 'Delete button in the toolbar',
    body: 'Sits next to the table’s ⋮ menu and matches the dashboard in light and dark mode. Click to arm, click again to run the whole flow.',
    icon: <path d="M4 7h16M10 11v6M14 11v6M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2l1-12M9 7V4h6v3" />,
  },
  {
    title: 'Bulk delete from the sidebar',
    body: 'Checkboxes next to every out-of-schema table, plus select-all and a “Delete (N)” bar. Tables are deleted one after another with progress.',
    icon: <path d="M4 6h2M4 12h2M4 18h2M10 6h10M10 12h10M10 18h10" />,
  },
  {
    title: 'Confirm-armed, every time',
    body: 'The first click only arms a button (“Confirm?”). It disarms after four seconds, on Esc, or when you click anywhere else.',
    icon: <path d="M12 3 3 20h18L12 3Zm0 7v4m0 3v.01" />,
  },
];

const SAFETY = [
  {
    title: 'Schema tables are off-limits',
    body: 'Buttons and checkboxes only work on tables marked * — the ones your schema no longer defines. In-schema tables stay greyed out.',
  },
  {
    title: 'Uses the dashboard’s own flow',
    body: 'It fills in and submits the same confirmation dialog you would. No API calls, nothing bypasses Convex’s permissions.',
  },
  {
    title: 'Collects nothing',
    body: `Runs only on ${site.dashboardHost}. No analytics, no storage, no network requests, no remote code.`,
  },
];

function Section({ id, children }: { id?: string; children: ReactNode }) {
  return (
    <section id={id} className="mx-auto max-w-6xl scroll-mt-20 px-4 py-16 sm:px-6 sm:py-20">
      {children}
    </section>
  );
}

function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <p className="text-sm font-semibold tracking-wide text-red-700 uppercase dark:text-red-400">
      {children}
    </p>
  );
}

function PrimaryButton() {
  return (
    <a
      href={installUrl}
      className="inline-flex items-center gap-2 rounded-lg bg-red-700 px-5 py-2.5 font-semibold text-white shadow-sm shadow-red-900/20 hover:bg-red-800"
    >
      {installLabel}
    </a>
  );
}

export default function Home() {
  return (
    <>
      {/* Hero */}
      <div className="border-b border-stone-200 bg-gradient-to-b from-white to-stone-50 dark:border-stone-800 dark:from-stone-900 dark:to-stone-950">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-16 sm:px-6 sm:py-24 lg:grid-cols-[1fr_1.1fr]">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-stone-300 bg-white px-3 py-1 text-xs font-medium text-stone-600 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-300">
              Chrome extension for the Convex dashboard
            </p>
            <h1 className="mt-5 text-4xl font-bold tracking-tight text-balance text-stone-900 sm:text-5xl dark:text-stone-50">
              Delete leftover Convex tables in one click.
            </h1>
            <p className="mt-5 max-w-xl text-lg text-pretty text-stone-600 dark:text-stone-400">
              Tables you’ve removed from your schema linger in the dashboard, and each one takes a
              menu, a dialog and a typed confirmation phrase to delete. {site.name} turns that into
              a single confirmed click — or one click for all of them.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <PrimaryButton />
              <a
                href={site.repoUrl}
                className="rounded-lg px-4 py-2.5 font-medium text-stone-700 hover:bg-stone-200/60 dark:text-stone-300 dark:hover:bg-stone-800"
              >
                View source →
              </a>
            </div>
            <p className="mt-4 text-sm text-stone-500 dark:text-stone-400">
              Free and open source (MIT). Collects no data.
            </p>
          </div>
          <Demo />
        </div>
      </div>

      {/* Before / after */}
      <Section>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-xl border border-stone-200 bg-white p-6 dark:border-stone-800 dark:bg-stone-900">
            <p className="text-sm font-semibold text-stone-500 dark:text-stone-400">Without it</p>
            <ol className="mt-4 space-y-3">
              {MANUAL_STEPS.map((step, i) => (
                <li key={i} className="flex gap-3 text-stone-700 dark:text-stone-300">
                  <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-stone-100 text-xs font-semibold text-stone-500 dark:bg-stone-800 dark:text-stone-400">
                    {i + 1}
                  </span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          </div>
          <div className="rounded-xl border border-red-200 bg-red-50/60 p-6 dark:border-red-900/60 dark:bg-red-950/30">
            <p className="text-sm font-semibold text-red-700 dark:text-red-400">With it</p>
            <ol className="mt-4 space-y-3">
              {['Tick the tables (or select all)', 'Click Delete, then Confirm'].map((step, i) => (
                <li key={i} className="flex gap-3 text-stone-800 dark:text-stone-200">
                  <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-red-700 text-xs font-semibold text-white">
                    {i + 1}
                  </span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
            <p className="mt-6 text-sm text-stone-600 dark:text-stone-400">
              The extension walks through the menu, dialog and confirmation phrase for each table
              for you.
            </p>
          </div>
        </div>
      </Section>

      {/* Features */}
      <Section id="features">
        <Eyebrow>Features</Eyebrow>
        <h2 className="mt-2 text-3xl font-bold tracking-tight text-stone-900 dark:text-stone-50">
          Built into the dashboard you already use
        </h2>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="rounded-xl border border-stone-200 bg-white p-6 dark:border-stone-800 dark:bg-stone-900"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.8}
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
                className="size-6 text-red-700 dark:text-red-400"
              >
                {f.icon}
              </svg>
              <h3 className="mt-4 font-semibold text-stone-900 dark:text-stone-100">{f.title}</h3>
              <p className="mt-2 text-stone-600 dark:text-stone-400">{f.body}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Safety */}
      <div className="border-y border-stone-200 bg-stone-900 text-stone-100 dark:border-stone-800">
        <Section id="safety">
          <p className="text-sm font-semibold tracking-wide text-red-400 uppercase">Safety</p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight">
            Fast, but never careless with your data
          </h2>
          <div className="mt-10 grid gap-8 md:grid-cols-3">
            {SAFETY.map((s) => (
              <div key={s.title}>
                <h3 className="font-semibold">{s.title}</h3>
                <p className="mt-2 text-stone-400">{s.body}</p>
              </div>
            ))}
          </div>
          <p className="mt-10 text-sm text-stone-400">
            Read the full <a href="/privacy/" className="underline underline-offset-2 hover:text-white">Privacy Policy</a>.
          </p>
        </Section>
      </div>

      {/* CTA */}
      <Section>
        <div className="flex flex-col items-center text-center">
          <img src="/icon-128.png" alt="" width={64} height={64} className="size-16" />
          <h2 className="mt-6 text-3xl font-bold tracking-tight text-stone-900 dark:text-stone-50">
            Clean up your Convex tables
          </h2>
          <p className="mt-3 max-w-lg text-stone-600 dark:text-stone-400">
            Works in Chrome and other Chromium browsers. Unofficial, and not affiliated with Convex,
            Inc.
          </p>
          <div className="mt-8">
            <PrimaryButton />
          </div>
        </div>
      </Section>
    </>
  );
}
