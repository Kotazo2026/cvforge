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

export const adviceRequestSchema = z.object({
  document: cvDocumentSchema,
});

export const grammarRequestSchema = z.object({
  document: cvDocumentSchema,
});

export const translationTargetSchema = z.enum(['en', 'es', 'de', 'it', 'pt', 'ar', 'zh']);

export const translateRequestSchema = z.object({
  document: cvDocumentSchema,
  targetLanguage: translationTargetSchema,
});

export const chatMessageSchema = z.object({
  role: z.enum(['user', 'assistant']),
  content: z.string().min(1),
});

export const chatRequestSchema = z.object({
  document: cvDocumentSchema,
  messages: z.array(chatMessageSchema).max(20),
  userMessage: z.string().min(1).max(2000),
});
