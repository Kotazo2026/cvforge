import type { CVDocument } from '@/types/cv.types';

export interface BaseTemplateProps {
  document: CVDocument;
}

/** Interface commune des templates CV — implémentation au Bloc 6. */
export function BaseTemplate(props: BaseTemplateProps) {
  void props;
  return null;
}
