import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { useCVStore } from '@/store/cv.store';
import { LayoutPanel } from './LayoutPanel';

function resetStore(): void {
  localStorage.clear();
  useCVStore.persist.clearStorage();
  useCVStore.getState().resetDocument();
}

describe('LayoutPanel', () => {
  beforeEach(() => {
    resetStore();
  });

  afterEach(() => {
    cleanup();
  });

  it('met à jour la couleur du nom', () => {
    render(<LayoutPanel />);
    const input = screen.getByLabelText('Nom');
    fireEvent.change(input, { target: { value: '#ff0000' } });
    expect(useCVStore.getState().document.layout.colors.name).toBe('#ff0000');
  });

  it('bascule le nom en majuscules', () => {
    render(<LayoutPanel />);
    fireEvent.click(screen.getByRole('switch', { name: 'Nom en majuscules' }));
    expect(useCVStore.getState().document.layout.nameUppercase).toBe(true);
  });

  it('change le format de date', () => {
    render(<LayoutPanel />);
    fireEvent.change(screen.getByDisplayValue('Par défaut'), {
      target: { value: 'mm-yyyy' },
    });
    expect(useCVStore.getState().document.layout.dateFormat).toBe('mm-yyyy');
  });
});
