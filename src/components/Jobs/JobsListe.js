"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, Clock, Euro, Mail, MapPin, Phone, Search, Sparkles } from "lucide-react";
import { cn } from "@/components/ui/cn";
import { bewerbungsLink, fmtDatum } from "./jobDaten";

const TAETIGKEITEN = ["Projektplanung", "Montage", "Elektrotechnik", "Technische Entwicklung", "Vertrieb & Beratung", "Kaufmännisches"];

/**
 * Stellenliste mit Filtern (Ort, Anstellungsart, Suche).
 * jobs: normalisierte Jobs (jobDaten.normalisiereJob)
 */
export default function JobsListe({ jobs = [] }) {
  const [ort, setOrt] = useState("");
  const [art, setArt] = useState("");
  const [suche, setSuche] = useState("");

  const orte = useMemo(() => [...new Set(jobs.map((j) => j.ort).filter(Boolean))], [jobs]);
  const arten = useMemo(() => [...new Set(jobs.map((j) => j.anstellung).filter(Boolean))], [jobs]);

  const treffer = jobs.filter(
    (j) =>
      (!ort || j.ort === ort) &&
      (!art || j.anstellung === art) &&
      (!suche.trim() || `${j.titel} ${j.beschreibung}`.toLowerCase().includes(suche.trim().toLowerCase()))
  );

  if (jobs.length === 0) return <KeineStellen />;

  return (
    <div>
      {(jobs.length > 3 || orte.length > 1 || arten.length > 1) && (
        <div className="mb-6 flex flex-col gap-3 rounded-3xl bg-white p-4 ring-1 ring-ink-200/70 md:flex-row md:items-center md:p-5">
          {jobs.length > 3 && (
            <label className="relative flex-1">
              <span className="sr-only">Stellen durchsuchen</span>
              <Search aria-hidden="true" className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
              <input
                type="search"
                value={suche}
                onChange={(e) => setSuche(e.target.value)}
                placeholder="Stelle suchen, z. B. Monteur"
                className="h-11 w-full rounded-full bg-ink-50 pl-11 pr-4 text-[15px] ring-1 ring-inset ring-ink-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-ov-500"
              />
            </label>
          )}
          {orte.length > 1 && <Chips titel="Ort" werte={orte} aktiv={ort} setze={setOrt} />}
          {arten.length > 1 && <Chips titel="Anstellung" werte={arten} aktiv={art} setze={setArt} />}
        </div>
      )}

      <p className="mb-4 text-[15px] text-ink-600" aria-live="polite">
        <strong className="font-display text-[17px] font-extrabold text-ink-900">{treffer.length}</strong> {treffer.length === 1 ? "offene Stelle" : "offene Stellen"}
      </p>

      <ul className="grid gap-4 md:grid-cols-2">
        {treffer.map((j) => (
          <li key={j.slug}>
            <Link
              href={`/uber-uns/jobs/${j.slug}`}
              className="group ov-card-hover relative flex h-full flex-col rounded-3xl bg-white p-6 ring-1 ring-ink-200/70 hover:ring-ov-300 md:p-7"
            >
              <div className="flex flex-wrap items-center gap-2">
                {j.anstellung && <span className="rounded-full bg-ov-50 px-3 py-1 text-[12.5px] font-semibold text-ov-700">{j.anstellung}</span>}
                {j.datum && (
                  <span className="inline-flex items-center gap-1.5 text-[12.5px] text-ink-500">
                    <Clock aria-hidden="true" className="h-3.5 w-3.5" />
                    {fmtDatum(j.datum)}
                  </span>
                )}
              </div>
              <h3 className="ov-h3 mt-4 text-ink-900 transition-colors group-hover:text-ov-700">{j.titel}</h3>
              {j.beschreibung && <p className="mt-2 line-clamp-2 text-[15px] leading-relaxed text-ink-600">{j.beschreibung}</p>}
              <div className="mt-auto flex flex-wrap items-center justify-between gap-4 pt-6">
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-[14px] text-ink-600">
                  <span className="inline-flex items-center gap-1.5">
                    <MapPin aria-hidden="true" className="h-4 w-4 text-ov-600" />
                    {j.ort}
                  </span>
                  {j.gehalt && (
                    <span className="inline-flex items-center gap-1.5">
                      <Euro aria-hidden="true" className="h-4 w-4 text-ov-600" />
                      {j.gehalt}
                    </span>
                  )}
                </div>
                <span className="inline-flex h-11 items-center gap-2 rounded-full bg-ov-500 px-5 text-[14.5px] font-semibold text-white transition group-hover:bg-ov-600">
                  Ansehen & bewerben
                  <ArrowRight aria-hidden="true" className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
              </div>
            </Link>
          </li>
        ))}
      </ul>

      <div className="mt-6">
        <KeineStellen kompakt />
      </div>
    </div>
  );
}

