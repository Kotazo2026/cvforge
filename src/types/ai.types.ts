import type { CVDocument } from '@/types/cv.types';

export type AiProviderSource = 'anthropic' | 'local';

export interface PrefillFieldChange {
  before: string;
  after: string;
}

export interface PrefillExperienceChange {
  sectionId: string;
  entryId: string;
  title: PrefillFieldChange;
  description: PrefillFieldChange;
}

export interface PrefillProposal {
  jobTitle: PrefillFieldChange;
  summary: PrefillFieldChange;
  experiences: PrefillExperienceChange[];
  matchedKeywords: string[];
  source: AiProviderSource;
}

export interface SectionDensity {
  sectionType: string;
  label: string;
  charCount: number;
  entryCount: number;
  status: 'low' | 'ok' | 'rich';
}

export interface AtsRecommendation {
  priority: number;
  title: string;
  detail: string;
}

export interface AtsScoreResult {
  score: number;
  presentKeywords: string[];
  missingKeywords: string[];
  sectionDensity: SectionDensity[];
  recommendations: AtsRecommendation[];
  source: AiProviderSource;
}

export interface PrefillRequestBody {
  document: CVDocument;
  jobOffer: string;
}

export interface AtsScoreRequestBody {
  document: CVDocument;
  jobOffer?: string;
}

export interface ApplyPrefillInput {
  jobTitle?: string;
  summary?: string;
  experiences?: Array<{
    sectionId: string;
    entryId: string;
    title?: string;
    description?: string;
  }>;
}
