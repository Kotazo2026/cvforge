'use client';

export function EditorLoading() {
  return (
    <div
      className="flex h-screen flex-col items-center justify-center gap-4 bg-cvforge-bg text-cvforge-muted"
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <div
        className="h-10 w-10 animate-spin rounded-full border-2 border-cvforge-border border-t-cvforge-accent-blue"
        aria-hidden
      />
      <p className="text-sm font-medium">Chargement de l&apos;éditeur…</p>
    </div>
  );
}
