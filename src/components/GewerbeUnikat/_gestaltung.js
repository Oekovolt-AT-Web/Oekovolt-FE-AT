"use client";

// src/components/GewerbeUnikat/_gestaltung.js
//
// Gemeinsame CLIENT-Hooks und kleine Client-Bausteine der Unikat-Seite /gewerbe.
// Alle Kapitel-Inseln benutzen diese Hooks statt eigener Varianten – damit reduzierte Bewegung, Sichtfeld,
// Nachladen und Ansagen überall gleich funktionieren.
//
// WICHTIG
//  - Nur aus Client-Komponenten importieren. Server-Komponenten nehmen Konstanten aus ./_tokens.js und
//    statische Bausteine aus ./_bausteine.js (diese Datei hat "use client"; Konstanten über sie in einer
//    Server-Komponente zu importieren liefert Client-Referenzen statt Werte).
//  - Keine Animationsbibliothek hier importieren: motion, three, d3-* werden erst vom Vorlauf-Agenten
//    installiert und nur in den Kapitel-Dateien (bzw. per next/dynamic) geladen.
//  - Alles SSR-sicher: Vor der Hydrierung liefern die Hooks den ruhigen Endzustand
//    (useReduzierteBewegung → false, aber Kapitel zeigen ohne JS ohnehin den Endzustand).

import { createContext, useCallback, useContext, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { BEWEGUNG, BREITE, zahl } from "./_tokens";

// Hinweis: Tokens (FARBE, BEDEUTUNG, BEWEGUNG, KENNZEICHNUNG, zahl …) direkt aus "./_tokens" importieren –
// ein `export *` ist in einer "use client"-Datei in Next.js nicht erlaubt.

// ---------------------------------------------------------------------------------------------------
// Medienabfragen
// ---------------------------------------------------------------------------------------------------

function medienStore(abfrage) {
  return {
    subscribe(cb) {
      if (typeof window === "undefined" || !window.matchMedia) return () => {};
      const mq = window.matchMedia(abfrage);
      mq.addEventListener?.("change", cb);
      return () => mq.removeEventListener?.("change", cb);
    },
    get() {
      return typeof window !== "undefined" && !!window.matchMedia && window.matchMedia(abfrage).matches;
    },
  };
}
const STORES = new Map();
function useMedien(abfrage, serverWert = false) {
  let s = STORES.get(abfrage);
  if (!s) {
    s = medienStore(abfrage);
    STORES.set(abfrage, s);
  }
  return useSyncExternalStore(s.subscribe, s.get, () => serverWert);
}

/** true bei prefers-reduced-motion: reduce. Dann: kein Intro, keine Partikel, kein Pfad-Zeichnen, sofort Endzustand. */
export function useReduzierteBewegung() {
  return useMedien("(prefers-reduced-motion: reduce)", false);
}

/** true unter 768 px (Mobil-Layout der Grafiken: hochkant, Daumenzone). Server: false. */
export function useMobil() {
  return useMedien(`(max-width: ${BREITE.md - 1}px)`, false);
}

/** true bei grober Zeigersteuerung (Touch) – z. B. Lupe per langem Druck statt Hover. */
export function useTouch() {
  return useMedien("(pointer: coarse)", false);
}

/**
 * true, wenn das Gerät schwere Grafik besser auslässt (Datensparmodus, wenig Speicher/Kerne).
 * Für den 3D-Rückfall in K2. Nur im Browser auswertbar; Server: false.
 */
export function useSchwachesGeraet() {
  const [schwach, setSchwach] = useState(false);
  useEffect(() => {
    try {
      const n = navigator;
      const spar = n.connection?.saveData === true;
      const speicher = typeof n.deviceMemory === "number" && n.deviceMemory < 4;
      const kerne = typeof n.hardwareConcurrency === "number" && n.hardwareConcurrency < 4;
      setSchwach(spar || speicher || kerne);
    } catch {
      setSchwach(false);
    }
  }, []);
  return schwach;
}

// ---------------------------------------------------------------------------------------------------
// Sichtfeld und Nachladen
// ---------------------------------------------------------------------------------------------------

/**
 * Sichtbarkeit eines Elements.
 * einmal = true: bleibt true, sobald das Element einmal sichtbar war (Aufbau-Animationen).
 * einmal = false: folgt der Sichtbarkeit (Dauerbewegung außerhalb des Bildes pausieren).
 * Ohne IntersectionObserver: true.
 */
export function useImSichtfeld(ref, { einmal = true, schwelle = 0.15, rand = "0px 0px -10% 0px" } = {}) {
  const [sichtbar, setSichtbar] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    if (!("IntersectionObserver" in window)) {
      setSichtbar(true);
      return undefined;
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setSichtbar(true);
          if (einmal) io.disconnect();
        } else if (!einmal) setSichtbar(false);
      },
      { threshold: schwelle, rootMargin: rand }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [ref, einmal, schwelle, rand]);
  return sichtbar;
}

