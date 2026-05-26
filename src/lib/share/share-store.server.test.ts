import { beforeEach, describe, expect, it } from 'vitest';
import { defaultCV } from '@/utils/cv.utils';
import { createShareRecord, getShareRecord } from './share-store.server';

describe('share-store.server', () => {
  beforeEach(() => {
    const g = globalThis as typeof globalThis & {
      __cvforgeShareStore?: Map<string, unknown>;
    };
    g.__cvforgeShareStore = new Map();
  });

  it('crée et récupère un partage par token', () => {
    const doc = defaultCV();
    const record = createShareRecord(doc, 'Arezki');
    expect(record.token).toBeTruthy();
    expect(record.ownerLabel).toBe('Arezki');

    const loaded = getShareRecord(record.token);
    expect(loaded?.document.title).toBe(doc.title);
  });

  it('retourne null pour un token inconnu', () => {
    expect(getShareRecord('missing-token')).toBeNull();
  });
});
