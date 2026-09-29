"use client";

// src/components/Jobs/JobsListe.js
//
// Stellenliste mit Filtern: Suche, Bereich (mit Trefferzahl), Ort,
// Anstellungsart. Stellen als kompakte Zeilenkarten – gut scanbar auch bei
// vielen Stellen. jobs: normalisierte Jobs (jobDaten.normalisiereJob).

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, Briefcase, ChevronDown, Compass, Euro, GraduationCap, HardHat, Mail, MapPin, MonitorDot, Phone, RotateCcw, Search, Sparkles, X } from "lucide-react";
import { cn } from "@/components/ui/cn";
import { bewerbungsLink } from "./jobDaten";
import { FIRMA } from "@/lib/site";

const TAETIGKEITEN = ["Projektleitung", "Elektroplanung", "Netzanschluss & Parkregler", "SCADA & Leitwarte", "Montage & Service", "Vertrieb & Energieberatung", "Lehre Elektrotechnik"];

const BEREICH_ICON = {
  "Projekt & Planung": Compass,
  "Montage & Service": HardHat,
  "Netz & Leittechnik": MonitorDot,
  "Vertrieb & Beratung": Briefcase,
  Ausbildung: GraduationCap,
};

export default function JobsListe({ jobs = [] }) {
  const [ort, setOrt] = useState("");
  const [bereich, setBereich] = useState("");
  const [art, setArt] = useState("");
  const [suche, setSuche] = useState("");

  const orte = useMemo(() => [...new Set(jobs.map((j) => j.ort).filter(Boolean))], [jobs]);
  const bereiche = useMemo(() => [...new Set(jobs.map((j) => j.bereich).filter(Boolean))], [jobs]);
  const arten = useMemo(() => [...new Set(jobs.map((j) => j.anstellung).filter(Boolean))], [jobs]);

  const passtSuche = (j) => !suche.trim() || `${j.titel} ${j.beschreibung} ${(j.skills || []).join(" ")}`.toLowerCase().includes(suche.trim().toLowerCase());
  const passtRest = (j) => (!ort || j.ort === ort) && (!art || j.anstellung === art) && passtSuche(j);
  const treffer = jobs.filter((j) => (!bereich || j.bereich === bereich) && passtRest(j));
  const anzahlBereich = (b) => jobs.filter((j) => (!b || j.bereich === b) && passtRest(j)).length;
  const gefiltert = Boolean(ort || bereich || art || suche.trim());
  const zuruecksetzen = () => {
    setOrt("");
    setBereich("");
    setArt("");
    setSuche("");
  };

  if (jobs.length === 0) return <KeineStellen />;

  return (
    <div>
      <div className="mb-8 rounded-[2rem] bg-white p-4 shadow-[0_24px_60px_-40px_rgba(15,23,42,0.35)] ring-1 ring-ink-200/70 md:p-6">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <label className="relative block min-w-0 flex-1">
            <span className="sr-only">Stellen durchsuchen</span>
            <Search aria-hidden="true" className="pointer-events-none absolute left-5 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-ink-400" />
            <input
              type="search"
              value={suche}
              onChange={(e) => setSuche(e.target.value)}
              placeholder="Stelle oder Fähigkeit suchen, z. B. TOR Erzeuger"
              className="h-13 w-full rounded-full bg-sand-50 pl-12 pr-11 text-[15.5px] ring-1 ring-inset ring-ink-200 transition focus:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-ov-500"
            />
            {suche && (
              <button type="button" onClick={() => setSuche("")} aria-label="Suche leeren" className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full text-ink-500 hover:bg-ink-100">
                <X aria-hidden="true" className="h-4 w-4" />
              </button>
            )}
          </label>
          {(orte.length > 1 || arten.length > 1) && (
            <div className="grid grid-cols-2 gap-2 lg:flex">
              {orte.length > 1 && <Auswahl label="Ort" wert={ort} setze={setOrt} optionen={orte} alle="Alle Orte" />}
              {arten.length > 1 && <Auswahl label="Anstellung" wert={art} setze={setArt} optionen={arten} alle="Alle Arten" />}
            </div>
          )}
        </div>

        {bereiche.length > 1 && (
          <div role="group" aria-label="Bereich" className="ov-no-scrollbar -mx-1 mt-4 flex gap-2 overflow-x-auto px-1 pb-1 md:flex-wrap md:overflow-visible">
            {["", ...bereiche].map((b) => {
              const Icon = b ? BEREICH_ICON[b] || Briefcase : Sparkles;
              const an = bereich === b;
              return (
                <button
                  key={b || "alle"}
                  type="button"
                  aria-pressed={an}
                  onClick={() => setBereich(b)}
                  className={cn(
                    "inline-flex h-11 shrink-0 items-center gap-2 whitespace-nowrap rounded-full pl-2 pr-4 text-[14px] font-semibold transition-all",
                    an ? "bg-navy-950 text-white shadow-[0_10px_24px_-12px_rgba(3,18,43,0.7)]" : "bg-sand-50 text-ink-700 ring-1 ring-inset ring-ink-200 hover:ring-ov-300"
                  )}
                >
                  <span className={cn("flex h-7 w-7 items-center justify-center rounded-full", an ? "bg-ov-500 text-white" : "bg-white text-ov-700 ring-1 ring-ink-200")}>
                    <Icon aria-hidden="true" className="h-3.5 w-3.5" />
                  </span>
                  {b || "Alle Bereiche"}
                  <span className={cn("ov-num rounded-full px-2 py-0.5 text-[12px]", an ? "bg-white/15 text-white" : "bg-white text-ink-500")}>{anzahlBereich(b)}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <p className="text-[15px] text-ink-600" aria-live="polite">
          <strong className="font-display text-[20px] font-extrabold text-ink-900">{treffer.length}</strong> {treffer.length === 1 ? "offene Stelle" : "offene Stellen"}
          {gefiltert ? <span className="text-ink-500"> von {jobs.length}</span> : null}
        </p>
        {gefiltert && (
          <button type="button" onClick={zuruecksetzen} className="inline-flex items-center gap-1.5 text-[14px] font-semibold text-ov-700 hover:text-ov-800">
            <RotateCcw aria-hidden="true" className="h-4 w-4" />
            Filter zurücksetzen
          </button>
        )}
      </div>

      {treffer.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-ink-300 bg-white/60 p-8 text-center">
          <p className="font-display text-[18px] font-bold text-ink-900">Keine Stelle passt zu diesen Filtern.</p>
          <p className="mt-2 text-[15px] text-ink-600">Setzen Sie die Filter zurück – oder bewerben Sie sich initiativ.</p>
          <button type="button" onClick={zuruecksetzen} className="mt-5 inline-flex h-11 items-center gap-2 rounded-full bg-navy-950 px-5 text-[14.5px] font-semibold text-white">
            <RotateCcw aria-hidden="true" className="h-4 w-4" />
            Alle Stellen zeigen
          </button>
        </div>
      ) : (
        <ul className="grid gap-3">
          {treffer.map((j) => {
            const Icon = BEREICH_ICON[j.bereich] || Briefcase;
            return (
              <li key={j.slug}>
                <Link
                  href={`/uber-uns/jobs/${j.slug}`}
                  className="group relative flex items-center gap-4 overflow-hidden rounded-3xl bg-white p-4 ring-1 ring-ink-200/70 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_24px_50px_-30px_rgba(15,23,42,0.45)] hover:ring-ov-300 sm:gap-5 sm:p-5 md:px-6"
                >
                  <span aria-hidden="true" className="absolute inset-y-0 left-0 w-1 origin-top scale-y-0 bg-ov-500 transition-transform duration-300 group-hover:scale-y-100" />
                  <span className="hidden h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-ov-50 text-ov-700 ring-1 ring-ov-100 transition-colors group-hover:bg-ov-500 group-hover:text-white sm:flex">
                    <Icon aria-hidden="true" className="h-6 w-6" strokeWidth={1.8} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex flex-wrap items-center gap-2 text-[12.5px] font-semibold">
                      {j.bereich && <span className="text-ov-700">{j.bereich}</span>}
                      {j.anstellung && <span className="rounded-full bg-navy-50 px-2.5 py-0.5 text-navy-700">{j.anstellung}</span>}
                    </span>
                    <span className="mt-1.5 block font-display text-[clamp(1.05rem,0.95rem+0.4vw,1.25rem)] font-bold leading-snug text-ink-900 transition-colors group-hover:text-ov-700">{j.titel}</span>
                    <span className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-[14px] text-ink-600">
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
                    </span>
                  </span>
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-sand-50 text-ink-700 ring-1 ring-ink-200 transition-all duration-300 group-hover:bg-ov-600 group-hover:text-white group-hover:ring-ov-600">
                    <ArrowRight aria-hidden="true" className="h-5 w-5 transition-transform group-hover:translate-x-0.5" />
                    <span className="sr-only">Ansehen & bewerben</span>
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      )}

      <div className="mt-6">
        <KeineStellen kompakt />
      </div>
    </div>
  );
}

function Auswahl({ label, wert, setze, optionen, alle }) {
  return (
    <label className="relative block min-w-0">
      <span className="sr-only">{label}</span>
      <select
        value={wert}
        onChange={(e) => setze(e.target.value)}
        className={cn(
          "h-13 w-full cursor-pointer appearance-none truncate rounded-full pl-5 pr-10 text-[14.5px] font-semibold ring-1 ring-inset transition focus:outline-none focus-visible:ring-2 focus-visible:ring-ov-500 lg:w-auto lg:max-w-[260px]",
          wert ? "bg-navy-950 text-white ring-navy-950" : "bg-sand-50 text-ink-800 ring-ink-200 hover:ring-ov-300"
        )}
      >
        <option value="">{alle}</option>
        {optionen.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
      <ChevronDown aria-hidden="true" className={cn("pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2", wert ? "text-white" : "text-ink-500")} />
    </label>
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
            <a href={bewerbungsLink()} className="inline-flex h-14 items-center justify-center gap-2.5 whitespace-nowrap rounded-full bg-ov-600 px-6 text-[16px] font-semibold text-white shadow-[0_8px_24px_-8px_rgba(102,153,51,0.65)] transition hover:bg-ov-700 sm:px-8">
              <Mail aria-hidden="true" className="h-5 w-5" />
              Jetzt initiativ bewerben
            </a>
            <a href={FIRMA.telefonHref} className="inline-flex h-14 items-center justify-center gap-2.5 rounded-full bg-white px-8 text-[16px] font-semibold text-ink-900 ring-1 ring-inset ring-ink-200 transition hover:bg-ink-50">
              <Phone aria-hidden="true" className="h-5 w-5 text-ov-600" />
              {FIRMA.telefon}
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
            Bewerbung an <a href={bewerbungsLink()} className="font-semibold text-ov-700 underline decoration-ov-300 underline-offset-4">{FIRMA.email}</a> – mit oder ohne Photovoltaik-Erfahrung.
          </p>
        </div>
      </div>
    </div>
  );
}
