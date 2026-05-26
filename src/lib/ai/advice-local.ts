import type { CVDocument } from '@/types/cv.types';
import type { AdviceResult, AdviceTip, EntryReformulation } from '@/types/ai.types';
import { getSummaryText } from '@/components/preview/templates/template-helpers';
import { buildCvProgressChecklist } from '@/utils/cv-progress';
import { entryFieldKey, headerFieldKey } from './field-keys';

const WEAK_DESCRIPTION_MAX = 80;

function suggestDescription(description: string): string {
  const trimmed = description.trim();
  if (!trimmed) {
    return 'Décrivez vos missions, outils utilisés et résultats mesurables (chiffres, %).';
  }
  if (trimmed.length < WEAK_DESCRIPTION_MAX) {
    return `${trimmed} — Précisez l’impact (KPI, volume, délais) et les technologies mobilisées.`;
  }
  return trimmed;
}

export function buildLocalAdvice(document: CVDocument): AdviceResult {
  const tips: AdviceTip[] = [];
  const reformulations: EntryReformulation[] = [];
  const summary = getSummaryText(document);

  if (summary.trim().length < 50) {
    tips.push({
      id: 'summary-short',
      message:
        'Votre accroche est courte : ajoutez 2–3 phrases sur votre expertise et la valeur que vous apportez.',
    });
  }

  if (!document.header.photo) {
    tips.push({
      id: 'photo',
      message: 'Une photo professionnelle augmente la mémorisation du profil sur les vues recruteur.',
    });
  }

  const checklist = buildCvProgressChecklist(document);
  const pending = checklist.filter((item) => !item.completed).slice(0, 2);
  for (const item of pending) {
    tips.push({
      id: `check-${item.id}`,
      message: item.hint ?? `Complétez : ${item.label}.`,
    });
  }

  if (tips.length < 3) {
    tips.push({
      id: 'tone',
      message:
        'Privilégiez des verbes d’action au présent ou passé composé (« piloté », « livré », « optimisé »).',
    });
  }

  for (const section of document.sections) {
    if (!section.visible) continue;
    if (section.type !== 'experience' && section.type !== 'projects') continue;

    for (const entry of section.entries) {
      const description = entry.description ?? '';
      if (description.trim().length >= 150) continue;

      const after = suggestDescription(description);
      if (after === description.trim()) continue;

      reformulations.push({
        fieldKey: entryFieldKey(section.id, entry.id, 'description'),
        label: `${section.title} — ${entry.title || 'Entrée'}`,
        before: description,
        after,
      });
    }
  }

  const summaryAfter = suggestDescription(summary);
  if (summary.trim() && summaryAfter !== summary.trim() && summary.trim().length < 120) {
    reformulations.push({
      fieldKey: headerFieldKey('summary'),
      label: 'Accroche professionnelle',
      before: summary,
      after: summaryAfter,
    });
  }

  return {
    tips: tips.slice(0, 5),
    reformulations,
    source: 'local',
  };
}
