'use client';

import { useEffect, useId, useRef, useState } from 'react';
import { Check, Copy, Link2, Loader2, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useCVStore } from '@/store/cv.store';
import type { CreateShareResponse } from '@/types/share.types';
import {
  appendShareRegistry,
  buildShareUrl,
  copyTextToClipboard,
} from '@/lib/share/share.utils';

interface ShareDialogProps {
  open: boolean;
  onClose: () => void;
}

export function ShareDialog({ open, onClose }: ShareDialogProps) {
  const cvDocument = useCVStore((state) => state.document);
  const titleId = useId();
  const dialogRef = useRef<HTMLDivElement>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [share, setShare] = useState<CreateShareResponse | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.document.addEventListener('keydown', onKeyDown);
    dialogRef.current?.focus();
    window.document.body.style.overflow = 'hidden';
    return () => {
      window.document.removeEventListener('keydown', onKeyDown);
      window.document.body.style.overflow = '';
    };
  }, [open, onClose]);

  useEffect(() => {
    if (!open) {
      setShare(null);
      setError(null);
      setCopied(false);
      setLoading(false);
    }
  }, [open]);

  const createLink = async () => {
    setLoading(true);
    setError(null);
    setCopied(false);
    try {
      const response = await fetch('/api/share', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ document: cvDocument }),
      });
      const data = (await response.json()) as CreateShareResponse & { error?: unknown };
      if (!response.ok) {
        setError('Impossible de créer le lien. Réessayez.');
        return;
      }
      const url =
        data.url || buildShareUrl(data.token, window.location.origin);
      const payload: CreateShareResponse = { ...data, url };
      setShare(payload);
      appendShareRegistry({
        token: payload.token,
        title: payload.title,
        url: payload.url,
        createdAt: new Date().toISOString(),
      });
    } catch {
      setError('Erreur réseau. Vérifiez votre connexion.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!share?.url) return;
    const ok = await copyTextToClipboard(share.url);
    if (ok) {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className="w-full max-w-md rounded-2xl border border-cvforge-border bg-cvforge-surface p-5 shadow-2xl outline-none"
      >
        <div className="mb-4 flex items-start justify-between gap-3">
          <div className="flex items-center gap-2">
            <div
              className="flex h-9 w-9 items-center justify-center rounded-lg bg-cvforge-accent-blue/20 text-cvforge-accent-blue"
              aria-hidden
            >
              <Link2 className="h-5 w-5" />
            </div>
            <div>
              <h2 id={titleId} className="text-base font-bold text-cvforge-text">
                Partager le CV
              </h2>
              <p className="text-xs text-cvforge-muted">
                Lien lecture seule pour recruteurs (30 jours)
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-cvforge-muted transition-colors hover:bg-cvforge-raised hover:text-cvforge-text focus:outline-none focus-visible:ring-2 focus-visible:ring-cvforge-accent-blue"
            aria-label="Fermer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {!share ? (
          <>
            <p className="mb-4 text-sm text-cvforge-muted">
              Générez un lien unique. Les visiteurs verront une prévisualisation sans pouvoir
              modifier votre CV.
            </p>
            {error && (
              <p className="mb-3 text-sm text-red-400" role="alert">
                {error}
              </p>
            )}
            <div className="flex justify-end gap-2">
              <Button variant="ghost" size="md" onClick={onClose}>
                Annuler
              </Button>
              <Button
                variant="primary"
                size="md"
                loading={loading}
                onClick={() => void createLink()}
              >
                Générer le lien
              </Button>
            </div>
          </>
        ) : (
          <>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-cvforge-muted">
              Lien de partage
            </label>
            <div className="mb-3 flex gap-2">
              <input
                type="text"
                readOnly
                value={share.url}
                className="min-w-0 flex-1 rounded-lg border border-cvforge-border bg-cvforge-raised px-3 py-2 text-xs text-cvforge-text"
                aria-label="URL de partage"
                onFocus={(event) => event.target.select()}
              />
              <Button
                variant="secondary"
                size="md"
                onClick={() => void handleCopy()}
                icon={copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              >
                {copied ? 'Copié' : 'Copier'}
              </Button>
            </div>
            <p className="mb-4 text-xs text-cvforge-muted">
              Expire le{' '}
              {new Date(share.expiresAt).toLocaleDateString('fr-FR', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </p>
            <div className="flex justify-end">
              <Button variant="primary" size="md" onClick={onClose}>
                Terminé
              </Button>
            </div>
          </>
        )}

        {loading && !share && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center rounded-2xl bg-cvforge-surface/50">
            <Loader2 className="h-8 w-8 animate-spin text-cvforge-accent-blue" aria-hidden />
          </div>
        )}
      </div>
    </div>
  );
}
