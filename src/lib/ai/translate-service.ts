import type { CVDocument } from '@/types/cv.types';
import type { TranslationResult, TranslationTargetLanguage } from '@/types/ai.types';
import { cvDocumentSchema } from '@/schemas/cv.schema';
import { callAnthropicJson } from './anthropic';
import { buildLocalTranslation } from './translate-local';
import { serializeCvPlainText } from './document-text';

const TRANSLATE_SYSTEM = `Traduis intégralement le CV JSON vers la langue cible.
Réponds UNIQUEMENT avec le JSON du document traduit (même structure, mêmes ids de sections/entrées).
Conserve les dates et formats. Adapte les titres de sections.`;

export async function generateTranslation(
  document: CVDocument,
  targetLanguage: TranslationTargetLanguage,
): Promise<TranslationResult> {
  const local = buildLocalTranslation(document, targetLanguage);

  const anthropic = await callAnthropicJson<CVDocument>(
    TRANSLATE_SYSTEM,
    JSON.stringify({ targetLanguage, cv: serializeCvPlainText(document), document }),
  );

  const parsed = cvDocumentSchema.safeParse(anthropic);
  if (!parsed.success) return local;

  return {
    document: {
      ...parsed.data,
      title: `${document.title} (${targetLanguage.toUpperCase()})`,
      updatedAt: new Date().toISOString(),
    },
    targetLanguage,
    source: 'anthropic',
  };
}
