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

export interface AdviceTip {
  id: string;
  message: string;
}

export interface EntryReformulation {
  fieldKey: string;
  label: string;
  before: string;
  after: string;
}

export interface AdviceResult {
  tips: AdviceTip[];
  reformulations: EntryReformulation[];
  source: AiProviderSource;
}

export interface GrammarIssue {
  id: string;
  fieldKey: string;
  fieldLabel: string;
  original: string;
  suggestion: string;
  message: string;
}

export interface GrammarResult {
  issues: GrammarIssue[];
  source: AiProviderSource;
}

export type TranslationTargetLanguage = 'en' | 'es' | 'de' | 'it' | 'pt' | 'ar' | 'zh';

export const TRANSLATION_LANGUAGE_LABELS: Record<TranslationTargetLanguage, string> = {
  en: 'Anglais',
  es: 'Espagnol',
  de: 'Allemand',
  it: 'Italien',
  pt: 'Portugais',
  ar: 'Arabe',
  zh: 'Chinois',
};

export const TRANSLATION_LANGUAGE_FLAGS: Record<TranslationTargetLanguage, string> = {
  en: '🇬🇧',
  es: '🇪🇸',
  de: '🇩🇪',
  it: '🇮🇹',
  pt: '🇵🇹',
  ar: '🇸🇦',
  zh: '🇨🇳',
};

export interface TranslationResult {
  document: CVDocument;
  targetLanguage: TranslationTargetLanguage;
  source: AiProviderSource;
}
