import type { BaseTemplateProps } from './BaseTemplate';
import type { CVDocument, CVSection } from '@/types/cv.types';
import {
  entryDateLabel,
  getContactLines,
  getSummaryText,
  getVisibleSections,
  skillLabel,
} from './template-helpers';
import styles from './AcademicTemplate.module.css';

function renderSectionBody(section: CVSection, cv: CVDocument) {
  if (section.type === 'skills') {
    return (
      <ul className={styles.bulletList}>
        {section.entries.map((entry) => (
          <li key={entry.id}>{skillLabel(entry)}</li>
        ))}
      </ul>
    );
  }

  return (
    <ul className={styles.entryList}>
      {section.entries.map((entry) => (
        <li key={entry.id} className={styles.entry}>
          <div className={styles.entryHeader}>
            <div>
              <p className={styles.entryTitle}>{entry.title}</p>
              {entry.subtitle && <p className={styles.entrySubtitle}>{entry.subtitle}</p>}
              {entry.location && <p className={styles.entryMeta}>{entry.location}</p>}
            </div>
            {entryDateLabel(entry, cv) && (
              <p className={styles.entryDate}>{entryDateLabel(entry, cv)}</p>
            )}
          </div>
          {entry.level !== undefined && section.type === 'languages' && (
            <p className={styles.entryMeta}>Niveau {entry.level}/5</p>
          )}
          {entry.description && <p className={styles.entryDescription}>{entry.description}</p>}
        </li>
      ))}
    </ul>
  );
}

export function AcademicTemplate({ document }: BaseTemplateProps) {
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
        </div>
        {contact.length > 0 && (
          <ul className={styles.contactList}>
            {contact.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
        )}
      </header>

      {summary && (
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Profil</h2>
          <p className={styles.summary}>{summary}</p>
        </section>
      )}

      {visible
        .filter((section) => section.type !== 'summary')
        .map((section) => (
          <section key={section.id} className={styles.section}>
            <h2 className={styles.sectionTitle}>{section.title}</h2>
            {renderSectionBody(section, document)}
          </section>
        ))}
    </div>
  );
}
