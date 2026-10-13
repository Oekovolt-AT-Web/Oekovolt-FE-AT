"use client";

// src/components/GewerbeUnikat/K4BoerseLive.js
//
// K4 · „Börse jetzt“ – Anzeige (Client, ohne Bibliothek). Daten kommen fertig ausgewertet aus K4Boerse
// (async Server, SMARD Day-Ahead AT). Rechnet live mit dem Röntgen weiter:
//   Börse jetzt + Netz und Abgabe (aus Netzbereich/Netzebene/Abgabe im Steckbrief) = was eine selbst genutzte
//   kWh bei börsenindiziertem Bezug mindestens spart (dazu käme der Lieferantenaufschlag).
// Die Tageskurve (ab lg) zeigt den Börsenpreis neben IHREM Energiepreis (gestrichelt) – Energie neben
// Energie, nicht Börse neben dem Gesamtwert. Pille „Börsenmittel 12–14 Uhr übernehmen“ setzt den Energiepreis
// im Steckbrief; Rechnung und Röntgenbild oben folgen sofort.

import { useState } from "react";
import { Check } from "lucide-react";
import { ereignis } from "@/lib/statistik";
import { FARBE, zahl } from "./_tokens.js";
import { steckbrief, useSteckbrief } from "./_steckbrief.js";
import { ENERGIE } from "./K4Rechnung.js";

const H = 120;

/** Treppenlinie und Fläche (bis 0 ct) im viewBox 0 0 960 H. */
function kurvenPfade(b, vergleichCt) {
  const werte = b.kurve.map((p) => p.ct);
  const lo = Math.min(0, ...werte);
  const hi = Math.max(vergleichCt, ...werte) * 1.12 - lo * 0.12;
  const x = (h) => Math.round((h / 24) * 960 * 10) / 10;
  const y = (ct) => Math.round((4 + (1 - (ct - lo) / (hi - lo)) * (H - 8)) * 10) / 10;
  let linie = "";
  b.kurve.forEach((p, i) => {
    linie += `${i ? "L" : "M"}${x(p.h)},${y(p.ct)}H${x(Math.min(24, p.h + b.schrittH))}`;
  });
  const flaeche = `${linie}V${y(0)}H${x(b.kurve[0].h)}Z`;
  return { linie, flaeche, y, x, null0: y(0) };
}

function Wert({ wert, gruen = false, stellen = 1 }) {
  return (
    <dd className={`ov-num mt-1.5 whitespace-nowrap font-display text-[20px] font-extrabold leading-none tracking-[-0.02em] md:text-[26px] ${gruen ? "text-ov-700" : "text-ink-900"}`}>
      {zahl(wert, stellen)}
      <span className="ml-0.5 text-[0.55em] font-bold text-ink-500">ct</span>
    </dd>
  );
}

