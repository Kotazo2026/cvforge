import type { RefObject } from 'react';
import type { CVHeader } from '@/types/cv.types';

const PRINT_STYLE_ID = 'cvforge-print-styles';

const PRINT_BASE_RULES = `
  * {
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }

  html,
  body {
    margin: 0 !important;
    padding: 0 !important;
  }

  .cv-template-print-wrapper {
    width: 794px !important;
    min-height: 1123px !important;
    margin: 0 !important;
    padding: 0 !important;
    box-shadow: none !important;
    transform: none !important;
    overflow: visible !important;
  }

  .cv-template {
    width: 794px !important;
    min-height: 1123px !important;
    box-shadow: none !important;
  }
`;

/** Styles pour react-to-print (iframe dédié). */
export const CVFORGE_REACT_TO_PRINT_PAGE_STYLE = `
@page {
  size: A4;
  margin: 0;
}

@media print {
  ${PRINT_BASE_RULES}
}
`;

/** Styles injectés pour window.print sur la page complète. */
export const CVFORGE_PRINT_PAGE_STYLE = `
@page {
  size: A4;
  margin: 0;
}

@media print {
  ${PRINT_BASE_RULES}

  body > * {
    display: none !important;
  }

  .cv-template-print-wrapper {
    display: block !important;
    position: fixed !important;
    left: 0 !important;
    top: 0 !important;
    visibility: visible !important;
  }

  .cv-template-print-wrapper * {
    visibility: visible !important;
  }

  [data-cvforge-chrome] {
    display: none !important;
  }
}
`;

export interface ExportToPDFOptions {
  /** Déclencheur react-to-print (prioritaire si fourni). */
  print?: () => void;
}

let printCompletionCallback: (() => void) | null = null;

/** Appelé par react-to-print `onAfterPrint` pour résoudre la promesse d'export. */
export function notifyPrintComplete(): void {
  printCompletionCallback?.();
  printCompletionCallback = null;
}

export function buildExportFilename(header: CVHeader): string {
  const base = `${header.lastName || 'CV'}_${header.firstName || 'document'}_CV.pdf`;
  return base.replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_.-]/g, '');
}

export function injectCvforgePrintStyles(): void {
  if (document.getElementById(PRINT_STYLE_ID)) return;
  const style = document.createElement('style');
  style.id = PRINT_STYLE_ID;
  style.textContent = CVFORGE_PRINT_PAGE_STYLE;
  document.head.appendChild(style);
}

export function removeCvforgePrintStyles(): void {
  document.getElementById(PRINT_STYLE_ID)?.remove();
}

function runWindowPrint(filename: string): Promise<void> {
  injectCvforgePrintStyles();
  const previousTitle = document.title;
  document.title = filename.replace(/\.pdf$/i, '');

  return new Promise((resolve, reject) => {
    let settled = false;

    const finish = () => {
      if (settled) return;
      settled = true;
      removeCvforgePrintStyles();
      document.title = previousTitle;
      window.removeEventListener('afterprint', onAfterPrint);
      clearTimeout(fallbackTimer);
      resolve();
    };

    const onAfterPrint = () => finish();

    const fallbackTimer = window.setTimeout(finish, 10_000);

    window.addEventListener('afterprint', onAfterPrint);

    try {
      window.print();
    } catch (error) {
      if (!settled) {
        settled = true;
        removeCvforgePrintStyles();
        document.title = previousTitle;
        window.removeEventListener('afterprint', onAfterPrint);
        clearTimeout(fallbackTimer);
        reject(error);
      }
    }
  });
}

/**
 * Ouvre la boîte de dialogue d'impression du navigateur pour enregistrer en PDF.
 * Utilise react-to-print via `options.print` lorsqu'il est fourni.
 */
export async function exportToPDF(
  templateRef: RefObject<HTMLDivElement | null>,
  filename: string,
  options?: ExportToPDFOptions,
): Promise<void> {
  if (!templateRef.current) {
    throw new Error('Aperçu du CV introuvable. Rechargez la page et réessayez.');
  }

  injectCvforgePrintStyles();
  const previousTitle = document.title;
  document.title = filename.replace(/\.pdf$/i, '');

  const printTrigger = options?.print;
  if (printTrigger) {
    return new Promise((resolve, reject) => {
      printCompletionCallback = () => {
        removeCvforgePrintStyles();
        document.title = previousTitle;
        resolve();
      };

      try {
        printTrigger();
      } catch (error) {
        printCompletionCallback = null;
        removeCvforgePrintStyles();
        document.title = previousTitle;
        reject(error);
      }
    });
  }

  return runWindowPrint(filename);
}
