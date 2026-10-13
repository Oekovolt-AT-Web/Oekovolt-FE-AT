"use client";

// src/components/Forderungen/Gemeindefoerderungen.js
//
// Gemeindeförderungen im Einzugsgebiet (Bezirke Braunau und Salzburg-Umgebung)
// aus @/data/gemeindefoerderungen – Filter nach Bezirk und Status, Suche nach
// Gemeinde, Link „Fehler melden“ als mailto (keine Formulardaten).

import { useMemo, useState } from "react";
import { ArrowUpRight, CircleAlert, Mail, Search } from "lucide-react";
import { cn } from "@/components/ui/cn";
import { BEZIRKE, GEMEINDEFOERDERUNGEN, GEMEINDEN_STAND, GEMEINDE_STATUS, zaehleStatus } from "@/data/gemeindefoerderungen";

const STATUS_TON = {
  programm: { punkt: "bg-ov-500", chip: "bg-ov-50 text-ov-800 ring-ov-200" },
  ausgesetzt: { punkt: "bg-[#e5484d]", chip: "bg-[#e5484d]/10 text-[#b42318] ring-[#e5484d]/25" },
  keine: { punkt: "bg-ink-400", chip: "bg-ink-100 text-ink-700 ring-ink-200" },
  ungeprueft: { punkt: "bg-sun-400", chip: "bg-sun-300/30 text-ink-800 ring-sun-400/40" },
};

const ZG_LABEL = { privat: "Private", unternehmen: "Unternehmen", landwirtschaft: "Landwirtschaft", gemeinde: "Gemeinde" };

const MELDEN = "mailto:office@oekovolt.at?subject=" + encodeURIComponent("Gemeindeförderung: Fehler oder Ergänzung");

const datum = (iso) => (iso ? `${iso.slice(8, 10)}.${iso.slice(5, 7)}.${iso.slice(0, 4)}` : "–");

function StatusChip({ status }) {
  const ton = STATUS_TON[status] || STATUS_TON.ungeprueft;
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[12px] font-semibold ring-1", ton.chip)}>
      <span aria-hidden="true" className={cn("h-2 w-2 rounded-full", ton.punkt)} />
      {GEMEINDE_STATUS[status]?.label || status}
    </span>
  );
}

