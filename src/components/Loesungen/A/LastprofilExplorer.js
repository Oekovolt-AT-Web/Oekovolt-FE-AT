"use client";

// Interaktiver Lastgang-Explorer der Lösungsseiten (Gewerbe, Landwirtschaft, Gemeinden).
//
// Idee (nach der TV-Folie „Lastgang“): Verbrauch und Solarkurve eines typischen Tages, darunter
// die Flächen, die zählen – Solarstrom direkt genutzt (grün), Überschuss (gelb), mit Speicher:
// geladener Überschuss (bernstein) und die gekappte Netzspitze aus dem Speicher (blau).
// Beim Eintritt legt ein Zeit-Cursor den Tag einmal von 0 bis 24 Uhr frei; jeder Wechsel von
// Betriebsart, Jahreszeit oder Speicher verformt die Kurven weich. Zeiger/Finger über der Grafik
// oder der Uhrzeit-Regler zeigen, woher der Strom zu jeder Stunde kommt.
//
// Alle Werte sind typisierte Beispielprofile (Stundenwerte, schematisch) – keine Messwerte.
// Text-Inhalte stehen ohne JavaScript im HTML; nur transform/opacity werden animiert.

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  BatteryCharging,
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
import { fmtProzent, glatterPfad, pvKurve, useSichtbar, useUeberblendung } from "./diagramm";

const ICONS = { Factory, Warehouse, ShoppingCart, Wrench, Milk, Egg, Wheat, Apple, School, Hammer, Droplets, Waves, Building2, Flame, Snowflake };

/** Typische Tagesverläufe der Einstrahlung (schematisch, Anteil der Sommer-Tagesmenge). */
const SAISONS = [
  { id: "sommer", label: "Sommertag", kurz: "Sommer", energie: 1, breite: 3.15, mitte: 13.1 },
  { id: "uebergang", label: "Übergangszeit", kurz: "Übergang", energie: 0.55, breite: 2.55, mitte: 12.8 },
  { id: "winter", label: "Wintertag", kurz: "Winter", energie: 0.2, breite: 2.0, mitte: 12.3 },
];

/** Schema-Speicher: Kapazität als Anteil des Tagesverbrauchs, Wirkungsgrad, lädt nur aus Solarüberschuss. */
const SPEICHER_ANTEIL = 0.2;
const ETA = 0.9;

const W = 720;
const H = 300;
const OBEN = 26;
const UNTEN = 4;
const r1 = (v) => Math.round(v * 10) / 10;
const summe = (a) => a.reduce((s, v) => s + v, 0);
const STUNDEN = Array.from({ length: 24 }, (_, h) => h);

/* ------------------------------------------------------------------ */
/* Rechnung (deterministisch, gleiche Werte auf Server und Client)     */
/* ------------------------------------------------------------------ */

function rechne(profil, saison, mitSpeicher) {
  const last = (profil.lastSaison?.[saison.id] || profil.last).map((v) => Math.max(v, 0));
  const lastSumme = summe(profil.last);
  const form = pvKurve(saison.breite, saison.mitte);
  const pvTag = lastSumme * profil.pvFaktor * saison.energie;
  const pv = form.map((f) => f * pvTag);
  const direkt = pv.map((p, h) => Math.min(p, last[h]));
  const ueber = pv.map((p, h) => p - direkt[h]);
  const netz0 = last.map((l, h) => l - direkt[h]);
  const sumU = summe(ueber);
  const kapazitaet = SPEICHER_ANTEIL * lastSumme;
  const energie = mitSpeicher ? Math.min(sumU * ETA, kapazitaet, summe(netz0)) : 0;

  // Speicher entlädt „von oben“: höchste Netzbezugsstunden zuerst (Spitze kappen).
  let kappe = Math.max(...netz0);
  if (energie > 1e-6) {
    let lo = 0;
    let hi = kappe;
    for (let i = 0; i < 40; i++) {
      const mitte = (lo + hi) / 2;
      const e = summe(netz0.map((n) => Math.max(0, n - mitte)));
      if (e > energie) lo = mitte;
      else hi = mitte;
    }
    kappe = hi;
  }
  const ent = netz0.map((n) => (energie > 1e-6 ? Math.max(0, n - kappe) : 0));
  const lad = ueber.map((u) => (sumU > 0 ? (u * (energie / ETA)) / sumU : 0));
  const netz = netz0.map((n, h) => n - ent[h]);

  const pvS = summe(pv);
  const lS = summe(last);
  const dS = summe(direkt);
  const spitzeOhne = Math.max(...last);
  const spitzeMit = Math.max(...netz);
  return {
    last,
    pv,
    direkt,
    ent,
    lad,
    kappe: energie > 1e-6 ? kappe : -1,
    kennzahlen: {
      eigen: pvS ? Math.min(1, (dS + energie / ETA) / pvS) : 0,
      deckung: lS ? (dS + energie) / lS : 0,
      spitze: spitzeOhne ? Math.max(0, 1 - spitzeMit / spitzeOhne) : 0,
      fuellung: kapazitaet ? energie / kapazitaet : 0,
    },
  };
}

/** Größter Wert eines Profils über alle Jahreszeiten – feste Skala, damit der Winter sichtbar kleiner ist. */
function skala(profil) {
  const s = SAISONS[0];
  const lastSumme = summe(profil.last);
  const pvMax = Math.max(...pvKurve(s.breite, s.mitte).map((f) => f * lastSumme * profil.pvFaktor));
  const lasten = [profil.last, ...Object.values(profil.lastSaison || {})].flat();
  return Math.max(pvMax, ...lasten) * 1.08;
}

