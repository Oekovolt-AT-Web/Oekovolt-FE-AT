"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { ArrowRight, BatteryCharging, Gauge, TrendingDown, Zap } from "lucide-react";
import Button from "@/components/ui/Button";
import { cn } from "@/components/ui/cn";
import { Regler, Zahl } from "@/components/Rechner/bausteine";

/**
 * Interaktive Lastkurve: ein typischer Werktag eines Produktionsbetriebs (Viertelstundenwerte)
 * mit und ohne Gewerbespeicher. Der Speicher kappt alles oberhalb des Zielwerts.
 * Schematisches Beispiel – keine Messung. Standard: Spitze 420 kW → Zielwert 300 kW
 * (entspricht der Beispielrechnung auf /gewerbespeicher).
 *
 * netzbereiche: [{ name, lp }] – Leistungspreis € je kW und Jahr (Netzebene 6)
 */

const SPITZE = 420;
const GRUND = 110;

function roh(t) {
  let v = GRUND;
  if (t >= 5.75 && t < 22) {
    v = t < 14 ? 270 : 240;
    if (t >= 11.5 && t < 12.25) v = 205;
    v += 14 * Math.sin(t * 3.1) + 9 * Math.sin(t * 7.3 + 1);
  }
  const spitze = (m, a, b) => a * Math.exp(-((t - m) ** 2) / (2 * b * b));
  v += spitze(6.3, 150, 0.13) + spitze(9.6, 85, 0.22) + spitze(13.95, 135, 0.11) + spitze(17.3, 70, 0.18) + spitze(19.8, 45, 0.15);
  return v;
}

const LAST = (() => {
  const werte = Array.from({ length: 96 }, (_, i) => roh(i / 4 + 0.125));
  const max = Math.max(...werte);
  return werte.map((v) => Math.round(GRUND + ((v - GRUND) * (SPITZE - GRUND)) / (max - GRUND)));
})();

const fmt = (n, s = 0) => n.toLocaleString("de-DE", { minimumFractionDigits: s, maximumFractionDigits: s });

const W = 760, H = 330, L = 44, R = 12, T = 18, B = 30;
const MAXY = 460;
const x = (i) => L + ((W - L - R) * i) / 95;
const y = (v) => T + (H - T - B) * (1 - v / MAXY);

