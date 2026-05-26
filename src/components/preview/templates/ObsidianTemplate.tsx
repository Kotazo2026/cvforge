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
import styles from './ObsidianTemplate.module.css';

export function ObsidianTemplate({ document }: BaseTemplateProps) {
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
        {header.photo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={header.photo} alt="" className={styles.photo} />
        ) : (
          <div className={styles.initials} aria-hidden>
            {getInitials(header.firstName, header.lastName)}
          </div>
        )}
        <h1 className={styles.name}>
          {header.firstName} {header.lastName}
        </h1>
        {header.jobTitle && <p className={styles.jobTitle}>{header.jobTitle}</p>}
        {contact.map((line) => (
          <p key={line} className={styles.contactLine}>
            {line}
          </p>
        ))}
        {sidebarSections.map((section) => (
          <div key={section.id} className={styles.sidebarBlock}>
            <h2 className={styles.sidebarTitle}>{section.title}</h2>
            {section.type === 'skills' ? (
              <div className={styles.tags}>
                {section.entries.map((e) => (
                  <span key={e.id} className={styles.tag}>
                    {skillLabel(e)}
                  </span>
                ))}
              </div>
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
                <div className={styles.entryRow}>
                  <p className={styles.entryTitle}>{entry.title}</p>
                  {entryDateLabel(entry, document) && (
                    <span className={styles.date}>{entryDateLabel(entry, document)}</span>
                  )}
                </div>
                {entry.subtitle && <p className={styles.entrySubtitle}>{entry.subtitle}</p>}
                {entry.description && <p className={styles.entryDescription}>{entry.description}</p>}
              </div>
            ))}
          </section>
        ))}
      </main>
    </div>
  );
}
