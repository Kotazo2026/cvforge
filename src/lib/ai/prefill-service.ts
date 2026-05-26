import type { CVDocument } from '@/types/cv.types';
import type { PrefillProposal } from '@/types/ai.types';
import { getSummaryText } from '@/components/preview/templates/template-helpers';
import { callAnthropicJson } from './anthropic';
import { getExperienceSection, serializeCvPlainText } from './document-text';
import { buildLocalPrefill } from './prefill-local';

interface AnthropicPrefillPayload {
  jobTitle: string;
  summary: string;
  experiences: Array<{
    entryId: string;
    title: string;
    description: string;
  }>;
  matchedKeywords: string[];
}

const PREFILL_SYSTEM = `Tu es un expert RH et ATS. Tu adaptes un CV à une offre d'emploi.
Réponds UNIQUEMENT en JSON valide avec cette forme :
{
  "jobTitle": "string",
  "summary": "string",
  "experiences": [{ "entryId": "id", "title": "string", "description": "string" }],
  "matchedKeywords": ["mot1", "mot2"]
}
Conserve les entryId fournis. Français professionnel. Intègre les mots-clés de l'offre.`;

export async function generatePrefillProposal(
  document: CVDocument,
  jobOffer: string,
): Promise<PrefillProposal> {
  const experienceSection = getExperienceSection(document);
  const currentSummary = getSummaryText(document) || document.header.summary || '';

  const anthropicPayload = await callAnthropicJson<AnthropicPrefillPayload>(
    PREFILL_SYSTEM,
    JSON.stringify({
      jobOffer,
      cv: serializeCvPlainText(document),
      header: {
        jobTitle: document.header.jobTitle,
        summary: currentSummary,
      },
      experiences:
        experienceSection?.entries.map((entry) => ({
          entryId: entry.id,
          title: entry.title,
          description: entry.description ?? '',
        })) ?? [],
    }),
  );

  if (!anthropicPayload || !experienceSection) {
    return buildLocalPrefill(document, jobOffer);
  }

  const experiences = experienceSection.entries.map((entry) => {
    const suggested = anthropicPayload.experiences.find((item) => item.entryId === entry.id);
    return {
      sectionId: experienceSection.id,
      entryId: entry.id,
      title: {
        before: entry.title,
        after: suggested?.title ?? entry.title,
      },
      description: {
        before: entry.description ?? '',
        after: suggested?.description ?? entry.description ?? '',
      },
    };
  });

  return {
    jobTitle: {
      before: document.header.jobTitle,
      after: anthropicPayload.jobTitle || document.header.jobTitle,
    },
    summary: {
      before: currentSummary,
      after: anthropicPayload.summary || currentSummary,
    },
    experiences,
    matchedKeywords: anthropicPayload.matchedKeywords ?? [],
    source: 'anthropic',
  };
}
