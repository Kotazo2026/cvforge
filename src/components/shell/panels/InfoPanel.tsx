'use client';

import { FieldAiHint } from '@/components/ai/FieldAiHint';
import { PhotoField } from '@/components/editor/fields/PhotoField';
import { TextField } from '@/components/editor/fields/TextField';
import { TextareaField } from '@/components/editor/fields/TextareaField';
import { headerFieldKey } from '@/lib/ai/field-keys';
import { useCVStore } from '@/store/cv.store';
import { useEditorUIStore } from '@/store/editor-ui.store';

export function InfoPanel() {
  const header = useCVStore((state) => state.document.header);
  const updateHeader = useCVStore((state) => state.updateHeader);
  const fieldHints = useEditorUIStore((state) => state.fieldHints);
  const grammarIssues = useEditorUIStore((state) => state.grammarIssues);
  const summaryKey = headerFieldKey('summary');
  const summaryHint = fieldHints[summaryKey];
  const summaryGrammar = grammarIssues.find((issue) => issue.fieldKey === summaryKey);

  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-cvforge-border px-4 py-4">
        <h2 className="text-sm font-semibold text-cvforge-text">Informations</h2>
        <p className="mt-1 text-xs text-cvforge-muted">
          Coordonnées, accroche et réseaux — visibles sur votre CV
        </p>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4">
        <div className="flex flex-col gap-3">
          <PhotoField value={header.photo} onChange={(photo) => updateHeader({ photo })} />
          <div className="grid grid-cols-2 gap-3">
            <TextField
              label="Prénom"
              value={header.firstName}
              onChange={(firstName) => updateHeader({ firstName })}
            />
            <TextField
              label="Nom"
              value={header.lastName}
              onChange={(lastName) => updateHeader({ lastName })}
            />
          </div>
          <TextField
            label="Titre du poste"
            value={header.jobTitle}
            onChange={(jobTitle) => updateHeader({ jobTitle })}
          />
          <TextareaField
            label="Accroche professionnelle"
            value={header.summary ?? ''}
            onChange={(summary) => updateHeader({ summary })}
            minRows={3}
            grammarHighlight={Boolean(summaryGrammar)}
            grammarTitle={
              summaryGrammar
                ? `${summaryGrammar.message} → ${summaryGrammar.suggestion}`
                : undefined
            }
          />
          {summaryHint && <FieldAiHint message={summaryHint} />}
          <TextField
            label="E-mail"
            value={header.email}
            onChange={(email) => updateHeader({ email })}
            type="email"
          />
          <TextField
            label="Mobile"
            value={header.phone}
            onChange={(phone) => updateHeader({ phone })}
            type="tel"
          />
          <TextField
            label="Ville"
            value={header.location}
            onChange={(location) => updateHeader({ location })}
          />
          <TextField
            label="Mobilité"
            value={header.mobility ?? ''}
            onChange={(mobility) => updateHeader({ mobility })}
            placeholder="Ex. France entière, télétravail…"
          />
          <TextField
            label="Permis"
            value={header.drivingLicense ?? ''}
            onChange={(drivingLicense) => updateHeader({ drivingLicense })}
            placeholder="Ex. Permis B"
          />
          <TextField
            label="Site web"
            value={header.website ?? ''}
            onChange={(website) => updateHeader({ website })}
            type="url"
          />
          <TextField
            label="LinkedIn"
            value={header.linkedin ?? ''}
            onChange={(linkedin) => updateHeader({ linkedin })}
          />
        </div>
      </div>
    </div>
  );
}
