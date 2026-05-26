import type { BaseTemplateProps } from './BaseTemplate';
import {
  CLASSIC_MAIN_TYPES,
  CLASSIC_SIDEBAR_TYPES,
  entryDateLabel,
  filterSectionsByTypes,
  getContactLines,
  getInitials,
  getSummaryText,
  getVisibleSections,
  skillLabel,
} from './template-helpers';
import styles from './DuskTemplate.module.css';

export function DuskTemplate({ document }: BaseTemplateProps) {
  const { header } = document;
  const visible = getVisibleSections(document);
  const sidebarSections = filterSectionsByTypes(visible, CLASSIC_SIDEBAR_TYPES);
  const mainSections = filterSectionsByTypes(visible, CLASSIC_MAIN_TYPES).filter(
    (s) => s.type !== 'summary',
  );
  const summary = getSummaryText(document);
  const contact = getContactLines(header);

  return (
    <div className={`cv-template ${styles.root}`}>
      <aside className={styles.sidebar}>
        <h1 className={styles.name}>
          {header.firstName} {header.lastName}
        </h1>
        {header.jobTitle && <p className={styles.jobTitle}>{header.jobTitle}</p>}
        <div className={styles.photoWrap}>
          {header.photo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={header.photo} alt="" className={styles.photo} />
          ) : (
            <div className={styles.initials} aria-hidden>
              {getInitials(header.firstName, header.lastName)}
            </div>
          )}
        </div>
        {contact.map((line) => (
          <p key={line} className={styles.contact}>
            {line}
          </p>
        ))}
        {sidebarSections.map((section) => (
          <div key={section.id} className={styles.sideBlock}>
            <h2 className={styles.sideTitle}>{section.title}</h2>
            {section.type === 'skills' ? (
              <p className={styles.skills}>
                {section.entries.map((e) => skillLabel(e)).join(' · ')}
              </p>
            ) : (
              section.entries.map((e) => <p key={e.id} className={styles.sideEntry}>{e.title}</p>)
            )}
          </div>
        ))}
      </aside>
      <main className={styles.main}>
        {summary && (
          <section>
            <h2 className={styles.mainTitle}>Profil</h2>
            <p className={styles.summary}>{summary}</p>
          </section>
        )}
        {mainSections.map((section) => (
          <section key={section.id}>
            <h2 className={styles.mainTitle}>{section.title}</h2>
            {section.entries.map((entry) => (
              <div key={entry.id} className={styles.entry}>
                <p className={styles.entryTitle}>{entry.title}</p>
                {entry.subtitle && <p className={styles.entrySubtitle}>{entry.subtitle}</p>}
                {entryDateLabel(entry, document) && (
                  <p className={styles.entryMeta}>{entryDateLabel(entry, document)}</p>
                )}
                {entry.description && <p className={styles.entryDescription}>{entry.description}</p>}
              </div>
            ))}
          </section>
        ))}
      </main>
    </div>
  );
}
