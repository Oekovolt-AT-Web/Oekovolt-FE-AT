"use client";

// src/components/GewerbeUnikat/K7Stresstest.js
//
// K7 · B – 25 Jahre & Stresstest (Client, Teil der K7-Bühne). Rechnet das Stundenmodell (K7Modell:
// drei Läufe rechneGewerbePv + stresstest()) entprellt (150 ms + useDeferredValue, 5 Läufe ≈ 15 ms) und
// zeichnet den kumulierten Cashflow als Fächer (K7Faecher, d3):
//  - Aufbau beim ersten Sichtkontakt: die erwartete Linie zeichnet sich allein (Band und Ränder noch
//    unsichtbar), danach öffnet sich aus ihr das Band zwischen konservativ und günstig (der „Fächer“),
//    zuletzt erscheinen Marker und Direktbeschriftung.
//  - Neue Eingaben (Pult, Steckbrief): Linien gleiten 420 ms in die neue Lage, Beschriftungen per CSS.
//  - Fadenkreuz per Zeiger (touch-action: pan-y – Scrollen bleibt frei) und als natives Gegenstück die
//    Ableseleiste (range 0–25, aria-valuetext); Ausgaben in <output>, Ansage gedrosselt.
//  - Reduzierte Bewegung: sofort Endzustand, kein Pfad-Zeichnen, kein Gleiten.

import { useCallback, useDeferredValue, useEffect, useMemo, useRef, useState } from "react";
import { animate, m, useMotionValue, useTransform } from "motion/react";
import { BEWEGUNG } from "./_tokens.js";
import { useAnsage, useImSichtfeld, useMobil, useProBild, useReduzierteBewegung, Zahl } from "./_gestaltung.js";
import { FAECHER, FaecherSvg, JAHRE, faecherGeo, pfadBand, pfadLinie } from "./K7Faecher.js";
import { MODELL_ANNAHMEN, modellRechnen, modellSchluessel } from "./K7Modell.js";
import { FaecherBereich, FaecherTabelle, Lesespalte, faecherAnnahmen, modellUnterzeile } from "./K7Ansicht.js";
import { Ableseleiste } from "./K7Regler.js";
import { tsd } from "./K7Rechnen.js";

const mischen = (a, b, t) => a.map((p, i) => [p[0] + (b[i][0] - p[0]) * t, p[1] + (b[i][1] - p[1]) * t]);
const spreizen = (rand, mitte, s) => rand.map((p, i) => [p[0], mitte[i][1] + (p[1] - mitte[i][1]) * s]);

function WertGleitend({ wert, format }) {
  return <Zahl wert={wert} format={format} />;
}

/**
 * @param {object} p
 * @param {object} p.eingabe { kwp, dachart, ortId, verbrauchKwh, schichten, arbeitspreisCt, einspeiseCt, eag }
 * @param {object} p.orte    Ortsliste der Hülle { slug: { name, sued35, ostwest15, flach10 } }
 * @param {object} p.start   Modell des Startzustands (vom Server gerechnet)
 * @param {object} p.info    { ortName, dachart, verbrauchKwh, schichten } für die Unterzeile
 * @param {(mod:object)=>void} [p.onModell]  jüngstes Modell (Entscheider-Mappe)
 * @param {()=>void} [p.onGesehen]           Fächer war sichtbar (Erkenntnis)
 * @param {any} [p.erkenntnis]               Erkenntnis-Satz (Bühne entscheidet, wann)
 * @param {boolean} [p.beispiel]             synthetischer Beispielbetrieb (Satz im Konjunktiv, „im Beispiel“)
 */
