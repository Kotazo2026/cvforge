import type { CVDocument } from '@/types/cv.types';
import type { ChatRequestMessage, ChatResponse } from '@/types/ai.types';
import { callAnthropicChat } from './anthropic';
import { buildLocalChatResponse } from './chat-local';
import { serializeCvPlainText } from './document-text';

const CHAT_SYSTEM = `Tu es l'assistant CVForge. Tu connais le CV de l'utilisateur en temps réel.
Réponds en français, de façon concise et professionnelle.
Quand l'utilisateur demande une modification du CV, propose un patch JSON.
Réponds UNIQUEMENT avec ce JSON (pas de markdown autour) :
{
  "reply": "message à afficher",
  "patch": null | {
    "jobTitle": "optionnel",
    "summary": "optionnel",
    "experiences": [{ "sectionId": "id", "entryId": "id", "title": "optionnel", "description": "optionnel" }]
  }
}
Ne modifie que ce qui est demandé. Garde les ids section/entry fournis dans le contexte.`;

interface AnthropicChatPayload {
  reply: string;
  patch?: ChatResponse['patch'];
}

function parseChatPayload(raw: string): AnthropicChatPayload | null {
  try {
    return JSON.parse(raw) as AnthropicChatPayload;
  } catch {
    const block = raw.match(/```json\s*([\s\S]*?)```/i)?.[1];
    if (!block) return null;
    try {
      return JSON.parse(block) as AnthropicChatPayload;
    } catch {
      return null;
    }
  }
}

export function buildExperienceContext(document: CVDocument): string {
  return JSON.stringify({
    header: {
      jobTitle: document.header.jobTitle,
      summary: document.header.summary,
    },
    experiences:
      document.sections
        .find((s) => s.type === 'experience')
        ?.entries.map((entry) => ({
          sectionId: document.sections.find((s) => s.type === 'experience')!.id,
          entryId: entry.id,
          title: entry.title,
          description: entry.description ?? '',
        })) ?? [],
  });
}

export async function generateChatResponse(
  document: CVDocument,
  history: ChatRequestMessage[],
  userMessage: string,
): Promise<ChatResponse> {
  const context = `CV actuel:\n${serializeCvPlainText(document)}\n\nContexte expériences (ids):\n${buildExperienceContext(document)}`;

  const anthropicMessages: ChatRequestMessage[] = [
    ...history.slice(-10),
    { role: 'user', content: userMessage },
  ];

  const raw = await callAnthropicChat(
    `${CHAT_SYSTEM}\n\n${context}`,
    anthropicMessages.map((message) => ({
      role: message.role,
      content: message.content,
    })),
  );

  if (raw) {
    const parsed = parseChatPayload(raw.trim());
    if (parsed?.reply) {
      return {
        reply: parsed.reply,
        patch: parsed.patch,
        source: 'anthropic',
      };
    }
    return {
      reply: raw.trim(),
      source: 'anthropic',
    };
  }

  return buildLocalChatResponse(document, userMessage);
}
