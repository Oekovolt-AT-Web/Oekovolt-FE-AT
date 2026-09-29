"use client";

import { useId, useMemo, useState } from "react";
import { Ban, Handshake, Info, Receipt, Sun, TrendingUp } from "lucide-react";
import { cn } from "@/components/ui/cn";
import { LiveDot } from "@/components/ui/LiveTicker";
import useLiveDaten, { useBreite } from "@/components/EnergieLive/useLiveDaten";
import { preisTage, ct, uhr, zahl, tagLang } from "@/components/EnergieLive/berechnung";

/**
 * Erlösvergleich OeMAG-Marktpreis / Direktvermarkter / PPA – gerechnet mit den
 * Day-Ahead-Preisen der Gebotszone AT von heute (live) und einem idealisierten
 * Sonnentag. Illustration, keine Erlösprognose; Entgelt und PPA-Preis sind
 * einstellbare Beispielwerte.
 */

const OPTIONEN = [
  { k: "oemag", name: "OeMAG-Marktpreis", kurz: "OeMAG", icon: Receipt, farbe: "#1f5aa1" },
  { k: "dv", name: "Direktvermarkter", kurz: "Direktverm.", icon: TrendingUp, farbe: "#558227" },
  { k: "ppa", name: "PPA (Fixpreis)", kurz: "PPA", icon: Handshake, farbe: "#f5a70f" },
];

const UHR = new Intl.DateTimeFormat("de-DE", { hour: "2-digit", minute: "2-digit", hourCycle: "h23", timeZone: "Europe/Vienna" });

// Idealisiertes PV-Profil nach Jahreszeit (kW je kWp)
function pvProfil(t, jetzt) {
  const d = new Date(jetzt);
  const start = Date.UTC(d.getUTCFullYear(), 0, 1);
  const tag = (jetzt - start) / 86400000;
  const saison = Math.sin((2 * Math.PI * (tag - 80)) / 365); // −1 Winter … +1 Sommer
  const laenge = 12 + 3.9 * saison; // Stunden Tageslicht (Mitteleuropa, vereinfacht)
  const spitze = 0.6 + 0.15 * saison;
  const [std, min] = UHR.format(new Date(t)).split(":").map(Number);
  const h = std + min / 60 + 0.125; // Intervallmitte
  const mitte = 12.9;
  const x = (h - (mitte - laenge / 2)) / laenge;
  if (x <= 0 || x >= 1) return 0;
  return spitze * Math.pow(Math.sin(Math.PI * x), 1.5);
}

