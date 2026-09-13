"use client";

import { useEffect, useMemo, useState } from "react";
import { ChevronDown, RotateCcw, SlidersHorizontal } from "lucide-react";
import { cn } from "@/components/ui/cn";
import ProjektKarte from "./ProjektKarte";
import { GROESSEN, fmtZahl, kennzahlen } from "./projektDaten";

const SCHRITT = 12;

const SORTIERUNGEN = {
  neu: { label: "Neueste", fn: (a, b) => (b.jahr || 0) - (a.jahr || 0) || (b.kwp || 0) - (a.kwp || 0) },
  gross: { label: "Größte kWp", fn: (a, b) => (b.kwp || 0) - (a.kwp || 0) },
  klein: { label: "Kleinste kWp", fn: (a, b) => (a.kwp || 0) - (b.kwp || 0) },
};

const LEER = { segment: "", groesse: "", dach: "", ort: "" };

function passt(p, f, ausser) {
  if (ausser !== "segment" && f.segment && p.segment !== f.segment) return false;
  if (ausser !== "groesse" && f.groesse && p.groesse !== f.groesse) return false;
  if (ausser !== "dach" && f.dach && !p.dacharten.includes(f.dach)) return false;
  if (ausser !== "ort" && f.ort && p.ort !== f.ort) return false;
  return true;
}

/**
 * Filterbares Referenz-Portfolio im Bento-Raster.
 * Alle Karten stehen im Server-HTML (Crawler sehen jeden Projektlink);
 * „Mehr anzeigen" blendet nur zusätzliche Karten ein.
 */
