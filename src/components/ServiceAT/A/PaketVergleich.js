"use client";

import { useId, useState } from "react";
import { ArrowRight, Building2, Check, Factory, Home, Minus, Sparkles } from "lucide-react";
import { cn } from "@/components/ui/cn";

/**
 * Paketvergleich als edle Karten (ohne Preise) mit Umschalter „Ihre Anlage“,
 * der das passende Paket hervorhebt. Die Zuordnung folgt ausschließlich der
 * Zeile „Geeignet für“ aus der Paketstruktur.
 *
 * props:
 *  pakete   ["Basis", "Plus", "Premium"]
 *  eignung  ["…", "…", "…"]   (Zeile „Geeignet für“)
 *  zeilen   [[Leistung, wertBasis, wertPlus, wertPremium], …] – Wert: String | true | false
 *  fuss     Text unter jeder Karte (z. B. „Preis nach Anlagengröße“)
 *  href     Ziel des Karten-Buttons (#anfrage)
 */

const ANLAGEN = [
  { icon: Home, label: "Einfache Dachanlage", paket: 0 },
  { icon: Building2, label: "Gewerbe- & Hallendach", paket: 1 },
  { icon: Factory, label: "Großanlage, Freifläche, Speicher oder EZA-Regler", kurz: "Großanlage / Speicher / Regler", paket: 2 },
];

function Wert({ wert, dunkel }) {
  if (wert === true)
    return (
      <span className={cn("inline-flex h-5 w-5 items-center justify-center rounded-full", dunkel ? "bg-ov-500 text-white" : "bg-ov-100 text-ov-700")}>
        <Check aria-hidden="true" className="h-3 w-3" strokeWidth={3.5} />
        <span className="sr-only">enthalten</span>
      </span>
    );
  if (wert === false)
    return (
      <span className={cn("inline-flex h-5 w-5 items-center justify-center rounded-full", dunkel ? "bg-white/10 text-white/35" : "bg-ink-100 text-ink-400")}>
        <Minus aria-hidden="true" className="h-3 w-3" strokeWidth={3.5} />
        <span className="sr-only">nicht enthalten</span>
      </span>
    );
  return <span className={cn("block text-[13.5px] font-semibold leading-snug", dunkel ? "text-white" : "text-ink-900")}>{wert}</span>;
}

function Karte({ index, name, eignung, zeilen, empfohlen, fuss, href, onWaehlen }) {
  const dunkel = empfohlen;
  return (
    <article
      className={cn(
        "relative flex h-full flex-col overflow-hidden rounded-[2rem] p-6 transition-all duration-500 md:p-7",
        dunkel ? "bg-navy-950 text-white shadow-[0_40px_80px_-30px_rgba(3,18,43,0.7)] ring-1 ring-navy-800 lg:-translate-y-3" : "bg-white text-ink-900 ring-1 ring-ink-200/80"
      )}
    >
      {dunkel && (
        <>
          <div aria-hidden="true" className="ov-grid-bg absolute inset-0 opacity-50" />
          <div aria-hidden="true" className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-ov-500/35 blur-[70px]" />
        </>
      )}
      <div className="relative">
        <div className="flex items-center justify-between gap-3">
          <span className={cn("font-display text-[12px] font-bold uppercase tracking-[0.18em]", dunkel ? "text-ov-300" : "text-ink-400")}>Paket {String(index + 1).padStart(2, "0")}</span>
          {empfohlen && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-ov-500 px-3 py-1 text-[11.5px] font-semibold text-white">
              <Sparkles aria-hidden="true" className="h-3.5 w-3.5" />
              Passt zu Ihrer Anlage
            </span>
          )}
        </div>
        <h3 className="mt-3 font-display text-[30px] font-extrabold leading-none tracking-tight">{name}</h3>
        <p className={cn("mt-3 min-h-[44px] text-[14.5px] leading-snug", dunkel ? "text-white/70" : "text-ink-600")}>{eignung}</p>
      </div>

      <ul className={cn("relative mt-5 flex-1 divide-y border-t", dunkel ? "divide-white/10 border-white/10" : "divide-ink-100 border-ink-100")}>
        {zeilen.map(([label, ...werte]) => {
          const w = werte[index];
          return (
            <li key={label} className="flex items-start justify-between gap-4 py-2">
              <span className={cn("text-[13.5px] leading-snug", w === false ? (dunkel ? "text-white/35" : "text-ink-400") : dunkel ? "text-white/70" : "text-ink-600")}>{label}</span>
              <span className="block max-w-[48%] shrink-0 text-right leading-snug">
                <Wert wert={w} dunkel={dunkel} />
              </span>
            </li>
          );
        })}
      </ul>

      <div className="relative mt-6">
        <p className={cn("text-[13px]", dunkel ? "text-white/55" : "text-ink-500")}>{fuss}</p>
        <a
          href={href}
          onClick={onWaehlen}
          className={cn(
            "group mt-3 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full text-[15px] font-semibold transition-all",
            dunkel ? "bg-ov-600 text-white shadow-[0_8px_24px_-8px_rgba(102,153,51,0.65)] hover:bg-ov-700" : "bg-white text-ink-900 ring-1 ring-inset ring-ink-200 hover:bg-ink-50 hover:ring-ink-300"
          )}
        >
          {name} anfragen
          <ArrowRight aria-hidden="true" className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </a>
      </div>
    </article>
  );
}

