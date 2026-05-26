'use client';

import { CV_TEMPLATES } from '@/config/cv-templates';
import { useCVStore } from '@/store/cv.store';
import { Tooltip } from '@/components/ui/Tooltip';
import { cn } from '@/utils/cv.utils';
import { TemplateThumbnail } from './TemplateThumbnail';

export function TemplateSelector() {
  const templateId = useCVStore((state) => state.document.templateId);
  const primary = useCVStore((state) => state.document.colors.primary);
  const setTemplate = useCVStore((state) => state.setTemplate);

  return (
    <div className="flex items-center gap-2" role="radiogroup" aria-label="Choisir un modèle de CV">
      {CV_TEMPLATES.map((template) => (
        <Tooltip key={template.id} content={template.label}>
          <button
            type="button"
            role="radio"
            aria-checked={templateId === template.id}
            aria-label={`Modèle ${template.label}`}
            onClick={() => setTemplate(template.id)}
            className={cn(
              'rounded-md p-0.5 transition-transform hover:scale-105',
              'focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2',
            )}
          >
            <TemplateThumbnail
              templateId={template.id}
              active={templateId === template.id}
              primaryColor={primary}
            />
          </button>
        </Tooltip>
      ))}
    </div>
  );
}
