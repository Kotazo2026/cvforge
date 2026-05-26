'use client';

import type { RefObject } from 'react';
import { useEffect, useState } from 'react';
import { FileText, FilePlus } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import { Divider } from '@/components/ui/Divider';
import { useCVStore } from '@/store/cv.store';
import { cn } from '@/utils/cv.utils';
import { ColorPicker } from './ColorPicker';
import { ExportButton } from './ExportButton';
import { TemplateSelector } from './TemplateSelector';

interface ToolbarProps {
  previewRef: RefObject<HTMLDivElement | null>;
}

const FONT_SIZES = [
  { id: 'small' as const, label: 'S' },
  { id: 'medium' as const, label: 'M' },
  { id: 'large' as const, label: 'L' },
];

export function Toolbar({ previewRef }: ToolbarProps) {
  const title = useCVStore((state) => state.document.title);
  const fontSize = useCVStore((state) => state.document.fontSize);
  const setDocumentTitle = useCVStore((state) => state.setDocumentTitle);
  const setFontSize = useCVStore((state) => state.setFontSize);
  const resetDocument = useCVStore((state) => state.resetDocument);

  const [editingTitle, setEditingTitle] = useState(false);
  const [titleDraft, setTitleDraft] = useState(title);
  const [newCvModalOpen, setNewCvModalOpen] = useState(false);

  useEffect(() => {
    setTitleDraft(title);
  }, [title]);

  const commitTitle = () => {
    setEditingTitle(false);
    const next = titleDraft.trim() || 'Mon CV';
    setTitleDraft(next);
    setDocumentTitle(next);
  };

  const handleNewCv = () => {
    resetDocument();
    setNewCvModalOpen(false);
  };

  return (
    <>
      <header
        className="flex h-[60px] shrink-0 items-center gap-2 overflow-x-auto border-b border-slate-200 bg-white px-3 shadow-sm sm:gap-3 sm:px-4"
        role="banner"
      >
        <div className="flex shrink-0 items-center gap-2">
          <div
            className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#2563EB] text-white"
            aria-hidden
          >
            <FileText className="h-5 w-5" />
          </div>
          <span className="hidden text-sm font-bold tracking-tight text-slate-900 sm:inline">
            CVForge
          </span>
        </div>

        <Divider orientation="vertical" className="hidden h-8 sm:block" />

        <div className="min-w-0 shrink">
          {editingTitle ? (
            <input
              type="text"
              value={titleDraft}
              autoFocus
              onChange={(event) => setTitleDraft(event.target.value)}
              onBlur={commitTitle}
              onKeyDown={(event) => {
                if (event.key === 'Enter') commitTitle();
                if (event.key === 'Escape') {
                  setTitleDraft(title);
                  setEditingTitle(false);
                }
              }}
              className="w-28 max-w-[10rem] rounded border border-blue-300 px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 sm:w-40 sm:max-w-[12rem]"
              aria-label="Nom du CV"
            />
          ) : (
            <button
              type="button"
              onClick={() => {
                setTitleDraft(title);
                setEditingTitle(true);
              }}
              className="max-w-[10rem] truncate rounded px-2 py-1 text-sm font-medium text-slate-700 hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 sm:max-w-[12rem]"
              title="Cliquer pour renommer"
            >
              {title || 'Mon CV'}
            </button>
          )}
        </div>

        <Divider orientation="vertical" className="hidden h-8 md:block" />

        <div className="hidden min-w-0 flex-1 items-center justify-center overflow-x-auto md:flex">
          <TemplateSelector />
        </div>

        <Divider orientation="vertical" className="hidden h-8 lg:block" />

        <div className="hidden items-center lg:flex">
          <ColorPicker />
        </div>

        <Divider orientation="vertical" className="hidden h-8 xl:block" />

        <div
          className="hidden items-center gap-1 rounded-lg border border-slate-200 p-0.5 xl:flex"
          role="group"
          aria-label="Taille de police"
        >
          {FONT_SIZES.map((size) => (
            <button
              key={size.id}
              type="button"
              aria-pressed={fontSize === size.id}
              aria-label={`Taille ${size.label}`}
              onClick={() => setFontSize(size.id)}
              className={cn(
                'h-7 w-7 rounded text-xs font-semibold transition-colors',
                'focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500',
                fontSize === size.id
                  ? 'bg-[#2563EB] text-white'
                  : 'text-slate-600 hover:bg-slate-100',
              )}
            >
              {size.label}
            </button>
          ))}
        </div>

        <div className="ml-auto flex shrink-0 items-center gap-1.5 sm:gap-2">
          <Button
            variant="ghost"
            size="sm"
            icon={<FilePlus className="h-4 w-4" aria-hidden />}
            onClick={() => setNewCvModalOpen(true)}
            className="text-slate-700"
            aria-label="Nouveau CV"
          >
            <span className="hidden sm:inline">Nouveau CV</span>
          </Button>
          <ExportButton previewRef={previewRef} />
        </div>
      </header>

      <ConfirmModal
        open={newCvModalOpen}
        title="Créer un nouveau CV ?"
        message="Votre CV actuel sera remplacé par un modèle vierge. Cette action est irréversible si vous n'avez pas exporté votre travail."
        confirmLabel="Nouveau CV"
        cancelLabel="Annuler"
        variant="danger"
        onConfirm={handleNewCv}
        onCancel={() => setNewCvModalOpen(false)}
      />
    </>
  );
}
