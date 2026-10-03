import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/components/ui/cn";
import W22Sicht from "../w22-sicht";

/**
 * Foto-Bento der Lösungsseiten (Präfix w22b) – im Bildsystem des Startseiten-Bentos.
 * items: [{ titel, text, bild, alt, href?, tag?, icon?, format: "gross" | "breit" | "hoch" | "normal", position? }]
 * Raster: lg 4 Spalten, Zeilenhöhe fest – "gross" = 2×2, "breit" = 2×1, "hoch" = 1×2.
 * spalten={3}: gleichmäßiges 3er-Raster (Formate "breit"/"gross" dann 2 Spalten).
 * Die Seite ist dafür verantwortlich, dass die Formate das Raster lückenlos füllen.
 *
 * Aufbau beim Eintritt (einmal, gestaffelt): ein Vorhang mit Lichtkante gibt das Foto von unten
 * nach oben frei, das Foto setzt sich aus leichtem Zoom, danach steigt der Text auf.
 * Hover: ruhiger Zoom, Lichtkante und Schein folgen dem Mauszeiger, Indexlinie wächst; verlinkte
 * Karten heben sich und der Pfeil füllt sich. Mobil: wischbare Reihe mit Anschnitt (Scroll-Snap).
 */
const FORMAT = {
  gross: "sm:col-span-2 lg:col-span-2 lg:row-span-2",
  breit: "sm:col-span-2 lg:col-span-2",
  hoch: "lg:row-span-2",
  normal: "",
};

export default function FotoBento({ items = [], spalten = 4, className, zeilenhoehe = spalten === 3 ? "lg:auto-rows-[250px]" : "lg:auto-rows-[232px]" }) {
  return (
    <>
      <style href="w22-fotobento" precedence="w22">{CSS}</style>
      <W22Sicht
        as="ul"
        licht
        schwelle={0.12}
        data-blk="fotobento"
        className={cn(
          "w22b ov-no-scrollbar -mx-5 flex snap-x snap-mandatory scroll-px-5 gap-3 overflow-x-auto px-5 pb-1 sm:mx-0 sm:grid sm:grid-cols-2 sm:gap-4 sm:overflow-visible sm:px-0 sm:pb-0 md:gap-5",
          spalten === 3 ? "lg:grid-cols-3" : "lg:grid-cols-4",
          zeilenhoehe,
          className
        )}
      >
        {items.map((it, i) => (
          <li
            key={it.titel}
            className={cn("w22b-zelle h-[25rem] w-[84%] shrink-0 snap-start sm:h-auto sm:min-h-[280px] sm:w-auto lg:min-h-0", FORMAT[it.format || "normal"])}
            style={{ "--w22b-i": i }}
          >
            <Karte {...it} nr={i + 1} gross={it.format === "gross"} breit={it.format === "breit"} spalten={spalten} />
          </li>
        ))}
      </W22Sicht>
    </>
  );
}

function Karte({ titel, text, bild, alt, href, tag, icon: Icon, gross, breit, position, nr, spalten }) {
  const sizes = gross || breit
    ? "(min-width: 1024px) 50vw, (min-width: 640px) 100vw, 84vw"
    : spalten === 3
      ? "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 84vw"
      : "(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 84vw";

  const inhalt = (
    <>
      <div className="w22b-setzen absolute inset-0">
        <div className="w22b-zoom absolute inset-0">
          <Image src={bild} alt={alt || ""} fill sizes={sizes} className="object-cover" style={position ? { objectPosition: position } : undefined} />
        </div>
      </div>
      <div aria-hidden="true" className={cn("w22b-verlauf absolute inset-0", gross && "w22b-verlauf-gross")} />
      <div aria-hidden="true" className="w22b-schein" />

      <div className="w22b-inhalt relative z-10 flex h-full flex-col justify-between">
        <div className="flex items-start justify-between gap-3">
          {tag ? (
            <span className="w22b-tag">{tag}</span>
          ) : Icon ? (
            <span className="w22b-chip">
              <Icon aria-hidden="true" className="h-5 w-5" strokeWidth={1.8} />
            </span>
          ) : (
            <span />
          )}
          {href && (
            <span aria-hidden="true" className="w22b-pfeil">
              <ArrowUpRight className="h-[18px] w-[18px]" strokeWidth={2.2} />
            </span>
          )}
        </div>

        <div className="min-w-0">
          <div aria-hidden="true" className="mb-3 flex items-center gap-3">
            <span className="ov-num font-display text-[12px] font-bold tracking-[0.06em] text-ov-300">{String(nr).padStart(2, "0")}</span>
            <span className="relative h-px w-14 overflow-hidden bg-white/20">
              <span className="w22b-linie absolute inset-0 bg-ov-300" />
            </span>
          </div>
          <h3 className={cn("w22b-titel font-display font-bold text-white", gross ? "w22b-titel-gross" : "")}>{titel}</h3>
          {text && <p className={cn("w22b-text mt-2 text-white/76", gross ? "max-w-md text-[15.5px] md:mt-3" : "text-[14px]")}>{text}</p>}
        </div>
      </div>

      <span aria-hidden="true" className="w22b-kante">
        <span className="w22b-kante-licht" />
      </span>
      <span aria-hidden="true" className="w22b-vorhang" />
    </>
  );

  return href ? (
    <Link href={href} data-w22-licht="" className="w22b-karte w22b-link group">
      {inhalt}
    </Link>
  ) : (
    <div data-w22-licht="" className="w22b-karte group">
      {inhalt}
    </div>
  );
}