/**
 * true, sobald das Element in die Nähe des Bildschirms kommt (Standard: 1,5 Bildschirmhöhen davor).
 * Für das Nachladen schwerer Inseln (3D, große Canvas) BEVOR der Besucher ankommt.
 */
export function useNaehe(ref, { rand = "150% 0px 150% 0px" } = {}) {
  return useImSichtfeld(ref, { einmal: true, schwelle: 0, rand });
}

/**
 * Rendert children erst, wenn der Platzhalter in die Nähe kommt. Children ist typischerweise eine
 * next/dynamic-Komponente – ihr Chunk wird dadurch erst dann geladen. Der Platzhalter muss dieselbe
 * Fläche reservieren (aspect-ratio), sonst springt das Layout.
 */
export function NahInsel({ children, platzhalter = null, rand, className }) {
  const ref = useRef(null);
  const nah = useNaehe(ref, rand ? { rand } : undefined);
  return (
    <div ref={ref} className={className}>
      {nah ? children : platzhalter}
    </div>
  );
}

/**
 * Platzhalter-Weitergabe für next/dynamic: Der `loading`-Zustand einer dynamischen Bühne zeigt denselben
 * Platzhalter wie NahInsel (SSR-Startzustand oder GrafikPlatz) – kein Flackern, kein Springen.
 *
 *   // KxInsel.js ("use client")
 *   const Buehne = dynamic(() => import("./KxBuehne"), { ssr: false, loading: PlatzhalterAnzeige });
 *   export default function KxInsel({ platzhalter, ...props }) {
 *     return <InselRahmen platzhalter={platzhalter}><Buehne {...props} /></InselRahmen>;
 *   }
 */
export const PlatzhalterKontext = createContext(null);

/** Als `loading` an next/dynamic übergeben (zeigt den Platzhalter aus InselRahmen). */
export function PlatzhalterAnzeige() {
  return useContext(PlatzhalterKontext);
}

/** NahInsel + Platzhalter-Kontext: lädt die Bühne erst in Bildschirmnähe, bis dahin der Platzhalter. */
export function InselRahmen({ platzhalter = null, rand, className, children }) {
  return (
    <NahInsel platzhalter={platzhalter} rand={rand} className={className}>
      <PlatzhalterKontext.Provider value={platzhalter}>{children}</PlatzhalterKontext.Provider>
    </NahInsel>
  );
}

/** Führt fn einmal im Leerlauf nach dem Laden aus (requestIdleCallback, sonst setTimeout). */
export function useLeerlauf(fn, { timeout = 2500 } = {}) {
  const fnRef = useRef(fn);
  fnRef.current = fn;
  useEffect(() => {
    let id;
    const los = () => fnRef.current?.();
    if (typeof window.requestIdleCallback === "function") {
      id = window.requestIdleCallback(los, { timeout });
      return () => window.cancelIdleCallback?.(id);
    }
    id = window.setTimeout(los, 600);
    return () => window.clearTimeout(id);
  }, [timeout]);
}

