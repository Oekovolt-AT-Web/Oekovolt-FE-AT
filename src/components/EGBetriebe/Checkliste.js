"use client";

import { useEffect, useId, useState } from "react";
import { Check, Factory, Landmark, RotateCcw } from "lucide-react";

import { cn } from "@/components/ui/cn";

const SPEICHER = "ov-eg-betriebe-checkliste";

/**
 * Abhak-Checkliste für Betriebe und Gemeinden. Der Stand bleibt nur im eigenen Browser
 * (localStorage, per try/catch abgesichert) – die Seite funktioniert auch ohne.
 * listen: { betrieb: [{ id, titel, text }], gemeinde: [...] }
 */
export default function Checkliste({ listen }) {
  const [tab, setTab] = useState("betrieb");
  const [erledigt, setErledigt] = useState({});
  const basis = useId();

  useEffect(() => {
    try {
      const roh = window.localStorage.getItem(SPEICHER);
      if (roh) setErledigt(JSON.parse(roh) || {});
    } catch {
      /* Speicher nicht verfügbar – Liste startet leer */
    }
  }, []);

  const setzen = (neu) => {
    setErledigt(neu);
    try {
      window.localStorage.setItem(SPEICHER, JSON.stringify(neu));
    } catch {
      /* ignorieren */
    }
  };

  const punkte = listen[tab] || [];
  const anzahl = punkte.filter((p) => erledigt[`${tab}-${p.id}`]).length;
  const anteil = punkte.length ? Math.round((anzahl / punkte.length) * 100) : 0;
  const TABS = [
    { id: "betrieb", label: "Für Betriebe", icon: Factory },
    { id: "gemeinde", label: "Für Gemeinden", icon: Landmark },
  ];

  return (
    <div className="rounded-[2rem] bg-white p-5 shadow-[0_24px_60px_-34px_rgba(21,26,36,0.35)] ring-1 ring-ink-200/70 md:p-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div role="tablist" aria-label="Checkliste wählen" className="inline-flex w-full gap-1.5 rounded-2xl bg-ink-100/80 p-1.5 sm:w-auto">
          {TABS.map((t) => {
            const aktiv = tab === t.id;
            return (
              <button
                key={t.id}
                type="button"
                role="tab"
                id={`${basis}-${t.id}`}
                aria-selected={aktiv}
                aria-controls={`${basis}-panel`}
                onClick={() => setTab(t.id)}
                className={cn(
                  "flex min-h-11 flex-1 items-center justify-center gap-2 rounded-xl px-4 text-[14.5px] transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ov-500 sm:flex-none",
                  aktiv ? "bg-white font-semibold text-ink-900 shadow-[0_2px_8px_-2px_rgba(21,26,36,0.18)] ring-1 ring-ink-200/70" : "text-ink-600 hover:text-ink-800"
                )}
              >
                <t.icon aria-hidden="true" className="h-4 w-4" />
                {t.label}
              </button>
            );
          })}
        </div>
        <div className="flex items-center gap-4">
          <p className="ov-num text-[14px] text-ink-600" aria-live="polite">
            <strong className="font-display text-[18px] text-ink-900">{anzahl}</strong> von {punkte.length} erledigt
          </p>
          {anzahl > 0 && (
            <button
              type="button"
              onClick={() => setzen(Object.fromEntries(Object.entries(erledigt).filter(([k]) => !k.startsWith(`${tab}-`))))}
              className="inline-flex min-h-11 items-center gap-1.5 rounded-full px-3 text-[13px] text-ink-500 hover:text-ink-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ov-500"
            >
              <RotateCcw aria-hidden="true" className="h-3.5 w-3.5" />
              Zurücksetzen
            </button>
          )}
        </div>
      </div>

      <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-ink-100" aria-hidden="true">
        <div className="h-full rounded-full bg-ov-500 transition-[width] duration-500 motion-reduce:transition-none" style={{ width: `${anteil}%` }} />
      </div>

      <ul id={`${basis}-panel`} role="tabpanel" aria-labelledby={`${basis}-${tab}`} className="mt-6 grid gap-3 md:grid-cols-2">
        {punkte.map((p, i) => {
          const key = `${tab}-${p.id}`;
          const an = Boolean(erledigt[key]);
          const id = `${basis}-${key}`;
          return (
            <li key={key}>
              <label
                htmlFor={id}
                className={cn(
                  "flex h-full cursor-pointer gap-4 rounded-2xl p-4 ring-1 transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ov-500",
                  an ? "bg-ov-50/70 ring-ov-200" : "bg-sand-50 ring-ink-200/60 hover:bg-white"
                )}
              >
                <input id={id} type="checkbox" className="peer sr-only" checked={an} onChange={(e) => setzen({ ...erledigt, [key]: e.target.checked })} />
                <span
                  aria-hidden="true"
                  className={cn(
                    "mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg ring-1 transition-colors",
                    an ? "bg-ov-500 text-white ring-ov-500" : "bg-white text-transparent ring-ink-300"
                  )}
                >
                  <Check className="h-4 w-4" strokeWidth={3} />
                </span>
                <span className="min-w-0">
                  <span className={cn("block font-display text-[15.5px] font-bold leading-snug", an ? "text-ink-500 line-through decoration-ov-400" : "text-ink-900")}>
                    <span className="ov-num mr-1.5 text-ov-600">{String(i + 1).padStart(2, "0")}</span>
                    {p.titel}
                  </span>
                  <span className="mt-1 block text-[14px] leading-relaxed text-ink-600">{p.text}</span>
                </span>
              </label>
            </li>
          );
        })}
      </ul>
      <p className="mt-5 text-[12.5px] text-ink-400">Ihr Fortschritt wird nur in diesem Browser gespeichert.</p>
    </div>
  );
}
