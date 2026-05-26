import { z } from 'zod';
import { cvDocumentSchema } from './cv.schema';

export const prefillRequestSchema = z.object({
  document: cvDocumentSchema,
  jobOffer: z.string().min(40, 'Collez une offre d’emploi d’au moins 40 caractères.'),
});

export const atsScoreRequestSchema = z.object({
  document: cvDocumentSchema,
  jobOffer: z.string().optional(),
});