// ---------------------------------------------------------------------------------------------------
// Takt: Bildwiederholrate, Ansagen, gleitende Zahlen
// ---------------------------------------------------------------------------------------------------

/**
 * Bündelt häufige Aufrufe (pointermove, Regler) auf höchstens einen je Bild (requestAnimationFrame).
 * const ziehen = useProBild((x) => setSchwelle(x));
 */
export function useProBild(fn) {
  const fnRef = useRef(fn);
  fnRef.current = fn;
  const raf = useRef(0);
  const letzte = useRef(null);
  useEffect(() => () => cancelAnimationFrame(raf.current), []);
  return useCallback((...args) => {
    letzte.current = args;
    if (raf.current) return;
    raf.current = requestAnimationFrame(() => {
      raf.current = 0;
      fnRef.current?.(...letzte.current);
    });
  }, []);
}

/**
 * Ansagen für Screenreader (aria-live="polite"), gedrosselt: nur der letzte Text nach `pause` ms Ruhe.
 * const [ansage, ansagen] = useAnsage();  …  <p aria-live="polite" className="sr-only">{ansage}</p>
 */
export function useAnsage(pause = 450) {
  const [text, setText] = useState("");
  const t = useRef(0);
  useEffect(() => () => clearTimeout(t.current), []);
  const ansagen = useCallback(
    (neu) => {
      clearTimeout(t.current);
      t.current = setTimeout(() => setText(neu), pause);
    },
    [pause]
  );
  return [text, ansagen];
}

/**
 * Gleitender Zahlenwert (ease-out) zum Ziel. Erster Render = Ziel (kein Hochzählen beim Laden, keine
 * Hydrierungs-Abweichung); erst Änderungen gleiten. Bei reduzierter Bewegung sofort am Ziel.
 */
export function useZahlGleiten(ziel, { dauer = 420 } = {}) {
  const ruhig = useReduzierteBewegung();
  const [wert, setWert] = useState(ziel);
  const vonRef = useRef(ziel);
  const rafRef = useRef(0);
  useEffect(() => {
    cancelAnimationFrame(rafRef.current);
    if (!Number.isFinite(ziel)) {
      setWert(ziel);
      return undefined;
    }
    const von = Number.isFinite(vonRef.current) ? vonRef.current : ziel;
    if (ruhig || von === ziel) {
      vonRef.current = ziel;
      setWert(ziel);
      return undefined;
    }
    const start = performance.now();
    const schritt = (jetzt) => {
      const p = Math.min(1, (jetzt - start) / dauer);
      const e = 1 - Math.pow(1 - p, 4);
      const v = von + (ziel - von) * e;
      vonRef.current = v;
      setWert(v);
      if (p < 1) rafRef.current = requestAnimationFrame(schritt);
    };
    rafRef.current = requestAnimationFrame(schritt);
    return () => cancelAnimationFrame(rafRef.current);
  }, [ziel, dauer, ruhig]);
  return wert;
}

/**
 * Animierte Zahl mit tabellarischen Ziffern. Rendert SSR den Zielwert.
 * <Zahl wert={34360} stellen={0} vor="≈ " nach=" €" />
 */
export function Zahl({ wert, stellen = 0, vor = "", nach = "", format, className, dauer }) {
  const v = useZahlGleiten(wert, { dauer });
  const text = format ? format(v) : zahl(v, stellen);
  return (
    <span className={["ov-num", className].filter(Boolean).join(" ")}>
      {vor}
      {text}
      {nach}
    </span>
  );
}

/**
 * Einblenden beim Eintritt (CSS-Übergang, ohne Bibliothek): opacity + y um BEWEGUNG.weg px.
 * Vor der Hydrierung und bei reduzierter Bewegung: sichtbar (Endzustand). Für motion-freie Stellen.
 */
