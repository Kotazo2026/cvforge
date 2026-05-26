import type { CVDocument, CVEntry, CVSection } from '@/types/cv.types';
import { getSummaryText } from '@/components/preview/templates/template-helpers';

export type ProgressCategory = 'completeness' | 'quality' | 'ats';

export interface ProgressCheckItem {
  id: string;
  label: string;
  completed: boolean;
  category: ProgressCategory;
  hint?: string;
}

export interface CvProgressScore {
  percent: number;
  completeness: number;
  quality: number;
  ats: number;
  items: ProgressCheckItem[];
}

const CATEGORY_WEIGHTS: Record<ProgressCategory, number> = {
  completeness: 0.4,
  quality: 0.35,
  ats: 0.25,
};

/** Verbes d'action fréquents en CV (FR + EN). */
const ACTION_VERB_PATTERN =
  /\b(réalis|réduis|développ|pilot|mené|mena|amélior|optimis|créé|créa|géré|géra|augment|diminu|implément|conçu|conçue|dirig|accompagn|formé|coordonn|livr|déploy|automat|structur|encadr|supervis|contribu|particip|initi|launch|develop|implement|manage|lead|led|increas|reduc|optimiz|improv|deliver|built|designed|created)\w*/i;

/** Chiffres, pourcentages ou indicateurs quantifiés. */
const METRIC_PATTERN =
  /(?:\d+[\s,.]?\d*\s*%|\+?\s*\d+[\s,.]?\d*\s*%|\d+\s*(?:personnes|développeurs|users|clients|projets|k\b|M\b|€)|\d{2,})/i;

export const PROGRESS_CATEGORY_LABELS: Record<
  ProgressCategory,
  { title: string; description: string }
> = {
  completeness: {
    title: 'Complétude',
    description: 'Champs essentiels remplis',
  },
  quality: {
    title: 'Qualité',
    description: 'Contenu riche et structuré',
  },
  ats: {
    title: 'Optimisation ATS',
    description: 'Mots d’action et résultats chiffrés',
  },
};

function visibleSection(document: CVDocument, type: CVSection['type']): CVSection | undefined {
  return document.sections.find((section) => section.type === type && section.visible);
}

function countFilledEntries(section: CVSection | undefined): number {
  if (!section) return 0;
  return section.entries.filter((entry) => entry.title.trim()).length;
}

function allDescriptions(document: CVDocument): string[] {
  return document.sections.flatMap((section) =>
    section.entries
      .map((entry) => entry.description ?? '')
      .filter((text) => text.trim().length > 0),
  );
}

function hasActionVerbs(texts: string[]): boolean {
  return texts.some((text) => ACTION_VERB_PATTERN.test(text));
}

function hasMetrics(texts: string[]): boolean {
  return texts.some((text) => METRIC_PATTERN.test(text));
}

function experiencesWithDescription(experiences: CVEntry[]): number {
  return experiences.filter((entry) => (entry.description ?? '').trim().length > 0).length;
}

