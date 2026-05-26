import { z } from 'zod';

export const sectionTypeSchema = z.enum([
  'header',
  'summary',
  'experience',
  'education',
  'skills',
  'languages',
  'certifications',
  'projects',
  'references',
  'custom',
]);

export const cvEntrySchema = z.object({
  id: z.string().min(1),
  title: z.string(),
  subtitle: z.string().optional(),
  location: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  current: z.boolean().optional(),
  description: z.string().optional(),
  tags: z.array(z.string()).optional(),
  level: z.number().int().min(1).max(5).optional(),
});

export const cvSectionSchema = z.object({
  id: z.string().min(1),
  type: sectionTypeSchema,
  title: z.string(),
  visible: z.boolean(),
  entries: z.array(cvEntrySchema),
});

export const cvHeaderSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  jobTitle: z.string(),
  email: z.string().email(),
  phone: z.string(),
  location: z.string(),
  mobility: z.string().optional(),
  drivingLicense: z.string().optional(),
  website: z.string().optional(),
  linkedin: z.string().optional(),
  photo: z.string().optional(),
  summary: z.string().optional(),
});

export const templateIdSchema = z.enum([
  'classic',
  'modern',
  'minimal',
  'creative',
  'executive',
  'elegant',
  'tech',
  'academic',
]);

export const cvColorsSchema = z.object({
  primary: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
  secondary: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
  text: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
  background: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
});

export const cvDocumentSchema = z.object({
  id: z.string().min(1),
  title: z.string(),
  header: cvHeaderSchema,
  sections: z.array(cvSectionSchema),
  templateId: templateIdSchema,
  colors: cvColorsSchema,
  fontSize: z.enum(['small', 'medium', 'large']),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export type CVDocumentInput = z.infer<typeof cvDocumentSchema>;
