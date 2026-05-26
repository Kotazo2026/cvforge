'use client';

import { Button } from '@/components/ui/Button';
import type { ChatCvPatch } from '@/types/ai.types';
import { useCVStore } from '@/store/cv.store';
import { hasPatchChanges, patchToPrefillProposal } from '@/lib/ai/chat-proposal';
import { DiffBlock } from './DiffBlock';

interface ChatProposalCardProps {
  patch: ChatCvPatch;
  applied: boolean;
  onApplied: () => void;
}

export function ChatProposalCard({ patch, applied, onApplied }: ChatProposalCardProps) {
  const document = useCVStore((state) => state.document);
  const applyPrefill = useCVStore((state) => state.applyPrefill);

  if (!hasPatchChanges(document, patch)) return null;

  const proposal = patchToPrefillProposal(document, patch);

  const accept = () => {
    applyPrefill({
      jobTitle: patch.jobTitle,
      summary: patch.summary,
      experiences: patch.experiences,
    });
    onApplied();
  };

  return (
    <div className="mt-2 space-y-2 rounded-lg border border-cvforge-accent/40 bg-cvforge-bg/80 p-2">
      <p className="text-[0.65rem] font-semibold uppercase tracking-wide text-cvforge-muted">
        Modifications proposées
      </p>

      {proposal.jobTitle.before !== proposal.jobTitle.after && (
        <DiffBlock
          label="Titre"
          before={proposal.jobTitle.before}
          after={proposal.jobTitle.after}
        />
      )}
      {proposal.summary.before !== proposal.summary.after && (
        <DiffBlock
          label="Accroche"
          before={proposal.summary.before}
          after={proposal.summary.after}
        />
      )}
      {proposal.experiences.map((item) => (
        <DiffBlock
          key={item.entryId}
          label={item.title.before || 'Expérience'}
          before={item.description.before}
          after={item.description.after}
        />
      ))}

      {!applied ? (
        <div className="flex gap-2">
          <Button variant="primary" size="sm" onClick={accept}>
            Appliquer au CV
          </Button>
        </div>
      ) : (
        <p className="text-xs text-emerald-400">Modifications appliquées.</p>
      )}
    </div>
  );
}
