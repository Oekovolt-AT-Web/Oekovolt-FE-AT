import { cn } from "@/components/ui/cn";
import W23Pfad from "@/components/Loesungen/w23-pfad";
import { ILLUS, PALETTE, illuFuer } from "@/components/Loesungen/w23-illus";

/**
 * Ablauf als scroll-gezeichnete Prozesslinie (bis zu 6 Schritte in einer Reihe).
 * Die Linie zeichnet sich beim Scrollen (quer ab xl, bei ≤ 4 Schritten ab lg; sonst hochkant),
 * jeder Schritt leuchtet auf, sobald die Linie seinen Knoten erreicht, und seine kleine
 * Strich-Illustration zeichnet sich. Scroll-Logik: w23-pfad.js, Zeichnungen: w23-illus.js.
 * Ohne JS / bei reduzierter Bewegung steht alles im Endzustand.
 *
 * items: [{ icon?, title, text, illu? }] – illu optional: analyse | feld | rechnung | antrag |
 *        vertrag | konzept | bau | betrieb | ausbau (sonst per Stichwort aus dem Titel)
 * tone:  "light" (Standard) | "dark"
 */

const AUS = "cubic-bezier(0.22, 1, 0.36, 1)";
const CSS = `
.w23-zug { stroke-dasharray: 1 1; stroke-dashoffset: 0; }
.w23-geist { opacity: 0; }
.w23-spur-fill { transform-origin: 0 0; will-change: transform; }
.w23-spitze { opacity: 0; transition: opacity 300ms ease; }
.w23-ping { opacity: 0; }
@media (prefers-reduced-motion: no-preference) {
  .w23-pfad[data-bereit] .w23-geist { opacity: 0.22; transition: opacity 900ms ease 500ms; }
  .w23-pfad[data-bereit] .w23-schritt[data-an] .w23-geist { opacity: 0; }
  .w23-pfad[data-bereit] .w23-live .w23-zug { transition: stroke-dashoffset 1300ms cubic-bezier(0.65, 0, 0.35, 1) var(--d, 0ms); }
  .w23-pfad[data-bereit] .w23-live .w23-flaeche { transition: opacity 700ms ${AUS} var(--d, 0ms), transform 700ms ${AUS} var(--d, 0ms); }
  .w23-pfad[data-bereit] .w23-schritt:not([data-an]) .w23-live .w23-zug { stroke-dashoffset: 1; }
  .w23-pfad[data-bereit] .w23-schritt:not([data-an]) .w23-live .w23-flaeche { opacity: 0; transform: translateY(6px); }

  .w23-pfad[data-bereit] .w23-kachel { transition: transform 700ms ${AUS}, box-shadow 700ms ${AUS}, opacity 700ms ${AUS}; }
  .w23-pfad[data-bereit] .w23-schritt:not([data-an]) .w23-kachel { transform: translateY(10px); box-shadow: none; opacity: 0.7; }

  .w23-pfad[data-bereit] .w23-knoten { transition: background-color 500ms ${AUS}, color 500ms ${AUS}, box-shadow 500ms ${AUS}; }
  .w23-pfad[data-ton="light"][data-bereit] .w23-schritt:not([data-an]) .w23-knoten { background-color: #fff; color: var(--color-ink-400); box-shadow: inset 0 0 0 1.5px var(--color-ink-200); }
  .w23-pfad[data-ton="dark"][data-bereit] .w23-schritt:not([data-an]) .w23-knoten { background-color: var(--color-navy-900); color: rgba(255,255,255,0.45); box-shadow: inset 0 0 0 1.5px rgba(255,255,255,0.18); }
  .w23-pfad[data-bereit] .w23-schritt[data-an] .w23-ping { animation: w23-ping 1100ms ${AUS} both; }

  .w23-pfad[data-bereit] .w23-titel { transition: opacity 500ms ${AUS}; }
  .w23-pfad[data-bereit] .w23-schritt:not([data-an]) .w23-titel { opacity: 0.55; }

  .w23-pfad[data-bereit] .w23-ziel { transition: opacity 600ms ${AUS}, transform 600ms ${AUS}; }
  .w23-pfad[data-bereit] .w23-ziel:not([data-an]) { opacity: 0.35; transform: scale(0.9); }
  .w23-pfad[data-bereit] .w23-ziel[data-an] .w23-ping { animation: w23-ping 1100ms ${AUS} both; }
}
.w23-schritt:hover .w23-kachel-bild { transform: translateY(-3px); }
.w23-kachel-bild { transition: transform 600ms ${AUS}; }
@keyframes w23-ping { 0% { opacity: 0.7; transform: scale(1); } 100% { opacity: 0; transform: scale(2.1); } }
`;

