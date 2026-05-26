'use client';

import { Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { PrefillPanel } from '@/components/ai/PrefillPanel';
import { AtsScorePanel } from '@/components/ai/AtsScorePanel';
import { useEditorUIStore } from '@/store/editor-ui.store';

export function AiPanel() {
  const openAiModal = useEditorUIStore((state) => state.openAiModal);

  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-cvforge-border px-4 py-4">
        <h2 className="text-sm font-semibold text-cvforge-text">Ajout IA</h2>
        <p className="mt-1 text-xs text-cvforge-muted">
          Pré-remplir depuis une offre · Score ATS avec jauge et conseils
        </p>
        <Button
          variant="primary"
          size="md"
          className="mt-3 w-full"
          icon={<Sparkles className="h-4 w-4" aria-hidden />}
          onClick={() => openAiModal('prefill')}
        >
          Ouvrir les fonctionnalités IA
        </Button>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4">
        <details className="mb-4 rounded-lg border border-cvforge-border bg-cvforge-raised/30">
          <summary className="cursor-pointer px-3 py-2 text-xs font-semibold text-cvforge-text">
            Pré-remplir (aperçu)
          </summary>
          <div className="border-t border-cvforge-border px-3 py-3">
            <PrefillPanel compact />
          </div>
        </details>
        <details className="rounded-lg border border-cvforge-border bg-cvforge-raised/30">
          <summary className="cursor-pointer px-3 py-2 text-xs font-semibold text-cvforge-text">
            Score ATS (aperçu)
          </summary>
          <div className="border-t border-cvforge-border px-3 py-3">
            <AtsScorePanel compact />
          </div>
        </details>
      </div>
    </div>
  );
}
