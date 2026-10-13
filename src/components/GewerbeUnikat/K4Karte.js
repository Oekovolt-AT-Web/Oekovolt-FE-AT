"use client";

// src/components/GewerbeUnikat/K4Karte.js
//
// K4 · Netzbereichs-Karte (nur Client, wird mit der Bühne nachgeladen): neun Bundesländer als Inline-SVG,
// eingefärbt nach Netz-ct (Arbeitspreis + Netzverlust) der gewählten Netzebene (ov-100 → ov-600), die
// Stadtnetze Linz, Graz, Klagenfurt und Innsbruck als Punkte. Der gewählte Bereich steht in navy-700.
// Nur für Zeiger (aria-hidden) – der gleichwertige Tastatur-Weg ist das select im Pult.
//
// Trefferflächen: Die Landesflächen haben Vorrang. Die Stadtpunkte nehmen nur mit feinem Zeiger (Maus) einen
// Klick an – mit 20 px Fläche, damit ein Klick in die Mitte Tirols Tirol wählt und nicht Innsbruck. Auf
// Touch sind die Punkte reine Markierung; die Stadtnetze wählt man dort über die Pillen unter der Karte
// (44/48 px, K4StadtPillen in K4Pult.js).

import { memo, useState } from "react";
import { BUNDESLAND_PFADE, projiziereAT } from "@/components/Region/oesterreichKarte";
import { cn } from "@/components/ui/cn";
import { FARBE, zahl } from "./_tokens.js";
import { netzFarbe, netzSkala } from "./K4Pult.js";

/** Kartenschlüssel (oesterreichKarte) → Netzbereich (NETZBEREICHE). */
const LAND_ZU_BEREICH = {
  vorarlberg: "vorarlberg",
  tirol: "tirol",
  salzburg: "salzburg",
  oberoesterreich: "ooe",
  niederoesterreich: "noe",
  wien: "wien",
  burgenland: "burgenland",
  steiermark: "steiermark",
  kaernten: "kaernten",
};
const BEREICH_ZU_LAND = Object.fromEntries(Object.entries(LAND_ZU_BEREICH).map(([l, b]) => [b, l]));

/** Beschriftungs-Anker je Land (Breite, Länge) – optische Mitte, abseits der Stadtnetz-Punkte. */
const ANKER_LAND = {
  vorarlberg: [47.5, 9.84],
  tirol: [47.06, 10.62],
  salzburg: [47.36, 13.1],
  oberoesterreich: [47.98, 13.98],
  niederoesterreich: [48.36, 15.5],
  wien: [48.21, 16.37],
  burgenland: [47.42, 16.42],
  steiermark: [47.32, 14.72],
  kaernten: [46.76, 13.58],
};
/** Kleine oder schmale Länder: Etikett ÜBER dem Anker, damit die gewählte Fläche sichtbar bleibt. */
const DARUEBER = new Set(["vorarlberg", "wien"]);
const ANKER = Object.fromEntries(Object.entries(ANKER_LAND).map(([land, [lat, lon]]) => [LAND_ZU_BEREICH[land], projiziereAT(lat, lon)]));

const lage = (p) => ({ left: `${p.x / 10}%`, top: `${(p.y / 535) * 100}%` });

/** Etiketten am Rand nicht über die Karte hinausschieben (kein horizontales Scrollen). */
function ausrichtung(x) {
  if (x < 150) return "translate-x-[-12px]";
  if (x > 850) return "-translate-x-[calc(100%-12px)]";
  return "-translate-x-1/2";
}

