import type { CVDocument, CVSection } from '@/types/cv.types';
import {
  TRANSLATION_LANGUAGE_LABELS,
  type TranslationResult,
  type TranslationTargetLanguage,
} from '@/types/ai.types';
import { generateId } from '@/utils/cv.utils';

const SECTION_TITLES: Record<string, Partial<Record<TranslationTargetLanguage, string>>> = {
  Expériences: { en: 'Experience', es: 'Experiencia', de: 'Berufserfahrung', it: 'Esperienza' },
  Formation: { en: 'Education', es: 'Formación', de: 'Ausbildung', it: 'Formazione' },
  Compétences: { en: 'Skills', es: 'Competencias', de: 'Fähigkeiten', it: 'Competenze' },
  Langues: { en: 'Languages', es: 'Idiomas', de: 'Sprachen', it: 'Lingue' },
  Profil: { en: 'Profile', es: 'Perfil', de: 'Profil', it: 'Profilo' },
};

function translatePhrase(text: string, lang: TranslationTargetLanguage): string {
  if (!text.trim()) return text;
  if (lang === 'en') {
    return text
      .replace(/Développeur/gi, 'Developer')
      .replace(/expérience/gi, 'experience')
      .replace(/formation/gi, 'education')
      .replace(/compétences/gi, 'skills')
      .replace(/entreprise/gi, 'company')
      .replace(/équipe/gi, 'team');
  }
  return `[${lang.toUpperCase()}] ${text}`;
}

function cloneSection(section: CVSection, lang: TranslationTargetLanguage): CVSection {
  return {
    ...section,
    title: SECTION_TITLES[section.title]?.[lang] ?? translatePhrase(section.title, lang),
    entries: section.entries.map((entry) => ({
      ...entry,
      title: translatePhrase(entry.title, lang),
      subtitle: entry.subtitle ? translatePhrase(entry.subtitle, lang) : entry.subtitle,
      description: entry.description ? translatePhrase(entry.description, lang) : entry.description,
      location: entry.location ? translatePhrase(entry.location, lang) : entry.location,
    })),
  };
}

export function buildLocalTranslation(
  document: CVDocument,
  targetLanguage: TranslationTargetLanguage,
): TranslationResult {
  const { header } = document;

  const translated: CVDocument = {
    ...document,
    id: generateId(),
    title: `${document.title} (${TRANSLATION_LANGUAGE_LABELS[targetLanguage]})`,
    header: {
      ...header,
      jobTitle: translatePhrase(header.jobTitle, targetLanguage),
      summary: header.summary ? translatePhrase(header.summary, targetLanguage) : header.summary,
    },
    sections: document.sections.map((section) => cloneSection(section, targetLanguage)),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  return {
    document: translated,
    targetLanguage,
    source: 'local',
  };
}
