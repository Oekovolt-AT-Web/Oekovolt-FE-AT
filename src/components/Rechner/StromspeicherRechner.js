"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { BatteryCharging, CarFront, House, PiggyBank, Sparkles, Sun, Thermometer, Timer } from "lucide-react";
import Button from "@/components/ui/Button";
import { cn } from "@/components/ui/cn";
import { Auswahl, Gruppe, Kennzahl, Regler, Schalter, Tooltip, Zahl, useBreite } from "./bausteine";
import { speicherErgebnis, speicherKurve, speicherReihen } from "@/lib/rechner/stromspeicher";
import { SPEICHER, fmt, fmtEur } from "@/lib/rechner/annahmen";
import { angebotUrl } from "@/lib/rechner/angebot";
import useRechnerErgebnis from "@/lib/useRechnerErgebnis";

const FARBE = { autarkie: "#669933", eigen: "#4a7cbd", optimum: "#f5a70f", raster: "#eef0f4", text: "#97a0b0" };
const pct = (v) => Math.round(v * 100);

export default function StromspeicherRechner() {
  const [verbrauch, setVerbrauch] = useState(4500);
  const [kwp, setKwp] = useState(10);
  const [speicher, setSpeicher] = useState(8);
  const [nachruesten, setNachruesten] = useState("neu");
  const [eAuto, setEAuto] = useState(false);
  const [km, setKm] = useState(15000);
  const [wp, setWp] = useState(false);

  // Ergebnis sofort (eine Jahressimulation), die Kurve über alle 21 Größen
  // kurz verzögert – so bleibt das Ziehen am Regler flüssig.
  const basis = useMemo(() => speicherReihen({ verbrauch, kwp, eAuto, km, waermepumpe: wp }), [verbrauch, kwp, eAuto, km, wp]);
  const r = useMemo(() => speicherErgebnis(basis, { kwp, speicher, nachruesten: nachruesten === "nach" }), [basis, kwp, speicher, nachruesten]);
  const [kurve, setKurve] = useState(() => speicherKurve(basis, { kwp, nachruesten: false }));
  const ersterLauf = useRef(true);
  useEffect(() => {
    if (ersterLauf.current) {
      ersterLauf.current = false;
      return;
    }
    const t = setTimeout(() => setKurve(speicherKurve(basis, { kwp, nachruesten: nachruesten === "nach" })), 120);
    return () => clearTimeout(t);
  }, [basis, kwp, nachruesten]);

  const opt = kurve.optimum;
  const href = angebotUrl({ kwp, verbrauch, speicher, wallbox: eAuto, waermepumpe: wp });
  const plusAutarkie = pct(r.mit.autarkie) - pct(r.ohne.autarkie);
  useRechnerErgebnis("stromspeicher", r);

  return (
    <div className="overflow-clip rounded-[2rem] bg-white shadow-[0_40px_80px_-40px_rgba(3,18,43,0.45)] ring-1 ring-ink-200/70">
      <div className="grid lg:grid-cols-[minmax(0,410px)_1fr]">
        {/* ---------------- Eingaben ---------------- */}
        <div className="relative border-b border-ink-100 bg-sand-50 p-5 sm:p-6 md:p-8 lg:border-b-0 lg:border-r">
          <MobilKurz
            werte={[
              ["Autarkie", <Zahl key="a" wert={pct(r.mit.autarkie)} suffix=" %" />],
              ["Ersparnis/Jahr", <Zahl key="e" wert={Math.round(r.ersparnis)} suffix=" €" />],
              ["Amortisation", r.amortisation ? <Zahl key="m" wert={r.amortisation} stellen={1} suffix=" J." /> : "–"],
            ]}
          />

          <div className="space-y-8">
            <Gruppe titel="Haushalt & Anlage">
              <Regler
                label="Jahresstromverbrauch"
                wert={verbrauch}
                min={1500}
                max={10000}
                step={100}
                einheit="kWh"
                onChange={setVerbrauch}
                hinweis="Ohne E-Auto und Wärmepumpe – steht auf Ihrer Stromrechnung."
              />
              <Regler label="PV-Anlage" wert={kwp} min={3} max={30} step={0.5} stellen={kwp % 1 ? 1 : 0} einheit="kWp" onChange={setKwp} minLabel="3 kWp" maxLabel="30 kWp" />
            </Gruppe>

            <Gruppe titel="Speicher">
              <Regler
                label="Speichergröße"
                wert={speicher}
                min={0}
                max={SPEICHER.maxKwh}
                step={1}
                format={(v) => (v === 0 ? "ohne" : `${v} kWh`)}
                minLabel="0"
                maxLabel={`${SPEICHER.maxKwh} kWh`}
                onChange={setSpeicher}
              />
              {opt ? (
                <div className="flex items-center justify-between gap-3 rounded-2xl bg-white px-4 py-3 ring-1 ring-sun-300/70">
                  <p className="flex items-center gap-2 text-[13.5px] leading-snug text-ink-700">
                    <Sparkles aria-hidden="true" className="h-4 w-4 shrink-0 text-sun-500" />
                    <span>
                      Wirtschaftliches Optimum: <strong className="text-ink-900">{opt.kap} kWh</strong>
                    </span>
                  </p>
                  {opt.kap !== speicher && (
                    <button
                      type="button"
                      onClick={() => setSpeicher(opt.kap)}
                      className="h-9 shrink-0 rounded-full bg-ink-900 px-3.5 text-[13px] font-semibold text-white transition-colors hover:bg-ov-600"
                    >
                      Übernehmen
                    </button>
                  )}
                </div>
              ) : (
                <p className="rounded-2xl bg-white px-4 py-3 text-[13.5px] leading-snug text-ink-600 ring-1 ring-ink-200">
                  Bei diesen Werten rechnet sich ein Speicher innerhalb von {SPEICHER.lebensdauerJahre} Jahren kaum – mehr Verbrauch oder eine größere Anlage ändern das.
                </p>
              )}
              <Auswahl
                legende="Installation"
                wert={nachruesten}
                onChange={setNachruesten}
                optionen={[
                  { id: "neu", label: "Mit neuer PV" },
                  { id: "nach", label: "Nachrüsten" },
                ]}
              />
            </Gruppe>

            <Gruppe titel="Große Verbraucher">
              <Schalter icon={CarFront} label="E-Auto" beschreibung="Lädt überwiegend zu Hause" an={eAuto} onChange={setEAuto}>
                <Regler label="Fahrleistung" wert={km} min={5000} max={40000} step={1000} format={(v) => `${fmt(v)} km`} onChange={setKm} hinweis={`≈ ${fmt(basis.eAutoKwh || (km * SPEICHER.eAutoVerbrauch * SPEICHER.eAutoLadeanteilZuhause) / 100)} kWh Ladestrom zu Hause pro Jahr`} />
              </Schalter>
              <Schalter icon={Thermometer} label="Wärmepumpe" beschreibung={`≈ ${fmt(SPEICHER.wpStromKwh)} kWh Strom pro Jahr`} an={wp} onChange={setWp} />
            </Gruppe>
          </div>
        </div>

        {/* ---------------- Ergebnis ---------------- */}
        <div className="p-5 sm:p-6 md:p-8">
          <p className="sr-only" aria-live="polite">
            {`Autarkie ${pct(r.mit.autarkie)} Prozent, Ersparnis ${Math.round(r.ersparnis)} Euro pro Jahr${r.amortisation ? `, Amortisation ${fmt(r.amortisation, 1)} Jahre` : ""}`}
          </p>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="font-display text-[22px] font-extrabold tracking-tight text-ink-900 md:text-[26px]">Ihr Ergebnis</h2>
            <span className="inline-flex items-center gap-2 rounded-full bg-ov-50 px-3 py-1 text-[12.5px] font-semibold text-ov-700 ring-1 ring-ov-200">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-ov-500 motion-reduce:animate-none" aria-hidden="true" />
              8.760 Stunden simuliert
            </span>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-3 xl:grid-cols-4">
            <Kennzahl ton="navy" icon={House} label="Autarkie" zusatz={speicher > 0 ? `+${plusAutarkie} Prozentpunkte durch Speicher` : "ohne Speicher"}>
              <Zahl wert={pct(r.mit.autarkie)} suffix=" %" />
            </Kennzahl>
            <Kennzahl icon={Sun} label="Eigenverbrauch" zusatz={`ohne Speicher ${pct(r.ohne.eigenverbrauchsquote)} %`}>
              <Zahl wert={pct(r.mit.eigenverbrauchsquote)} suffix=" %" />
            </Kennzahl>
            <Kennzahl ton="gruen" icon={PiggyBank} label="Ersparnis/Jahr" zusatz="durch den Speicher">
              <Zahl wert={Math.round(r.ersparnis)} suffix=" €" />
            </Kennzahl>
            <Kennzahl icon={Timer} label="Amortisation" zusatz={speicher > 0 ? `Mehrkosten ≈ ${fmtEur(r.kosten)}` : "Speicher wählen"}>
              {r.amortisation ? <Zahl wert={r.amortisation} stellen={1} suffix=" Jahre" /> : "–"}
            </Kennzahl>
          </div>

          <Vergleich r={r} speicher={speicher} />

          <div className="mt-7 rounded-3xl ring-1 ring-ink-200/70">
            <div className="flex flex-wrap items-baseline justify-between gap-2 px-5 pt-5 md:px-6">
              <h3 className="font-display text-[17px] font-bold text-ink-900">Autarkie nach Speichergröße</h3>
              <p className="text-[12.5px] text-ink-500">Tippen oder klicken, um eine Größe zu wählen</p>
            </div>
            <SpeicherKurve kurve={kurve} speicher={speicher} onWahl={setSpeicher} />
          </div>

          {speicher > 0 && r.amortisation && !r.lohntSich && (
            <p className="mt-4 rounded-2xl bg-sun-300/20 px-4 py-3 text-[13.5px] leading-relaxed text-ink-700 ring-1 ring-sun-400/40">
              Mit {speicher} kWh amortisiert sich der Speicher erst nach mehr als {SPEICHER.lebensdauerJahre} Jahren.
              {opt ? ` ${opt.kap} kWh sind bei Ihren Werten wirtschaftlicher.` : ""}
            </p>
          )}

          <div className="mt-7 flex flex-col gap-3 border-t border-ink-100 pt-6 sm:flex-row sm:items-center sm:justify-between">
            <p className="max-w-md text-[13px] leading-relaxed text-ink-500">
              Orientierung auf Basis einer stündlichen Jahressimulation – kein Angebot. Wir rechnen gern mit Ihrem echten Lastgang.
            </p>
            <Button href={href} size="lg" pfeil className="shrink-0">
              Angebot mit diesen Werten
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

/** Kompakte, mitlaufende Ergebniszeile auf dem Handy */
export function MobilKurz({ werte }) {
  return (
    <div className="sticky top-[76px] z-20 -mx-5 -mt-5 mb-6 border-b border-white/10 bg-navy-950/95 px-5 py-3 text-white backdrop-blur sm:-mx-6 sm:-mt-6 sm:px-6 lg:hidden">
      <dl className="grid grid-cols-3 gap-2">
        {werte.map(([k, v]) => (
          <div key={k} className="min-w-0">
            <dt className="truncate text-[11px] text-white/60">{k}</dt>
            <dd className="font-display text-[17px] font-extrabold leading-tight tracking-tight">{v}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

function Balken({ label, ohne, mit, speicher }) {
  return (
    <div>
      <div className="mb-2 flex items-baseline justify-between gap-3 text-[13.5px]">
        <span className="font-semibold text-ink-800">{label}</span>
        <span className="ov-num text-ink-600">
          {pct(ohne)} % <span aria-hidden="true">→</span> <strong className="text-ink-900">{pct(mit)} %</strong>
        </span>
      </div>
      <div className="relative h-3 overflow-hidden rounded-full bg-ink-100" role="img" aria-label={`${label}: ohne Speicher ${pct(ohne)} Prozent, mit ${speicher} kWh ${pct(mit)} Prozent`}>
        <div className="absolute inset-y-0 left-0 rounded-full bg-ov-500 motion-safe:transition-[width] motion-safe:duration-500" style={{ width: `${pct(mit)}%` }} />
        <div className="absolute inset-y-0 left-0 rounded-full bg-ov-200 motion-safe:transition-[width] motion-safe:duration-500" style={{ width: `${pct(ohne)}%` }} />
      </div>
    </div>
  );
}

function Vergleich({ r, speicher }) {
  return (
    <div className="mt-5 grid gap-4 rounded-3xl bg-ink-50 p-5 md:grid-cols-2 md:gap-8 md:p-6">
      <Balken label="Autarkie" ohne={r.ohne.autarkie} mit={r.mit.autarkie} speicher={speicher} />
      <Balken label="Eigenverbrauchsquote" ohne={r.ohne.eigenverbrauchsquote} mit={r.mit.eigenverbrauchsquote} speicher={speicher} />
      <div className="flex flex-wrap gap-x-5 gap-y-1 text-[12.5px] text-ink-600 md:col-span-2">
        <span className="inline-flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-ov-200" aria-hidden="true" />Ohne Speicher</span>
        <span className="inline-flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-ov-500" aria-hidden="true" />{speicher > 0 ? `Mit ${speicher} kWh` : "Mit Speicher"}</span>
        <span className="ov-num">Netzbezug {fmt(r.ohne.netz)} → {fmt(r.mit.netz)} kWh/Jahr</span>
      </div>
    </div>
  );
}

function SpeicherKurve({ kurve, speicher, onWahl }) {
  const [ref, W] = useBreite(720);
  const [hover, setHover] = useState(null);
  const schmal = W < 520;
  const H = schmal ? 250 : 300;
  const P = { l: 44, r: schmal ? 14 : 22, t: 34, b: 38 };
  const max = SPEICHER.maxKwh;
  // Auf 0,1 px runden: Server und Browser rechnen Gleitkommazahlen minimal anders
  const x = (k) => Math.round((P.l + (k / max) * (W - P.l - P.r)) * 10) / 10;
  const y = (v) => Math.round((P.t + (1 - v) * (H - P.t - P.b)) * 10) / 10;
  const punkte = kurve.punkte;
  const pfad = (key) => punkte.map((p, i) => `${i ? "L" : "M"}${x(p.kap).toFixed(1)},${y(p[key]).toFixed(1)}`).join(" ");
  const flaeche = `${pfad("autarkie")} L${x(max)},${y(0)} L${x(0)},${y(0)} Z`;
  const lohnend = punkte.filter((p) => p.kap > 0 && p.ueberschuss > 0);
  const opt = kurve.optimum;
  const aktiv = hover != null ? punkte[hover] : null;
  const sel = punkte[speicher];

  const ausZeiger = (e) => {
    const box = e.currentTarget.getBoundingClientRect();
    const px = ((e.clientX - box.left) / box.width) * W;
    return Math.max(0, Math.min(max, Math.round(((px - P.l) / (W - P.l - P.r)) * max)));
  };

  return (
    <div ref={ref} className="relative px-2 pb-4 md:px-3">
      <svg
        width="100%"
        height={H}
        viewBox={`0 0 ${W} ${H}`}
        className="block touch-pan-y select-none"
        role="img"
        aria-label={`Diagramm: Autarkie steigt von ${pct(punkte[0].autarkie)} Prozent ohne Speicher auf ${pct(punkte[max].autarkie)} Prozent bei ${max} kWh.${opt ? ` Wirtschaftliches Optimum bei ${opt.kap} kWh.` : ""}`}
      >
        <defs>
          <linearGradient id="ov-speicher-flaeche" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor={FARBE.autarkie} stopOpacity="0.16" />
            <stop offset="100%" stopColor={FARBE.autarkie} stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Wirtschaftlicher Bereich */}
        {lohnend.length > 0 && (
          <g>
            <rect x={x(lohnend[0].kap) - 6} y={P.t} width={x(lohnend[lohnend.length - 1].kap) - x(lohnend[0].kap) + 12} height={H - P.t - P.b} fill="#f4f9ee" rx="8" />
            <text x={x(lohnend[0].kap)} y={P.t - 10} className="fill-ov-700 text-[11px] font-semibold">
              {schmal ? "rechnet sich" : `rechnet sich in ${SPEICHER.lebensdauerJahre} Jahren`}
            </text>
          </g>
        )}

        {[0, 0.25, 0.5, 0.75, 1].map((v) => (
          <g key={v}>
            <line x1={P.l} x2={W - P.r} y1={y(v)} y2={y(v)} stroke={FARBE.raster} />
            <text x={P.l - 8} y={y(v) + 4} textAnchor="end" className="fill-ink-500 text-[11px]">{`${v * 100} %`}</text>
          </g>
        ))}
        {[0, 5, 10, 15, 20].map((k) => (
          <text key={k} x={x(k)} y={H - P.b + 20} textAnchor={k === max ? "end" : "middle"} className="fill-ink-500 text-[11px]">
            {k === max ? `${k} kWh` : k}
          </text>
        ))}

        <path d={flaeche} fill="url(#ov-speicher-flaeche)" className="motion-safe:transition-all motion-safe:duration-500" />
        <path d={pfad("eigenverbrauchsquote")} fill="none" stroke={FARBE.eigen} strokeWidth="1.75" strokeDasharray="5 5" className="motion-safe:transition-all motion-safe:duration-500" />
        <path d={pfad("autarkie")} fill="none" stroke={FARBE.autarkie} strokeWidth="2.5" strokeLinejoin="round" className="motion-safe:transition-all motion-safe:duration-500" />

        {/* Optimum */}
        {opt && (
          <g>
            <line x1={x(opt.kap)} x2={x(opt.kap)} y1={y(opt.autarkie)} y2={H - P.b} stroke={FARBE.optimum} strokeWidth="1.5" strokeDasharray="3 4" />
            <circle cx={x(opt.kap)} cy={y(opt.autarkie)} r="6" fill="#fff" stroke={FARBE.optimum} strokeWidth="2.5" />
          </g>
        )}

        {/* Auswahl */}
        {sel && (
          <g className="motion-safe:transition-transform motion-safe:duration-300">
            <line x1={x(sel.kap)} x2={x(sel.kap)} y1={P.t} y2={H - P.b} stroke="#151a24" strokeWidth="1" />
            <circle cx={x(sel.kap)} cy={y(sel.eigenverbrauchsquote)} r="4" fill={FARBE.eigen} stroke="#fff" strokeWidth="2" />
            <circle cx={x(sel.kap)} cy={y(sel.autarkie)} r="5.5" fill={FARBE.autarkie} stroke="#fff" strokeWidth="2.5" />
          </g>
        )}

        {aktiv && aktiv.kap !== speicher && (
          <g pointerEvents="none">
            <line x1={x(aktiv.kap)} x2={x(aktiv.kap)} y1={P.t} y2={H - P.b} stroke="#97a0b0" strokeDasharray="2 3" />
            <circle cx={x(aktiv.kap)} cy={y(aktiv.autarkie)} r="4.5" fill="#fff" stroke={FARBE.autarkie} strokeWidth="2" />
          </g>
        )}

        {/* Interaktionsfläche */}
        <rect
          x={0}
          y={0}
          width={W}
          height={H}
          fill="transparent"
          className="cursor-pointer"
          onPointerMove={(e) => setHover(ausZeiger(e))}
          onPointerLeave={() => setHover(null)}
          onClick={(e) => onWahl(ausZeiger(e))}
        />
      </svg>

      {aktiv && (
        <Tooltip x={x(aktiv.kap) + 8} y={Math.max(y(aktiv.autarkie) - 70, 0)} breite={W}>
          <p className="font-semibold">{aktiv.kap === 0 ? "Ohne Speicher" : `${aktiv.kap} kWh Speicher`}{opt && aktiv.kap === opt.kap ? " · Optimum" : ""}</p>
          <p className="text-white/70">Autarkie <span className="ov-num font-semibold text-white">{pct(aktiv.autarkie)} %</span></p>
          <p className="text-white/70">Eigenverbrauch <span className="ov-num font-semibold text-white">{pct(aktiv.eigenverbrauchsquote)} %</span></p>
          {aktiv.kap > 0 && (
            <>
              <p className="text-white/70">Ersparnis <span className="ov-num font-semibold text-white">{fmtEur(aktiv.ersparnis)}/Jahr</span></p>
              <p className="text-white/70">
                Bilanz {SPEICHER.lebensdauerJahre} J.{" "}
                <span className={cn("ov-num font-semibold", aktiv.ueberschuss >= 0 ? "text-ov-300" : "text-sun-300")}>
                  {aktiv.ueberschuss >= 0 ? "+" : "−"}
                  {fmtEur(Math.abs(aktiv.ueberschuss))}
                </span>
              </p>
            </>
          )}
        </Tooltip>
      )}

      <ul className="mt-1 flex flex-wrap gap-x-5 gap-y-2 px-3 text-[12.5px] text-ink-600">
        <li className="flex items-center gap-2"><span className="h-[3px] w-5 rounded-full bg-ov-500" aria-hidden="true" />Autarkie</li>
        <li className="flex items-center gap-2"><span className="w-5 border-t-2 border-dashed border-navy-400" aria-hidden="true" />Eigenverbrauchsquote</li>
        <li className="flex items-center gap-2"><span className="h-3 w-3 rounded-full border-[2.5px] border-sun-500 bg-white" aria-hidden="true" />Wirtschaftliches Optimum</li>
        <li className="flex items-center gap-2"><span className="h-3 w-4 rounded-[3px] bg-ov-50 ring-1 ring-ov-100" aria-hidden="true" />Überschuss nach {SPEICHER.lebensdauerJahre} Jahren</li>
      </ul>
    </div>
  );
}
