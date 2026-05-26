'use client';

import type { RefObject } from 'react';
import { useCallback, useState } from 'react';
import { Download } from 'lucide-react';
import { useReactToPrint } from 'react-to-print';
import { Button } from '@/components/ui/Button';
import { Toast } from '@/components/ui/Toast';
import { useCVStore } from '@/store/cv.store';
import {
  CVFORGE_REACT_TO_PRINT_PAGE_STYLE,
  buildExportFilename,
  exportToPDF,
  notifyPrintComplete,
} from '@/utils/export.utils';

interface ExportButtonProps {
  previewRef: RefObject<HTMLDivElement | null>;
}

type ToastState = { message: string; variant: 'success' | 'error' } | null;

export function ExportButton({ previewRef }: ExportButtonProps) {
  const header = useCVStore((state) => state.document.header);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<ToastState>(null);

  const filename = buildExportFilename(header);

  const handlePrint = useReactToPrint({
    contentRef: previewRef,
    documentTitle: filename.replace(/\.pdf$/i, ''),
    pageStyle: CVFORGE_REACT_TO_PRINT_PAGE_STYLE,
    onAfterPrint: () => notifyPrintComplete(),
  });

  const handleExport = useCallback(async () => {
    setLoading(true);
    setToast(null);

    try {
      await exportToPDF(previewRef, filename, { print: handlePrint });
      setToast({
        message:
          'Dialogue d\'impression ouvert — choisissez « Enregistrer au format PDF » comme destination.',
        variant: 'success',
      });
    } catch {
      setToast({
        message: "Impossible d'exporter le PDF. Réessayez dans un instant.",
        variant: 'error',
      });
    } finally {
      setLoading(false);
    }
  }, [filename, handlePrint, previewRef]);

  return (
    <>
      <Button
        variant="primary"
        size="md"
        icon={<Download className="h-4 w-4" aria-hidden />}
        loading={loading}
        onClick={handleExport}
        aria-label="Télécharger le CV en PDF"
      >
        Télécharger PDF
      </Button>
      {toast && <Toast message={toast.message} variant={toast.variant} onDismiss={() => setToast(null)} />}
    </>
  );
}