function pfad(werte) {
  return werte.map((v, i) => `${i ? "L" : "M"}${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(" ");
}

export default function Lastkurve({ netzbereiche = [], standardBereich = "Salzburg" }) {
  const [mit, setMit] = useState(true);
  const [ziel, setZiel] = useState(300);
  const [bereich, setBereich] = useState(standardBereich);
  const [hover, setHover] = useState(null);
  const [gezeichnet, setGezeichnet] = useState(false);
  const selectId = useId();
  const svgRef = useRef(null);

  // Grenze weich zum neuen Wert gleiten lassen
  const soll = mit ? ziel : SPITZE;
  const [grenze, setGrenze] = useState(soll);
  const aktuell = useRef(soll);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      aktuell.current = soll;
      setGrenze(soll);
      return;
    }
    const von = aktuell.current;
    let raf;
    const start = performance.now();
    const schritt = (t) => {
      const p = Math.min((t - start) / 650, 1);
      const e = 1 - Math.pow(1 - p, 3);
      aktuell.current = von + (soll - von) * e;
      setGrenze(aktuell.current);
      if (p < 1) raf = requestAnimationFrame(schritt);
    };
    raf = requestAnimationFrame(schritt);
    return () => cancelAnimationFrame(raf);
  }, [soll]);

  // Linie zeichnet sich beim ersten Sichtbarwerden
  useEffect(() => {
    const el = svgRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        setGezeichnet(true);
        io.disconnect();
      }
    }, { threshold: 0.3 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const netz = useMemo(() => LAST.map((v) => Math.min(v, grenze)), [grenze]);
  const lp = netzbereiche.find((n) => n.name === bereich)?.lp ?? 0;

  const ergebnis = useMemo(() => {
    const z = mit ? ziel : SPITZE;
    const energie = LAST.reduce((s, v) => s + Math.max(0, v - z) * 0.25, 0);
    let laengste = 0, lauf = 0;
    LAST.forEach((v) => {
      lauf = v > z ? lauf + 0.25 : 0;
      laengste = Math.max(laengste, lauf);
    });
    const reduktion = SPITZE - z;
    return { energie, reduktion, laengste, kapazitaet: energie / 0.9, einsparung: reduktion * lp };
  }, [mit, ziel, lp]);

  const spitzeIndex = LAST.indexOf(SPITZE);
  const aktiv = hover != null ? { i: hover, last: LAST[hover], netz: netz[hover] } : null;

  const bewegen = (e) => {
    const svg = svgRef.current;
    if (!svg) return;
    const r = svg.getBoundingClientRect();
    const px = ((e.clientX - r.left) / r.width) * W;
    const i = Math.round(((px - L) / (W - L - R)) * 95);
    setHover(i >= 0 && i <= 95 ? i : null);
  };

  const uhr = (i) => `${String(Math.floor(i / 4)).padStart(2, "0")}:${String((i % 4) * 15).padStart(2, "0")}`;

  return (
    <div className="overflow-hidden rounded-[2rem] bg-white shadow-2xl ring-1 ring-ink-200/70">
      <div className="flex flex-col gap-5 border-b border-ink-100 p-6 md:flex-row md:items-center md:justify-between md:p-8">
        <div>
          <p className="text-[12.5px] font-semibold uppercase tracking-[0.16em] text-ov-700">Interaktiv · Werktag im Jänner</p>
          <h3 className="ov-h3 mt-2 text-ink-900">Wie ein Speicher Ihre Monatsspitze kappt</h3>
        </div>
        <div role="group" aria-label="Szenario" className="inline-flex self-start rounded-full bg-ink-100 p-1 md:self-auto">
          {[
            { v: false, l: "Ohne Speicher" },
            { v: true, l: "Mit Speicher" },
          ].map((o) => (
            <button
              key={o.l}
              type="button"
              aria-pressed={mit === o.v}
              onClick={() => setMit(o.v)}
              className={cn(
                "h-10 rounded-full px-4 text-[14px] font-semibold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ov-500 md:px-5",
                mit === o.v ? "bg-white text-ink-900 shadow-md" : "text-ink-600 hover:text-ink-800"
              )}
            >
              {o.l}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="relative p-4 md:p-6">
          <div className="overflow-x-auto ov-no-scrollbar">
            <svg
              ref={svgRef}
              viewBox={`0 0 ${W} ${H}`}
              className="h-auto w-full min-w-[560px] touch-pan-x"
              role="img"
              aria-label={`Lastgang eines Werktags ${mit ? `mit Speicher, Netzbezug auf ${ziel} Kilowatt begrenzt` : `ohne Speicher, Spitze ${SPITZE} Kilowatt`}`}
              onMouseMove={bewegen}
              onMouseLeave={() => setHover(null)}
            >
              <defs>
                <linearGradient id="lk-flaeche" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#1f5aa1" stopOpacity="0.22" />
                  <stop offset="100%" stopColor="#1f5aa1" stopOpacity="0.02" />
                </linearGradient>
                <pattern id="lk-schraffur" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                  <rect width="6" height="6" fill="#ffc53d" fillOpacity="0.55" />
                  <line x1="0" y1="0" x2="0" y2="6" stroke="#f5a70f" strokeWidth="2" />
                </pattern>
              </defs>

              {[0, 100, 200, 300, 400].map((v) => (
                <g key={v}>
                  <line x1={L} x2={W - R} y1={y(v)} y2={y(v)} stroke="#eef0f4" />
                  <text x={L - 8} y={y(v) + 4} textAnchor="end" className="fill-ink-400 text-[11px]">{v}</text>
                </g>
              ))}
              <text x={4} y={T + 2} className="fill-ink-400 text-[10px]">kW</text>
              {[0, 3, 6, 9, 12, 15, 18, 21, 24].map((h) => (
                <text key={h} x={L + ((W - L - R) * h) / 24} y={H - 8} textAnchor="middle" className="fill-ink-400 text-[11px]">{`${String(h).padStart(2, "0")}h`}</text>
              ))}

              {/* Netzbezug als Fläche */}
              <path d={`${pfad(netz)} L${x(95)},${y(0)} L${x(0)},${y(0)} Z`} fill="url(#lk-flaeche)" />
              {/* vom Speicher gedeckter Anteil */}
              <path
                d={`${pfad(LAST)} ${netz.map((v, i) => `L${x(95 - i).toFixed(1)},${y(netz[95 - i]).toFixed(1)}`).join(" ")} Z`}
                fill="url(#lk-schraffur)"
                opacity={grenze < SPITZE - 1 ? 1 : 0}
                style={{ transition: "opacity 400ms" }}
              />
              {/* ursprüngliche Last (gestrichelt, wenn gekappt) */}
              <path d={pfad(LAST)} fill="none" stroke="#97a0b0" strokeWidth="1.5" strokeDasharray="4 4" opacity={grenze < SPITZE - 1 ? 1 : 0} />
              {/* Netzbezug */}
              <path
                d={pfad(netz)}
                fill="none"
                stroke="#03122b"
                strokeWidth="2.4"
                strokeLinejoin="round"
                pathLength="1"
                strokeDasharray="1"
                strokeDashoffset={gezeichnet ? 0 : 1}
                className="motion-safe:transition-[stroke-dashoffset] motion-safe:duration-[1800ms] motion-safe:ease-out"
              />

              {/* Zielwert-Linie */}
              {grenze < SPITZE - 1 && (
                <g>
                  <line x1={L} x2={W - R} y1={y(grenze)} y2={y(grenze)} stroke="#669933" strokeWidth="1.6" strokeDasharray="6 5" />
                  <rect x={W - R - 128} y={y(grenze) - 26} width="124" height="21" rx="10.5" fill="#669933" />
                  <text x={W - R - 66} y={y(grenze) - 11.5} textAnchor="middle" className="fill-white text-[11.5px] font-semibold">
                    {`Zielwert ${fmt(Math.round(grenze))} kW`}
                  </text>
                </g>
              )}

              {/* Monatsspitze */}
              <g opacity={grenze >= SPITZE - 1 ? 1 : 0.35} style={{ transition: "opacity 400ms" }}>
                <circle cx={x(spitzeIndex)} cy={y(SPITZE)} r="5" fill="#f5a70f" stroke="#fff" strokeWidth="2" />
                <text x={x(spitzeIndex) + 10} y={y(SPITZE) + 4} className="fill-ink-800 text-[11.5px] font-semibold">{`Monatsspitze ${SPITZE} kW`}</text>
              </g>

              {aktiv && (
                <g pointerEvents="none">
                  <line x1={x(aktiv.i)} x2={x(aktiv.i)} y1={T} y2={H - B} stroke="#151a24" strokeOpacity="0.25" />
                  <circle cx={x(aktiv.i)} cy={y(aktiv.netz)} r="4" fill="#03122b" />
                </g>
              )}
            </svg>
          </div>

          {aktiv && (
            <div className={cn("pointer-events-none absolute top-6 rounded-xl bg-ink-900 px-4 py-3 text-[12.5px] text-white shadow-xl", aktiv.i < 48 ? "right-8" : "left-16")}>
              <p className="font-semibold">{uhr(aktiv.i)} Uhr</p>
              <p className="mt-1 text-white/70">Last <span className="ov-num text-white">{fmt(aktiv.last)} kW</span></p>
              <p className="text-white/70">Netzbezug <span className="ov-num text-white">{fmt(Math.round(aktiv.netz))} kW</span></p>
              {aktiv.last - aktiv.netz > 1 && <p className="text-sun-300">Speicher <span className="ov-num">{fmt(Math.round(aktiv.last - aktiv.netz))} kW</span></p>}
            </div>
          )}

          <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-2 px-2 text-[13px] text-ink-600">
            <li className="flex items-center gap-2"><span className="h-0.5 w-5 bg-navy-950" />Netzbezug</li>
            <li className="flex items-center gap-2"><span className="h-0 w-5 border-t-2 border-dashed border-ink-400" />Last ohne Speicher</li>
            <li className="flex items-center gap-2"><span className="h-3 w-3 rounded-[3px] bg-sun-400" />vom Speicher gedeckt</li>
          </ul>

          <div className="mt-6 grid gap-6 px-2 md:grid-cols-2">
            <div className={cn("transition-opacity duration-300", !mit && "pointer-events-none opacity-40")}>
              <Regler label="Zielwert Netzbezug" wert={ziel} min={260} max={410} step={10} einheit="kW" onChange={(v) => { setZiel(v); setMit(true); }} />
            </div>
            <div>
              <label htmlFor={selectId} className="mb-3 block text-[14.5px] font-semibold text-ink-800">Netzbereich (Netzebene 6)</label>
              <select
                id={selectId}
                value={bereich}
                onChange={(e) => setBereich(e.target.value)}
                className="h-12 w-full cursor-pointer rounded-2xl bg-ink-50 px-4 text-[15px] font-medium text-ink-900 ring-1 ring-ink-200 focus:outline-none focus:ring-2 focus:ring-ov-500"
              >
                {netzbereiche.map((n) => (
                  <option key={n.name} value={n.name}>{`${n.name} – ${fmt(n.lp, 2)} €/kW`}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-px border-t border-ink-100 bg-ink-100 lg:grid-cols-1 lg:border-l lg:border-t-0">
          <Kachel icon={TrendingDown} label="Einsparung Leistungspreis" gross>
            <Zahl wert={ergebnis.einsparung} prefix="≈ " suffix=" €/Jahr" />
          </Kachel>
          <Kachel icon={Gauge} label="Monatsspitze gesenkt um">
            <Zahl wert={ergebnis.reduktion} suffix=" kW" />
          </Kachel>
          <Kachel icon={Zap} label="Energie über Zielwert">
            <Zahl wert={ergebnis.energie} suffix=" kWh" />
          </Kachel>
          <Kachel icon={BatteryCharging} label="Nutzbare Kapazität, mind.">
            <Zahl wert={ergebnis.kapazitaet} suffix=" kWh" />
          </Kachel>
        </div>
      </div>

      <div className="flex flex-col gap-4 border-t border-ink-100 bg-sand-50 px-6 py-5 md:flex-row md:items-center md:justify-between md:px-8">
        <p className="max-w-2xl text-[12.5px] leading-relaxed text-ink-500">
          Schematischer Beispiel-Lastgang, keine Messung. Einsparung = Senkung der Monatsspitze × Leistungspreis, wenn der Zielwert in allen
          zwölf Monaten gehalten wird (§ 52 ElWOG 2010: Mittel der Monatsspitzen). Kapazität bei 90 % nutzbarer Entladetiefe, ohne Reserve.
          {ergebnis.laengste >= 3 && mit && " Hinweis: Der Speicher müsste hier über Stunden entladen – so tiefe Zielwerte sind selten wirtschaftlich."}
        </p>
        <Button href="/rechner/peak-shaving" variant="navy" size="md" icon={ArrowRight} className="shrink-0">
          Mit eigenem Lastgang rechnen
        </Button>
      </div>
    </div>
  );
}

function Kachel({ icon: Icon, label, children, gross }) {
  return (
    <div className="bg-white p-5 md:p-6">
      <p className="flex items-center gap-2 text-[13px] text-ink-500">
        <Icon aria-hidden="true" className="h-4 w-4 text-ov-600" />
        {label}
      </p>
      <p className={cn("mt-2 font-display font-extrabold tracking-tight", gross ? "text-[26px] text-ov-700 md:text-[30px]" : "text-[21px] text-ink-900")}>{children}</p>
    </div>
  );
}
