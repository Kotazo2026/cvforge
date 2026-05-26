import type { CVDocument, CVSection } from '@/types/cv.types';
import { getSummaryText } from '@/components/preview/templates/template-helpers';

export function serializeCvPlainText(document: CVDocument): string {
  const { header } = document;
  const parts: string[] = [
    header.firstName,
    header.lastName,
    header.jobTitle,
    header.email,
    header.phone,
    header.location,
    header.summary ?? '',
    getSummaryText(document),
  ];

  for (const section of document.sections) {
    if (!section.visible) continue;
    parts.push(section.title);
    for (const entry of section.entries) {
      parts.push(entry.title, entry.subtitle ?? '', entry.location ?? '', entry.description ?? '');
      if (entry.tags?.length) parts.push(entry.tags.join(' '));
    }
  }

  return parts.filter(Boolean).join('\n');
}

export function getExperienceSection(document: CVDocument): CVSection | undefined {
  return document.sections.find((section) => section.type === 'experience' && section.visible);
}
