'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, FileText, Sparkles } from 'lucide-react';
import { CVPreview } from '@/components/preview/CVPreview';
import { Button } from '@/components/ui/Button';
import { useCVStore } from '@/store/cv.store';
import type { ShareRecord } from '@/types/share.types';
import { forkDocumentForEditor } from '@/lib/share/share.utils';
import styles from './ShareView.module.css';

interface ShareViewClientProps {
  token: string;
}

export function ShareViewClient({ token }: ShareViewClientProps) {
  const router = useRouter();
  const importDocument = useCVStore((state) => state.importDocument);

  const [record, setRecord] = useState<ShareRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadShare = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/share/${encodeURIComponent(token)}`);
      const data = (await response.json()) as { record?: ShareRecord; error?: string };
      if (!response.ok || !data.record) {
        setError(data.error ?? 'Ce lien n’est plus disponible.');
        setRecord(null);
        return;
      }
      setRecord(data.record);
    } catch {
      setError('Impossible de charger le CV partagé.');
      setRecord(null);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    void loadShare();
  }, [loadShare]);

  const handleFork = () => {
    if (!record) return;
    const forked = forkDocumentForEditor(record.document);
    importDocument(forked);
    router.push('/editor');
  };

  return (
    <div className={styles.page}>
      <header className={styles.header} role="banner">
        <div className={styles.brand}>
          <div className={styles.logo} aria-hidden>
            <FileText className="h-5 w-5" />
          </div>
          <span className={styles.brandName}>CVForge</span>
        </div>
        <div className={styles.badge} role="status">
          <Eye className="h-4 w-4 shrink-0" aria-hidden />
          Vue recruteur — lecture seule
        </div>
        <Button
          variant="primary"
          size="md"
          onClick={handleFork}
          disabled={!record}
          icon={<Sparkles className="h-4 w-4" />}
        >
          Créer ma version
        </Button>
      </header>

      <main className={styles.main}>
        {loading && (
          <p className={styles.message} role="status">
            Chargement du CV…
          </p>
        )}
        {!loading && error && (
          <div className={styles.errorBox} role="alert">
            <p className={styles.errorTitle}>Lien indisponible</p>
            <p className={styles.errorText}>{error}</p>
            <Button variant="secondary" size="md" onClick={() => router.push('/editor')}>
              Ouvrir l’éditeur
            </Button>
          </div>
        )}
        {!loading && record && (
          <>
            <div className={styles.meta}>
              <h1 className={styles.cvTitle}>{record.title}</h1>
              {record.ownerLabel && (
                <p className={styles.owner}>Partagé par {record.ownerLabel}</p>
              )}
            </div>
            <div className={styles.previewWrap}>
              <CVPreview
                document={record.document}
                variant="studio"
                showZoomControls
                className={styles.preview}
              />
            </div>
          </>
        )}
      </main>
    </div>
  );
}
