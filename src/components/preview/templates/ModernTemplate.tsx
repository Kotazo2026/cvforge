import type { BaseTemplateProps } from './BaseTemplate';
import {
  entryDateLabel,
  getContactLines,
  getSummaryText,
  getVisibleSections,
  skillLabel,
} from './template-helpers';
import styles from './ModernTemplate.module.css';

export function ModernTemplate({ document }: BaseTemplateProps) {
  const { header } = document;
  const visible = getVisibleSections(document);
  const summary = getSummaryText(document);
  const contact = getContactLines(header);

  return (
    <div className={`cv-template ${styles.root}`}>
      <header className={styles.header}>
        <div className={styles.headerMain}>
          <h1 className={styles.name}>
            {header.firstName} {header.lastName}
          </h1>
          {header.jobTitle && <p className={styles.jobTitle}>{header.jobTitle}</p>}
          {contact.length > 0 && (
            <div className={styles.contactRow}>
              {contact.map((line) => (
                <span key={line}>{line}</span>
              ))}
            </div>
          )}
        </div>
        {header.photo && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={header.photo} alt="" className={styles.photo} />
        )}
      </header>

      <div className={styles.body}>
        {summary && (
          <section className={styles.fullWidth}>
            <h2 className={styles.sectionTitle}>Profil</h2>
            <p className={styles.entryDescription}>{summary}</p>
          </section>
        )}

        {visible
          .filter((section) => section.type !== 'summary')
          .map((section) => (
          <section key={section.id}>
            <h2 className={styles.sectionTitle}>{section.title}</h2>
            {section.type === 'skills' ? (
              <div className={styles.tagList}>
                {section.entries.map((entry) => (
                  <span key={entry.id} className={styles.tag}>
                    {skillLabel(entry)}
                  </span>
                ))}
              </div>
            ) : (
              section.entries.map((entry) => (
                <div key={entry.id} className={styles.entry}>
                  <p className={styles.entryTitle}>{entry.title}</p>
                  {entry.subtitle && <p className={styles.entrySubtitle}>{entry.subtitle}</p>}
                  {entryDateLabel(entry, document) && (
                    <span className={styles.dateBadge}>{entryDateLabel(entry, document)}</span>
                  )}
                  {entry.description && (
                    <p className={styles.entryDescription}>{entry.description}</p>
                  )}
                  {entry.level !== undefined && section.type === 'languages' && (
                    <p className={styles.entrySubtitle}>Niveau {entry.level}/5</p>
                  )}
                </div>
              ))
            )}
          </section>
        ))}
      </div>
    </div>
  );
}
