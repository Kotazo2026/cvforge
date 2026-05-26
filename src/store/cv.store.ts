import { arrayMove } from '@dnd-kit/sortable';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import type {
  CVColors,
  CVDocument,
  CVEntry,
  CVHeader,
  CVSection,
  CVStore,
  SectionType,
  TemplateId,
} from '@/types/cv.types';
import { normalizeTemplateId } from '@/config/cv-templates';
import { defaultCV, generateId } from '@/utils/cv.utils';
import { cvPersistStorage } from './cv-storage';

const SECTION_TITLES: Record<SectionType, string> = {
  header: 'Informations personnelles',
  summary: 'Profil',
  experience: 'Expériences',
  education: 'Formation',
  skills: 'Compétences',
  languages: 'Langues',
  certifications: 'Certifications',
  projects: 'Projets',
  references: 'Références',
  custom: 'Section personnalisée',
};

function touchDocument(state: { document: CVDocument; isDirty: boolean }): void {
  state.isDirty = true;
  state.document.updatedAt = new Date().toISOString();
}

function findSectionIndex(sections: CVSection[], id: string): number {
  return sections.findIndex((section) => section.id === id);
}

function createEmptyEntry(sectionType: SectionType): CVEntry {
  const base: CVEntry = { id: generateId(), title: '' };
  if (sectionType === 'skills') {
    return { ...base, tags: [], level: 3 };
  }
  if (sectionType === 'languages') {
    return { ...base, level: 3 };
  }
  return base;
}

export const useCVStore = create<CVStore>()(
  persist(
    immer((set) => ({
      document: defaultCV(),
      selectedSectionId: null,
      isDirty: false,

      updateHeader: (header: Partial<CVHeader>) =>
        set((state) => {
          Object.assign(state.document.header, header);
          touchDocument(state);
        }),

      updateSection: (id: string, data: Partial<CVSection>) =>
        set((state) => {
          const index = findSectionIndex(state.document.sections, id);
          if (index === -1) return;
          Object.assign(state.document.sections[index], data);
          touchDocument(state);
        }),

      addSection: (type: SectionType) =>
        set((state) => {
          const section: CVSection = {
            id: generateId(),
            type,
            title: SECTION_TITLES[type],
            visible: true,
            entries: [],
          };
          state.document.sections.push(section);
          touchDocument(state);
        }),

      removeSection: (id: string) =>
        set((state) => {
          const index = findSectionIndex(state.document.sections, id);
          if (index === -1) return;
          if (state.document.sections[index].type === 'header') return;
          state.document.sections.splice(index, 1);
          if (state.selectedSectionId === id) {
            state.selectedSectionId = null;
          }
          touchDocument(state);
        }),

      reorderSections: (activeId: string, overId: string) =>
        set((state) => {
          const oldIndex = findSectionIndex(state.document.sections, activeId);
          const newIndex = findSectionIndex(state.document.sections, overId);
          if (oldIndex === -1 || newIndex === -1 || oldIndex === newIndex) return;
          state.document.sections = arrayMove(state.document.sections, oldIndex, newIndex);
          touchDocument(state);
        }),

      addEntry: (sectionId: string) =>
        set((state) => {
          const section = state.document.sections.find((s) => s.id === sectionId);
          if (!section) return;
          section.entries.push(createEmptyEntry(section.type));
          touchDocument(state);
        }),

      updateEntry: (sectionId: string, entryId: string, data: Partial<CVEntry>) =>
        set((state) => {
          const section = state.document.sections.find((s) => s.id === sectionId);
          if (!section) return;
          const entry = section.entries.find((e) => e.id === entryId);
          if (!entry) return;
          Object.assign(entry, data);
          touchDocument(state);
        }),

      removeEntry: (sectionId: string, entryId: string) =>
        set((state) => {
          const section = state.document.sections.find((s) => s.id === sectionId);
          if (!section) return;
          section.entries = section.entries.filter((e) => e.id !== entryId);
          touchDocument(state);
        }),

      reorderEntries: (sectionId: string, activeId: string, overId: string) =>
        set((state) => {
          const section = state.document.sections.find((s) => s.id === sectionId);
          if (!section) return;
          const oldIndex = section.entries.findIndex((e) => e.id === activeId);
          const newIndex = section.entries.findIndex((e) => e.id === overId);
          if (oldIndex === -1 || newIndex === -1 || oldIndex === newIndex) return;
          section.entries = arrayMove(section.entries, oldIndex, newIndex);
          touchDocument(state);
        }),

      setTemplate: (id: TemplateId) =>
        set((state) => {
          state.document.templateId = id;
          touchDocument(state);
        }),

      setColors: (colors: Partial<CVColors>) =>
        set((state) => {
          Object.assign(state.document.colors, colors);
          touchDocument(state);
        }),

      setFontSize: (size: CVDocument['fontSize']) =>
        set((state) => {
          state.document.fontSize = size;
          touchDocument(state);
        }),

      setDocumentTitle: (title: string) =>
        set((state) => {
          state.document.title = title.trim() || 'Mon CV';
          touchDocument(state);
        }),

      toggleSectionVisibility: (id: string) =>
        set((state) => {
          const section = state.document.sections.find((s) => s.id === id);
          if (!section) return;
          section.visible = !section.visible;
          touchDocument(state);
        }),

      selectSection: (id: string | null) =>
        set((state) => {
          state.selectedSectionId = id;
        }),

      resetDocument: () =>
        set((state) => {
          state.document = defaultCV();
          state.selectedSectionId = null;
          state.isDirty = false;
        }),
    })),
    {
      name: 'cvforge_document',
      storage: createJSONStorage(() => cvPersistStorage),
      partialize: (state) => ({ document: state.document }),
      skipHydration: true,
      version: 2,
      migrate: (persistedState) => {
        if (!persistedState || typeof persistedState !== 'object') {
          return persistedState as { document: CVDocument };
        }
        const state = persistedState as { document?: CVDocument };
        if (state.document?.templateId) {
          state.document.templateId = normalizeTemplateId(state.document.templateId);
        }
        return state;
      },
    },
  ),
);