/** Klassen je Umbruchpunkt (statisch, damit Tailwind sie findet). */
const QUER = {
  lg: {
    ab: 1024,
    spurX: "lg:block",
    spurY: "lg:hidden",
    ol: "lg:gap-6",
    li: "lg:flex lg:flex-col",
    knoten: "lg:order-2 lg:mt-6",
    kachel: "lg:order-1 lg:h-[150px] lg:w-full",
    inhalt: "lg:contents",
    text: "lg:order-3 lg:mt-5",
    zielX: "lg:flex",
    zielY: "lg:hidden",
    sm: "sm:max-lg:grid sm:max-lg:grid-cols-[220px_minmax(0,1fr)] sm:max-lg:items-start sm:max-lg:gap-6",
  },
  xl: {
    ab: 1280,
    spurX: "xl:block",
    spurY: "xl:hidden",
    ol: "xl:gap-6",
    li: "xl:flex xl:flex-col",
    knoten: "xl:order-2 xl:mt-6",
    kachel: "xl:order-1 xl:h-[150px] xl:w-full",
    inhalt: "xl:contents",
    text: "xl:order-3 xl:mt-5",
    zielX: "xl:flex",
    zielY: "xl:hidden",
    sm: "sm:max-xl:grid sm:max-xl:grid-cols-[220px_minmax(0,1fr)] sm:max-xl:items-start sm:max-xl:gap-6",
  },
};
const SPALTEN_LG = { 2: "lg:grid-cols-2", 3: "lg:grid-cols-3", 4: "lg:grid-cols-4" };
const SPALTEN_XL = { 5: "xl:grid-cols-5", 6: "xl:grid-cols-6" };

function Spitze({ achse, dunkel }) {
  return (
    <span data-spitze="" aria-hidden="true" className={cn("w23-spitze absolute h-0 w-0", achse === "x" ? "left-0 top-1/2" : "left-1/2 top-0")}>
      <span className={cn("absolute -left-3 -top-3 block h-6 w-6 rounded-full", dunkel ? "bg-ov-400/30" : "bg-ov-400/35")} />
      <span className={cn("absolute -left-[5px] -top-[5px] block h-2.5 w-2.5 rounded-full ring-[3px]", dunkel ? "bg-white ring-ov-400" : "bg-white ring-ov-500")} />
    </span>
  );
}

function Ziel({ className, dunkel }) {
  return (
    <span data-ziel="" aria-hidden="true" className={cn("w23-ziel h-11 w-11 items-center justify-center rounded-full", dunkel ? "bg-ov-500 text-white shadow-[0_0_30px_-6px_rgba(140,186,88,0.7)]" : "bg-navy-900 text-ov-300 shadow-[0_10px_24px_-10px_rgba(3,18,43,0.6)]", className)}>
      <span className={cn("w23-ping absolute inset-0 rounded-full ring-2", dunkel ? "ring-ov-300" : "ring-ov-400")} />
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M13 2 4 14h7l-1 8 9-12h-7z" />
      </svg>
    </span>
  );
}

