import { z } from 'zod';
import { cvDocumentSchema } from '@/schemas/cv.schema';

export const createShareRequestSchema = z.object({
  document: cvDocumentSchema,
  ownerLabel: z.string().max(120).optional(),
});

export type CreateShareRequest = z.infer<typeof createShareRequestSchema>;
