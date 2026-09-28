"use client";

import { useMemo, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, BadgeEuro, BatteryCharging, Building2, MapPin, SearchCheck, Sun, Users } from "lucide-react";
import { KARTE_PFADE, KARTE_QUELLE, KARTE_VIEWBOX } from "@/components/Forderungen/Shared/kartePfade";

/**
 * Interaktive Österreichkarte der Förderlage.
 *
 * Zwei Ebenen:
 *  - „Förderlage“: Was fördert das Land zusätzlich zum Bund (EAG, KPC)?
 *  - „Solarertrag“: PVGIS-Jahresertrag je kWp – über 20 Jahre oft
 *    wichtiger als ein einmaliger Zuschuss.
 *
 * Bedienung: Maus (Hover = Vorschau, Klick = Auswahl), Tastatur (Tab bzw.
 * Pfeiltasten, Enter/Leertaste) und auf kleinen Bildschirmen ein Auswahlfeld.
 * laender: [{ key, name, kuerzel, foerderart, ertrag, kurz, unternehmen, speicher, eg, netz, href, stand }]
 */

const FOERDER_FARBEN = {
  zuschuss: { fill: "fill-ov-600", text: "fill-white", chip: "bg-ov-600 text-white", punkt: "bg-ov-600" },
  gezielt: { fill: "fill-ov-200", text: "fill-ov-900", chip: "bg-ov-100 text-ov-800", punkt: "bg-ov-200 ring-1 ring-ov-300" },
  bund: { fill: "fill-ink-200", text: "fill-ink-700", chip: "bg-ink-100 text-ink-700", punkt: "bg-ink-200 ring-1 ring-ink-300" },
};

const FOERDER_LABEL = {
  zuschuss: "Breites Landesprogramm",
  gezielt: "Gezielte Landesprogramme",
  bund: "Bundesförderung + Beratung",
};

const ERTRAG_STUFEN = [
  { bis: 1140, label: "unter 1.140", fill: "fill-sun-300", text: "fill-ink-800", punkt: "bg-sun-300" },
  { bis: 1180, label: "1.140–1.180", fill: "fill-sun-400", text: "fill-ink-900", punkt: "bg-sun-400" },
  { bis: 1220, label: "1.180–1.220", fill: "fill-sun-500", text: "fill-ink-900", punkt: "bg-sun-500" },
  { bis: 99999, label: "ab 1.220", fill: "fill-ov-600", text: "fill-white", punkt: "bg-ov-600" },
];

// Beschriftungen, die vom Flächenschwerpunkt abweichen
const LABEL_POS = {
  niederoesterreich: [455, 70],
  tirol: [170, 205],
  burgenland: [546, 146],
};
// Wien als Etikett neben der Fläche
const ETIKETT = { wien: [585, 60] };

const mittel = (e) => Math.round((e[0] + e[1]) / 2);
const stufe = (e) => ERTRAG_STUFEN.find((s) => mittel(e) < s.bis);
const kwh = (n) => n.toLocaleString("de-AT");

