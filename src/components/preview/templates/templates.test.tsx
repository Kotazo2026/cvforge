import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { CV_TEMPLATES } from '@/config/cv-templates';
import { defaultCV } from '@/utils/cv.utils';
import { TemplateRenderer } from './TemplateRenderer';
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

const document = defaultCV();

const ALL_TEMPLATES = [
  ['Classic', ClassicTemplate],
  ['Modern', ModernTemplate],
  ['Minimal', MinimalTemplate],
  ['Creative', CreativeTemplate],
  ['Executive', ExecutiveTemplate],
  ['Elegant', ElegantTemplate],
  ['Tech', TechTemplate],
  ['Academic', AcademicTemplate],
  ['Nova', NovaTemplate],
  ['Slate', SlateTemplate],
  ['Coral', CoralTemplate],
  ['Obsidian', ObsidianTemplate],
  ['Sage', SageTemplate],
  ['Ivory', IvoryTemplate],
  ['Prism', PrismTemplate],
  ['Loft', LoftTemplate],
  ['Atlas', AtlasTemplate],
  ['Ember', EmberTemplate],
  ['Frost', FrostTemplate],
  ['Dusk', DuskTemplate],
] as const;

describe('CV templates', () => {
  it('registre 20 modèles dans la config', () => {
    expect(CV_TEMPLATES).toHaveLength(20);
  });

  it.each(ALL_TEMPLATES)('rend %s sans erreur', (_name, Template) => {
    const { container } = render(<Template document={document} />);
    expect(container.querySelector('.cv-template')).toBeTruthy();
  });

  it('TemplateRenderer bascule selon templateId', () => {
    const { container, rerender } = render(<TemplateRenderer document={document} />);
    expect(container.querySelector('.cv-template')).toBeTruthy();

    rerender(
      <TemplateRenderer document={{ ...document, templateId: 'nova' }} />,
    );
    expect(container.querySelector('.cv-template')).toBeTruthy();
  });

  it('rend avec champs vides sans crash', () => {
    const empty = {
      ...document,
      header: {
        ...document.header,
        firstName: '',
        lastName: '',
        jobTitle: '',
        email: '',
        phone: '',
        location: '',
        summary: '',
        photo: undefined,
      },
      sections: [],
    };
    const { container } = render(<ClassicTemplate document={empty} />);
    expect(container.querySelector('.cv-template')).toBeTruthy();
  });
});
