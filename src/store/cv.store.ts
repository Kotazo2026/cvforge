import { arrayMove } from '@dnd-kit/sortable';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import type { ApplyPrefillInput } from '@/types/ai.types';
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
import { createDefaultLayout, mergeLayoutPatch } from '@/utils/cv-layout.utils';
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
          if (!state.document.layout) {
            state.document.layout = createDefaultLayout(state.document.colors);
          }
          if (colors.primary) {
            state.document.layout.colors.skillBar = colors.primary;
            state.document.layout.colors.sidebarBackground = colors.primary;
            state.document.layout.colors.sectionTitleMain = colors.primary;
            state.document.layout.colors.jobTitle = colors.primary;
          }
          if (colors.text) {
            state.document.layout.colors.name = colors.text;
            state.document.layout.colors.organization = colors.text;
          }
          touchDocument(state);
        }),

      setLayout: (layout) =>
        set((state) => {
          if (!state.document.layout) {
            state.document.layout = createDefaultLayout(state.document.colors);
          }
          mergeLayoutPatch(state.document.layout, layout);
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

      applyPrefill: (input: ApplyPrefillInput) =>
        set((state) => {
          if (input.jobTitle !== undefined) {
            state.document.header.jobTitle = input.jobTitle;
          }
          if (input.summary !== undefined) {
            state.document.header.summary = input.summary;
            const summarySection = state.document.sections.find(
              (section) => section.type === 'summary',
            );
            if (summarySection) {
              if (summarySection.entries.length === 0) {
                summarySection.entries.push({
                  id: generateId(),
                  title: 'Profil',
                  description: input.summary,
                });
              } else {
                summarySection.entries[0].description = input.summary;
              }
            }
          }
          if (input.experiences) {
            for (const patch of input.experiences) {
              const section = state.document.sections.find((s) => s.id === patch.sectionId);
              const entry = section?.entries.find((e) => e.id === patch.entryId);
              if (!entry) continue;
              if (patch.title !== undefined) entry.title = patch.title;
              if (patch.description !== undefined) entry.description = patch.description;
            }
          }
          touchDocument(state);
        }),
    })),
    {
      name: 'cvforge_document',
      storage: createJSONStorage(() => cvPersistStorage),
      partialize: (state) => ({ document: state.document }),
      skipHydration: true,
      version: 3,
      merge: (persistedState, currentState) => {
        const persisted = persistedState as { document?: CVDocument } | undefined;
        const merged = {
          ...currentState,
          ...persisted,
        };
        if (merged.document) {
          merged.document = {
            ...merged.document,
            templateId: normalizeTemplateId(merged.document.templateId),
          };
          if (!merged.document.layout) {
            merged.document.layout = createDefaultLayout(merged.document.colors);
          }
        }
        return merged;
      },
      migrate: (persistedState) => {
        try {
          if (!persistedState || typeof persistedState !== 'object') {
            return { document: defaultCV() };
          }
          const state = persistedState as { document?: CVDocument };
          if (state.document?.templateId) {
            state.document.templateId = normalizeTemplateId(state.document.templateId);
          }
          if (state.document && !state.document.layout) {
            state.document.layout = createDefaultLayout(state.document.colors);
          }
          return state;
        } catch {
          return { document: defaultCV() };
        }
      },
    },
  ),
);
