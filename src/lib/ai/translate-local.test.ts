import { describe, expect, it } from 'vitest';
import { defaultCV } from '@/utils/cv.utils';
import { buildLocalTranslation } from './translate-local';

describe('translate-local', () => {
  it('crée une copie traduite distincte', () => {
    const source = defaultCV();
    const result = buildLocalTranslation(source, 'en');
    expect(result.document.id).not.toBe(source.id);
    expect(result.document.header.jobTitle.toLowerCase()).toContain('developer');
    expect(result.targetLanguage).toBe('en');
  });
});
