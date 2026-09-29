"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BadgeEuro, BatteryCharging, Building2, MapPin, SearchCheck, Sun, Users } from "lucide-react";
import { cn } from "@/components/ui/cn";
import { KARTE_PFADE, KARTE_QUELLE, KARTE_VIEWBOX } from "@/components/Forderungen/Shared/kartePfade";

/**
 * Interaktive Österreichkarte der Förderlage (dunkle Premium-Variante).
 *
 * Zwei Ebenen:
 *  - „Förder-Ampel“: Was fördert das Land zusätzlich zum Bund?
 *    grün = breites Landesprogramm, gelb = gezielte Programme, grau = Bund + Beratung
 *  - „Solarertrag“: PVGIS-Jahresertrag je kWp
 *
 * Bedienung: Maus (Hover = Vorschau mit Leuchtrand, Klick = Auswahl), Tastatur
 * (Tab bzw. Pfeiltasten, Enter/Leertaste) und auf kleinen Bildschirmen ein Auswahlfeld.
 * laender: [{ key, name, kuerzel, foerderart, ertrag, kurz, unternehmen, speicher, eg, netz, href, stand, bild }]
 */

const AMPEL = {
  zuschuss: { label: "Breites Landesprogramm", kurz: "grün", fill: "#78b041", text: "#ffffff", chip: "bg-ov-500 text-white", punkt: "bg-ov-500" },
  gezielt: { label: "Gezielte Landesprogramme", kurz: "gelb", fill: "#ffd466", text: "#03122b", chip: "bg-sun-400 text-navy-950", punkt: "bg-sun-400" },
  bund: { label: "Bundesförderung + Beratung", kurz: "grau", fill: "#aeb7c5", text: "#03122b", chip: "bg-ink-300 text-navy-950", punkt: "bg-ink-300" },
};

const ERTRAG_STUFEN = [
  { bis: 1140, label: "unter 1.140", fill: "#ffe7a6" },
  { bis: 1180, label: "1.140–1.180", fill: "#ffd873" },
  { bis: 1220, label: "1.180–1.220", fill: "#ffc53d" },
  { bis: 99999, label: "ab 1.220", fill: "#f5a70f" },
];

const LABEL_POS = { niederoesterreich: [455, 70], tirol: [170, 205], burgenland: [546, 146] };
const ETIKETT = { wien: [585, 60] };

const mittel = (e) => Math.round((e[0] + e[1]) / 2);
const stufe = (e) => ERTRAG_STUFEN.find((s) => mittel(e) < s.bis);
const kwh = (n) => n.toLocaleString("de-DE");

