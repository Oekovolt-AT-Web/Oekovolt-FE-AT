"use client";

import { useId, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BatteryCharging, Check, Gauge, PlugZap, ShieldCheck } from "lucide-react";

/**
 * Die vier Bausteine einer Smarthome-Lösung als hochwertige Tabs.
 * items: [{ key, tab, titel, text, bild, alt, href, linkLabel, icon }]
 * Mobil: Tab-Leiste 2 × 2, Inhalt darunter. Desktop: Tabs links, Inhalt rechts.
 */

const ICONS = { speicher: BatteryCharging, wallbox: PlugZap, notstrom: ShieldCheck, smartmeter: Gauge };

// Texte mit „;"-Aufzählung (z. B. Wallbox) als Liste darstellen, sonst Absätze
function Inhalt({ text }) {
  const bloecke = String(text || "")
    .split(/\n{1,}/)
    .map((t) => t.trim())
    .filter(Boolean);
  return (
    <div className="space-y-4">
      {bloecke.map((b, i) => {
        const teile = b.split(";").map((t) => t.trim()).filter(Boolean);
        if (teile.length >= 3) {
          return (
            <ul key={i} className="space-y-3">
              {teile.map((t) => {
                const [kopf, ...rest] = t.split(" – ");
                return (
                  <li key={t} className="flex gap-3">
                    <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-ov-100 text-ov-700">
                      <Check aria-hidden="true" className="h-3.5 w-3.5" strokeWidth={3} />
                    </span>
                    <span className="text-[15.5px] leading-relaxed text-ink-700">
                      {rest.length ? (
                        <>
                          <strong className="text-ink-900">{kopf}</strong> – {rest.join(" – ")}
                        </>
                      ) : (
                        t
                      )}
                    </span>
                  </li>
                );
              })}
            </ul>
          );
        }
        return (
          <p key={i} className={i === 0 && bloecke.length > 1 && b.length < 90 ? "font-display text-[18px] font-bold text-ink-900" : "text-[16px] leading-relaxed text-ink-600"}>
            {b}
          </p>
        );
      })}
    </div>
  );
}

export default function BausteineTabs({ items = [] }) {
  const [aktiv, setAktiv] = useState(0);
  const basisId = useId();
  if (!items.length) return null;
  const it = items[aktiv];
  const Icon = ICONS[it.key] || BatteryCharging;

  const tastatur = (e) => {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft" && e.key !== "ArrowDown" && e.key !== "ArrowUp") return;
    e.preventDefault();
    const n = (aktiv + (e.key === "ArrowRight" || e.key === "ArrowDown" ? 1 : -1) + items.length) % items.length;
    setAktiv(n);
    document.getElementById(`${basisId}-tab-${n}`)?.focus();
  };

  return (
    <div className="grid gap-5 lg:grid-cols-[300px_1fr] lg:gap-8">
      <div role="tablist" aria-label="Bausteine" aria-orientation="vertical" onKeyDown={tastatur} className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-1 lg:content-start lg:gap-3">
        {items.map((x, i) => {
          const TabIcon = ICONS[x.key] || BatteryCharging;
          const an = i === aktiv;
          return (
            <button
              key={x.key}
              id={`${basisId}-tab-${i}`}
              type="button"
              role="tab"
              aria-selected={an}
              aria-controls={`${basisId}-panel`}
              tabIndex={an ? 0 : -1}
              onClick={() => setAktiv(i)}
              className={`group flex min-h-[56px] items-center gap-3 rounded-2xl p-3 text-left transition-all duration-300 lg:p-4 ${
                an ? "bg-navy-950 text-white shadow-xl" : "bg-white text-ink-800 ring-1 ring-ink-200/70 hover:ring-ov-300"
              }`}
            >
              <span
                className={`hidden h-10 w-10 shrink-0 items-center sm:flex justify-center rounded-xl transition-colors lg:h-12 lg:w-12 ${
                  an ? "bg-ov-500 text-white" : "bg-ov-50 text-ov-600 group-hover:bg-ov-100"
                }`}
              >
                <TabIcon aria-hidden="true" className="h-5 w-5 lg:h-6 lg:w-6" strokeWidth={1.8} />
              </span>
              <span className="min-w-0">
                <span className="block font-display text-[15px] font-bold leading-tight lg:text-[17px]">{x.tab}</span>
                <span className={`mt-0.5 hidden text-[13px] leading-snug lg:block ${an ? "text-white/60" : "text-ink-500"}`}>{x.kurz}</span>
              </span>
            </button>
          );
        })}
      </div>

      <div
        id={`${basisId}-panel`}
        role="tabpanel"
        aria-labelledby={`${basisId}-tab-${aktiv}`}
        key={it.key}
        className="ov-tab-panel overflow-hidden rounded-[2rem] bg-white shadow-xl ring-1 ring-ink-200/70"
      >
        <div className="grid md:grid-cols-[1fr_1.05fr]">
          <div className="relative aspect-[16/10] bg-ink-100 md:aspect-auto md:min-h-[460px]">
            <Image src={it.bild} alt={it.alt || it.titel} fill sizes="(max-width: 768px) 100vw, 40vw" className="object-cover" />
            <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-navy-950/50 via-transparent to-transparent" />
            <span className="absolute bottom-4 left-4 inline-flex items-center gap-2 rounded-full bg-white/95 px-3.5 py-2 text-[13px] font-semibold text-ink-800 shadow-md">
              <Icon aria-hidden="true" className="h-4 w-4 text-ov-600" />
              Baustein {aktiv + 1} von {items.length}
            </span>
          </div>
          <div className="flex flex-col p-6 md:p-8 lg:p-10">
            <h3 className="ov-h3 text-ink-900">{it.titel}</h3>
            <div className="mt-5">
              <Inhalt text={it.text} />
            </div>
            <div className="mt-auto flex flex-wrap items-center gap-x-6 gap-y-3 pt-8">
              <Link
                href={it.href}
                className="group inline-flex h-12 items-center gap-2 rounded-full bg-navy-700 px-6 text-[15px] font-semibold text-white shadow-[0_8px_24px_-10px_rgba(0,52,115,0.6)] transition-colors hover:bg-navy-800"
              >
                {it.linkLabel}
                <ArrowRight aria-hidden="true" className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link href="/angebot" className="text-[15px] font-semibold text-ov-700 underline decoration-ov-300 underline-offset-4 hover:decoration-current">
                Angebot anfragen
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
