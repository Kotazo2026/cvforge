import type { CVDateFormat, CVFontFamily, CVFontStyle } from '@/types/cv.types';

export interface FontFamilyOption {
  id: CVFontFamily;
  label: string;
  googleFamily: string;
}

export const CV_FONT_OPTIONS: FontFamilyOption[] = [
  { id: 'inter', label: 'Inter', googleFamily: 'Inter' },
  { id: 'lato', label: 'Lato', googleFamily: 'Lato' },
  { id: 'raleway', label: 'Raleway', googleFamily: 'Raleway' },
  { id: 'merriweather', label: 'Merriweather', googleFamily: 'Merriweather' },
  { id: 'roboto-slab', label: 'Roboto Slab', googleFamily: 'Roboto+Slab' },
  { id: 'dm-sans', label: 'DM Sans', googleFamily: 'DM+Sans' },
  { id: 'playfair', label: 'Playfair Display', googleFamily: 'Playfair+Display' },
  { id: 'source-serif', label: 'Source Serif 4', googleFamily: 'Source+Serif+4' },
];

export const CV_FONT_STYLE_OPTIONS: { id: CVFontStyle; label: string }[] = [
  { id: 'normal', label: 'Normal' },
  { id: 'bold', label: 'Gras' },
  { id: 'italic', label: 'Italique' },
];

export const CV_DATE_FORMAT_OPTIONS: { id: CVDateFormat; label: string }[] = [
  { id: 'default', label: 'Par défaut' },
  { id: 'mm-yyyy', label: 'MM/YYYY' },
  { id: 'month-yyyy', label: 'Mois YYYY' },
  { id: 'yyyy', label: 'YYYY' },
];

/** Stack CSS pour chaque police (chargée via Google Fonts). */
export const CV_FONT_STACKS: Record<CVFontFamily, string> = {
  inter: "'Inter', system-ui, sans-serif",
  lato: "'Lato', system-ui, sans-serif",
  raleway: "'Raleway', system-ui, sans-serif",
  merriweather: "'Merriweather', Georgia, serif",
  'roboto-slab': "'Roboto Slab', Georgia, serif",
  'dm-sans': "'DM Sans', system-ui, sans-serif",
  playfair: "'Playfair Display', Georgia, serif",
  'source-serif': "'Source Serif 4', Georgia, serif",
};
