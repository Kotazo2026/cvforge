import { createRef } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  buildExportFilename,
  exportToPDF,
  injectCvforgePrintStyles,
  notifyPrintComplete,
  removeCvforgePrintStyles,
} from './export.utils';

describe('export.utils', () => {
  beforeEach(() => {
    removeCvforgePrintStyles();
  });

  afterEach(() => {
    removeCvforgePrintStyles();
    vi.restoreAllMocks();
  });

  it('buildExportFilename formate le nom de fichier', () => {
    expect(
      buildExportFilename({
        firstName: 'Alexandre',
        lastName: 'Martin',
        jobTitle: '',
        email: '',
        phone: '',
        location: '',
      }),
    ).toBe('Martin_Alexandre_CV.pdf');
  });

  it('injectCvforgePrintStyles ajoute une feuille de style', () => {
    injectCvforgePrintStyles();
    expect(document.getElementById('cvforge-print-styles')).toBeTruthy();
  });

  it('exportToPDF rejette si la ref est vide', async () => {
    const ref = createRef<HTMLDivElement>();
    await expect(exportToPDF(ref, 'test.pdf')).rejects.toThrow(/introuvable/i);
  });

  it('exportToPDF appelle printTrigger si fourni', async () => {
    const ref = createRef<HTMLDivElement>();
    const element = document.createElement('div');
    element.className = 'cv-template-print-wrapper';
    ref.current = element;

    const printTrigger = vi.fn();

    const promise = exportToPDF(ref, 'Martin_Alexandre_CV.pdf', { print: printTrigger });

    expect(printTrigger).toHaveBeenCalled();

    notifyPrintComplete();

    await expect(promise).resolves.toBeUndefined();
  });
});
