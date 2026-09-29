"use client";

import { useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import { Check, ChevronDown, Link2, Minus, Plus, Share2 } from "lucide-react";
import Teilen from "@/components/ui/Teilen";
import { cn } from "@/components/ui/cn";
import { ereignis } from "@/lib/statistik";

/* ------------------------------------------------------------------
   Gemeinsame Bausteine der Gewerbe-Rechner (E-Flotte, Ladeinfrastruktur).
   Ergänzen die Rechner-Bausteine unter src/components/Rechner/bausteine.js.
   ------------------------------------------------------------------ */

const bewegungReduziert = () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * Weicher Übergang zwischen zwei Zahlenreihen (für SVG-Diagramme). Server-HTML und
 * erster Client-Render enthalten die Zielwerte – kein Hydration-Unterschied.
 */
export function useReihenUebergang(ziel, dauer = 650) {
  const [werte, setWerte] = useState(ziel);
  const aktuell = useRef(ziel);
  const schluessel = ziel.join("|");

  useEffect(() => {
    const von = aktuell.current;
    if (bewegungReduziert() || von.length !== ziel.length) {
      aktuell.current = ziel;
      setWerte(ziel);
      return;
    }
    let raf;
    const start = performance.now();
    const schritt = (t) => {
      const p = Math.min((t - start) / dauer, 1);
      const e = 1 - Math.pow(1 - p, 3);
      const v = ziel.map((z, i) => von[i] + (z - von[i]) * e);
      aktuell.current = v;
      setWerte(v);
      if (p < 1) raf = requestAnimationFrame(schritt);
    };
    raf = requestAnimationFrame(schritt);
    return () => cancelAnimationFrame(raf);
    // schluessel fasst den Inhalt von ziel zusammen
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [schluessel, dauer]);

  return werte;
}

/**
 * Einblend-Fortschritt 0 → 1, sobald das Element sichtbar wird (Linien „zeichnen“).
 * Ohne IntersectionObserver oder bei reduzierter Bewegung sofort 1.
 */
export function useEinblenden(dauer = 1100) {
  const ref = useRef(null);
  const [p, setP] = useState(1);
  // Layout-Effekt: vor dem ersten Zeichnen auf 0 setzen – kein kurzes Aufblitzen
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el || bewegungReduziert() || typeof IntersectionObserver === "undefined") return;
    setP(0);
    let raf;
    const io = new IntersectionObserver(
      ([eintrag]) => {
        if (!eintrag.isIntersecting) return;
        io.disconnect();
        const start = performance.now();
        const schritt = (t) => {
          const x = Math.min((t - start) / dauer, 1);
          setP(1 - Math.pow(1 - x, 3));
          if (x < 1) raf = requestAnimationFrame(schritt);
        };
        raf = requestAnimationFrame(schritt);
      },
      { threshold: 0.25 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [dauer]);
  return [ref, p];
}

/** Liest einmalig geteilte Eingaben aus der URL (nach dem ersten Render). */
export function useGeteilteEingaben(auslesen, uebernehmen) {
  const gelesen = useRef(false);
  useEffect(() => {
    if (gelesen.current) return;
    gelesen.current = true;
    try {
      const e = auslesen(new URLSearchParams(window.location.search));
      if (e) uebernehmen(e);
    } catch {
      /* ungültige Parameter ignorieren */
    }
    // nur beim ersten Laden
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}

/** Zähler mit −/+ (große Trefferflächen) und direkter Eingabe. */
export function Stepper({ label, sub, wert, min = 0, max = 999, schritt = 1, onChange, einheit, klein = false }) {
  const id = useId();
  const setze = (v) => onChange(Math.min(max, Math.max(min, Math.round(v))));
  return (
    <div className="flex items-center justify-between gap-3">
      <label htmlFor={id} className="min-w-0">
        <span className={cn("block font-semibold leading-snug text-ink-800", klein ? "text-[14px]" : "text-[14.5px]")}>{label}</span>
        {sub && <span className="block truncate text-[12.5px] leading-snug text-ink-500">{sub}</span>}
      </label>
      <div className="flex shrink-0 items-center rounded-full bg-white ring-1 ring-ink-200">
        <button
          type="button"
          onClick={() => setze(wert - schritt)}
          disabled={wert <= min}
          aria-label={`${label} verringern`}
          className="flex h-11 w-11 items-center justify-center rounded-full text-ink-700 transition-colors hover:bg-ink-100 disabled:opacity-35"
        >
          <Minus aria-hidden="true" className="h-4 w-4" />
        </button>
        <input
          id={id}
          type="number"
          inputMode="numeric"
          min={min}
          max={max}
          value={wert}
          onChange={(e) => {
            const n = Number(e.target.value);
            if (Number.isFinite(n)) setze(n);
          }}
          className="ov-num w-12 bg-transparent text-center font-display text-[18px] font-extrabold text-ink-900 outline-none [appearance:textfield] focus-visible:ring-2 focus-visible:ring-ov-500 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
        />
        {einheit && <span className="sr-only">{einheit}</span>}
        <button
          type="button"
          onClick={() => setze(wert + schritt)}
          disabled={wert >= max}
          aria-label={`${label} erhöhen`}
          className="flex h-11 w-11 items-center justify-center rounded-full text-ink-700 transition-colors hover:bg-ink-100 disabled:opacity-35"
        >
          <Plus aria-hidden="true" className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

/** Zielgruppen-Presets als Kartenleiste (horizontal scrollbar auf dem Handy). */
export function PresetLeiste({ presets, aktiv, onWahl, icons = {}, titel = "Beispiel wählen" }) {
  return (
    <div>
      <p className="mb-3 flex items-center justify-between gap-3 text-[11.5px] font-semibold uppercase tracking-[0.16em] text-ink-500">
        <span>{titel}</span>
        {aktiv === "individuell" && <span className="normal-case tracking-normal text-ov-700">Individuell angepasst</span>}
      </p>
      <div className="ov-no-scrollbar -mx-5 flex snap-x gap-2.5 overflow-x-auto px-5 pb-1 sm:-mx-6 sm:px-6 md:mx-0 md:grid md:grid-cols-5 md:overflow-visible md:px-0">
        {presets.map((p) => {
          const an = aktiv === p.id;
          const Icon = icons[p.id];
          return (
            <button
              key={p.id}
              type="button"
              onClick={() => onWahl(p.id)}
              aria-pressed={an}
              className={cn(
                "group relative flex min-h-[76px] w-[176px] shrink-0 snap-start flex-col items-start rounded-2xl px-4 py-3 text-left transition-all duration-300 md:w-auto",
                an ? "bg-navy-950 text-white shadow-[0_14px_30px_-16px_rgba(3,18,43,0.8)]" : "bg-white text-ink-900 ring-1 ring-ink-200/80 hover:-translate-y-0.5 hover:ring-ov-300",
              )}
            >
              <span className="flex w-full items-center justify-between gap-2">
                <span className="font-display text-[15px] font-bold leading-tight">{p.label}</span>
                {Icon && <Icon aria-hidden="true" className={cn("h-4 w-4 shrink-0", an ? "text-ov-300" : "text-ov-600")} />}
              </span>
              <span className={cn("mt-1 text-[12.5px] leading-snug", an ? "text-white/70" : "text-ink-500")}>{p.kurz}</span>
              {an && <span aria-hidden="true" className="absolute inset-x-4 -bottom-px h-[3px] rounded-full bg-ov-400" />}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/** Aufklappbarer Block (z. B. „Fahrzeugdaten anpassen“) */
export function Aufklapper({ titel, zusatz, children, offen: start = false, icon: Icon }) {
  const [offen, setOffen] = useState(start);
  const id = useId();
  return (
    <div className="rounded-2xl bg-white ring-1 ring-ink-200/80">
      <button type="button" aria-expanded={offen} aria-controls={id} onClick={() => setOffen((o) => !o)} className="flex min-h-12 w-full items-center gap-3 px-4 py-3 text-left">
        {Icon && <Icon aria-hidden="true" className="h-4 w-4 shrink-0 text-ov-600" />}
        <span className="min-w-0 flex-1">
          <span className="block text-[14px] font-semibold text-ink-800">{titel}</span>
          {zusatz && <span className="block truncate text-[12.5px] text-ink-500">{zusatz}</span>}
        </span>
        <ChevronDown aria-hidden="true" className={cn("h-4 w-4 shrink-0 text-ink-500 transition-transform duration-300", offen && "rotate-180")} />
      </button>
      <div id={id} hidden={!offen} className="space-y-6 border-t border-ink-100 px-4 pb-5 pt-4">
        {children}
      </div>
    </div>
  );
}

/** Teilen: Link mit den Eingaben kopieren oder über Netzwerke teilen. */
export function ErgebnisLink({ pfad, query, titel, text, kampagne }) {
  const [offen, setOffen] = useState(false);
  const [kopiert, setKopiert] = useState(false);
  const [url, setUrl] = useState("");

  const bauen = () => {
    const basis = process.env.NODE_ENV === "production" ? "https://www.oekovolt.com" : window.location.origin;
    return `${basis}${pfad}?${query}`;
  };
  const oeffnen = () => {
    if (offen) return setOffen(false);
    setUrl(bauen());
    setOffen(true);
    ereignis("rechner_teilen_geoeffnet", { rechner: kampagne });
  };
  const kopieren = async () => {
    const u = bauen();
    setUrl(u);
    try {
      await navigator.clipboard.writeText(u);
      setKopiert(true);
      setTimeout(() => setKopiert(false), 2200);
    } catch {
      setOffen(true);
    }
  };

  return (
    <div className="rounded-2xl bg-white ring-1 ring-ink-200/70">
      <div className="flex flex-wrap items-center gap-2 p-2 pl-4">
        <span className="flex shrink-0 items-center gap-2 whitespace-nowrap text-[14px] font-semibold text-ink-800">
          <Share2 aria-hidden="true" className="h-4 w-4 shrink-0 text-ov-600" />
          Ergebnis teilen
          <span className="hidden text-[12.5px] font-normal text-ink-500 xl:inline">· Link mit Ihren Eingaben, ohne persönliche Daten</span>
        </span>
        <span className="ml-auto flex items-center gap-1">
          <button
            type="button"
            onClick={kopieren}
            className={cn(
              "inline-flex h-10 items-center gap-1.5 rounded-full px-4 text-[13px] font-semibold transition-colors",
              kopiert ? "bg-ov-600 text-white" : "bg-ink-100 text-ink-800 hover:bg-ink-200",
            )}
          >
            {kopiert ? <Check aria-hidden="true" className="h-4 w-4" /> : <Link2 aria-hidden="true" className="h-4 w-4" />}
            {kopiert ? "Kopiert" : "Link kopieren"}
          </button>
          <button type="button" onClick={oeffnen} aria-expanded={offen} className="inline-flex h-10 items-center rounded-full px-3 text-[13px] font-semibold text-ov-700 hover:bg-ov-50">
            Mehr
          </button>
        </span>
      </div>
      <p className="sr-only" aria-live="polite">
        {kopiert ? "Link in die Zwischenablage kopiert" : ""}
      </p>
      {offen && url && <Teilen url={url} titel={titel} text={text} kampagne={kampagne} netze={["linkedin", "whatsapp", "xing", "x"]} kompakt className="border-t border-ink-100 px-4 py-3" />}
    </div>
  );
}

/** Kleine Info-Zeile mit Ton */
export function Hinweis({ ton = "info", icon: Icon, children, className }) {
  const toene = {
    info: "bg-ink-50 text-ink-700 ring-ink-200/70",
    gruen: "bg-ov-50 text-ink-800 ring-ov-200",
    warnung: "bg-sun-300/20 text-ink-800 ring-sun-400/40",
    pflicht: "bg-navy-50 text-ink-800 ring-navy-100",
  };
  return (
    <p className={cn("flex gap-2.5 rounded-2xl px-4 py-3 text-[13.5px] leading-relaxed ring-1", toene[ton] || toene.info, className)}>
      {Icon && <Icon aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-ov-700" />}
      <span>{children}</span>
    </p>
  );
}

/** Drei Schritte vom Rechenergebnis zur Umsetzung (füllt die Ergebnisspalte sinnvoll) */
export function NaechsteSchritte({ schritte }) {
  return (
    <div className="mt-7 rounded-3xl bg-ink-50 p-5 md:p-6">
      <p className="text-[12.5px] font-semibold uppercase tracking-[0.14em] text-ink-500">So geht es weiter</p>
      <ol className="mt-4 grid gap-4 md:grid-cols-3">
        {schritte.map(([titel, text], i) => (
          <li key={titel} className="flex gap-3 md:block">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-navy-950 font-display text-[14px] font-extrabold text-white md:mb-3">{i + 1}</span>
            <span>
              <span className="block font-display text-[15.5px] font-bold leading-snug text-ink-900">{titel}</span>
              <span className="mt-1 block text-[13px] leading-relaxed text-ink-600">{text}</span>
            </span>
          </li>
        ))}
      </ol>
    </div>
  );
}
