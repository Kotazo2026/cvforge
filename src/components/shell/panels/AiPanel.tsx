'use client';

import { Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { AdvicePanel } from '@/components/ai/AdvicePanel';
import { AtsScorePanel } from '@/components/ai/AtsScorePanel';
import { GrammarPanel } from '@/components/ai/GrammarPanel';
import { PrefillPanel } from '@/components/ai/PrefillPanel';
import { TranslatePanel } from '@/components/ai/TranslatePanel';
import { useEditorUIStore } from '@/store/editor-ui.store';

export function AiPanel() {
  const openAiModal = useEditorUIStore((state) => state.openAiModal);

  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-cvforge-border px-4 py-4">
        <h2 className="text-sm font-semibold text-cvforge-text">Ajout IA</h2>
        <p className="mt-1 text-xs text-cvforge-muted">
          Pré-remplir · Score ATS · Conseils · Correction · Traduction
        </p>
        <Button
          variant="primary"
          size="md"
          className="mt-3 w-full"
          icon={<Sparkles className="h-4 w-4" aria-hidden />}
          onClick={() => openAiModal('advice')}
        >
          Ouvrir les fonctionnalités IA
        </Button>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4">
        <details className="mb-3 rounded-lg border border-cvforge-border bg-cvforge-raised/30" open>
          <summary className="cursor-pointer px-3 py-2 text-xs font-semibold text-cvforge-text">
            Conseils
          </summary>
          <div className="border-t border-cvforge-border px-3 py-3">
            <AdvicePanel />
          </div>
        </details>
        <details className="mb-3 rounded-lg border border-cvforge-border bg-cvforge-raised/30">
          <summary className="cursor-pointer px-3 py-2 text-xs font-semibold text-cvforge-text">
            Correction
          </summary>
          <div className="border-t border-cvforge-border px-3 py-3">
            <GrammarPanel />
          </div>
        </details>
        <details className="mb-3 rounded-lg border border-cvforge-border bg-cvforge-raised/30">
          <summary className="cursor-pointer px-3 py-2 text-xs font-semibold text-cvforge-text">
            Traduction
          </summary>
          <div className="border-t border-cvforge-border px-3 py-3">
            <TranslatePanel />
          </div>
        </details>
        <details className="rounded-lg border border-cvforge-border bg-cvforge-raised/30">
          <summary className="cursor-pointer px-3 py-2 text-xs font-semibold text-cvforge-text">
            Pré-remplir · Score ATS
          </summary>
          <div className="space-y-4 border-t border-cvforge-border px-3 py-3">
            <PrefillPanel />
            <hr className="border-cvforge-border" />
            <AtsScorePanel />
          </div>
        </details>
      </div>
    </div>
  );
}
