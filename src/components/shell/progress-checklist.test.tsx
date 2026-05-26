import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { useCVStore } from '@/store/cv.store';
import { RightPanel } from './RightPanel';

function resetStore(): void {
  localStorage.clear();
  useCVStore.persist.clearStorage();
  useCVStore.getState().resetDocument();
}

describe('RightPanel checklist (Bloc 15)', () => {
  beforeEach(() => {
    resetStore();
  });

  afterEach(() => {
    cleanup();
  });

  it('affiche le score intelligent et les catégories', () => {
    render(<RightPanel />);

    expect(screen.getByText('Progression intelligente')).toBeTruthy();
    expect(screen.getByRole('heading', { name: 'Complétude' })).toBeTruthy();
    expect(screen.getByRole('heading', { name: 'Qualité' })).toBeTruthy();
    expect(screen.getByRole('heading', { name: 'Optimisation ATS' })).toBeTruthy();
    expect(screen.getByRole('progressbar', { name: 'Score global du CV' })).toBeTruthy();
  });
});
