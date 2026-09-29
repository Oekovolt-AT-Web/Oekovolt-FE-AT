"use client";

import { useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Building2,
  Droplets,
  Egg,
  Factory,
  Flame,
  Hammer,
  Milk,
  School,
  ShoppingCart,
  Snowflake,
  Sun,
  Apple,
  Warehouse,
  Waves,
  Wheat,
  Wrench,
} from "lucide-react";
import { cn } from "@/components/ui/cn";
import { flaeche, fmtProzent, glatterPfad, pvKurve, useSichtbar, useUeberblendung } from "./diagramm";

const ICONS = { Factory, Warehouse, ShoppingCart, Wrench, Milk, Egg, Wheat, Apple, School, Hammer, Droplets, Waves, Building2, Flame, Snowflake };

/** Typische Tagesverläufe der Einstrahlung (schematisch, Anteil der Sommer-Tagesmenge). */
const SAISONS = [
  { id: "sommer", label: "Sommertag", energie: 1, breite: 3.15, mitte: 13.1 },
  { id: "uebergang", label: "Übergangszeit", energie: 0.55, breite: 2.55, mitte: 12.8 },
  { id: "winter", label: "Wintertag", energie: 0.2, breite: 2.0, mitte: 12.3 },
];

const W = 720;
const H = 280;
const L = 8;
const R = 8;
const T = 18;
const B = 30;

/**
 * Interaktiver Vergleich Lastprofil ↔ PV-Erzeugung für mehrere Betriebsarten.
 *
 * profile: [{
 *   id, label, icon (Schlüssel aus ICONS), last: [24 relative Werte 0..1],
 *   lastSaison?: { uebergang?: [24], winter?: [24] },  // abweichende Last je Saison
 *   pvFaktor: Tagesenergie PV am Sommertag ÷ Tagesverbrauch,
 *   titel, text, punkte: [String], link?: { label, href }
 * }]
 * Alle Werte sind typisierte Beispielprofile (Veranschaulichung), keine Messwerte.
 */
