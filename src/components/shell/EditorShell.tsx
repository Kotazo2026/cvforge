'use client';

import type { RefObject } from 'react';
import { useEffect, useState } from 'react';
import { useEditorUIStore } from '@/store/editor-ui.store';
import { cn } from '@/utils/cv.utils';
import { CenterPreview } from './CenterPreview';
import { LeftSidebar } from './LeftSidebar';
import { RightPanel } from './RightPanel';
import { SidebarPanel } from './SidebarPanel';
import { AiFeaturesModal } from '@/components/ai/AiFeaturesModal';
import { TopBar } from './TopBar';

const DESKTOP_PANEL_BP = 1280;
const MOBILE_BP = 768;

interface EditorShellProps {
  previewRef: RefObject<HTMLDivElement | null>;
}

export function EditorShell({ previewRef }: EditorShellProps) {
  const sidebarCollapsed = useEditorUIStore((state) => state.sidebarCollapsed);
  const mobileNavOpen = useEditorUIStore((state) => state.mobileNavOpen);
  const setSidebarCollapsed = useEditorUIStore((state) => state.setSidebarCollapsed);
  const setMobileNavOpen = useEditorUIStore((state) => state.setMobileNavOpen);
  const [belowDesktop, setBelowDesktop] = useState(false);

  useEffect(() => {
    const desktopMq = window.matchMedia(`(min-width: ${DESKTOP_PANEL_BP}px)`);
    const mobileMq = window.matchMedia(`(max-width: ${MOBILE_BP - 1}px)`);

    const sync = () => {
      setBelowDesktop(!desktopMq.matches);
      if (desktopMq.matches) {
        setSidebarCollapsed(false);
      } else {
        setSidebarCollapsed(true);
      }
      if (!mobileMq.matches) {
        setMobileNavOpen(false);
      }
    };

    sync();
    desktopMq.addEventListener('change', sync);
    mobileMq.addEventListener('change', sync);
    return () => {
      desktopMq.removeEventListener('change', sync);
      mobileMq.removeEventListener('change', sync);
    };
  }, [setSidebarCollapsed, setMobileNavOpen]);

  const showPanel = !sidebarCollapsed || mobileNavOpen;

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-cvforge-bg text-cvforge-text">
      <AiFeaturesModal />
      <TopBar previewRef={previewRef} />

      <div className="relative flex min-h-0 flex-1">
        <LeftSidebar compact={sidebarCollapsed} />

        {showPanel && (
          <>
            {mobileNavOpen && belowDesktop && (
              <button
                type="button"
                className="absolute inset-0 z-10 bg-black/50 xl:hidden"
                aria-label="Fermer le panneau"
                onClick={() => {
                  setMobileNavOpen(false);
                  setSidebarCollapsed(true);
                }}
              />
            )}
            <div className="relative z-20 flex max-md:absolute max-md:inset-y-0 max-md:left-0 max-md:shadow-2xl">
              <SidebarPanel />
            </div>
          </>
        )}

        <CenterPreview previewRef={previewRef} />
        <RightPanel />
      </div>

      {/* Navigation mobile bas d'écran */}
      <div
        className={cn(
          'flex shrink-0 border-t border-cvforge-border bg-cvforge-surface md:hidden',
          mobileNavOpen && 'hidden',
        )}
      >
        <button
          type="button"
          className="flex-1 py-3 text-center text-xs font-medium text-cvforge-accent"
          onClick={() => setMobileNavOpen(true)}
        >
          Ouvrir les outils
        </button>
      </div>
    </div>
  );
}
