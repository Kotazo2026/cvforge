import { beforeEach, describe, expect, it } from 'vitest';
import { useEditorUIStore } from './editor-ui.store';

describe('useEditorUIStore', () => {
  beforeEach(() => {
    useEditorUIStore.setState({
      activePanel: 'templates',
      sidebarCollapsed: false,
      mobileNavOpen: false,
      cvLanguage: 'fr',
      isPremium: false,
      previewView: 'cv',
      aiModalOpen: false,
      aiModalTab: 'prefill',
      fieldHints: {},
      grammarIssues: [],
    });
  });

  it('change le panneau actif', () => {
    useEditorUIStore.getState().setActivePanel('sections');
    expect(useEditorUIStore.getState().activePanel).toBe('sections');
  });

  it('ouvre la modale IA sur le bon onglet', () => {
    useEditorUIStore.getState().openAiModal('ats');
    expect(useEditorUIStore.getState().aiModalOpen).toBe(true);
    expect(useEditorUIStore.getState().aiModalTab).toBe('ats');
    expect(useEditorUIStore.getState().activePanel).toBe('ai');
  });
});
