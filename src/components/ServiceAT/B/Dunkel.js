import { cn } from "@/components/ui/cn";

/**
 * Dunkle Kontrast-Sektion mit Raster, Körnung und zwei weichen Lichtscheinen.
 * props: id, space "md" | "lg", glow "links" | "rechts" | "beide", className, containerClassName
 */
export default function Dunkel({ id, space = "lg", glow = "beide", className, containerClassName, children, ...rest }) {
  return (
    <section
      id={id}
      className={cn("ov-noise relative isolate overflow-hidden bg-navy-950 text-white", space === "lg" ? "py-20 md:py-28" : "py-16 md:py-24", id && "scroll-mt-24", className)}
      {...rest}
    >
      <div aria-hidden="true" className="ov-grid-bg absolute inset-0 -z-10" />
      {glow !== "rechts" && <div aria-hidden="true" className="absolute -left-40 top-16 -z-10 h-[480px] w-[480px] rounded-full bg-ov-500/20 blur-[130px]" />}
      {glow !== "links" && <div aria-hidden="true" className="absolute -right-32 bottom-0 -z-10 h-[420px] w-[420px] rounded-full bg-navy-400/25 blur-[130px]" />}
      <div className={cn("ov-container relative", containerClassName)}>{children}</div>
    </section>
  );
}
