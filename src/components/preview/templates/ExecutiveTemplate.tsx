import type { BaseTemplateProps } from './BaseTemplate';
import {
  entryDateLabel,
  getContactLines,
  getSummaryText,
  getVisibleSections,
} from './template-helpers';
import styles from './ExecutiveTemplate.module.css';

export function ExecutiveTemplate({ document }: BaseTemplateProps) {
  const { header } = document;
  const visible = getVisibleSections(document);
  const summary = getSummaryText(document);
  const contact = getContactLines(header);

  return (
    <div className={`cv-template ${styles.root}`}>
      <div className={styles.topRow}>
        {header.photo && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={header.photo} alt="" className={styles.photo} />
        )}
        <h1 className={styles.name}>
          {header.firstName} {header.lastName}
        </h1>
      </div>
      <div className={styles.divider} aria-hidden />
      {header.jobTitle && <p className={styles.jobTitle}>{header.jobTitle}</p>}
      {contact.length > 0 && <p className={styles.contact}>{contact.join(' · ')}</p>}

      {summary && (
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Profil exécutif</h2>
          <p className={styles.summary}>{summary}</p>
        </section>
      )}

      {visible
        .filter((section) => section.type !== 'summary')
        .map((section) => (
          <section key={section.id} className={styles.section}>
            <h2 className={styles.sectionTitle}>{section.title}</h2>
            {section.entries.map((entry) => (
              <div key={entry.id} className={styles.entry}>
                <p className={styles.entryTitle}>{entry.title}</p>
                {entry.subtitle && <p className={styles.entrySubtitle}>{entry.subtitle}</p>}
                {entryDateLabel(entry) && <p className={styles.entryMeta}>{entryDateLabel(entry)}</p>}
                {entry.description && (
                  <p className={styles.entryDescription}>{entry.description}</p>
                )}
                {entry.level !== undefined && section.type === 'languages' && (
                  <p className={styles.entryMeta}>Maîtrise : {entry.level}/5</p>
                )}
              </div>
            ))}
          </section>
        ))}

      <footer className={styles.footer}>Page 1</footer>
    </div>
  );
}
