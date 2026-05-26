import type { CVDocument } from '@/types/cv.types';
import type { AdviceResult } from '@/types/ai.types';
import { callAnthropicJson } from './anthropic';
import { buildLocalAdvice } from './advice-local';
import { serializeCvPlainText } from './document-text';

interface AnthropicAdvicePayload {
  tips: Array<{ id: string; message: string }>;
  reformulations: Array<{
    fieldKey: string;
    label: string;
    before: string;
    after: string;
  }>;
}

const ADVICE_SYSTEM = `Tu es coach carrière. Analyse le CV et renvoie UNIQUEMENT du JSON :
{
  "tips": [{ "id": "string", "message": "conseil" }],
  "reformulations": [{ "fieldKey": "header:summary ou entry:sectionId:entryId:description", "label": "string", "before": "string", "after": "string" }]
}
3 à 5 conseils. Reformulations uniquement pour descriptions faibles. Français.`;

export async function generateAdvice(document: CVDocument): Promise<AdviceResult> {
  const local = buildLocalAdvice(document);

  const anthropic = await callAnthropicJson<AnthropicAdvicePayload>(
    ADVICE_SYSTEM,
    serializeCvPlainText(document),
  );

  if (!anthropic?.tips?.length) return local;

  return {
    tips: anthropic.tips.slice(0, 5),
    reformulations: anthropic.reformulations ?? local.reformulations,
    source: 'anthropic',
  };
}
