"use client";

import { useMemo, useState } from "react";
import { BatteryCharging, Info, PiggyBank, Wallet } from "lucide-react";

/**
 * Finanzierungs-Mini-Rechner: Monatsrate (Annuitätendarlehen) im Vergleich
 * zur monatlichen Ersparnis durch Eigenverbrauch und Einspeisevergütung.
 * Bewusst einfache, offen gelegte Annahmen – Beispielrechnung, kein Kreditangebot.
 */

const ANNAHMEN = {
  ertragJeKwp: 1000, // kWh/kWp/Jahr – Allgäu/Südbayern, gut ausgerichtet
  strompreis: 0.36, // €/kWh brutto (Orientierung 2026)
  einspeisung: 0.077, // €/kWh – EEG-Satz Teileinspeisung bis 10 kWp ab 01.08.2026
  eigenOhne: 0.3, // Eigenverbrauchsanteil ohne Speicher
  eigenMit: 0.6, // mit Speicher
  autarkieOhne: 0.35, // max. Deckung des Verbrauchs ohne Speicher
  autarkieMit: 0.7,
};

const LAUFZEITEN = [5, 10, 15, 20];
const HORIZONT = 25;

const eur = (n, stellen = 0) =>
  n.toLocaleString("de-DE", { style: "currency", currency: "EUR", minimumFractionDigits: stellen, maximumFractionDigits: stellen });
const zahl = (n, s = 0) => n.toLocaleString("de-DE", { minimumFractionDigits: s, maximumFractionDigits: s });

function rate(betrag, zinsProzent, jahre) {
  const n = jahre * 12;
  const r = zinsProzent / 100 / 12;
  if (r === 0) return betrag / n;
  return (betrag * r) / (1 - Math.pow(1 + r, -n));
}

function Regler({ id, label, wert, anzeige, min, max, step, onChange, hinweis }) {
  const fill = ((wert - min) / (max - min)) * 100;
  return (
    <div>
      <div className="flex items-baseline justify-between gap-4">
        <label htmlFor={id} className="text-[14px] font-medium text-ink-700">{label}</label>
        <output htmlFor={id} className="ov-num font-display text-[18px] font-extrabold tracking-tight text-ink-900">{anzeige}</output>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={wert}
        onChange={(e) => onChange(Number(e.target.value))}
        className="ov-range my-4 block cursor-pointer"
        style={{ "--ov-fill": `${fill}%` }}
      />
      {hinweis && <p className="text-[12.5px] text-ink-500">{hinweis}</p>}
    </div>
  );
}

