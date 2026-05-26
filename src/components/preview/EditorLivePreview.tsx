'use client';

import type { RefObject } from 'react';
import { CVPreview } from './CVPreview';

interface EditorLivePreviewProps {
  previewRef: RefObject<HTMLDivElement | null>;
}

export function EditorLivePreview({ previewRef }: EditorLivePreviewProps) {
  return <CVPreview ref={previewRef} className="min-h-0 flex-1" />;
}
