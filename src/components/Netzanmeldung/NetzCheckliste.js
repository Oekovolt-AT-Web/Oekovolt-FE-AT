"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Check, Printer, RotateCcw } from "lucide-react";
import { cn } from "@/components/ui/cn";

/**
 * Abhakbare Checkliste für die Netzanmeldung. Der Stand bleibt nur im Browser
 * (localStorage, optional) – es wird nichts übertragen. Startzustand ist immer
 * „nichts abgehakt“ (hydrationssicher).
 *
 * gruppen: [{ titel, punkte: [{ id, titel, text }] }]
 */

const SPEICHER = "ov_netzanmeldung_checkliste_v1";

export default function NetzCheckliste({ gruppen = [], druckHref }) {
  const [erledigt, setErledigt] = useState({});
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

  function umschalten(id) {
    setErledigt((alt) => {
      const neu = { ...alt, [id]: !alt[id] };
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

  return (
    <div className="overflow-hidden rounded-[2rem] bg-white shadow-[0_50px_100px_-60px_rgba(3,18,43,0.6)] ring-1 ring-ink-200/70">
      <div className="flex flex-wrap items-center gap-x-5 gap-y-3 border-b border-ink-200/70 px-5 py-4 sm:px-8">
        <p className="font-display text-[16px] font-bold text-ink-900">
          <span className="ov-num">{anzahl}</span> von <span className="ov-num">{alle.length}</span> erledigt
        </p>
        <div
          className="h-2 min-w-[120px] flex-1 overflow-hidden rounded-full bg-ink-100"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={prozent}
          aria-label="Fortschritt der Netzanmeldung"
        >
          <span className="block h-full rounded-full bg-gradient-to-r from-ov-400 to-ov-600 transition-[width] duration-500 motion-reduce:transition-none" style={{ width: `${prozent}%` }} />
        </div>
        <div className="flex items-center gap-2">
          {druckHref && (
            <Link href={druckHref} className="inline-flex h-9 items-center gap-1.5 rounded-full bg-navy-950 px-4 text-[13px] font-semibold text-white transition-colors hover:bg-navy-800">
              <Printer aria-hidden="true" className="h-3.5 w-3.5" />
              Druckversion
            </Link>
          )}
          <button
            type="button"
            onClick={zuruecksetzen}
            className="inline-flex h-9 items-center gap-1.5 rounded-full px-3 text-[13px] font-semibold text-ink-600 ring-1 ring-ink-200 transition-colors hover:bg-ink-50"
          >
            <RotateCcw aria-hidden="true" className="h-3.5 w-3.5" />
            Zurücksetzen
          </button>
        </div>
      </div>

      <div className="grid divide-y divide-ink-200/70 md:grid-cols-2 md:divide-x md:divide-y-0">
        {gruppen.map((g, gi) => (
          <fieldset key={g.titel} className={cn("min-w-0 px-5 py-6 sm:px-8", gi > 1 && "md:border-t md:border-ink-200/70")}>
            <legend className="sr-only">{g.titel}</legend>
            <p aria-hidden="true" className="flex items-center gap-2 text-[12px] font-bold uppercase tracking-[0.14em] text-ov-700">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-ov-50 text-[12px] ring-1 ring-ov-100">{gi + 1}</span>
              {g.titel}
            </p>
            <ul className="mt-4 space-y-2.5">
              {g.punkte.map((p) => {
                const an = !!erledigt[p.id];
                return (
                  <li key={p.id}>
                    <label className={cn("flex cursor-pointer gap-3 rounded-2xl p-3 ring-1 transition-colors", an ? "bg-ov-50 ring-ov-200" : "bg-sand-50/60 ring-ink-200/60 hover:bg-sand-50")}>
                      <input type="checkbox" checked={an} onChange={() => umschalten(p.id)} className="peer sr-only" />
                      <span
                        aria-hidden="true"
                        className={cn(
                          "mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg ring-1 transition-colors peer-focus-visible:ring-2 peer-focus-visible:ring-ov-500",
                          an ? "bg-ov-600 text-white ring-ov-600" : "bg-white text-transparent ring-ink-300"
                        )}
                      >
                        <Check className="h-4 w-4" strokeWidth={3} />
                      </span>
                      <span className="min-w-0">
                        <span className={cn("block text-[15px] font-semibold leading-snug", an ? "text-ink-500 line-through decoration-ink-300" : "text-ink-900")}>{p.titel}</span>
                        <span className="mt-0.5 block text-[13.5px] leading-relaxed text-ink-600">{p.text}</span>
                      </span>
                    </label>
                  </li>
                );
              })}
            </ul>
          </fieldset>
        ))}
      </div>
    </div>
  );
}
