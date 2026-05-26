'use client';

import {
  DndContext,
  type DragEndEvent,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useState } from 'react';
import { useCVStore } from '@/store/cv.store';
import { SectionItem } from './SectionItem';

export function SectionList() {
  const sections = useCVStore((state) => state.document.sections);
  const reorderSections = useCVStore((state) => state.reorderSections);
  const [activeId, setActiveId] = useState<string | null>(null);

  const headerSections = sections.filter((section) => section.type === 'header');
  const sortableSections = sections.filter((section) => section.type !== 'header');
  const sortableIds = sortableSections.map((section) => section.id);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);
    if (!over || active.id === over.id) return;
    reorderSections(String(active.id), String(over.id));
  };

  const activeSection = sortableSections.find((section) => section.id === activeId);

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={(event) => setActiveId(String(event.active.id))}
      onDragEnd={handleDragEnd}
      onDragCancel={() => setActiveId(null)}
    >
      <div className="flex flex-col gap-3">
        {headerSections.map((section) => (
          <SectionItem key={section.id} section={section} sortable={false} />
        ))}

        <SortableContext items={sortableIds} strategy={verticalListSortingStrategy}>
          {sortableSections.map((section) => (
            <SectionItem key={section.id} section={section} sortable />
          ))}
        </SortableContext>
      </div>

      <DragOverlay>
        {activeSection ? (
          <div className="rotate-1 opacity-95">
            <SectionItem section={activeSection} sortable={false} />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