export default function LastprofilExplorer({ profile = [], eyebrow = "Interaktiv", titel, lead, ueberschrift = "h3", hinweis, className }) {
  const Titel = ueberschrift;
  const [aktivId, setAktivId] = useState(profile[0]?.id);
  const [saisonId, setSaisonId] = useState("sommer");
  const ref = useRef(null);
  const sichtbar = useSichtbar(ref);

  const profil = profile.find((p) => p.id === aktivId) || profile[0];
  const saison = SAISONS.find((s) => s.id === saisonId);

  const { last, pv, kennzahlen } = useMemo(() => {
    const last = (profil.lastSaison?.[saison.id] || profil.last).map((v) => Math.max(v, 0));
    const lastSumme = profil.last.reduce((a, b) => a + b, 0);
    const form = pvKurve(saison.breite, saison.mitte);
    const pvTag = lastSumme * profil.pvFaktor * saison.energie;
    const pv = form.map((f) => f * pvTag);
    let direkt = 0;
    pv.forEach((p, h) => (direkt += Math.min(p, last[h])));
    const pvS = pv.reduce((a, b) => a + b, 0);
    const lS = last.reduce((a, b) => a + b, 0);
    return {
      last,
      pv,
      kennzahlen: { eigen: pvS ? direkt / pvS : 0, deckung: lS ? direkt / lS : 0, ueberschuss: pvS ? (pvS - direkt) / pvS : 0 },
    };
  }, [profil, saison]);

  const [aLast, aPv, aK] = useUeberblendung([last, pv, [kennzahlen.eigen, kennzahlen.deckung, kennzahlen.ueberschuss]], sichtbar);

  const maxY = Math.max(1.12, ...pv.map((v) => v * 1.08), ...last.map((v) => v * 1.08));
  const x = (h) => L + ((W - L - R) * h) / 23;
  const y = (v) => T + (H - T - B) * (1 - Math.min(v, maxY) / maxY);
  const ptsLast = aLast.map((v, h) => [x(h), y(v)]);
  const ptsPv = aPv.map((v, h) => [x(h), y(v)]);
  const ptsMin = aLast.map((v, h) => [x(h), y(Math.min(v, aPv[h]))]);
  const y0 = H - B;
  const Icon = ICONS[profil.icon] || Sun;

  return (
    <div ref={ref} className={cn("overflow-hidden rounded-[2rem] bg-white shadow-[0_30px_80px_-40px_rgba(15,23,42,0.45)] ring-1 ring-ink-200/70", className)}>
      <div className="flex flex-col gap-5 border-b border-ink-100 p-5 md:p-8 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <p className="text-[12.5px] font-semibold uppercase tracking-[0.16em] text-ov-700">{eyebrow}</p>
          {titel && (
            <Titel className={cn("mt-2 text-ink-900", ueberschrift === "h2" ? "font-display text-[clamp(1.6rem,1.2rem+1.2vw,2.25rem)] font-extrabold leading-[1.1] tracking-tight" : "ov-h3")}>{titel}</Titel>
          )}
          {lead && <p className="mt-3 max-w-xl text-[15.5px] leading-relaxed text-ink-600">{lead}</p>}
        </div>
        <div role="group" aria-label="Betriebsart wählen" className="ov-no-scrollbar -mx-5 flex shrink-0 gap-2 overflow-x-auto px-5 md:mx-0 md:flex-wrap md:px-0 xl:grid xl:w-[430px] xl:grid-cols-2">
          {profile.map((p) => {
            const PIcon = ICONS[p.icon] || Sun;
            const an = p.id === profil.id;
            return (
              <button
                key={p.id}
                type="button"

                aria-pressed={an}
                onClick={() => setAktivId(p.id)}
                className={cn(
                  "inline-flex h-11 shrink-0 items-center gap-2 rounded-full px-4 text-[14px] font-semibold transition-all duration-300",
                  an ? "bg-navy-950 text-white shadow-lg shadow-navy-950/20" : "bg-ink-50 text-ink-700 ring-1 ring-ink-200 hover:bg-white hover:text-ink-900"
                )}
              >
                <PIcon aria-hidden="true" className={cn("h-4 w-4", an ? "text-ov-300" : "text-ov-600")} />
                {p.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid lg:grid-cols-[minmax(0,1fr)_340px]">
        <div className="min-w-0 p-5 md:p-8">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div role="group" aria-label="Jahreszeit" className="inline-flex rounded-full bg-ink-100 p-1">
              {SAISONS.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  aria-pressed={s.id === saisonId}
                  onClick={() => setSaisonId(s.id)}
                  className={cn(
                    "h-9 rounded-full px-3.5 text-[13px] font-semibold transition-all duration-300 md:px-4",
                    s.id === saisonId ? "bg-white text-ink-900 shadow-md" : "text-ink-600 hover:text-ink-900"
                  )}
                >
                  {s.label}
                </button>
              ))}
            </div>
            <ul className="flex flex-wrap gap-x-4 gap-y-1.5 text-[12.5px] text-ink-600">
              <li className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-sm bg-ov-500" />Solar gedeckt</li>
              <li className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-sm bg-sun-300" />Überschuss</li>
              <li className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-sm bg-ink-200" />Netzbezug</li>
            </ul>
          </div>

          <svg
            viewBox={`0 0 ${W} ${H}`}
            className="h-auto w-full"
            role="img"
            aria-label={`${profil.label}, ${saison.label}: Eigenverbrauchsanteil ${fmtProzent(kennzahlen.eigen)}, solare Deckung ${fmtProzent(kennzahlen.deckung)} (Beispielprofil)`}
          >
            <defs>
              <linearGradient id="lp-pv" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#ffd873" stopOpacity="0.95" />
                <stop offset="1" stopColor="#ffd873" stopOpacity="0.35" />
              </linearGradient>
              <linearGradient id="lp-eigen" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#8cba58" />
                <stop offset="1" stopColor="#558227" />
              </linearGradient>
            </defs>
            {[0.25, 0.5, 0.75, 1].map((v) => (
              <line key={v} x1={L} x2={W - R} y1={y(v)} y2={y(v)} stroke="#eef0f4" strokeWidth="1" />
            ))}
            {[6, 12, 18].map((h) => (
              <line key={h} x1={x(h)} x2={x(h)} y1={T} y2={y0} stroke="#eef0f4" strokeDasharray="3 5" />
            ))}
            <path d={flaeche(ptsPv, y0)} fill="url(#lp-pv)" />
            <path d={flaeche(ptsLast, y0)} fill="#dfe3ea" fillOpacity="0.9" />
            <path d={flaeche(ptsMin, y0)} fill="url(#lp-eigen)" />
            <path d={glatterPfad(ptsPv)} fill="none" stroke="#f5a70f" strokeWidth="2.5" strokeLinecap="round" />
            <path d={glatterPfad(ptsLast)} fill="none" stroke="#03122b" strokeWidth="2.25" strokeLinecap="round" />
            <line x1={L} x2={W - R} y1={y0} y2={y0} stroke="#c4cad5" />
            {[0, 6, 12, 18, 23].map((h) => (
              <text key={h} x={x(h)} y={H - 8} textAnchor={h === 0 ? "start" : h === 23 ? "end" : "middle"} className="fill-ink-400 text-[12px]">
                {h === 23 ? "24 Uhr" : `${h} Uhr`}
              </text>
            ))}
            <g className="text-[12px] font-semibold">
              <text x={W - R} y={T + 2} textAnchor="end" className="fill-ink-500">Leistung (relativ)</text>
            </g>
          </svg>
          <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1.5 text-[12.5px] text-ink-500">
            <span className="flex items-center gap-2"><span className="h-0 w-5 border-t-2 border-navy-950" />Verbrauch (Lastprofil)</span>
            <span className="flex items-center gap-2"><span className="h-0 w-5 border-t-2 border-sun-500" />PV-Erzeugung</span>
          </div>
        </div>

        <div className="flex flex-col border-t border-ink-100 bg-sand-50/70 p-5 md:p-8 lg:border-l lg:border-t-0">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-ov-500 text-white shadow-lg shadow-ov-900/20">
              <Icon aria-hidden="true" className="h-5 w-5" />
            </span>
            <p key={profil.id} className="ov-tab-panel font-display text-[19px] font-bold leading-tight text-ink-900">{profil.titel || profil.label}</p>
          </div>
          <dl className="mt-6 grid grid-cols-2 gap-3">
            <Zahl label="Eigenverbrauch" wert={aK[0]} />
            <Zahl label="Solare Deckung" wert={aK[1]} />
          </dl>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-ink-200">
            <div className="h-full rounded-full bg-gradient-to-r from-ov-400 to-ov-600" style={{ width: `${Math.round(aK[1] * 100)}%` }} />
          </div>
          <p className="mt-2 text-[12px] text-ink-500">Anteil des Tagesverbrauchs, den die Anlage direkt deckt</p>
          <div key={`${profil.id}-t`} className="ov-tab-panel mt-5 flex-1">
            <p className="text-[14.5px] leading-relaxed text-ink-700">{profil.text}</p>
            {profil.punkte?.length > 0 && (
              <ul className="mt-3 space-y-1.5 text-[14px] leading-snug text-ink-600">
                {profil.punkte.map((pt) => (
                  <li key={pt} className="flex gap-2"><span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-ov-500" />{pt}</li>
                ))}
              </ul>
            )}
          </div>
          {profil.link && (
            <Link href={profil.link.href} className="group mt-5 inline-flex items-center gap-2 text-[14.5px] font-semibold text-ov-700 hover:text-ov-800">
              {profil.link.label}
              <ArrowRight aria-hidden="true" className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          )}
        </div>
      </div>
      <p className="border-t border-ink-100 px-5 py-4 text-[12.5px] leading-relaxed text-ink-500 md:px-8">
        {hinweis || "Schematische Veranschaulichung mit typisierten Beispielprofilen (Stundenwerte, wolkenloser Tag) – kein Messwert und keine Ertragsprognose. Belastbare Zahlen liefert die Auswertung Ihres Lastgangs."}
      </p>
    </div>
  );
}

function Zahl({ label, wert }) {
  return (
    <div className="rounded-2xl bg-white p-4 ring-1 ring-ink-200/70">
      <dt className="text-[12px] leading-snug text-ink-500">{label}</dt>
      <dd className="ov-num mt-1 font-display text-[28px] font-extrabold leading-none tracking-tight text-ink-900">{Math.round(wert * 100)} %</dd>
    </div>
  );
}
