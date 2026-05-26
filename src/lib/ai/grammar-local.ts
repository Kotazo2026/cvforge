import type { CVDocument } from '@/types/cv.types';
import type { GrammarIssue, GrammarResult } from '@/types/ai.types';
import { getSummaryText } from '@/components/preview/templates/template-helpers';
import { entryFieldKey, headerFieldKey } from './field-keys';
import { generateId } from '@/utils/cv.utils';

const REPLACEMENTS: Array<{ pattern: RegExp; suggestion: string; message: string }> = [
  {
    pattern: /\bdeveloppement\b/gi,
    suggestion: 'développement',
    message: 'Accent manquant',
  },
  {
    pattern: /\bdevelopper\b/gi,
    suggestion: 'développer',
    message: 'Accent manquant',
  },
  {
    pattern: /\bapplicaton\b/gi,
    suggestion: 'application',
    message: 'Orthographe',
  },
  {
    pattern: /\bexpérience proffessionnelle\b/gi,
    suggestion: 'expérience professionnelle',
    message: 'Orthographe',
  },
  {
    pattern: /\s{2,}/g,
    suggestion: ' ',
    message: 'Espaces doubles',
  },
  {
    pattern: /\s+,/g,
    suggestion: ',',
    message: 'Espace avant une virgule',
  },
];

function scanText(
  text: string,
  fieldKey: string,
  fieldLabel: string,
  issues: GrammarIssue[],
): void {
  if (!text.trim()) return;

  for (const rule of REPLACEMENTS) {
    const match = text.match(rule.pattern);
    if (!match) continue;

    const suggestion = text.replace(rule.pattern, rule.suggestion);
    if (suggestion === text) continue;

    issues.push({
      id: generateId(),
      fieldKey,
      fieldLabel,
      original: text,
      suggestion,
      message: rule.message,
    });
    break;
  }

  const sentenceMatch = text.match(/(^|[.!?]\s+)([a-zàâäéèêëïîôùûüç])/);
  if (sentenceMatch && !issues.some((issue) => issue.fieldKey === fieldKey)) {
    const suggestion = text.replace(
      /(^|[.!?]\s+)([a-zàâäéèêëïîôùûüç])/g,
      (_, prefix: string, letter: string) => `${prefix}${letter.toUpperCase()}`,
    );
    if (suggestion !== text) {
      issues.push({
        id: generateId(),
        fieldKey,
        fieldLabel,
        original: text,
        suggestion,
        message: 'Majuscule en début de phrase',
      });
    }
  }
}

export function buildLocalGrammarCheck(document: CVDocument): GrammarResult {
  const issues: GrammarIssue[] = [];
  const { header } = document;

  scanText(header.jobTitle, headerFieldKey('jobTitle'), 'Titre du poste', issues);
  scanText(header.summary ?? '', headerFieldKey('summary'), 'Accroche', issues);
  scanText(getSummaryText(document), headerFieldKey('summary'), 'Accroche', issues);

  for (const section of document.sections) {
    if (!section.visible) continue;
    for (const entry of section.entries) {
      scanText(
        entry.title,
        entryFieldKey(section.id, entry.id, 'title'),
        `${section.title} — titre`,
        issues,
      );
      scanText(
        entry.description ?? '',
        entryFieldKey(section.id, entry.id, 'description'),
        `${section.title} — description`,
        issues,
      );
    }
  }

  const unique = new Map<string, GrammarIssue>();
  for (const issue of issues) {
    if (!unique.has(issue.fieldKey)) unique.set(issue.fieldKey, issue);
  }

  return {
    issues: [...unique.values()],
    source: 'local',
  };
}
