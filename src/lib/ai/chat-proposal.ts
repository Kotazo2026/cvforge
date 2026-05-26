import type { CVDocument } from '@/types/cv.types';
import type { ChatCvPatch, PrefillProposal } from '@/types/ai.types';
import { getSummaryText } from '@/components/preview/templates/template-helpers';

export function patchToPrefillProposal(
  document: CVDocument,
  patch: ChatCvPatch,
): PrefillProposal {
  const currentSummary = getSummaryText(document) || document.header.summary || '';
  const experienceSection = document.sections.find((s) => s.type === 'experience');

  const experiences =
    patch.experiences?.map((item) => {
      const entry = experienceSection?.entries.find((e) => e.id === item.entryId);
      return {
        sectionId: item.sectionId,
        entryId: item.entryId,
        title: {
          before: entry?.title ?? '',
          after: item.title ?? entry?.title ?? '',
        },
        description: {
          before: entry?.description ?? '',
          after: item.description ?? entry?.description ?? '',
        },
      };
    }) ?? [];

  return {
    jobTitle: {
      before: document.header.jobTitle,
      after: patch.jobTitle ?? document.header.jobTitle,
    },
    summary: {
      before: currentSummary,
      after: patch.summary ?? currentSummary,
    },
    experiences,
    matchedKeywords: [],
    source: 'local',
  };
}

export function hasPatchChanges(document: CVDocument, patch: ChatCvPatch): boolean {
  const proposal = patchToPrefillProposal(document, patch);
  if (proposal.jobTitle.before !== proposal.jobTitle.after) return true;
  if (proposal.summary.before !== proposal.summary.after) return true;
  return proposal.experiences.some(
    (item) =>
      item.title.before !== item.title.after ||
      item.description.before !== item.description.after,
  );
}
