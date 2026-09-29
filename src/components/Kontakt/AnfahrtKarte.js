"use client";

// src/components/Kontakt/AnfahrtKarte.js
//
// Anfahrt-Visual für /kontakt: schematische Regionalkarte (Salzach/Inn als
// Grenzflüsse, A1, Salzburg, Braunau, Lokalbahn) mit umschaltbaren Routen –
// ohne externe Dienste. Die Google-Karte (Einwilligung nötig) liegt im
// letzten Reiter. Koordinaten gerundet, Darstellung nicht maßstabsgetreu.
// km: { salzburg, braunau } – Luftlinie aus @/lib/regionen (Server).

import { useState } from "react";
import { Car, Map as MapIcon, Navigation, TrainFront } from "lucide-react";
import Map from "./map";
import { FIRMA } from "@/lib/site";

const ROUTEN = [
  {
    id: "salzburg",
    icon: Car,
    label: "Aus Salzburg",
    titel: "Mit dem Auto aus Salzburg",
    text: "A1 Westautobahn bis Salzburg-Nord, weiter über die B156 Lamprechtshausener Straße Richtung Lamprechtshausen und über die L205/L501 nach Ostermiething.",
    d: "M450 644 L412 546 L384 448 L372 381 L264 346",
    art: "strasse",
  },
  {
    id: "braunau",
    icon: Car,
    label: "Aus Braunau",
    titel: "Mit dem Auto aus Braunau",
    text: "Aus Braunau am Inn über die L501 Weilhart Landesstraße entlang der Salzach nach Ostermiething.",
    d: "M445 45 L365 126 L319 224 L281 294 L264 346",
    art: "strasse",
  },
  {
    id: "bahn",
    icon: TrainFront,
    label: "Mit der Bahn",
    titel: "Mit der Salzburger Lokalbahn",
    text: "Salzburger Lokalbahn (S-Bahn Salzburg) bis Bürmoos, dort weiter mit der S11 bis zur Endstation Ostermiething.",
    d: "M455 688 L357 484 L336 432 L264 346",
    art: "bahn",
  },
];

const ORTE = [
  { n: "Salzburg", x: 455, y: 688, gross: true, dx: 12, dy: 5 },
  { n: "Braunau am Inn", x: 445, y: 45, gross: true, dx: 12, dy: 5 },
  { n: "Bürmoos", x: 336, y: 432, dx: 10, dy: 14 },
  { n: "Lamprechtshausen", x: 372, y: 381, dx: 10, dy: 4 },
  { n: "Oberndorf", x: 357, y: 484, dx: 10, dy: 12 },
  { n: "Burghausen (D)", x: 254, y: 170, dx: -10, dy: 4, links: true, de: true },
  { n: "Tittmoning (D)", x: 195, y: 318, dx: -10, dy: 4, links: true, de: true },
  { n: "Freilassing (D)", x: 391, y: 633, dx: -10, dy: 4, links: true, de: true },
];

const SALZACH = "M456 686 L412 644 L389 588 L356 497 L323 441 L281 399 L225 364 L201 322 L225 252 L258 175 L281 112 L309 77";
const INN = "M40 128 L178 98 L309 77 L375 56 L445 39 L600 14";
const A1 = "M347 714 L412 665 L459 644 L600 602";