export function buildCvProgressChecklist(document: CVDocument): ProgressCheckItem[] {
  const { header, sections } = document;
  const summaryText = getSummaryText(document);
  const experiences = visibleSection(document, 'experience');
  const education = visibleSection(document, 'education');
  const skills = visibleSection(document, 'skills');
  const languages = visibleSection(document, 'languages');

  const experienceEntries = experiences?.entries ?? [];
  const skillCount = countFilledEntries(skills);
  const descriptions = allDescriptions(document);

  const hasName = Boolean(header.firstName.trim() && header.lastName.trim());
  const hasContact = Boolean(header.email.trim() && header.phone.trim());
  const hasJobTitle = Boolean(header.jobTitle.trim());
  const hasLocation = Boolean(header.location.trim());
  const hasSummary = summaryText.trim().length >= 50;
  const hasPhoto = Boolean(header.photo);
  const hasSocial = Boolean((header.linkedin ?? '').trim() || (header.website ?? '').trim());
  const hasExperiences = experienceEntries.some((entry) => entry.title.trim());
  const hasTwoExperiences = experienceEntries.filter((entry) => entry.title.trim()).length >= 2;
  const hasEducation = Boolean(education?.entries.some((entry) => entry.title.trim()));
  const hasSkills = skillCount > 0;
  const hasFiveSkills = skillCount >= 5;
  const hasLanguages = Boolean(languages?.entries.some((entry) => entry.title.trim()));
  const richDescription = sections.some((section) =>
    section.entries.some((entry) => (entry.description ?? '').trim().length >= 150),
  );
  const multipleDescribedExperiences = experiencesWithDescription(experienceEntries) >= 2;

  return [
    {
      id: 'name',
      category: 'completeness',
      label: 'Nom et prénom',
      completed: hasName,
      hint: 'Renseignez votre identité dans Informations.',
    },
    {
      id: 'contact',
      category: 'completeness',
      label: 'E-mail et téléphone',
      completed: hasContact,
      hint: 'Indispensable pour être recontacté.',
    },
    {
      id: 'job-title',
      category: 'completeness',
      label: 'Titre / poste recherché',
      completed: hasJobTitle,
      hint: 'Ex. « Développeur Full Stack ».',
    },
    {
      id: 'location',
      category: 'completeness',
      label: 'Ville ou région',
      completed: hasLocation,
      hint: 'Aide les recruteurs locaux.',
    },
    {
      id: 'summary',
      category: 'completeness',
      label: 'Accroche professionnelle (50+ car.)',
      completed: hasSummary,
      hint: 'Rédigez un résumé percutant en tête de CV.',
    },
    {
      id: 'photo',
      category: 'completeness',
      label: 'Photo de profil',
      completed: hasPhoto,
      hint: 'Optionnel mais valorisant sur les profils modernes.',
    },
    {
      id: 'social',
      category: 'completeness',
      label: 'LinkedIn ou site web',
      completed: hasSocial,
      hint: 'Ajoutez au moins un lien professionnel.',
    },
    {
      id: 'experience',
      category: 'completeness',
      label: 'Au moins une expérience',
      completed: hasExperiences,
      hint: 'Ajoutez un poste dans Sections.',
    },
    {
      id: 'education',
      category: 'completeness',
      label: 'Au moins une formation',
      completed: hasEducation,
    },
    {
      id: 'skills',
      category: 'completeness',
      label: 'Compétences renseignées',
      completed: hasSkills,
    },
    {
      id: 'two-experiences',
      category: 'quality',
      label: 'Au moins 2 expériences',
      completed: hasTwoExperiences,
      hint: 'Montrez une progression de carrière.',
    },
    {
      id: 'descriptions',
      category: 'quality',
      label: 'Description détaillée (150+ car.)',
      completed: richDescription,
      hint: 'Détaillez missions et résultats.',
    },
    {
      id: 'five-skills',
      category: 'quality',
      label: 'Au moins 5 compétences',
      completed: hasFiveSkills,
      hint: 'Ciblez les compétences clés du poste visé.',
    },
    {
      id: 'languages',
      category: 'quality',
      label: 'Langues renseignées',
      completed: hasLanguages,
      hint: 'Ajoutez une section Langues si pertinent.',
    },
    {
      id: 'action-verbs',
      category: 'ats',
      label: 'Verbes d’action dans les descriptions',
      completed: hasActionVerbs(descriptions),
      hint: 'Ex. développé, piloté, optimisé, livré.',
    },
    {
      id: 'metrics',
      category: 'ats',
      label: 'Résultats chiffrés (% , volumes, KPI)',
      completed: hasMetrics([...descriptions, summaryText]),
      hint: 'Ex. « +40 % de performances », « équipe de 4 ».',
    },
    {
      id: 'experience-details',
      category: 'ats',
      label: '2 expériences avec description',
      completed: multipleDescribedExperiences,
      hint: 'Décrivez concrètement chaque poste récent.',
    },
  ];
}

export function computeCategoryPercent(
  items: ProgressCheckItem[],
  category: ProgressCategory,
): number {
  const categoryItems = items.filter((item) => item.category === category);
  if (categoryItems.length === 0) return 0;
  const done = categoryItems.filter((item) => item.completed).length;
  return Math.round((done / categoryItems.length) * 100);
}

export function computeCvProgressScore(items: ProgressCheckItem[]): CvProgressScore {
  const completeness = computeCategoryPercent(items, 'completeness');
  const quality = computeCategoryPercent(items, 'quality');
  const ats = computeCategoryPercent(items, 'ats');

  const percent = Math.round(
    completeness * CATEGORY_WEIGHTS.completeness +
      quality * CATEGORY_WEIGHTS.quality +
      ats * CATEGORY_WEIGHTS.ats,
  );

  return {
    percent,
    completeness,
    quality,
    ats,
    items,
  };
}

/** Score global simple (moyenne des items) — conservé pour compatibilité. */
export function computeCvProgressPercent(items: ProgressCheckItem[]): number {
  return computeCvProgressScore(items).percent;
}

export function groupProgressItemsByCategory(
  items: ProgressCheckItem[],
): Record<ProgressCategory, ProgressCheckItem[]> {
  return {
    completeness: items.filter((item) => item.category === 'completeness'),
    quality: items.filter((item) => item.category === 'quality'),
    ats: items.filter((item) => item.category === 'ats'),
  };
}
