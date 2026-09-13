"use client";

import { useMemo, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, BadgeEuro, Building2, Landmark, MapPin, Sun, SearchCheck } from "lucide-react";
import { KARTE_PFADE, KARTE_VIEWBOX } from "@/components/Forderungen/Shared/kartePfade";

/**
 * Interaktive Deutschlandkarte der Förderlage.
 *
 * Zwei Ebenen:
 *  - „Förderlage“: Was bekommen private Eigenheimbesitzer im Land zusätzlich
 *    zur Bundesförderung (Zuschuss, Darlehen, kommunal, nichts)?
 *  - „Solarertrag“: typischer Jahresertrag je kWp – er wiegt über 20 Jahre
 *    oft schwerer als ein einmaliger Zuschuss.
 *
 * Bedienung: Maus (Hover zeigt Vorschau, Klick wählt), Tastatur (Tab/Pfeiltasten,
 * Enter/Leertaste wählt) und auf kleinen Bildschirmen zusätzlich ein Auswahlfeld.
 * laender: [{ key, name, kuerzel, foerderart, ertrag, kurz, programm, kommunal, portal, href, stand }]
 */

const FOERDER_FARBEN = {
  zuschuss: { fill: "fill-ov-600", text: "fill-white", chip: "bg-ov-600 text-white", punkt: "bg-ov-600" },
  darlehen: { fill: "fill-navy-500", text: "fill-white", chip: "bg-navy-500 text-white", punkt: "bg-navy-500" },
  kommunal: { fill: "fill-ov-200", text: "fill-ov-900", chip: "bg-ov-100 text-ov-800", punkt: "bg-ov-200 ring-1 ring-ov-300" },
  bund: { fill: "fill-ink-200", text: "fill-ink-700", chip: "bg-ink-100 text-ink-700", punkt: "bg-ink-200 ring-1 ring-ink-300" },
};

const FOERDER_LABEL = {
  zuschuss: "Landeszuschuss",
  darlehen: "Landesdarlehen",
  kommunal: "Kommunale Programme",
  bund: "Nur Bundesförderung",
};

const ERTRAG_STUFEN = [
  { bis: 910, label: "unter 910", fill: "fill-sand-100", text: "fill-ink-700", punkt: "bg-sand-100 ring-1 ring-ink-300" },
  { bis: 970, label: "910–970", fill: "fill-sun-300", text: "fill-ink-800", punkt: "bg-sun-300" },
  { bis: 995, label: "970–995", fill: "fill-sun-400", text: "fill-ink-900", punkt: "bg-sun-400" },
  { bis: 9999, label: "ab 995", fill: "fill-sun-500", text: "fill-ink-900", punkt: "bg-sun-500" },
];

// Beschriftungen, die vom Flächenschwerpunkt abweichen (Stadtstaaten, Enklaven)
const LABEL_POS = {
  brandenburg: [452, 282],
  bayern: [312, 548],
  niedersachsen: [196, 226],
  saarland: [58, 492],
};
// Stadtstaaten: Beschriftung als Etikett mit Hinweislinie neben der Fläche
const ETIKETT = {
  berlin: [411, 196],
  hamburg: [196, 112],
  bremen: [128, 150],
};

const mittel = (e) => Math.round((e[0] + e[1]) / 2);
const stufe = (e) => ERTRAG_STUFEN.find((s) => mittel(e) < s.bis);
const kwh = (n) => n.toLocaleString("de-DE");

