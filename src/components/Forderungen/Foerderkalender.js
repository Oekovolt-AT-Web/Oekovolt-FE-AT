"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, CalendarPlus, CircleAlert } from "lucide-react";
import { cn } from "@/components/ui/cn";
import { FRISTEN_ARTEN, FRISTEN_ZIELGRUPPEN, fristenImFenster, istKommend, monateAb } from "@/data/foerderFristen";
import { datumKurzIso, heuteWienIso, tagEnde, tagStart } from "@/lib/programmStatus";

/**
 * Fristen-Kalender mit gleitendem Fenster (−2 bis +10 Monate ab heute) aus
 * src/data/foerderFristen.js. Hydration: Startwert ist `heuteIso` vom Server;
 * nach dem Mounten rechnet die Komponente mit der Uhr des Browsers (Muster
 * HinweisLeiste.js) – vergangene Termine wandern ohne Deploy in den Rückblick.
 *
 * heuteIso:   ISO-Datum des Server-Renderings
 * zielgruppe: Vorauswahl betrieb | landwirtschaft | gemeinde | privat (optional)
 * dark:       Darstellung auf Navy
 */

const MONATE = ["Jän", "Feb", "Mär", "Apr", "Mai", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dez"];
const MONATE_LANG = ["Jänner", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"];
const TAG_MS = 86_400_000;

const ART_TON = {
  einreichfrist: "bg-ov-600 text-white",
  start: "bg-ov-100 text-ov-800",
  gebotstermin: "bg-sun-400 text-navy-950",
  rechtsaenderung: "bg-navy-100 text-navy-800",
  laufzeitende: "bg-ink-200 text-ink-800",
};

function monatsSchluessel(iso) {
  return iso.slice(0, 7);
}

export default function Foerderkalender({ heuteIso, zielgruppe: start = "", vor = 2, nach = 10, dark = false, className }) {
  const [heute, setHeute] = useState(heuteIso);
  const [jetzt, setJetzt] = useState(() => tagStart(heuteIso) + 12 * 3_600_000);
  const [zielgruppe, setZielgruppe] = useState(start);

  useEffect(() => {
    const tick = () => {
      const d = new Date();
      setHeute(heuteWienIso(d)); // Kalendertag in Wien
      setJetzt(d.getTime());
    };
    tick();
    const t = setInterval(tick, 60_000);
    return () => clearInterval(t);
  }, []);

  const fristen = useMemo(() => fristenImFenster({ heuteIso: heute, vor, nach, zielgruppe: zielgruppe || undefined }), [heute, vor, nach, zielgruppe]);

  // Monatsleiste des Fensters
  const monate = useMemo(() => {
    const liste = [];
    for (let i = -vor; i <= nach; i += 1) {
      const iso = monateAb(`${heute.slice(0, 7)}-01`, i);
      const key = monatsSchluessel(iso);
      liste.push({ key, label: MONATE[Number(iso.slice(5, 7)) - 1], jahr: iso.slice(0, 4), n: fristen.filter((f) => monatsSchluessel(f.datum) === key).length, aktuell: i === 0 });
    }
    return liste;
  }, [heute, vor, nach, fristen]);

  const gruppen = useMemo(() => {
    const m = new Map();
    for (const f of fristen) {
      const k = monatsSchluessel(f.datum);
      if (!m.has(k)) m.set(k, []);
      m.get(k).push(f);
    }
    return [...m.entries()];
  }, [fristen]);

  const zustand = (f) => {
    const ende = tagEnde(f.bis || f.datum);
    const beginn = tagStart(f.datum);
    if (jetzt >= ende) return "vorbei";
    if (jetzt >= beginn) return "heute";
    if (ende - jetzt <= 30 * TAG_MS) return "bald";
    return "kommend";
  };

  // „kommend“ wie auf der Seite: Termin heute oder später (Kalendertag Wien)
  const kommendAnzahl = fristen.filter((f) => istKommend(f, heute)).length;

  const icsHref =`/forderungen/fristen.ics${zielgruppe ? `?zielgruppe=${zielgruppe}` : ""}`;
  const text1 = dark ? "text-white" : "text-ink-900";
  const text2 = dark ? "text-white/70" : "text-ink-600";
  const text3 = dark ? "text-white/60" : "text-ink-500";

  return (
    <div className={className}>
      {/* Zielgruppe + Kalender-Abo */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div role="group" aria-label="Zielgruppe wählen" className={cn("flex flex-wrap gap-2 rounded-full p-1", dark ? "bg-white/[0.06]" : "bg-sand-50")}>
          {[{ id: "", label: "Alle" }, ...FRISTEN_ZIELGRUPPEN].map((z) => {
            const an = zielgruppe === z.id;
            return (
              <button
                key={z.id || "alle"}
                type="button"
                aria-pressed={an}
                onClick={() => setZielgruppe(z.id)}
                className={cn(
                  "rounded-full px-4 py-2 text-[14px] font-semibold transition-colors",
                  an ? "bg-ov-600 text-white shadow-sm" : dark ? "text-white/75 hover:bg-white/10 hover:text-white" : "text-ink-700 hover:bg-white hover:text-ink-900"
                )}
              >
                {z.label}
              </button>
            );
          })}
        </div>
        <a href={icsHref} className={cn("inline-flex h-11 shrink-0 items-center gap-2 rounded-full px-5 text-[14.5px] font-semibold transition-colors", dark ? "bg-white/10 text-white hover:bg-white/20" : "bg-navy-950 text-white hover:bg-navy-800")}>
          <CalendarPlus aria-hidden="true" className="h-4 w-4" />
          In den Kalender (ICS{zielgruppe ? `, ${FRISTEN_ZIELGRUPPEN.find((z) => z.id === zielgruppe)?.label}` : ""})
        </a>
      </div>

      {/* Monatsleiste */}
      <ol aria-label="Monate im Fenster" className={cn("mt-6 grid grid-cols-7 gap-1 sm:grid-cols-13", dark ? "" : "")}>
        {monate.map((m) => (
          <li key={m.key} className="min-w-0">
            <a
              href={m.n ? `#monat-${m.key}` : undefined}
              aria-disabled={!m.n}
              className={cn(
                "flex min-h-[64px] flex-col items-center justify-center rounded-2xl px-1 py-2 text-center transition-colors",
                m.aktuell ? "bg-ov-600 text-white" : m.n ? (dark ? "bg-white/[0.08] text-white hover:bg-white/15" : "bg-sand-50 text-ink-900 hover:bg-ov-50") : dark ? "bg-white/[0.03] text-white/60" : "bg-sand-50/60 text-ink-500"
              )}
            >
              <span className="text-[11px] font-semibold uppercase tracking-wider">{m.label}</span>
              <span className={cn("ov-num mt-0.5 font-display text-[18px] font-extrabold leading-none", !m.n && !m.aktuell && "opacity-50")}>{m.n}</span>
              {m.aktuell && <span className="mt-0.5 text-[10px] font-semibold uppercase tracking-wider text-white/80">heute</span>}
            </a>
          </li>
        ))}
      </ol>
      <p className={cn("mt-2 text-[12.5px]", text3)}>
        Fenster {datumKurzIso(monateAb(heute, -vor))} bis {datumKurzIso(monateAb(heute, nach))} · Stand {datumKurzIso(heute)} · {fristen.length} Termine im Fenster, davon {kommendAnzahl} kommende
      </p>

      {/* Liste nach Monat */}
      <div className="mt-8 space-y-8">
        {gruppen.length === 0 && <p className={cn("rounded-3xl p-6 text-[15px]", dark ? "bg-white/[0.06] text-white/75" : "bg-sand-50 text-ink-600")}>Für diese Auswahl liegen im Fenster keine Termine vor.</p>}
        {gruppen.map(([key, liste]) => (
          <section key={key} id={`monat-${key}`} aria-labelledby={`monat-${key}-titel`} className="scroll-mt-28">
            <h3 id={`monat-${key}-titel`} className={cn("flex items-baseline gap-3 font-display text-[20px] font-extrabold tracking-tight", text1)}>
              {MONATE_LANG[Number(key.slice(5, 7)) - 1]} {key.slice(0, 4)}
              <span className={cn("ov-num text-[13px] font-semibold", text3)}>{liste.length} {liste.length === 1 ? "Termin" : "Termine"}</span>
            </h3>
            <ol className="mt-4 grid gap-3">
              {liste.map((f) => {
                const z = zustand(f);
                return (
                  <li
                    key={f.id}
                    id={f.id}
                    className={cn(
                      "grid gap-3 rounded-3xl p-5 ring-1 transition-colors sm:grid-cols-[96px_1fr] sm:gap-6",
                      dark ? "bg-white/[0.06] ring-white/10" : "bg-white ring-ink-200/70",
                      z === "vorbei" && "opacity-70"
                    )}
                  >
                    <div>
                      <p className={cn("ov-num font-display text-[26px] font-extrabold leading-none", z === "vorbei" ? text3 : z === "bald" || z === "heute" ? "text-ov-600" : text1)}>
                        {f.datum.slice(8, 10)}.{f.datum.slice(5, 7)}.
                      </p>
                      <p className={cn("mt-1 text-[12px] font-semibold uppercase tracking-wider", text3)}>
                        {z === "vorbei" ? "vorbei" : z === "heute" ? "läuft" : z === "bald" ? "in Kürze" : f.bis ? `bis ${datumKurzIso(f.bis)}` : f.datum.slice(0, 4)}
                      </p>
                    </div>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={cn("rounded-full px-2.5 py-0.5 text-[12px] font-semibold", ART_TON[f.art])}>{FRISTEN_ARTEN[f.art]}</span>
                        <span className={cn("rounded-full px-2.5 py-0.5 text-[12px] font-semibold", dark ? "bg-white/10 text-white/80" : "bg-ink-100 text-ink-700")}>{f.bundesland === "bund" ? "Bund" : f.bundesland.charAt(0).toUpperCase() + f.bundesland.slice(1).replace("oe", "ö").replace("ae", "ä")}</span>
                        {f.voraussichtlich && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-sun-300/40 px-2.5 py-0.5 text-[12px] font-semibold text-ink-800">
                            <CircleAlert aria-hidden="true" className="h-3 w-3 text-sun-500" />
                            voraussichtlich
                          </span>
                        )}
                        {f.pruefen && !f.voraussichtlich && <span className="rounded-full bg-sun-300/40 px-2.5 py-0.5 text-[12px] font-semibold text-ink-800">bitte prüfen</span>}
                      </div>
                      <p className={cn("mt-2 font-display text-[17px] font-bold leading-snug", text1)}>{f.titel}</p>
                      <p className={cn("mt-1.5 text-[14.5px] leading-relaxed", text2)}>{f.kurz}</p>
                      <p className={cn("mt-1 flex flex-wrap items-center gap-x-5 text-[13.5px]", text3)}>
                        <a href={f.quelle.url} target="_blank" rel="noopener noreferrer" className={cn("inline-flex min-h-11 items-center gap-1 underline decoration-ink-300 underline-offset-2", dark ? "hover:text-white" : "hover:text-ov-700")}>
                          Quelle: {f.quelle.label}
                          <ArrowUpRight aria-hidden="true" className="h-3.5 w-3.5 shrink-0" />
                          <span className="sr-only">(externer Link, neues Fenster)</span>
                        </a>
                        {f.seite && (
                          <Link href={f.seite} className={cn("inline-flex min-h-11 items-center gap-1 font-semibold", dark ? "text-ov-300 hover:text-white" : "text-ov-700 hover:text-ov-800")}>
                            Zur Seite
                            <ArrowRight aria-hidden="true" className="h-3.5 w-3.5" />
                          </Link>
                        )}
                        {f.geprueftAm && <span className="inline-flex min-h-11 items-center">geprüft {datumKurzIso(f.geprueftAm)}</span>}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ol>
          </section>
        ))}
      </div>
    </div>
  );
}