export default function K4BoerseLive({ b, start }) {
  const sb = useSteckbrief();
  const energie = Number.isFinite(sb.energieCt) ? sb.energieCt : start.energieCt;
  const neben = Number.isFinite(sb.vermiedenCt) && Number.isFinite(sb.energieCt) ? sb.vermiedenCt - sb.energieCt : start.nebenCt;
  const summeJetzt = b.aktuellCt + neben;
  const mittag = b.mittagCt != null ? Math.round(b.mittagCt * 10) / 10 : null;
  const uebernehmbar = mittag != null && mittag >= ENERGIE.min && mittag <= ENERGIE.max;
  const uebernommen = uebernehmbar && Math.abs(energie - mittag) < 0.05;
  const [ansage, setAnsage] = useState("");

  const uebernehmen = () => {
    steckbrief.setze({ energieCt: mittag, vermiedenCt: Math.round((mittag + neben) * 1000) / 1000 }, "k4");
    setAnsage(`Energiepreis ${zahl(mittag, 1)} Cent übernommen. Rechnung und Röntgenbild oben rechnen jetzt damit.`);
    ereignis("k4_boerse_uebernommen", { ct: mittag });
  };

  const k = kurvenPfade(b, energie);
  const yVergleich = k.y(energie);
  const punkt = { x: k.x(b.jetztH), y: k.y(b.aktuellCt) };
  const prozentY = (yv) => `${(yv / H) * 100}%`;

  return (
    <aside aria-labelledby="k4-boerse-titel" data-testid="k4-boerse" className="mt-5 rounded-[22px] bg-ink-50 p-4 md:mt-12 md:p-7 lg:mt-16">
      <div className="grid gap-4 md:gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-center lg:gap-12">
        <div className="min-w-0">
          <p id="k4-boerse-titel" className="flex items-center gap-2 text-[12.5px] font-semibold uppercase tracking-[0.16em] text-ov-700">
            <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-ov-500" />
            Börse jetzt<span className="hidden sm:inline"> · Day-Ahead Österreich</span>
          </p>
          <dl className="mt-2.5 grid grid-cols-3 gap-3 md:mt-4 md:gap-6">
            <div className="min-w-0">
              <dt className="text-[11.5px] leading-tight text-ink-500 md:text-[12.5px]">
                <span className="hidden md:inline">{b.einheit} </span>
                <span className="ov-num whitespace-nowrap">
                  {b.von}–{b.bis}
                </span>
              </dt>
              <Wert wert={b.aktuellCt} />
            </div>
            <div className="min-w-0">
              <dt className="text-[11.5px] leading-tight text-ink-500 md:text-[12.5px]">
                + Netz<span className="hidden md:inline"> und Abgabe</span>
                <span className="md:hidden">, Abgabe</span>
              </dt>
              <Wert wert={neben} stellen={2} />
            </div>
            <div className="min-w-0">
              <dt className="text-[11.5px] leading-tight text-ink-500 md:text-[12.5px]">
                = <span className="md:hidden">Ersparnis</span>
                <span className="hidden md:inline">selbst genutzt je kWh</span>*
              </dt>
              <Wert wert={summeJetzt} gruen />
            </div>
          </dl>
        </div>

        <figure className="m-0 hidden min-w-0 lg:block">
          <div className="relative h-[104px]">
            <svg viewBox={`0 0 960 ${H}`} preserveAspectRatio="none" className="absolute inset-0 h-full w-full" aria-hidden="true">
              <rect x={k.x(12)} y="0" width={k.x(14) - k.x(12)} height={H} fill="rgba(21,26,36,0.05)" />
              <line x1="0" x2="960" y1={k.null0} y2={k.null0} stroke="rgba(21,26,36,0.25)" strokeWidth="1" vectorEffect="non-scaling-stroke" />
              <path d={k.flaeche} fill={FARBE.navy200} fillOpacity="0.55" />
              <path d={k.linie} fill="none" stroke={FARBE.navy700} strokeWidth="1.25" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
              <line x1="0" x2="960" y1={yVergleich} y2={yVergleich} stroke={FARBE.ov600} strokeWidth="1.75" strokeDasharray="5 4" vectorEffect="non-scaling-stroke" />
              <line x1={punkt.x} x2={punkt.x} y1="0" y2={H} stroke={FARBE.ink900} strokeWidth="1" vectorEffect="non-scaling-stroke" />
            </svg>
            <span
              aria-hidden="true"
              className="absolute h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-ink-900 ring-2 ring-white"
              style={{ left: `${(punkt.x / 960) * 100}%`, top: prozentY(punkt.y) }}
            />
            <span
              aria-hidden="true"
              className="ov-num absolute right-0 -translate-y-[calc(100%+3px)] rounded bg-ink-50/90 px-1 text-[11px] font-semibold leading-none text-ov-700"
              style={{ top: prozentY(yVergleich) }}
            >
              Ihr Energiepreis {zahl(energie, 1)} ct
            </span>
            {mittag != null && (
              <span
                aria-hidden="true"
                className="ov-num absolute top-0 -translate-x-1/2 whitespace-nowrap text-[10.5px] font-semibold leading-none text-ink-600"
                style={{ left: `${(13 / 24) * 100}%` }}
              >
                Ø {zahl(mittag, 1)} ct
              </span>
            )}
          </div>
          <div aria-hidden="true" className="ov-num relative mt-1.5 h-3.5 text-[10.5px] leading-none text-ink-500">
            {[0, 6, 12, 18, 24].map((h) => (
              <span
                key={h}
                className={h === 0 ? "absolute left-0" : h === 24 ? "absolute right-0" : "absolute -translate-x-1/2"}
                style={h === 0 || h === 24 ? undefined : { left: `${(h / 24) * 100}%` }}
              >
                {h} Uhr
              </span>
            ))}
          </div>
          <figcaption className="sr-only">
            Day-Ahead-Preis Österreich heute als Treppenlinie, Fenster 12 bis 14 Uhr hinterlegt
            {mittag != null ? ` (Mittel ${zahl(mittag, 1)} Cent)` : ""}, gestrichelt Ihr Energiepreis mit {zahl(energie, 1)} Cent.
          </figcaption>
        </figure>
      </div>

      {uebernehmbar && (
        <div className="mt-3.5 flex flex-wrap items-center gap-2 md:mt-5">
          {uebernommen ? (
            <>
              <span className="inline-flex min-h-11 items-center gap-2 rounded-full bg-ov-100 px-4 text-[13.5px] font-semibold text-ov-800">
                <Check aria-hidden="true" className="h-4 w-4 shrink-0" strokeWidth={2.5} />
                <span>
                  <span className="ov-num">{zahl(mittag, 1)} ct</span> übernommen
                </span>
              </span>
              <a
                href="#kwh-wert"
                className="inline-flex min-h-11 items-center rounded-full bg-white px-4 text-[13.5px] font-semibold text-ink-900 transition-colors hover:bg-ink-100"
              >
                Zur Rechnung ↑
              </a>
            </>
          ) : (
            <button
              type="button"
              data-testid="k4-boerse-uebernehmen"
              onClick={uebernehmen}
              className="inline-flex min-h-11 items-center rounded-full bg-white px-4 text-left text-[13.5px] font-semibold text-ink-900 transition-colors hover:bg-ink-100"
            >
              <span>
                Börse<span className="hidden sm:inline">nmittel</span> 12–14 Uhr (<span className="ov-num">{zahl(mittag, 1)} ct</span>)<span className="hidden sm:inline"> als Energiepreis</span> übernehmen
              </span>
            </button>
          )}
        </div>
      )}
      <p aria-live="polite" className="sr-only">
        {ansage}
      </p>

      <p className="mt-3 max-w-[78ch] text-[12px] leading-snug text-ink-500 md:mt-4 md:text-[12.5px]">
        <span className="sm:hidden">* Bei Börsenbezug, plus Aufschlag; bei Festpreis zählt Ihr Vertrag. Netto, keine Preiszusage. </span>
        <span className="hidden sm:inline">
          * Bei börsenindiziertem Bezug spart jede selbst genutzte kWh den Börsenpreis samt Lieferantenaufschlag, dazu Netz und Abgabe – bei
          Festpreis zählt Ihr Vertragspreis. Großhandelspreis netto, keine Preiszusage.{" "}
        </span>
        Stand <span className="ov-num">{b.stand}</span>
        <span className="hidden sm:inline"> Uhr (Wien)</span>
        <span className="sm:hidden"> · </span>
        <span className="hidden sm:inline">. Daten: </span>
        {b.quelle},{" "}
        <a href={b.lizenz} target="_blank" rel="noopener noreferrer license" className="underline decoration-ink-300 underline-offset-2 hover:text-ink-900">
          CC BY 4.0
        </a>
        .
      </p>
    </aside>
  );
}
