'use client';

import type { LucideIcon } from 'lucide-react';
import {
  Layers,
  LayoutGrid,
  PanelLeftClose,
  PanelLeftOpen,
  SlidersHorizontal,
  Sparkles,
  UserRound,
} from 'lucide-react';
import type { EditorSidebarPanel } from '@/types/cv.types';
import { useEditorUIStore } from '@/store/editor-ui.store';
import { cn } from '@/utils/cv.utils';

interface NavItem {
  id: EditorSidebarPanel;
  label: string;
  icon: LucideIcon;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'templates', label: 'Modèles', icon: LayoutGrid },
  { id: 'info', label: 'Informations', icon: UserRound },
  { id: 'layout', label: 'Mise en page', icon: SlidersHorizontal },
  { id: 'sections', label: 'Sections', icon: Layers },
  { id: 'ai', label: 'Ajout IA', icon: Sparkles },
];

interface LeftSidebarProps {
  compact: boolean;
}

export function LeftSidebar({ compact }: LeftSidebarProps) {
  const activePanel = useEditorUIStore((state) => state.activePanel);
  const sidebarCollapsed = useEditorUIStore((state) => state.sidebarCollapsed);
  const setActivePanel = useEditorUIStore((state) => state.setActivePanel);
  const setSidebarCollapsed = useEditorUIStore((state) => state.setSidebarCollapsed);
  const setMobileNavOpen = useEditorUIStore((state) => state.setMobileNavOpen);

  return (
    <nav
      className={cn(
        'flex shrink-0 flex-col border-r border-cvforge-border bg-cvforge-bg py-3',
        compact ? 'w-16 items-center' : 'w-[76px]',
      )}
      aria-label="Navigation éditeur"
      data-cvforge-chrome
    >
      <div className="flex flex-1 flex-col gap-1 px-2">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const active = activePanel === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                setActivePanel(item.id);
                setSidebarCollapsed(false);
                setMobileNavOpen(true);
              }}
              aria-current={active ? 'page' : undefined}
              aria-label={item.label}
              title={item.label}
              className={cn(
                'group flex flex-col items-center gap-1 rounded-xl px-1 py-2 text-[10px] font-medium transition-all',
                'focus:outline-none focus-visible:ring-2 focus-visible:ring-cvforge-accent-blue',
                active
                  ? 'bg-cvforge-accent/15 text-cvforge-accent'
                  : 'text-cvforge-muted hover:bg-cvforge-surface hover:text-cvforge-text',
              )}
            >
              <Icon className="h-5 w-5 shrink-0" aria-hidden />
              {!compact && <span className="max-w-[4.5rem] truncate leading-tight">{item.label}</span>}
            </button>
          );
        })}
      </div>

      {!compact && (
        <button
          type="button"
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className={cn(
            'mx-2 mt-2 flex items-center justify-center rounded-lg border border-cvforge-border p-2 text-cvforge-muted',
            'hover:bg-cvforge-surface hover:text-cvforge-text focus:outline-none focus-visible:ring-2 focus-visible:ring-cvforge-accent-blue',
          )}
          aria-label={sidebarCollapsed ? 'Déplier le panneau' : 'Replier le panneau'}
        >
          {sidebarCollapsed ? (
            <PanelLeftOpen className="h-4 w-4" aria-hidden />
          ) : (
            <PanelLeftClose className="h-4 w-4" aria-hidden />
          )}
        </button>
      )}
    </nav>
  );
}
