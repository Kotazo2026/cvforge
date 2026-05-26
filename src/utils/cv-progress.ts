import type { CVDocument } from '@/types/cv.types';

export interface ProgressCheckItem {
  id: string;
  label: string;
  completed: boolean;
}

export function buildCvProgressChecklist(document: CVDocument): ProgressCheckItem[] {
  const { header, sections } = document;
  const hasName = Boolean(header.firstName.trim() && header.lastName.trim());
  const hasContact = Boolean(header.email.trim() && header.phone.trim());
  const hasSummary = Boolean((header.summary ?? '').trim().length >= 50);
  const hasPhoto = Boolean(header.photo);
  const experiences = sections.find((s) => s.type === 'experience' && s.visible);
  const education = sections.find((s) => s.type === 'education' && s.visible);
  const skills = sections.find((s) => s.type === 'skills' && s.visible);
  const hasExperiences = Boolean(experiences?.entries.some((e) => e.title.trim()));
  const hasEducation = Boolean(education?.entries.some((e) => e.title.trim()));
  const hasSkills = Boolean(skills?.entries.some((e) => e.title.trim() || e.tags?.length));
  const richDescription = sections.some((section) =>
    section.entries.some((entry) => (entry.description ?? '').trim().length >= 150),
  );

  return [
    { id: 'name', label: 'Nom et prénom', completed: hasName },
    { id: 'contact', label: 'E-mail et téléphone', completed: hasContact },
    { id: 'summary', label: 'Accroche professionnelle (50+ car.)', completed: hasSummary },
    { id: 'photo', label: 'Photo de profil', completed: hasPhoto },
    { id: 'experience', label: 'Au moins une expérience', completed: hasExperiences },
    { id: 'education', label: 'Au moins une formation', completed: hasEducation },
    { id: 'skills', label: 'Compétences renseignées', completed: hasSkills },
    {
      id: 'descriptions',
      label: 'Description détaillée (150+ car.)',
      completed: richDescription,
    },
  ];
}

export function computeCvProgressPercent(items: ProgressCheckItem[]): number {
  if (items.length === 0) return 0;
  const done = items.filter((item) => item.completed).length;
  return Math.round((done / items.length) * 100);
}
