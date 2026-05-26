'use client';

import type { KeyboardEvent } from 'react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { cn } from '@/utils/cv.utils';

export interface TagFieldProps {
  tags: string[];
  onTagsChange: (tags: string[]) => void;
  inputValue: string;
  onInputChange: (value: string) => void;
  showLevel?: boolean;
  level?: number;
  onLevelChange?: (level: number) => void;
  placeholder?: string;
  className?: string;
}

export function TagField({
  tags,
  onTagsChange,
  inputValue,
  onInputChange,
  showLevel = false,
  level = 3,
  onLevelChange,
  placeholder = 'Ajouter une compétence',
  className,
}: TagFieldProps) {
  const addTag = () => {
    const trimmed = inputValue.trim();
    if (!trimmed || tags.includes(trimmed)) return;
    onTagsChange([...tags, trimmed]);
    onInputChange('');
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      addTag();
    }
  };

  const removeTag = (tag: string) => {
    onTagsChange(tags.filter((item) => item !== tag));
  };

  return (
    <div className={cn('flex flex-col gap-3', className)}>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <Badge key={tag} label={tag} onRemove={() => removeTag(tag)} />
        ))}
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={inputValue}
          placeholder={placeholder}
          onChange={(event) => onInputChange(event.target.value)}
          onKeyDown={handleKeyDown}
          className={cn(
            'min-w-0 flex-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900',
            'placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500',
          )}
          aria-label={placeholder}
        />
        <Button variant="secondary" size="md" onClick={addTag}>
          Ajouter
        </Button>
      </div>

      {showLevel && onLevelChange && (
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between text-xs text-slate-600">
            <span>Niveau</span>
            <span className="font-medium text-slate-800">{level}/5</span>
          </div>
          <input
            type="range"
            min={1}
            max={5}
            step={1}
            value={level}
            onChange={(event) => onLevelChange(Number(event.target.value))}
            className="h-2 w-full cursor-pointer accent-[#2563EB] focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            aria-label="Niveau de compétence"
          />
        </div>
      )}
    </div>
  );
}