export default function ErloesVergleich({ initial }) {
  const id = useId();
  const { daten, jetzt, live } = useLiveDaten(initial);
  const tage = useMemo(() => preisTage(daten.preis, jetzt), [daten.preis, jetzt]);
  const [wahl, setWahl] = useState("dv");
  const [kwp, setKwp] = useState(500);
  const [entgelt, setEntgelt] = useState(0.4);
  const [ppa, setPpa] = useState(7);
  const [ref, breite] = useBreite(900);

  const tag = tage.heute || tage.morgen;
  const s = tage.schrittMs;

  const r = useMemo(() => {
    if (!tag) return null;
    const h = s / 3600000;
    let kwh = 0;
    let gewichtet = 0;
    let oemag = 0;
    let dv = 0;
    let ppaE = 0;
    let abgeregelt = 0;
    const reihe = tag.punkte.map((p) => {
      const kw = kwp * pvProfil(p.t, jetzt);
      const e = kw * h;
      kwh += e;
      gewichtet += e * p.eurMwh;
      const eurKwh = p.eurMwh / 1000;
      const dvE = p.eurMwh < 0 ? 0 : e * (eurKwh - entgelt / 100);
      if (p.eurMwh < 0) abgeregelt += e;
      dv += dvE;
      ppaE += e * (ppa / 100);
      return { t: p.t, preis: p.eurMwh, kw };
    });
    const solarwert = kwh > 0 ? gewichtet / kwh : 0;
    // OeMAG vereinfacht: mit der eigenen Erzeugung mengengewichteter Tagespreis (Solarwert)
    oemag = kwh * (solarwert / 1000);
    return { reihe, kwh, solarwert, oemag, dv, ppa: ppaE, abgeregelt };
  }, [tag, kwp, entgelt, ppa, jetzt, s]);

  if (!tag || !r) {
    return (
      <div className="rounded-[2rem] bg-white p-10 text-center text-ink-600 shadow-xl">
        Die Börsenpreise sind gerade nicht abrufbar. Der Erlösvergleich erscheint automatisch, sobald die Daten wieder verfügbar sind.
      </div>
    );
  }

  const werte = { oemag: r.oemag, dv: r.dv, ppa: r.ppa };
  const maxErloes = Math.max(...Object.values(werte), 1);
  const gewaehlt = OPTIONEN.find((o) => o.k === wahl);

  // Diagramm
  const schmal = breite < 640;
  const H = schmal ? 220 : 280;
  const PAD = { l: schmal ? 34 : 44, r: schmal ? 34 : 50, t: 16, b: 26 };
  const plotW = Math.max(breite - PAD.l - PAD.r, 60);
  const plotH = H - PAD.t - PAD.b;
  const preise = tag.punkte.map((p) => p.eurMwh / 10);
  const lo = Math.min(0, ...preise, wahl === "ppa" ? ppa : 0);
  const hi = Math.max(...preise, wahl === "ppa" ? ppa : 0, 1);
  const x = (t) => PAD.l + ((t - tag.start) / (tag.ende - tag.start)) * plotW;
  const y = (v) => PAD.t + (1 - (v - lo) / (hi - lo)) * plotH;
  const kwMax = Math.max(...r.reihe.map((q) => q.kw), 1);
  const yKw = (kw) => PAD.t + plotH - (kw / kwMax) * plotH * 0.92;
  let linie = "";
  tag.punkte.forEach((p, i) => {
    const yy = y(p.eurMwh / 10).toFixed(1);
    linie += i === 0 ? `M${x(p.t).toFixed(1)},${yy}` : `V${yy}`;
    linie += `H${x(p.t + s).toFixed(1)}`;
  });
  let pvFl = `M${x(tag.start).toFixed(1)},${(PAD.t + plotH).toFixed(1)}`;
  r.reihe.forEach((q) => {
    pvFl += `L${x(q.t + s / 2).toFixed(1)},${yKw(q.kw).toFixed(1)}`;
  });
  pvFl += `L${x(tag.ende).toFixed(1)},${(PAD.t + plotH).toFixed(1)}Z`;
  const y0 = y(0);
  const negBaender = tag.punkte.filter((p) => p.eurMwh < 0);
  const refLinie = wahl === "oemag" ? r.solarwert / 10 : wahl === "ppa" ? ppa : null;
  const xTicks = [];
  for (let t = tag.start; t <= tag.ende; t += (schmal ? 6 : 3) * 3600000) xTicks.push(t);

  return (
    <div className="overflow-hidden rounded-[2rem] bg-white text-ink-900 shadow-2xl ring-1 ring-white/10">
      <div className="flex flex-col gap-5 border-b border-ink-100 p-5 sm:p-7 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="flex items-center gap-2 text-[12.5px] font-semibold uppercase tracking-[0.16em] text-ov-600">
            {live && <LiveDot />}
            Erlösvergleich mit den Börsenpreisen {tag === tage.heute ? "von heute" : "von morgen"}
          </p>
          <h3 className="ov-h3 mt-1.5 text-ink-900">Was bringt Ihr Überschuss an einem Sonnentag?</h3>
        </div>
        <div role="group" aria-label="Vermarktungsweg wählen" className="grid grid-cols-3 gap-1 rounded-full bg-ink-100 p-1">
          {OPTIONEN.map((o) => (
            <button
              key={o.k}
              type="button"
              aria-pressed={wahl === o.k}
              onClick={() => setWahl(o.k)}
              className={cn(
                "h-11 rounded-full px-2.5 text-[13px] font-semibold transition-all duration-300 sm:px-5 sm:text-[14px]",
                wahl === o.k ? "bg-navy-950 text-white shadow-md" : "text-ink-600 hover:text-ink-900"
              )}
            >
              <span className="sm:hidden">{o.kurz}</span>
              <span className="hidden sm:inline">{o.name}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
        <div className="min-w-0 p-4 sm:p-7">
          <div ref={ref} className="relative">
            <svg width={breite} height={H} viewBox={`0 0 ${breite} ${H}`} className="block max-w-full select-none" role="img" aria-label={`Börsenpreis ${tagLang(tag.start)} und idealisierte PV-Erzeugung von ${zahl(kwp, 0)} kWp`}>
              {/* Raster */}
              {[lo, (lo + hi) / 2, hi].map((v, i) => (
                <g key={i}>
                  <line x1={PAD.l} x2={PAD.l + plotW} y1={y(v)} y2={y(v)} stroke="#eef0f4" />
                  <text x={PAD.l - 6} y={y(v) + 4} textAnchor="end" fontSize="11" fill="#6b7486" className="ov-num">
                    {zahl(v, 0)}
                  </text>
                </g>
              ))}
              <text x={2} y={11} fontSize="10.5" fill="#6b7486">
                ct/kWh
              </text>
              <text x={breite - 2} y={11} fontSize="10.5" fill="#b37400" textAnchor="end">
                kW PV
              </text>
              {/* PV */}
              <path d={pvFl} fill="rgba(255,197,61,0.28)" stroke="#f5a70f" strokeWidth="1.5" />
              {/* negative Preise */}
              {negBaender.map((p) => (
                <rect key={p.t} x={x(p.t)} y={PAD.t} width={Math.max(x(p.t + s) - x(p.t), 1)} height={plotH} fill={wahl === "dv" ? "rgba(220,38,38,0.12)" : "rgba(220,38,38,0.06)"} />
              ))}
              {lo < 0 && <line x1={PAD.l} x2={PAD.l + plotW} y1={y0} y2={y0} stroke="#c4cad5" />}
              {/* Preis */}
              <path d={linie} fill="none" stroke="#1f5aa1" strokeWidth="2" strokeLinejoin="round" opacity={wahl === "dv" ? 1 : 0.45} />
              {refLinie != null && (
                <g>
                  <line x1={PAD.l} x2={PAD.l + plotW} y1={y(refLinie)} y2={y(refLinie)} stroke={gewaehlt.farbe} strokeWidth="2.5" strokeDasharray={wahl === "oemag" ? "6 4" : undefined} />
                  <text x={PAD.l + plotW - 4} y={y(refLinie) - 6} textAnchor="end" fontSize="11.5" fontWeight="700" fill="#151a24" paintOrder="stroke" stroke="#fff" strokeWidth="4">
                    {wahl === "oemag" ? `mengengewichtet ${ct(r.solarwert)} ct` : `PPA ${zahl(ppa)} ct`}
                  </text>
                </g>
              )}
              {xTicks.map((t) => (
                <text key={t} x={Math.min(Math.max(x(t), PAD.l + 14), PAD.l + plotW - 14)} y={H - 6} textAnchor="middle" fontSize="11" fill="#6b7486" className="ov-num">
                  {uhr(t) === "00:00" && t === tag.ende ? "24:00" : uhr(t)}
                </text>
              ))}
            </svg>
          </div>
          <ul className="mt-2 flex flex-wrap gap-x-5 gap-y-1.5 px-1 text-[12.5px] text-ink-600">
            <li className="flex items-center gap-2">
              <span aria-hidden="true" className="h-0.5 w-4 rounded bg-navy-500" />
              Day-Ahead AT
            </li>
            <li className="flex items-center gap-2">
              <span aria-hidden="true" className="h-3 w-3 rounded-sm bg-sun-400/50 ring-1 ring-sun-500" />
              PV-Erzeugung (idealisiert)
            </li>
            <li className="flex items-center gap-2">
              <span aria-hidden="true" className="h-3 w-3 rounded-sm bg-red-500/20" />
              Negativer Preis{wahl === "dv" ? " – Direktvermarkter regelt ab" : ""}
            </li>
          </ul>

          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            <Regler id={`${id}-kwp`} label="PV-Leistung" wert={kwp} anzeige={`${zahl(kwp, 0)} kWp`} min={20} max={3000} step={10} onChange={setKwp} />
            {wahl === "dv" && <Regler id={`${id}-e`} label="Vermarktungsentgelt (Beispiel)" wert={entgelt} anzeige={`${zahl(entgelt, 1)} ct/kWh`} min={0} max={1.5} step={0.1} onChange={setEntgelt} />}
            {wahl === "ppa" && <Regler id={`${id}-p`} label="PPA-Preis (Beispiel)" wert={ppa} anzeige={`${zahl(ppa, 1)} ct/kWh`} min={2} max={15} step={0.1} onChange={setPpa} />}
            {wahl === "oemag" && (
              <p className="self-center rounded-2xl bg-sand-50 p-3.5 text-[13px] leading-snug text-ink-600 ring-1 ring-ink-200/60">
                Für Anlagen unter 500 kWp. Preis monatlich rückwirkend aus mengengewichteten Day-Ahead-Preisen – hier vereinfacht als mit Ihrer Erzeugung gewichteter Tagespreis, ohne Abregelung.
              </p>
            )}
          </div>
        </div>

        <div className="flex min-w-0 flex-col gap-4 border-t border-ink-100 bg-sand-50 p-5 sm:p-7 lg:border-l lg:border-t-0" aria-live="polite">
          <p className="text-[12.5px] font-semibold uppercase tracking-[0.16em] text-ov-600">Erlös an diesem Tag (Beispiel)</p>
          <ul className="space-y-3">
            {OPTIONEN.map((o) => {
              const v = werte[o.k];
              const an = o.k === wahl;
              return (
                <li key={o.k}>
                  <button type="button" onClick={() => setWahl(o.k)} className={cn("w-full rounded-2xl p-4 text-left transition-all", an ? "bg-white shadow-lg ring-2 ring-navy-950" : "bg-white/60 ring-1 ring-ink-200/70 hover:bg-white")}>
                    <span className="flex items-center justify-between gap-3">
                      <span className="flex items-center gap-2 text-[14px] font-semibold text-ink-800">
                        <o.icon aria-hidden="true" className="h-4 w-4" style={{ color: o.farbe }} />
                        {o.name}
                      </span>
                      <span className="ov-num font-display text-[20px] font-extrabold tracking-tight text-ink-900">{zahl(Math.max(v, 0), 0)} €</span>
                    </span>
                    <span className="mt-2.5 block h-2 overflow-hidden rounded-full bg-ink-100">
                      <span className="block h-full rounded-full transition-[width] duration-500" style={{ width: `${Math.max((v / maxErloes) * 100, 2)}%`, background: o.farbe }} />
                    </span>
                    <span className="mt-1.5 block text-[12px] text-ink-500">{r.kwh > 0 ? `${ct((v / r.kwh) * 1000, 1)} ct/kWh im Schnitt` : "–"}</span>
                  </button>
                </li>
              );
            })}
          </ul>
          <dl className="grid grid-cols-2 gap-3">
            <div className="rounded-2xl bg-navy-950 p-4 text-white">
              <dt className="flex items-center gap-1.5 text-[12px] text-white/60">
                <Sun aria-hidden="true" className="h-3.5 w-3.5 text-sun-300" />
                Solarwert heute
              </dt>
              <dd className="ov-num mt-1 font-display text-[20px] font-extrabold">{ct(r.solarwert)} ct</dd>
              <dd className="text-[11.5px] text-white/50">Ø {ct(tag.avg)} ct Tagesmittel</dd>
            </div>
            <div className="rounded-2xl bg-white p-4 ring-1 ring-ink-200/70">
              <dt className="flex items-center gap-1.5 text-[12px] text-ink-500">
                <Ban aria-hidden="true" className="h-3.5 w-3.5 text-red-600" />
                Abgeregelt (DV)
              </dt>
              <dd className="ov-num mt-1 font-display text-[20px] font-extrabold text-ink-900">{zahl(r.abgeregelt / 1000, 1)} MWh</dd>
              <dd className="text-[11.5px] text-ink-500">von {zahl(r.kwh / 1000, 1)} MWh Erzeugung</dd>
            </div>
          </dl>
        </div>
      </div>

      <p className="flex gap-2 border-t border-ink-100 px-5 py-4 text-[12.5px] leading-relaxed text-ink-500 sm:px-7">
        <Info aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0" />
        <span>
          Illustration, keine Erlösprognose: Day-Ahead-Preise der Gebotszone AT ({tage.quelle || "Energy-Charts"}), idealisierte PV-Erzeugung eines wolkenlosen Tages zur aktuellen
          Jahreszeit, gesamte Erzeugung als Überschuss gerechnet. OeMAG vereinfacht als mit der Erzeugung gewichteter Tagespreis ohne Ober-/Untergrenze und Ausgleichsenergieabzug; Vermarktungsentgelt und PPA-Preis sind
          einstellbare Beispielwerte – echte Angebote vergleichen wir für Ihre Anlage.
        </span>
      </p>
    </div>
  );
}

function Regler({ id, label, wert, anzeige, min, max, step, onChange }) {
  const fill = ((wert - min) / (max - min)) * 100;
  return (
    <div>
      <div className="flex items-baseline justify-between gap-3">
        <label htmlFor={id} className="text-[13.5px] font-medium text-ink-700">
          {label}
        </label>
        <output htmlFor={id} className="ov-num font-display text-[16px] font-extrabold text-ink-900">
          {anzeige}
        </output>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={wert}
        onChange={(e) => onChange(Number(e.target.value))}
        className="ov-range mt-3 block cursor-pointer"
        style={{ "--ov-fill": `${fill}%` }}
      />
    </div>
  );
}
