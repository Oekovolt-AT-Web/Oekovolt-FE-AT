import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import CountUp from "@/components/ui/CountUp";
import Reveal from "@/components/ui/Reveal";
import SectionHeading from "@/components/ui/SectionHeading";
import { fmtKwp, kennzahlen, zaehle } from "./projektDaten";

/**
 * „Die Auswahl in Zahlen" – ausschließlich aus der Projektliste berechnet.
 * Zwei einfache Balkendiagramme (je eine Reihe, eine Farbe, Werte als Text).
 */
export default function ReferenzStatistik({ projekte = [] }) {
  if (projekte.length < 3) return null;
  const k = kennzahlen(projekte);

  // Projekte je Baujahr
  const jahreMap = new Map();
  projekte.forEach((p) => p.jahr && jahreMap.set(p.jahr, (jahreMap.get(p.jahr) || 0) + 1));
  const jahre = [...jahreMap.entries()].sort((a, b) => a[0] - b[0]);
  const maxJahr = Math.max(...jahre.map(([, n]) => n), 1);

  // Größenklassen
  const klassen = zaehle(projekte, "groesse");
  const reihenfolge = ["bis 15 kWp", "15–50 kWp", "über 50 kWp"];
  klassen.sort((a, b) => reihenfolge.indexOf(a[0]) - reihenfolge.indexOf(b[0]));
  const maxKlasse = Math.max(...klassen.map(([, n]) => n), 1);

  const segmente = zaehle(projekte, "segment");

  return (
    <div className="relative grid gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:gap-16">
      <div>
        <SectionHeading
          dark
          eyebrow="Die Auswahl in Zahlen"
          title={<>Vom Einfamilienhaus bis zur <span className="ov-text-gradient-light">Gewerbehalle</span></>}
          lead={`Unsere dokumentierten Referenzen reichen von ${fmtKwp(k.kleinste?.kwp)} bis ${fmtKwp(k.groesste?.kwp)} kWp – auf Ziegel-, Flach- und Trapezblechdächern ebenso wie an Fassaden.`}
        />
        <dl className="mt-10 grid grid-cols-2 gap-3 sm:gap-4">
          <Kpi wert={k.anzahl} label="dokumentierte Projekte" />
          <Kpi wert={Math.round(k.summeKwp)} suffix=" kWp" label="installierte Leistung (Auswahl)" />
          <Kpi wert={k.orte} label="Orte mit Referenzanlagen" />
          <Kpi wert={Math.round(k.groesste?.kwp || 0)} suffix=" kWp" label="größte Anlage der Auswahl" href={k.groesste ? `/referenzen/projekte/${k.groesste.slug}` : undefined} />
        </dl>
        <p className="mt-5 text-[13px] leading-relaxed text-white/50">
          Quelle: Projektdatenbank Ökovolt, Stand {new Date().toLocaleDateString("de-DE", { month: "long", year: "numeric" })}. Doppelt erfasste Anlagen zählen in der Summe einmal.
        </p>
      </div>

      <div className="grid gap-4">
        {/* Projekte je Jahr */}
        <Reveal className="ov-glass rounded-3xl p-6 md:p-8">
          <div className="flex items-baseline justify-between gap-4">
            <h3 className="font-display text-[18px] font-bold text-white">Projekte nach Baujahr</h3>
            <p className="ov-num text-[13px] text-white/55">
              {k.ersteJahr}–{k.letzteJahr}
            </p>
          </div>
          <ul className="mt-8 flex h-44 items-end gap-2 border-b border-white/15 sm:gap-3" aria-label="Anzahl Projekte je Baujahr">
            {jahre.map(([jahr, n]) => (
              <li key={jahr} className="group relative flex h-full flex-1 flex-col items-center justify-end" title={`${jahr}: ${n} ${n === 1 ? "Projekt" : "Projekte"}`}>
                <span className="ov-num mb-1.5 text-[12.5px] font-semibold text-white/80">{n}</span>
                <span
                  aria-hidden="true"
                  className="w-full max-w-[42px] rounded-t-[4px] bg-ov-400 transition-colors duration-300 group-hover:bg-ov-300"
                  style={{ height: `${Math.max((n / maxJahr) * 100, 6)}%` }}
                />
                <span className="sr-only">
                  {jahr}: {n} Projekte
                </span>
              </li>
            ))}
          </ul>
          <div aria-hidden="true" className="mt-2 flex gap-2 sm:gap-3">
            {jahre.map(([jahr]) => (
              <span key={jahr} className="ov-num flex-1 text-center text-[11.5px] text-white/55">
                <span className="sm:hidden">’{String(jahr).slice(2)}</span>
                <span className="hidden sm:inline">{jahr}</span>
              </span>
            ))}
          </div>
        </Reveal>

        <div className="grid gap-4 sm:grid-cols-2">
          {/* Größenklassen */}
          <Reveal delay={80} className="ov-glass rounded-3xl p-6">
            <h3 className="font-display text-[16px] font-bold text-white">Nach Anlagengröße</h3>
            <ul className="mt-5 space-y-4">
              {klassen.map(([name, n]) => (
                <li key={name}>
                  <div className="flex items-baseline justify-between text-[13.5px]">
                    <span className="text-white/75">{name}</span>
                    <span className="ov-num font-semibold text-white">{n}</span>
                  </div>
                  <div aria-hidden="true" className="mt-1.5 h-2 overflow-hidden rounded-full bg-white/10">
                    <div className="h-full rounded-full bg-ov-400" style={{ width: `${(n / maxKlasse) * 100}%` }} />
                  </div>
                </li>
              ))}
            </ul>
          </Reveal>

          {/* Objektarten */}
          <Reveal delay={160} className="ov-glass rounded-3xl p-6">
            <h3 className="font-display text-[16px] font-bold text-white">Nach Objektart</h3>
            <ul className="mt-5 divide-y divide-white/10">
              {segmente.map(([name, n]) => (
                <li key={name} className="flex items-center justify-between py-2.5 text-[14px]">
                  <span className="text-white/75">{name}</span>
                  <span className="ov-num font-display text-[18px] font-extrabold text-white">{n}</span>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>
    </div>
  );
}

function Kpi({ wert, suffix, label, href }) {
  // dl-Gruppe enthält nur dt/dd; Bezeichnung optisch unter dem Wert (order)
  return (
    <div className="group relative flex flex-col rounded-2xl bg-white/[0.04] p-5 ring-1 ring-white/10 transition hover:bg-white/[0.07]">
      <dt className="order-2 mt-2 text-[13px] leading-snug text-white/60">{label}</dt>
      <dd className="order-1 font-display text-[clamp(1.6rem,1.2rem+1.4vw,2.5rem)] font-extrabold leading-none tracking-tight text-white">
        <CountUp value={wert} suffix={suffix} />
        {href && (
          <Link href={href} aria-label={`${label} ansehen`} className="absolute inset-0 rounded-2xl">
            <ArrowUpRight aria-hidden="true" className="absolute right-4 top-4 h-4 w-4 text-white/40 transition group-hover:text-ov-300" />
          </Link>
        )}
      </dd>
    </div>
  );
}
