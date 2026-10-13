"use client";

// src/components/Forderungen/StatusAmpel.js
//
// Ampel-Tabelle aller Bundes- und Landesprogramme (PV, Speicher, Wärmepumpe,
// Ladeinfrastruktur) für /forderungen/status. Die Zeilen kommen serialisiert vom
// Server (page.js); der Status wird im Browser mit programmStatus() aus
// @/lib/programmStatus (C01) berechnet – Startwert vom Server (hydrationssicher),
// danach Neuberechnung beim Aufruf und jede Minute (Muster HinweisLeiste.js), damit
// ein Statuswechsel ohne Deploy greift.

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, CircleAlert } from "lucide-react";
import { cn } from "@/components/ui/cn";
import { programmStatus, datumKurzIso, naechsterTermin, pruefungVeraltet } from "@/lib/programmStatus";

/** Anzeige je Status (Reihenfolge = Sortierung). */
export const AMPEL = {
  offen: { label: "läuft", punkt: "bg-ov-500", chip: "bg-ov-50 text-ov-800 ring-ov-200", rang: 0 },
  bald: { label: "endet bald", punkt: "bg-sun-400", chip: "bg-sun-300/30 text-ink-900 ring-sun-400/50", rang: 1 },
  wartet: { label: "wartet / angekündigt", punkt: "bg-navy-400", chip: "bg-navy-100 text-navy-800 ring-navy-200", rang: 2 },
  abgelaufen: { label: "abgelaufen / ausgeschöpft", punkt: "bg-[#e5484d]", chip: "bg-[#e5484d]/10 text-[#b42318] ring-[#e5484d]/25", rang: 3 },
};

export const THEMEN = [
  { id: "alle", label: "Alle Themen" },
  { id: "pv", label: "Photovoltaik" },
  { id: "speicher", label: "Stromspeicher" },
  { id: "waermepumpe", label: "Wärmepumpe" },
  { id: "laden", label: "Ladeinfrastruktur" },
];

export const EBENEN = [
  { id: "alle", label: "Bund + Länder" },
  { id: "bund", label: "Bund" },
  { id: "land", label: "Länder" },
];

function Chip({ status }) {
  const a = AMPEL[status] || AMPEL.wartet;
  return (
    <span className={cn("inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-0.5 text-[12px] font-semibold ring-1", a.chip)}>
      <span aria-hidden="true" className={cn("h-2 w-2 rounded-full", a.punkt)} />
      {a.label}
    </span>
  );
}

function Termin({ zeile, jetzt }) {
  const t = naechsterTermin(zeile, jetzt);
  if (zeile.terminText) return <span>{zeile.terminText}</span>;
  if (!t) return <span className="text-ink-500">kein Termin bekannt</span>;
  const art = t.art === "start" ? "Start" : t.art === "frist" ? "Frist" : "Laufzeit bis";
  return (
    <span>
      {art} {datumKurzIso(t.iso)}
    </span>
  );
}

function Alternative({ alt }) {
  if (!alt) return <span className="text-ink-500">–</span>;
  return alt.href ? (
    <Link href={alt.href} className="inline-block py-1.5 font-semibold text-ov-700 underline decoration-ov-300 underline-offset-2 hover:text-ov-800">
      {alt.text}
    </Link>
  ) : (
    <span>{alt.text}</span>
  );
}

/**
 * zeilen: [{ id, ebene: "bund"|"land", ebeneLabel, programm, traeger, themen[], statusText, geprueftAm,
 *            startIso?, fristIso?, gueltigBisIso?, anzeigeStatus?, pruefen?, terminText?, alternative?{text,href?}, url?, hoehe? }]
 * jetztMs: Server-Zeit für den ersten Render.
 */
