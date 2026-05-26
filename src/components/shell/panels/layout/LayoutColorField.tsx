'use client';

interface LayoutColorFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
}

export function LayoutColorField({ label, value, onChange }: LayoutColorFieldProps) {
  return (
    <label className="flex items-center justify-between gap-3 rounded-lg border border-cvforge-border bg-cvforge-raised/60 px-3 py-2">
      <span className="text-xs text-cvforge-text">{label}</span>
      <span className="flex items-center gap-2">
        <span
          className="h-6 w-6 rounded-md border border-cvforge-border"
          style={{ backgroundColor: value }}
          aria-hidden
        />
        <input
          type="color"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="h-8 w-10 cursor-pointer rounded border-0 bg-transparent"
          aria-label={label}
        />
      </span>
    </label>
  );
}