export function Erscheinen({ as: Tag = "div", verzoegerung = 0, className, children, ...rest }) {
  const ref = useRef(null);
  const ruhig = useReduzierteBewegung();
  const [bereit, setBereit] = useState(false);
  const sichtbar = useImSichtfeld(ref);
  useEffect(() => {
    const el = ref.current;
    if (!el || ruhig) return;
    const r = el.getBoundingClientRect();
    // Nur verstecken, wenn das Element beim Hydrieren noch unter dem Bildschirm liegt
    if (r.top > window.innerHeight * 0.92) setBereit(true);
  }, [ruhig]);
  const versteckt = bereit && !sichtbar && !ruhig;
  return (
    <Tag
      ref={ref}
      className={className}
      style={{
        opacity: versteckt ? 0.01 : 1,
        transform: versteckt ? `translateY(${BEWEGUNG.weg}px)` : "none",
        transition: ruhig ? "none" : `opacity ${BEWEGUNG.dauer.lang}s ${BEWEGUNG.css.aus} ${verzoegerung}s, transform ${BEWEGUNG.dauer.lang}s ${BEWEGUNG.css.aus} ${verzoegerung}s`,
      }}
      {...rest}
    >
      {children}
    </Tag>
  );
}

// ---------------------------------------------------------------------------------------------------
// Bedienung
// ---------------------------------------------------------------------------------------------------

/**
 * Tastatur für Direktmanipulation (Deckel, Fadenkreuz, Lineal): Pfeile = schritt, Bild↑/↓ = grob,
 * Pos1/Ende = min/max. Gibt einen onKeyDown-Handler zurück.
 */
export function useTastenRegler({ wert, setWert, min, max, schritt = 1, grob = 10, achse = "y" }) {
  return useCallback(
    (e) => {
      const plus = achse === "y" ? ["ArrowUp", "ArrowRight"] : ["ArrowRight", "ArrowUp"];
      const minus = achse === "y" ? ["ArrowDown", "ArrowLeft"] : ["ArrowLeft", "ArrowDown"];
      let neu = null;
      if (plus.includes(e.key)) neu = wert + schritt;
      else if (minus.includes(e.key)) neu = wert - schritt;
      else if (e.key === "PageUp") neu = wert + grob;
      else if (e.key === "PageDown") neu = wert - grob;
      else if (e.key === "Home") neu = min;
      else if (e.key === "End") neu = max;
      if (neu == null) return;
      e.preventDefault();
      setWert(Math.min(max, Math.max(min, neu)));
    },
    [wert, setWert, min, max, schritt, grob, achse]
  );
}

/** Gefüllte Segment-Auswahl (Radiogruppe) – Tabs/Pillen ohne Rahmen, Tastatur über native Radios. */
export function Segment({ name, wert, setWert, optionen, dunkel = false, klein = false, className, label }) {
  return (
    <fieldset className={["min-w-0", className].filter(Boolean).join(" ")}>
      {label && <legend className={dunkel ? "mb-2 text-[12.5px] font-semibold text-white/60" : "mb-2 text-[12.5px] font-semibold text-ink-500"}>{label}</legend>}
      <div className={["inline-flex max-w-full flex-wrap gap-1 rounded-full p-1", dunkel ? "bg-white/[0.07]" : "bg-ink-100"].join(" ")}>
        {optionen.map((o) => {
          const aktiv = o.id === wert;
          return (
            <label
              key={o.id}
              className={[
                "relative flex cursor-pointer select-none items-center justify-center rounded-full font-semibold transition-colors duration-200",
                klein ? "min-h-9 px-3 text-[13px]" : "min-h-11 px-4 text-[14px]",
                aktiv ? (dunkel ? "bg-white text-navy-950" : "bg-navy-950 text-white") : dunkel ? "text-white/75 hover:bg-white/10" : "text-ink-700 hover:bg-white",
                "has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-ov-500",
              ].join(" ")}
            >
              <input type="radio" name={name} value={o.id} checked={aktiv} onChange={() => setWert(o.id)} className="sr-only" />
              {o.label}
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
