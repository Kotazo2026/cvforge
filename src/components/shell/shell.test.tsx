import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useCVStore } from '@/store/cv.store';
import { useEditorUIStore } from '@/store/editor-ui.store';
import { EditorShell } from './EditorShell';
import { LayoutPanel } from './panels/LayoutPanel';
import { TemplatesPanel } from './panels/TemplatesPanel';

function resetStores(): void {
  localStorage.clear();
  useCVStore.persist.clearStorage();
  useCVStore.getState().resetDocument();
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
}

describe('Editor shell v2', () => {
  beforeEach(() => {
    resetStores();
    vi.stubGlobal(
      'matchMedia',
      vi.fn().mockImplementation((query: string) => ({
        matches: query.includes('min-width'),
        media: query,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      })),
    );
  });

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it('affiche la barre supérieure et le fil d’Ariane', () => {
    const previewRef = createRef<HTMLDivElement>();
    render(<EditorShell previewRef={previewRef} />);

    expect(screen.getByText('CVForge')).toBeTruthy();
    expect(screen.getByText('Mes documents')).toBeTruthy();
    expect(screen.getByRole('button', { name: /Fonctionnalités IA/i })).toBeTruthy();
  });

  it('change de panneau latéral', () => {
    const previewRef = createRef<HTMLDivElement>();
    render(<EditorShell previewRef={previewRef} />);

    fireEvent.click(screen.getByRole('button', { name: 'Informations' }));
    expect(useEditorUIStore.getState().activePanel).toBe('info');
    expect(screen.getByRole('heading', { name: 'Informations' })).toBeTruthy();
  });

  it('TemplatesPanel change le modèle', () => {
    render(<TemplatesPanel />);
    fireEvent.click(screen.getByRole('radio', { name: 'Modèle Modern' }));
    expect(useCVStore.getState().document.templateId).toBe('modern');
  });

  it('LayoutPanel applique une palette', () => {
    render(<LayoutPanel />);
    fireEvent.click(screen.getByRole('button', { name: 'Palette Vert' }));
    expect(useCVStore.getState().document.colors.primary).toBe('#059669');
  });

  it('affiche le panneau de progression intelligente sur grand écran', () => {
    const previewRef = createRef<HTMLDivElement>();
    render(<EditorShell previewRef={previewRef} />);
    expect(screen.getByLabelText('Progression du CV')).toBeTruthy();
    expect(screen.getByText('Progression intelligente')).toBeTruthy();
  });

  it('affiche le bouton flottant de l’assistant IA', () => {
    const previewRef = createRef<HTMLDivElement>();
    render(<EditorShell previewRef={previewRef} />);
    expect(screen.getByRole('button', { name: /assistant IA/i })).toBeTruthy();
  });

  it('affiche le bouton Partager dans la barre supérieure', () => {
    const previewRef = createRef<HTMLDivElement>();
    render(<EditorShell previewRef={previewRef} />);
    expect(screen.getByRole('button', { name: 'Partager' })).toBeTruthy();
  });

  it('ouvre la modale IA depuis la barre supérieure', () => {
    const previewRef = createRef<HTMLDivElement>();
    render(<EditorShell previewRef={previewRef} />);

    fireEvent.click(screen.getByRole('button', { name: /Fonctionnalités IA/i }));
    expect(useEditorUIStore.getState().aiModalOpen).toBe(true);
    expect(screen.getByRole('dialog', { name: /Fonctionnalités IA/i })).toBeTruthy();
  });

  it('affiche les onglets multi-format actifs', () => {
    const previewRef = createRef<HTMLDivElement>();
    render(<EditorShell previewRef={previewRef} />);

    const mobileTab = screen.getByRole('tab', { name: 'Vue Mobile' });
    expect(mobileTab.hasAttribute('disabled')).toBe(false);
    fireEvent.click(mobileTab);
    expect(useEditorUIStore.getState().previewView).toBe('mobile');
  });
});