export default function Foerderkarte({ laender = [], startKey = "bayern" }) {
  const [ebene, setEbene] = useState("foerderung");
  const [auswahl, setAuswahl] = useState(startKey);
  const [hover, setHover] = useState(null);
  const pfadRefs = useRef({});

  const nachKey = useMemo(() => Object.fromEntries(laender.map((l) => [l.key, l])), [laender]);
  const reihenfolge = useMemo(() => laender.map((l) => l.key), [laender]);
  const aktiv = nachKey[hover || auswahl] || laender[0];

  // Ausgewähltes Land zuletzt zeichnen, damit die Kontur oben liegt
  const zeichenfolge = useMemo(() => {
    const keys = Object.keys(KARTE_PFADE).filter((k) => nachKey[k]);
    const staaten = ["berlin", "hamburg", "bremen"];
    const basis = keys.filter((k) => !staaten.includes(k) && k !== auswahl);
    const oben = keys.filter((k) => staaten.includes(k) && k !== auswahl);
    return [...basis, ...(staaten.includes(auswahl) ? [] : [auswahl]), ...oben, ...(staaten.includes(auswahl) ? [auswahl] : [])].filter((k) => nachKey[k]);
  }, [auswahl, nachKey]);

  const zaehler = useMemo(() => {
    const z = { zuschuss: 0, darlehen: 0, kommunal: 0, bund: 0 };
    laender.forEach((l) => (z[l.foerderart] += 1));
    return z;
  }, [laender]);

  function tasten(e, key) {
    const i = reihenfolge.indexOf(key);
    let ziel = null;
    if (e.key === "ArrowRight" || e.key === "ArrowDown") ziel = reihenfolge[(i + 1) % reihenfolge.length];
    if (e.key === "ArrowLeft" || e.key === "ArrowUp") ziel = reihenfolge[(i - 1 + reihenfolge.length) % reihenfolge.length];
    if (ziel) {
      e.preventDefault();
      setAuswahl(ziel);
      pfadRefs.current[ziel]?.focus();
    }
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setAuswahl(key);
    }
  }

  if (!aktiv) return null;
  const farbe = FOERDER_FARBEN[aktiv.foerderart];
  const ertragProzent = Math.min(100, Math.max(6, ((mittel(aktiv.ertrag) - 820) / (1080 - 820)) * 100));

  return (
    <div className="overflow-hidden rounded-[2rem] bg-white shadow-[0_40px_80px_-50px_rgba(3,18,43,0.45)] ring-1 ring-ink-200/70">
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.08fr)_minmax(0,0.92fr)]">
        {/* Karte */}
        <div className="relative border-b border-ink-100 p-5 sm:p-8 lg:border-b-0 lg:border-r">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <p className="text-[13px] font-semibold uppercase tracking-[0.14em] text-ink-500">
              {ebene === "foerderung" ? "Förderlage für Eigenheime" : "Solarertrag in kWh je kWp"}
            </p>
            <div role="group" aria-label="Kartenebene" className="inline-flex rounded-full bg-ink-100 p-1">
              {[
                { id: "foerderung", label: "Förderlage", icon: BadgeEuro },
                { id: "ertrag", label: "Solarertrag", icon: Sun },
              ].map((o) => {
                const an = ebene === o.id;
                const Icon = o.icon;
                return (
                  <button
                    key={o.id}
                    type="button"
                    aria-pressed={an}
                    onClick={() => setEbene(o.id)}
                    className={`inline-flex h-10 items-center gap-1.5 rounded-full px-4 text-[14px] font-semibold transition-all ${an ? "bg-white text-ink-900 shadow-sm" : "text-ink-600 hover:text-ink-800"}`}
                  >
                    <Icon aria-hidden="true" className={`h-4 w-4 ${an ? (o.id === "ertrag" ? "text-sun-500" : "text-ov-600") : ""}`} />
                    {o.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="relative mx-auto mt-4 max-w-[470px]">
            <svg
              viewBox={KARTE_VIEWBOX}
              className="h-auto w-full overflow-visible"
              role="group"
              aria-label="Deutschlandkarte: Bundesland auswählen"
              onMouseLeave={() => setHover(null)}
            >
              <title>Förderlage und Solarertrag der 16 Bundesländer</title>
              {zeichenfolge.map((key) => {
                const land = nachKey[key];
                const pfad = KARTE_PFADE[key];
                const gewaehlt = key === auswahl;
                const f = ebene === "foerderung" ? FOERDER_FARBEN[land.foerderart] : stufe(land.ertrag);
                return (
                  <path
                    key={key}
                    ref={(el) => (pfadRefs.current[key] = el)}
                    d={pfad.d}
                    fillRule="evenodd"
                    tabIndex={0}
                    role="button"
                    aria-pressed={gewaehlt}
                    aria-label={`${land.name}: ${FOERDER_LABEL[land.foerderart]}, ${kwh(land.ertrag[0])} bis ${kwh(land.ertrag[1])} kWh je kWp`}
                    onMouseEnter={() => setHover(key)}
                    onClick={() => setAuswahl(key)}
                    onFocus={() => setAuswahl(key)}
                    onKeyDown={(e) => tasten(e, key)}
                    className={`${f.fill} cursor-pointer outline-none transition-[fill,opacity,stroke-width] duration-300 hover:opacity-85 focus-visible:opacity-90 ${gewaehlt ? "stroke-navy-900" : "stroke-white"}`}
                    strokeWidth={gewaehlt ? 2.4 : 1.1}
                    strokeLinejoin="round"
                  />
                );
              })}
              {zeichenfolge.map((key) => {
                const land = nachKey[key];
                const [x, y] = LABEL_POS[key] || [KARTE_PFADE[key].cx, KARTE_PFADE[key].cy];
                const f = ebene === "foerderung" ? FOERDER_FARBEN[land.foerderart] : stufe(land.ertrag);
                const et = ETIKETT[key];
                if (et) {
                  const gewaehlt = key === auswahl;
                  return (
                    <g key={`t-${key}`} aria-hidden="true" className="pointer-events-none select-none">
                      <line x1={KARTE_PFADE[key].cx} y1={KARTE_PFADE[key].cy} x2={et[0]} y2={et[1]} className="stroke-navy-900/50" strokeWidth={0.8} />
                      <circle cx={KARTE_PFADE[key].cx} cy={KARTE_PFADE[key].cy} r={1.8} className="fill-navy-900" />
                      <rect x={et[0] - 15} y={et[1] - 9} width={30} height={18} rx={9} className={gewaehlt ? "fill-navy-900" : "fill-white stroke-ink-300"} strokeWidth={0.8} />
                      <text x={et[0]} y={et[1] + 0.5} textAnchor="middle" dominantBaseline="central" className={`font-display font-bold ${gewaehlt ? "fill-white" : "fill-ink-800"}`} style={{ fontSize: 10.5 }}>
                        {land.kuerzel}
                      </text>
                    </g>
                  );
                }
                return (
                  <text
                    key={`t-${key}`}
                    x={x}
                    y={y}
                    textAnchor="middle"
                    dominantBaseline="central"
                    aria-hidden="true"
                    className={`pointer-events-none select-none font-display font-bold ${f.text}`}
                    style={{ fontSize: key === "saarland" ? 10 : 14, letterSpacing: "0.02em" }}
                  >
                    {land.kuerzel}
                  </text>
                );
              })}
            </svg>
          </div>

          {/* Legende */}
          <ul className="mt-5 grid grid-cols-2 gap-x-4 gap-y-2.5 text-[13.5px] text-ink-600 sm:flex sm:flex-wrap sm:justify-center sm:gap-x-6">
            {ebene === "foerderung"
              ? Object.keys(FOERDER_FARBEN).map((k) => (
                  <li key={k} className="flex items-center gap-2">
                    <span aria-hidden="true" className={`h-3 w-3 shrink-0 rounded-[4px] ${FOERDER_FARBEN[k].punkt}`} />
                    {FOERDER_LABEL[k]} <span className="ov-num text-ink-500">({zaehler[k]})</span>
                  </li>
                ))
              : ERTRAG_STUFEN.map((s) => (
                  <li key={s.label} className="flex items-center gap-2">
                    <span aria-hidden="true" className={`h-3 w-3 shrink-0 rounded-[4px] ${s.punkt}`} />
                    <span className="ov-num">{s.label}</span> kWh/kWp
                  </li>
                ))}
          </ul>
        </div>

        {/* Seitenpanel */}
        <div className="flex flex-col bg-sand-50/60 p-5 sm:p-8" aria-live="polite">
          <label className="mb-5 block lg:hidden">
            <span className="sr-only">Bundesland auswählen</span>
            <select
              value={auswahl}
              onChange={(e) => setAuswahl(e.target.value)}
              className="h-12 w-full rounded-full bg-white px-5 text-[15px] font-semibold text-ink-900 ring-1 ring-ink-200 focus:outline-none focus:ring-2 focus:ring-ov-500"
            >
              {laender.map((l) => (
                <option key={l.key} value={l.key}>{l.name}</option>
              ))}
            </select>
          </label>

          <div className="flex items-start gap-4">
            <span className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl font-display text-[18px] font-extrabold ${farbe.chip}`}>
              {aktiv.kuerzel}
            </span>
            <div className="min-w-0">
              <h3 className="font-display text-[26px] font-extrabold leading-tight tracking-tight text-ink-900">{aktiv.name}</h3>
              <p className="mt-1 flex flex-wrap items-center gap-2 text-[13px] text-ink-500">
                <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[12px] font-semibold ${farbe.chip}`}>
                  {FOERDER_LABEL[aktiv.foerderart]}
                </span>
                Stand {aktiv.stand}
              </p>
            </div>
          </div>

          <p className="mt-5 text-[16px] font-medium leading-relaxed text-ink-800">{aktiv.kurz}</p>

          <dl className="mt-6 space-y-4">
            <div className="flex gap-3">
              <dt className="sr-only">Landesprogramm</dt>
              <Landmark aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-ov-600" />
              <dd className="text-[14.5px] leading-relaxed text-ink-600">
                <span className="block font-semibold text-ink-900">Landesprogramm</span>
                {aktiv.programm ? `${aktiv.programm.name} · ${aktiv.programm.art}` : "Kein Landesprogramm für private Anlagen"}
              </dd>
            </div>
            <div className="flex gap-3">
              <dt className="sr-only">Kommunale Programme</dt>
              <Building2 aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-ov-600" />
              <dd className="min-w-0 flex-1 text-[14.5px] leading-relaxed text-ink-600">
                <span className="block font-semibold text-ink-900">
                  {aktiv.kommunal.length > 0 ? `${aktiv.kommunal.length} aktive${aktiv.kommunal.length === 1 ? "s" : ""} Programm${aktiv.kommunal.length === 1 ? "" : "e"}` : "Keine aktiven Programme bekannt"}
                </span>
                {aktiv.kommunal.length > 0 && (
                  <ul className="mt-1.5 space-y-1.5">
                    {aktiv.kommunal.slice(0, 3).map((k) => (
                      <li key={`${k.ort}-${k.programm}`} className="flex flex-wrap justify-between gap-x-3 border-b border-dashed border-ink-200 pb-1.5 last:border-0">
                        <span>{k.ort === aktiv.name ? k.programm : k.ort}</span>
                        <span className="font-semibold text-ov-700">{k.hoeheKurz}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </dd>
            </div>
            <div className="flex gap-3">
              <dt className="sr-only">Solarertrag</dt>
              <Sun aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-sun-500" />
              <dd className="flex-1 text-[14.5px] leading-relaxed text-ink-600">
                <span className="flex items-baseline justify-between gap-3">
                  <span className="font-semibold text-ink-900">Solarertrag</span>
                  <span className="ov-num font-semibold text-ink-800">{kwh(aktiv.ertrag[0])}–{kwh(aktiv.ertrag[1])} kWh/kWp</span>
                </span>
                <span aria-hidden="true" className="mt-2 block h-2 overflow-hidden rounded-full bg-ink-200/70">
                  <span className="block h-full rounded-full bg-gradient-to-r from-sun-300 to-sun-500 transition-[width] duration-500" style={{ width: `${ertragProzent}%` }} />
                </span>
              </dd>
            </div>
            {aktiv.portal && (
              <div className="flex gap-3">
                <dt className="sr-only">Anlaufstelle</dt>
                <MapPin aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-ov-600" />
                <dd className="text-[14.5px] leading-relaxed text-ink-600">
                  <span className="block font-semibold text-ink-900">Anlaufstelle</span>
                  {aktiv.portal}
                </dd>
              </div>
            )}
          </dl>

          <div className="mt-6 rounded-2xl bg-white p-4 ring-1 ring-ink-200/70">
            <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-ink-500">Immer zusätzlich – bundesweit</p>
            <ul className="mt-2.5 flex flex-wrap gap-1.5 text-[12.5px] font-medium text-ink-700">
              {["0 % Umsatzsteuer", "Einkommensteuerfrei", "EEG-Vergütung", "KfW-Kredit 270"].map((b) => (
                <li key={b} className="rounded-full bg-ov-50 px-2.5 py-1 ring-1 ring-ov-100">{b}</li>
              ))}
            </ul>
          </div>

          <div className="mt-auto flex flex-col gap-3 pt-8 sm:flex-row lg:flex-col xl:flex-row">
            <Link
              href={aktiv.href}
              className="group inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-full bg-ov-600 px-5 text-[15px] font-semibold text-white shadow-[0_8px_24px_-8px_rgba(102,153,51,0.65)] transition-all hover:bg-ov-700"
            >
              Förderung in {aktiv.name.length > 14 ? aktiv.kuerzel : aktiv.name}
              <ArrowRight aria-hidden="true" className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href={`/foerdercheck?land=${aktiv.key}`}
              className="inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-full bg-white px-5 text-[15px] font-semibold text-ink-900 ring-1 ring-inset ring-ink-200 transition-all hover:bg-ink-50 hover:ring-ink-300"
            >
              <SearchCheck aria-hidden="true" className="h-4 w-4 text-ov-600" />
              Förder-Check
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
