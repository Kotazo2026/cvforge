'use client';

import { useState } from 'react';
import {
  DndContext,
  type DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  ChevronDown,
  ChevronRight,
  Eye,
  EyeOff,
  GripVertical,
  Plus,
  Trash2,
} from 'lucide-react';
import type { CVSection } from '@/types/cv.types';
import { useCVStore } from '@/store/cv.store';
import { cn } from '@/utils/cv.utils';
import { SortableEntryItem } from './SortableEntryItem';

interface SectionItemProps {
  section: CVSection;
  sortable?: boolean;
}

export function SectionItem({ section, sortable = true }: SectionItemProps) {
  const updateSection = useCVStore((state) => state.updateSection);
  const removeSection = useCVStore((state) => state.removeSection);
  const toggleSectionVisibility = useCVStore((state) => state.toggleSectionVisibility);
  const addEntry = useCVStore((state) => state.addEntry);
  const reorderEntries = useCVStore((state) => state.reorderEntries);

  const [expanded, setExpanded] = useState(true);
  const [editingTitle, setEditingTitle] = useState(false);
  const [titleDraft, setTitleDraft] = useState(section.title);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: section.id,
    disabled: !sortable,
  });

  const commitTitle = () => {
    setEditingTitle(false);
    const next = titleDraft.trim() || section.title;
    setTitleDraft(next);
    if (next !== section.title) {
      updateSection(section.id, { title: next });
    }
  };

  const handleRemoveSection = () => {
    if (section.type === 'header') return;
    if (window.confirm(`Supprimer la section « ${section.title} » ?`)) {
      removeSection(section.id);
    }
  };

  const handleEntryDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    reorderEntries(section.id, String(active.id), String(over.id));
  };

  const style = sortable
    ? {
        transform: CSS.Transform.toString(transform),
        transition,
      }
    : undefined;

  return (
    <article
      ref={sortable ? setNodeRef : undefined}
      style={style}
      className={cn(
        'group/section rounded-xl border border-slate-200 bg-white shadow-sm',
        isDragging && 'z-20 border-blue-300 shadow-lg',
        !section.visible && 'opacity-60',
      )}
    >
      <header className="flex items-center gap-1 border-b border-slate-100 px-2 py-2">
        {sortable ? (
          <button
            type="button"
            className="rounded p-1 text-slate-400 opacity-0 transition-opacity hover:bg-slate-100 group-hover/section:opacity-100 focus:opacity-100"
            aria-label="Déplacer la section"
            {...attributes}
            {...listeners}
          >
            <GripVertical className="h-4 w-4" aria-hidden />
          </button>
        ) : (
          <span className="w-6" aria-hidden />
        )}

        <button
          type="button"
          onClick={() => setExpanded((value) => !value)}
          className="rounded p-1 text-slate-500 hover:bg-slate-100"
          aria-expanded={expanded}
          aria-label={expanded ? 'Replier la section' : 'Déplier la section'}
        >
          {expanded ? (
            <ChevronDown className="h-4 w-4" aria-hidden />
          ) : (
            <ChevronRight className="h-4 w-4" aria-hidden />
          )}
        </button>

        <div className="min-w-0 flex-1">
          {editingTitle ? (
            <input
              type="text"
              value={titleDraft}
              autoFocus
              onChange={(event) => setTitleDraft(event.target.value)}
              onBlur={commitTitle}
              onKeyDown={(event) => {
                if (event.key === 'Enter') commitTitle();
                if (event.key === 'Escape') {
                  setTitleDraft(section.title);
                  setEditingTitle(false);
                }
              }}
              className="w-full rounded border border-blue-300 px-2 py-0.5 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          ) : (
            <h3
              className="cursor-text truncate px-1 text-sm font-semibold text-slate-800"
              onDoubleClick={() => {
                setTitleDraft(section.title);
                setEditingTitle(true);
              }}
              title="Double-clic pour renommer"
            >
              {section.title}
            </h3>
          )}
        </div>

        <button
          type="button"
          onClick={() => toggleSectionVisibility(section.id)}
          className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
          aria-label={section.visible ? 'Masquer la section' : 'Afficher la section'}
        >
          {section.visible ? (
            <Eye className="h-4 w-4" aria-hidden />
          ) : (
            <EyeOff className="h-4 w-4" aria-hidden />
          )}
        </button>

        {section.type !== 'header' && (
          <button
            type="button"
            onClick={handleRemoveSection}
            className="rounded p-1 text-slate-400 hover:bg-red-50 hover:text-red-600"
            aria-label="Supprimer la section"
          >
            <Trash2 className="h-4 w-4" aria-hidden />
          </button>
        )}
      </header>

      {expanded && (
        <div className="flex flex-col gap-3 p-3">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleEntryDragEnd}
          >
            <SortableContext
              items={section.entries.map((entry) => entry.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="group/entries flex flex-col gap-3">
                {section.entries.map((entry) => (
                  <div key={entry.id} className="group/entry">
                    <SortableEntryItem section={section} entry={entry} />
                  </div>
                ))}
              </div>
            </SortableContext>
          </DndContext>

          {section.entries.length === 0 && (
            <p className="text-center text-xs text-slate-400">Aucune entrée pour le moment.</p>
          )}

          <button
            type="button"
            onClick={() => addEntry(section.id)}
            className="flex items-center justify-center gap-1.5 rounded-lg border border-dashed border-slate-200 py-2 text-xs font-medium text-slate-600 transition-colors hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700"
          >
            <Plus className="h-3.5 w-3.5" aria-hidden />
            Ajouter une entrée
          </button>
        </div>
      )}
    </article>
  );
}
