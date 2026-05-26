'use client';

import { useEffect, useRef, useState } from 'react';
import {
  Award,
  Briefcase,
  FileText,
  FolderKanban,
  GraduationCap,
  Languages,
  LayoutTemplate,
  Plus,
  Sparkles,
  Users,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { SectionType } from '@/types/cv.types';
import { useCVStore } from '@/store/cv.store';

interface SectionOption {
  type: SectionType;
  label: string;
  icon: LucideIcon;
}

const SECTION_OPTIONS: SectionOption[] = [
  { type: 'summary', label: 'Profil', icon: FileText },
  { type: 'experience', label: 'Expériences', icon: Briefcase },
  { type: 'education', label: 'Formation', icon: GraduationCap },
  { type: 'skills', label: 'Compétences', icon: Sparkles },
  { type: 'languages', label: 'Langues', icon: Languages },
  { type: 'certifications', label: 'Certifications', icon: Award },
  { type: 'projects', label: 'Projets', icon: FolderKanban },
  { type: 'references', label: 'Références', icon: Users },
  { type: 'custom', label: 'Section personnalisée', icon: LayoutTemplate },
];

export function AddSectionMenu() {
  const sections = useCVStore((state) => state.document.sections);
  const addSection = useCVStore((state) => state.addSection);
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const available = SECTION_OPTIONS.filter((option) => {
    if (option.type === 'custom') return true;
    return !sections.some((section) => section.type === option.type);
  });

  useEffect(() => {
    if (!open) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  const handleAdd = (type: SectionType) => {
    addSection(type);
    setOpen(false);
  };

  return (
    <div ref={containerRef} className="relative">
      {open && available.length > 0 && (
        <div
          className="absolute bottom-full left-0 right-0 z-30 mb-2 max-h-64 overflow-y-auto rounded-xl border border-slate-200 bg-white p-1 shadow-lg"
          role="menu"
        >
          {available.map((option) => {
            const Icon = option.icon;
            return (
              <button
                key={option.type}
                type="button"
                role="menuitem"
                onClick={() => handleAdd(option.type)}
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50"
              >
                <Icon className="h-4 w-4 shrink-0 text-slate-500" aria-hidden />
                {option.label}
              </button>
            );
          })}
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        disabled={available.length === 0}
        className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-slate-300 bg-white py-3 text-sm font-medium text-slate-700 transition-colors hover:border-blue-400 hover:bg-blue-50 hover:text-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <Plus className="h-4 w-4" aria-hidden />
        Ajouter une section
      </button>

      {available.length === 0 && (
        <p className="mt-2 text-center text-xs text-slate-400">
          Toutes les sections standard sont déjà ajoutées.
        </p>
      )}
    </div>
  );
}
