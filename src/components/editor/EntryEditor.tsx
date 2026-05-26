'use client';

import { useState } from 'react';
import type { CVEntry, CVSection, SectionType } from '@/types/cv.types';
import { FieldAiHint } from '@/components/ai/FieldAiHint';
import { entryFieldKey } from '@/lib/ai/field-keys';
import { useCVStore } from '@/store/cv.store';
import { useEditorUIStore } from '@/store/editor-ui.store';
import { DateField } from './fields/DateField';
import { TagField } from './fields/TagField';
import { TextField } from './fields/TextField';
import { TextareaField } from './fields/TextareaField';

interface EntryEditorProps {
  section: CVSection;
  entry: CVEntry;
}

export function EntryEditor({ section, entry }: EntryEditorProps) {
  const updateEntry = useCVStore((state) => state.updateEntry);
  const fieldHints = useEditorUIStore((state) => state.fieldHints);
  const grammarIssues = useEditorUIStore((state) => state.grammarIssues);
  const [tagDraft, setTagDraft] = useState('');

  const descriptionKey = entryFieldKey(section.id, entry.id, 'description');
  const descriptionHint = fieldHints[descriptionKey];
  const descriptionGrammar = grammarIssues.find((issue) => issue.fieldKey === descriptionKey);

  const patch = (data: Partial<CVEntry>) => {
    updateEntry(section.id, entry.id, data);
  };

  return (
    <div className="flex flex-col gap-3 border-t border-slate-100 pt-3">
      {renderFields(section.type, entry, patch, tagDraft, setTagDraft, {
        descriptionKey,
        descriptionHint,
        descriptionGrammar,
      })}
    </div>
  );
}

interface FieldMeta {
  descriptionKey: string;
  descriptionHint?: string;
  descriptionGrammar?: { suggestion: string; message: string };
}

function renderFields(
  type: SectionType,
  entry: CVEntry,
  patch: (data: Partial<CVEntry>) => void,
  tagDraft: string,
  setTagDraft: (value: string) => void,
  meta: FieldMeta,
) {
  const descriptionExtras = (
    <>
      {meta.descriptionHint && <FieldAiHint message={meta.descriptionHint} />}
    </>
  );

  const descriptionField = (minRows: number, maxLength?: number, showCharCount?: boolean) => (
    <>
      <TextareaField
        label="Description"
        value={entry.description ?? ''}
        onChange={(description) => patch({ description })}
        minRows={minRows}
        maxLength={maxLength}
        showCharCount={showCharCount}
        grammarHighlight={Boolean(meta.descriptionGrammar)}
        grammarTitle={
          meta.descriptionGrammar
            ? `${meta.descriptionGrammar.message} → ${meta.descriptionGrammar.suggestion}`
            : undefined
        }
      />
      {descriptionExtras}
    </>
  );
  switch (type) {
    case 'experience':
    case 'education':
      return (
        <>
          <TextField
            label="Intitulé"
            value={entry.title}
            onChange={(title) => patch({ title })}
          />
          <TextField
            label={type === 'education' ? 'Établissement' : 'Entreprise'}
            value={entry.subtitle ?? ''}
            onChange={(subtitle) => patch({ subtitle })}
          />
          <TextField
            label="Lieu"
            value={entry.location ?? ''}
            onChange={(location) => patch({ location })}
          />
          <DateField
            startDate={entry.startDate ?? ''}
            endDate={entry.endDate ?? ''}
            current={entry.current ?? false}
            onChange={(startDate, endDate, current) =>
              patch({ startDate, endDate, current })
            }
          />
          {descriptionField(3)}
        </>
      );

    case 'skills':
      return (
        <TagField
          tags={entry.tags ?? (entry.title ? [entry.title] : [])}
          onTagsChange={(tags) => patch({ tags, title: tags[0] ?? '' })}
          inputValue={tagDraft}
          onInputChange={setTagDraft}
          showLevel
          level={entry.level ?? 3}
          onLevelChange={(level) => patch({ level })}
        />
      );

    case 'languages':
      return (
        <>
          <TextField
            label="Langue"
            value={entry.title}
            onChange={(title) => patch({ title })}
          />
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between text-xs text-slate-600">
              <span>Niveau</span>
              <span className="font-medium text-slate-800">{entry.level ?? 3}/5</span>
            </div>
            <input
              type="range"
              min={1}
              max={5}
              step={1}
              value={entry.level ?? 3}
              onChange={(event) => patch({ level: Number(event.target.value) })}
              className="h-2 w-full cursor-pointer accent-[#2563EB] focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              aria-label="Niveau de langue"
            />
          </div>
        </>
      );

    case 'certifications':
      return (
        <>
          <TextField
            label="Certification"
            value={entry.title}
            onChange={(title) => patch({ title })}
          />
          <TextField
            label="Organisme"
            value={entry.subtitle ?? ''}
            onChange={(subtitle) => patch({ subtitle })}
          />
          <DateField
            startDate={entry.startDate ?? ''}
            endDate={entry.endDate ?? ''}
            current={false}
            onChange={(startDate, endDate) => patch({ startDate, endDate })}
          />
        </>
      );

    case 'projects':
      return (
        <>
          <TextField
            label="Projet"
            value={entry.title}
            onChange={(title) => patch({ title })}
          />
          <TextField
            label="Organisation / client"
            value={entry.subtitle ?? ''}
            onChange={(subtitle) => patch({ subtitle })}
          />
          <TextField
            label="URL"
            value={entry.location ?? ''}
            onChange={(location) => patch({ location })}
            type="url"
          />
          {descriptionField(3)}
        </>
      );

    case 'references':
      return (
        <>
          <TextField
            label="Nom"
            value={entry.title}
            onChange={(title) => patch({ title })}
          />
          <TextField
            label="Fonction / entreprise"
            value={entry.subtitle ?? ''}
            onChange={(subtitle) => patch({ subtitle })}
          />
          <TextareaField
            label="Coordonnées"
            value={entry.description ?? ''}
            onChange={(description) => patch({ description })}
            minRows={2}
          />
        </>
      );

    case 'summary':
      return (
        <>
          <TextareaField
            label="Profil"
            value={entry.description ?? entry.title}
            onChange={(description) => patch({ description, title: 'Profil' })}
            minRows={4}
            showCharCount
            maxLength={600}
            grammarHighlight={Boolean(meta.descriptionGrammar)}
            grammarTitle={
              meta.descriptionGrammar
                ? `${meta.descriptionGrammar.message} → ${meta.descriptionGrammar.suggestion}`
                : undefined
            }
          />
          {meta.descriptionHint && <FieldAiHint message={meta.descriptionHint} />}
        </>
      );

    case 'custom':
    default:
      return (
        <>
          <TextField
            label="Titre"
            value={entry.title}
            onChange={(title) => patch({ title })}
          />
          {descriptionField(3)}
        </>
      );
  }
}