const CSS = `
.w22b{--w22b-e:cubic-bezier(.22,1,.36,1)}
.w22b-karte{position:relative;isolation:isolate;display:block;height:100%;overflow:hidden;
  border-radius:1.5rem;background:var(--color-navy-950);color:#fff;padding:20px;
  box-shadow:0 1px 2px rgba(3,18,43,.08),0 26px 50px -30px rgba(3,18,43,.55);
  transition:transform 600ms var(--w22b-e),box-shadow 600ms var(--w22b-e),opacity 400ms ease-out;
  -webkit-tap-highlight-color:transparent}
@media (min-width:640px){.w22b-karte{border-radius:1.75rem;padding:24px}}
@media (min-width:1024px){.w22b-karte{padding:26px}}
.w22b-link:focus-visible{outline:2px solid var(--color-ov-500);outline-offset:4px}

/* Foto */
.w22b-setzen{transform-origin:50% 60%;transition:transform 1800ms var(--w22b-e) calc(var(--w22b-i,0) * 110ms)}
.w22b-zoom{transition:transform 1400ms var(--w22b-e)}
.w22b-verlauf{pointer-events:none;background:
  linear-gradient(to bottom,rgba(3,18,43,.5) 0,rgba(3,18,43,0) 120px),
  linear-gradient(to top,rgba(3,18,43,.96) 0%,rgba(3,18,43,.8) 32%,rgba(3,18,43,.3) 64%,rgba(3,18,43,.04) 88%)}
.w22b-verlauf-gross{background:
  linear-gradient(to bottom,rgba(3,18,43,.5) 0,rgba(3,18,43,0) 120px),
  linear-gradient(to top,rgba(3,18,43,.95) 0%,rgba(3,18,43,.72) 26%,rgba(3,18,43,.16) 54%,rgba(3,18,43,0) 74%)}
@media (max-width:639px){.w22b-verlauf,.w22b-verlauf-gross{background:
  linear-gradient(to bottom,rgba(3,18,43,.45) 0,rgba(3,18,43,0) 110px),
  linear-gradient(to top,rgba(3,18,43,.97) 0%,rgba(3,18,43,.88) 42%,rgba(3,18,43,.45) 68%,rgba(3,18,43,.05) 90%)}}

/* Inhalt */
.w22b-titel{font-size:20px;line-height:1.15;letter-spacing:-.02em;text-wrap:balance}
.w22b-titel-gross{font-size:clamp(25px,1.2rem + 1.1vw,34px);line-height:1.08;letter-spacing:-.028em}
.w22b-text{line-height:1.55;text-wrap:pretty;color:rgba(255,255,255,.76)}
.w22b-chip{display:flex;align-items:center;justify-content:center;flex-shrink:0;width:44px;height:44px;border-radius:14px;
  color:var(--color-ov-300);background:rgba(3,18,43,.5);box-shadow:inset 0 0 0 1px rgba(255,255,255,.16);
  -webkit-backdrop-filter:blur(10px);backdrop-filter:blur(10px);transition:background-color 400ms,color 400ms,box-shadow 400ms}
.w22b-tag{padding:5px 12px;border-radius:999px;font-size:11px;font-weight:600;letter-spacing:.12em;text-transform:uppercase;line-height:1.4;
  color:rgba(255,255,255,.88);background:rgba(3,18,43,.5);box-shadow:inset 0 0 0 1px rgba(255,255,255,.16);
  -webkit-backdrop-filter:blur(10px);backdrop-filter:blur(10px)}
.w22b-pfeil{display:flex;align-items:center;justify-content:center;flex-shrink:0;width:44px;height:44px;border-radius:999px;color:#fff;
  background:rgba(3,18,43,.3);box-shadow:inset 0 0 0 1px rgba(255,255,255,.3);
  transition:background-color 400ms,color 400ms,box-shadow 400ms}
.w22b-pfeil svg{transition:transform 500ms var(--w22b-e)}
.w22b-linie{transform-origin:0 50%;transform:scaleX(.3);transition:transform 700ms var(--w22b-e)}

/* Licht: Schein und Lichtkante folgen dem Zeiger */
.w22b-schein,.w22b-kante-licht{position:absolute;left:0;top:0;pointer-events:none;border-radius:999px;
  transform:translate3d(calc(var(--w22-mx,50%) - 50%),calc(var(--w22-my,0px) - 50%),0)}
.w22b-schein{width:520px;height:520px;z-index:0;opacity:0;transition:opacity 500ms;
  background:radial-gradient(circle,rgba(255,255,255,.15) 0%,rgba(255,255,255,.05) 35%,transparent 65%)}
.w22b-kante{position:absolute;inset:0;z-index:15;pointer-events:none;border-radius:inherit;padding:1.5px;overflow:hidden;
  box-shadow:inset 0 0 0 1px rgba(255,255,255,.1);
  -webkit-mask:linear-gradient(#000 0 0) content-box,linear-gradient(#000 0 0);-webkit-mask-composite:xor;
  mask:linear-gradient(#000 0 0) content-box exclude,linear-gradient(#000 0 0)}
.w22b-kante-licht{width:480px;height:480px;opacity:0;transition:opacity 500ms;
  background:radial-gradient(circle,#f3ffe4 0%,#aed083 20%,rgba(140,186,88,.4) 40%,transparent 66%)}

@media (hover:hover){
  .w22b-karte:hover .w22b-schein,.w22b-karte:hover .w22b-kante-licht{opacity:1}
  .w22b-karte:hover .w22b-linie{transform:scaleX(1)}
  .w22b-karte:hover .w22b-chip{background:rgba(3,18,43,.7);color:#d9f0b8;box-shadow:inset 0 0 0 1px rgba(174,208,131,.45)}
  .w22b-link:hover{transform:translate3d(0,-4px,0);box-shadow:0 2px 6px rgba(3,18,43,.1),0 40px 70px -34px rgba(3,18,43,.7)}
  .w22b-link:hover .w22b-pfeil{background:#fff;color:var(--color-ink-900);box-shadow:inset 0 0 0 1px #fff}
  .w22b-link:hover .w22b-pfeil svg{transform:rotate(45deg)}
}
@media (hover:hover) and (prefers-reduced-motion:no-preference){
  .w22b-karte:hover .w22b-zoom{transform:scale(1.06)}
}
.w22b-link:focus-visible .w22b-linie{transform:scaleX(1)}

/* Aufdecken (nur mit JS und ohne reduzierte Bewegung – Ausgangszustand erst nach der Hydrierung) */
.w22b-vorhang{position:absolute;inset:-2px;z-index:20;pointer-events:none;background:var(--w22b-grund,#fff);transform:translate3d(0,-102%,0)}
.w22b-vorhang::after{content:"";position:absolute;left:0;right:0;bottom:0;height:2px;
  background:linear-gradient(90deg,transparent,#aed083 18%,#ffd873 50%,#aed083 82%,transparent);box-shadow:0 0 22px 3px rgba(174,208,131,.55)}
.w22b-inhalt{transition:opacity 800ms var(--w22b-e),transform 900ms var(--w22b-e);transition-delay:calc(var(--w22b-i,0) * 110ms + 620ms)}
@media (prefers-reduced-motion:no-preference){
  [data-w22-bereit]:not([data-w22-an]) .w22b-karte{opacity:0;box-shadow:none}
  [data-w22-bereit]:not([data-w22-an]) .w22b-vorhang{transform:translate3d(0,0,0)}
  [data-w22-bereit]:not([data-w22-an]) .w22b-setzen{transform:scale(1.14)}
  [data-w22-bereit]:not([data-w22-an]) .w22b-inhalt{opacity:0;transform:translate3d(0,16px,0)}
  [data-w22-an] .w22b-vorhang{transition:transform 1150ms cubic-bezier(.76,0,.24,1) calc(var(--w22b-i,0) * 110ms + 100ms)}
}
@media (prefers-reduced-motion:reduce){
  .w22b-karte,.w22b-setzen,.w22b-zoom,.w22b-inhalt,.w22b-pfeil svg{transition:none!important}
  .w22b-vorhang{display:none}
}
`;
