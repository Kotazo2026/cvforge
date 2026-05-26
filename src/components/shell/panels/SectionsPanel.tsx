'use client';

import { AddSectionMenu } from '@/components/editor/AddSectionMenu';
import { SectionList } from '@/components/editor/SectionList';

export function SectionsPanel() {
  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-cvforge-border px-4 py-4">
        <h2 className="text-sm font-semibold text-cvforge-text">Sections</h2>
        <p className="mt-1 text-xs text-cvforge-muted">
          Réorganisez les blocs par glisser-déposer
        </p>
      </div>

      <div className="flex-1 overflow-y-auto px-2 py-3">
        <SectionList />
      </div>

      <div className="border-t border-cvforge-border p-4">
        <AddSectionMenu />
      </div>
    </div>
  );
}