function Chips({ titel, werte, aktiv, setze }) {
  return (
    <div role="group" aria-label={titel} className="ov-no-scrollbar flex gap-2 overflow-x-auto">
      {["", ...werte].map((w) => (
        <button
          key={w || "alle"}
          type="button"
          aria-pressed={aktiv === w}
          onClick={() => setze(w)}
          className={cn(
            "h-11 shrink-0 whitespace-nowrap rounded-full px-4 text-[14px] font-medium transition",
            aktiv === w ? "bg-navy-900 text-white" : "bg-ink-50 text-ink-700 ring-1 ring-inset ring-ink-200 hover:ring-ov-300"
          )}
        >
          {w || `Alle ${titel === "Ort" ? "Orte" : ""}`.trim()}
        </button>
      ))}
    </div>
  );
}

/** Keine passende Stelle: Initiativbewerbung */
function KeineStellen({ kompakt = false }) {
  if (kompakt) {
    return (
      <div className="flex flex-col items-start justify-between gap-4 rounded-3xl border border-dashed border-ink-300 bg-white/60 p-6 md:flex-row md:items-center">
        <p className="text-[15.5px] text-ink-700">
          <strong className="text-ink-900">Nichts Passendes dabei?</strong> Wir freuen uns auch über Ihre Initiativbewerbung.
        </p>
        <a href={bewerbungsLink()} className="inline-flex h-11 shrink-0 items-center gap-2 rounded-full bg-white px-5 text-[14.5px] font-semibold text-ink-900 ring-1 ring-inset ring-ink-200 transition hover:ring-ov-300">
          <Mail aria-hidden="true" className="h-4 w-4 text-ov-600" />
          Initiativ bewerben
        </a>
      </div>
    );
  }

  return (
    <div className="ov-noise relative overflow-hidden rounded-[2rem] bg-white ring-1 ring-ink-200/70">
      <div aria-hidden="true" className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-ov-200/50 blur-3xl" />
      <div className="relative grid gap-8 p-5 sm:p-7 md:p-10 lg:grid-cols-[1.2fr_1fr] lg:gap-12">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full bg-sun-300/30 px-3 py-1 text-[12.5px] font-semibold text-ink-800">
            <Sparkles aria-hidden="true" className="h-3.5 w-3.5 text-sun-500" />
            Aktuell keine ausgeschriebenen Stellen
          </span>
          <h3 className="ov-h2 mt-5 text-ink-900">Initiativ bewerben lohnt sich.</h3>
          <p className="mt-4 max-w-xl text-[16.5px] leading-relaxed text-ink-600">
            Gerade ist keine Stelle online – das heißt nicht, dass wir niemanden suchen. Als wachsendes Unternehmen freuen wir uns über Menschen, die mit uns an der Energiewende arbeiten wollen. Schicken Sie uns Ihren Lebenslauf und ein paar Sätze zu Ihnen.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a href={bewerbungsLink()} className="inline-flex h-14 items-center justify-center gap-2.5 whitespace-nowrap rounded-full bg-ov-500 px-6 text-[16px] font-semibold text-white sm:px-8 shadow-[0_8px_24px_-8px_rgba(102,153,51,0.65)] transition hover:bg-ov-600">
              <Mail aria-hidden="true" className="h-5 w-5" />
              Jetzt initiativ bewerben
            </a>
            <a href="tel:+498245967880" className="inline-flex h-14 items-center justify-center gap-2.5 rounded-full bg-white px-8 text-[16px] font-semibold text-ink-900 ring-1 ring-inset ring-ink-200 transition hover:bg-ink-50">
              <Phone aria-hidden="true" className="h-5 w-5 text-ov-600" />
              08245 96 788 0
            </a>
          </div>
        </div>
        <div className="rounded-3xl bg-sand-50 p-6 ring-1 ring-ink-200/60">
          <p className="text-[12.5px] font-semibold uppercase tracking-[0.14em] text-ink-500">Tätigkeitsfelder bei uns</p>
          <ul className="mt-4 flex flex-wrap gap-2">
            {TAETIGKEITEN.map((t) => (
              <li key={t} className="rounded-full bg-white px-3.5 py-2 text-[14px] font-medium text-ink-700 ring-1 ring-ink-200">
                {t}
              </li>
            ))}
          </ul>
          <p className="mt-5 border-t border-ink-200 pt-5 text-[14.5px] leading-relaxed text-ink-600">
            Bewerbung an <a href={bewerbungsLink()} className="font-semibold text-ov-700 underline decoration-ov-300 underline-offset-4">office@oekovolt.de</a> – mit oder ohne Photovoltaik-Erfahrung.
          </p>
        </div>
      </div>
    </div>
  );
}
