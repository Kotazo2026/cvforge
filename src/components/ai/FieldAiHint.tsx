'use client';

import { Lightbulb } from 'lucide-react';

interface FieldAiHintProps {
  message: string;
}

export function FieldAiHint({ message }: FieldAiHintProps) {
  return (
    <p className="flex items-start gap-1.5 rounded-md border border-amber-500/30 bg-amber-500/10 px-2 py-1.5 text-xs leading-snug text-amber-100">
      <Lightbulb className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-300" aria-hidden />
      <span>{message}</span>
    </p>
  );
}