function K4Karte({ netz, ne, bereich, onWahl, staedte }) {
  const [schwebe, setSchwebe] = useState(null);
  const skala = netzSkala(netz, ne);
  const ct = Object.fromEntries(skala.werte.map((w) => [w.id, w.ct]));
  const eintrag = (id) => netz.find((b) => b.id === id);
  const stadtAnker = Object.fromEntries(staedte.map((s) => [s.id, { x: s.x, y: s.y }]));
  const anker = (id) => stadtAnker[id] || ANKER[id];
  const istStadt = (id) => id in stadtAnker;
  const zeigen = (id) => (e) => {
    if (e.pointerType === "mouse") setSchwebe(id);
  };

  const gewaehlt = eintrag(bereich);
  const gAnker = anker(bereich);
  const s = schwebe && schwebe !== bereich ? eintrag(schwebe) : null;
  const sAnker = s ? anker(s.id) : null;

  return (
    <div aria-hidden="true" className="absolute inset-0 touch-pan-y select-none" onPointerLeave={() => setSchwebe(null)}>
      <svg viewBox="0 0 1000 535" className="absolute inset-0 h-full w-full overflow-visible">
        {Object.entries(BUNDESLAND_PFADE).map(([land, d]) => {
          const id = LAND_ZU_BEREICH[land];
          const aktiv = id === bereich;
          return (
            <path
              key={land}
              d={d}
              fill={aktiv ? FARBE.navy700 : netzFarbe(skala.t(ct[id]))}
              stroke="#ffffff"
              strokeWidth={1.25}
              strokeLinejoin="round"
              vectorEffect="non-scaling-stroke"
              className="cursor-pointer"
              style={{ transition: "fill 320ms cubic-bezier(0.16, 1, 0.3, 1)" }}
              onClick={() => onWahl(id)}
              onPointerEnter={zeigen(id)}
            />
          );
        })}
        {s && !istStadt(s.id) && (
          <path
            d={BUNDESLAND_PFADE[BEREICH_ZU_LAND[s.id]]}
            fill="none"
            stroke={FARBE.navy900}
            strokeWidth={1.75}
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
            pointerEvents="none"
          />
        )}
      </svg>

      {/* Stadtnetze: Punkt (sichtbar 12–16 px), 20 px Trefferfläche nur für die Maus – Touch wählt über die Pillen */}
      {staedte.map((st) => {
        const aktiv = st.id === bereich;
        return (
          <div
            key={st.id}
            className="absolute flex h-5 w-5 -translate-x-1/2 -translate-y-1/2 cursor-pointer items-center justify-center [@media(pointer:coarse)]:pointer-events-none"
            style={lage(st)}
            onClick={() => onWahl(st.id)}
            onPointerEnter={zeigen(st.id)}
          >
            <span
              className={cn("block rounded-full transition-[width,height,background-color] duration-300", aktiv ? "h-4 w-4" : "h-3 w-3")}
              style={{
                background: aktiv ? FARBE.navy700 : netzFarbe(skala.t(ct[st.id])),
                boxShadow: aktiv ? "0 0 0 2.5px #fff, 0 2px 8px rgba(3,18,43,0.35)" : "0 0 0 2px #fff, 0 0 0 3px rgba(3,18,43,0.32)",
              }}
            />
          </div>
        );
      })}

      {/* Gewählter Bereich: weißes Etikett auf navy-700 */}
      {gewaehlt && gAnker && (
        <div
          className={cn(
            "pointer-events-none absolute z-10 whitespace-nowrap rounded-full bg-navy-700 px-2.5 py-1 text-[12px] font-semibold leading-none text-white shadow-[0_4px_14px_-4px_rgba(3,18,43,0.5)] md:text-[12.5px]",
            istStadt(bereich) || DARUEBER.has(bereich) ? "-translate-y-[calc(100%+12px)]" : "-translate-y-1/2",
            ausrichtung(gAnker.x)
          )}
          style={lage(gAnker)}
        >
          {gewaehlt.label} <span className="ov-num font-bold">{zahl(ct[bereich], 2)} ct</span>
        </div>
      )}

      {/* Zeiger-Hinweis (nur Maus) */}
      {s && sAnker && (
        <div
          className={cn(
            "pointer-events-none absolute z-20 w-max max-w-[220px] -translate-y-[calc(100%+14px)] rounded-xl bg-white px-3 py-2 text-left shadow-[0_8px_24px_-8px_rgba(21,26,36,0.35)]",
            ausrichtung(sAnker.x)
          )}
          style={lage(sAnker)}
        >
          <span className="block text-[13px] font-semibold leading-tight text-ink-900">{s.label}</span>
          <span className="mt-0.5 block text-[12px] leading-tight text-ink-500">{s.betreiber}</span>
          <span className="ov-num mt-1 block text-[12.5px] font-semibold leading-tight text-ov-700">
            NE {ne}: {zahl(ct[s.id], 2)} ct je kWh
          </span>
        </div>
      )}
    </div>
  );
}

export default memo(K4Karte);
