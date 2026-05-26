import type { CVDocument } from '@/types/cv.types';
import type { AtsScoreResult } from '@/types/ai.types';
import { callAnthropicJson } from './anthropic';
import { serializeCvPlainText } from './document-text';
import { buildLocalAtsScore } from './ats-score-local';

interface AnthropicAtsPayload {
  score: number;
  presentKeywords: string[];
  missingKeywords: string[];
  recommendations: Array<{ priority: number; title: string; detail: string }>;
}

const ATS_SYSTEM = `Tu es un expert ATS. Analyse le CV par rapport à l'offre (si fournie).
Réponds UNIQUEMENT en JSON :
{
  "score": 0-100,
  "presentKeywords": ["..."],
  "missingKeywords": ["..."],
  "recommendations": [{ "priority": 1, "title": "...", "detail": "..." }]
}
Maximum 3 recommandations, priorité 1 = la plus importante.`;

export async function generateAtsScore(
  document: CVDocument,
  jobOffer?: string,
): Promise<AtsScoreResult> {
  const local = buildLocalAtsScore(document, jobOffer);

  const anthropicPayload = await callAnthropicJson<AnthropicAtsPayload>(
    ATS_SYSTEM,
    JSON.stringify({
      jobOffer: jobOffer ?? '',
      cv: serializeCvPlainText(document),
      localBaseline: {
        score: local.score,
        missingKeywords: local.missingKeywords.slice(0, 10),
      },
    }),
  );

  if (!anthropicPayload) return local;

  return {
    score: Math.min(100, Math.max(0, Math.round(anthropicPayload.score))),
    presentKeywords: anthropicPayload.presentKeywords ?? local.presentKeywords,
    missingKeywords: anthropicPayload.missingKeywords ?? local.missingKeywords,
    sectionDensity: local.sectionDensity,
    recommendations: (anthropicPayload.recommendations ?? local.recommendations).slice(0, 3),
    source: 'anthropic',
  };
}
