import type { ReactNode } from 'react';
import { site } from '../site';

export default function LegalPage({ title, children }: { title: string; children: ReactNode }) {
  return (
    <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
      <h1 className="text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl dark:text-stone-50">
        {title}
      </h1>
      <p className="mt-2 text-sm text-stone-500 dark:text-stone-400">
        Effective {site.legalEffectiveDate}
      </p>
      <div className="legal mt-8">{children}</div>
    </article>
  );
}

// How to reach us, phrased for the end of a legal page.
export function ContactLine() {
  return site.contactEmail ? (
    <>
      email <a href={`mailto:${site.contactEmail}`}>{site.contactEmail}</a> or open an issue on{' '}
      <a href={site.issuesUrl}>GitHub</a>
    </>
  ) : (
    <>
      open an issue on <a href={site.issuesUrl}>GitHub</a>
    </>
  );
}
