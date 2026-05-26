import type { CVDocument, CVEntry, CVSection } from '@/types/cv.types';
import {
  entryDateLabel,
  getSummaryText,
  getVisibleSections,
  skillLabel,
} from '@/components/preview/templates/template-helpers';

export const MOBILE_PREVIEW_WIDTH_PX = 375;

export function getSectionEntries(
  document: CVDocument,
  type: CVSection['type'],
): CVEntry[] {
  const section = document.sections.find((s) => s.type === type && s.visible);
  return section?.entries ?? [];
}

export function getSkillsList(document: CVDocument): string[] {
  const section = document.sections.find((s) => s.type === 'skills' && s.visible);
  if (!section) return [];
  return section.entries.map((entry) => skillLabel(entry)).filter(Boolean);
}

export function formatLinkedInUrl(url?: string): string | undefined {
  if (!url?.trim()) return undefined;
  return url.replace(/^https?:\/\//i, '').replace(/^www\./i, '');
}

export { getSummaryText, getVisibleSections, entryDateLabel, skillLabel };
