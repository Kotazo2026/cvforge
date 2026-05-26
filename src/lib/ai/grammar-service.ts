import type { CVDocument } from '@/types/cv.types';
import type { GrammarResult } from '@/types/ai.types';
import { callAnthropicJson } from './anthropic';
import { buildLocalGrammarCheck } from './grammar-local';
import { serializeCvPlainText } from './document-text';

interface AnthropicGrammarPayload {
  issues: Array<{
    id: string;
    fieldKey: string;
    fieldLabel: string;
    original: string;
    suggestion: string;
    message: string;
  }>;
}

const GRAMMAR_SYSTEM = `Correcteur orthographe/grammaire CV. JSON uniquement :
{
  "issues": [{ "id": "uuid", "fieldKey": "header:summary|entry:sectionId:entryId:description", "fieldLabel": "string", "original": "texte actuel", "suggestion": "texte corrigé", "message": "raison courte" }]
}
Maximum 12 issues. Français.`;

export async function generateGrammarCheck(document: CVDocument): Promise<GrammarResult> {
  const local = buildLocalGrammarCheck(document);

  const anthropic = await callAnthropicJson<AnthropicGrammarPayload>(
    GRAMMAR_SYSTEM,
    serializeCvPlainText(document),
  );

  if (!anthropic?.issues?.length) return local;

  return {
    issues: anthropic.issues.slice(0, 12),
    source: 'anthropic',
  };
}
