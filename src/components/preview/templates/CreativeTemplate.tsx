import type { BaseTemplateProps } from './BaseTemplate';
import type { CVSection } from '@/types/cv.types';
import {
  entryDateLabel,
  getContactLines,
  getSummaryText,
  getVisibleSections,
  levelPercent,
  skillLabel,
} from './template-helpers';
import styles from './CreativeTemplate.module.css';

export function CreativeTemplate({ document }: BaseTemplateProps) {
  const { header } = document;
  const visible = getVisibleSections(document);
  const summary = getSummaryText(document);
  const contact = getContactLines(header);

  const renderTimeline = (section: CVSection) => (
    <ul className={styles.timeline}>
      {section.entries.map((entry) => (
        <li key={entry.id} className={styles.timelineItem}>
          <p className={styles.entryTitle}>{entry.title}</p>
          {entry.subtitle && <p className={styles.entrySubtitle}>{entry.subtitle}</p>}
          {entryDateLabel(entry, document) && <p className={styles.entryMeta}>{entryDateLabel(entry, document)}</p>}
          {entry.description && <p className={styles.entryDescription}>{entry.description}</p>}
        </li>
      ))}
    </ul>
  );

  const renderSkills = (section: CVSection) => (
    <div>
      {section.entries.map((entry) => (
        <div key={entry.id} className={styles.skillRow}>
          <div className={styles.skillHeader}>
            <span>{skillLabel(entry)}</span>
            {entry.level !== undefined && <span>{entry.level}/5</span>}
          </div>
          <div className={styles.skillBar}>
            <div
              className={styles.skillFill}
              style={{ width: `${levelPercent(entry.level)}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className={`cv-template ${styles.root}`}>
      <header className={styles.header}>
        <div className={styles.headerShape} aria-hidden />
        <div className={styles.headerContent}>
          <div>
            <h1 className={styles.name}>
              {header.firstName} {header.lastName}
            </h1>
            {header.jobTitle && <p className={styles.jobTitle}>{header.jobTitle}</p>}
            {contact.length > 0 && <p className={styles.contact}>{contact.join(' · ')}</p>}
          </div>
          {header.photo && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={header.photo} alt="" className={styles.photo} />
          )}
        </div>
      </header>

      <div className={styles.body}>
        {summary && (
          <section>
            <h2 className={styles.sectionTitle}>Profil</h2>
            <p className={styles.entryDescription}>{summary}</p>
          </section>
        )}

        {visible
          .filter((section) => section.type !== 'summary')
          .map((section) => (
            <section key={section.id}>
              <h2 className={styles.sectionTitle}>{section.title}</h2>
              {section.type === 'experience' || section.type === 'education'
                ? renderTimeline(section)
                : section.type === 'skills'
                  ? renderSkills(section)
                  : section.entries.map((entry) => (
                      <div key={entry.id} className={styles.timelineItem}>
                        <p className={styles.entryTitle}>{entry.title}</p>
                        {entry.subtitle && (
                          <p className={styles.entrySubtitle}>{entry.subtitle}</p>
                        )}
                        {entry.description && (
                          <p className={styles.entryDescription}>{entry.description}</p>
                        )}
                      </div>
                    ))}
            </section>
          ))}
      </div>
    </div>
  );
}
