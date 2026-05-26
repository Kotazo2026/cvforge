import type { CVDocument } from '@/types/cv.types';
import type { PrefillProposal } from '@/types/ai.types';
import { getSummaryText } from '@/components/preview/templates/template-helpers';
import { getExperienceSection } from './document-text';
import { containsKeyword, extractKeywords, inferJobTitleFromOffer } from './keywords';

function weaveKeywords(text: string, keywords: string[], maxAdd = 4): string {
  const base = text.trim();
  if (!base) return keywords.slice(0, maxAdd).join(', ');

  const missing = keywords.filter((keyword) => !containsKeyword(base, keyword)).slice(0, maxAdd);
  if (missing.length === 0) return base;

  const suffix = ` Compétences clés : ${missing.join(', ')}.`;
  if (base.endsWith('.')) return `${base.slice(0, -1)} —${suffix}`;
  return `${base}.${suffix}`;
}

function enhanceDescription(description: string, keywords: string[]): string {
  const trimmed = description.trim();
  if (!trimmed) {
    return `Réalisations alignées sur le poste : ${keywords.slice(0, 4).join(', ')}.`;
  }
  return weaveKeywords(trimmed, keywords, 3);
}

function enhanceSummary(current: string, keywords: string[], jobOffer: string): string {
  const intro = current.trim() || 'Profil orienté vers le poste visé.';
  const offerSnippet = jobOffer
    .split(/\n/)
    .map((line) => line.trim())
    .find((line) => line.length > 40);

  const context = offerSnippet
    ? ` ${offerSnippet.slice(0, 120)}${offerSnippet.length > 120 ? '…' : ''}`
    : '';

  const withKeywords = weaveKeywords(intro, keywords, 5);
  if (context && !withKeywords.includes(context.slice(0, 40))) {
    return `${withKeywords} Alignement offre :${context}`;
  }
  return withKeywords;
}

export function buildLocalPrefill(document: CVDocument, jobOffer: string): PrefillProposal {
  const keywords = extractKeywords(jobOffer, 16);
  const currentSummary = getSummaryText(document) || document.header.summary || '';
  const nextTitle = inferJobTitleFromOffer(jobOffer, document.header.jobTitle);
  const nextSummary = enhanceSummary(currentSummary, keywords, jobOffer);

  const experienceSection = getExperienceSection(document);
  const experiences =
    experienceSection?.entries.map((entry) => {
      const beforeTitle = entry.title;
      const beforeDescription = entry.description ?? '';
      const afterDescription = enhanceDescription(beforeDescription, keywords);
      let afterTitle = beforeTitle;
      if (keywords[0] && !containsKeyword(beforeTitle.toLowerCase(), keywords[0])) {
        afterTitle = `${beforeTitle} — ${keywords[0]}`.slice(0, 90);
      }
      return {
        sectionId: experienceSection.id,
        entryId: entry.id,
        title: { before: beforeTitle, after: afterTitle },
        description: { before: beforeDescription, after: afterDescription },
      };
    }) ?? [];

  return {
    jobTitle: { before: document.header.jobTitle, after: nextTitle },
    summary: { before: currentSummary, after: nextSummary },
    experiences,
    matchedKeywords: keywords,
    source: 'local',
  };
}

export function hasPrefillChanges(proposal: PrefillProposal): boolean {
  if (proposal.jobTitle.before !== proposal.jobTitle.after) return true;
  if (proposal.summary.before !== proposal.summary.after) return true;
  return proposal.experiences.some(
    (item) =>
      item.title.before !== item.title.after ||
      item.description.before !== item.description.after,
  );
}
