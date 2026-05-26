import type { CVDocument } from '@/types/cv.types';
import { generateId } from '@/utils/cv.utils';

const SHARE_REGISTRY_KEY = 'cvforge_share_links';

export function buildSharePath(token: string): string {
  return `/share/${encodeURIComponent(token)}`;
}

export function buildShareUrl(token: string, origin = ''): string {
  const base = origin.replace(/\/$/, '');
  return `${base}${buildSharePath(token)}`;
}

/** Copie le CV partagé pour l’éditeur (nouvel id, titre suffixé). */
export function forkDocumentForEditor(source: CVDocument): CVDocument {
  const cloned = structuredClone(source);
  const now = new Date().toISOString();
  cloned.id = generateId();
  const baseTitle = (source.title || 'Mon CV').trim();
  cloned.title = baseTitle.endsWith('(copie)') ? baseTitle : `${baseTitle} (copie)`;
  cloned.createdAt = now;
  cloned.updatedAt = now;
  return cloned;
}

export interface ShareRegistryEntry {
  token: string;
  title: string;
  url: string;
  createdAt: string;
}

export function readShareRegistry(): ShareRegistryEntry[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(SHARE_REGISTRY_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as ShareRegistryEntry[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function appendShareRegistry(entry: ShareRegistryEntry): void {
  if (typeof window === 'undefined') return;
  const list = readShareRegistry().filter((item) => item.token !== entry.token);
  list.unshift(entry);
  try {
    window.localStorage.setItem(SHARE_REGISTRY_KEY, JSON.stringify(list.slice(0, 20)));
  } catch {
    // quota / mode privé
  }
}

export async function copyTextToClipboard(text: string): Promise<boolean> {
  if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      // fallback
    }
  }
  return false;
}
