export default function NotFound() {
  return (
    <div className="mx-auto max-w-xl px-4 py-24 text-center sm:px-6">
      <p className="font-mono text-sm text-red-700 dark:text-red-400">404</p>
      <h1 className="mt-2 text-3xl font-bold text-stone-900 dark:text-stone-50">
        This page was deleted
      </h1>
      <p className="mt-3 text-stone-600 dark:text-stone-400">
        Or it never existed. Either way, there’s nothing here.
      </p>
      <a
        href="/"
        className="mt-8 inline-block rounded-lg bg-stone-900 px-4 py-2 text-sm font-medium text-white hover:bg-stone-700 dark:bg-stone-100 dark:text-stone-900 dark:hover:bg-stone-300"
      >
        Back home
      </a>
    </div>
  );
}