export default function AblaufLeiste({ items = [], tone = "light", className }) {
  const dunkel = tone === "dark";
  const n = items.length;
  const q = n <= 4 ? QUER.lg : QUER.xl;
  const spalten = n <= 4 ? SPALTEN_LG[n] || "lg:grid-cols-4" : SPALTEN_XL[n] || "xl:grid-cols-6";
  const p = dunkel ? PALETTE.dunkel : PALETTE.hell;

  return (
    <div data-blk="ablauf-leiste" className={cn("relative", className)}>
      <style>{CSS}</style>
      <W23Pfad querAb={q.ab} data-ton={dunkel ? "dark" : "light"} className="w23-pfad relative">
        {/* Linie quer: von Knoten 01 bis zur Endmarke (Knotenmitte = 150 + 24 + 22 px) */}
        <div data-spur="x" aria-hidden="true" className={cn("absolute left-[22px] right-[22px] top-[196px] hidden h-[2px] -translate-y-1/2", q.spurX)}>
          <div className={cn("absolute inset-0 rounded-full opacity-70", dunkel ? "bg-[repeating-linear-gradient(90deg,rgba(255,255,255,0.3)_0_6px,transparent_6px_12px)]" : "bg-[repeating-linear-gradient(90deg,var(--color-ov-300)_0_6px,transparent_6px_12px)]")} />
          <div data-fill="" className={cn("w23-spur-fill absolute -inset-y-px inset-x-0 rounded-full bg-gradient-to-r", dunkel ? "from-ov-300 via-ov-400 to-ov-500 shadow-[0_0_14px_rgba(140,186,88,0.55)]" : "from-ov-300 via-ov-500 to-ov-600 shadow-[0_0_12px_rgba(102,153,51,0.45)]")} />
          <Spitze achse="x" dunkel={dunkel} />
        </div>
        {/* Linie hochkant */}
        <div data-spur="y" aria-hidden="true" className={cn("absolute bottom-[22px] left-[21px] top-[22px] w-[2px]", q.spurY)}>
          <div className={cn("absolute inset-0 rounded-full opacity-70", dunkel ? "bg-[repeating-linear-gradient(180deg,rgba(255,255,255,0.3)_0_6px,transparent_6px_12px)]" : "bg-[repeating-linear-gradient(180deg,var(--color-ov-300)_0_6px,transparent_6px_12px)]")} />
          <div data-fill="" className="w23-spur-fill absolute -inset-x-px inset-y-0 rounded-full bg-gradient-to-b from-ov-300 via-ov-500 to-ov-600" />
          <Spitze achse="y" dunkel={dunkel} />
        </div>

        <ol className={cn("relative grid gap-10", q.ol, spalten)}>
          {items.map((s, i) => {
            const Icon = s.icon;
            const Illu = ILLUS[illuFuer(s, i)];
            return (
              <li key={s.title} data-schritt="" className={cn("w23-schritt group relative grid grid-cols-[44px_minmax(0,1fr)] gap-x-4", q.li)}>
                {/* Knoten */}
                <span
                  data-knoten=""
                  aria-hidden="true"
                  className={cn(
                    "w23-knoten relative z-10 col-start-1 row-start-1 flex h-11 w-11 items-center justify-center rounded-full font-display text-[14px] font-extrabold",
                    dunkel ? "bg-ov-500 text-white shadow-[0_0_24px_-6px_rgba(140,186,88,0.8)]" : "bg-ov-600 text-white shadow-[0_8px_20px_-8px_rgba(85,130,39,0.8)]",
                    q.knoten
                  )}
                >
                  <span className={cn("w23-ping absolute inset-0 rounded-full ring-2", dunkel ? "ring-ov-300" : "ring-ov-500")} />
                  {String(i + 1).padStart(2, "0")}
                </span>

                <div className={cn("col-start-2 row-start-1 min-w-0", q.inhalt, q.sm)}>
                  {/* Illustration */}
                  <div
                    aria-hidden="true"
                    className={cn(
                      "w23-kachel relative h-[128px] overflow-hidden rounded-[1.25rem] sm:h-[140px]",
                      dunkel
                        ? "bg-gradient-to-b from-navy-900/80 to-navy-950/80 shadow-[0_24px_48px_-30px_rgba(0,0,0,0.6)] ring-1 ring-white/[0.12]"
                        : "bg-gradient-to-b from-ov-50 to-white shadow-[0_24px_48px_-30px_rgba(3,40,90,0.3)] ring-1 ring-ov-200/70",
                      q.kachel
                    )}
                  >
                    <span aria-hidden="true" className={cn("absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent to-transparent", dunkel ? "via-white/25" : "via-white")} />
                    {Icon && (
                      <span className={cn("absolute left-3 top-3 z-10 flex h-7 w-7 items-center justify-center rounded-lg", dunkel ? "bg-white/10 text-ov-300" : "bg-white text-ov-600 ring-1 ring-ov-200/80")}>
                        <Icon className="h-3.5 w-3.5" strokeWidth={2} />
                      </span>
                    )}
                    <div className="w23-kachel-bild absolute inset-x-3 bottom-2 top-5">
                      <div className="w23-geist absolute inset-0">
                        <Illu p={p} />
                      </div>
                      <div className="w23-live absolute inset-0">
                        <Illu p={p} />
                      </div>
                    </div>
                  </div>

                  {/* Text */}
                  <div className={cn("mt-5 min-w-0 sm:mt-0", q.text)}>
                    <h3 className={cn("w23-titel font-display text-[17.5px] font-bold leading-snug tracking-tight", dunkel ? "text-white" : "text-ink-900")}>{s.title}</h3>
                    <p className={cn("mt-2 text-[14.5px] leading-relaxed", dunkel ? "text-white/65" : "text-ink-600")}>{s.text}</p>
                  </div>
                </div>
              </li>
            );
          })}
        </ol>

        {/* Endmarke: quer am rechten Ende der Linie, hochkant am Fuß */}
        <Ziel dunkel={dunkel} className={cn("absolute right-0 top-[196px] hidden -translate-y-1/2", q.zielX)} />
        <Ziel dunkel={dunkel} className={cn("relative mt-10 flex", q.zielY)} />
      </W23Pfad>
    </div>
  );
}
