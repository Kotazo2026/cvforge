'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { Share2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';

const ShareDialog = dynamic(
  () => import('./ShareDialog').then((m) => m.ShareDialog),
  { ssr: false },
);

export function ShareButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setOpen(true)}
        icon={<Share2 className="h-4 w-4" />}
        className="hidden text-cvforge-muted hover:text-cvforge-text sm:inline-flex"
        aria-haspopup="dialog"
      >
        Partager
      </Button>
      {open ? <ShareDialog open={open} onClose={() => setOpen(false)} /> : null}
    </>
  );
}
