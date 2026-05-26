'use client';

import type { ComponentType } from 'react';
import type { EditorSidebarPanel } from '@/types/cv.types';
import { useEditorUIStore } from '@/store/editor-ui.store';
import { AiPanel } from './panels/AiPanel';
import { InfoPanel } from './panels/InfoPanel';
import { LayoutPanel } from './panels/LayoutPanel';
import { SectionsPanel } from './panels/SectionsPanel';
import { TemplatesPanel } from './panels/TemplatesPanel';

const PANELS: Record<EditorSidebarPanel, ComponentType> = {
  templates: TemplatesPanel,
  info: InfoPanel,
  layout: LayoutPanel,
  sections: SectionsPanel,
  ai: AiPanel,
};

export function SidebarPanel() {
  const activePanel = useEditorUIStore((state) => state.activePanel);
  const Panel = PANELS[activePanel];
  return (
    <div
      className="flex h-full w-[min(100%,360px)] shrink-0 flex-col border-r border-cvforge-border bg-cvforge-surface"
      data-cvforge-chrome
    >
      <Panel />
    </div>
  );
}
