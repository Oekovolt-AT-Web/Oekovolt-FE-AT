import { cn } from "./cn";

/**
 * Endloses Laufband (z. B. Herstellerlogos, Vertrauenspunkte).
 * Inhalte werden doppelt gerendert; die zweite Kopie ist für Screenreader verborgen.
 * Pausiert bei Hover, steht bei reduzierter Bewegung still.
 */
export default function Marquee({ children, className, speed = 40, fade = "from-white" }) {
  return (
    <div className={cn("group relative overflow-hidden", className)}>
      <div aria-hidden="true" className={cn("pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r to-transparent md:w-32", fade)} />
      <div aria-hidden="true" className={cn("pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l to-transparent md:w-32", fade)} />
      <div
        className="flex w-max animate-ov-marquee items-center group-hover:[animation-play-state:paused] motion-reduce:animate-none"
        style={{ animationDuration: `${speed}s` }}
      >
        <div className="flex shrink-0 items-center gap-12 pr-12 md:gap-16 md:pr-16">{children}</div>
        <div aria-hidden="true" className="flex shrink-0 items-center gap-12 pr-12 md:gap-16 md:pr-16">
          {children}
        </div>
      </div>
    </div>
  );
}