export default function K7Stresstest({ eingabe, orte, start, info, onModell, onGesehen, erkenntnis, beispiel = true }) {
  const ruhig = useReduzierteBewegung();
  const mobil = useMobil();

  // --- Rechnen: entprellt + aufgeschoben ---------------------------------------------------------------
  const schluessel = modellSchluessel(eingabe);
  const eingabeRef = useRef(eingabe);
  eingabeRef.current = eingabe;
  const [entprellt, setEntprellt] = useState(eingabe);
  useEffect(() => {
    const t = setTimeout(() => setEntprellt(eingabeRef.current), 150);
    return () => clearTimeout(t);
  }, [schluessel]);
  const verzoegert = useDeferredValue(entprellt);
  const vSchluessel = modellSchluessel(verzoegert);
  const mod = useMemo(
    () => (vSchluessel === start.schluessel ? start : modellRechnen(verzoegert, orte)),
    // verzoegert ändert sich genau dann, wenn sich vSchluessel ändert
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [vSchluessel, start, orte]
  );
  const rechnet = schluessel !== vSchluessel;

  useEffect(() => {
    onModell?.(mod);
  }, [mod, onModell]);

  // --- Geometrie in gemessener Breite --------------------------------------------------------------------
  const boxRef = useRef(null);
  const [breite, setBreite] = useState(0);
  useEffect(() => {
    const el = boxRef.current;
    if (!el || typeof ResizeObserver === "undefined") return undefined;
    const ro = new ResizeObserver(([e]) => setBreite(Math.round(e.contentRect.width)));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  const g = mobil ? FAECHER.mobil : FAECHER.desktop;
  const w = breite > 0 ? breite : g.w;
  const geo = useMemo(() => faecherGeo(mod.reihen, mod.amort, g, w), [mod, g, w]);

  // --- Aufbau beim ersten Sichtkontakt ----------------------------------------------------------------------
  const figurRef = useRef(null);
  const gesehen = useImSichtfeld(figurRef, { schwelle: 0.35 });
  // Steht der Fächer beim Laden schon im Bild (Sprung über #wirtschaftlichkeit), kein Aufbau: der
  // SSR-Platzhalter zeigt ihn bereits vollständig – nichts soll wieder verschwinden.
  const [sofort] = useState(() => {
    if (typeof window === "undefined") return true;
    const el = typeof document !== "undefined" ? document.querySelector('[data-kapitel="k7"] [data-testid="faecher"]') : null;
    const r = el?.getBoundingClientRect();
    return Boolean(r && r.top < window.innerHeight && r.bottom > 0);
  });
  const ohneAufbau = ruhig || sofort;
  const spreizung = useMotionValue(ohneAufbau ? 1 : 0);
  const [zeichnen, setZeichnen] = useState(ohneAufbau);
  // Band und Ränder bleiben unsichtbar, bis die erwartete Linie gezeichnet ist – erst dann öffnet sich der
  // Fächer aus ihr heraus (vorher lagen die hellen Ränder schon voll gezeichnet unter der „sich zeichnenden“ Linie)
  const [faechern, setFaechern] = useState(ohneAufbau);
  const [beschriftet, setBeschriftet] = useState(ohneAufbau);
  useEffect(() => {
    if (!gesehen) return undefined;
    onGesehen?.();
    if (ohneAufbau) {
      spreizung.set(1);
      setZeichnen(true);
      setFaechern(true);
      setBeschriftet(true);
      return undefined;
    }
    setZeichnen(true);
    const f = setTimeout(() => setFaechern(true), 700);
    const c = animate(spreizung, 1, { duration: 0.9, ease: BEWEGUNG.ease.aus, delay: 0.75 });
    const t = setTimeout(() => setBeschriftet(true), 1450);
    return () => {
      c.stop();
      clearTimeout(f);
      clearTimeout(t);
    };
  }, [gesehen, ohneAufbau, spreizung, onGesehen]);
  const randProps = {
    initial: { opacity: ohneAufbau ? 1 : 0 },
    animate: { opacity: faechern ? 1 : 0 },
    transition: { duration: ohneAufbau ? 0 : 0.35, ease: BEWEGUNG.ease.aus },
  };

  // --- Gleiten zwischen Geometrien (nur bei neuem Modell; Breitenwechsel springt) ---------------------------
  const vonRef = useRef(geo);
  const zielRef = useRef(geo);
  const modRef = useRef(mod);
  const fort = useMotionValue(1);
  const version = useMotionValue(0);
  useEffect(() => {
    if (zielRef.current === geo) return undefined;
    const neuesModell = modRef.current !== mod;
    modRef.current = mod;
    const t = fort.get();
    const jetzt = { k: mischen(vonRef.current.k, zielRef.current.k, t), e: mischen(vonRef.current.e, zielRef.current.e, t), gg: mischen(vonRef.current.gg, zielRef.current.gg, t) };
    zielRef.current = geo;
    if (ruhig || !neuesModell || jetzt.k.length !== geo.k.length) {
      vonRef.current = geo;
      fort.set(1);
      version.set(version.get() + 1);
      return undefined;
    }
    vonRef.current = jetzt;
    fort.set(0);
    version.set(version.get() + 1);
    const c = animate(fort, 1, { duration: 0.42, ease: BEWEGUNG.ease.aus });
    return () => c.stop();
  }, [geo, mod, ruhig, fort, version]);

  const aktuell = useTransform([fort, spreizung, version], ([t, s]) => {
    const v = vonRef.current;
    const z = zielRef.current;
    const e = mischen(v.e, z.e, t);
    const k = spreizen(mischen(v.k, z.k, t), e, s);
    const gg = spreizen(mischen(v.gg, z.gg, t), e, s);
    return { k, e, gg };
  });
  const dBand = useTransform(aktuell, (a) => pfadBand(a.k, a.gg));
  const dK = useTransform(aktuell, (a) => pfadLinie(a.k));
  const dE = useTransform(aktuell, (a) => pfadLinie(a.e));
  const dG = useTransform(aktuell, (a) => pfadLinie(a.gg));

  // --- Ablesen (Zeiger + Leiste) ------------------------------------------------------------------------------
  const svgRef = useRef(null);
  const [lese, setLese] = useState(null);
  const [ansage, ansagen] = useAnsage();
  const geoRef = useRef(geo);
  geoRef.current = geo;
  const zeigen = useProBild((clientX) => {
    const el = svgRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const gg = geoRef.current;
    const x = ((clientX - rect.left) / rect.width) * gg.w;
    const j = Math.round((x - gg.x0) / gg.schritt);
    setLese(Math.min(JAHRE, Math.max(0, j)));
  });
  const jahr = lese ?? JAHRE;
  useEffect(() => {
    if (lese == null) return;
    const r = mod.reihen;
    const f = (v) => `${v < 0 ? "minus " : ""}${tsd(Math.abs(v))} Tausend Euro`;
    ansagen(`Jahr ${lese}: konservativ ${f(r.k[lese])}, erwartet ${f(r.e[lese])}, günstig ${f(r.g[lese])}.`);
  }, [lese, mod, ansagen]);
  const valuetext = useCallback((j) => `Jahr ${j}: erwartet ${mod.reihen.e[j] < 0 ? "minus " : ""}${tsd(Math.abs(mod.reihen.e[j]))} Tausend Euro kumuliert`, [mod]);

  const ziehen = useRef(false);
  const svgEreignisse = {
    onPointerDown: (e) => {
      ziehen.current = e.pointerType !== "mouse";
      zeigen(e.clientX);
    },
    onPointerMove: (e) => {
      if (e.pointerType === "mouse" || ziehen.current) zeigen(e.clientX);
    },
    onPointerUp: () => {
      ziehen.current = false;
    },
    onPointerCancel: () => {
      ziehen.current = false;
    },
    onPointerLeave: (e) => {
      if (e.pointerType === "mouse") setLese(null);
    },
  };

  const label = `Fächer des kumulierten Cashflows über 25 Jahre: konservativ ${tsd(mod.reihen.k[JAHRE])}, erwartet ${tsd(mod.reihen.e[JAHRE])}, günstig ${tsd(mod.reihen.g[JAHRE])} Tausend Euro nach 25 Jahren.`;

  return (
    <FaecherBereich
      unterzeile={modellUnterzeile(mod, info)}
      annahmen={faecherAnnahmen(MODELL_ANNAHMEN)}
      grafik={
        <div ref={figurRef}>
          <div
            ref={boxRef}
            className={["relative w-full transition-opacity duration-300", rechnet ? "opacity-80" : "opacity-100"].join(" ")}
            style={{ aspectRatio: `${g.w} / ${g.h}`, touchAction: "pan-y" }}
          >
            <FaecherSvg
              ref={svgRef}
              geo={geo}
              Pfad={m.path}
              pfade={{ band: dBand, k: dK, e: dE, g: dG }}
              pfadProps={{
                band: randProps,
                k: randProps,
                g: randProps,
                e: {
                  initial: { pathLength: ohneAufbau ? 1 : 0 },
                  animate: { pathLength: zeichnen ? 1 : 0 },
                  transition: { duration: ohneAufbau ? 0 : 0.75, ease: BEWEGUNG.ease.inAus },
                },
              }}
              lese={lese}
              gleiten={!ruhig}
              beschriftet={beschriftet}
              role="img"
              aria-label={label}
              style={{ display: "block", overflow: "visible", touchAction: "pan-y", userSelect: "none" }}
              {...svgEreignisse}
            />
          </div>
        </div>
      }
      leiste={<Ableseleiste jahr={jahr} onWert={setLese} valuetext={valuetext(jahr)} />}
      lese={
        <div className="min-w-0">
          <Lesespalte mod={mod} jahr={lese} Wert={WertGleitend} erkenntnis={erkenntnis} live beispiel={beispiel} />
          <p className="sr-only" aria-live="polite">
            {ansage}
          </p>
        </div>
      }
      unten={<FaecherTabelle mod={mod} />}
    />
  );
}
