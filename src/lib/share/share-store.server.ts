import type { CVDocument } from '@/types/cv.types';
import type { ShareRecord } from '@/types/share.types';
import { generateId } from '@/utils/cv.utils';

const MAX_SHARES = 500;
const TTL_MS = 30 * 24 * 60 * 60 * 1000;

type ShareStoreGlobal = typeof globalThis & {
  __cvforgeShareStore?: Map<string, ShareRecord>;
};

function getStore(): Map<string, ShareRecord> {
  const g = globalThis as ShareStoreGlobal;
  if (!g.__cvforgeShareStore) {
    g.__cvforgeShareStore = new Map();
  }
  return g.__cvforgeShareStore;
}

function pruneExpired(store: Map<string, ShareRecord>): void {
  const now = Date.now();
  for (const [token, record] of store) {
    if (new Date(record.expiresAt).getTime() <= now) {
      store.delete(token);
    }
  }
}

function enforceCapacity(store: Map<string, ShareRecord>): void {
  if (store.size <= MAX_SHARES) return;
  const sorted = [...store.entries()].sort(
    (a, b) => new Date(a[1].createdAt).getTime() - new Date(b[1].createdAt).getTime(),
  );
  const excess = store.size - MAX_SHARES;
  for (let i = 0; i < excess; i += 1) {
    store.delete(sorted[i][0]);
  }
}

export function createShareRecord(
  document: CVDocument,
  ownerLabel?: string,
): ShareRecord {
  const store = getStore();
  pruneExpired(store);

  const now = new Date();
  const token = generateId();
  const record: ShareRecord = {
    token,
    document: structuredClone(document),
    title: document.title || 'Mon CV',
    ownerLabel,
    createdAt: now.toISOString(),
    expiresAt: new Date(now.getTime() + TTL_MS).toISOString(),
  };

  store.set(token, record);
  enforceCapacity(store);
  return record;
}

export function getShareRecord(token: string): ShareRecord | null {
  const store = getStore();
  pruneExpired(store);
  const record = store.get(token);
  if (!record) return null;
  if (new Date(record.expiresAt).getTime() <= Date.now()) {
    store.delete(token);
    return null;
  }
  return record;
}
