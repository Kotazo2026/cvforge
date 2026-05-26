'use client';

import type { RefObject } from 'react';
import { CVPreview } from './CVPreview';

interface EditorLivePreviewProps {
  previewRef: RefObject<HTMLDivElement | null>;
  variant?: 'default' | 'studio';
}

export function EditorLivePreview({
  previewRef,
  variant = 'default',
}: EditorLivePreviewProps) {
  return (
    <CVPreview
      ref={previewRef}
      className="min-h-0 flex-1"
      variant={variant}
    />
  );
}
