import type { ComponentType } from 'react';
import type { TemplateId } from '@/types/cv.types';
import type { BaseTemplateProps } from './BaseTemplate';
import { AcademicTemplate } from './AcademicTemplate';
import { ClassicTemplate } from './ClassicTemplate';
import { CreativeTemplate } from './CreativeTemplate';
import { ElegantTemplate } from './ElegantTemplate';
import { ExecutiveTemplate } from './ExecutiveTemplate';
import { MinimalTemplate } from './MinimalTemplate';
import { ModernTemplate } from './ModernTemplate';
import { TechTemplate } from './TechTemplate';

const TEMPLATES: Record<TemplateId, ComponentType<BaseTemplateProps>> = {
  classic: ClassicTemplate,
  modern: ModernTemplate,
  minimal: MinimalTemplate,
  creative: CreativeTemplate,
  executive: ExecutiveTemplate,
  elegant: ElegantTemplate,
  tech: TechTemplate,
  academic: AcademicTemplate,
};

export function TemplateRenderer({ document }: BaseTemplateProps) {
  const Template = TEMPLATES[document.templateId] ?? ClassicTemplate;
  return <Template document={document} />;
}
