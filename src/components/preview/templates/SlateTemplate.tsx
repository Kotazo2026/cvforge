import type { BaseTemplateProps } from './BaseTemplate';
import { getContactLines } from './template-helpers';
import { SectionsList, SummaryBlock } from './SectionBlocks';
import styles from './SlateTemplate.module.css';

export function SlateTemplate({ document }: BaseTemplateProps) {
  const { header } = document;
  const contact = getContactLines(header);

  return (
    <div className={`cv-template ${styles.root}`}>
      <header className={styles.header}>
        <h1 className={styles.name}>
          {header.firstName} {header.lastName}
        </h1>
        {header.jobTitle && <p className={styles.jobTitle}>{header.jobTitle}</p>}
        {contact.length > 0 && <p className={styles.contact}>{contact.join(' · ')}</p>}
      </header>
      <SummaryBlock document={document} classNames={styles} />
      <SectionsList document={document} classNames={styles} />
    </div>
  );
}
