import { useEffect, useRef, useState } from 'react';

// A clickable mock of the Convex Data page with the extension installed.
// Nothing here talks to Convex — it just replays the extension's behavior.

const TABLES = [
  { name: 'messages', inSchema: true },
  { name: 'messages_old', inSchema: false },
  { name: 'migration_tmp', inSchema: false },
  { name: 'sessions', inSchema: true },
  { name: 'test_users', inSchema: false },
  { name: 'users', inSchema: true },
];

const ARM_TIMEOUT_MS = 4000; // same as the extension
const STEP_MS = 550;

function TrashIcon({ className = 'size-3.5' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <rect x="9.2" y="2" width="5.6" height="2.4" rx="1.1" />
      <rect x="4" y="4.6" width="16" height="3" rx="1.5" />
      <path
        fillRule="evenodd"
        d="M5.8,9 h12.4 v10.6 a2.4,2.4 0 0 1 -2.4,2.4 h-7.6 a2.4,2.4 0 0 1 -2.4,-2.4 Z M9.9,11.8 h1.7 v6.6 h-1.7 Z M13.2,11.8 h1.7 v6.6 h-1.7 Z"
      />
    </svg>
  );
}

export default function Demo() {
  const [deleted, setDeleted] = useState<string[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [active, setActive] = useState('messages_old');
  const [armed, setArmed] = useState<'bulk' | 'toolbar' | null>(null);
  const [progress, setProgress] = useState<{ done: number; total: number } | null>(null);
  const timers = useRef<number[]>([]);
  const armTimer = useRef<number>(undefined);

  useEffect(
    () => () => {
      timers.current.forEach(clearTimeout);
      clearTimeout(armTimer.current);
    },
    []
  );

  const remaining = TABLES.filter((t) => !deleted.includes(t.name));
  const deletable = remaining.filter((t) => !t.inSchema).map((t) => t.name);
  const activeTable = remaining.find((t) => t.name === active) ?? remaining[0];
  const busy = progress !== null;

  function arm(which: 'bulk' | 'toolbar') {
    setArmed(which);
    clearTimeout(armTimer.current);
    armTimer.current = window.setTimeout(() => setArmed(null), ARM_TIMEOUT_MS);
  }

  function runDeletes(names: string[]) {
    setArmed(null);
    clearTimeout(armTimer.current);
    setProgress({ done: 0, total: names.length });
    names.forEach((name, i) => {
      timers.current.push(
        window.setTimeout(() => {
          setDeleted((d) => [...d, name]);
          setSelected((s) => s.filter((n) => n !== name));
          setProgress(i === names.length - 1 ? null : { done: i + 1, total: names.length });
        }, (i + 1) * STEP_MS)
      );
    });
  }

  function onToolbarClick() {
    if (!activeTable || activeTable.inSchema || busy) return;
    if (armed === 'toolbar') runDeletes([activeTable.name]);
    else arm('toolbar');
  }

  function onBulkClick() {
    if (selected.length === 0 || busy) return;
    if (armed === 'bulk') runDeletes(selected);
    else arm('bulk');
  }

  function toggle(name: string) {
    setArmed(null);
    setSelected((s) => (s.includes(name) ? s.filter((n) => n !== name) : [...s, name]));
  }

  const allSelected = deletable.length > 0 && deletable.every((n) => selected.includes(n));

  function reset() {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    setDeleted([]);
    setSelected([]);
    setActive('messages_old');
    setArmed(null);
    setProgress(null);
  }

  return (
    <div className="overflow-hidden rounded-xl border border-stone-300 bg-white shadow-2xl shadow-stone-900/10 dark:border-stone-700 dark:bg-stone-900 dark:shadow-black/40">
      {/* Window chrome */}
      <div className="flex items-center gap-2 border-b border-stone-200 bg-stone-100 px-3 py-2 dark:border-stone-800 dark:bg-stone-950">
        <span className="size-2.5 rounded-full bg-stone-300 dark:bg-stone-700" />
        <span className="size-2.5 rounded-full bg-stone-300 dark:bg-stone-700" />
        <span className="size-2.5 rounded-full bg-stone-300 dark:bg-stone-700" />
        <span className="ml-2 truncate rounded bg-white px-2 py-0.5 font-mono text-[11px] text-stone-500 dark:bg-stone-900 dark:text-stone-400">
          dashboard.convex.dev/…/data
        </span>
      </div>

      <div className="grid grid-cols-[minmax(0,11rem)_1fr] text-sm sm:grid-cols-[13rem_1fr]">
        {/* Sidebar */}
        <aside className="flex min-h-72 flex-col border-r border-stone-200 dark:border-stone-800">
          <p className="px-3 pt-3 pb-1 text-xs font-medium tracking-wide text-stone-500 uppercase dark:text-stone-400">
            Tables
          </p>
          <ul className="flex-1 px-1.5">
            {remaining.map((t) => {
              const isActive = t.name === activeTable?.name;
              const leaving = busy && selected.includes(t.name);
              return (
                <li key={t.name} className={leaving ? 'opacity-50 transition-opacity' : ''}>
                  <div
                    className={`flex items-center gap-2 rounded-md px-1.5 py-1 ${
                      isActive ? 'bg-stone-100 dark:bg-stone-800' : ''
                    }`}
                  >
                    <input
                      type="checkbox"
                      aria-label={`Select ${t.name}`}
                      className="size-3.5 accent-red-700 disabled:opacity-40"
                      disabled={t.inSchema || busy}
                      checked={selected.includes(t.name)}
                      onChange={() => toggle(t.name)}
                      title={t.inSchema ? 'This table is in the schema' : undefined}
                    />
                    <button
                      type="button"
                      onClick={() => setActive(t.name)}
                      className="min-w-0 flex-1 truncate text-left font-mono text-[12.5px] text-stone-700 dark:text-stone-300"
                    >
                      {t.name}
                      {!t.inSchema && <span className="ml-0.5 text-stone-400">*</span>}
                    </button>
                  </div>
                </li>
              );
            })}
            {remaining.length === 0 && (
              <li className="px-2 py-1 text-xs text-stone-400">No tables</li>
            )}
          </ul>

          {/* Bulk bar */}
          <div className="flex items-center gap-2 border-t border-stone-200 px-3 py-2 dark:border-stone-800">
            <input
              type="checkbox"
              aria-label="Select all out-of-schema tables"
              className="size-3.5 accent-red-700 disabled:opacity-40"
              disabled={deletable.length === 0 || busy}
              checked={allSelected}
              onChange={() => {
                setArmed(null);
                setSelected(allSelected ? [] : deletable);
              }}
            />
            <button
              type="button"
              onClick={onBulkClick}
              disabled={selected.length === 0 || busy}
              className={`ml-auto flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-semibold text-white shadow-sm transition-colors disabled:cursor-not-allowed disabled:bg-stone-300 disabled:text-stone-500 dark:disabled:bg-stone-700 dark:disabled:text-stone-400 ${
                armed === 'bulk' ? 'bg-amber-600' : 'bg-red-700 hover:bg-red-800'
              }`}
            >
              <TrashIcon className="size-3" />
              {progress
                ? `Deleting ${progress.done + 1}/${progress.total}…`
                : armed === 'bulk'
                  ? 'Confirm?'
                  : `Delete (${selected.length})`}
            </button>
          </div>
        </aside>

        {/* Table view */}
        <section className="flex min-w-0 flex-col">
          <div className="flex items-center gap-2 border-b border-stone-200 px-3 py-2 dark:border-stone-800">
            <h3 className="truncate font-mono text-[13px] font-semibold text-stone-900 dark:text-stone-100">
              {activeTable ? activeTable.name : '—'}
              {activeTable && !activeTable.inSchema && (
                <span className="ml-0.5 text-stone-400">*</span>
              )}
            </h3>
            {activeTable && (
              <button
                type="button"
                onClick={onToolbarClick}
                disabled={activeTable.inSchema || busy}
                title={
                  activeTable.inSchema
                    ? 'This table is in the schema — remove it from the schema first'
                    : 'Delete table'
                }
                className={`ml-auto flex items-center gap-1.5 rounded-md border px-2 py-1 text-xs font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${
                  armed === 'toolbar'
                    ? 'border-amber-600 bg-amber-600 text-white'
                    : 'border-stone-200 text-red-700 hover:bg-stone-100 dark:border-stone-700 dark:text-red-400 dark:hover:bg-stone-800'
                }`}
              >
                {armed === 'toolbar' && <span>Confirm?</span>}
                <TrashIcon />
              </button>
            )}
            <span className="text-stone-400" aria-hidden="true">
              ⋮
            </span>
          </div>
          <div className="flex-1 space-y-2 p-3" aria-hidden="true">
            {[0, 1, 2, 3, 4].map((i) => (
              <div key={i} className="flex gap-3">
                <div className="h-3 w-1/4 rounded bg-stone-100 dark:bg-stone-800" />
                <div className="h-3 flex-1 rounded bg-stone-100 dark:bg-stone-800" />
                <div className="h-3 w-1/6 rounded bg-stone-100 dark:bg-stone-800" />
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between gap-2 px-3 pb-3 text-xs text-stone-500 dark:text-stone-400">
            <span>
              {deletable.length === 0
                ? 'All leftover tables deleted. Schema tables untouched.'
                : 'Try it: tick some tables, or use the trash button.'}
            </span>
            {deleted.length > 0 && !busy && (
              <button
                type="button"
                onClick={reset}
                className="shrink-0 font-medium text-stone-700 underline underline-offset-2 dark:text-stone-300"
              >
                Reset demo
              </button>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
