import type { BaseTemplateProps } from './BaseTemplate';
import type { CVSection } from '@/types/cv.types';
import {
  entryDateLabel,
  getContactLines,
  getSummaryText,
  getVisibleSections,
  skillLabel,
} from './template-helpers';
import styles from './ElegantTemplate.module.css';

function renderSectionBody(section: CVSection) {
  if (section.type === 'skills') {
    return (
      <p className={styles.inlineTags}>
        {section.entries.map((entry) => skillLabel(entry)).filter(Boolean).join(' · ')}
      </p>
    );
  }

  return section.entries.map((entry) => (
    <div key={entry.id} className={styles.entry}>
      <div className={styles.entryHead}>
        <p className={styles.entryTitle}>{entry.title}</p>
        {entryDateLabel(entry) && <p className={styles.entryDate}>{entryDateLabel(entry)}</p>}
      </div>
      {entry.subtitle && <p className={styles.entrySubtitle}>{entry.subtitle}</p>}
      {entry.location && <p className={styles.entryMeta}>{entry.location}</p>}
      {entry.level !== undefined && section.type === 'languages' && (
        <p className={styles.entryMeta}>Niveau {entry.level}/5</p>
      )}
      {entry.description && <p className={styles.entryDescription}>{entry.description}</p>}
    </div>
  ));
}

export function ElegantTemplate({ document }: BaseTemplateProps) {
  const { header } = document;
  const visible = getVisibleSections(document);
  const summary = getSummaryText(document);
  const contact = getContactLines(header);

  return (
    <div className={`cv-template ${styles.root}`}>
      <header className={styles.header}>
        <h1 className={styles.name}>
          {header.firstName} {header.lastName}
        </h1>
        {header.jobTitle && <p className={styles.jobTitle}>{header.jobTitle}</p>}
        {contact.length > 0 && <p className={styles.contact}>{contact.join(' · ')}</p>}
        <div className={styles.ornament} aria-hidden />
      </header>

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
            {renderSectionBody(section)}
          </section>
        ))}
    </div>
  );
}
