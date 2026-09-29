"use client";

// src/components/Team/EinzugsKarte.js
//
// Interaktive Österreich-Karte „Einzugsgebiet“. Daten kommen fertig
// aufbereitet aus ./Einzugsgebiet.js (Server).
//
// modus "info":    Bundesland wählen → Netzbetreiber, Regionsseiten mit
//                  Luftlinie ab Ostermiething, Landesförderung.
// modus "auswahl": Bundesländer an-/abwählen (Partner-Einsatzgebiet). Die
//                  Auswahl wird als CustomEvent „ov-einsatzgebiet“ (detail:
//                  Array der Namen) gesendet – das Registrierungsformular
//                  übernimmt sie.

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, Check, MapPin, Navigation, PlugZap } from "lucide-react";

const fmtKm = (km) => `${Math.round(km).toLocaleString("de-DE")} km`;

export default function EinzugsKarte({ laender, sitz, viewBox, quelle, modus = "info", start = "oberoesterreich", dunkel = false, className = "" }) {
  const auswahlModus = modus === "auswahl";
  const [aktiv, setAktiv] = useState(start);
  const [hover, setHover] = useState(null);
  const [auswahl, setAuswahl] = useState([]);

  const land = useMemo(() => laender.find((l) => l.key === aktiv) || laender[0], [laender, aktiv]);
  const alleOrte = useMemo(() => laender.flatMap((l) => l.orte.map((o) => ({ ...o, land: l.key }))), [laender]);

  const melde = (keys) => window.dispatchEvent(new CustomEvent("ov-einsatzgebiet", { detail: laender.filter((l) => keys.includes(l.key)).map((l) => l.name) }));

  const waehle = (key) => {
    if (!auswahlModus) {
      setAktiv(key);
      return;
    }
    const neu = auswahl.includes(key) ? auswahl.filter((k) => k !== key) : [...auswahl, key];
    setAuswahl(neu);
    melde(neu);
  };

  const alleWaehlen = () => {
    const neu = auswahl.length === laender.length ? [] : laender.map((l) => l.key);
    setAuswahl(neu);
    melde(neu);
  };

  const istAn = (key) => (auswahlModus ? auswahl.includes(key) : aktiv === key);

  const fuellung = (key) => {
    if (istAn(key)) return dunkel ? "fill-ov-500" : "fill-ov-500";
    if (hover === key) return dunkel ? "fill-white/25" : "fill-ov-200";
    return dunkel ? "fill-white/[0.09]" : "fill-ink-100";
  };

  const bogen = (o) => {
    const mx = (sitz.x + o.x) / 2;
    const my = (sitz.y + o.y) / 2 - Math.min(40, Math.hypot(o.x - sitz.x, o.y - sitz.y) * 0.25);
    return `M${sitz.x} ${sitz.y} Q${mx.toFixed(1)} ${my.toFixed(1)} ${o.x} ${o.y}`;
  };

  const txt = dunkel ? "text-white" : "text-ink-900";
  const txt2 = dunkel ? "text-white/65" : "text-ink-600";

  return (
    <div className={`grid gap-8 lg:grid-cols-[minmax(0,1.45fr)_minmax(0,1fr)] lg:items-center lg:gap-12 ${className}`}>
      {/* Karte */}
      <div className="relative">
        <svg viewBox={viewBox} className="h-auto w-full" role="group" aria-label={auswahlModus ? "Bundesländer für Ihr Einsatzgebiet wählen" : "Karte der neun Bundesländer – Bundesland wählen"}>
          <defs>
            <filter id="ek-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="6" stdDeviation="8" floodColor="#669933" floodOpacity="0.35" />
            </filter>
          </defs>
          {laender.map((l) => (
            <path
              key={l.key}
              d={l.d}
              fillRule="evenodd"
              strokeLinejoin="round"
              role="button"
              tabIndex={0}
              aria-pressed={istAn(l.key)}
              aria-label={l.name}
              onClick={() => waehle(l.key)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  waehle(l.key);
                }
              }}
              onMouseEnter={() => setHover(l.key)}
              onMouseLeave={() => setHover(null)}
              filter={istAn(l.key) ? "url(#ek-glow)" : undefined}
              className={`cursor-pointer outline-none transition-[fill] duration-300 focus-visible:stroke-ov-700 ${fuellung(l.key)} ${dunkel ? "stroke-navy-950" : "stroke-white"}`}
              strokeWidth={1.4}
            />
          ))}

          {/* Reichweiten-Ringe um den Firmensitz */}
          {[70, 150, 260].map((r, i) => (
            <circle
              key={r}
              cx={sitz.x}
              cy={sitz.y}
              r={r}
              fill="none"
              strokeDasharray="2 6"
              className={dunkel ? "stroke-white/20" : "stroke-ov-600/30"}
              strokeWidth={1}
              style={{ opacity: 1 - i * 0.25 }}
              pointerEvents="none"
            />
          ))}

          {/* Verbindungsbögen zu den Regionsseiten des gewählten Landes */}
          {!auswahlModus &&
            land.orte
              .filter((o) => !o.heimat)
              .map((o, i) => (
                <path
                  key={`${land.key}-${o.slug}`}
                  d={bogen(o)}
                  fill="none"
                  strokeWidth={1.3}
                  strokeLinecap="round"
                  pathLength={1}
                  className={`ov-ek-bogen ${dunkel ? "stroke-sun-300" : "stroke-navy-600"}`}
                  style={{ animationDelay: `${i * 60}ms` }}
                  pointerEvents="none"
                />
              ))}

          {/* Orte */}
          {alleOrte.map((o) => {
            const imLand = !auswahlModus && o.land === land.key;
            return (
              <circle
                key={o.slug}
                cx={o.x}
                cy={o.y}
                r={imLand ? 3.6 : 2}
                pointerEvents="none"
                className={imLand ? (dunkel ? "fill-sun-300" : "fill-navy-700") : dunkel ? "fill-white/40" : "fill-ink-400/70"}
              />
            );
          })}

          {/* Firmensitz */}
          <g pointerEvents="none">
            <circle cx={sitz.x} cy={sitz.y} r={9} className="fill-ov-500/30 motion-safe:animate-ping" style={{ transformBox: "fill-box", transformOrigin: "center" }} />
            <circle cx={sitz.x} cy={sitz.y} r={6} className={dunkel ? "fill-white" : "fill-navy-950"} />
            <circle cx={sitz.x} cy={sitz.y} r={3} className="fill-ov-400" />
            <text
              x={sitz.x - 11}
              y={sitz.y + 20}
              textAnchor="end"
              paintOrder="stroke"
              strokeWidth={4}
              strokeLinejoin="round"
              className={`font-display text-[12px] font-bold ${dunkel ? "fill-white stroke-navy-950" : "fill-ink-900 stroke-white"}`}
            >
              {sitz.name}
            </text>
          </g>
        </svg>

        {/* Bundesland-Chips (Tastatur & Mobil) */}
        <div className="mt-5 flex flex-wrap gap-2" role="group" aria-label="Bundesland wählen">
          {laender.map((l) => (
            <button
              key={l.key}
              type="button"
              aria-pressed={istAn(l.key)}
              onClick={() => waehle(l.key)}
              onMouseEnter={() => setHover(l.key)}
              onMouseLeave={() => setHover(null)}
              className={`inline-flex h-10 items-center gap-1.5 rounded-full px-3.5 text-[13.5px] font-semibold transition-all ${
                istAn(l.key)
                  ? "bg-ov-600 text-white shadow-[0_6px_16px_-6px_rgba(102,153,51,0.7)]"
                  : dunkel
                    ? "bg-white/[0.07] text-white/80 ring-1 ring-inset ring-white/15 hover:bg-white/15"
                    : "bg-white text-ink-700 ring-1 ring-inset ring-ink-200 hover:ring-ov-300"
              }`}
            >
              {auswahlModus && istAn(l.key) && <Check aria-hidden="true" className="h-3.5 w-3.5" strokeWidth={3} />}
              {l.name}
            </button>
          ))}
          {auswahlModus && (
            <button type="button" onClick={alleWaehlen} className={`inline-flex h-10 items-center rounded-full px-3.5 text-[13.5px] font-semibold underline-offset-4 hover:underline ${dunkel ? "text-ov-300" : "text-ov-700"}`}>
              {auswahl.length === laender.length ? "Auswahl leeren" : "Ganz Österreich"}
            </button>
          )}
        </div>
        {quelle && <p className={`mt-3 text-[12px] ${dunkel ? "text-white/35" : "text-ink-400"}`}>{quelle}</p>}
      </div>

      {/* Detailfeld */}
      {auswahlModus ? (
        <div className={`rounded-[2rem] p-7 md:p-8 ${dunkel ? "ov-glass" : "bg-white shadow-xl ring-1 ring-ink-200/70"}`} aria-live="polite">
          <p className={`text-[12.5px] font-semibold uppercase tracking-[0.14em] ${dunkel ? "text-ov-300" : "text-ov-700"}`}>Ihr Einsatzgebiet</p>
          <p className={`mt-3 font-display text-[clamp(2.2rem,1.8rem+1.4vw,3rem)] font-extrabold leading-none ${txt}`}>
            <span className="ov-num">{auswahl.length}</span> <span className={`text-[18px] font-bold ${txt2}`}>von 9 Bundesländern</span>
          </p>
          <p className={`mt-4 text-[15px] leading-relaxed ${txt2}`}>
            {auswahl.length
              ? laender.filter((l) => auswahl.includes(l.key)).map((l) => l.name).join(", ")
              : "Tippen Sie auf die Karte oder die Namen, um die Bundesländer zu markieren, in denen Ihr Betrieb arbeitet."}
          </p>
          <a
            href="#registrierung"
            className="group mt-7 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-ov-600 px-6 text-[15px] font-semibold text-white shadow-[0_8px_24px_-8px_rgba(102,153,51,0.65)] transition hover:bg-ov-700"
          >
            {auswahl.length ? "Mit dieser Auswahl registrieren" : "Zur Registrierung"}
            <ArrowRight aria-hidden="true" className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </a>
          <p className={`mt-3 text-[12.5px] ${dunkel ? "text-white/45" : "text-ink-500"}`}>Die Auswahl wird in Schritt 2 der Registrierung übernommen.</p>
        </div>
      ) : (
        <div key={land.key} className={`ov-tab-panel rounded-[2rem] p-7 md:p-8 ${dunkel ? "ov-glass" : "bg-white shadow-xl ring-1 ring-ink-200/70"}`} aria-live="polite">
          <p className={`text-[12.5px] font-semibold uppercase tracking-[0.14em] ${dunkel ? "text-ov-300" : "text-ov-700"}`}>Bundesland</p>
          <h3 className={`mt-2 font-display text-[clamp(1.6rem,1.3rem+1vw,2.1rem)] font-extrabold leading-tight ${txt}`}>{land.name}</h3>

          {land.netzbetreiber.length > 0 && (
            <div className="mt-5">
              <p className={`flex items-center gap-2 text-[13px] font-semibold ${txt2}`}>
                <PlugZap aria-hidden="true" className="h-4 w-4 text-ov-500" /> Netzbetreiber, mit denen wir abstimmen
              </p>
              <ul className="mt-2.5 flex flex-wrap gap-1.5">
                {land.netzbetreiber.map((n) => (
                  <li key={n} className={`rounded-full px-3 py-1 text-[13px] font-medium ${dunkel ? "bg-white/10 text-white/85" : "bg-sand-100 text-ink-700"}`}>
                    {n}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {land.orte.length > 0 && (
            <div className="mt-6">
              <p className={`flex items-center gap-2 text-[13px] font-semibold ${txt2}`}>
                <Navigation aria-hidden="true" className="h-4 w-4 text-ov-500" /> Regionen · Luftlinie ab {sitz.name}
              </p>
              <ul className={`mt-2 divide-y ${dunkel ? "divide-white/10" : "divide-ink-100"}`}>
                {land.orte.slice(0, 6).map((o) => (
                  <li key={o.slug}>
                    <Link href={`/photovoltaik/${o.slug}`} className={`group flex items-center justify-between gap-3 py-2.5 text-[14.5px] ${dunkel ? "text-white/85 hover:text-white" : "text-ink-800 hover:text-ov-700"}`}>
                      <span className="flex items-center gap-2">
                        <MapPin aria-hidden="true" className="h-3.5 w-3.5 text-ov-500" />
                        Photovoltaik {o.name}
                      </span>
                      <span className={`ov-num text-[13px] ${dunkel ? "text-white/45" : "text-ink-500"}`}>{o.heimat ? "Firmensitz" : fmtKm(o.km)}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-[14px] font-semibold">
            <Link href="/photovoltaik" className={`inline-flex items-center gap-1.5 ${dunkel ? "text-ov-300 hover:text-white" : "text-ov-700 hover:text-ov-800"}`}>
              Alle Regionen <ArrowRight aria-hidden="true" className="h-4 w-4" />
            </Link>
            {land.foerderHref && (
              <Link href={land.foerderHref} className={`inline-flex items-center gap-1.5 ${dunkel ? "text-ov-300 hover:text-white" : "text-ov-700 hover:text-ov-800"}`}>
                Landesförderung {land.name} <ArrowRight aria-hidden="true" className="h-4 w-4" />
              </Link>
            )}
          </div>
        </div>
      )}

      <style>{`
        @media (prefers-reduced-motion: no-preference) {
          .ov-ek-bogen { stroke-dasharray: 1; stroke-dashoffset: 1; animation: ov-ek-zeichnen 900ms cubic-bezier(0.22,1,0.36,1) forwards; }
        }
        @keyframes ov-ek-zeichnen { to { stroke-dashoffset: 0; } }
      `}</style>
    </div>
  );
}
