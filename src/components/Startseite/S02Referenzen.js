// src/components/Startseite/S02Referenzen.js
//
// Startseite – Abschnitt: Referenz-Laufband.
// Eingebunden in src/app/page.js.
//
// Idee: ruhiger Vertrauensmoment direkt nach dem Hero. Links die Überschrift, rechts eine
// Kennzahl (Anzahl der hier gezeigten Betriebe, abgeleitet aus REFERENZ_UNTERNEHMEN), darunter
// eine Branchen-Legende im Stil der TV-Folie „Branchen“ (ein Modul = ein Betrieb) und ein
// typografisches Laufband, nach Branchen gruppiert. Branche antippen → Laufband hebt sie hervor.
// Interaktion/Animation liegt in der Client-Insel s02-ReferenzBand.js; alle Namen stehen im
// Server-HTML. Firmennamen verlinken nur, wenn die Projektseite existiert (vorhandeneSlugs).

import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { REFERENZ_UNTERNEHMEN } from "@/data/hero";
import { Eyebrow } from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";
import ReferenzBand from "./s02-ReferenzBand";

/** Branchen in Reihenfolge des ersten Auftretens, je Branche die Betriebe. */
function gruppieren(liste, vorhanden) {
  const m = new Map();
  for (const r of liste) {
    if (!m.has(r.branche)) m.set(r.branche, []);
    m.get(r.branche).push({ name: r.name, slug: r.slug, link: vorhanden.has(r.slug) });
  }
  return [...m.entries()].map(([branche, firmen]) => ({ branche, firmen }));
}

export default function StartReferenzen({ vorhandeneSlugs = [] }) {
  const gruppen = gruppieren(REFERENZ_UNTERNEHMEN, new Set(vorhandeneSlugs));

  const kopf = (
    <Reveal>
      <Eyebrow>Referenzen – eine Auswahl</Eyebrow>
      <h2 id="referenzen-titel" className="mt-4 max-w-[17ch] font-display text-[clamp(1.75rem,1.25rem+1.7vw,2.6rem)] font-extrabold leading-[1.08] tracking-[-0.028em] text-ink-900">
        Unternehmen, die mit uns <span className="ov-text-gradient">Strom erzeugen.</span>
      </h2>
    </Reveal>
  );

  const link = (
    <Link
      href="/referenzen/projekte"
      className="group/l inline-flex min-h-11 items-center gap-2 rounded-full text-[15px] font-semibold text-ov-700 transition-colors hover:text-ov-800 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ov-500"
    >
      Alle Referenzprojekte
      <ArrowRight aria-hidden="true" className="h-4 w-4 transition-transform duration-300 group-hover/l:translate-x-1" />
    </Link>
  );

  return (
    <section data-start="referenzen" aria-labelledby="referenzen-titel" className="relative overflow-hidden border-b border-ink-100 bg-white py-16 md:py-24">
      <ReferenzBand gruppen={gruppen} kopf={kopf} link={link} />
    </section>
  );
}
