import type { BaseTemplateProps } from './BaseTemplate';
import {
  CLASSIC_MAIN_TYPES,
  CLASSIC_SIDEBAR_TYPES,
  filterSectionsByTypes,
  getContactLines,
  getInitials,
  getSummaryText,
  getVisibleSections,
  entryDateLabel,
  skillLabel,
} from './template-helpers';
import styles from './CoralTemplate.module.css';

export function CoralTemplate({ document }: BaseTemplateProps) {
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
        <h1 className={styles.name}>
          {header.firstName} {header.lastName}
        </h1>
        {header.jobTitle && <p className={styles.jobTitle}>{header.jobTitle}</p>}
        {contact.length > 0 && (
          <ul className={styles.contactList}>
            {contact.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
        )}
        {sidebarSections.map((section) => (
          <div key={section.id} className={styles.sidebarBlock}>
            <h2 className={styles.sidebarTitle}>{section.title}</h2>
            {section.type === 'skills' ? (
              <div className={styles.tags}>
                {section.entries.map((entry) => (
                  <span key={entry.id} className={styles.tag}>
                    {skillLabel(entry)}
                  </span>
                ))}
              </div>
            ) : (
              <ul className={styles.contactList}>
                {section.entries.map((entry) => (
                  <li key={entry.id}>{entry.title}</li>
                ))}
              </ul>
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
