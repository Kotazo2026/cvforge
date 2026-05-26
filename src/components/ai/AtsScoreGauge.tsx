interface AtsScoreGaugeProps {
  score: number;
}

export function AtsScoreGauge({ score }: AtsScoreGaugeProps) {
  const clamped = Math.min(100, Math.max(0, score));
  const angle = (clamped / 100) * 360;
  const color =
    clamped >= 75 ? '#34d399' : clamped >= 50 ? '#fbbf24' : '#f87171';

  return (
    <div
      className="relative mx-auto flex h-36 w-36 items-center justify-center"
      role="img"
      aria-label={`Score ATS ${clamped} sur 100`}
    >
      <div
        className="absolute inset-0 rounded-full transition-[background] duration-700 ease-out"
        style={{
          background: `conic-gradient(${color} ${angle}deg, #2a2a36 0deg)`,
        }}
      />
      <div className="absolute inset-[10px] flex flex-col items-center justify-center rounded-full bg-cvforge-surface">
        <span className="text-3xl font-bold tabular-nums text-cvforge-text">{clamped}</span>
        <span className="text-[0.65rem] font-medium uppercase tracking-wider text-cvforge-muted">
          / 100
        </span>
      </div>
    </div>
  );
}
