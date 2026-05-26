'use client';

import { Sparkles } from 'lucide-react';

/** Placeholder — fonctionnalités IA au Blocs 16–18. */
export function AiPanel() {
  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-cvforge-border px-4 py-4">
        <h2 className="text-sm font-semibold text-cvforge-text">Ajout IA</h2>
        <p className="mt-1 text-xs text-cvforge-muted">Pré-remplissage, score ATS, conseils…</p>
      </div>

      <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-cvforge-accent to-cvforge-accent-blue">
          <Sparkles className="h-7 w-7 text-white" aria-hidden />
        </div>
        <p className="text-sm text-cvforge-muted">
          Les assistants IA arrivent au Bloc 16. Utilisez le bouton « Fonctionnalités IA » en haut
          pour y accéder bientôt.
        </p>
      </div>
    </div>
  );
}