export default function Foerderkarte({ laender = [], startKey = "oberoesterreich" }) {
  const [ebene, setEbene] = useState("foerderung");
  const [auswahl, setAuswahl] = useState(startKey);
  const [hover, setHover] = useState(null);
  const [gezeichnet, setGezeichnet] = useState(false);
  const pfadRefs = useRef({});
  const wrapRef = useRef(null);
  const filterId = useId().replace(/:/g, "");

  const nachKey = useMemo(() => Object.fromEntries(laender.map((l) => [l.key, l])), [laender]);
  const reihenfolge = useMemo(() => laender.map((l) => l.key), [laender]);
  const aktiv = nachKey[hover || auswahl] || laender[0];

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        setGezeichnet(true);
        io.disconnect();
      }
    }, { threshold: 0.2 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Hervorgehobenes Land zuletzt zeichnen, Wien immer über Niederösterreich
  const oben = hover || auswahl;
  const zeichenfolge = useMemo(() => {
    const keys = Object.keys(KARTE_PFADE).filter((k) => nachKey[k]);
    const basis = keys.filter((k) => k !== oben && k !== "wien");
    return [...basis, ...(oben === "wien" ? ["wien"] : [oben, "wien"])].filter((k) => nachKey[k]);
  }, [oben, nachKey]);

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
  const farbe = AMPEL[aktiv.foerderart];
  const ertragProzent = Math.min(100, Math.max(6, ((mittel(aktiv.ertrag) - 1050) / (1400 - 1050)) * 100));
  const fuellung = (l) => (ebene === "foerderung" ? AMPEL[l.foerderart].fill : stufe(l.ertrag).fill);
  const textFarbe = (l) => (ebene === "foerderung" ? AMPEL[l.foerderart].text : "#03122b");

  return (
    <div ref={wrapRef} className="grid gap-6 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,0.65fr)] lg:gap-8">
      {/* Karte */}
      <div className="relative min-w-0">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div role="group" aria-label="Kartenebene" className="inline-flex rounded-full bg-white/[0.06] p-1 ring-1 ring-white/10">
            {[
              { id: "foerderung", label: "Förder-Ampel", icon: BadgeEuro },
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
                  className={cn("inline-flex h-10 items-center gap-1.5 rounded-full px-4 text-[14px] font-semibold transition-all", an ? "bg-white text-navy-950 shadow-lg" : "text-white/70 hover:text-white")}
                >
                  <Icon aria-hidden="true" className={cn("h-4 w-4", an ? (o.id === "ertrag" ? "text-sun-500" : "text-ov-600") : "")} />
                  {o.label}
                </button>
              );
            })}
          </div>
          <label className="block w-full sm:w-auto lg:hidden">
            <span className="sr-only">Bundesland auswählen</span>
            <select
              value={auswahl}
              onChange={(e) => setAuswahl(e.target.value)}
              className="h-11 w-full rounded-full bg-white px-5 text-[15px] font-semibold text-ink-900 focus:outline-none focus:ring-2 focus:ring-ov-400 sm:w-64"
            >
              {laender.map((l) => (
                <option key={l.key} value={l.key}>{l.name}</option>
              ))}
            </select>
          </label>
        </div>

        <div className="relative mx-auto mt-6 max-w-[860px]">
          <div aria-hidden="true" className="pointer-events-none absolute inset-x-10 top-1/4 h-1/2 rounded-full bg-ov-500/20 blur-[80px]" />
          <svg viewBox={KARTE_VIEWBOX} className="relative h-auto w-full overflow-visible" role="group" aria-label="Österreichkarte: Bundesland auswählen" onMouseLeave={() => setHover(null)}>
            <title>Förder-Ampel und Solarertrag der neun Bundesländer</title>
            <defs>
              <filter id={`glow-${filterId}`} x="-30%" y="-30%" width="160%" height="160%">
                <feGaussianBlur stdDeviation="5" result="b" />
                <feMerge>
                  <feMergeNode in="b" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            {zeichenfolge.map((key, i) => {
              const land = nachKey[key];
              const gewaehlt = key === auswahl;
              const hervor = key === hover || gewaehlt;
              return (
                <path
                  key={key}
                  ref={(el) => (pfadRefs.current[key] = el)}
                  d={KARTE_PFADE[key].d}
                  fillRule="evenodd"
                  tabIndex={0}
                  role="button"
                  aria-pressed={gewaehlt}
                  aria-label={`${land.name}: ${AMPEL[land.foerderart].label}, ${kwh(land.ertrag[0])} bis ${kwh(land.ertrag[1])} kWh je kWp`}
                  onMouseEnter={() => setHover(key)}
                  onClick={() => setAuswahl(key)}
                  onFocus={() => setAuswahl(key)}
                  onKeyDown={(e) => tasten(e, key)}
                  pathLength={1}
                  filter={hervor ? `url(#glow-${filterId})` : undefined}
                  className="cursor-pointer outline-none"
                  style={{
                    fill: fuellung(land),
                    fillOpacity: gezeichnet ? (hervor || !hover ? 1 : 0.45) : 0,
                    stroke: hervor ? "#ffffff" : "rgba(255,255,255,0.55)",
                    strokeWidth: gewaehlt ? 2.4 : hervor ? 1.8 : 0.9,
                    strokeLinejoin: "round",
                    strokeDasharray: 1,
                    strokeDashoffset: gezeichnet ? 0 : 1,
                    transition: `stroke-dashoffset 1.4s cubic-bezier(0.22,1,0.36,1) ${i * 70}ms, fill-opacity 0.5s ease, fill 0.4s ease, stroke-width 0.25s ease`,
                  }}
                />
              );
            })}
            {zeichenfolge.map((key) => {
              const land = nachKey[key];
              const et = ETIKETT[key];
              const p = KARTE_PFADE[key];
              const gewaehlt = key === auswahl;
              if (et) {
                return (
                  <g key={`t-${key}`} aria-hidden="true" className="pointer-events-none select-none" style={{ opacity: gezeichnet ? 1 : 0, transition: "opacity .6s ease 1.1s" }}>
                    <line x1={p.cx} y1={p.cy} x2={et[0]} y2={et[1]} stroke="rgba(255,255,255,0.6)" strokeWidth={0.8} />
                    <circle cx={p.cx} cy={p.cy} r={1.8} fill="#ffffff" />
                    <rect x={et[0] - 14} y={et[1] - 9} width={28} height={18} rx={9} fill={gewaehlt ? "#ffffff" : fuellung(land)} stroke="#ffffff" strokeWidth={0.8} />
                    <text x={et[0]} y={et[1] + 0.5} textAnchor="middle" dominantBaseline="central" className="font-display font-bold" style={{ fontSize: 10.5, fill: gewaehlt ? "#03122b" : textFarbe(land) }}>
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
                  className="pointer-events-none select-none font-display font-bold"
                  style={{ fontSize: key === "vorarlberg" || key === "burgenland" ? 11 : 15, letterSpacing: "0.02em", fill: textFarbe(land), opacity: gezeichnet ? 1 : 0, transition: "opacity .6s ease 1.1s" }}
                >
                  {land.kuerzel}
                </text>
              );
            })}
          </svg>
        </div>

        {/* Legende */}
        <ul className="mt-6 grid grid-cols-1 gap-x-4 gap-y-2.5 text-[13.5px] text-white/70 sm:flex sm:flex-wrap sm:justify-center sm:gap-x-6">
          {ebene === "foerderung"
            ? Object.keys(AMPEL).map((k) => (
                <li key={k} className="flex items-center gap-2">
                  <span aria-hidden="true" className={cn("h-3 w-3 shrink-0 rounded-full ring-2 ring-white/20", AMPEL[k].punkt)} />
                  {AMPEL[k].label} <span className="ov-num text-white/45">({zaehler[k]})</span>
                </li>
              ))
            : ERTRAG_STUFEN.map((s) => (
                <li key={s.label} className="flex items-center gap-2">
                  <span aria-hidden="true" className="h-3 w-3 shrink-0 rounded-full" style={{ background: s.fill }} />
                  <span className="ov-num">{s.label}</span> kWh/kWp
                </li>
              ))}
        </ul>
        <p className="mt-3 text-center text-[11.5px] text-white/35">{KARTE_QUELLE}</p>
      </div>

      {/* Seitenpanel */}
      <div className="ov-glass flex min-w-0 flex-col overflow-hidden rounded-[2rem]" aria-live="polite">
        <div className="relative aspect-[16/9] w-full overflow-hidden bg-navy-900">
          {laender.map((l) =>
            l.bild?.src ? (
              <Image
                key={l.key}
                src={l.bild.src}
                alt={l.key === aktiv.key ? l.bild.alt : ""}
                aria-hidden={l.key === aktiv.key ? undefined : true}
                fill
                sizes="(max-width: 1024px) 100vw, 30vw"
                className={cn("object-cover transition-opacity duration-500", l.key === aktiv.key ? "opacity-100" : "opacity-0")}
                style={l.bild.position ? { objectPosition: l.bild.position } : undefined}
              />
            ) : null
          )}
          <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/20 to-transparent" />
          <div className="absolute bottom-4 left-5 right-5 flex items-end gap-3">
            <span className={cn("flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl font-display text-[16px] font-extrabold shadow-lg", farbe.chip)}>{aktiv.kuerzel}</span>
            <div className="min-w-0">
              <h3 className="font-display text-[24px] font-extrabold leading-tight tracking-tight text-white">{aktiv.name}</h3>
              <p className="text-[12.5px] text-white/60">Stand {aktiv.stand}</p>
            </div>
          </div>
        </div>

        <div className="flex flex-1 flex-col p-5 sm:p-6">
          <p className="inline-flex items-center gap-2 self-start rounded-full bg-white/10 px-3 py-1 text-[12.5px] font-semibold text-white">
            <span aria-hidden="true" className={cn("h-2.5 w-2.5 rounded-full", farbe.punkt)} />
            Ampel {farbe.kurz}: {farbe.label}
          </p>
          <p className="mt-4 text-[15px] leading-relaxed text-white/85">{aktiv.kurz}</p>

          <dl className="mt-5 space-y-3.5">
            {[
              { icon: Building2, label: "Unternehmen", wert: aktiv.unternehmen },
              { icon: BatteryCharging, label: "Speicher", wert: aktiv.speicher },
              { icon: Users, label: "Energiegemeinschaften", wert: aktiv.eg },
            ].map((z) => (
              <div key={z.label} className="flex gap-3">
                <dt className="sr-only">{z.label}</dt>
                <z.icon aria-hidden="true" className="mt-0.5 h-[18px] w-[18px] shrink-0 text-ov-300" />
                <dd className="text-[14px] leading-relaxed text-white/65">
                  <span className="block font-semibold text-white">{z.label}</span>
                  {z.wert}
                </dd>
              </div>
            ))}
            <div className="flex gap-3">
              <dt className="sr-only">Solarertrag</dt>
              <Sun aria-hidden="true" className="mt-0.5 h-[18px] w-[18px] shrink-0 text-sun-400" />
              <dd className="flex-1 text-[14px] leading-relaxed text-white/65">
                <span className="flex items-baseline justify-between gap-3">
                  <span className="font-semibold text-white">Solarertrag (PVGIS)</span>
                  <span className="ov-num font-semibold text-white">{kwh(aktiv.ertrag[0])}–{kwh(aktiv.ertrag[1])} kWh/kWp</span>
                </span>
                <span aria-hidden="true" className="mt-2 block h-2 overflow-hidden rounded-full bg-white/10">
                  <span className="block h-full rounded-full bg-gradient-to-r from-sun-300 to-sun-500 transition-[width] duration-500" style={{ width: `${ertragProzent}%` }} />
                </span>
              </dd>
            </div>
            {aktiv.netz && (
              <div className="flex gap-3">
                <dt className="sr-only">Netzbetreiber</dt>
                <MapPin aria-hidden="true" className="mt-0.5 h-[18px] w-[18px] shrink-0 text-ov-300" />
                <dd className="text-[14px] leading-relaxed text-white/65">
                  <span className="block font-semibold text-white">Netzbetreiber</span>
                  {aktiv.netz}
                </dd>
              </div>
            )}
          </dl>

          <div className="mt-auto flex flex-col gap-2.5 pt-6 sm:flex-row lg:flex-col">
            <Link href={aktiv.href} className="group inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-full bg-ov-600 px-5 text-[15px] font-semibold text-white shadow-[0_8px_24px_-8px_rgba(102,153,51,0.65)] transition-all hover:bg-ov-700">
              Förderung {aktiv.name.length > 12 ? aktiv.kuerzel : aktiv.name}
              <ArrowRight aria-hidden="true" className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link href={`/foerdercheck?land=${aktiv.key}`} className="inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-full px-5 text-[15px] font-semibold text-white ring-1 ring-inset ring-white/30 transition-all hover:bg-white/10">
              <SearchCheck aria-hidden="true" className="h-4 w-4 text-ov-300" />
              Förder-Check
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
