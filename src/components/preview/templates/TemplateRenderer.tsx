import type { ComponentType } from 'react';
import type { TemplateId } from '@/types/cv.types';
import type { BaseTemplateProps } from './BaseTemplate';
import { ClassicTemplate } from './ClassicTemplate';
import { CreativeTemplate } from './CreativeTemplate';
import { ExecutiveTemplate } from './ExecutiveTemplate';
import { MinimalTemplate } from './MinimalTemplate';
import { ModernTemplate } from './ModernTemplate';

const TEMPLATES: Record<TemplateId, ComponentType<BaseTemplateProps>> = {
  classic: ClassicTemplate,
  modern: ModernTemplate,
  minimal: MinimalTemplate,
  creative: CreativeTemplate,
  executive: ExecutiveTemplate,
};

export function TemplateRenderer({ document }: BaseTemplateProps) {
  const Template = TEMPLATES[document.templateId] ?? ClassicTemplate;
  return <Template document={document} />;
}
