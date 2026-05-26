import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { LayoutPanel } from '@/components/shell/panels/LayoutPanel';
import { TemplatesPanel } from '@/components/shell/panels/TemplatesPanel';
import { useCVStore } from '@/store/cv.store';

function resetStore(): void {
  localStorage.clear();
  useCVStore.persist.clearStorage();
  useCVStore.getState().resetDocument();
}

describe('Toolbar panels (v2)', () => {
  beforeEach(() => {
    resetStore();
  });

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it('change le template via TemplatesPanel', () => {
    render(<TemplatesPanel />);
    fireEvent.click(screen.getByRole('radio', { name: 'Modèle Modern' }));
    expect(useCVStore.getState().document.templateId).toBe('modern');
  });

  it('applique une palette de couleurs via LayoutPanel', () => {
    render(<LayoutPanel />);
    fireEvent.click(screen.getByRole('button', { name: 'Palette Vert' }));
    expect(useCVStore.getState().document.colors.primary).toBe('#059669');
  });

  it('bascule la taille de police via LayoutPanel', () => {
    render(<LayoutPanel />);
    fireEvent.click(screen.getByRole('button', { name: 'Taille L' }));
    expect(useCVStore.getState().document.fontSize).toBe('large');
  });

  it('ExportButton reste utilisable', async () => {
    const { ExportButton } = await import('./ExportButton');
    const previewRef = createRef<HTMLDivElement>();
    render(<ExportButton previewRef={previewRef} label="Télécharger / Postuler" />);
    expect(screen.getByRole('button', { name: /Télécharger/i })).toBeTruthy();
  });
});