export default function PaketVergleich({ pakete = [], eignung = [], zeilen = [], fuss = "Preis nach Anlagengröße – Angebot anfordern", href = "#anfrage" }) {
  const id = useId();
  const [anlage, setAnlage] = useState(1);
  const empfohlen = ANLAGEN[anlage].paket;
  const [mobil, setMobil] = useState(null);
  const sichtbar = mobil ?? empfohlen;

  return (
    <div>
      {/* Umschalter */}
      <div className="mx-auto max-w-3xl text-center">
        <p id={`${id}-l`} className="text-[13px] font-semibold uppercase tracking-[0.14em] text-ink-500">
          Ihre Anlage
        </p>
        <div role="radiogroup" aria-labelledby={`${id}-l`} className="mt-3 inline-flex w-full flex-col gap-1.5 rounded-3xl bg-white p-1.5 shadow-sm ring-1 ring-ink-200/80 sm:w-auto sm:flex-row sm:rounded-full">
          {ANLAGEN.map((a, i) => {
            const an = i === anlage;
            return (
              <button
                key={a.label}
                type="button"
                role="radio"
                aria-checked={an}
                onClick={() => {
                  setAnlage(i);
                  setMobil(null);
                }}
                className={cn(
                  "inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-4 text-[14px] font-semibold transition-all duration-300",
                  an ? "bg-navy-950 text-white shadow-lg" : "text-ink-600 hover:bg-ink-50 hover:text-ink-900"
                )}
              >
                <a.icon aria-hidden="true" className="h-4 w-4" />
                <span className="hidden md:inline">{a.kurz || a.label}</span>
                <span className="md:hidden">{a.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Mobil: ein Paket, umschaltbar */}
      <div className="mt-8 lg:hidden">
        <div className="mb-4 grid grid-cols-3 gap-1.5 rounded-full bg-ink-100 p-1" role="tablist" aria-label="Paket anzeigen">
          {pakete.map((p, i) => (
            <button
              key={p}
              type="button"
              role="tab"
              aria-selected={sichtbar === i}
              onClick={() => setMobil(i)}
              className={cn("min-h-10 rounded-full text-[14px] font-semibold transition-colors", sichtbar === i ? "bg-white text-ink-900 shadow" : "text-ink-500")}
            >
              {p}
            </button>
          ))}
        </div>
        <div key={sichtbar} className="ov-tab-panel">
          <Karte index={sichtbar} name={pakete[sichtbar]} eignung={eignung[sichtbar]} zeilen={zeilen} empfohlen={sichtbar === empfohlen} fuss={fuss} href={href} />
        </div>
      </div>

      {/* Desktop: Vergleichsmatrix mit hervorgehobener Paketspalte */}
      <div className="mt-12 hidden lg:block">
        <table className="w-full border-separate border-spacing-0 text-left">
          <caption className="sr-only">Wartungspakete Basis, Plus und Premium im Vergleich</caption>
          <thead>
            <tr>
              <th scope="col" className="w-[34%] align-bottom pb-5 pr-6 text-[12.5px] font-semibold uppercase tracking-[0.14em] text-ink-400">
                Leistung
              </th>
              {pakete.map((p, i) => {
                const an = i === empfohlen;
                return (
                  <th
                    key={p}
                    scope="col"
                    className={cn(
                      "relative w-[22%] rounded-t-[1.75rem] px-6 pb-5 pt-6 align-top font-normal transition-colors duration-500",
                      an ? "bg-navy-950 text-white" : "bg-white text-ink-900 ring-1 ring-inset ring-ink-200/0"
                    )}
                  >
                    {an && <span aria-hidden="true" className="pointer-events-none absolute -top-10 right-0 h-40 w-40 rounded-full bg-ov-500/30 blur-[60px]" />}
                    <span className="relative flex items-center justify-between gap-2">
                      <span className={cn("font-display text-[12px] font-bold uppercase tracking-[0.18em]", an ? "text-ov-300" : "text-ink-400")}>Paket {String(i + 1).padStart(2, "0")}</span>
                      {an && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-ov-500 px-2.5 py-1 text-[11px] font-semibold text-white">
                          <Sparkles aria-hidden="true" className="h-3 w-3" />
                          Passt
                        </span>
                      )}
                    </span>
                    <span className="relative mt-2 block font-display text-[28px] font-extrabold leading-none tracking-tight">{p}</span>
                    <span className={cn("relative mt-2.5 block min-h-[40px] text-[13.5px] leading-snug", an ? "text-white/70" : "text-ink-500")}>{eignung[i]}</span>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {zeilen.map(([label, ...werte], zi) => (
              <tr key={label} className="group">
                <th scope="row" className={cn("border-t border-ink-200/70 py-2.5 pr-6 text-[13.5px] font-medium leading-snug text-ink-700", zi === 0 && "border-t-ink-300")}>
                  {label}
                </th>
                {werte.map((w, i) => {
                  const an = i === empfohlen;
                  return (
                    <td
                      key={i}
                      className={cn(
                        "border-t px-6 py-2.5 align-middle transition-colors duration-500",
                        an ? "border-white/10 bg-navy-950" : "border-ink-200/70 bg-white group-hover:bg-sand-50"
                      )}
                    >
                      <Wert wert={w} dunkel={an} />
                    </td>
                  );
                })}
              </tr>
            ))}
            <tr>
              <th scope="row" className="border-t border-ink-300 py-5 pr-6 text-[14px] font-semibold text-ink-900">
                Preis
              </th>
              {pakete.map((p, i) => {
                const an = i === empfohlen;
                return (
                  <td key={p} className={cn("rounded-b-[1.75rem] border-t px-6 pb-6 pt-5", an ? "border-white/10 bg-navy-950" : "border-ink-300 bg-white")}>
                    <span className={cn("block text-[13px]", an ? "text-white/60" : "text-ink-500")}>{fuss}</span>
                    <a
                      href={href}
                      className={cn(
                        "group/b mt-3 inline-flex h-11 w-full items-center justify-center gap-2 rounded-full text-[14.5px] font-semibold transition-all",
                        an ? "bg-ov-600 text-white shadow-[0_8px_24px_-8px_rgba(102,153,51,0.65)] hover:bg-ov-700" : "bg-white text-ink-900 ring-1 ring-inset ring-ink-200 hover:bg-ink-50"
                      )}
                    >
                      {p} anfragen
                      <ArrowRight aria-hidden="true" className="h-4 w-4 transition-transform group-hover/b:translate-x-1" />
                    </a>
                  </td>
                );
              })}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
