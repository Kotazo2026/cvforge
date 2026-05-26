'use client';

import dynamic from 'next/dynamic';
import { useAiChatStore } from '@/store/ai-chat.store';
import { useEditorUIStore } from '@/store/editor-ui.store';

const AiFeaturesModal = dynamic(
  () => import('@/components/ai/AiFeaturesModal').then((m) => m.AiFeaturesModal),
  { ssr: false },
);

const AiChatPanel = dynamic(
  () => import('@/components/ai/AiChatPanel').then((m) => m.AiChatPanel),
  { ssr: false },
);

/** Modales IA chargées uniquement lorsqu’elles sont ouvertes (réduit le bundle initial). */
export function EditorLazyOverlays() {
  const aiModalOpen = useEditorUIStore((state) => state.aiModalOpen);
  const chatOpen = useAiChatStore((state) => state.open);

  return (
    <>
      {aiModalOpen ? <AiFeaturesModal /> : null}
      {chatOpen ? <AiChatPanel /> : null}
    </>
  );
}
