import type { ComponentType } from 'react';
import type { TemplateId } from '@/types/cv.types';
import type { BaseTemplateProps } from './BaseTemplate';
import { AcademicTemplate } from './AcademicTemplate';
import { AtlasTemplate } from './AtlasTemplate';
import { ClassicTemplate } from './ClassicTemplate';
import { CoralTemplate } from './CoralTemplate';
import { CreativeTemplate } from './CreativeTemplate';
import { DuskTemplate } from './DuskTemplate';
import { ElegantTemplate } from './ElegantTemplate';
import { EmberTemplate } from './EmberTemplate';
import { ExecutiveTemplate } from './ExecutiveTemplate';
import { FrostTemplate } from './FrostTemplate';
import { IvoryTemplate } from './IvoryTemplate';
import { LoftTemplate } from './LoftTemplate';
import { MinimalTemplate } from './MinimalTemplate';
import { ModernTemplate } from './ModernTemplate';
import { NovaTemplate } from './NovaTemplate';
import { ObsidianTemplate } from './ObsidianTemplate';
import { PrismTemplate } from './PrismTemplate';
import { SageTemplate } from './SageTemplate';
import { SlateTemplate } from './SlateTemplate';
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
  nova: NovaTemplate,
  slate: SlateTemplate,
  coral: CoralTemplate,
  obsidian: ObsidianTemplate,
  sage: SageTemplate,
  ivory: IvoryTemplate,
  prism: PrismTemplate,
  loft: LoftTemplate,
  atlas: AtlasTemplate,
  ember: EmberTemplate,
  frost: FrostTemplate,
  dusk: DuskTemplate,
};

export function TemplateRenderer({ document }: BaseTemplateProps) {
  const Template = TEMPLATES[document.templateId] ?? ClassicTemplate;
  return <Template document={document} />;
}
