import { beforeEach, describe, expect, it } from 'vitest';
import { defaultCV } from '@/utils/cv.utils';
import {
  appendShareRegistry,
  buildSharePath,
  buildShareUrl,
  forkDocumentForEditor,
  readShareRegistry,
} from './share.utils';

describe('share.utils', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('buildSharePath et buildShareUrl', () => {
    expect(buildSharePath('abc-123')).toBe('/share/abc-123');
    expect(buildShareUrl('tok', 'https://cvforge.test')).toBe(
      'https://cvforge.test/share/tok',
    );
  });

  it('forkDocumentForEditor crée une copie avec nouvel id', () => {
    const source = defaultCV();
    source.title = 'CV Test';
    const forked = forkDocumentForEditor(source);
    expect(forked.id).not.toBe(source.id);
    expect(forked.title).toContain('(copie)');
    expect(forked.header.firstName).toBe(source.header.firstName);
  });

  it('appendShareRegistry et readShareRegistry', () => {
    appendShareRegistry({
      token: 't1',
      title: 'Mon CV',
      url: 'http://localhost/share/t1',
      createdAt: '2026-01-01T00:00:00.000Z',
    });
    const list = readShareRegistry();
    expect(list).toHaveLength(1);
    expect(list[0]?.token).toBe('t1');
  });
});
