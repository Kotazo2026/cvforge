import { create } from 'zustand';
import type { CVDocumentLanguage, EditorSidebarPanel, PreviewViewMode } from '@/types/cv.types';

export type AiModalTab = 'prefill' | 'ats';

export interface EditorUIStore {
  activePanel: EditorSidebarPanel;
  sidebarCollapsed: boolean;
  mobileNavOpen: boolean;
  cvLanguage: CVDocumentLanguage;
  isPremium: boolean;
  previewView: PreviewViewMode;
  aiModalOpen: boolean;
  aiModalTab: AiModalTab;
  setActivePanel: (panel: EditorSidebarPanel) => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  setMobileNavOpen: (open: boolean) => void;
  setCvLanguage: (language: CVDocumentLanguage) => void;
  setPreviewView: (view: PreviewViewMode) => void;
  openAiModal: (tab?: AiModalTab) => void;
  closeAiModal: () => void;
  setAiModalTab: (tab: AiModalTab) => void;
}

export const useEditorUIStore = create<EditorUIStore>((set) => ({
  activePanel: 'templates',
  sidebarCollapsed: false,
  mobileNavOpen: false,
  cvLanguage: 'fr',
  isPremium: false,
  previewView: 'cv',
  aiModalOpen: false,
  aiModalTab: 'prefill',
  setActivePanel: (panel) => set({ activePanel: panel }),
  setSidebarCollapsed: (sidebarCollapsed) => set({ sidebarCollapsed }),
  setMobileNavOpen: (mobileNavOpen) => set({ mobileNavOpen }),
  setCvLanguage: (cvLanguage) => set({ cvLanguage }),
  setPreviewView: (previewView) => set({ previewView }),
  openAiModal: (tab = 'prefill') =>
    set({ aiModalOpen: true, aiModalTab: tab, activePanel: 'ai' }),
  closeAiModal: () => set({ aiModalOpen: false }),
  setAiModalTab: (aiModalTab) => set({ aiModalTab }),
}));
