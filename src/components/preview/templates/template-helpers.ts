import type { CVDocument, CVEntry, CVSection, SectionType } from '@/types/cv.types';
import { formatDateRange, getInitials } from '@/utils/cv.utils';

export const CLASSIC_SIDEBAR_TYPES: SectionType[] = [
  'skills',
  'languages',
  'certifications',
];

export const CLASSIC_MAIN_TYPES: SectionType[] = [
  'summary',
  'experience',
  'education',
  'projects',
  'references',
  'custom',
];

export function getVisibleSections(document: CVDocument): CVSection[] {
  return document.sections.filter((section) => section.visible);
}

export function filterSectionsByTypes(
  sections: CVSection[],
  types: SectionType[],
): CVSection[] {
  return sections.filter((section) => types.includes(section.type));
}

export function getContactLines(header: CVDocument['header']): string[] {
  return [
    header.email,
    header.phone,
    header.location,
    header.website,
    header.linkedin,
  ].filter((line): line is string => Boolean(line && line.trim()));
}

export function getSummaryText(document: CVDocument): string {
  const summarySection = document.sections.find(
    (section) => section.type === 'summary' && section.visible,
  );
  const fromSection = summarySection?.entries
    .map((entry) => entry.description ?? entry.title)
    .filter(Boolean)
    .join('\n');
  return fromSection || document.header.summary || '';
}

export function entryDateLabel(entry: CVEntry): string {
  return formatDateRange(entry.startDate, entry.endDate, entry.current);
}

export function skillLabel(entry: CVEntry): string {
  if (entry.tags?.length) return entry.tags.join(', ');
  return entry.title;
}

export function levelPercent(level?: number): number {
  if (!level) return 60;
  return Math.min(100, Math.max(20, (level / 5) * 100));
}

export { getInitials };
