import { beforeEach, describe, expect, it } from 'vitest';
import type { CVSection } from '@/types/cv.types';
import { generateId } from '@/utils/cv.utils';
import { useCVStore } from './cv.store';

function resetStore(): void {
  localStorage.clear();
  useCVStore.persist.clearStorage();
  useCVStore.getState().resetDocument();
}

describe('useCVStore', () => {
  beforeEach(() => {
    resetStore();
  });

  it('addSection ajoute bien une section', () => {
    const countBefore = useCVStore.getState().document.sections.length;
    useCVStore.getState().addSection('summary');
    const sections = useCVStore.getState().document.sections;
    expect(sections).toHaveLength(countBefore + 1);
    const added = sections[sections.length - 1];
    expect(added.type).toBe('summary');
    expect(added.title).toBe('Profil');
    expect(added.visible).toBe(true);
    expect(added.entries).toEqual([]);
    expect(useCVStore.getState().isDirty).toBe(true);
  });

  it('removeSection échoue sur type header', () => {
    const headerSection: CVSection = {
      id: generateId(),
      type: 'header',
      title: 'Informations personnelles',
      visible: true,
      entries: [],
    };

    useCVStore.setState((state) => {
      state.document.sections.unshift(headerSection);
    });

    const countBefore = useCVStore.getState().document.sections.length;
    useCVStore.getState().removeSection(headerSection.id);
    expect(useCVStore.getState().document.sections).toHaveLength(countBefore);
  });

  it('reorderSections change bien l ordre', () => {
    const { document, reorderSections } = useCVStore.getState();
    const [first, second] = document.sections;
    reorderSections(second.id, first.id);
    const reordered = useCVStore.getState().document.sections;
    expect(reordered[0].id).toBe(second.id);
    expect(reordered[1].id).toBe(first.id);
    expect(useCVStore.getState().isDirty).toBe(true);
  });

  it('updateHeader met isDirty à true', () => {
    expect(useCVStore.getState().isDirty).toBe(false);
    useCVStore.getState().updateHeader({ firstName: 'Marie' });
    expect(useCVStore.getState().document.header.firstName).toBe('Marie');
    expect(useCVStore.getState().isDirty).toBe(true);
  });

  it('persiste le document dans localStorage', () => {
    useCVStore.getState().updateHeader({ firstName: 'Persist' });
    const raw = localStorage.getItem('cvforge_document');
    expect(raw).toBeTruthy();
    expect(raw).toContain('Persist');
  });

  it('importDocument remplace le document et réinitialise les traductions', () => {
    useCVStore.getState().setDocumentTitle('CV importé');
    const doc = structuredClone(useCVStore.getState().document);
    useCVStore.getState().importDocument(doc);
    expect(useCVStore.getState().document.title).toBe('CV importé');
    expect(useCVStore.getState().primarySnapshot).toBeNull();
    expect(useCVStore.getState().activeTranslationLang).toBeNull();
    expect(useCVStore.getState().isDirty).toBe(true);
  });

  it('resetDocument restaure le CV par défaut', () => {
    useCVStore.getState().updateHeader({ firstName: 'Temporaire' });
    useCVStore.getState().resetDocument();
    expect(useCVStore.getState().document.header.firstName).toBe('Alexandre');
    expect(useCVStore.getState().isDirty).toBe(false);
  });
});
