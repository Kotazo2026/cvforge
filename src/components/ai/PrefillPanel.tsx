'use client';

import { useState } from 'react';
import { Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useCVStore } from '@/store/cv.store';
import type { PrefillProposal } from '@/types/ai.types';
import { DiffBlock } from './DiffBlock';

interface PrefillPanelProps {
  compact?: boolean;
}

export function PrefillPanel({ compact = false }: PrefillPanelProps) {
  const document = useCVStore((state) => state.document);
  const applyPrefill = useCVStore((state) => state.applyPrefill);

  const [jobOffer, setJobOffer] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [proposal, setProposal] = useState<PrefillProposal | null>(null);

  const runPrefill = async () => {
    setError(null);
    setLoading(true);
    setProposal(null);

    try {
      const response = await fetch('/api/ai/prefill', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ document, jobOffer }),
      });

      const data = (await response.json()) as {
        proposal?: PrefillProposal;
        error?: string | Record<string, string[]>;
        message?: string;
      };

      if (!response.ok) {
        const errMsg =
          typeof data.error === 'string'
            ? data.error
            : 'Impossible d’analyser l’offre. Vérifiez le texte collé.';
        throw new Error(errMsg);
      }

      if (data.proposal) setProposal(data.proposal);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inattendue');
    } finally {
      setLoading(false);
    }
  };

  const acceptProposal = () => {
    if (!proposal) return;
    applyPrefill({
      jobTitle: proposal.jobTitle.after,
      summary: proposal.summary.after,
      experiences: proposal.experiences.map((item) => ({
        sectionId: item.sectionId,
        entryId: item.entryId,
        title: item.title.after,
        description: item.description.after,
      })),
    });
    setProposal(null);
    setJobOffer('');
  };

  return (
    <div className={compact ? 'space-y-3' : 'space-y-4'}>
      <p className="text-xs leading-relaxed text-cvforge-muted">
        Collez une offre d&apos;emploi : l&apos;IA adapte le titre, l&apos;accroche et les
        descriptions d&apos;expérience aux mots-clés détectés.
      </p>

      <label className="block">
        <span className="mb-1 block text-xs font-medium text-cvforge-text">Offre d&apos;emploi</span>
        <textarea
          value={jobOffer}
          onChange={(event) => setJobOffer(event.target.value)}
          rows={compact ? 5 : 7}
          placeholder="Collez ici le texte complet de l'annonce…"
          className="w-full resize-y rounded-lg border border-cvforge-border bg-cvforge-raised px-3 py-2 text-sm text-cvforge-text placeholder:text-cvforge-muted focus:outline-none focus:ring-2 focus:ring-cvforge-accent-blue"
        />
      </label>

      <Button
        variant="primary"
        size="md"
        onClick={runPrefill}
        disabled={loading || jobOffer.trim().length < 40}
        loading={loading}
        icon={<Sparkles className="h-4 w-4" aria-hidden />}
        className="w-full"
      >
        Analyser et adapter
      </Button>

      {error && (
        <p className="rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2 text-xs text-red-200">
          {error}
        </p>
      )}

      {proposal && (
        <div className="space-y-3 rounded-xl border border-cvforge-accent/40 bg-cvforge-raised/40 p-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-xs font-semibold text-cvforge-text">
              Proposition{' '}
              <span className="font-normal text-cvforge-muted">
                ({proposal.source === 'anthropic' ? 'Claude' : 'analyse locale'})
              </span>
            </p>
            {proposal.matchedKeywords.length > 0 && (
              <p className="text-[0.65rem] text-cvforge-muted">
                Mots-clés : {proposal.matchedKeywords.slice(0, 6).join(', ')}
              </p>
            )}
          </div>

          <DiffBlock
            label="Titre / poste"
            before={proposal.jobTitle.before}
            after={proposal.jobTitle.after}
          />
          <DiffBlock
            label="Accroche"
            before={proposal.summary.before}
            after={proposal.summary.after}
          />

          {proposal.experiences.map((item) => (
            <DiffBlock
              key={item.entryId}
              label={`Expérience : ${item.title.before || 'Sans titre'}`}
              before={item.description.before}
              after={item.description.after}
            />
          ))}

          <div className="flex flex-wrap gap-2 pt-1">
            <Button variant="primary" size="sm" onClick={acceptProposal}>
              Accepter les modifications
            </Button>
            <Button variant="secondary" size="sm" onClick={() => setProposal(null)}>
              Ignorer
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
