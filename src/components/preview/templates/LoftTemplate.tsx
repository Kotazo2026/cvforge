import type { BaseTemplateProps } from './BaseTemplate';
import { getContactLines } from './template-helpers';
import { SectionsList, SummaryBlock } from './SectionBlocks';
import styles from './LoftTemplate.module.css';

export function LoftTemplate({ document }: BaseTemplateProps) {
  const { header } = document;
  const contact = getContactLines(header);

  return (
    <div className={`cv-template ${styles.root}`}>
      <header className={styles.header}>
        <div className={styles.rule} aria-hidden />
        <h1 className={styles.name}>
          {header.firstName} {header.lastName}
        </h1>
        {header.jobTitle && <p className={styles.jobTitle}>{header.jobTitle}</p>}
        {contact.length > 0 && (
          <ul className={styles.contact}>
            {contact.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
        )}
      </header>
      <SummaryBlock document={document} classNames={styles} />
      <SectionsList document={document} classNames={styles} />
    </div>
  );
}
