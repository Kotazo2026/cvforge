import type { CVDocument } from '@/types/cv.types';
import {
  entryDateLabel,
  getSummaryText,
  getVisibleSections,
  skillLabel,
} from './template-helpers';

export interface SectionClassNames {
  section: string;
  sectionTitle: string;
  entry: string;
  entryTitle: string;
  entrySubtitle: string;
  entryMeta: string;
  entryDescription: string;
  inlineTags?: string;
}

/** CSS module map — templates pass `styles` from *.module.css */
export type SectionStyleMap = Record<string, string>;

export function SummaryBlock({
  document,
  classNames,
  title = 'Profil',
}: {
  document: CVDocument;
  classNames: SectionStyleMap;
  title?: string;
}) {
  const summary = getSummaryText(document);
  if (!summary) return null;
  return (
    <section className={classNames.section}>
      <h2 className={classNames.sectionTitle}>{title}</h2>
      <p className={classNames.entryDescription}>{summary}</p>
    </section>
  );
}

export function SectionsList({
  document,
  classNames,
}: {
  document: CVDocument;
  classNames: SectionStyleMap;
}) {
  const visible = getVisibleSections(document).filter((section) => section.type !== 'summary');

  return (
    <>
      {visible.map((section) => (
        <section key={section.id} className={classNames.section}>
          <h2 className={classNames.sectionTitle}>{section.title}</h2>
          {section.type === 'skills' ? (
            <p className={classNames.inlineTags ?? classNames.entryDescription}>
              {section.entries.map((entry) => skillLabel(entry)).filter(Boolean).join(' · ')}
            </p>
          ) : (
            section.entries.map((entry) => (
              <div key={entry.id} className={classNames.entry}>
                <p className={classNames.entryTitle}>{entry.title}</p>
                {entry.subtitle && <p className={classNames.entrySubtitle}>{entry.subtitle}</p>}
                {entry.location && <p className={classNames.entryMeta}>{entry.location}</p>}
                {entryDateLabel(entry, document) && (
                  <p className={classNames.entryMeta}>{entryDateLabel(entry, document)}</p>
                )}
                {entry.level !== undefined && section.type === 'languages' && (
                  <p className={classNames.entryMeta}>Niveau {entry.level}/5</p>
                )}
                {entry.description && (
                  <p className={classNames.entryDescription}>{entry.description}</p>
                )}
              </div>
            ))
          )}
        </section>
      ))}
    </>
  );
}
