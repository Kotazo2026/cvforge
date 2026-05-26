import { create } from 'zustand';
import type { CVDocumentLanguage, EditorSidebarPanel, PreviewViewMode } from '@/types/cv.types';

export interface EditorUIStore {
  activePanel: EditorSidebarPanel;
  sidebarCollapsed: boolean;
  mobileNavOpen: boolean;
  cvLanguage: CVDocumentLanguage;
  isPremium: boolean;
  previewView: PreviewViewMode;
  setActivePanel: (panel: EditorSidebarPanel) => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  setMobileNavOpen: (open: boolean) => void;
  setCvLanguage: (language: CVDocumentLanguage) => void;
  setPreviewView: (view: PreviewViewMode) => void;
}

export const useEditorUIStore = create<EditorUIStore>((set) => ({
  activePanel: 'templates',
  sidebarCollapsed: false,
  mobileNavOpen: false,
  cvLanguage: 'fr',
  isPremium: false,
  previewView: 'cv',
  setActivePanel: (panel) => set({ activePanel: panel }),
  setSidebarCollapsed: (sidebarCollapsed) => set({ sidebarCollapsed }),
  setMobileNavOpen: (mobileNavOpen) => set({ mobileNavOpen }),
  setCvLanguage: (cvLanguage) => set({ cvLanguage }),
  setPreviewView: (previewView) => set({ previewView }),
}));
