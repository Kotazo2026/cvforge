'use client';

import { useState } from 'react';
import { Share2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { ShareDialog } from './ShareDialog';

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
      <ShareDialog open={open} onClose={() => setOpen(false)} />
    </>
  );
}
