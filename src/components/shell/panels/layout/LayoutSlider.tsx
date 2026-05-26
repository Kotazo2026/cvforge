'use client';

interface LayoutSliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  unit?: string;
  onChange: (value: number) => void;
}

export function LayoutSlider({
  label,
  value,
  min,
  max,
  step = 1,
  unit = 'px',
  onChange,
}: LayoutSliderProps) {
  return (
    <label className="block space-y-1.5">
      <div className="flex items-center justify-between text-xs">
        <span className="text-cvforge-text">{label}</span>
        <span className="font-medium text-cvforge-muted">
          {value}
          {unit}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="h-1.5 w-full cursor-pointer accent-cvforge-accent"
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={value}
      />
    </label>
  );
}
