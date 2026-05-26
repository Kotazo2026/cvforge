import type { BaseTemplateProps } from './BaseTemplate';
import {
  entryDateLabel,
  getContactLines,
  getSummaryText,
  getVisibleSections,
  skillLabel,
} from './template-helpers';
import styles from './MinimalTemplate.module.css';

export function MinimalTemplate({ document }: BaseTemplateProps) {
  const { header } = document;
  const visible = getVisibleSections(document);
  const summary = getSummaryText(document);
  const contact = getContactLines(header);

  return (
    <div className={`cv-template ${styles.root}`}>
      <h1 className={styles.name}>
        {header.firstName} {header.lastName}
      </h1>
      {header.jobTitle && <p className={styles.jobTitle}>{header.jobTitle}</p>}
      {contact.length > 0 && <p className={styles.contact}>{contact.join(' · ')}</p>}

      {summary && (
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Profil</h2>
          <p className={styles.entryDescription}>{summary}</p>
        </section>
      )}

      {visible
        .filter((section) => section.type !== 'summary')
        .map((section) => (
          <section key={section.id} className={styles.section}>
            <h2 className={styles.sectionTitle}>{section.title}</h2>
            {section.type === 'skills' ? (
              <p className={styles.inlineTags}>
                {section.entries.map((entry) => skillLabel(entry)).filter(Boolean).join(' · ')}
              </p>
            ) : (
              section.entries.map((entry) => (
                <div key={entry.id} className={styles.entry}>
                  <p className={styles.entryTitle}>{entry.title}</p>
                  {entry.subtitle && <p className={styles.entrySubtitle}>{entry.subtitle}</p>}
                  {entryDateLabel(entry, document) && (
                    <p className={styles.entryMeta}>{entryDateLabel(entry, document)}</p>
                  )}
                  {entry.level !== undefined && section.type === 'languages' && (
                    <p className={styles.entryMeta}>Niveau {entry.level}/5</p>
                  )}
                  {entry.description && (
                    <p className={styles.entryDescription}>{entry.description}</p>
                  )}
                </div>
              ))
            )}
          </section>
        ))}
    </div>
  );
}