export default function AnfahrtKarte({ km = {} }) {
  const [aktiv, setAktiv] = useState("salzburg");
  const route = ROUTEN.find((r) => r.id === aktiv);

  return (
    <div className="overflow-hidden rounded-[2rem] bg-white shadow-xl ring-1 ring-ink-200/70">
      <div role="tablist" aria-label="Anfahrt" className="ov-no-scrollbar flex gap-1.5 overflow-x-auto border-b border-ink-100 bg-sand-50 p-2">
        {[...ROUTEN, { id: "google", icon: MapIcon, label: "Google Maps" }].map((r) => (
          <button
            key={r.id}
            type="button"
            role="tab"
            aria-selected={aktiv === r.id}
            onClick={() => setAktiv(r.id)}
            className={`inline-flex h-10 shrink-0 items-center gap-2 rounded-full px-4 text-[13.5px] font-semibold transition ${
              aktiv === r.id ? "bg-navy-950 text-white shadow" : "text-ink-600 hover:bg-white hover:text-ink-900"
            }`}
          >
            <r.icon aria-hidden="true" className="h-4 w-4" />
            {r.label}
          </button>
        ))}
      </div>

      {aktiv === "google" ? (
        <div className="ov-tab-panel">
          <Map />
        </div>
      ) : (
        <div className="grid sm:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
          <div className="relative bg-[linear-gradient(180deg,var(--color-sand-50),#fff)]">
            <svg viewBox="0 0 600 730" className="mx-auto h-full max-h-[600px] w-full" role="img" aria-label={`Schematische Karte: ${route.titel} nach ${FIRMA.ort}`}>
              <defs>
                <pattern id="ak-raster" width="30" height="30" patternUnits="userSpaceOnUse">
                  <path d="M30 0H0V30" fill="none" className="stroke-ink-200/60" strokeWidth="1" />
                </pattern>
              </defs>
              <rect width="600" height="730" fill="url(#ak-raster)" />
              {/* Bayern-Seite leicht getönt */}
              <path d={`${SALZACH} L309 77 L178 98 L40 128 L0 128 L0 730 L347 730 Z`} className="fill-ink-100/60" />
              <path d={`${INN} L600 0 L0 0 L0 128 Z`} className="fill-ink-100/60" />
              <text x="80" y="520" className="fill-ink-400 text-[15px] font-semibold uppercase tracking-[0.2em]">Bayern</text>
              <text x="420" y="250" className="fill-ink-400 text-[15px] font-semibold uppercase tracking-[0.2em]">Innviertel</text>

              {/* Flüsse */}
              <path d={SALZACH} fill="none" className="stroke-navy-300" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
              <path d={INN} fill="none" className="stroke-navy-300" strokeWidth="9" strokeLinecap="round" strokeLinejoin="round" />
              <text x="150" y="420" className="fill-navy-400 text-[12px] font-semibold italic" transform="rotate(-62 150 420)">Salzach</text>
              <text x="110" y="92" className="fill-navy-400 text-[12px] font-semibold italic">Inn</text>

              {/* A1 */}
              <path d={A1} fill="none" className="stroke-ink-300" strokeWidth="6" strokeLinecap="round" />
              <g transform="translate(520 622)">
                <rect x="-16" y="-11" width="32" height="22" rx="5" className="fill-navy-700" />
                <text x="0" y="5" textAnchor="middle" className="fill-white text-[12px] font-bold">A1</text>
              </g>

              {/* inaktive Routen */}
              {ROUTEN.filter((r) => r.id !== aktiv).map((r) => (
                <path key={r.id} d={r.d} fill="none" className="stroke-ink-300" strokeWidth="3" strokeDasharray={r.art === "bahn" ? "2 7" : "8 7"} strokeLinecap="round" strokeLinejoin="round" />
              ))}

              {/* aktive Route */}
              <path
                key={aktiv}
                d={route.d}
                fill="none"
                pathLength={1}
                className={`ov-ak-route ${route.art === "bahn" ? "stroke-navy-600" : "stroke-ov-500"}`}
                strokeWidth="6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Orte */}
              {ORTE.map((o) => (
                <g key={o.n}>
                  <circle cx={o.x} cy={o.y} r={o.gross ? 7 : 4.5} className={o.de ? "fill-ink-400" : "fill-navy-800"} />
                  <text
                    x={o.x + o.dx}
                    y={o.y + o.dy}
                    textAnchor={o.links ? "end" : "start"}
                    paintOrder="stroke"
                    strokeWidth={4}
                    className={`stroke-white ${o.gross ? "fill-ink-900 text-[17px] font-bold" : o.de ? "fill-ink-500 text-[13px]" : "fill-ink-700 text-[13.5px] font-semibold"}`}
                  >
                    {o.n}
                  </text>
                </g>
              ))}

              {/* Firmensitz */}
              <circle cx="264" cy="346" r="22" className="fill-ov-500/25 motion-safe:animate-ping" style={{ transformBox: "fill-box", transformOrigin: "center" }} />
              <circle cx="264" cy="346" r="13" className="fill-ov-500 stroke-white" strokeWidth="4" />
              <g transform="translate(264 346)">
                <rect x="-92" y="-66" width="184" height="40" rx="12" className="fill-navy-950" />
                <text x="0" y="-41" textAnchor="middle" className="fill-white text-[15px] font-bold">Ökovolt · {FIRMA.ort}</text>
                <path d="M-7 -26 L0 -18 L7 -26 Z" className="fill-navy-950" />
              </g>
            </svg>
            <p className="absolute bottom-3 left-4 text-[11.5px] text-ink-400">Schematisch, nicht maßstabsgetreu</p>
          </div>

          <div className="flex flex-col border-t border-ink-100 p-6 sm:border-l sm:border-t-0 md:p-8">
            {ROUTEN.map((r) => (
              <div key={r.id} hidden={r.id !== aktiv} className={r.id === aktiv ? "ov-tab-panel" : undefined}>
                <span className={`flex h-11 w-11 items-center justify-center rounded-2xl ${r.art === "bahn" ? "bg-navy-50 text-navy-600" : "bg-ov-50 text-ov-700"}`}>
                  <r.icon aria-hidden="true" className="h-5 w-5" />
                </span>
                <h3 className="mt-4 font-display text-[20px] font-bold leading-snug text-ink-900">{r.titel}</h3>
                <p className="mt-2 text-[15.5px] leading-relaxed text-ink-600">{r.text}</p>
              </div>
            ))}
            <dl className="mt-6 grid grid-cols-2 gap-3">
              {km.salzburg ? (
                <div className="rounded-2xl bg-sand-50 p-3.5 ring-1 ring-ink-200/60">
                  <dt className="text-[12px] text-ink-500">Stadt Salzburg</dt>
                  <dd className="ov-num mt-0.5 font-display text-[20px] font-extrabold text-ink-900">{km.salzburg} km</dd>
                </div>
              ) : null}
              {km.braunau ? (
                <div className="rounded-2xl bg-sand-50 p-3.5 ring-1 ring-ink-200/60">
                  <dt className="text-[12px] text-ink-500">Braunau am Inn</dt>
                  <dd className="ov-num mt-0.5 font-display text-[20px] font-extrabold text-ink-900">{km.braunau} km</dd>
                </div>
              ) : null}
            </dl>
            <p className="mt-2 text-[12px] text-ink-400">Luftlinie ab Firmensitz</p>
            <a
              href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(`${FIRMA.strasse}, ${FIRMA.plz} ${FIRMA.ort}, ${FIRMA.land}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-auto inline-flex h-12 items-center justify-center gap-2 rounded-full bg-navy-700 px-6 pt-0 text-[15px] font-semibold text-white hover:bg-navy-800 sm:mt-8"
            >
              <Navigation aria-hidden="true" className="h-4 w-4" />
              Route planen
            </a>
          </div>
        </div>
      )}

      <style>{`
        @media (prefers-reduced-motion: no-preference) {
          .ov-ak-route { stroke-dasharray: 1; stroke-dashoffset: 1; animation: ov-ak-zeichnen 1400ms cubic-bezier(0.22,1,0.36,1) forwards; }
        }
        @keyframes ov-ak-zeichnen { to { stroke-dashoffset: 0; } }
      `}</style>
    </div>
  );
}