export default function StatusAmpel({ zeilen = [], jetztMs }) {
  const [jetzt, setJetzt] = useState(jetztMs || Date.now());
  const [thema, setThema] = useState("alle");
  const [ebene, setEbene] = useState("alle");
  const [status, setStatus] = useState("alle");

  useEffect(() => {
    const tick = () => setJetzt(Date.now());
    tick();
    const t = setInterval(tick, 60_000);
    return () => clearInterval(t);
  }, []);

  const bewertet = useMemo(() => zeilen.map((z) => ({ ...z, ampel: programmStatus(z, jetzt), pruefung: pruefungVeraltet(z, jetzt) })), [zeilen, jetzt]);

  const liste = useMemo(
    () =>
      bewertet
        .filter((z) => thema === "alle" || z.themen.includes(thema))
        .filter((z) => ebene === "alle" || z.ebene === ebene)
        .filter((z) => status === "alle" || z.ampel === status)
        .sort((a, b) => AMPEL[a.ampel].rang - AMPEL[b.ampel].rang || (a.ebene === b.ebene ? 0 : a.ebene === "bund" ? -1 : 1) || a.programm.localeCompare(b.programm, "de")),
    [bewertet, thema, ebene, status]
  );

  const zaehlung = useMemo(() => bewertet.reduce((acc, z) => ({ ...acc, [z.ampel]: (acc[z.ampel] || 0) + 1 }), {}), [bewertet]);

  const pillen = (optionen, wert, setzen, label) => (
    <ul className="flex flex-wrap gap-2" aria-label={label}>
      {optionen.map((o) => {
        const aktiv = wert === o.id;
        return (
          <li key={o.id}>
            <button
              type="button"
              aria-pressed={aktiv}
              onClick={() => setzen(o.id)}
              className={cn("inline-flex min-h-11 items-center gap-1.5 rounded-full px-3.5 py-2 text-[13px] font-semibold transition-colors", aktiv ? "bg-navy-950 text-white" : "bg-white text-ink-700 hover:bg-ov-50")}
            >
              {o.punkt && <span aria-hidden="true" className={cn("h-2 w-2 rounded-full", aktiv ? "bg-white" : o.punkt)} />}
              {o.label}
              {typeof o.anzahl === "number" && <span className={cn("text-[12px] font-medium", aktiv ? "text-white/70" : "text-ink-500")}>({o.anzahl})</span>}
            </button>
          </li>
        );
      })}
    </ul>
  );

  const statusOptionen = [{ id: "alle", label: "alle", anzahl: bewertet.length }, ...Object.entries(AMPEL).map(([id, a]) => ({ id, label: a.label, punkt: a.punkt, anzahl: zaehlung[id] || 0 }))];

  return (
    <div>
      <div className="flex flex-col gap-3">
        {pillen(THEMEN, thema, setThema, "Thema filtern")}
        {pillen(EBENEN, ebene, setEbene, "Ebene filtern")}
        {pillen(statusOptionen, status, setStatus, "Status filtern")}
      </div>

      <p className="mt-5 text-[13.5px] text-ink-600" aria-live="polite">
        {liste.length} von {zeilen.length} Programmen · Status berechnet am {datumKurzIso(new Date(jetzt).toISOString())} aus Fristen und Laufzeiten
      </p>

      {/* Desktop: Tabelle */}
      <div className="mt-4 hidden overflow-hidden rounded-3xl bg-white ring-1 ring-ink-200/70 lg:block">
        <table className="w-full border-collapse text-left text-[14.5px]">
          <caption className="sr-only">Förderstatus aller Bundes- und Landesprogramme</caption>
          <thead>
            <tr className="bg-navy-950 text-white">
              {["Programm", "Status", "geprüft am", "nächster Termin", "Alternative"].map((h) => (
                <th key={h} scope="col" className="px-5 py-3.5 text-[12.5px] font-semibold uppercase tracking-wider">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-ink-100">
            {liste.map((z) => (
              <tr key={z.id} className="align-top transition-colors hover:bg-ov-50/40">
                <th scope="row" className="px-5 py-4 font-normal">
                  <p className="font-semibold text-ink-900">{z.programm}</p>
                  <p className="mt-0.5 text-[12.5px] text-ink-500">
                    {z.ebeneLabel} · {z.traeger}
                  </p>
                  {z.hoehe && <p className="mt-1 text-[13px] text-ink-700">{z.hoehe}</p>}
                  <p className="mt-1 text-[13px] text-ink-600">{z.statusText}</p>
                  {z.url && (
                    <a href={z.url} target="_blank" rel="noopener noreferrer" className="-mb-2 inline-flex min-h-11 items-center gap-1 pr-2 text-[12.5px] font-semibold text-ov-700 underline decoration-ov-300 underline-offset-2 hover:text-ov-800">
                      Quelle
                      <ArrowUpRight aria-hidden="true" className="h-3 w-3" />
                      <span className="sr-only">(externer Link, neues Fenster)</span>
                    </a>
                  )}
                </th>
                <td className="px-5 py-4">
                  <Chip status={z.ampel} />
                  {z.pruefen && (
                    <span className="mt-1.5 flex items-center gap-1 text-[11.5px] font-semibold text-ink-800">
                      <CircleAlert aria-hidden="true" className="h-3 w-3 text-sun-500" />
                      bitte bei der Förderstelle prüfen
                    </span>
                  )}
                </td>
                <td className="px-5 py-4 text-ink-700">
                  {datumKurzIso(z.geprueftAm) || "–"}
                  {!z.pruefung.ok && <span className="block text-[11.5px] text-ink-500">{z.pruefung.grund}</span>}
                </td>
                <td className="px-5 py-4 text-ink-700">
                  <Termin zeile={z} jetzt={jetzt} />
                </td>
                <td className="px-5 py-4 text-ink-700">
                  <Alternative alt={z.alternative} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobil/Tablet: Karten */}
      <ul className="mt-4 grid gap-3 md:grid-cols-2 lg:hidden">
        {liste.map((z) => (
          <li key={z.id} className="rounded-3xl bg-white p-5 ring-1 ring-ink-200/70">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-display text-[16.5px] font-bold leading-snug text-ink-900">{z.programm}</p>
                <p className="mt-0.5 text-[12.5px] text-ink-500">
                  {z.ebeneLabel} · {z.traeger}
                </p>
              </div>
              <Chip status={z.ampel} />
            </div>
            {z.hoehe && <p className="mt-2 text-[13.5px] text-ink-700">{z.hoehe}</p>}
            <p className="mt-1 text-[13.5px] text-ink-600">{z.statusText}</p>
            <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 text-[13px]">
              <div>
                <dt className="font-semibold uppercase tracking-wider text-ink-500">geprüft am</dt>
                <dd className="text-ink-700">{datumKurzIso(z.geprueftAm) || "–"}</dd>
              </div>
              <div>
                <dt className="font-semibold uppercase tracking-wider text-ink-500">nächster Termin</dt>
                <dd className="text-ink-700">
                  <Termin zeile={z} jetzt={jetzt} />
                </dd>
              </div>
              <div className="col-span-2">
                <dt className="font-semibold uppercase tracking-wider text-ink-500">Alternative</dt>
                <dd className="text-ink-700">
                  <Alternative alt={z.alternative} />
                </dd>
              </div>
            </dl>
            <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-[12.5px]">
              {z.pruefen ? (
                <span className="flex items-center gap-1 font-semibold text-ink-800">
                  <CircleAlert aria-hidden="true" className="h-3 w-3 text-sun-500" />
                  bitte bei der Förderstelle prüfen
                </span>
              ) : (
                <span />
              )}
              {z.url && (
                <a href={z.url} target="_blank" rel="noopener noreferrer" className="-my-3 inline-flex min-h-11 items-center gap-1 px-1 font-semibold text-ov-700 underline decoration-ov-300 underline-offset-2 hover:text-ov-800">
                  Quelle
                  <ArrowUpRight aria-hidden="true" className="h-3 w-3" />
                  <span className="sr-only">(externer Link, neues Fenster)</span>
                </a>
              )}
            </div>
          </li>
        ))}
      </ul>
      {liste.length === 0 && <p className="mt-4 rounded-3xl bg-white p-5 text-[14.5px] text-ink-600 ring-1 ring-ink-200/70">Kein Programm passt zu dieser Auswahl.</p>}
    </div>
  );
}
