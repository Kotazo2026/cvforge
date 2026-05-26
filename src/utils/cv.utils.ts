import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { CVDocument, CVEntry, CVSection } from '@/types/cv.types';
import { createDefaultLayout } from '@/utils/cv-layout.utils';

const FRENCH_MONTHS = [
  'Jan',
  'Fév',
  'Mar',
  'Avr',
  'Mai',
  'Juin',
  'Juil',
  'Aoû',
  'Sep',
  'Oct',
  'Nov',
  'Déc',
] as const;

/** Génère un identifiant unique (UUID v4 simplifié). */
export function generateId(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (char) => {
    const random = (Math.random() * 16) | 0;
    const value = char === 'x' ? random : (random & 0x3) | 0x8;
    return value.toString(16);
  });
}

/** Formate une plage de dates pour affichage CV. */
export function formatDateRange(
  start?: string,
  end?: string,
  current?: boolean,
): string {
  const formatPart = (date?: string): string => {
    if (!date) return '';
    const [year, month] = date.split('-');
    const monthIndex = Number(month) - 1;
    if (!year || monthIndex < 0 || monthIndex > 11) return date;
    return `${FRENCH_MONTHS[monthIndex]} ${year}`;
  };

  const startLabel = formatPart(start);
  if (current) {
    return startLabel ? `${startLabel} – Présent` : 'Présent';
  }
  const endLabel = formatPart(end);
  if (startLabel && endLabel) return `${startLabel} – ${endLabel}`;
  return startLabel || endLabel || '';
}

/** Retourne les initiales à partir du prénom et du nom. */
export function getInitials(firstName: string, lastName: string): string {
  const first = firstName.trim().charAt(0).toUpperCase();
  const last = lastName.trim().charAt(0).toUpperCase();
  return `${first}${last}`.trim() || '?';
}

/** Fusionne classNames Tailwind (clsx + tailwind-merge). */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

function createExperienceEntry(
  title: string,
  subtitle: string,
  location: string,
  startDate: string,
  endDate: string | undefined,
  current: boolean,
  description: string,
): CVEntry {
  return {
    id: generateId(),
    title,
    subtitle,
    location,
    startDate,
    endDate,
    current,
    description,
  };
}

function createEducationEntry(
  title: string,
  subtitle: string,
  startDate: string,
  endDate: string,
): CVEntry {
  return {
    id: generateId(),
    title,
    subtitle,
    startDate,
    endDate,
  };
}

function createSkillEntry(name: string, level: number): CVEntry {
  return {
    id: generateId(),
    title: name,
    level,
    tags: [name],
  };
}

function createLanguageEntry(name: string, level: number): CVEntry {
  return {
    id: generateId(),
    title: name,
    level,
  };
}

/** Retourne un document CV d'exemple complet pour le chargement initial. */
export function defaultCV(): CVDocument {
  const now = new Date().toISOString();

  const experienceSection: CVSection = {
    id: generateId(),
    type: 'experience',
    title: 'Expériences',
    visible: true,
    entries: [
      createExperienceEntry(
        'Développeur Full Stack Senior',
        'TechVision SAS',
        'Paris',
        '2022-03',
        undefined,
        true,
        'Conception et développement d\'applications web Next.js. Encadrement d\'une équipe de 4 développeurs. Mise en place de CI/CD et amélioration des performances (+40 %).',
      ),
      createExperienceEntry(
        'Développeur Frontend',
        'Digital Agency Pro',
        'Lyon',
        '2019-06',
        '2022-02',
        false,
        'Développement d\'interfaces React pour des clients grands comptes. Intégration de design systems et optimisation SEO.',
      ),
    ],
  };

  const educationSection: CVSection = {
    id: generateId(),
    type: 'education',
    title: 'Formation',
    visible: true,
    entries: [
      createEducationEntry(
        'Master Informatique — Développement Web',
        'Université Paris-Saclay',
        '2017-09',
        '2019-06',
      ),
    ],
  };

  const skillsSection: CVSection = {
    id: generateId(),
    type: 'skills',
    title: 'Compétences',
    visible: true,
    entries: [
      createSkillEntry('TypeScript', 5),
      createSkillEntry('React / Next.js', 5),
      createSkillEntry('Node.js', 4),
      createSkillEntry('PostgreSQL', 4),
      createSkillEntry('Docker', 3),
      createSkillEntry('AWS', 3),
    ],
  };

  const languagesSection: CVSection = {
    id: generateId(),
    type: 'languages',
    title: 'Langues',
    visible: true,
    entries: [createLanguageEntry('Français', 5), createLanguageEntry('Anglais', 4)],
  };

  const colors = {
    primary: '#2563EB',
    secondary: '#1E40AF',
    text: '#111827',
    background: '#FFFFFF',
  };

  return {
    id: generateId(),
    title: 'Mon CV',
    header: {
      firstName: 'Alexandre',
      lastName: 'Martin',
      jobTitle: 'Développeur Full Stack',
      email: 'alexandre.martin@email.fr',
      phone: '+33 6 12 34 56 78',
      location: 'Paris, France',
      website: 'https://alexmartin.dev',
      linkedin: 'linkedin.com/in/alexmartin',
      summary:
        'Développeur passionné avec 6 ans d\'expérience en applications web modernes. Expert React/Next.js et architecture cloud.',
    },
    sections: [experienceSection, educationSection, skillsSection, languagesSection],
    templateId: 'classic',
    colors,
    layout: createDefaultLayout(colors),
    fontSize: 'medium',
    createdAt: now,
    updatedAt: now,
  };
}
