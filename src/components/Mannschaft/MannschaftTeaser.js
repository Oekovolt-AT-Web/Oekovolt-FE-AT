// src/components/Mannschaft/MannschaftTeaser.js
//
// Startseiten-Teaser „Eigene Mannschaft, eigener Maschinenpark“ (nur Startseite).
// Idee: Die dreizeilige Überschrift „Unsere Leute. Unsere Fahrzeuge. Unsere Technik.“ ist
// zugleich das Register der Kette darunter – vom eigenen Lkw über die Montageteams bis zu
// Parkregler und SCADA. Fährt man mit der Maus über eine Zeile oder eine Gruppe, hebt sich
// das Gegenstück hervor (reines CSS über :has). Strichgrafiken zeichnen sich beim Eintritt.
// Inhalte/Quellen: src/data/mannschaft.js (nur bestätigte Einträge).
//
// Foto: Liegt ein echtes Fahrzeugfoto vor (mannschaftFotos), wird es unverändert gezeigt.
// Sonst das eigene Ökovolt-Luftbild mit engem Ausschnitt der Montagefläche – die Kunden-
// Sattelzüge am linken Bildrand liegen außerhalb des Ausschnitts (darf nicht als „unser Lkw“
// gelesen werden).

import Image from "next/image";
import { Camera } from "lucide-react";

import Button from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/SectionHeading";
import { cn } from "@/components/ui/cn";
import { MANNSCHAFT } from "@/data/mannschaft";
import { mannschaftFotos } from "./mannschaftFoto";
import S04Buehne from "@/components/Startseite/s04-Buehne";
import { KETTE, KettenGrafik } from "@/components/Startseite/s04-MannschaftKette";
import { S04_BASIS, d } from "@/components/Startseite/s04-stil";

// Zuordnung Überschriftzeile → Gruppe der Kette (Reihenfolge wie MANNSCHAFT.titel)
const ZEILEN_GRUPPE = ["leute", "fahrzeuge", "technik"];

const CSS = `
${S04_BASIS}
.s04m-ziel{transition:opacity .45s cubic-bezier(.22,1,.36,1),color .45s}
.s04m-knoten .s04m-ill{color:var(--color-ink-800);transition:transform .5s cubic-bezier(.22,1,.36,1),color .4s}
@media (hover:hover){
  .s04m-knoten:hover .s04m-ill{transform:translate3d(0,-3px,0);color:var(--color-ov-700)}
${ZEILEN_GRUPPE.map(
  (g) => `  .s04m:has([data-s04m="${g}"]:hover) [data-s04m]:not([data-s04m="${g}"]){opacity:.28}
  .s04m:has([data-s04m="${g}"]:hover) [data-s04m-gruppe="${g}"] .s04m-ill{color:var(--color-ov-700)}`
).join("\n")}
}
.s04m-punkt{transform-box:fill-box}
@media (prefers-reduced-motion:reduce){.s04m-knoten .s04m-ill,.s04m-ziel{transition:none}}
`;

