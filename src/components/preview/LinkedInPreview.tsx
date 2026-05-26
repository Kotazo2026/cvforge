'use client';

import type { CSSProperties } from 'react';
import { useMemo } from 'react';
import { useCVStore } from '@/store/cv.store';
import { getInitials } from '@/utils/cv.utils';
import {
  entryDateLabel,
  formatLinkedInUrl,
  getSectionEntries,
  getSkillsList,
  getSummaryText,
} from '@/utils/format-preview.utils';
import styles from './LinkedInPreview.module.css';

function companyInitial(title: string, subtitle?: string): string {
  const source = (subtitle || title).trim();
  return source.charAt(0).toUpperCase() || '?';
}

export function LinkedInPreview() {
  const document = useCVStore((state) => state.document);
  const { header } = document;

  const summary = getSummaryText(document);
  const experiences = getSectionEntries(document, 'experience');
  const education = getSectionEntries(document, 'education');
  const skills = getSkillsList(document);
  const linkedInDisplay = formatLinkedInUrl(header.linkedin);

  const cssVars = useMemo(
    () =>
      ({
        '--li-primary': document.colors.primary,
      }) as CSSProperties,
    [document.colors.primary],
  );

  const fullName = `${header.firstName} ${header.lastName}`.trim();

  return (
    <div className={styles.viewport} data-cvforge-chrome>
      <article
        className={styles.profile}
        role="img"
        aria-label="Simulation de profil LinkedIn à partir du CV"
        style={cssVars}
      >
        <div className={styles.banner} aria-hidden />

        <div className={styles.identity}>
          {header.photo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={header.photo} alt="" className={styles.photo} />
          ) : (
            <span className={styles.initials} aria-hidden>
              {getInitials(header.firstName, header.lastName)}
            </span>
          )}
          <h1 className={styles.name}>{fullName || 'Votre nom'}</h1>
          {header.jobTitle && <p className={styles.headline}>{header.jobTitle}</p>}
          {header.location && <p className={styles.location}>{header.location}</p>}
          <div className={styles.actions} aria-hidden>
            <span className={styles.actionPrimary}>Se connecter</span>
            <span className={styles.actionSecondary}>Message</span>
          </div>
        </div>

        {summary && (
          <section className={styles.card}>
            <h2 className={styles.cardTitle}>À propos</h2>
            <p className={styles.about}>{summary}</p>
          </section>
        )}

        {experiences.length > 0 && (
          <section className={styles.card}>
            <h2 className={styles.cardTitle}>Expérience</h2>
            {experiences.map((entry) => (
              <div key={entry.id} className={styles.experienceItem}>
                <span className={styles.companyLogo} aria-hidden>
                  {companyInitial(entry.title, entry.subtitle)}
                </span>
                <div className={styles.experienceBody}>
                  <p className={styles.roleTitle}>{entry.title}</p>
                  {entry.subtitle && <p className={styles.companyLine}>{entry.subtitle}</p>}
                  {entryDateLabel(entry, document) && (
                    <p className={styles.dateLine}>{entryDateLabel(entry, document)}</p>
                  )}
                  {entry.location && <p className={styles.dateLine}>{entry.location}</p>}
                  {entry.description && (
                    <p className={styles.roleDescription}>{entry.description}</p>
                  )}
                </div>
              </div>
            ))}
          </section>
        )}

        {education.length > 0 && (
          <section className={styles.card}>
            <h2 className={styles.cardTitle}>Formation</h2>
            {education.map((entry) => (
              <div key={entry.id} className={styles.experienceItem}>
                <span className={styles.companyLogo} aria-hidden>
                  {companyInitial(entry.title, entry.subtitle)}
                </span>
                <div className={styles.experienceBody}>
                  <p className={styles.roleTitle}>{entry.title}</p>
                  {entry.subtitle && <p className={styles.companyLine}>{entry.subtitle}</p>}
                  {entryDateLabel(entry, document) && (
                    <p className={styles.dateLine}>{entryDateLabel(entry, document)}</p>
                  )}
                </div>
              </div>
            ))}
          </section>
        )}

        {skills.length > 0 && (
          <section className={styles.card}>
            <h2 className={styles.cardTitle}>Compétences</h2>
            <div className={styles.skills}>
              {skills.map((skill) => (
                <span key={skill} className={styles.skillPill}>
                  {skill}
                </span>
              ))}
            </div>
          </section>
        )}

        {linkedInDisplay && (
          <section className={styles.card}>
            <h2 className={styles.cardTitle}>Coordonnées</h2>
            <p className={styles.about}>{linkedInDisplay}</p>
            {header.email && <p className={styles.dateLine}>{header.email}</p>}
          </section>
        )}

        <div className={styles.footerSpacer} />
      </article>
    </div>
  );
}
