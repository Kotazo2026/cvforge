import type { CVDocument } from '@/types/cv.types';
import type { AtsRecommendation, AtsScoreResult, SectionDensity } from '@/types/ai.types';
import { buildCvProgressChecklist, computeCvProgressScore } from '@/utils/cv-progress';
import { getSummaryText } from '@/components/preview/templates/template-helpers';
import { serializeCvPlainText } from './document-text';
import { containsKeyword, getAtsKeywordPool } from './keywords';

const SECTION_LABELS: Record<string, string> = {
  summary: 'Profil',
  experience: 'Expériences',
  education: 'Formation',
  skills: 'Compétences',
  languages: 'Langues',
  projects: 'Projets',
  certifications: 'Certifications',
};

function densityStatus(charCount: number, entryCount: number): SectionDensity['status'] {
  if (entryCount === 0) return 'low';
  if (charCount >= 120 || entryCount >= 2) return 'rich';
  if (charCount >= 40) return 'ok';
  return 'low';
}

function buildSectionDensity(document: CVDocument): SectionDensity[] {
  const types = ['summary', 'experience', 'education', 'skills', 'languages'] as const;

  return types.map((sectionType) => {
    let charCount = 0;
    let entryCount = 0;

    if (sectionType === 'summary') {
      charCount = getSummaryText(document).length;
      entryCount = charCount > 0 ? 1 : 0;
    } else {
      const section = document.sections.find((s) => s.type === sectionType && s.visible);
      entryCount = section?.entries.length ?? 0;
      charCount =
        section?.entries.reduce(
          (sum, entry) =>
            sum +
            entry.title.length +
            (entry.description?.length ?? 0) +
            (entry.subtitle?.length ?? 0),
          0,
        ) ?? 0;
    }

    return {
      sectionType,
      label: SECTION_LABELS[sectionType] ?? sectionType,
      charCount,
      entryCount,
      status: densityStatus(charCount, entryCount),
    };
  });
}

function buildRecommendations(
  missingKeywords: string[],
  density: SectionDensity[],
  progressPercent: number,
): AtsRecommendation[] {
  const recommendations: AtsRecommendation[] = [];

  if (missingKeywords.length > 0) {
    recommendations.push({
      priority: 1,
      title: 'Ajouter des mots-clés de l’offre',
      detail: `Intégrez : ${missingKeywords.slice(0, 5).join(', ')}.`,
    });
  }

  const weakSection = density.find((section) => section.status === 'low');
  if (weakSection) {
    recommendations.push({
      priority: 2,
      title: `Renforcer la section « ${weakSection.label} »`,
      detail: 'Ajoutez du contenu détaillé (objectifs, résultats, chiffres).',
    });
  }

  if (progressPercent < 80) {
    recommendations.push({
      priority: 3,
      title: 'Compléter le CV',
      detail: 'Suivez la checklist de progression à droite pour gagner en crédibilité.',
    });
  } else {
    recommendations.push({
      priority: 3,
      title: 'Quantifier vos réussites',
      detail: 'Ajoutez des pourcentages, volumes ou délais dans chaque expérience.',
    });
  }

  return recommendations.slice(0, 3);
}

export function buildLocalAtsScore(document: CVDocument, jobOffer?: string): AtsScoreResult {
  const text = serializeCvPlainText(document).toLowerCase();
  const keywords = getAtsKeywordPool(jobOffer);
  const presentKeywords = keywords.filter((keyword) => containsKeyword(text, keyword));
  const missingKeywords = keywords.filter((keyword) => !presentKeywords.includes(keyword));

  const keywordRatio = keywords.length > 0 ? presentKeywords.length / keywords.length : 0;
  const progress = computeCvProgressScore(buildCvProgressChecklist(document));
  const density = buildSectionDensity(document);
  const richSections = density.filter((section) => section.status === 'rich').length;
  const densityRatio = richSections / Math.max(density.length, 1);

  const score = Math.round(
    keywordRatio * 45 + (progress.ats / 100) * 35 + densityRatio * 20,
  );

  return {
    score: Math.min(100, Math.max(0, score)),
    presentKeywords,
    missingKeywords,
    sectionDensity: density,
    recommendations: buildRecommendations(missingKeywords, density, progress.percent),
    source: 'local',
  };
}