/* ------------------------------------------------------------------ */
/* Weiches Verformen beim Wechsel (startet beim vorher gezeigten Bild) */
/* ------------------------------------------------------------------ */

function useVerformen(ziel, dauer = 720) {
  const [wert, setWert] = useState(ziel);
  const aktuell = useRef(ziel);
  const raf = useRef(0);
  const schluessel = JSON.stringify(ziel);

  const letzter = useRef(schluessel);

  useEffect(() => {
    if (letzter.current === schluessel) return undefined;
    letzter.current = schluessel;
    const start = aktuell.current;
    const ruhig = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    cancelAnimationFrame(raf.current);
    if (ruhig) {
      aktuell.current = ziel;
      setWert(ziel);
      return undefined;
    }
    const t0 = performance.now();
    const mische = (a, b, e) => (Array.isArray(b) ? b.map((v, j) => mische(a?.[j] ?? 0, v, e)) : (a ?? 0) + (b - (a ?? 0)) * e);
    const schritt = (t) => {
      const p = Math.min((t - t0) / dauer, 1);
      const e = p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;
      const neu = mische(start, ziel, e);
      aktuell.current = neu;
      setWert(neu);
      if (p < 1) raf.current = requestAnimationFrame(schritt);
    };
    raf.current = requestAnimationFrame(schritt);
    return () => cancelAnimationFrame(raf.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [schluessel]);

  return wert;
}

/* ------------------------------------------------------------------ */
/* Pfade                                                               */
/* ------------------------------------------------------------------ */

/** Stundenwerte → Punkte (Stundenmitte), an beiden Rändern bis 0 und 24 Uhr verlängert. */
function punkte(werte, y) {
  const p = werte.map((v, h) => [((h + 0.5) / 24) * W, y(v)]);
  return [[0, p[0][1]], ...p, [W, p[p.length - 1][1]]];
}
/** Fläche zwischen zwei Kurven (oben, unten). */
function band(oben, unten) {
  const zurueck = glatterPfad([...unten].reverse()).replace(/^M/, "L");
  return `${glatterPfad(oben)} ${zurueck} Z`;
}

/* ------------------------------------------------------------------ */
/* Farben je Grund                                                     */
/* ------------------------------------------------------------------ */

const FARBEN = {
  hell: { raster: "#e9ecf1", netz: "#dfe3ea", netzRand: "#c4cad5", last: "#03122b", pv: "#f5a70f", pvFl: "#ffd873", lad: "#f5b53d", blau: "#4a7cbd", gruenA: "#8cba58", gruenB: "#558227" },
  dunkel: { raster: "rgba(255,255,255,0.07)", netz: "rgba(255,255,255,0.13)", netzRand: "rgba(255,255,255,0.2)", last: "#ffffff", pv: "#ffc53d", pvFl: "#ffd873", lad: "#f0a92a", blau: "#7fa7d6", gruenA: "#8cba58", gruenB: "#436621" },
};

const CSS = `
.w24lp-vorhang{transform:translate3d(${W + 40}px,0,0)}
.w24lp-cursor{opacity:0;transform:translate3d(${W}px,0,0)}
.w24lp-bereit:not(.w24lp-an) .w24lp-vorhang{transform:translate3d(0,0,0)}
.w24lp-bereit:not(.w24lp-an) .w24lp-cursor{transform:translate3d(0,0,0)}
.w24lp-an .w24lp-vorhang{transition:transform 2.4s cubic-bezier(.6,0,.3,1) .25s}
.w24lp-an .w24lp-cursor{animation:w24lp-cursor 2.4s cubic-bezier(.6,0,.3,1) .25s both}
@keyframes w24lp-cursor{0%{opacity:0;transform:translate3d(0,0,0)}8%{opacity:1}88%{opacity:1}100%{opacity:0;transform:translate3d(${W}px,0,0)}}
.w24lp-bereit:not(.w24lp-an) .w24lp-auf{opacity:0;transform:translate3d(0,14px,0)}
.w24lp-an .w24lp-auf{transition:opacity .8s cubic-bezier(.22,1,.36,1) var(--w24-d,0ms),transform .9s cubic-bezier(.22,1,.36,1) var(--w24-d,0ms)}
.w24lp-karte{transition:background-color .35s,color .35s,box-shadow .35s,transform .45s cubic-bezier(.22,1,.36,1)}
@media (hover:hover) and (prefers-reduced-motion:no-preference){.w24lp-karte:not([aria-pressed=true]):hover{transform:translate3d(0,-2px,0)}}
.w24lp-segment{transition:transform .5s cubic-bezier(.65,0,.35,1)}
.w24lp-schalter-knopf{transition:transform .4s cubic-bezier(.34,1.4,.64,1)}
.w24lp-pegel{transform-origin:50% 100%;transition:transform .9s cubic-bezier(.22,1,.36,1)}
.w24lp-schieber{-webkit-appearance:none;appearance:none;background:transparent;cursor:pointer}
.w24lp-schieber:focus{outline:none}
.w24lp-schieber::-webkit-slider-runnable-track{height:44px;background:transparent}
.w24lp-schieber::-moz-range-track{height:44px;background:transparent}
.w24lp-schieber::-webkit-slider-thumb{-webkit-appearance:none;appearance:none;width:22px;height:44px;background:transparent;border:0}
.w24lp-schieber::-moz-range-thumb{width:22px;height:44px;background:transparent;border:0}
.w24lp-schieber:focus-visible + .w24lp-griff{box-shadow:0 0 0 3px var(--color-ov-400)}
.w24lp-lesen{transition:opacity .25s ease}
@media (prefers-reduced-motion:reduce){
  .w24lp-an .w24lp-cursor{animation:none}
  .w24lp-segment,.w24lp-pegel,.w24lp-schalter-knopf,.w24lp-karte{transition:none}
}
`;

/**
 * Interaktiver Vergleich Lastprofil ↔ PV-Erzeugung für mehrere Betriebsarten.
 *
 * profile: [{
 *   id, label, icon (Schlüssel aus ICONS), last: [24 relative Werte 0..1],
 *   lastSaison?: { uebergang?: [24], winter?: [24] },  // abweichende Last je Saison
 *   pvFaktor: Tagesenergie PV am Sommertag ÷ Tagesverbrauch,
 *   titel, text, punkte: [String], link?: { label, href },
 *   marken?: [{ h: Stunde 0..24, label }]               // optional: Ereignisse im Tagesverlauf
 * }]
 * dunkel: Darstellung auf dunklem Abschnitt (navy). speicher: Speicher-Schalter zeigen (Standard: ja).
 * Alle Werte sind typisierte Beispielprofile (Veranschaulichung), keine Messwerte.
 */
export default function LastprofilExplorer({ profile = [], eyebrow = "Interaktiv", titel, lead, ueberschrift = "h3", hinweis, dunkel = false, speicher = true, className }) {
  const Titel = ueberschrift;
  const [aktivId, setAktivId] = useState(profile[0]?.id);
  const [saisonId, setSaisonId] = useState("sommer");
  const [mitSpeicher, setMitSpeicher] = useState(false);
  const [stunde, setStunde] = useState(null);
  const wurzel = useRef(null);
  const sichtbar = useSichtbar(wurzel, 0.2);
  const F = dunkel ? FARBEN.dunkel : FARBEN.hell;

  const profil = profile.find((p) => p.id === aktivId) || profile[0];
  const saison = SAISONS.find((s) => s.id === saisonId);
  const saisonIndex = SAISONS.indexOf(saison);

  const daten = useMemo(() => rechne(profil, saison, speicher && mitSpeicher), [profil, saison, speicher, mitSpeicher]);
  const maxY = useMemo(() => skala(profil), [profil]);

  const [aLast, aPv, aDirekt, aEnt, aLad, aMax] = useVerformen([daten.last, daten.pv, daten.direkt, daten.ent, daten.lad, maxY]);
  const k = daten.kennzahlen;
  const [aK] = useUeberblendung([[k.eigen, k.deckung, k.spitze, k.fuellung]], sichtbar, 900);

  // Aufbau beim Eintritt: Vorhang + Zeit-Cursor (einmal). Ohne JS / reduzierte Bewegung: Endzustand.
  useEffect(() => {
    const el = wurzel.current;
    if (!el) return undefined;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) return undefined;
    if (el.getBoundingClientRect().bottom < 0) return undefined;
    el.classList.add("w24lp-bereit");
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        requestAnimationFrame(() => requestAnimationFrame(() => el.classList.add("w24lp-an")));
        io.disconnect();
      },
      { threshold: 0.2 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const y = (v) => r1(OBEN + (H - OBEN - UNTEN) * (1 - Math.min(Math.max(v, 0), aMax) / aMax));
  const nullen = STUNDEN.map(() => 0);
  const pLast = punkte(aLast, y);
  const pPv = punkte(aPv, y);
  const pDirekt = punkte(aDirekt, y);
  const pBoden = punkte(nullen, y);
  // Stapel von unten: Solar direkt → Netzbezug → aus dem Speicher (kappt die Spitze unter der Lastlinie)
  const pDirektNetz = punkte(aLast.map((l, h) => Math.max(aDirekt[h], l - aEnt[h])), y);
  const pLastLad = punkte(aLast.map((l, h) => Math.min(l + aLad[h], Math.max(aPv[h], l))), y);
  const pOben = punkte(aLast.map((l, h) => Math.max(aPv[h], l)), y);
  const Icon = ICONS[profil.icon] || Sun;

  // Ablesen je Stunde
  const lese = stunde === null ? null : (() => {
    const l = daten.last[stunde] || 1e-9;
    return {
      solar: daten.direkt[stunde] / l,
      speicher: daten.ent[stunde] / l,
      netz: Math.max(0, 1 - (daten.direkt[stunde] + daten.ent[stunde]) / l),
      ueber: daten.pv[stunde] > daten.last[stunde] + 1e-6,
    };
  })();
  const stundeX = (h) => ((h + 0.5) / 24) * 100;
  const zeigerStunde = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    const h = Math.floor(((e.clientX - r.left) / r.width) * 24);
    setStunde(Math.min(23, Math.max(0, h)));
  };

  const t = dunkel
    ? {
        eyebrow: "text-ov-300",
        titel: "text-white",
        lead: "text-white/65",
        panel: "bg-white/[0.035] ring-1 ring-white/10 shadow-[0_40px_120px_-40px_rgba(0,0,0,0.6)]",
        trenn: "border-white/10",
        seite: "bg-white/[0.03]",
        text: "text-white",
        sub: "text-white/60",
        leise: "text-white/45",
        pille: "bg-white/[0.06] ring-1 ring-white/10",
        pilleAn: "bg-white text-navy-950",
        pilleAus: "text-white/65 hover:text-white",
        kachel: "bg-white/[0.04] ring-1 ring-white/10",
      }
    : {
        eyebrow: "text-ov-700",
        titel: "text-ink-900",
        lead: "text-ink-600",
        panel: "bg-white ring-1 ring-ink-900/[0.06] shadow-[0_1px_2px_rgba(15,23,42,0.04),0_40px_90px_-48px_rgba(15,23,42,0.45)]",
        trenn: "border-ink-100",
        seite: "bg-sand-50/70",
        text: "text-ink-900",
        sub: "text-ink-600",
        leise: "text-ink-500",
        pille: "bg-ink-100/80 ring-1 ring-ink-900/[0.04]",
        pilleAn: "bg-white text-ink-900 shadow-[0_2px_8px_-2px_rgba(15,23,42,0.18)]",
        pilleAus: "text-ink-600 hover:text-ink-900",
        kachel: "bg-white ring-1 ring-ink-200/70",
      };

  return (
    <div ref={wurzel} data-blk="lastprofil" className={cn("w24lp relative", className)}>
      <style>{CSS}</style>

      {/* ---------- Kopf ---------- */}
      {(titel || lead) && (
        <div className="mb-8 grid gap-5 md:mb-10 lg:grid-cols-12 lg:items-end lg:gap-10">
          <div className="lg:col-span-7">
            <p className={cn("inline-flex items-center gap-2 text-[12.5px] font-semibold uppercase tracking-[0.16em]", t.eyebrow)}>
              <span aria-hidden="true" className={cn("h-1.5 w-1.5 rounded-full", dunkel ? "bg-ov-300" : "bg-ov-500")} />
              {eyebrow}
            </p>
            {titel && <Titel className={cn("mt-4", ueberschrift === "h2" ? "ov-h2" : "ov-h3", t.titel)}>{titel}</Titel>}
          </div>
          {lead && <p className={cn("max-w-[36rem] text-[16px] leading-relaxed md:text-[17px] lg:col-span-5", t.lead)}>{lead}</p>}
        </div>
      )}

      {/* ---------- Betriebsarten mit Mini-Lastgang ---------- */}
      <div
        role="group"
        aria-label="Betriebsart wählen"
        className="ov-no-scrollbar -mx-5 flex snap-x snap-mandatory scroll-px-5 gap-2.5 overflow-x-auto px-5 pb-1 md:mx-0 md:grid md:gap-3 md:overflow-visible md:px-0 md:pb-0"
        style={{ gridTemplateColumns: `repeat(${profile.length}, minmax(0, 1fr))` }}
      >
        {profile.map((p, i) => {
          const PIcon = ICONS[p.icon] || Sun;
          const an = p.id === profil.id;
          return (
            <button
              key={p.id}
              type="button"
              aria-pressed={an}
              onClick={() => setAktivId(p.id)}
              className={cn(
                "w24lp-karte w24lp-auf group relative flex w-[46%] min-w-[156px] shrink-0 snap-start flex-col gap-3 overflow-hidden rounded-2xl p-3.5 text-left outline-none focus-visible:ring-2 focus-visible:ring-ov-400 md:w-auto md:min-w-0 md:p-4",
                an
                  ? dunkel
                    ? "bg-white text-navy-950 shadow-[0_18px_40px_-18px_rgba(140,186,88,0.55)]"
                    : "bg-navy-950 text-white shadow-[0_18px_40px_-20px_rgba(3,18,43,0.7)]"
                  : dunkel
                    ? "bg-white/[0.04] text-white/80 ring-1 ring-white/10 hover:bg-white/[0.08]"
                    : "bg-white text-ink-800 ring-1 ring-ink-900/[0.07] hover:ring-ink-900/15"
              )}
              style={{ "--w24-d": `${120 + i * 90}ms` }}
            >
              <span className="flex items-center gap-2.5">
                <span
                  className={cn(
                    "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
                    an ? (dunkel ? "bg-ov-500 text-white" : "bg-ov-500 text-white") : dunkel ? "bg-white/[0.07] text-ov-300" : "bg-ov-50 text-ov-600"
                  )}
                >
                  <PIcon aria-hidden="true" className="h-4 w-4" strokeWidth={1.9} />
                </span>
                <span className="text-[14px] font-semibold leading-tight">{p.label}</span>
              </span>
              <Mini werte={p.last} an={an} dunkel={dunkel} />
            </button>
          );
        })}
      </div>

      {/* ---------- Hauptbühne ---------- */}
      <div className={cn("relative mt-3 overflow-hidden rounded-[1.75rem] md:mt-4 md:rounded-[2rem]", t.panel)}>
        {dunkel && <span aria-hidden="true" className="pointer-events-none absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-white/35 to-transparent" />}
        <div className="grid lg:grid-cols-[minmax(0,1fr)_320px] xl:grid-cols-[minmax(0,1fr)_344px]">
          <div className="flex min-w-0 flex-col p-4 sm:p-6 md:p-8">
            {/* Werkzeugleiste */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div role="group" aria-label="Jahreszeit" className={cn("relative grid grid-cols-3 rounded-full p-1", t.pille)}>
                <span
                  aria-hidden="true"
                  className={cn("w24lp-segment absolute inset-y-1 left-1 w-[calc((100%-8px)/3)] rounded-full", dunkel ? "bg-white" : "bg-white shadow-[0_2px_8px_-2px_rgba(15,23,42,0.18)]")}
                  style={{ transform: `translate3d(${saisonIndex * 100}%,0,0)` }}
                />
                {SAISONS.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    aria-pressed={s.id === saisonId}
                    onClick={() => setSaisonId(s.id)}
                    className={cn(
                      "relative h-10 rounded-full px-3 text-[13px] font-semibold outline-none transition-colors duration-300 focus-visible:ring-2 focus-visible:ring-ov-400 sm:px-4",
                      s.id === saisonId ? (dunkel ? "text-navy-950" : "text-ink-900") : t.pilleAus
                    )}
                  >
                    <span className="sm:hidden">{s.kurz}</span>
                    <span className="hidden sm:inline">{s.label}</span>
                  </button>
                ))}
              </div>
              {speicher && (
                <button
                  type="button"
                  aria-pressed={mitSpeicher}
                  onClick={() => setMitSpeicher((v) => !v)}
                  className={cn(
                    "inline-flex h-11 items-center gap-2.5 rounded-full pl-2 pr-4 text-[13.5px] font-semibold outline-none transition-colors duration-300 focus-visible:ring-2 focus-visible:ring-ov-400",
                    mitSpeicher ? (dunkel ? "bg-navy-300/15 text-white ring-1 ring-navy-300/40" : "bg-navy-50 text-navy-800 ring-1 ring-navy-200") : cn(t.pille, t.pilleAus)
                  )}
                >
                  <span aria-hidden="true" className={cn("relative h-6 w-10 rounded-full transition-colors duration-300", mitSpeicher ? "bg-navy-400" : dunkel ? "bg-white/15" : "bg-ink-300")}>
                    <span className="w24lp-schalter-knopf absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow" style={{ transform: `translate3d(${mitSpeicher ? 16 : 0}px,0,0)` }} />
                  </span>
                  <BatteryCharging aria-hidden="true" className="h-4 w-4" strokeWidth={1.9} />
                  Mit Speicher
                </button>
              )}
            </div>

            {/* Legende */}
            <ul className={cn("mt-5 flex flex-wrap gap-x-4 gap-y-2 text-[12.5px]", t.sub)}>
              <Legende farbe={F.last} linie>Verbrauch</Legende>
              <Legende farbe={F.pv} linie>Solarerzeugung</Legende>
              <Legende farbe={F.gruenA}>Solar direkt</Legende>
              <Legende farbe={F.pvFl}>Überschuss</Legende>
              {speicher && mitSpeicher && <Legende farbe={F.lad}>lädt Speicher</Legende>}
              {speicher && mitSpeicher && <Legende farbe={F.blau}>Spitze aus Speicher</Legende>}
              <Legende farbe={F.netz} rand={F.netzRand}>Netzbezug</Legende>
            </ul>

            {/* Grafik */}
            <div className="relative mt-4 h-[220px] sm:h-[280px] lg:h-auto lg:min-h-[300px] lg:flex-1" onPointerMove={zeigerStunde} onPointerDown={zeigerStunde} onPointerLeave={(e) => e.pointerType === "mouse" && setStunde(null)} style={{ touchAction: "pan-y" }}>
              <svg
                viewBox={`0 0 ${W} ${H}`}
                preserveAspectRatio="none"
                className="absolute inset-0 block h-full w-full"
                role="img"
                aria-label={`${profil.label}, ${saison.label}${speicher && mitSpeicher ? ", mit Speicher" : ""}: Eigenverbrauchsanteil ${fmtProzent(k.eigen)}, solare Deckung ${fmtProzent(k.deckung)} (schematisches Beispielprofil)`}
              >
                <defs>
                  <linearGradient id="w24lp-gruen" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0" stopColor={F.gruenA} />
                    <stop offset="1" stopColor={F.gruenB} />
                  </linearGradient>
                  <linearGradient id="w24lp-sonne" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0" stopColor={F.pvFl} stopOpacity="0.95" />
                    <stop offset="1" stopColor={F.pvFl} stopOpacity="0.55" />
                  </linearGradient>
                  <linearGradient id="w24lp-licht" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0" stopColor={dunkel ? "#fff" : "#8cba58"} stopOpacity="0" />
                    <stop offset="1" stopColor={dunkel ? "#fff" : "#8cba58"} stopOpacity={dunkel ? "0.14" : "0.18"} />
                  </linearGradient>
                  <pattern id="w24lp-schraffur" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                    <rect width="7" height="7" fill={F.lad} />
                    <line x1="0" y1="0" x2="0" y2="7" stroke="#fff" strokeOpacity="0.28" strokeWidth="2.5" />
                  </pattern>
                  <clipPath id="w24lp-vorhang">
                    <rect className="w24lp-vorhang" x={-W - 40} y="0" width={W + 40} height={H} />
                  </clipPath>
                </defs>

                {[0.25, 0.5, 0.75, 1].map((v) => (
                  <line key={v} x1="0" x2={W} y1={OBEN + (H - OBEN - UNTEN) * (1 - v)} y2={OBEN + (H - OBEN - UNTEN) * (1 - v)} stroke={F.raster} vectorEffect="non-scaling-stroke" />
                ))}
                {[6, 12, 18].map((h) => (
                  <line key={h} x1={(h / 24) * W} x2={(h / 24) * W} y1={OBEN - 10} y2={H} stroke={F.raster} strokeDasharray="3 5" vectorEffect="non-scaling-stroke" />
                ))}

                <g clipPath="url(#w24lp-vorhang)">
                  <path d={band(pDirektNetz, pDirekt)} fill={F.netz} />
                  <path d={band(pLast, pDirektNetz)} fill={F.blau} />
                  <path d={band(pDirekt, pBoden)} fill="url(#w24lp-gruen)" />
                  <path d={band(pLastLad, pLast)} fill="url(#w24lp-schraffur)" />
                  <path d={band(pOben, pLastLad)} fill="url(#w24lp-sonne)" />
                  <path d={glatterPfad(pPv)} fill="none" stroke={F.pv} strokeWidth="2.5" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
                  <path d={glatterPfad(pLast)} fill="none" stroke={F.last} strokeWidth="2.25" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
                </g>
                <line x1="0" x2={W} y1={H - UNTEN} y2={H - UNTEN} stroke={F.netzRand} vectorEffect="non-scaling-stroke" />

                {/* Ereignisse im Tagesverlauf */}
                {(profil.marken || []).map((m) => (
                  <line key={`${m.h}-${m.label}`} x1={(m.h / 24) * W} x2={(m.h / 24) * W} y1={OBEN - 4} y2={H - UNTEN} stroke={dunkel ? "rgba(255,255,255,0.35)" : "rgba(3,18,43,0.28)"} strokeDasharray="2 4" vectorEffect="non-scaling-stroke" />
                ))}

                {/* Zeit-Cursor beim Aufbau */}
                <g className="w24lp-cursor" aria-hidden="true">
                  <rect x="-90" y="0" width="90" height={H} fill="url(#w24lp-licht)" />
                  <line x1="0" x2="0" y1="0" y2={H} stroke={dunkel ? "#fff" : "#558227"} strokeOpacity="0.7" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
                </g>

                {/* Ablese-Linie */}
                {stunde !== null && (
                  <line x1={((stunde + 0.5) / 24) * W} x2={((stunde + 0.5) / 24) * W} y1={OBEN - 10} y2={H - UNTEN} stroke={dunkel ? "rgba(255,255,255,0.55)" : "rgba(3,18,43,0.45)"} strokeWidth="1.25" vectorEffect="non-scaling-stroke" />
                )}
              </svg>

              {/* Beschriftungen als HTML (bleiben bei jeder Breite lesbar) */}
              {(profil.marken || []).map((m) => (
                <span
                  key={`${m.h}-${m.label}-t`}
                  aria-hidden="true"
                  className={cn("pointer-events-none absolute top-0 -translate-x-1/2 whitespace-nowrap rounded-full px-2 py-0.5 text-[11px] font-semibold", dunkel ? "bg-navy-900 text-white/80 ring-1 ring-white/15" : "bg-white text-ink-700 ring-1 ring-ink-900/10")}
                  style={{ left: `${(m.h / 24) * 100}%` }}
                >
                  {m.label}
                </span>
              ))}
              {stunde !== null && (
                <>
                  <span aria-hidden="true" className="pointer-events-none absolute h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2" style={{ left: `${stundeX(stunde)}%`, top: `${(y(daten.last[stunde]) / H) * 100}%`, background: dunkel ? "#03122b" : "#fff", borderColor: F.last }} />
                  {daten.pv[stunde] > 0.002 && (
                    <span aria-hidden="true" className="pointer-events-none absolute h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2" style={{ left: `${stundeX(stunde)}%`, top: `${(y(daten.pv[stunde]) / H) * 100}%`, background: dunkel ? "#03122b" : "#fff", borderColor: F.pv }} />
                  )}
                </>
              )}
            </div>

            {/* Zeitachse = Uhrzeit-Regler */}
            <div className="relative mt-1 h-11">
              <div className={cn("pointer-events-none absolute inset-x-0 top-0 flex h-11 items-center justify-between text-[12px] ov-num", t.leise)}>
                {[0, 6, 12, 18, 24].map((h) => (
                  <span key={h} className={cn("w-0 whitespace-nowrap", h === 0 ? "" : h === 24 ? "flex justify-end" : "flex justify-center")}>
                    {h} Uhr
                  </span>
                ))}
              </div>
              <input
                type="range"
                min="0"
                max="23"
                step="1"
                value={stunde ?? 12}
                onChange={(e) => setStunde(Number(e.target.value))}
                onFocus={() => stunde === null && setStunde(12)}
                aria-label="Uhrzeit ablesen"
                aria-valuetext={lese ? `${stunde} bis ${stunde + 1} Uhr: Solar direkt ${fmtProzent(lese.solar)}, aus Speicher ${fmtProzent(lese.speicher)}, aus dem Netz ${fmtProzent(lese.netz)} des Verbrauchs` : "12 Uhr"}
                className="w24lp-schieber absolute inset-0 h-11 w-full opacity-0"
              />
              {stunde !== null && (
                <span aria-hidden="true" className="w24lp-griff pointer-events-none absolute top-1/2 h-1.5 w-6 -translate-x-1/2 -translate-y-1/2 rounded-full bg-ov-500" style={{ left: `${stundeX(stunde)}%` }} />
              )}
            </div>

            {/* Ablesung */}
            <div className={cn("w24lp-lesen mt-2 flex min-h-[44px] flex-wrap items-center gap-x-4 gap-y-1.5 rounded-xl px-3.5 py-2.5 text-[13px]", dunkel ? "bg-white/[0.04] ring-1 ring-white/10" : "bg-ink-50 ring-1 ring-ink-900/[0.05]")} aria-live="polite">
              {lese ? (
                <>
                  <span className={cn("font-display font-bold ov-num", t.text)}>
                    {String(stunde).padStart(2, "0")}–{String(stunde + 1).padStart(2, "0")} Uhr
                  </span>
                  <Anteil farbe={F.gruenA} label="Solar direkt" wert={lese.solar} t={t} />
                  {speicher && mitSpeicher && <Anteil farbe={F.blau} label="Speicher" wert={lese.speicher} t={t} />}
                  <Anteil farbe={dunkel ? "rgba(255,255,255,0.45)" : "#97a0b0"} label="Netz" wert={lese.netz} t={t} />
                  {lese.ueber && <span className={cn("font-semibold", dunkel ? "text-sun-300" : "text-sun-500")}>+ Überschuss</span>}
                </>
              ) : (
                <span className={t.sub}>Zeiger oder Finger auf die Kurve – so sehen Sie, woher der Strom zu jeder Stunde kommt.</span>
              )}
            </div>
          </div>

          {/* ---------- Seitenleiste ---------- */}
          <div className={cn("flex flex-col border-t p-5 sm:p-6 md:p-8 lg:border-l lg:border-t-0", t.trenn, t.seite)}>
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-ov-500 text-white shadow-[0_10px_24px_-10px_rgba(85,130,39,0.8)]">
                <Icon aria-hidden="true" className="h-5 w-5" />
              </span>
              <p key={profil.id} className={cn("ov-tab-panel font-display text-[19px] font-bold leading-tight", t.text)}>
                {profil.titel || profil.label}
              </p>
            </div>

            <dl className="mt-6 grid grid-cols-2 gap-3">
              <div className={cn("col-span-2 flex items-center gap-4 rounded-2xl p-4", t.kachel)}>
                <Ring wert={aK[0]} dunkel={dunkel} />
                <div>
                  <dt className={cn("text-[12.5px] leading-snug", t.sub)}>Eigenverbrauch</dt>
                  <dd className={cn("ov-num mt-1 font-display text-[34px] font-extrabold leading-none tracking-tight", t.text)}>{Math.round(aK[0] * 100)} %</dd>
                  <dd className={cn("mt-1.5 text-[12px] leading-snug", t.leise)}>der Solarerzeugung im Betrieb genutzt</dd>
                </div>
              </div>
              <div className={cn("rounded-2xl p-4", t.kachel)}>
                <dt className={cn("text-[12px] leading-snug", t.sub)}>Solare Deckung</dt>
                <dd className={cn("ov-num mt-1 font-display text-[26px] font-extrabold leading-none tracking-tight", t.text)}>{Math.round(aK[1] * 100)} %</dd>
                <dd className={cn("mt-3 h-1.5 overflow-hidden rounded-full", dunkel ? "bg-white/10" : "bg-ink-100")}>
                  <span className="block h-full origin-left rounded-full bg-gradient-to-r from-ov-400 to-ov-600" style={{ transform: `scaleX(${Math.min(1, aK[1])})` }} />
                </dd>
              </div>
              <div className={cn("rounded-2xl p-4", t.kachel)}>
                <dt className={cn("text-[12px] leading-snug", t.sub)}>Netzspitze</dt>
                <dd className={cn("ov-num mt-1 font-display text-[26px] font-extrabold leading-none tracking-tight", aK[2] > 0.005 ? (dunkel ? "text-ov-300" : "text-ov-700") : t.text)}>
                  {aK[2] > 0.005 ? `−${Math.round(aK[2] * 100)} %` : "± 0 %"}
                </dd>
                <dd className={cn("mt-2 text-[11.5px] leading-snug", t.leise)}>gegenüber Bezug ohne PV</dd>
              </div>
            </dl>

            {speicher && (
              <div className={cn("mt-3 flex items-center gap-3 rounded-2xl px-4 py-3 transition-opacity duration-500", t.kachel, mitSpeicher ? "opacity-100" : "opacity-85")}>
                <span aria-hidden="true" className={cn("relative h-9 w-5 shrink-0 overflow-hidden rounded-[5px] ring-[1.5px]", dunkel ? "ring-white/40" : "ring-ink-400")}>
                  <span className="w24lp-pegel absolute inset-0.5 rounded-[3px] bg-gradient-to-t from-navy-500 to-navy-300" style={{ transform: `scaleY(${mitSpeicher ? Math.max(0.04, aK[3]) : 0.04})` }} />
                </span>
                <p className={cn("text-[12.5px] leading-snug", t.sub)}>
                  {mitSpeicher ? (
                    aK[3] > 0.02 ? (
                      <>
                        Speicher wird aus Überschuss zu <strong className={t.text}>{Math.round(aK[3] * 100)} %</strong> gefüllt und kappt damit die höchsten Bezugsstunden.
                      </>
                    ) : (
                      <>Kaum Solarüberschuss zum Laden – der Speicher bleibt an diesem Tag fast leer.</>
                    )
                  ) : (
                    <>Speicher zuschalten: Überschuss verschieben und die Netzspitze kappen.</>
                  )}
                </p>
              </div>
            )}

            <div key={`${profil.id}-t`} className="ov-tab-panel mt-6 flex-1">
              <p className={cn("text-[14.5px] leading-relaxed", dunkel ? "text-white/75" : "text-ink-700")}>{profil.text}</p>
              {profil.punkte?.length > 0 && (
                <ul className={cn("mt-3 space-y-1.5 text-[14px] leading-snug", t.sub)}>
                  {profil.punkte.map((pt) => (
                    <li key={pt} className="flex gap-2">
                      <span aria-hidden="true" className={cn("mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full", dunkel ? "bg-ov-300" : "bg-ov-500")} />
                      {pt}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            {profil.link && (
              <Link
                href={profil.link.href}
                className={cn("group mt-6 inline-flex min-h-[44px] items-center gap-2 self-start text-[14.5px] font-semibold", dunkel ? "text-ov-300 hover:text-ov-200" : "text-ov-700 hover:text-ov-800")}
              >
                {profil.link.label}
                <ArrowRight aria-hidden="true" className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            )}
          </div>
        </div>
        <p className={cn("border-t px-5 py-4 text-[12.5px] leading-relaxed sm:px-6 md:px-8", t.trenn, t.leise)}>
          {hinweis ||
            "Schematische Veranschaulichung mit typisierten Beispielprofilen (Stundenwerte, wolkenloser Tag) – kein Messwert und keine Ertragsprognose. Speicher schematisch: Kapazität 20 % des Tagesverbrauchs, 90 % Wirkungsgrad, lädt nur aus Solarüberschuss. Belastbare Zahlen liefert die Auswertung Ihres Lastgangs."}
        </p>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Kleine Bausteine                                                    */
/* ------------------------------------------------------------------ */

function Legende({ farbe, rand, linie, children }) {
  return (
    <li className="flex items-center gap-1.5">
      {linie ? (
        <span aria-hidden="true" className="h-[3px] w-4 rounded-full" style={{ background: farbe }} />
      ) : (
        <span aria-hidden="true" className="h-2.5 w-2.5 rounded-[3px]" style={{ background: farbe, boxShadow: rand ? `inset 0 0 0 1px ${rand}` : undefined }} />
      )}
      {children}
    </li>
  );
}

function Anteil({ farbe, label, wert, t }) {
  return (
    <span className={cn("inline-flex items-center gap-1.5", t.sub)}>
      <span aria-hidden="true" className="h-2 w-2 rounded-full" style={{ background: farbe }} />
      {label}
      <strong className={cn("ov-num font-semibold", t.text)}>{Math.round(wert * 100)} %</strong>
    </span>
  );
}

function Ring({ wert, dunkel }) {
  const v = Math.min(1, Math.max(0, wert));
  return (
    <svg viewBox="0 0 64 64" className="h-16 w-16 shrink-0 -rotate-90" aria-hidden="true">
      <circle cx="32" cy="32" r="26" fill="none" stroke={dunkel ? "rgba(255,255,255,0.1)" : "#eef0f4"} strokeWidth="7" />
      <circle cx="32" cy="32" r="26" fill="none" stroke="url(#w24lp-ring)" strokeWidth="7" strokeLinecap="round" pathLength="100" strokeDasharray={`${r1(v * 100)} 100`} />
      <defs>
        <linearGradient id="w24lp-ring" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#aed083" />
          <stop offset="1" stopColor="#558227" />
        </linearGradient>
      </defs>
    </svg>
  );
}

/** Mini-Lastgang je Betriebsart (Sommerprofil) mit angedeuteter Solarkurve. */
function Mini({ werte, an, dunkel }) {
  const mw = 160;
  const mh = 34;
  const max = Math.max(...werte, 0.01);
  const p = werte.map((v, h) => [((h + 0.5) / 24) * mw, r1(mh - 3 - (v / max) * (mh - 7))]);
  const pts = [[0, p[0][1]], ...p, [mw, p[p.length - 1][1]]];
  const linie = glatterPfad(pts);
  const sonne = glatterPfad(
    pvKurve(3.15, 13.1).map((f, h, a) => [((h + 0.5) / 24) * mw, r1(mh - 1 - (f / Math.max(...a)) * (mh - 10))])
  );
  const farbe = an ? (dunkel ? "#03122b" : "#ffffff") : dunkel ? "rgba(255,255,255,0.75)" : "#03122b";
  return (
    <svg viewBox={`0 0 ${mw} ${mh}`} preserveAspectRatio="none" className="block h-8 w-full" aria-hidden="true">
      <defs>
        <linearGradient id={`w24lp-mini-${an ? "an" : "aus"}-${dunkel ? "d" : "h"}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffc53d" stopOpacity={an ? 0.7 : dunkel ? 0.38 : 0.5} />
          <stop offset="1" stopColor="#ffc53d" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={`${sonne} L${mw},${mh} L0,${mh} Z`} fill={`url(#w24lp-mini-${an ? "an" : "aus"}-${dunkel ? "d" : "h"})`} />
      <path d={linie} fill="none" stroke={farbe} strokeWidth="1.75" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}
