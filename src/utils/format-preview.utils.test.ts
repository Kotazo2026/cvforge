import { describe, expect, it } from 'vitest';
import { defaultCV } from '@/utils/cv.utils';
import {
  formatLinkedInUrl,
  getSectionEntries,
  getSkillsList,
  MOBILE_PREVIEW_WIDTH_PX,
} from './format-preview.utils';

describe('format-preview.utils', () => {
  it('expose la largeur mobile standard', () => {
    expect(MOBILE_PREVIEW_WIDTH_PX).toBe(375);
  });

  it('extrait les expériences visibles', () => {
    const doc = defaultCV();
    const entries = getSectionEntries(doc, 'experience');
    expect(entries.length).toBeGreaterThan(0);
    expect(entries[0]?.title).toBeTruthy();
  });

  it('liste les compétences', () => {
    const doc = defaultCV();
    const skills = getSkillsList(doc);
    expect(skills.some((s) => s.includes('TypeScript'))).toBe(true);
  });

  it('normalise une URL LinkedIn', () => {
    expect(formatLinkedInUrl('https://www.linkedin.com/in/test')).toBe('linkedin.com/in/test');
  });
});
