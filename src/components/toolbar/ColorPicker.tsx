'use client';

import { useCVStore } from '@/store/cv.store';
import { cn } from '@/utils/cv.utils';
import { COLOR_PALETTES } from './color-palettes';

export function ColorPicker() {
  const colors = useCVStore((state) => state.document.colors);
  const setColors = useCVStore((state) => state.setColors);

  return (
    <div className="flex items-center gap-2" role="group" aria-label="Couleurs du CV">
      <div className="flex items-center gap-1.5">
        {COLOR_PALETTES.map((palette) => {
          const isActive = colors.primary.toLowerCase() === palette.colors.primary.toLowerCase();
          return (
            <button
              key={palette.name}
              type="button"
              title={palette.name}
              aria-label={`Palette ${palette.name}`}
              aria-pressed={isActive}
              onClick={() => setColors(palette.colors)}
              className={cn(
                'h-7 w-7 rounded-full border-2 transition-transform hover:scale-110',
                'focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2',
                isActive ? 'border-slate-900' : 'border-white shadow-sm',
              )}
              style={{ backgroundColor: palette.colors.primary }}
            />
          );
        })}
      </div>

      <label className="relative flex h-7 w-7 cursor-pointer items-center justify-center overflow-hidden rounded-full border border-slate-200 bg-white shadow-sm hover:border-slate-300">
        <span className="sr-only">Couleur personnalisée</span>
        <span
          className="h-5 w-5 rounded-full border border-slate-200"
          style={{ backgroundColor: colors.primary }}
          aria-hidden
        />
        <input
          type="color"
          value={colors.primary}
          onChange={(event) => setColors({ primary: event.target.value })}
          className="absolute inset-0 cursor-pointer opacity-0"
          aria-label="Choisir une couleur personnalisée"
        />
      </label>
    </div>
  );
}