export default function ProjektPortfolio({ projekte = [] }) {
  const [filter, setFilter] = useState(LEER);
  const [sortierung, setSortierung] = useState("neu");
  const [sichtbar, setSichtbar] = useState(SCHRITT);

  // Vorauswahl über ?ort=… (z. B. aus der Referenzkarte)
  useEffect(() => {
    const ort = new URLSearchParams(window.location.search).get("ort");
    if (ort && projekte.some((p) => p.ort === ort)) setFilter((f) => ({ ...f, ort }));
  }, [projekte]);

  const optionen = useMemo(() => {
    const zaehlen = (key, werteVon) => {
      const m = new Map();
      for (const p of projekte) {
        if (!passt(p, filter, key)) continue;
        for (const w of werteVon(p)) if (w) m.set(w, (m.get(w) || 0) + 1);
      }
      return m;
    };
    const alle = (werteVon) => [...new Set(projekte.flatMap(werteVon).filter(Boolean))];
    return {
      segment: { werte: ["Einfamilienhaus", "Gewerbe", "Landwirtschaft"].filter((s) => alle((p) => [p.segment]).includes(s)), zahl: zaehlen("segment", (p) => [p.segment]) },
      groesse: { werte: GROESSEN.filter((g) => alle((p) => [p.groesse]).includes(g)), zahl: zaehlen("groesse", (p) => [p.groesse]) },
      dach: { werte: alle((p) => p.dacharten), zahl: zaehlen("dach", (p) => p.dacharten) },
      ort: { werte: alle((p) => [p.ort]).sort((a, b) => a.localeCompare(b, "de")), zahl: zaehlen("ort", (p) => [p.ort]) },
    };
  }, [projekte, filter]);

  const treffer = useMemo(
    () => projekte.filter((p) => passt(p, filter)).sort(SORTIERUNGEN[sortierung].fn),
    [projekte, filter, sortierung]
  );

  const aktiv = Object.values(filter).some(Boolean);
  const setze = (key, wert) => {
    setFilter((f) => ({ ...f, [key]: f[key] === wert ? "" : wert }));
    setSichtbar(SCHRITT);
  };
  const zuruecksetzen = () => {
    setFilter(LEER);
    setSichtbar(SCHRITT);
  };

  const summeTreffer = kennzahlen(treffer).summeKwp;

  return (
    <div>
      {/* Filterleiste */}
      <div className="rounded-3xl bg-white p-4 shadow-[0_20px_50px_-30px_rgba(15,23,42,0.35)] ring-1 ring-ink-200/70 md:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-ink-100 pb-4">
          <p className="inline-flex items-center gap-2 text-[14px] font-semibold text-ink-900">
            <SlidersHorizontal aria-hidden="true" className="h-4 w-4 text-ov-600" />
            Projekte filtern
          </p>
          <div className="grid w-full grid-cols-2 gap-2 sm:flex sm:w-auto sm:items-center">
            <label className="relative">
              <span className="sr-only">Ort wählen</span>
              <select
                value={filter.ort}
                onChange={(e) => {
                  setFilter((f) => ({ ...f, ort: e.target.value }));
                  setSichtbar(SCHRITT);
                }}
                className="h-11 w-full appearance-none rounded-full bg-ink-50 pl-4 pr-10 text-[14px] font-medium text-ink-800 ring-1 ring-inset ring-ink-200 transition hover:ring-ink-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-ov-500"
              >
                <option value="">Alle Orte</option>
                {optionen.ort.werte.map((o) => (
                  <option key={o} value={o} disabled={!optionen.ort.zahl.get(o)}>
                    {o} ({optionen.ort.zahl.get(o) || 0})
                  </option>
                ))}
              </select>
              <ChevronDown aria-hidden="true" className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-500" />
            </label>
            <label className="relative">
              <span className="sr-only">Sortierung</span>
              <select
                value={sortierung}
                onChange={(e) => setSortierung(e.target.value)}
                className="h-11 w-full appearance-none rounded-full bg-ink-50 pl-4 pr-10 text-[14px] font-medium text-ink-800 ring-1 ring-inset ring-ink-200 transition hover:ring-ink-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-ov-500"
              >
                {Object.entries(SORTIERUNGEN).map(([k, s]) => (
                  <option key={k} value={k}>
                    {s.label}
                  </option>
                ))}
              </select>
              <ChevronDown aria-hidden="true" className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-500" />
            </label>
          </div>
        </div>

        <div className="mt-4 grid gap-4 lg:grid-cols-[auto_1fr] lg:gap-x-6 lg:gap-y-3">
          <ChipGruppe titel="Objekt" name="segment" optionen={optionen.segment} aktiv={filter.segment} onWahl={setze} />
          <ChipGruppe titel="Leistung" name="groesse" optionen={optionen.groesse} aktiv={filter.groesse} onWahl={setze} />
          {optionen.dach.werte.length > 1 && (
            <ChipGruppe titel="Dach" name="dach" optionen={optionen.dach} aktiv={filter.dach} onWahl={setze} />
          )}
        </div>
      </div>

      {/* Ergebniszeile */}
      <div className="mt-8 flex flex-wrap items-center justify-between gap-3" aria-live="polite">
        <p className="text-[15px] text-ink-600">
          <strong className="font-display text-[17px] font-extrabold text-ink-900">{treffer.length}</strong>{" "}
          {treffer.length === 1 ? "Projekt" : "Projekte"}
          {summeTreffer > 0 && (
            <>
              {" "}· zusammen <strong className="ov-num font-semibold text-ink-900">{fmtZahl(summeTreffer, 0)} kWp</strong>
            </>
          )}
          {filter.ort && <> in {filter.ort}</>}
        </p>
        {aktiv && (
          <button
            type="button"
            onClick={zuruecksetzen}
            className="inline-flex h-10 items-center gap-2 rounded-full px-4 text-[14px] font-semibold text-ov-700 ring-1 ring-inset ring-ov-200 transition hover:bg-ov-50"
          >
            <RotateCcw aria-hidden="true" className="h-4 w-4" />
            Filter zurücksetzen
          </button>
        )}
      </div>

      {treffer.length > 0 ? (
        <ul
          key={`${filter.segment}|${filter.groesse}|${filter.dach}|${filter.ort}|${sortierung}`}
          className="ov-tab-panel mt-5 grid grid-flow-dense gap-4 sm:grid-cols-2 lg:auto-rows-[272px] lg:grid-cols-3"
        >
          {treffer.map((p, i) => {
            const gross = treffer.length >= 4 && (i % 10 === 0 || i % 10 === 6);
            return (
              <li
                key={p.slug}
                className={cn(
                  gross && "sm:col-span-2 lg:row-span-2",
                  gross && i % 10 === 6 && "lg:col-start-2",
                  i >= sichtbar && "hidden"
                )}
              >
                <ProjektKarte projekt={p} gross={gross} className="lg:min-h-0" />
              </li>
            );
          })}
        </ul>
      ) : (
        <div className="mt-5 rounded-3xl border border-dashed border-ink-300 bg-white px-6 py-14 text-center">
          <p className="font-display text-[20px] font-bold text-ink-900">Keine Projekte mit dieser Kombination</p>
          <p className="mx-auto mt-2 max-w-md text-[15px] text-ink-600">Lockern Sie einen Filter – oder fragen Sie uns direkt nach vergleichbaren Anlagen.</p>
          <button
            type="button"
            onClick={zuruecksetzen}
            className="mt-6 inline-flex h-12 items-center gap-2 rounded-full bg-ov-500 px-6 text-[15px] font-semibold text-white transition hover:bg-ov-600"
          >
            <RotateCcw aria-hidden="true" className="h-4 w-4" />
            Alle Projekte zeigen
          </button>
        </div>
      )}

      {treffer.length > sichtbar && (
        <div className="mt-10 flex flex-col items-center gap-3">
          <p className="text-[14px] text-ink-500">
            {Math.min(sichtbar, treffer.length)} von {treffer.length} Projekten
          </p>
          <div className="h-1 w-48 overflow-hidden rounded-full bg-ink-100">
            <div className="h-full rounded-full bg-ov-500 transition-[width] duration-500" style={{ width: `${(sichtbar / treffer.length) * 100}%` }} />
          </div>
          <button
            type="button"
            onClick={() => setSichtbar((s) => s + SCHRITT)}
            className="mt-2 inline-flex h-12 items-center gap-2 rounded-full bg-white px-6 text-[15px] font-semibold text-ink-900 ring-1 ring-inset ring-ink-200 transition hover:bg-ink-50 hover:ring-ink-300"
          >
            Weitere Projekte anzeigen
            <ChevronDown aria-hidden="true" className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}

function ChipGruppe({ titel, name, optionen, aktiv, onWahl }) {
  return (
    <>
      <p className="self-center text-[12px] font-semibold uppercase tracking-[0.14em] text-ink-500 lg:min-w-[5.5rem]" id={`filter-${name}`}>
        {titel}
      </p>
      <div role="group" aria-labelledby={`filter-${name}`} className="ov-no-scrollbar -mx-4 -mt-2 flex gap-2 overflow-x-auto px-4 pb-1 lg:mx-0 lg:mt-0 lg:flex-wrap lg:overflow-visible lg:px-0">
        <Chip aktiv={!aktiv} onClick={() => aktiv && onWahl(name, aktiv)}>
          Alle
        </Chip>
        {optionen.werte.map((w) => {
          const zahl = optionen.zahl.get(w) || 0;
          return (
            <Chip key={w} aktiv={aktiv === w} disabled={!zahl && aktiv !== w} onClick={() => onWahl(name, w)}>
              {w}
              <span className={cn("ov-num ml-1.5 rounded-full px-1.5 text-[11.5px]", aktiv === w ? "bg-white/20 text-white" : "bg-ink-100 text-ink-500")}>{zahl}</span>
            </Chip>
          );
        })}
      </div>
    </>
  );
}

function Chip({ aktiv, disabled, onClick, children }) {
  return (
    <button
      type="button"
      aria-pressed={aktiv}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "inline-flex h-11 shrink-0 items-center whitespace-nowrap rounded-full px-4 text-[14px] font-medium transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-40",
        aktiv ? "bg-navy-900 text-white shadow-md" : "bg-ink-50 text-ink-700 ring-1 ring-inset ring-ink-200 hover:bg-white hover:ring-ov-300"
      )}
    >
      {children}
    </button>
  );
}
