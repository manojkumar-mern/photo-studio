// Shown by Next.js while the /work route segment suspends
export default function WorkLoading() {
  return (
    <div
      className="min-h-screen bg-background flex items-center justify-center"
      aria-label="Loading gallery"
      role="status"
    >
      <div className="flex flex-col items-center gap-5">
        {/* Pulsing aperture ring */}
        <div className="relative w-12 h-12" aria-hidden="true">
          <div className="absolute inset-0 rounded-full border border-primary/30 animate-ping" />
          <div className="absolute inset-2 rounded-full border border-primary/60" />
        </div>
        <span className="text-[10px] font-sans tracking-[0.3em] text-muted-foreground uppercase">
          Loading
        </span>
      </div>
    </div>
  );
}
