"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, CircleAlert, Rss } from "lucide-react";
import { cn } from "@/components/ui/cn";
import { TICKER_STATUS, TICKER_TYPEN, TICKER_ZIELGRUPPEN } from "@/data/foerderTicker";
import { datumKurzIso } from "@/lib/programmStatus";

/**
 * Förder-Ticker mit Filtern (Typ, Bundesland, Zielgruppe). Alle Einträge stehen im HTML
 * (SEO, Strg+F); die Filter blenden nur aus. eintraege: tickerEintraege() vom Server.
 * laender: [{ key, name }]
 */

const TYP_TON = {
  neu: "bg-ov-600 text-white",
  kennzahl: "bg-navy-950 text-white",
  frist: "bg-sun-400 text-navy-950",
  korrektur: "bg-[#e5484d]/10 text-[#b42318] ring-1 ring-[#e5484d]/25",
  beschluss: "bg-navy-100 text-navy-800",
  ankuendigung: "bg-ink-200 text-ink-800",
};
const STATUS_TON = {
  bestaetigt: "bg-ov-50 text-ov-800 ring-1 ring-ov-200",
  angekuendigt: "bg-sun-300/40 text-ink-800",
  "zu-pruefen": "bg-sun-300/40 text-ink-800",
};
/** Lesbare Bezeichnung für verlinkte Seiten (Pfad ohne Anker); unbekannte Pfade → letztes Segment. */
const SEITEN_LABEL = {
  "/forderungen/bundesfoerderung": "Bundesförderung",
  "/forderungen/eag-foerdercall": "EAG-Fördercall",
  "/forderungen/fristen": "Fristen-Kalender",
  "/forderungen/aktuell": "Förder-Ticker",
  "/forderungen/richtlinien": "Richtlinien",
  "/forderungen/steuerlich": "Steuerliche Förderung",
  "/forderungen/landesforderungen/landesfoerderungen-in-kaernten": "Landesförderung Kärnten",
  "/forderungen/landesforderungen/landesfoerderungen-in-steiermark": "Landesförderung Steiermark",
  "/service/direktvermarktung": "Direktvermarktung",
  "/ratgeber/einspeiseverguetung-2026": "Ratgeber Einspeisevergütung 2026",
  "/gewerbespeicher": "Gewerbespeicher",
  "/energiegemeinschaften": "Energiegemeinschaften",
};
function seitenLabel(pfad) {
  const ohneAnker = pfad.replace(/#.*$/, "");
  if (SEITEN_LABEL[ohneAnker]) return SEITEN_LABEL[ohneAnker];
  const teil = ohneAnker.split("/").filter(Boolean).pop() || ohneAnker;
  return teil.charAt(0).toUpperCase() + teil.slice(1).replace(/-/g, " ");
}
/** Geschützte Leerzeichen zwischen Zahl und Einheit („45 %“, „6,9 Mio. €“), damit nichts umbricht. */
export function ohneUmbruch(text = "") {
  return String(text).replace(/(\d) (?=%|€|ct\/|Mio\.|Mrd\.|MW|kWh?\b|Uhr|Tage)/g, "$1\u00a0");
}
/** Pfad ohne Anker – für den Vergleich mit der aktuellen Seite. */
const pfadOhneAnker = (pfad = "") => pfad.replace(/#.*$/, "");

/** Mindestens 44 px hohe Tap-Fläche für Text-Links (wie LINK in den Landesseiten). */
const TAP = "inline-flex min-h-11 items-center";

const ZG_LABEL = { unternehmen: "Unternehmen", landwirtschaft: "Landwirtschaft", gemeinde: "Gemeinde", privat: "Privat", energiegemeinschaft: "Energiegemeinschaft" };

function Pille({ an, onClick, children }) {
  return (
    <button type="button" aria-pressed={an} onClick={onClick} className={cn("shrink-0 whitespace-nowrap rounded-full px-3.5 py-1.5 text-[13.5px] font-semibold transition-colors", an ? "bg-ov-600 text-white shadow-sm" : "text-ink-700 hover:bg-white hover:text-ink-900")}>
      {children}
    </button>
  );
}

export default function FoerderTickerListe({ eintraege = [], laender = [], aktuellerPfad = "/forderungen/aktuell", className }) {
  const [typ, setTyp] = useState("");
  const [land, setLand] = useState("");
  const [zg, setZg] = useState("");

  const sichtbar = useMemo(
    () => eintraege.filter((e) => (!typ || e.typ === typ) && (!land || e.bundesland === "bund" || e.bundesland === land) && (!zg || !e.zielgruppen?.length || e.zielgruppen.includes(zg))),
    [eintraege, typ, land, zg]
  );
  const landName = (k) => (k === "bund" ? "Bund" : laender.find((l) => l.key === k)?.name || k);

  return (
    <div className={className}>
      <div className="grid gap-3">
        {/* Volle Breite, eine Zeile: auf schmalen Geräten horizontal scrollbar statt Umbruch */}
        <div role="group" aria-label="Nach Art filtern" className="-mx-1 flex max-w-full flex-nowrap gap-1 overflow-x-auto rounded-full bg-sand-50 p-1 [scrollbar-width:none] sm:mx-0 sm:w-fit [&::-webkit-scrollbar]:hidden">
          <Pille an={!typ} onClick={() => setTyp("")}>Alle</Pille>
          {Object.entries(TICKER_TYPEN).map(([k, l]) => (
            <Pille key={k} an={typ === k} onClick={() => setTyp(typ === k ? "" : k)}>{l}</Pille>
          ))}
        </div>
        <div className="flex flex-wrap gap-3">
          <label className="flex items-center gap-2 text-[13.5px] font-semibold text-ink-700">
            <span className="sr-only sm:not-sr-only">Bundesland</span>
            <select value={land} onChange={(e) => setLand(e.target.value)} className="h-10 rounded-full bg-sand-50 px-4 text-[14px] font-semibold text-ink-900 outline-none focus-visible:ring-2 focus-visible:ring-ov-500">
              <option value="">Alle Bundesländer</option>
              {laender.map((l) => (
                <option key={l.key} value={l.key}>{l.name}</option>
              ))}
            </select>
          </label>
          <label className="flex items-center gap-2 text-[13.5px] font-semibold text-ink-700">
            <span className="sr-only sm:not-sr-only">Zielgruppe</span>
            <select value={zg} onChange={(e) => setZg(e.target.value)} className="h-10 rounded-full bg-sand-50 px-4 text-[14px] font-semibold text-ink-900 outline-none focus-visible:ring-2 focus-visible:ring-ov-500">
              <option value="">Alle Zielgruppen</option>
              {TICKER_ZIELGRUPPEN.map((z) => (
                <option key={z} value={z}>{ZG_LABEL[z]}</option>
              ))}
            </select>
          </label>
          <a href="/forderungen/aktuell/rss.xml" className="inline-flex h-10 items-center gap-2 rounded-full bg-sand-50 px-4 text-[14px] font-semibold text-ink-700 hover:bg-ov-50 hover:text-ov-800">
            <Rss aria-hidden="true" className="h-4 w-4 text-ov-600" />
            RSS
          </a>
        </div>
      </div>
      <p className="mt-3 text-[13px] text-ink-500" aria-live="polite">
        {sichtbar.length} von {eintraege.length} Meldungen
      </p>

      <ol className="mt-6 space-y-4">
        {eintraege.map((e) => {
          const aus = !sichtbar.includes(e);
          return (
            <li key={e.id} id={e.id} hidden={aus} className="scroll-mt-28">
              <article className="rounded-3xl bg-white p-6 ring-1 ring-ink-200/70 md:p-7">
                <div className="flex flex-wrap items-center gap-2 text-[12.5px]">
                  <time dateTime={e.datum} className="ov-num font-semibold text-ink-700">{datumKurzIso(e.datum)}</time>
                  <span className={cn("rounded-full px-2.5 py-0.5 font-semibold", TYP_TON[e.typ])}>{TICKER_TYPEN[e.typ]}</span>
                  <span className="rounded-full bg-ink-100 px-2.5 py-0.5 font-semibold text-ink-700">{landName(e.bundesland)}</span>
                  <span className={cn("inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 font-semibold", STATUS_TON[e.status])}>
                    {e.status !== "bestaetigt" && <CircleAlert aria-hidden="true" className="h-3 w-3 text-sun-500" />}
                    {TICKER_STATUS[e.status]}
                  </span>
                </div>
                <h2 className="mt-3 font-display text-[20px] font-bold leading-snug text-ink-900 md:text-[22px]">{e.titel}</h2>
                <p className="mt-2 text-[15.5px] leading-relaxed text-ink-700">{ohneUmbruch(e.kurz)}</p>
                {e.text && <p className="mt-3 text-[15px] leading-relaxed text-ink-600">{ohneUmbruch(e.text)}</p>}
                {e.zielgruppen?.length > 0 && e.zielgruppen.length < TICKER_ZIELGRUPPEN.length && (
                  <ul className="mt-3 flex flex-wrap gap-1.5" aria-label="Zielgruppen">
                    {e.zielgruppen.map((z) => (
                      <li key={z} className="rounded-full bg-ov-50 px-2.5 py-0.5 text-[12px] font-semibold text-ov-800">{ZG_LABEL[z]}</li>
                    ))}
                  </ul>
                )}
                <div className="mt-4 flex flex-wrap items-center gap-x-5 border-t border-dashed border-ink-200 pt-2 text-[13.5px] text-ink-600">
                  {[e.quelle, ...(e.quellen || [])].map((q) => (
                    <a key={q.url} href={q.url} target="_blank" rel="noopener noreferrer" className={cn(TAP, "gap-1 underline decoration-ink-300 underline-offset-2 hover:text-ov-700")}>
                      Quelle: {q.label}
                      <ArrowUpRight aria-hidden="true" className="h-3.5 w-3.5 shrink-0" />
                      <span className="sr-only">(externer Link, neues Fenster)</span>
                    </a>
                  ))}
                  {e.geprueftAm && <span className="inline-flex min-h-11 items-center text-ink-500">geprüft {datumKurzIso(e.geprueftAm)}</span>}
                </div>
                {e.seiten?.some((s) => pfadOhneAnker(s) !== aktuellerPfad) && (
                  <p className="flex flex-wrap gap-x-5 text-[14px]">
                    {e.seiten.filter((s) => pfadOhneAnker(s) !== aktuellerPfad).map((s) => (
                      <Link key={s} href={s} className={cn(TAP, "gap-1 font-semibold text-ov-700 hover:text-ov-800")}>
                        {seitenLabel(s)}
                        <ArrowRight aria-hidden="true" className="h-3.5 w-3.5" />
                      </Link>
                    ))}
                  </p>
                )}
              </article>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
