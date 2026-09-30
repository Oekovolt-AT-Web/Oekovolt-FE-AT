// src/components/Mannschaft/MannschaftTeaser.js
//
// Kompakte Teaser-Variante von „Eigene Mannschaft, eigener Maschinenpark“ für die
// Startseite: Bild + zwei Sätze + Link zu /uber-uns#mannschaft. Bewusst niedrig
// gehalten (Ziel: unter 0,8 Bildschirmhöhen). Inhalte/Quellen: src/data/mannschaft.js.
//
// Das Fallback-Foto ist dasselbe eigene Ökovolt-Foto wie im Startseiten-Hero; der Teaser
// zeigt deshalb einen engen Ausschnitt der Montagefläche (teaserZoom/teaserOrigin) –
// ohne die Kunden-Sattelzüge am linken Bildrand.

import Image from "next/image";

import Reveal from "@/components/ui/Reveal";
import Button from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/SectionHeading";
import { cn } from "@/components/ui/cn";
import { AUSSTATTUNG_BESTAETIGT, MANNSCHAFT } from "@/data/mannschaft";
import { mannschaftFotos } from "./mannschaftFoto";
import { mannschaftIcon } from "./icons";

// Die drei Kernaussagen im Bild – nur bestätigte Einträge.
const CHIPS = ["lkw", "traktoren", "montage"];

export default function MannschaftTeaser({ className }) {
  const { haupt } = mannschaftFotos();
  const chips = CHIPS.map((id) => AUSSTATTUNG_BESTAETIGT.find((a) => a.id === id)).filter(Boolean);
  const [t1, t2, t3] = MANNSCHAFT.titel;

  return (
    <section aria-labelledby="mannschaft-teaser-titel" className={cn("relative overflow-hidden bg-white py-10 md:py-20", className)}>
      <div className="ov-container grid items-center gap-7 md:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] md:gap-12 lg:gap-16">
        <Reveal dir="left" className="relative">
          <div className="relative aspect-[2/1] overflow-hidden rounded-[1.5rem] bg-navy-950 shadow-xl md:aspect-[4/3] md:rounded-[2rem] lg:aspect-[16/11]">
            <Image
              src={haupt.src}
              alt={haupt.alt}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover [scale:var(--ov-zoom)] [transform-origin:var(--ov-origin)]"
              style={{
                objectPosition: haupt.teaserPosition || haupt.position,
                "--ov-zoom": haupt.teaserZoom || 1,
                "--ov-origin": haupt.teaserOrigin || "50% 50%",
              }}
            />
            <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-navy-950/85 via-navy-950/10 to-transparent" />
            <div aria-hidden="true" className="absolute inset-0 rounded-[inherit] ring-1 ring-inset ring-white/10" />
            <ul className="absolute inset-x-3 bottom-3 flex flex-wrap gap-1.5 md:inset-x-5 md:bottom-5 md:gap-2">
              {chips.map((c) => {
                const Icon = mannschaftIcon(c.icon);
                return (
                  <li key={c.id} className="inline-flex items-center gap-1.5 rounded-full bg-navy-950/65 px-2.5 py-1 text-[12px] font-semibold text-white ring-1 ring-white/15 backdrop-blur-md md:px-3 md:py-1.5 md:text-[13px]">
                    <Icon aria-hidden="true" className="h-3.5 w-3.5 text-ov-300" />
                    {c.kurz}
                  </li>
                );
              })}
            </ul>
          </div>
        </Reveal>

        <Reveal delay={100} className="min-w-0">
          <Eyebrow>
            <span className="sm:hidden">{MANNSCHAFT.eyebrow.split(" · ")[0]}</span>
            <span className="hidden sm:inline">{MANNSCHAFT.eyebrow}</span>
          </Eyebrow>
          <h2 id="mannschaft-teaser-titel" className="ov-h2 mt-3 text-ink-900 md:mt-4">
            {t1} {t2} <span className="ov-text-gradient">{t3}</span>
          </h2>
          <p className="mt-4 max-w-xl text-[15.5px] leading-relaxed text-ink-600 md:mt-5 md:text-[16.5px]">{MANNSCHAFT.teaser}</p>
          <div className="mt-5 md:mt-8">
            <Button href={`/uber-uns#${MANNSCHAFT.anker}`} variant="secondary" pfeil>
              So arbeiten wir
            </Button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
