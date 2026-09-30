"use client";

import { useEffect, useState } from "react";
import { Check, ClipboardCopy, RotateCcw } from "lucide-react";
import { cn } from "@/components/ui/cn";

/**
 * Abhakbare Checkliste „Unterlagen für den Gemeinderat“.
 * Fortschritt nur im Browser (localStorage, optional); Startzustand „nichts abgehakt“
 * (hydrationssicher). „Liste kopieren“ legt die Punkte als Text in die Zwischenablage –
 * zum Einfügen in Sitzungsvorlage oder Amtsvortrag. Es wird nichts übertragen.
 *
 * gruppen: [{ titel, punkte: [{ id, titel, text }] }]
 */

const SPEICHER = "ov_kommunen_gemeinderat_checkliste_v1";

export default function GemeinderatCheckliste({ gruppen = [] }) {
  const [erledigt, setErledigt] = useState({});
  const [kopiert, setKopiert] = useState("");
  const alle = gruppen.flatMap((g) => g.punkte);
  const anzahl = alle.filter((p) => erledigt[p.id]).length;
  const prozent = alle.length ? Math.round((anzahl / alle.length) * 100) : 0;

  useEffect(() => {
    try {
      const wert = JSON.parse(localStorage.getItem(SPEICHER) || "null");
      if (wert && typeof wert === "object") setErledigt(wert);
    } catch {
      /* kein Speicher verfügbar – Liste funktioniert trotzdem */
    }
  }, []);

  function speichern(neu) {
    try {
      localStorage.setItem(SPEICHER, JSON.stringify(neu));
    } catch {
      /* egal */
    }
  }

  function umschalten(pid) {
    setErledigt((alt) => {
      const neu = { ...alt, [pid]: !alt[pid] };
      speichern(neu);
      return neu;
    });
  }

  function zuruecksetzen() {
    setErledigt({});
    try {
      localStorage.removeItem(SPEICHER);
    } catch {
      /* egal */
    }
  }

  async function kopieren() {
    const text = [
      "Unterlagen für den Gemeinderat – Photovoltaik-Projekt",
      "",
      ...gruppen.flatMap((g) => [g.titel.toUpperCase(), ...g.punkte.map((p) => `[${erledigt[p.id] ? "x" : " "}] ${p.titel} – ${p.text}`), ""]),
      "Orientierung ohne Gewähr, keine Rechtsberatung. Quelle: oekovolt.com/kommunen/vergabe-foerderung",
    ].join("\n");
    try {
      await navigator.clipboard.writeText(text);
      setKopiert("Liste in die Zwischenablage kopiert.");
    } catch {
      setKopiert("Kopieren nicht möglich – bitte Text markieren und kopieren.");
    }
    setTimeout(() => setKopiert(""), 4000);
  }

  return (
    <div className="overflow-hidden rounded-[2rem] bg-white shadow-[0_50px_100px_-60px_rgba(3,18,43,0.6)] ring-1 ring-ink-200/70">
      <div className="flex flex-wrap items-center gap-4 border-b border-ink-200/70 px-5 py-4 sm:px-8">
        <p className="font-display text-[16px] font-bold text-ink-900">
          <span className="ov-num">{anzahl}</span> von <span className="ov-num">{alle.length}</span> vorbereitet
        </p>
        <div className="h-2 min-w-[120px] flex-1 overflow-hidden rounded-full bg-ink-100" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={prozent} aria-label="Fortschritt der Unterlagen">
          <div className="h-full rounded-full bg-gradient-to-r from-ov-400 to-ov-600 transition-[width] duration-500" style={{ width: `${prozent}%` }} />
        </div>
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={kopieren}
            className="inline-flex items-center gap-1.5 rounded-full bg-navy-950 px-4 py-2 text-[13px] font-semibold text-white transition hover:bg-navy-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ov-500 focus-visible:ring-offset-2"
          >
            <ClipboardCopy aria-hidden="true" className="h-3.5 w-3.5" />
            Liste kopieren
          </button>
          {anzahl > 0 && (
            <button type="button" onClick={zuruecksetzen} className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-ink-500 hover:text-ink-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ov-500">
              <RotateCcw aria-hidden="true" className="h-3.5 w-3.5" />
              Zurücksetzen
            </button>
          )}
        </div>
        <p role="status" className="w-full text-[13px] text-ov-700 empty:hidden">
          {kopiert}
        </p>
      </div>

      <div className="grid lg:grid-cols-2">
        {gruppen.map((g, gi) => (
          <fieldset key={g.titel} className={cn("min-w-0 p-5 sm:p-8", gi % 2 === 1 && "lg:border-l lg:border-ink-200/70", gi > 1 && "border-t border-ink-200/70", gi === 1 && "border-t border-ink-200/70 lg:border-t-0")}>
            <legend className="sr-only">{g.titel}</legend>
            <p aria-hidden="true" className="font-display text-[18px] font-bold text-ink-900">
              {g.titel}
            </p>
            <ul className="mt-4 space-y-2">
              {g.punkte.map((p) => {
                const an = Boolean(erledigt[p.id]);
                return (
                  <li key={p.id}>
                    <label className={cn("group flex cursor-pointer gap-3 rounded-2xl p-3 transition-colors focus-within:ring-2 focus-within:ring-ov-500", an ? "bg-ov-50" : "hover:bg-sand-50")}>
                      <input type="checkbox" className="sr-only" checked={an} onChange={() => umschalten(p.id)} />
                      <span aria-hidden="true" className={cn("mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg ring-2 transition-all", an ? "bg-ov-600 text-white ring-ov-600" : "bg-white text-transparent ring-ink-300 group-hover:ring-ov-400")}>
                        <Check className="h-4 w-4" strokeWidth={3} />
                      </span>
                      <span className="min-w-0">
                        <span className={cn("block text-[15px] font-semibold leading-snug", an ? "text-ink-500 line-through decoration-ov-400" : "text-ink-900")}>{p.titel}</span>
                        <span className="mt-1 block text-[14px] leading-relaxed text-ink-600">{p.text}</span>
                      </span>
                    </label>
                  </li>
                );
              })}
            </ul>
          </fieldset>
        ))}
      </div>
      <p className="border-t border-ink-200/70 bg-sand-50 px-5 py-3 text-[12.5px] text-ink-500 sm:px-8">Ihr Fortschritt bleibt nur in diesem Browser gespeichert – es wird nichts an Ökovolt übertragen.</p>
    </div>
  );
}
