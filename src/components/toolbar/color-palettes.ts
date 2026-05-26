import type { CVColors } from '@/types/cv.types';

export interface ColorPalette {
  name: string;
  colors: CVColors;
}

export const COLOR_PALETTES: ColorPalette[] = [
  {
    name: 'Bleu',
    colors: {
      primary: '#2563EB',
      secondary: '#1E40AF',
      text: '#111827',
      background: '#FFFFFF',
    },
  },
  {
    name: 'Gris foncé',
    colors: {
      primary: '#374151',
      secondary: '#1F2937',
      text: '#111827',
      background: '#FFFFFF',
    },
  },
  {
    name: 'Vert',
    colors: {
      primary: '#059669',
      secondary: '#047857',
      text: '#111827',
      background: '#FFFFFF',
    },
  },
  {
    name: 'Bordeaux',
    colors: {
      primary: '#9B1C1C',
      secondary: '#7F1D1D',
      text: '#111827',
      background: '#FFFFFF',
    },
  },
  {
    name: 'Violet',
    colors: {
      primary: '#6D28D9',
      secondary: '#5B21B6',
      text: '#111827',
      background: '#FFFFFF',
    },
  },
  {
    name: 'Orange',
    colors: {
      primary: '#D97706',
      secondary: '#B45309',
      text: '#111827',
      background: '#FFFFFF',
    },
  },
  {
    name: 'Teal',
    colors: {
      primary: '#0D9488',
      secondary: '#0F766E',
      text: '#111827',
      background: '#FFFFFF',
    },
  },
  {
    name: 'Rose',
    colors: {
      primary: '#DB2777',
      secondary: '#BE185D',
      text: '#111827',
      background: '#FFFFFF',
    },
  },
];
