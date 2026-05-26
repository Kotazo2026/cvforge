'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Trash2 } from 'lucide-react';
import type { CVEntry, CVSection } from '@/types/cv.types';
import { useCVStore } from '@/store/cv.store';
import { cn } from '@/utils/cv.utils';
import { EntryEditor } from './EntryEditor';

interface SortableEntryItemProps {
  section: CVSection;
  entry: CVEntry;
}

export function SortableEntryItem({ section, entry }: SortableEntryItemProps) {
  const removeEntry = useCVStore((state) => state.removeEntry);
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: entry.id,
  });

  const handleRemove = () => {
    if (window.confirm('Supprimer cette entrée ?')) {
      removeEntry(section.id, entry.id);
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
      }}
      className={cn(
        'group/entry rounded-lg border border-slate-100 bg-slate-50/80 p-3',
        isDragging && 'z-10 border-blue-200 bg-white shadow-md',
      )}
    >
      <div className="mb-2 flex items-center justify-between gap-2">
        <button
          type="button"
          className="cursor-grab rounded p-1 text-slate-400 opacity-0 transition-opacity hover:bg-slate-200 hover:text-slate-600 focus:opacity-100 group-hover/entry:opacity-100 active:cursor-grabbing"
          aria-label="Déplacer l'entrée"
          {...attributes}
          {...listeners}
        >
          <GripVertical className="h-4 w-4" aria-hidden />
        </button>
        <button
          type="button"
          onClick={handleRemove}
          className="rounded p-1 text-slate-400 hover:bg-red-50 hover:text-red-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          aria-label="Supprimer l'entrée"
        >
          <Trash2 className="h-4 w-4" aria-hidden />
        </button>
      </div>
      <EntryEditor section={section} entry={entry} />
    </div>
  );
}
