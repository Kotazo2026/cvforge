'use client';

import type { CSSProperties } from 'react';
import { useMemo } from 'react';
import { useCVStore } from '@/store/cv.store';
import { getInitials } from '@/utils/cv.utils';
import {
  MOBILE_PREVIEW_WIDTH_PX,
  entryDateLabel,
  getSectionEntries,
  getSkillsList,
  getSummaryText,
  getVisibleSections,
  skillLabel,
} from '@/utils/format-preview.utils';
import styles from './MobilePreview.module.css';

export function MobilePreview() {
  const document = useCVStore((state) => state.document);
  const { header } = document;

  const summary = getSummaryText(document);
  const experiences = getSectionEntries(document, 'experience');
  const education = getSectionEntries(document, 'education');
  const skills = getSkillsList(document);
  const otherSections = useMemo(
    () =>
      getVisibleSections(document).filter(
        (section) =>
          !['summary', 'experience', 'education', 'skills', 'header'].includes(section.type),
      ),
    [document],
  );

  const cssVars = useMemo(
    () =>
      ({
        '--mobile-primary': document.colors.primary,
      }) as CSSProperties,
    [document.colors.primary],
  );

  const fullName = `${header.firstName} ${header.lastName}`.trim();
  const contactPills = [header.email, header.phone, header.location, header.website].filter(
    Boolean,
  );

  return (
    <div className={styles.viewport} data-cvforge-chrome>
      <div
        className={styles.device}
        role="img"
        aria-label={`Aperçu mobile du CV, largeur ${MOBILE_PREVIEW_WIDTH_PX} pixels`}
        style={cssVars}
      >
        <div className={styles.screen}>
          <div className={styles.statusBar} aria-hidden>
            <span className={styles.statusTime}>9:41</span>
            <span className={styles.statusIcons}>
              <span className={styles.statusDot} />
              <span className={styles.statusDot} />
              <span className={styles.statusDot} />
            </span>
          </div>

          <div className={styles.scroll}>
            <header className={styles.hero}>
              <div className={styles.heroTop}>
                {header.photo ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={header.photo} alt="" className={styles.photo} />
                ) : (
                  <span className={styles.initials} aria-hidden>
                    {getInitials(header.firstName, header.lastName)}
                  </span>
                )}
                <div>
                  <h1 className={styles.name}>{fullName || 'Votre nom'}</h1>
                  {header.jobTitle && <p className={styles.jobTitle}>{header.jobTitle}</p>}
                </div>
              </div>
              {contactPills.length > 0 && (
                <div className={styles.contactRow}>
                  {contactPills.map((line) => (
                    <span key={line} className={styles.contactPill}>
                      {line}
                    </span>
                  ))}
                </div>
              )}
            </header>

            <div className={styles.body}>
              {summary && (
                <section className={styles.section}>
                  <h2 className={styles.sectionTitle}>Profil</h2>
                  <p className={styles.summary}>{summary}</p>
                </section>
              )}

              {experiences.length > 0 && (
                <section className={styles.section}>
                  <h2 className={styles.sectionTitle}>Expérience</h2>
                  {experiences.map((entry) => (
                    <article key={entry.id} className={styles.entry}>
                      <p className={styles.entryTitle}>{entry.title}</p>
                      {entry.subtitle && <p className={styles.entrySubtitle}>{entry.subtitle}</p>}
                      {entryDateLabel(entry, document) && (
                        <p className={styles.entryMeta}>{entryDateLabel(entry, document)}</p>
                      )}
                      {entry.description && (
                        <p className={styles.entryDescription}>{entry.description}</p>
                      )}
                    </article>
                  ))}
                </section>
              )}

              {education.length > 0 && (
                <section className={styles.section}>
                  <h2 className={styles.sectionTitle}>Formation</h2>
                  {education.map((entry) => (
                    <article key={entry.id} className={styles.entry}>
                      <p className={styles.entryTitle}>{entry.title}</p>
                      {entry.subtitle && <p className={styles.entrySubtitle}>{entry.subtitle}</p>}
                      {entryDateLabel(entry, document) && (
                        <p className={styles.entryMeta}>{entryDateLabel(entry, document)}</p>
                      )}
                    </article>
                  ))}
                </section>
              )}

              {skills.length > 0 && (
                <section className={styles.section}>
                  <h2 className={styles.sectionTitle}>Compétences</h2>
                  <p className={styles.tags}>{skills.join(' · ')}</p>
                </section>
              )}

              {otherSections.map((section) => (
                <section key={section.id} className={styles.section}>
                  <h2 className={styles.sectionTitle}>{section.title}</h2>
                  {section.type === 'languages' || section.type === 'skills' ? (
                    <p className={styles.tags}>
                      {section.entries.map((e) => skillLabel(e)).filter(Boolean).join(' · ')}
                    </p>
                  ) : (
                    section.entries.map((entry) => (
                      <article key={entry.id} className={styles.entry}>
                        <p className={styles.entryTitle}>{entry.title}</p>
                        {entry.subtitle && (
                          <p className={styles.entrySubtitle}>{entry.subtitle}</p>
                        )}
                        {entry.description && (
                          <p className={styles.entryDescription}>{entry.description}</p>
                        )}
                      </article>
                    ))
                  )}
                </section>
              ))}
            </div>
          </div>

          <div className={styles.homeIndicator} aria-hidden>
            <span className={styles.homeIndicatorBar} />
          </div>
        </div>
      </div>
    </div>
  );
}
