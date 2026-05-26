import type { BaseTemplateProps } from './BaseTemplate';
import { getContactLines } from './template-helpers';
import { SectionsList, SummaryBlock } from './SectionBlocks';
import styles from './AtlasTemplate.module.css';

export function AtlasTemplate({ document }: BaseTemplateProps) {
  const { header } = document;
  const contact = getContactLines(header);

  return (
    <div className={`cv-template ${styles.root}`}>
      <div className={styles.gridBg} aria-hidden />
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <h1 className={styles.name}>
            {header.firstName} {header.lastName}
          </h1>
          {header.jobTitle && <p className={styles.jobTitle}>{header.jobTitle}</p>}
        </div>
        <div className={styles.headerRight}>
          {header.photo && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={header.photo} alt="" className={styles.photo} />
          )}
          {contact.length > 0 && (
            <ul className={styles.contact}>
              {contact.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
          )}
        </div>
      </header>
      <div className={styles.columns}>
        <SummaryBlock document={document} classNames={styles} />
        <SectionsList document={document} classNames={styles} />
      </div>
    </div>
  );
}
