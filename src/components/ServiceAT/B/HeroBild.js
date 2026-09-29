import Image from "next/image";
import { Check } from "lucide-react";
import { cn } from "@/components/ui/cn";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import Button from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/SectionHeading";

/**
 * Immersiver Seitenkopf mit Vollbild-Foto – wie PageHero variant="immersive",
 * aber mit rechter Spalte (`aside`, z. B. Live-Karte oder Kennzahl) und breitem
 * Bereich unter dem Text (`children`, z. B. Live-Kennzahlen).
 *
 * props: breadcrumbs, eyebrow, title, lead, image { src, alt, position? },
 *        points [..], actions [{ label, href, icon, variant }], aside (JSX), children,
 *        hoehe "normal" | "hoch", ton "navy" | "tief" (stärkere Abdunklung)
 */
export default function HeroBild({ breadcrumbs, eyebrow, title, lead, image, points = [], actions = [], aside, children, ton = "navy", className }) {
  return (
    <section className={cn("ov-noise relative isolate overflow-hidden bg-navy-950 text-white", className)}>
      {image?.src && (
        <Image
          src={image.src}
          alt={image.alt || ""}
          fill
          priority
          sizes="100vw"
          className="-z-20 object-cover"
          style={image.position ? { objectPosition: image.position } : undefined}
        />
      )}
      <div aria-hidden="true" className={cn("absolute inset-0 -z-10 bg-gradient-to-r", ton === "tief" ? "from-navy-950 via-navy-950/85 to-navy-950/45" : "from-navy-950/95 via-navy-950/75 to-navy-950/20")} />
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-t from-navy-950 via-navy-950/10 to-transparent" />
      <div aria-hidden="true" className="absolute -left-40 bottom-0 -z-10 h-[420px] w-[420px] rounded-full bg-ov-500/20 blur-[120px]" />

      <div className="ov-container pb-14 pt-8 md:pb-20 md:pt-10">
        {breadcrumbs && <Breadcrumbs items={breadcrumbs} dark className="ov-hero-in mb-12 md:mb-20" />}
        <div className={cn("grid items-end gap-10", aside && "lg:grid-cols-[minmax(0,1.25fr)_minmax(0,0.85fr)] lg:gap-14")}>
          <div className="min-w-0 max-w-3xl">
            {eyebrow && (
              <div className="ov-hero-in" style={{ "--ov-delay": "60ms" }}>
                <Eyebrow dark className="mb-5">
                  {eyebrow}
                </Eyebrow>
              </div>
            )}
            <h1 className="ov-h1 ov-hero-in" style={{ "--ov-delay": "120ms" }}>
              {title}
            </h1>
            {lead && (
              <p className="ov-lead ov-hero-in mt-6 max-w-2xl text-white/75" style={{ "--ov-delay": "200ms" }}>
                {lead}
              </p>
            )}
            {points.length > 0 && (
              <ul className="ov-hero-in mt-7 flex flex-wrap gap-2" style={{ "--ov-delay": "260ms" }}>
                {points.map((p) => (
                  <li key={p} className="ov-glass inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-[13.5px] text-white/90">
                    <Check aria-hidden="true" className="h-3.5 w-3.5 text-ov-300" strokeWidth={3} />
                    {p}
                  </li>
                ))}
              </ul>
            )}
            {actions.length > 0 && (
              <div className="ov-hero-in mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap" style={{ "--ov-delay": "320ms" }}>
                {actions.map((a, i) => (
                  <Button key={a.label} href={a.href} variant={a.variant || (i === 0 ? "primary" : "outlineLight")} size="lg" pfeil={i === 0} icon={a.icon}>
                    {a.label}
                  </Button>
                ))}
              </div>
            )}
          </div>
          {aside && (
            <div className="ov-hero-in min-w-0" style={{ "--ov-delay": "380ms" }}>
              {aside}
            </div>
          )}
        </div>
        {children}
      </div>
    </section>
  );
}
