"use client";

import { useState } from "react";
import { ArrowUpRight, Check, RotateCcw } from "lucide-react";
import { cn } from "@/components/ui/cn";
import { CHECKLISTE } from "@/lib/flaeche/checkliste";

/**
 * Abhakbare Checkliste für den Pachtvertrag. Der Inhalt ist server-gerendert
 * (SEO); der Haken-Status lebt nur im Browser und wird nicht gespeichert.
 */
export default function PachtCheckliste() {
  const [erledigt, setErledigt] = useState(() => new Set());
  const anzahl = erledigt.size;
  const gesamt = CHECKLISTE.length;
  const anteil = Math.round((anzahl / gesamt) * 100);

  const umschalten = (id) =>
    setErledigt((alt) => {
      const neu = new Set(alt);
      if (neu.has(id)) neu.delete(id);
      else neu.add(id);
      return neu;
    });

  return (
    <div className="rounded-[2rem] bg-white p-5 ring-1 ring-ink-200/70 sm:p-7 md:p-9">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <p className="text-[14.5px] font-semibold text-ink-800" aria-live="polite">
          <span className="ov-num font-display text-[22px] font-extrabold text-ink-900">{anzahl}</span> von {gesamt} Punkten geklärt
        </p>
        {anzahl > 0 && (
          <button
            type="button"
            onClick={() => setErledigt(new Set())}
            className="inline-flex min-h-11 items-center gap-1.5 rounded-full px-3 text-[13.5px] font-semibold text-ink-600 hover:bg-ink-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ov-500"
          >
            <RotateCcw aria-hidden="true" className="h-3.5 w-3.5" />
            Zurücksetzen
          </button>
        )}
      </div>
      <div className="mt-3 h-2 overflow-hidden rounded-full bg-ink-100" aria-hidden="true">
        <div className="h-full rounded-full bg-ov-500 transition-[width] duration-500" style={{ width: `${anteil}%` }} />
      </div>

      <ol className="mt-7 grid gap-3 md:grid-cols-2">
        {CHECKLISTE.map((c, i) => {
          const an = erledigt.has(c.id);
          const id = `check-${c.id}`;
          return (
            <li key={c.id} className={cn("flex gap-3 rounded-2xl p-4 ring-1 transition-colors", an ? "bg-ov-50 ring-ov-200" : "bg-sand-50 ring-ink-200/60")}>
              <input id={id} type="checkbox" checked={an} onChange={() => umschalten(c.id)} className="peer sr-only" />
              <label
                htmlFor={id}
                className={cn(
                  "mt-0.5 flex h-7 w-7 shrink-0 cursor-pointer items-center justify-center rounded-lg ring-1 transition-colors peer-focus-visible:ring-2 peer-focus-visible:ring-ov-500",
                  an ? "bg-ov-500 text-white ring-ov-500" : "bg-white text-transparent ring-ink-300"
                )}
              >
                <Check aria-hidden="true" className="h-4 w-4" strokeWidth={3} />
                <span className="sr-only">{c.titel} als geklärt markieren</span>
              </label>
              <div className="min-w-0">
                <p className="font-display text-[16px] font-bold leading-snug text-ink-900">
                  <span className="mr-1.5 text-[13px] text-ov-600">{String(i + 1).padStart(2, "0")}</span>
                  {c.titel}
                </p>
                <p className="mt-1 text-[14.5px] leading-relaxed text-ink-700">{c.frage}</p>
                {c.info && <p className="mt-1.5 text-[13.5px] leading-relaxed text-ink-500">{c.info}</p>}
                {c.quelle && (
                  <a
                    href={c.quelle.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1.5 inline-flex items-center gap-1 text-[12.5px] text-ink-500 underline decoration-ink-300 underline-offset-2 hover:text-ov-700"
                  >
                    Quelle: {c.quelle.label.split(" – ")[0]}
                    <ArrowUpRight aria-hidden="true" className="h-3 w-3" />
                    <span className="sr-only">(externer Link, neues Fenster)</span>
                  </a>
                )}
              </div>
            </li>
          );
        })}
      </ol>
      <p className="mt-6 text-[12.5px] leading-relaxed text-ink-500">
        Diese Checkliste ersetzt keine Rechts- oder Steuerberatung. Lassen Sie Pachtverträge vor der Unterschrift von Ihrer Landwirtschaftskammer, einer Notarin oder einem Anwalt prüfen.
      </p>
    </div>
  );
}
