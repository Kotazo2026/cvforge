import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { useCVStore } from '@/store/cv.store';
import { useEditorUIStore } from '@/store/editor-ui.store';
import { CenterPreview } from '@/components/shell/CenterPreview';
import { LinkedInPreview } from './LinkedInPreview';
import { MobilePreview } from './MobilePreview';
import { createRef } from 'react';

function resetStores(): void {
  localStorage.clear();
  useCVStore.persist.clearStorage();
  useCVStore.getState().resetDocument();
  useEditorUIStore.setState({ previewView: 'cv' });
}

describe('Format previews (Bloc 14)', () => {
  beforeEach(() => {
    resetStores();
  });

  afterEach(() => {
    cleanup();
  });

  it('MobilePreview affiche le nom du candidat', () => {
    render(<MobilePreview />);
    expect(screen.getByRole('heading', { level: 1, name: /Alexandre Martin/i })).toBeTruthy();
    expect(screen.getByRole('img', { name: /Aperçu mobile du CV/i })).toBeTruthy();
  });

  it('LinkedInPreview affiche les sections principales', () => {
    render(<LinkedInPreview />);
    expect(screen.getByRole('heading', { level: 1, name: /Alexandre Martin/i })).toBeTruthy();
    expect(screen.getByRole('heading', { name: 'À propos' })).toBeTruthy();
    expect(screen.getByRole('heading', { name: 'Expérience' })).toBeTruthy();
  });

  it('CenterPreview bascule entre les trois vues', async () => {
    const previewRef = createRef<HTMLDivElement>();
    render(<CenterPreview previewRef={previewRef} />);

    fireEvent.click(screen.getByRole('tab', { name: 'Vue Mobile' }));
    expect(useEditorUIStore.getState().previewView).toBe('mobile');
    await waitFor(() => {
      expect(screen.getByLabelText(/Aperçu mobile du CV/i)).toBeTruthy();
    });

    fireEvent.click(screen.getByRole('tab', { name: 'Vue LinkedIn' }));
    expect(useEditorUIStore.getState().previewView).toBe('linkedin');
    await waitFor(() => {
      expect(screen.getByLabelText(/Simulation de profil LinkedIn/i)).toBeTruthy();
    });

    fireEvent.click(screen.getByRole('tab', { name: 'Vue CV' }));
    expect(useEditorUIStore.getState().previewView).toBe('cv');
    expect(screen.getByRole('slider', { name: /zoom/i })).toBeTruthy();
  });

  it('garde le wrapper print monté pour l’export en vue mobile', () => {
    const previewRef = createRef<HTMLDivElement>();
    const { container } = render(<CenterPreview previewRef={previewRef} />);

    fireEvent.click(screen.getByRole('tab', { name: 'Vue Mobile' }));
    expect(container.querySelector('.cv-template-print-wrapper')).toBeTruthy();
    expect(previewRef.current).toBeTruthy();
  });
});
