'use client';

import { forwardRef, useMemo, useState } from 'react';
import { useCVStore } from '@/store/cv.store';
import { cn } from '@/utils/cv.utils';
import {
  CV_PAGE_MIN_HEIGHT_PX,
  CV_PAGE_WIDTH_PX,
  DEFAULT_PREVIEW_ZOOM,
  MAX_PREVIEW_ZOOM,
  MIN_PREVIEW_ZOOM,
  buildTemplateCssVars,
} from './preview.constants';
import styles from './CVPreview.module.css';
import { LayoutFontLoader } from './LayoutFontLoader';
import { TemplateRenderer } from './templates/TemplateRenderer';

export interface CVPreviewProps {
  className?: string;
  showZoomControls?: boolean;
  variant?: 'default' | 'studio';
}

export const CVPreview = forwardRef<HTMLDivElement, CVPreviewProps>(function CVPreview(
  { className, showZoomControls = true, variant = 'default' },
  ref,
) {
  const document = useCVStore((state) => state.document);
  const [zoom, setZoom] = useState(DEFAULT_PREVIEW_ZOOM);

  const scale = zoom / 100;
  const cssVars = useMemo(() => buildTemplateCssVars(document), [document]);

  const hostWidth = Math.round(CV_PAGE_WIDTH_PX * scale);
  const hostHeight = Math.round(CV_PAGE_MIN_HEIGHT_PX * scale);

  return (
    <section
      className={cn(styles.root, variant === 'studio' && styles.rootStudio, className)}
      aria-label="Aperçu du CV"
      data-cvforge-chrome
    >
      <LayoutFontLoader />
      {showZoomControls && (
        <div className={styles.toolbar} data-cvforge-chrome>
          <label className="flex items-center gap-2">
            <span className="sr-only">Niveau de zoom de l&apos;aperçu</span>
            <span className={styles.zoomLabel} aria-hidden>
              {zoom}%
            </span>
            <input
              type="range"
              className={styles.zoomSlider}
              min={MIN_PREVIEW_ZOOM}
              max={MAX_PREVIEW_ZOOM}
              step={5}
              value={zoom}
              onChange={(event) => setZoom(Number(event.target.value))}
              aria-valuemin={MIN_PREVIEW_ZOOM}
              aria-valuemax={MAX_PREVIEW_ZOOM}
              aria-valuenow={zoom}
            />
          </label>
        </div>
      )}

      <div className={styles.viewport}>
        <div
          className={styles.scaleHost}
          style={{ width: hostWidth, minHeight: hostHeight }}
        >
          <div
            className={styles.scaleInner}
            style={{
              transform: `scale(${scale})`,
              width: CV_PAGE_WIDTH_PX,
            }}
          >
            <div
              ref={ref}
              className={cn('cv-template-print-wrapper', styles.printWrapper)}
              style={cssVars}
            >
              <div key={document.templateId} className={styles.templateLayer}>
                <TemplateRenderer document={document} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
});
