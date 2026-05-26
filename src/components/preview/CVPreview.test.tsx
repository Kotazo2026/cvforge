import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { useCVStore } from '@/store/cv.store';
import { DEFAULT_PREVIEW_ZOOM } from './preview.constants';
import { CVPreview } from './CVPreview';

function resetStore(): void {
  localStorage.clear();
  useCVStore.persist.clearStorage();
  useCVStore.getState().resetDocument();
}

describe('CVPreview', () => {
  beforeEach(() => {
    resetStore();
  });

  afterEach(() => {
    cleanup();
  });

  it('affiche le zoom par défaut et le wrapper print', () => {
    const { container } = render(<CVPreview />);
    const slider = screen.getByRole('slider') as HTMLInputElement;
    expect(slider.value).toBe(String(DEFAULT_PREVIEW_ZOOM));
    expect(container.querySelector('.cv-template-print-wrapper')).toBeTruthy();
    expect(container.querySelector('.cv-template')).toBeTruthy();
  });

  it('met à jour le zoom affiché', () => {
    render(<CVPreview />);
    const slider = screen.getByRole('slider') as HTMLInputElement;
    fireEvent.change(slider, { target: { value: '120' } });
    expect(slider.value).toBe('120');
    expect(screen.getByText('120%')).toBeTruthy();
  });

  it('expose une ref sur le wrapper print', () => {
    const ref = createRef<HTMLDivElement>();
    render(<CVPreview ref={ref} />);
    expect(ref.current).toBeTruthy();
    expect(ref.current?.classList.contains('cv-template-print-wrapper')).toBe(true);
  });
});
