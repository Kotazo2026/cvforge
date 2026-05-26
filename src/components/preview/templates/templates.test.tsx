import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { defaultCV } from '@/utils/cv.utils';
import { ClassicTemplate } from './ClassicTemplate';
import { CreativeTemplate } from './CreativeTemplate';
import { ExecutiveTemplate } from './ExecutiveTemplate';
import { MinimalTemplate } from './MinimalTemplate';
import { ModernTemplate } from './ModernTemplate';
import { TemplateRenderer } from './TemplateRenderer';

const document = defaultCV();

describe('CV templates', () => {
  it.each([
    ['Classic', ClassicTemplate],
    ['Modern', ModernTemplate],
    ['Minimal', MinimalTemplate],
    ['Creative', CreativeTemplate],
    ['Executive', ExecutiveTemplate],
  ] as const)('rend %s sans erreur', (_name, Template) => {
    const { container } = render(<Template document={document} />);
    expect(container.querySelector('.cv-template')).toBeTruthy();
  });

  it('TemplateRenderer bascule selon templateId', () => {
    const { container, rerender } = render(<TemplateRenderer document={document} />);
    expect(container.querySelector('.cv-template')).toBeTruthy();

    rerender(
      <TemplateRenderer document={{ ...document, templateId: 'minimal' }} />,
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
