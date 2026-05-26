'use client';

import type { RefObject } from 'react';
import { useEffect, useState } from 'react';
import { ChevronRight, FileText, Sparkles } from 'lucide-react';
import { ShareButton } from '@/components/share/ShareButton';
import { ExportButton } from '@/components/toolbar/ExportButton';
import { useCVStore } from '@/store/cv.store';
import { TRANSLATION_LANGUAGE_FLAGS, type TranslationTargetLanguage } from '@/types/ai.types';
import { useEditorUIStore } from '@/store/editor-ui.store';
import { cn } from '@/utils/cv.utils';

const LANGUAGE_FLAGS: Record<string, string> = {
  fr: '🇫🇷',
  en: '🇬🇧',
  es: '🇪🇸',
  de: '🇩🇪',
  it: '🇮🇹',
  pt: '🇵🇹',
};

interface TopBarProps {
  previewRef: RefObject<HTMLDivElement | null>;
}

export function TopBar({ previewRef }: TopBarProps) {
  const title = useCVStore((state) => state.document.title);
  const setDocumentTitle = useCVStore((state) => state.setDocumentTitle);
  const cvLanguage = useEditorUIStore((state) => state.cvLanguage);
  const isPremium = useEditorUIStore((state) => state.isPremium);
  const openAiModal = useEditorUIStore((state) => state.openAiModal);
  const primarySnapshot = useCVStore((state) => state.primarySnapshot);
  const activeTranslationLang = useCVStore((state) => state.activeTranslationLang);
  const translationCopies = useCVStore((state) => state.translationCopies);
  const switchToPrimaryDocument = useCVStore((state) => state.switchToPrimaryDocument);
  const switchToTranslation = useCVStore((state) => state.switchToTranslation);
  const translationLangs = Object.keys(translationCopies);

  const [editingTitle, setEditingTitle] = useState(false);
  const [titleDraft, setTitleDraft] = useState(title);

  useEffect(() => {
    setTitleDraft(title);
  }, [title]);

  const commitTitle = () => {
    setEditingTitle(false);
    const next = titleDraft.trim() || 'Mon CV';
    setTitleDraft(next);
    setDocumentTitle(next);
  };

  return (
    <header
      className="flex h-14 shrink-0 items-center gap-3 border-b border-cvforge-border bg-cvforge-surface px-3 sm:px-4"
      role="banner"
      data-cvforge-chrome
    >
      <div className="flex min-w-0 shrink-0 items-center gap-2">
        <div
          className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-cvforge-accent-blue to-cvforge-accent text-white shadow-lg"
          aria-hidden
        >
          <FileText className="h-5 w-5" />
        </div>
        <span className="hidden text-sm font-bold tracking-tight text-cvforge-text sm:inline">
          CVForge
        </span>
      </div>

      <nav
        className="hidden min-w-0 items-center gap-1 text-sm text-cvforge-muted md:flex"
        aria-label="Fil d'Ariane"
      >
        <span>Mes documents</span>
        <ChevronRight className="h-4 w-4 shrink-0" aria-hidden />
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
            className="max-w-[12rem] rounded border border-cvforge-border bg-cvforge-raised px-2 py-0.5 text-cvforge-text focus:outline-none focus:ring-2 focus:ring-cvforge-accent-blue"
            aria-label="Nom du CV"
          />
        ) : (
          <button
            type="button"
            onClick={() => {
              setTitleDraft(title);
              setEditingTitle(true);
            }}
            className="truncate font-medium text-cvforge-text hover:text-cvforge-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-cvforge-accent-blue"
          >
            {title || 'Mon CV'}
          </button>
        )}
        <span className="text-cvforge-border" aria-hidden>
          ·
        </span>
        <span title={`Langue du CV : ${cvLanguage.toUpperCase()}`} aria-label={`Langue ${cvLanguage}`}>
          {LANGUAGE_FLAGS[cvLanguage] ?? '🌐'}
        </span>
      </nav>

      <div className="flex flex-1 justify-center px-2">
        <button
          type="button"
          onClick={() => openAiModal('prefill')}
          className={cn(
            'cvforge-ai-badge hidden items-center gap-2 rounded-full border border-cvforge-accent/60 bg-cvforge-raised px-4 py-1.5 text-xs font-bold uppercase tracking-wide text-cvforge-text sm:inline-flex',
            'transition-transform hover:scale-[1.02] focus:outline-none focus-visible:ring-2 focus-visible:ring-cvforge-accent',
          )}
        >
          <Sparkles className="h-4 w-4 text-cvforge-accent" aria-hidden />
          Fonctionnalités IA
        </button>
      </div>

      <div className="ml-auto flex shrink-0 items-center gap-2 sm:gap-3">
        {(primarySnapshot || translationLangs.length > 0) && (
          <div className="hidden items-center gap-1 md:flex">
            {(primarySnapshot || activeTranslationLang) && (
              <button
                type="button"
                onClick={() => switchToPrimaryDocument()}
                className={cn(
                  'rounded-full border px-2.5 py-1 text-[0.65rem] font-semibold transition-colors',
                  !activeTranslationLang
                    ? 'border-cvforge-accent-blue bg-cvforge-accent-blue/20 text-cvforge-text'
                    : 'border-cvforge-border text-cvforge-muted hover:text-cvforge-text',
                )}
              >
                🇫🇷 Original
              </button>
            )}
            {translationLangs.map((lang) => (
              <button
                key={lang}
                type="button"
                onClick={() => switchToTranslation(lang)}
                className={cn(
                  'rounded-full border px-2.5 py-1 text-[0.65rem] font-semibold transition-colors',
                  activeTranslationLang === lang
                    ? 'border-cvforge-accent-blue bg-cvforge-accent-blue/20 text-cvforge-text'
                    : 'border-cvforge-border text-cvforge-muted hover:text-cvforge-text',
                )}
              >
                {TRANSLATION_LANGUAGE_FLAGS[lang as TranslationTargetLanguage] ?? '🌐'} Voir en{' '}
                {lang.toUpperCase()}
              </button>
            ))}
          </div>
        )}
        {!isPremium && (
          <a
            href="#premium"
            className="hidden text-xs font-semibold text-cvforge-accent hover:underline sm:inline"
            onClick={(event) => event.preventDefault()}
          >
            Passer à Premium
          </a>
        )}
        <ShareButton />
        <ExportButton previewRef={previewRef} label="Télécharger / Postuler" />
      </div>
    </header>
  );
}
