import type { CSSProperties } from 'react';
import { CV_FONT_STACKS } from '@/config/cv-layout';
import type {
  CVColors,
  CVDateFormat,
  CVDocument,
  CVFontStyle,
  CVLayoutOptions,
} from '@/types/cv.types';
import { FONT_SCALE } from '@/components/preview/preview.constants';

const FRENCH_MONTHS_FULL = [
  'Janvier',
  'Février',
  'Mars',
  'Avril',
  'Mai',
  'Juin',
  'Juillet',
  'Août',
  'Septembre',
  'Octobre',
  'Novembre',
  'Décembre',
] as const;

const FRENCH_MONTHS_SHORT = [
  'Jan',
  'Fév',
  'Mar',
  'Avr',
  'Mai',
  'Juin',
  'Juil',
  'Août',
  'Sep',
  'Oct',
  'Nov',
  'Déc',
] as const;

export function createDefaultLayout(colors: CVColors): CVLayoutOptions {
  return {
    colors: {
      name: colors.text,
      jobTitle: colors.primary,
      sectionTitleSidebar: '#ffffff',
      sectionTitleMain: colors.primary,
      organization: colors.text,
      skillBar: colors.primary,
      sidebarBackground: colors.primary,
    },
    typography: {
      bodyFont: 'dm-sans',
      bodyStyle: 'normal',
      titleFont: 'dm-sans',
      bodySizePx: 12,
      nameSizePx: 26,
      sectionTitleSizePx: 12,
    },
    spacing: {
      blockGapPx: 20,
      paddingVerticalPx: 28,
      paddingHorizontalPx: 24,
    },
    roundedPhoto: true,
    showTimeline: true,
    nameUppercase: false,
    summaryJustified: false,
    dateFormat: 'default',
  };
}

export function ensureDocumentLayout(document: CVDocument): CVLayoutOptions {
  if (!document.layout) {
    document.layout = createDefaultLayout(document.colors);
  }
  return document.layout;
}

function fontWeight(style: CVFontStyle): number {
  if (style === 'bold') return 700;
  return 400;
}

function fontStyleCss(style: CVFontStyle): string {
  if (style === 'italic') return 'italic';
  return 'normal';
}

function formatSingleDate(date: string | undefined, format: CVDateFormat): string {
  if (!date) return '';
  const [year, month] = date.split('-');
  const monthIndex = Number(month) - 1;
  if (!year || monthIndex < 0 || monthIndex > 11) return date;

  switch (format) {
    case 'mm-yyyy':
      return `${month}/${year}`;
    case 'month-yyyy':
      return `${FRENCH_MONTHS_FULL[monthIndex]} ${year}`;
    case 'yyyy':
      return year;
    case 'default':
    default:
      return `${FRENCH_MONTHS_SHORT[monthIndex]} ${year}`;
  }
}

/** Formate une plage de dates selon les options de mise en page. */
export function formatDateRangeForLayout(
  start: string | undefined,
  end: string | undefined,
  current: boolean | undefined,
  format: CVDateFormat,
): string {
  const startLabel = formatSingleDate(start, format);
  if (current) {
    return startLabel ? `${startLabel} – Présent` : 'Présent';
  }
  const endLabel = formatSingleDate(end, format);
  if (startLabel && endLabel) return `${startLabel} – ${endLabel}`;
  return startLabel || endLabel || '';
}

export function buildLayoutCssVars(document: CVDocument): CSSProperties {
  const layout = ensureDocumentLayout(document);
  const { colors, typography, spacing } = layout;
  const bodyStack = CV_FONT_STACKS[typography.bodyFont];
  const titleStack = CV_FONT_STACKS[typography.titleFont];

  return {
    '--cv-primary': document.colors.primary,
    '--cv-secondary': document.colors.secondary,
    '--cv-text': document.colors.text,
    '--cv-background': document.colors.background,
    '--cv-font-scale': String(FONT_SCALE[document.fontSize]),
    '--cv-color-name': colors.name,
    '--cv-color-job': colors.jobTitle,
    '--cv-color-section-sidebar': colors.sectionTitleSidebar,
    '--cv-color-section-main': colors.sectionTitleMain,
    '--cv-color-organization': colors.organization,
    '--cv-color-skill-bar': colors.skillBar,
    '--cv-sidebar-bg': colors.sidebarBackground,
    '--cv-font-body': bodyStack,
    '--cv-font-title': titleStack,
    '--cv-body-weight': String(fontWeight(typography.bodyStyle)),
    '--cv-body-style': fontStyleCss(typography.bodyStyle),
    '--cv-text-size': `${typography.bodySizePx}px`,
    '--cv-name-size': `${typography.nameSizePx}px`,
    '--cv-section-title-size': `${typography.sectionTitleSizePx}px`,
    '--cv-block-gap': `${spacing.blockGapPx}px`,
    '--cv-padding-v': `${spacing.paddingVerticalPx}px`,
    '--cv-padding-h': `${spacing.paddingHorizontalPx}px`,
    '--cv-photo-radius': layout.roundedPhoto ? '9999px' : '8px',
    '--cv-name-transform': layout.nameUppercase ? 'uppercase' : 'none',
    '--cv-summary-align': layout.summaryJustified ? 'justify' : 'left',
    '--cv-timeline-display': layout.showTimeline ? 'block' : 'none',
  } as CSSProperties;
}

export function getLayoutGoogleFontFamilies(document: CVDocument): string[] {
  const layout = ensureDocumentLayout(document);
  const families = new Set<string>();
  const body = CV_FONT_STACKS[layout.typography.bodyFont];
  const title = CV_FONT_STACKS[layout.typography.titleFont];
  const pick = (stack: string) => {
    const match = stack.match(/'([^']+)'/);
    if (match?.[1]) families.add(match[1].replace(/ /g, '+'));
  };
  pick(body);
  pick(title);
  return [...families];
}

export function mergeLayoutPatch(
  layout: CVLayoutOptions,
  patch: {
    colors?: Partial<CVLayoutOptions['colors']>;
    typography?: Partial<CVLayoutOptions['typography']>;
    spacing?: Partial<CVLayoutOptions['spacing']>;
    roundedPhoto?: boolean;
    showTimeline?: boolean;
    nameUppercase?: boolean;
    summaryJustified?: boolean;
    dateFormat?: CVLayoutOptions['dateFormat'];
  },
): void {
  if (patch.colors) Object.assign(layout.colors, patch.colors);
  if (patch.typography) Object.assign(layout.typography, patch.typography);
  if (patch.spacing) Object.assign(layout.spacing, patch.spacing);
  if (patch.roundedPhoto !== undefined) layout.roundedPhoto = patch.roundedPhoto;
  if (patch.showTimeline !== undefined) layout.showTimeline = patch.showTimeline;
  if (patch.nameUppercase !== undefined) layout.nameUppercase = patch.nameUppercase;
  if (patch.summaryJustified !== undefined) layout.summaryJustified = patch.summaryJustified;
  if (patch.dateFormat !== undefined) layout.dateFormat = patch.dateFormat;
}
