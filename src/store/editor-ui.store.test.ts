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
    });
  });

  it('change le panneau actif', () => {
    useEditorUIStore.getState().setActivePanel('sections');
    expect(useEditorUIStore.getState().activePanel).toBe('sections');
  });
});
