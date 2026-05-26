'use client';

import { useCVStore } from '@/store/cv.store';
import { formatDateRange } from '@/utils/cv.utils';

/** Aperçu minimal temps réel (remplacé par les templates au Bloc 6–7). */
export function EditorLivePreview() {
  const document = useCVStore((state) => state.document);

  return (
    <div className="mx-auto max-w-2xl rounded-xl bg-white p-8 shadow-sm">
      <header className="border-b border-slate-200 pb-4">
        <h1 className="text-2xl font-bold text-slate-900">
          {document.header.firstName} {document.header.lastName}
        </h1>
        <p className="text-lg text-slate-600">{document.header.jobTitle}</p>
        <p className="mt-2 text-sm text-slate-500">
          {[document.header.email, document.header.phone, document.header.location]
            .filter(Boolean)
            .join(' · ')}
        </p>
        {document.header.summary && (
          <p className="mt-3 text-sm leading-relaxed text-slate-700">{document.header.summary}</p>
        )}
      </header>

      <div className="mt-6 flex flex-col gap-6">
        {document.sections
          .filter((section) => section.visible)
          .map((section) => (
            <section key={section.id}>
              <h2
                className="mb-2 text-sm font-bold uppercase tracking-wide"
                style={{ color: document.colors.primary }}
              >
                {section.title}
              </h2>
              <ul className="flex flex-col gap-3">
                {section.entries.map((entry) => (
                  <li key={entry.id} className="text-sm text-slate-700">
                    <p className="font-medium text-slate-900">{entry.title}</p>
                    {entry.subtitle && <p className="text-slate-600">{entry.subtitle}</p>}
                    {(entry.startDate || entry.current) && (
                      <p className="text-xs italic text-slate-400">
                        {formatDateRange(entry.startDate, entry.endDate, entry.current)}
                      </p>
                    )}
                    {entry.tags && entry.tags.length > 0 && (
                      <p className="mt-1 text-xs text-slate-500">{entry.tags.join(' · ')}</p>
                    )}
                    {entry.level !== undefined && section.type === 'languages' && (
                      <p className="text-xs text-slate-500">Niveau {entry.level}/5</p>
                    )}
                    {entry.description && (
                      <p className="mt-1 whitespace-pre-wrap text-slate-600">{entry.description}</p>
                    )}
                  </li>
                ))}
              </ul>
            </section>
          ))}
      </div>
    </div>
  );
}