export default function Gemeindefoerderungen({ id = "gemeinden" }) {
  const [bezirk, setBezirk] = useState(BEZIRKE[0].id);
  const [status, setStatus] = useState("alle");
  const [suche, setSuche] = useState("");

  const liste = useMemo(() => {
    const s = suche.trim().toLowerCase();
    return GEMEINDEFOERDERUNGEN.filter((g) => g.bezirk === bezirk)
      .filter((g) => status === "alle" || g.status === status)
      .filter((g) => !s || g.gemeinde.toLowerCase().includes(s) || g.gkz.includes(s))
      .sort((a, b) => {
        const rang = { programm: 0, ausgesetzt: 1, keine: 2, ungeprueft: 3 };
        return rang[a.status] - rang[b.status] || a.gemeinde.localeCompare(b.gemeinde, "de");
      });
  }, [bezirk, status, suche]);

  // Geprüfte Gemeinden als Karten, ungeprüfte kompakt als Namensliste (QA: sonst 40+ identische Karten).
  const karten = liste.filter((g) => g.status !== "ungeprueft");
  const offen = liste.filter((g) => g.status === "ungeprueft");

  const zaehlung = useMemo(() => zaehleStatus(GEMEINDEFOERDERUNGEN.filter((g) => g.bezirk === bezirk)), [bezirk]);
  const bezirkInfo = BEZIRKE.find((b) => b.id === bezirk);

  return (
    <div id={id} className="scroll-mt-24">
      {/* Bezirk */}
      <div role="tablist" aria-label="Bezirk wählen" className="flex flex-wrap gap-2">
        {BEZIRKE.map((b) => {
          const aktiv = b.id === bezirk;
          return (
            <button
              key={b.id}
              type="button"
              role="tab"
              aria-selected={aktiv}
              onClick={() => setBezirk(b.id)}
              className={cn(
                "min-h-11 rounded-full px-5 py-2.5 text-[14.5px] font-semibold transition-colors",
                aktiv ? "bg-navy-950 text-white" : "bg-white text-ink-700 hover:bg-ov-50 hover:text-ov-800"
              )}
            >
              {b.label}
              <span className={cn("ml-2 text-[12.5px] font-medium", aktiv ? "text-white/70" : "text-ink-500")}>{b.kuerzel}</span>
            </button>
          );
        })}
      </div>

      {/* Zählung + Status-Filter + Suche */}
      <div className="mt-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <ul className="flex flex-wrap gap-2" aria-label="Status filtern">
          {[["alle", `alle (${bezirkInfo ? GEMEINDEFOERDERUNGEN.filter((g) => g.bezirk === bezirk).length : 0})`], ...Object.keys(GEMEINDE_STATUS).map((k) => [k, `${GEMEINDE_STATUS[k].label} (${zaehlung[k] || 0})`])].map(([k, label]) => {
            const aktiv = status === k;
            const ton = STATUS_TON[k];
            return (
              <li key={k}>
                <button
                  type="button"
                  aria-pressed={aktiv}
                  onClick={() => setStatus(k)}
                  className={cn(
                    "inline-flex min-h-11 items-center gap-1.5 rounded-full px-3.5 py-2 text-[13px] font-semibold transition-colors",
                    aktiv ? "bg-ov-600 text-white" : "bg-white text-ink-700 hover:bg-ov-50"
                  )}
                >
                  {ton && <span aria-hidden="true" className={cn("h-2 w-2 rounded-full", aktiv ? "bg-white" : ton.punkt)} />}
                  {label}
                </button>
              </li>
            );
          })}
        </ul>
        <label className="relative block lg:w-72">
          <span className="sr-only">Gemeinde suchen</span>
          <Search aria-hidden="true" className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-500" />
          <input
            type="search"
            value={suche}
            onChange={(e) => setSuche(e.target.value)}
            placeholder="Gemeinde oder GKZ"
            className="min-h-11 w-full rounded-full bg-white py-2.5 pl-11 pr-4 text-[14.5px] text-ink-900 ring-1 ring-ink-200/70 placeholder:text-ink-500 focus:outline-none focus:ring-2 focus:ring-ov-500"
          />
        </label>
      </div>

      {/* Liste */}
      <p className="mt-6 text-[13.5px] text-ink-600" aria-live="polite">
        {liste.length} von {GEMEINDEFOERDERUNGEN.filter((g) => g.bezirk === bezirk).length} Gemeinden · Stand {GEMEINDEN_STAND.label} · nur Angaben mit Primärquelle (Gemeinde-Website oder Richtlinie)
      </p>
      <ul className="mt-4 grid gap-3 md:grid-cols-2">
        {karten.map((g) => (
          <li key={g.gkz} className="flex flex-col rounded-3xl bg-white p-5 ring-1 ring-ink-200/70">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <p className="font-display text-[17px] font-bold leading-snug text-ink-900">{g.gemeinde}</p>
                <p className="mt-0.5 text-[12.5px] text-ink-500">GKZ {g.gkz} · {bezirkInfo?.bundesland}</p>
              </div>
              <StatusChip status={g.status} />
            </div>

            {g.programm && <p className="mt-3 text-[14.5px] font-semibold leading-snug text-ink-800">{g.programm}</p>}
            {g.hoehe && (
              <p className="mt-2 text-[14.5px] leading-relaxed text-ink-700">
                <span className="font-semibold text-ov-700">Höhe: </span>
                {g.hoehe}
              </p>
            )}
            {g.status === "keine" && <p className="mt-3 text-[14.5px] leading-relaxed text-ink-700">keine Förderung gefunden (Stand {datum(g.geprueftAm)})</p>}
            {g.bedingungen?.length > 0 && (
              <ul className="mt-2 list-disc space-y-1 pl-5 text-[13.5px] leading-relaxed text-ink-600">
                {g.bedingungen.map((b) => (
                  <li key={b}>{b}</li>
                ))}
              </ul>
            )}
            {g.frist && (
              <p className="mt-2 text-[13.5px] text-ink-600">
                <span className="font-semibold text-ink-800">Frist: </span>
                {g.frist}
              </p>
            )}
            {g.zielgruppen?.length > 0 && <p className="mt-2 text-[12.5px] text-ink-500">Für: {g.zielgruppen.map((z) => ZG_LABEL[z] || z).join(", ")}</p>}
            {g.hinweis && (
              <p className={cn("mt-3 flex gap-2 text-[13px] leading-relaxed", g.pruefen ? "text-ink-800" : "text-ink-600")}>
                {g.pruefen && <CircleAlert aria-hidden="true" className="mt-0.5 h-3.5 w-3.5 shrink-0 text-sun-500" />}
                <span>
                  {g.pruefen && <strong className="font-semibold">Bitte bei der Gemeinde prüfen: </strong>}
                  {g.hinweis}
                </span>
              </p>
            )}

            <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-4 text-[12.5px] text-ink-500">
              <span>{g.geprueftAm ? `geprüft am ${datum(g.geprueftAm)}` : "noch nicht geprüft"}</span>
              {g.quelleUrl && (
                <a href={g.quelleUrl} target="_blank" rel="noopener noreferrer" className="-my-3 inline-flex min-h-11 items-center gap-1 px-1 font-semibold text-ov-700 underline decoration-ov-300 underline-offset-2 hover:text-ov-800">
                  Quelle
                  <ArrowUpRight aria-hidden="true" className="h-3.5 w-3.5" />
                  <span className="sr-only">(externer Link, neues Fenster)</span>
                </a>
              )}
            </div>
          </li>
        ))}
      </ul>
      {offen.length > 0 && (
        <div className="mt-3 rounded-3xl bg-sand-50 p-5 ring-1 ring-ink-200/70">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="font-display text-[16px] font-bold leading-snug text-ink-900">
              {offen.length} {offen.length === 1 ? "Gemeinde" : "Gemeinden"} noch nicht geprüft
            </p>
            <StatusChip status="ungeprueft" />
          </div>
          <p className="mt-1.5 text-[13.5px] leading-relaxed text-ink-600">
            Für diese Gemeinden liegt uns noch keine Primärquelle vor – bitte beim Gemeindeamt nachfragen. Wir ergänzen laufend.
          </p>
          <ul className="mt-3 flex flex-wrap gap-x-1 gap-y-1 text-[13.5px] text-ink-700" aria-label="Noch nicht geprüfte Gemeinden">
            {offen.map((g, i) => (
              <li key={g.gkz} className="inline-flex items-center">
                {g.quelleUrl ? (
                  <a href={g.quelleUrl} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center px-0.5 font-medium text-ink-800 underline decoration-ink-300 underline-offset-2 hover:text-ov-800">
                    {g.gemeinde}
                    <span className="sr-only"> (Gemeinde-Website, externer Link, neues Fenster)</span>
                  </a>
                ) : (
                  <span className="inline-flex min-h-6 items-center px-0.5">{g.gemeinde}</span>
                )}
                {i < offen.length - 1 && <span aria-hidden="true" className="text-ink-500">,</span>}
              </li>
            ))}
          </ul>
        </div>
      )}
      {liste.length === 0 && <p className="mt-4 rounded-3xl bg-white p-5 text-[14.5px] text-ink-600 ring-1 ring-ink-200/70">Keine Gemeinde passt zu Filter und Suche.</p>}

      <p className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 text-[13.5px] text-ink-600">
        <span>Programm fehlt, Betrag falsch oder Richtlinie geändert?</span>
        <a href={MELDEN} className="inline-flex min-h-11 items-center gap-1.5 font-semibold text-ov-700 underline decoration-ov-300 underline-offset-2 hover:text-ov-800">
          <Mail aria-hidden="true" className="h-4 w-4" />
          Fehler melden
        </a>
        <span className="text-ink-500">(E-Mail an office@oekovolt.at, es werden keine Formulardaten übertragen)</span>
      </p>
    </div>
  );
}
