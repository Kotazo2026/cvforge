import type { BaseTemplateProps } from './BaseTemplate';
import { getContactLines } from './template-helpers';
import { SectionsList, SummaryBlock } from './SectionBlocks';
import styles from './SageTemplate.module.css';

export function SageTemplate({ document }: BaseTemplateProps) {
  const { header } = document;
  const contact = getContactLines(header);

  return (
    <div className={`cv-template ${styles.root}`}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.name}>
            {header.firstName} {header.lastName}
          </h1>
          {header.jobTitle && <p className={styles.jobTitle}>{header.jobTitle}</p>}
        </div>
        {header.photo && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={header.photo} alt="" className={styles.photo} />
        )}
      </header>
      {contact.length > 0 && (
        <p className={styles.contact}>{contact.join('  ·  ')}</p>
      )}
      <div className={styles.content}>
        <SummaryBlock document={document} classNames={styles} />
        <SectionsList document={document} classNames={styles} />
      </div>
    </div>
  );
}
