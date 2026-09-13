import Link from "next/link";
import { ArrowUpRight, Building2, Flag } from "lucide-react";
import Reveal from "@/components/ui/Reveal";
import { fmtKwp, kennzahlen } from "@/components/Project/projektDaten";

/**
 * Zeitleiste aus belegten Fakten: Firmensitz/Erfahrung (Website) und
 * Baujahre der dokumentierten Referenzprojekte (Projektdatenbank).
 * projekte: normalisierte Projekte (projektDaten.normalisiereProjekt)
 */
export default function FirmenTimeline({ projekte = [] }) {
  const jahre = [...new Set(projekte.map((p) => p.jahr).filter(Boolean))].sort((a, b) => a - b);

  const eintraege = jahre.map((jahr) => {
    const imJahr = projekte.filter((p) => p.jahr === jahr);
    const k = kennzahlen(imJahr);
    const orte = [...new Set(imJahr.map((p) => p.ort).filter(Boolean))];
    const segmente = [...new Set(imJahr.map((p) => p.segment).filter(Boolean))];
    return { jahr, anzahl: imJahr.length, summe: k.summeKwp, groesste: k.groesste, orte, segmente };
  });

  return (
    <ol className="relative mx-auto max-w-5xl">
      {/* Linie */}
      <div aria-hidden="true" className="absolute bottom-6 left-[19px] top-6 w-px bg-gradient-to-b from-ov-400 via-white/20 to-ov-400 md:left-1/2" />

      <Eintrag seite="links" icon={Building2} titel="Fachbetrieb aus Türkheim" kopf="Seit über 15 Jahren" hervorgehoben>
        Von unserem Firmensitz in Türkheim im Unterallgäu planen, montieren und melden wir Photovoltaikanlagen an – alles aus einer Hand.
      </Eintrag>

      {eintraege.map((e, i) => (
        <Eintrag key={e.jahr} seite={i % 2 === 0 ? "rechts" : "links"} kopf={String(e.jahr)} titel={`${e.anzahl} ${e.anzahl === 1 ? "Referenzprojekt" : "Referenzprojekte"}${e.summe ? ` · ${fmtKwp(e.summe, 0)} kWp` : ""}`} delay={i * 60}>
          {e.orte.length > 0 && <span className="block">{e.orte.join(", ")}</span>}
          {e.groesste && (
            <Link href={`/referenzen/projekte/${e.groesste.slug}`} className="mt-3 block text-[14px] font-semibold text-ov-300 hover:text-white">
              {e.anzahl > 1 ? `Größte Anlage: ${e.groesste.titel} (${e.groesste.leistungText})` : `Projekt ansehen: ${e.groesste.titel}`}
              <ArrowUpRight aria-hidden="true" className="ml-1 inline h-4 w-4 align-[-2px]" />
            </Link>
          )}
          {e.segmente.length > 0 && (
            <span className="mt-3 flex flex-wrap gap-2">
              {e.segmente.map((n) => (
                <span key={n} className="inline-flex items-center rounded-full bg-white/10 px-3 py-1 text-[12.5px] font-medium text-white/80">
                  {n}
                </span>
              ))}
            </span>
          )}
        </Eintrag>
      ))}

      <Eintrag seite={eintraege.length % 2 === 0 ? "rechts" : "links"} icon={Flag} kopf="Heute" titel="Ihre Anlage als nächstes Kapitel" hervorgehoben>
        Wir wachsen mit jedem Projekt – und investieren in Weiterbildung, moderne Werkzeuge und Technik.{" "}
        <Link href="/angebot" className="font-semibold text-ov-300 underline decoration-ov-300/40 underline-offset-4 hover:text-white">
          Jetzt Beratung anfragen
        </Link>
      </Eintrag>
    </ol>
  );
}

function Eintrag({ seite, kopf, titel, icon: Icon, hervorgehoben, delay = 0, children }) {
  const rechts = seite === "rechts";
  return (
    <Reveal as="li" delay={delay} dir={rechts ? "right" : "left"} className="relative grid gap-4 pb-10 pl-14 last:pb-0 md:-mt-24 md:grid-cols-2 md:gap-16 md:pb-6 md:pl-0 md:first:mt-0">
      {/* Knoten */}
      <span
        aria-hidden="true"
        className={`absolute left-0 top-1 flex h-10 w-10 items-center justify-center rounded-full md:left-1/2 md:-translate-x-1/2 ${hervorgehoben ? "bg-ov-500 text-white shadow-[0_0_0_6px_rgba(102,153,51,0.25)]" : "bg-navy-950 ring-2 ring-ov-400"}`}
      >
        {Icon ? <Icon className="h-4 w-4" /> : <span className="h-2.5 w-2.5 rounded-full bg-ov-400" />}
      </span>

      <div className={rechts ? "md:col-start-2" : "md:text-right"}>
        <p className="font-display text-[clamp(1.6rem,1.2rem+1.3vw,2.4rem)] font-extrabold leading-none tracking-tight text-white">{kopf}</p>
        <div className={`ov-glass mt-4 inline-block w-full rounded-3xl p-5 text-left md:p-6 ${hervorgehoben ? "ring-1 ring-ov-400/40" : ""}`}>
          <h3 className="font-display text-[17px] font-bold text-white">{titel}</h3>
          <p className="mt-1.5 text-[15px] leading-relaxed text-white/65">{children}</p>
        </div>
      </div>
    </Reveal>
  );
}
