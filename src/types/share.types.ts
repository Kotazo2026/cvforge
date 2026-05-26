import type { CVDocument } from '@/types/cv.types';

/** Enregistrement serveur d’un CV partagé (mémoire, sans base de données). */
export interface ShareRecord {
  token: string;
  document: CVDocument;
  title: string;
  ownerLabel?: string;
  createdAt: string;
  expiresAt: string;
}

/** Métadonnées d’un lien créé par l’utilisateur (index localStorage). */
export interface ShareLinkMeta {
  token: string;
  title: string;
  url: string;
  createdAt: string;
}

export interface CreateShareResponse {
  token: string;
  url: string;
  title: string;
  expiresAt: string;
}

export interface GetShareResponse {
  record: ShareRecord;
}