export default function Foerderkarte({ laender = [], startKey = "oberoesterreich" }) {
  const [ebene, setEbene] = useState("foerderung");
  const [auswahl, setAuswahl] = useState(startKey);
  const [hover, setHover] = useState(null);
  const pfadRefs = useRef({});

  const nachKey = useMemo(() => Object.fromEntries(laender.map((l) => [l.key, l])), [laender]);
  const reihenfolge = useMemo(() => laender.map((l) => l.key), [laender]);
  const aktiv = nachKey[hover || auswahl] || laender[0];

  // Ausgewähltes Land zuletzt zeichnen (Kontur oben), Wien immer über Niederösterreich
  const zeichenfolge = useMemo(() => {
    const keys = Object.keys(KARTE_PFADE).filter((k) => nachKey[k]);
    const basis = keys.filter((k) => k !== auswahl && k !== "wien");
    const oben = auswahl === "wien" ? ["wien"] : [auswahl, "wien"];
    return [...basis, ...oben].filter((k) => nachKey[k]);
  }, [auswahl, nachKey]);

  const zaehler = useMemo(() => {
    const z = { zuschuss: 0, gezielt: 0, bund: 0 };
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
  const ertragProzent = Math.min(100, Math.max(6, ((mittel(aktiv.ertrag) - 1050) / (1400 - 1050)) * 100));

  return (
    <div className="overflow-hidden rounded-[2rem] bg-white shadow-[0_40px_80px_-50px_rgba(3,18,43,0.45)] ring-1 ring-ink-200/70">
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
        {/* Karte */}
        <div className="relative border-b border-ink-100 p-5 sm:p-8 lg:border-b-0 lg:border-r">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <p className="text-[13px] font-semibold uppercase tracking-[0.14em] text-ink-500">
              {ebene === "foerderung" ? "Landesförderung zusätzlich zum Bund" : "Solarertrag in kWh je kWp (PVGIS)"}
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

          <div className="relative mx-auto mt-6 max-w-[640px]">
            <svg viewBox={KARTE_VIEWBOX} className="h-auto w-full overflow-visible" role="group" aria-label="Österreichkarte: Bundesland auswählen" onMouseLeave={() => setHover(null)}>
              <title>Förderlage und Solarertrag der neun Bundesländer</title>
              {zeichenfolge.map((key) => {
                const land = nachKey[key];
                const gewaehlt = key === auswahl;
                const f = ebene === "foerderung" ? FOERDER_FARBEN[land.foerderart] : stufe(land.ertrag);
                return (
                  <path
                    key={key}
                    ref={(el) => (pfadRefs.current[key] = el)}
                    d={KARTE_PFADE[key].d}
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
                    strokeWidth={gewaehlt ? 2.2 : 1}
                    strokeLinejoin="round"
                  />
                );
              })}
              {zeichenfolge.map((key) => {
                const land = nachKey[key];
                const f = ebene === "foerderung" ? FOERDER_FARBEN[land.foerderart] : stufe(land.ertrag);
                const et = ETIKETT[key];
                const p = KARTE_PFADE[key];
                if (et) {
                  const gewaehlt = key === auswahl;
                  return (
                    <g key={`t-${key}`} aria-hidden="true" className="pointer-events-none select-none">
                      <line x1={p.cx} y1={p.cy} x2={et[0]} y2={et[1]} className="stroke-navy-900/50" strokeWidth={0.8} />
                      <circle cx={p.cx} cy={p.cy} r={1.8} className="fill-navy-900" />
                      <rect x={et[0] - 14} y={et[1] - 9} width={28} height={18} rx={9} className={gewaehlt ? "fill-navy-900" : "fill-white stroke-ink-300"} strokeWidth={0.8} />
                      <text x={et[0]} y={et[1] + 0.5} textAnchor="middle" dominantBaseline="central" className={`font-display font-bold ${gewaehlt ? "fill-white" : "fill-ink-800"}`} style={{ fontSize: 10.5 }}>
                        {land.kuerzel}
                      </text>
                    </g>
                  );
                }
                const [x, y] = LABEL_POS[key] || [p.cx, p.cy];
                return (
                  <text
                    key={`t-${key}`}
                    x={x}
                    y={y}
                    textAnchor="middle"
                    dominantBaseline="central"
                    aria-hidden="true"
                    className={`pointer-events-none select-none font-display font-bold ${f.text}`}
                    style={{ fontSize: key === "vorarlberg" || key === "burgenland" ? 11 : 15, letterSpacing: "0.02em" }}
                  >
                    {land.kuerzel}
                  </text>
                );
              })}
            </svg>
          </div>

          {/* Legende */}
          <ul className="mt-6 grid grid-cols-1 gap-x-4 gap-y-2.5 text-[13.5px] text-ink-600 sm:flex sm:flex-wrap sm:justify-center sm:gap-x-6">
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
          <p className="mt-4 text-center text-[11.5px] text-ink-400">{KARTE_QUELLE}</p>
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
            <span className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl font-display text-[18px] font-extrabold ${farbe.chip}`}>{aktiv.kuerzel}</span>
            <div className="min-w-0">
              <h3 className="font-display text-[26px] font-extrabold leading-tight tracking-tight text-ink-900">{aktiv.name}</h3>
              <p className="mt-1 flex flex-wrap items-center gap-2 text-[13px] text-ink-500">
                <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[12px] font-semibold ${farbe.chip}`}>{FOERDER_LABEL[aktiv.foerderart]}</span>
                Stand {aktiv.stand}
              </p>
            </div>
          </div>

          <p className="mt-5 text-[15.5px] font-medium leading-relaxed text-ink-800">{aktiv.kurz}</p>

          <dl className="mt-6 space-y-4">
            {[
              { icon: Building2, label: "Unternehmen", wert: aktiv.unternehmen },
              { icon: BatteryCharging, label: "Speicher", wert: aktiv.speicher },
              { icon: Users, label: "Energiegemeinschaften", wert: aktiv.eg },
            ].map((z) => (
              <div key={z.label} className="flex gap-3">
                <dt className="sr-only">{z.label}</dt>
                <z.icon aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-ov-600" />
                <dd className="text-[14.5px] leading-relaxed text-ink-600">
                  <span className="block font-semibold text-ink-900">{z.label}</span>
                  {z.wert}
                </dd>
              </div>
            ))}
            <div className="flex gap-3">
              <dt className="sr-only">Solarertrag</dt>
              <Sun aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-sun-500" />
              <dd className="flex-1 text-[14.5px] leading-relaxed text-ink-600">
                <span className="flex items-baseline justify-between gap-3">
                  <span className="font-semibold text-ink-900">Solarertrag (PVGIS)</span>
                  <span className="ov-num font-semibold text-ink-800">{kwh(aktiv.ertrag[0])}–{kwh(aktiv.ertrag[1])} kWh/kWp</span>
                </span>
                <span aria-hidden="true" className="mt-2 block h-2 overflow-hidden rounded-full bg-ink-200/70">
                  <span className="block h-full rounded-full bg-gradient-to-r from-sun-300 to-sun-500 transition-[width] duration-500" style={{ width: `${ertragProzent}%` }} />
                </span>
              </dd>
            </div>
            {aktiv.netz && (
              <div className="flex gap-3">
                <dt className="sr-only">Netzbetreiber</dt>
                <MapPin aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-ov-600" />
                <dd className="text-[14.5px] leading-relaxed text-ink-600">
                  <span className="block font-semibold text-ink-900">Netzbetreiber</span>
                  {aktiv.netz}
                </dd>
              </div>
            )}
          </dl>

          <div className="mt-6 rounded-2xl bg-white p-4 ring-1 ring-ink-200/70">
            <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-ink-500">Immer zusätzlich – bundesweit</p>
            <ul className="mt-2.5 flex flex-wrap gap-1.5 text-[12.5px] font-medium text-ink-700">
              {["EAG-Investitionszuschuss", "EAG-Marktprämie", "Investitionsfreibetrag", "Elektrizitätsabgabe frei"].map((b) => (
                <li key={b} className="rounded-full bg-ov-50 px-2.5 py-1 ring-1 ring-ov-100">{b}</li>
              ))}
            </ul>
          </div>

          <div className="mt-auto flex flex-col gap-3 pt-8 sm:flex-row lg:flex-col xl:flex-row">
            <Link
              href={aktiv.href}
              className="group inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-full bg-ov-600 px-5 text-[15px] font-semibold text-white shadow-[0_8px_24px_-8px_rgba(102,153,51,0.65)] transition-all hover:bg-ov-700"
            >
              Förderung in {aktiv.name.length > 12 ? aktiv.kuerzel : aktiv.name}
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
