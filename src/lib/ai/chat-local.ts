import type { CVDocument } from '@/types/cv.types';
import type { ChatCvPatch, ChatResponse } from '@/types/ai.types';
import { getSummaryText } from '@/components/preview/templates/template-helpers';
import { getExperienceSection } from './document-text';
import { extractKeywords } from './keywords';

function shortenText(text: string, maxLen: number): string {
  const trimmed = text.trim();
  if (trimmed.length <= maxLen) return trimmed;
  const cut = trimmed.slice(0, maxLen);
  const lastSpace = cut.lastIndexOf(' ');
  return `${(lastSpace > 40 ? cut.slice(0, lastSpace) : cut).trim()}…`;
}

function lastExperiencePatch(document: CVDocument, enhance: boolean): ChatCvPatch | undefined {
  const section = getExperienceSection(document);
  const entry = section?.entries[section.entries.length - 1];
  if (!section || !entry) return undefined;

  const description = entry.description ?? '';
  const after = enhance
    ? `${description.trim()} Résultats mesurables et coordination d’équipe à préciser.`.trim()
  : shortenText(description, 120);

  return {
    experiences: [
      {
        sectionId: section.id,
        entryId: entry.id,
        description: after,
      },
    ],
  };
}

export function buildLocalChatResponse(
  document: CVDocument,
  userMessage: string,
): ChatResponse {
  const text = userMessage.toLowerCase();
  const summary = getSummaryText(document) || document.header.summary || '';

  if (text.includes('raccourci') || text.includes('trop long')) {
    let nextSummary = shortenText(summary, 180);
    if (nextSummary === summary.trim() && summary.length > 20) {
      nextSummary = `${summary.trim().slice(0, 160).trim()}…`;
    }
    const patch: ChatCvPatch = {
      summary: nextSummary,
    };
    return {
      reply:
        'J’ai raccourci votre accroche pour la rendre plus percutante. Vous pouvez appliquer la modification ci-dessous ou me demander d’aller plus loin.',
      patch,
      source: 'local',
    };
  }

  if (text.includes('manager') || text.includes('cadre') || text.includes('lead')) {
    const patch: ChatCvPatch = {
      jobTitle: 'Manager / Lead technique',
      summary: weaveManagerSummary(summary),
      ...lastExperiencePatch(document, true),
    };
    return {
      reply:
        'Voici une adaptation orientée management : titre, accroche et dernière expérience ajustés. Appliquez si cela vous convient.',
      patch,
      source: 'local',
    };
  }

  if (
    (text.includes('dernier') || text.includes('dernière')) &&
    (text.includes('poste') || text.includes('expérience') || text.includes('description'))
  ) {
    const patch = lastExperiencePatch(document, true);
    return {
      reply: patch
        ? 'J’ai enrichi la description de votre dernier poste avec des formulations plus impactantes.'
        : 'Ajoutez d’abord une expérience professionnelle pour que je puisse l’améliorer.',
      patch,
      source: 'local',
    };
  }

  if (text.includes('compétence') || text.includes('skill')) {
    const keywords = extractKeywords(text, 5);
    return {
      reply: `Pensez à aligner vos compétences sur : ${keywords.join(', ') || 'les mots-clés du poste visé'}. Ouvrez l’onglet Score ATS pour une analyse détaillée.`,
      source: 'local',
    };
  }

  return {
    reply:
      'Je peux améliorer une section, raccourcir le CV, ou l’adapter à un poste (ex. manager). Essayez : « Améliore la description de mon dernier poste » ou « Raccourcis mon accroche ».',
    source: 'local',
  };
}

function weaveManagerSummary(summary: string): string {
  const base = summary.trim() || 'Professionnel expérimenté.';
  if (/manager|lead|cadre/i.test(base)) return base;
  return `${base} Orienté leadership d’équipe, pilotage de projets et delivery.`;
}