export default function FinanzierungsRechner() {
  const [preis, setPreis] = useState(22000);
  const [laufzeit, setLaufzeit] = useState(15);
  const [zins, setZins] = useState(4.9);
  const [kwp, setKwp] = useState(10);
  const [verbrauch, setVerbrauch] = useState(4500);
  const [speicher, setSpeicher] = useState(true);
  const [hover, setHover] = useState(null);

  const r = useMemo(() => {
    const monatsrate = rate(preis, zins, laufzeit);
    const ertrag = kwp * ANNAHMEN.ertragJeKwp;
    const eigen = Math.min(
      ertrag * (speicher ? ANNAHMEN.eigenMit : ANNAHMEN.eigenOhne),
      verbrauch * (speicher ? ANNAHMEN.autarkieMit : ANNAHMEN.autarkieOhne)
    );
    const einsp = ertrag - eigen;
    const vorteilJahr = eigen * ANNAHMEN.strompreis + einsp * ANNAHMEN.einspeisung;
    const vorteilMonat = vorteilJahr / 12;
    const gesamtZinsen = monatsrate * laufzeit * 12 - preis;

    let kum = 0;
    let breakEven = null;
    const jahre = Array.from({ length: HORIZONT }, (_, i) => {
      const netto = vorteilJahr - (i < laufzeit ? monatsrate * 12 : 0);
      kum += netto;
      if (breakEven == null && i >= laufzeit - 1 && kum >= 0) breakEven = i + 1;
      return { jahr: i + 1, netto, kum };
    });

    return { monatsrate, ertrag, eigen, einsp, vorteilMonat, vorteilJahr, gesamtZinsen, differenz: vorteilMonat - monatsrate, jahre, summe: kum };
  }, [preis, laufzeit, zins, kwp, verbrauch, speicher]);

  // Diagramm: kumulierter Saldo über 25 Jahre
  const W = 640, H = 230, PL = 62, PR = 8, PT = 16, PB = 32;
  const werte = r.jahre.map((j) => j.kum);
  const maxV = Math.max(1000, ...werte);
  const minV = Math.min(0, ...werte);
  const y = (v) => PT + (H - PT - PB) * (1 - (v - minV) / (maxV - minV));
  const bw = (W - PL - PR) / HORIZONT;
  const ticks = (() => {
    const spanne = maxV - minV;
    const schritt = spanne > 60000 ? 20000 : spanne > 30000 ? 10000 : 5000;
    const t = [];
    for (let v = Math.ceil(minV / schritt) * schritt; v <= maxV; v += schritt) t.push(v);
    return t;
  })();
  const aktiv = hover != null ? r.jahre[hover] : null;
  const maxBalken = Math.max(r.monatsrate, r.vorteilMonat);

  return (
    <div className="overflow-hidden rounded-[2rem] bg-white shadow-xl ring-1 ring-ink-200/70">
      <div className="flex flex-col gap-2 border-b border-ink-100 p-6 md:p-8">
        <p className="text-[12.5px] font-semibold uppercase tracking-[0.16em] text-ov-600">Interaktiv · Beispielrechnung</p>
        <h3 className="ov-h3 text-ink-900">Monatsrate oder Ersparnis – was ist größer?</h3>
      </div>

      <div className="grid lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        {/* Eingaben */}
        <div className="space-y-6 border-b border-ink-100 p-6 md:p-8 lg:border-b-0 lg:border-r">
          <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-ink-500">Finanzierung</p>
          <Regler id="fr-preis" label="Finanzierungsbetrag" wert={preis} anzeige={eur(preis)} min={10000} max={75000} step={500} onChange={setPreis} />
          <div>
            <p id="fr-laufzeit" className="text-[14px] font-medium text-ink-700">Laufzeit</p>
            <div role="group" aria-labelledby="fr-laufzeit" className="mt-3 grid grid-cols-4 gap-1 rounded-full bg-ink-100 p-1">
              {LAUFZEITEN.map((l) => (
                <button
                  key={l}
                  type="button"
                  aria-pressed={laufzeit === l}
                  onClick={() => setLaufzeit(l)}
                  className={`h-11 rounded-full text-[14px] font-semibold transition-all duration-300 ${laufzeit === l ? "bg-white text-ink-900 shadow-md" : "text-ink-600 hover:text-ink-800"}`}
                >
                  {l} J.
                </button>
              ))}
            </div>
          </div>
          <Regler id="fr-zins" label="Sollzins (Beispielwert)" wert={zins} anzeige={`${zahl(zins, 1)} %`} min={1} max={9} step={0.1} onChange={setZins} hinweis="Ihr tatsächlicher Zins hängt von Bonität, Laufzeit und Bank ab." />

          <p className="border-t border-ink-100 pt-6 text-[12px] font-semibold uppercase tracking-[0.14em] text-ink-500">Ihre Anlage</p>
          <Regler id="fr-kwp" label="Anlagengröße" wert={kwp} anzeige={`${zahl(kwp)} kWp`} min={4} max={20} step={1} onChange={setKwp} />
          <Regler id="fr-verbrauch" label="Stromverbrauch pro Jahr" wert={verbrauch} anzeige={`${zahl(verbrauch)} kWh`} min={2000} max={12000} step={250} onChange={setVerbrauch} />
          <label className="flex cursor-pointer items-center justify-between gap-4 rounded-2xl bg-sand-50 px-4 py-3 ring-1 ring-ink-200/60">
            <span className="flex items-center gap-3 text-[14.5px] font-medium text-ink-800">
              <BatteryCharging aria-hidden="true" className="h-5 w-5 text-ov-600" />
              Mit Stromspeicher
            </span>
            <input type="checkbox" checked={speicher} onChange={(e) => setSpeicher(e.target.checked)} className="peer sr-only" />
            <span aria-hidden="true" className="relative h-7 w-12 shrink-0 rounded-full bg-ink-300 transition-colors peer-checked:bg-ov-500 peer-focus-visible:ring-4 peer-focus-visible:ring-ov-500/30 after:absolute after:left-1 after:top-1 after:h-5 after:w-5 after:rounded-full after:bg-white after:shadow after:transition-transform peer-checked:after:translate-x-5" />
          </label>
        </div>

        {/* Ergebnis */}
        <div className="flex flex-col p-6 md:p-8">
          <div aria-live="polite" className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-3xl bg-ink-50 p-5 ring-1 ring-ink-200/60">
              <p className="flex items-center gap-2 text-[13px] text-ink-600"><Wallet aria-hidden="true" className="h-4 w-4 text-navy-600" />Monatsrate</p>
              <p className="ov-num mt-1 font-display text-[32px] font-extrabold leading-tight tracking-tight text-ink-900">{eur(r.monatsrate)}</p>
              <p className="text-[12.5px] text-ink-600">{laufzeit} Jahre · Zinsen gesamt {eur(r.gesamtZinsen)}</p>
            </div>
            <div className="rounded-3xl bg-ov-50 p-5 ring-1 ring-ov-200/70">
              <p className="flex items-center gap-2 text-[13px] text-ink-600"><PiggyBank aria-hidden="true" className="h-4 w-4 text-ov-600" />Ersparnis pro Monat</p>
              <p className="ov-num mt-1 font-display text-[32px] font-extrabold leading-tight tracking-tight text-ov-700">{eur(r.vorteilMonat)}</p>
              <p className="text-[12.5px] text-ink-600">{zahl(r.eigen)} kWh selbst genutzt · {zahl(r.einsp)} kWh eingespeist</p>
            </div>
          </div>

          {/* Balkenvergleich */}
          <div className="mt-6 space-y-3" aria-hidden="true">
            {[
              { l: "Rate", v: r.monatsrate, c: "bg-navy-700" },
              { l: "Ersparnis", v: r.vorteilMonat, c: "bg-ov-500" },
            ].map((b) => (
              <div key={b.l} className="flex items-center gap-3">
                <span className="w-20 shrink-0 text-[13px] text-ink-500">{b.l}</span>
                <span className="h-3 flex-1 rounded-full bg-ink-100">
                  <span className={`block h-3 rounded-full ${b.c} transition-[width] duration-500`} style={{ width: `${(b.v / maxBalken) * 100}%` }} />
                </span>
              </div>
            ))}
          </div>

          <p className={`mt-5 rounded-2xl px-4 py-3 text-[14.5px] leading-relaxed ${r.differenz >= 0 ? "bg-ov-500/10 text-ov-800" : "bg-sun-300/25 text-ink-800"}`}>
            {r.differenz >= 0 ? (
              <>Die Anlage erwirtschaftet in diesem Beispiel schon während der Finanzierung rund <strong className="ov-num">{eur(r.differenz)}</strong> pro Monat mehr, als die Rate kostet.</>
            ) : (
              <>Während der Laufzeit zahlen Sie in diesem Beispiel rund <strong className="ov-num">{eur(-r.differenz)}</strong> pro Monat zu. Danach bleibt die volle Ersparnis – eine längere Laufzeit senkt die Rate.</>
            )}
          </p>

          {/* Kumulierter Saldo */}
          <div className="relative mt-7">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <p className="text-[14px] font-semibold text-ink-800">Kumulierter Saldo über {HORIZONT} Jahre</p>
              <p className="ov-num text-[14px] text-ink-600">nach {HORIZONT} Jahren: <strong className={r.summe >= 0 ? "text-ov-700" : "text-ink-900"}>{eur(r.summe)}</strong></p>
            </div>
            <svg
              viewBox={`0 0 ${W} ${H}`}
              className="mt-3 h-auto w-full"
              role="img"
              aria-label={`Kumulierter Saldo aus Ersparnis minus Rate über ${HORIZONT} Jahre, Endstand ${eur(r.summe)}`}
              onMouseLeave={() => setHover(null)}
            >
              {ticks.map((t) => (
                <g key={t}>
                  <line x1={PL} x2={W - PR} y1={y(t)} y2={y(t)} stroke={t === 0 ? "#9aa3b2" : "#eef0f4"} strokeWidth="1" />
                  <text x={PL - 8} y={y(t) + 5} textAnchor="end" className="fill-ink-500 text-[20px] sm:text-[12px]">{t === 0 ? "0 €" : `${zahl(t / 1000)} T€`}</text>
                </g>
              ))}
              {r.jahre.map((j, i) => {
                const x = PL + i * bw;
                const top = y(Math.max(j.kum, 0));
                const bottom = y(Math.min(j.kum, 0));
                return (
                  <g key={j.jahr} onMouseEnter={() => setHover(i)}>
                    <rect x={x} y={PT} width={bw} height={H - PT - PB} fill={hover === i ? "#f4f6f9" : "transparent"} />
                    <rect
                      x={x + 2}
                      y={top}
                      width={Math.max(bw - 4, 1)}
                      height={Math.max(bottom - top, 1)}
                      rx="3"
                      fill={j.kum >= 0 ? "#669933" : "#b8c0cc"}
                      style={{ transition: "y 400ms cubic-bezier(.22,1,.36,1), height 400ms cubic-bezier(.22,1,.36,1)" }}
                    />
                    {(j.jahr === 1 || j.jahr % 5 === 0) && (
                      <text x={x + bw / 2} y={H - 8} textAnchor="middle" className="fill-ink-500 text-[20px] sm:text-[12px]">{j.jahr}</text>
                    )}
                  </g>
                );
              })}
              <line x1={PL + laufzeit * bw} x2={PL + laufzeit * bw} y1={PT} y2={H - PB} stroke="#003473" strokeWidth="1.5" strokeDasharray="4 4" />
              <text x={PL + laufzeit * bw + (laufzeit >= 15 ? -6 : 6)} y={PT + 14} textAnchor={laufzeit >= 15 ? "end" : "start"} className="fill-navy-700 text-[20px] font-semibold sm:text-[12px]">Kredit getilgt</text>
            </svg>
            {aktiv && (
              <div className="pointer-events-none absolute left-2 top-10 rounded-xl bg-ink-900 px-4 py-3 text-[12.5px] text-white shadow-xl">
                <p className="font-semibold">Jahr {aktiv.jahr}</p>
                <p className="text-white/70">Saldo im Jahr <span className="ov-num text-white">{eur(aktiv.netto)}</span></p>
                <p className="text-white/70">Kumuliert <span className="ov-num text-white">{eur(aktiv.kum)}</span></p>
              </div>
            )}
            <ul className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-[12.5px] text-ink-500">
              <li className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-[3px] bg-ov-500" />Im Plus</li>
              <li className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-[3px] bg-[#b8c0cc]" />Noch im Minus</li>
              <li className="flex items-center gap-2"><span className="h-0 w-4 border-t-2 border-dashed border-navy-700" />Ende der Laufzeit</li>
            </ul>
          </div>
        </div>
      </div>

      <p className="flex gap-2 border-t border-ink-100 px-6 py-4 text-[12.5px] leading-relaxed text-ink-500 md:px-8">
        <Info aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-ink-400" />
        <span>
          Beispielrechnung zur Orientierung, kein Kreditangebot. Annahmen: Annuitätendarlehen ohne Tilgungsfreijahre, {zahl(ANNAHMEN.ertragJeKwp)} kWh Ertrag je kWp, Strompreis {zahl(ANNAHMEN.strompreis * 100)} ct/kWh ohne Preissteigerung,
          Einspeisevergütung {zahl(ANNAHMEN.einspeisung * 100, 2)} ct/kWh (EEG, ab 01.08.2026), Eigenverbrauch {speicher ? "mit" : "ohne"} Speicher vereinfacht. Wartung, Versicherung und Modulalterung sind nicht berücksichtigt. Ihre verbindlichen Konditionen erhalten Sie von der Bank.
        </span>
      </p>
    </div>
  );
}
