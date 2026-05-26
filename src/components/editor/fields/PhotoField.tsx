'use client';

import { useId, useRef } from 'react';
import { Camera } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { cn } from '@/utils/cv.utils';

const MAX_SIZE_BYTES = 2 * 1024 * 1024;
const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export interface PhotoFieldProps {
  value?: string;
  onChange: (photo: string | undefined) => void;
  className?: string;
  error?: string;
  onError?: (message: string) => void;
}

export function PhotoField({ value, onChange, className, error, onError }: PhotoFieldProps) {
  const inputId = useId();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File | undefined) => {
    if (!file) return;

    if (!ACCEPTED_TYPES.includes(file.type)) {
      onError?.('Formats acceptés : JPG, PNG ou WebP.');
      return;
    }

    if (file.size > MAX_SIZE_BYTES) {
      onError?.('La photo ne doit pas dépasser 2 Mo.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      if (typeof result === 'string') {
        onChange(result);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className={cn('flex flex-col items-start gap-3', className)}>
      {value ? (
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="group relative h-20 w-20 overflow-hidden rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
          aria-label="Changer la photo"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={value} alt="Photo de profil" className="h-full w-full object-cover" />
          <span className="absolute inset-0 flex items-center justify-center bg-black/50 text-xs font-medium text-white opacity-0 transition-opacity group-hover:opacity-100">
            Changer
          </span>
        </button>
      ) : (
        <Button
          variant="secondary"
          size="sm"
          icon={<Camera className="h-4 w-4" aria-hidden />}
          onClick={() => fileInputRef.current?.click()}
        >
          Ajouter une photo
        </Button>
      )}

      <input
        id={inputId}
        ref={fileInputRef}
        type="file"
        accept={ACCEPTED_TYPES.join(',')}
        className="sr-only"
        onChange={(event) => {
          handleFile(event.target.files?.[0]);
          event.target.value = '';
        }}
      />

      {error && (
        <p className="text-xs text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