export default function MannschaftTeaser({ className }) {
  const { haupt, eigenesFahrzeug } = mannschaftFotos();
  // Ausschnitt des Luftbilds: sichtbar ist nur der Bereich rechts von ~29 % der Bildbreite –
  // die Kunden-Sattelzüge (ca. 18–26 %) liegen sicher außerhalb.
  const bild = eigenesFahrzeug
    ? { position: haupt.position || "50% 50%", zoom: 1, origin: "50% 50%" }
    : { position: "100% 50%", zoom: 1.4, origin: "100% 46%" };
  const zeilen = MANNSCHAFT.titel;
  let knotenNr = 0;

  return (
    <section
      data-start="mannschaft"
      aria-labelledby="mannschaft-teaser-titel"
      className={cn("s04m relative overflow-hidden bg-white py-16 md:py-24", className)}
    >
      <style>{CSS}</style>
      <div aria-hidden="true" className="ov-grid-bg-light pointer-events-none absolute inset-x-0 top-0 h-[520px] opacity-70" />

      <S04Buehne className="ov-container relative">
        {/* ---------- Kopf ---------- */}
        <div className="grid gap-7 lg:grid-cols-12 lg:items-end lg:gap-10">
          <div className="lg:col-span-7">
            <div className="s04-auf" style={d(0)}>
              <Eyebrow>
                <span className="sm:hidden">{MANNSCHAFT.eyebrow.split(" · ")[0]}</span>
                <span className="hidden sm:inline">{MANNSCHAFT.eyebrow}</span>
              </Eyebrow>
            </div>
            <h2
              id="mannschaft-teaser-titel"
              className="mt-4 font-display text-[clamp(2.35rem,1.4rem+3.6vw,4.5rem)] font-extrabold leading-[1.02] tracking-[-0.038em] text-ink-900 md:mt-5"
            >
              {zeilen.map((z, i) => (
                <span key={z} className="block overflow-hidden pb-[0.09em] -mb-[0.09em]">
                  <span
                    data-s04m={ZEILEN_GRUPPE[i]}
                    className={cn("s04-zeile s04m-ziel inline-block cursor-default", i === zeilen.length - 1 && "ov-text-gradient")}
                    style={d(120 + i * 130)}
                  >
                    {z}
                  </span>
                  {i < zeilen.length - 1 && " "}
                </span>
              ))}
            </h2>
          </div>
          <div className="lg:col-span-5 lg:pb-3">
            <p className="s04-hoch max-w-[34rem] text-[16px] leading-relaxed text-ink-600 md:text-[17.5px]" style={d(450)}>
              {MANNSCHAFT.teaser}
            </p>
            <div className="s04-hoch mt-6 md:mt-8" style={d(560)}>
              <Button href={`/uber-uns#${MANNSCHAFT.anker}`} variant="secondary" pfeil>
                So arbeiten wir
              </Button>
            </div>
          </div>
        </div>

        {/* ---------- Bild ---------- */}
        <div className="relative mt-10 md:mt-16">
          <div className="s04-auf relative aspect-[4/3] overflow-hidden rounded-[1.75rem] bg-navy-950 shadow-[0_40px_80px_-40px_rgba(3,18,43,0.55)] sm:aspect-[16/8] md:rounded-[2rem] lg:aspect-[21/8]" style={d(250)}>
            <div className="s04-zoom absolute inset-0" style={d(250)}>
              <Image
                src={haupt.src}
                alt={haupt.alt}
                fill
                sizes="(max-width: 1280px) 100vw, 1216px"
                className="object-cover [scale:var(--ov-zoom)] [transform-origin:var(--ov-origin)]"
                style={{ objectPosition: bild.position, "--ov-zoom": bild.zoom, "--ov-origin": bild.origin }}
              />
            </div>
            <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-navy-950/70 via-navy-950/5 to-navy-950/10" />
            <div aria-hidden="true" className="absolute inset-0 rounded-[inherit] ring-1 ring-inset ring-white/10" />
            {haupt.unterschrift && (
              <p className="absolute left-4 top-4 inline-flex max-w-[calc(100%-2rem)] items-center gap-2 rounded-full bg-navy-950/55 px-3 py-1.5 text-[12px] font-medium text-white/90 ring-1 ring-white/15 backdrop-blur-md md:left-6 md:top-6 md:text-[13px]">
                <Camera aria-hidden="true" className="h-3.5 w-3.5 shrink-0 text-ov-300" />
                <span className="truncate">{haupt.unterschrift}</span>
              </p>
            )}
          </div>

          {/* ---------- Kette: Fahrzeuge → Leute → Technik ---------- */}
          <S04Buehne className="relative z-10 mx-3 -mt-14 rounded-[1.5rem] bg-white p-5 shadow-[0_30px_70px_-30px_rgba(3,18,43,0.35)] ring-1 ring-ink-100 sm:mx-6 sm:-mt-20 md:mx-10 md:p-8 lg:mx-14 lg:-mt-28 lg:px-10 lg:py-9">
            <div className="grid gap-7 md:grid-cols-5 md:gap-x-6 md:gap-y-0">
              {KETTE.map((g, gi) => (
                <div
                  key={g.gruppe}
                  data-s04m={g.gruppe}
                  data-s04m-gruppe={g.gruppe}
                  className={cn("s04m-ziel relative min-w-0", g.eintraege.length === 2 ? "md:col-span-2" : "md:col-span-1")}
                >
                  {/* Gruppenkopf mit Klammer */}
                  <p className="s04-auf flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.16em] text-ov-700" style={d(150 + gi * 260)}>
                    {g.titel}
                  </p>
                  <span aria-hidden="true" className="s04-skx mt-2.5 hidden h-px w-[calc(100%-0.5rem)] bg-ov-300 md:block" style={d(200 + gi * 260, { "--s04-t": ".9s" })} />

                  <ul className={cn("mt-4 grid gap-5 md:mt-6", g.eintraege.length === 2 ? "sm:grid-cols-2 sm:gap-6" : "")}>
                    {g.eintraege.map((e) => {
                      const nr = knotenNr++;
                      return (
                        <li key={e.id} className="s04m-knoten flex items-start gap-4 md:block">
                          <span className="block w-[84px] shrink-0 md:w-auto">
                            <KettenGrafik id={e.id} start={350 + nr * 220} />
                          </span>
                          <span className="block min-w-0 md:mt-4">
                            <span className="s04-hoch block font-display text-[16.5px] font-bold leading-snug text-ink-900" style={d(500 + nr * 220)}>
                              {e.kurz}
                            </span>
                            <span className="s04-hoch mt-1 block text-[14px] leading-snug text-ink-500" style={d(560 + nr * 220)}>
                              {e.text}
                            </span>
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                  {/* Trennlinie zur nächsten Gruppe (Desktop) */}
                  {gi < KETTE.length - 1 && <span aria-hidden="true" className="absolute -right-3 bottom-1 top-9 hidden w-px bg-ink-100 md:block" />}
                </div>
              ))}
            </div>
          </S04Buehne>
        </div>
      </S04Buehne>
    </section>
  );
}
