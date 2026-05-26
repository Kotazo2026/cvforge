'use client';

import { useCVStore } from '@/store/cv.store';
import { cn } from '@/utils/cv.utils';
import { AddSectionMenu } from './AddSectionMenu';
import { PhotoField } from './fields/PhotoField';
import { TextField } from './fields/TextField';
import { TextareaField } from './fields/TextareaField';
import { SectionList } from './SectionList';

interface CVEditorProps {
  className?: string;
}

export function CVEditor({ className }: CVEditorProps) {
  const header = useCVStore((state) => state.document.header);
  const updateHeader = useCVStore((state) => state.updateHeader);

  return (
    <aside
      className={cn(
        'flex h-full w-[400px] shrink-0 flex-col border-r border-slate-200 bg-slate-50',
        className,
      )}
      data-cvforge-chrome
    >
      <div className="flex-1 overflow-y-auto px-4 py-5">
        <section className="mb-6">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-500">
            Informations personnelles
          </h2>
          <div className="flex flex-col gap-3">
            <PhotoField
              value={header.photo}
              onChange={(photo) => updateHeader({ photo })}
            />
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
            <TextField
              label="E-mail"
              value={header.email}
              onChange={(email) => updateHeader({ email })}
              type="email"
            />
            <TextField
              label="Téléphone"
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
            <TextareaField
              label="Résumé court"
              value={header.summary ?? ''}
              onChange={(summary) => updateHeader({ summary })}
              minRows={3}
            />
          </div>
        </section>

        <section>
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-500">
            Sections du CV
          </h2>
          <SectionList />
        </section>
      </div>

      <div className="border-t border-slate-200 bg-slate-50 p-4">
        <AddSectionMenu />
      </div>
    </aside>
  );
}
