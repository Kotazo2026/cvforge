import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useCVStore } from '@/store/cv.store';
import { Toolbar } from './Toolbar';

function resetStore(): void {
  localStorage.clear();
  useCVStore.persist.clearStorage();
  useCVStore.getState().resetDocument();
}

describe('Toolbar', () => {
  beforeEach(() => {
    resetStore();
  });

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it('change le template via TemplateSelector', () => {
    const previewRef = createRef<HTMLDivElement>();
    render(<Toolbar previewRef={previewRef} />);

    fireEvent.click(screen.getByRole('radio', { name: 'Modèle Modern' }));
    expect(useCVStore.getState().document.templateId).toBe('modern');
  });

  it('applique une palette de couleurs', () => {
    const previewRef = createRef<HTMLDivElement>();
    render(<Toolbar previewRef={previewRef} />);

    fireEvent.click(screen.getByRole('button', { name: 'Palette Vert' }));
    expect(useCVStore.getState().document.colors.primary).toBe('#059669');
  });

  it('bascule la taille de police', () => {
    const previewRef = createRef<HTMLDivElement>();
    render(<Toolbar previewRef={previewRef} />);

    fireEvent.click(screen.getByRole('button', { name: 'Taille L' }));
    expect(useCVStore.getState().document.fontSize).toBe('large');
  });
});
