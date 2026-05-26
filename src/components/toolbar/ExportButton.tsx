'use client';

import type { RefObject } from 'react';
import { useState } from 'react';
import { Download } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useCVStore } from '@/store/cv.store';
import { exportToPDF } from '@/utils/export.utils';

interface ExportButtonProps {
  previewRef: RefObject<HTMLDivElement | null>;
}

export function ExportButton({ previewRef }: ExportButtonProps) {
  const header = useCVStore((state) => state.document.header);
  const [loading, setLoading] = useState(false);

  const filename = `${header.lastName || 'CV'}_${header.firstName || 'document'}_CV.pdf`
    .replace(/\s+/g, '_')
    .replace(/[^a-zA-Z0-9_-]/g, '');

  const handleExport = async () => {
    setLoading(true);
    try {
      await exportToPDF(previewRef, filename);
    } catch {
      window.alert(
        "L'export PDF sera disponible au prochain bloc. Utilisez l'aperçu pour vérifier votre CV.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
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
  );
}
