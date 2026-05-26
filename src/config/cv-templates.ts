import type { TemplateId } from '@/types/cv.types';

export interface CvTemplateMeta {
  id: TemplateId;
  label: string;
}

/** Liste des modèles affichés dans la barre d’outils (ordre = affichage). */
export const CV_TEMPLATES: CvTemplateMeta[] = [
  { id: 'classic', label: 'Classic' },
  { id: 'modern', label: 'Modern' },
  { id: 'minimal', label: 'Minimal' },
  { id: 'creative', label: 'Creative' },
  { id: 'executive', label: 'Executive' },
  { id: 'elegant', label: 'Élégant' },
  { id: 'tech', label: 'Tech' },
  { id: 'academic', label: 'Académique' },
];

const TEMPLATE_IDS = new Set<TemplateId>(CV_TEMPLATES.map((t) => t.id));

export function isTemplateId(value: string): value is TemplateId {
  return TEMPLATE_IDS.has(value as TemplateId);
}

export function normalizeTemplateId(value: string | undefined): TemplateId {
  if (value && isTemplateId(value)) return value;
  return 'classic';
}
