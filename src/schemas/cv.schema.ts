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

const hexColor = z.string().regex(/^#[0-9A-Fa-f]{6}$/);

export const cvLayoutColorsSchema = z.object({
  name: hexColor,
  jobTitle: hexColor,
  sectionTitleSidebar: hexColor,
  sectionTitleMain: hexColor,
  organization: hexColor,
  skillBar: hexColor,
  sidebarBackground: hexColor,
});

export const cvLayoutTypographySchema = z.object({
  bodyFont: z.enum([
    'inter',
    'lato',
    'raleway',
    'merriweather',
    'roboto-slab',
    'dm-sans',
    'playfair',
    'source-serif',
  ]),
  bodyStyle: z.enum(['normal', 'bold', 'italic']),
  titleFont: z.enum([
    'inter',
    'lato',
    'raleway',
    'merriweather',
    'roboto-slab',
    'dm-sans',
    'playfair',
    'source-serif',
  ]),
  bodySizePx: z.number().int().min(8).max(14),
  nameSizePx: z.number().int().min(18).max(36),
  sectionTitleSizePx: z.number().int().min(10).max(16),
});

export const cvLayoutSpacingSchema = z.object({
  blockGapPx: z.number().int().min(8).max(48),
  paddingVerticalPx: z.number().int().min(12).max(56),
  paddingHorizontalPx: z.number().int().min(12).max(56),
});

export const cvLayoutOptionsSchema = z.object({
  colors: cvLayoutColorsSchema,
  typography: cvLayoutTypographySchema,
  spacing: cvLayoutSpacingSchema,
  roundedPhoto: z.boolean(),
  showTimeline: z.boolean(),
  nameUppercase: z.boolean(),
  summaryJustified: z.boolean(),
  dateFormat: z.enum(['default', 'mm-yyyy', 'month-yyyy', 'yyyy']),
});

export const cvDocumentSchema = z.object({
  id: z.string().min(1),
  title: z.string(),
  header: cvHeaderSchema,
  sections: z.array(cvSectionSchema),
  templateId: templateIdSchema,
  colors: cvColorsSchema,
  layout: cvLayoutOptionsSchema,
  fontSize: z.enum(['small', 'medium', 'large']),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export type CVDocumentInput = z.infer<typeof cvDocumentSchema>;
