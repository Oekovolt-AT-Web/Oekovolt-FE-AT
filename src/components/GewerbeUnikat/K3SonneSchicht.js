"use client";

// src/components/GewerbeUnikat/K3SonneSchicht.js
//
// Kapitel 03 – Client-Bühne „Sonne trifft Schicht“ (per next/dynamic aus K3Insel, nur in Bildschirmnähe).
//  A · Knick-Kurve: Eigenverbrauch, Autarkie und Grenz-Eigenverbrauch über der Anlagengröße, Läufer mit
//      steifer Feder (motion), natives range als Griff (48 px), Sprungmarken, Ablese-Zeiger. Direkt am Regler
//      der WOCHENSTREIFEN (dieselbe Juniwoche wie im Hero): Beim Ziehen blüht der Überschuss an Feiertag und
//      Wochenende auf, die Werktage bleiben grün; jenseits der 1,5-fachen Empfehlung leuchtet die Linie
//      „nächste kWh selbst genutzt“ einmal auf und wird direkt beschriftet.
//  B · Drei Tage im Detail: Werktag, Samstag, Betriebsurlaub – PV genutzt/übrig, E-Flotte (mobil: Tagwahl).
//  C · Was Überschuss wert ist: Referenzmarktwert PV gegen den Wert der selbst genutzten kWh, Weiche.
// Rechnen: Daten aus useGewerbeDaten() (Worker), je Bild nur simuliere()/ueberschussTeile() (≈ 0,2 ms) und
// Raster-Schnitte; Kurve und Empfehlung mit Flotte entprellt (150 ms). Steckbrief und Erkenntnis „Knick“
// beim Loslassen (kein Text springt mitten im Ziehen). Bei reduzierter Bewegung: kein Feder-Weg, kein
// Pfad-Zeichnen, kein Aufleuchten.

import { useCallback, useEffect, useId, useLayoutEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { AnimatePresence, LazyMotion, MotionConfig, domAnimation, m, useMotionValue, useSpring } from "motion/react";
import { BEWEGUNG, FARBE, zahl } from "./_tokens";
import { Erkenntnis } from "./_bausteine";
import { Segment, useAnsage, useImSichtfeld, useMobil, useProBild, useReduzierteBewegung, useTastenRegler, Zahl } from "./_gestaltung";
import { steckbrief, useSteckbrief } from "./_steckbrief";
import { useGewerbeDaten, vorwaermen } from "./_daten";
import { ereignis } from "@/lib/statistik";
import K3Ansicht, { bandKurz, geo, grenzBeschriftung, grenzTextLage, kurvenSkalen, laeuferZone, LaeuferSvg, monatText, rbBox, textBreite } from "./K3Ansicht";
import K3Woche from "./K3Woche";
import {
  FLOTTE_MAX,
  KNICK_FAKTOR,
  MIN_KWP,
  MODELLHALLE_KWP,
  RECHENBEISPIEL_KWP,
  aufRaster,
  bandAusStart,
  bandDaten,
  bandYMax,
  empfehlung,
  jahresArbeitstage,
  kurve,
  kurveFuerZeichnung,
  kurvenWert,
  kwhMitFlotte,
  ladeprofil,
  sprungmarken,
  startWerte,
  ueberschussRuhe,
  ueberschussTeile,
  vorbereiten,
  werteFuer,
  wocheDaten,
  wocheWaehlen,
  wocheYMax,
} from "./K3Modell";

const AUSRICHTUNG_TEXT = { ostwest: "Ost-West", sued: "Süd", flach: "Flachdach Süd" };
const FEDER = { stiffness: BEWEGUNG.feder.steif.stiffness, damping: BEWEGUNG.feder.steif.damping, mass: BEWEGUNG.feder.steif.mass };
const p0 = (a) => zahl(a * 100);
const ct2 = (v) => zahl(v, 2);

/** Breite ab … px (eigene kleine Medienabfrage – useMobil kennt nur die 768-px-Grenze). */
const MQ = new Map();
function useBreitAb(px) {
  const q = `(min-width: ${px}px)`;
  let s = MQ.get(q);
  if (!s) {
    s = {
      subscribe(cb) {
        if (typeof window === "undefined" || !window.matchMedia) return () => {};
        const mq = window.matchMedia(q);
        mq.addEventListener?.("change", cb);
        return () => mq.removeEventListener?.("change", cb);
      },
      get: () => typeof window !== "undefined" && !!window.matchMedia && window.matchMedia(q).matches,
    };
    MQ.set(q, s);
  }
  return useSyncExternalStore(s.subscribe, s.get, () => false);
}

/** Wert erst nach `ms` Ruhe übernehmen (Flotte → Kurve und Empfehlung neu). */
function useEntprellt(wert, ms) {
  const [v, setV] = useState(wert);
  useEffect(() => {
    if (v === wert) return undefined;
    const t = setTimeout(() => setV(wert), ms);
    return () => clearTimeout(t);
  }, [wert, ms, v]);
  return v;
}

/** Breite eines Elements (ResizeObserver) – Grafiken zeichnen in Pixeln, Schrift bleibt scharf. */
function useBreite(ref) {
  const [b, setB] = useState(null);
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const mess = () => {
      const w = Math.round(el.getBoundingClientRect().width);
      if (w > 0) setB(w);
    };
    mess();
    if (typeof ResizeObserver === "undefined") return undefined;
    const ro = new ResizeObserver(mess);
    ro.observe(el);
    return () => ro.disconnect();
  }, [ref]);
  return b;
}

/** Einmaliges Aufleuchten der Grenz-Linie beim Überschreiten des Knicks (Web Animations, kein Dauerpuls). */
function GlanzPfad({ knick, ruhig, d, ...rest }) {
  const ref = useRef(null);
  const vorher = useRef(knick);
  useEffect(() => {
    const war = vorher.current;
    vorher.current = knick;
    if (ruhig || !knick || war || !ref.current?.animate) return;
    ref.current.animate([{ opacity: 0 }, { opacity: 0.85, offset: 0.25 }, { opacity: 0 }], { duration: 1200, easing: "ease-out" });
  }, [knick, ruhig]);
  if (ruhig) return null;
  return <path ref={ref} d={d} opacity="0" {...rest} />;
}

/**
 * Kurven-Pfade der Bühne: gleiten bei neuer Kurve (Startbild → gerechnete Kurve, Flotte, Dachart) – gleiche
 * Punktzahl, deshalb echtes Morphen statt Neu-Zeichnen. Gezeichnet (pathLength) wird nur, wenn die Kurve beim
 * Laden der Bühne noch nicht zu sehen war; die EV-Fläche blendet mit den Linien ein.
 */
function FederPfad({ art, d, ruhig, zeichnen, sichtbar, knick, ...rest }) {
  if (art === "glanz") return <GlanzPfad knick={knick} ruhig={ruhig} d={d} {...rest} />;
  const voll = !zeichnen || sichtbar;
  const sofort = ruhig || !zeichnen;
  const dUeb = { duration: 0.42, ease: BEWEGUNG.ease.aus };
  if (art === "flaeche") {
    return (
      <m.path
        {...rest}
        initial={sofort ? false : { opacity: 0, d }}
        animate={{ opacity: voll ? 1 : 0, d }}
        transition={ruhig ? { duration: 0 } : { opacity: { duration: BEWEGUNG.dauer.lang, delay: zeichnen ? 0.35 : 0 }, d: dUeb }}
      />
    );
  }
  if (art === "grenz") {
    // gestrichelt: einblenden statt zeichnen (pathLength würde die Strichelung ersetzen)
    const { strokeOpacity, strokeWidth, ...ohne } = rest;
    return (
      <m.path
        {...ohne}
        initial={sofort ? { opacity: 1, d, strokeOpacity, strokeWidth } : { opacity: 0, d, strokeOpacity, strokeWidth }}
        animate={{ opacity: voll ? 1 : 0, d, strokeOpacity: knick ? 0.95 : 0.5, strokeWidth: knick ? 2 : 1.4 }}
        transition={
          ruhig
            ? { duration: 0 }
            : { opacity: { duration: BEWEGUNG.dauer.lang, delay: zeichnen ? 0.55 : 0 }, d: dUeb, strokeOpacity: { duration: BEWEGUNG.dauer.mittel }, strokeWidth: { duration: BEWEGUNG.dauer.mittel } }
        }
      />
    );
  }
  return (
    <m.path
      {...rest}
      initial={sofort ? false : { pathLength: 0, d }}
      animate={{ pathLength: voll ? 1 : 0, d }}
      transition={ruhig ? { duration: 0 } : { pathLength: { duration: BEWEGUNG.dauer.intro, ease: BEWEGUNG.ease.aus }, d: dUeb }}
    />
  );
}

/** Ablese-Zeiger unter der Maus (nur feine Zeiger): Linie, Punkte, Ablesung als Pille auf der x-Achse. */
function ZeigerSvg({ g, xMax, punkte, k }) {
  const { sx, sy } = kurvenSkalen(g, xMax);
  const x = sx(k);
  const ev = kurvenWert(punkte, k, "ev");
  const au = kurvenWert(punkte, k, "aut");
  const kw = `${zahl(Math.round(k / 5) * 5)} kWp`;
  const evT = `Eigenverbrauch ${p0(ev)}\u00a0%`;
  const auT = `Autarkie ${p0(au)}\u00a0%`;
  const f = g.schrift;
  const w = textBreite(`${kw} · ${evT} · ${auT}`, f, false) + 22;
  const hP = f + 10;
  const cx = Math.max(g.l + w / 2 - 36, Math.min(g.w - w / 2 - 2, x));
  const y = g.h - g.b + 2;
  return (
    <g pointerEvents="none" data-testid="k3-zeiger">
      <line x1={x} x2={x} y1={g.t} y2={g.h - g.b} stroke="rgba(255,255,255,0.4)" strokeDasharray="2 3" />
      <circle cx={x} cy={sy(ev)} r="3.5" fill={FARBE.ov400} />
      <circle cx={x} cy={sy(au)} r="3.5" fill={FARBE.navy300} />
      <rect x={cx - w / 2} y={y} width={w} height={hP} rx={hP / 2} fill={FARBE.navy800} />
      <text x={cx} y={y + hP / 2 + f * 0.36} textAnchor="middle" fontSize={f} fill="#fff" className="ov-num">
        <tspan fontWeight="700">{kw}</tspan>
        <tspan fill="rgba(255,255,255,0.5)"> · </tspan>
        <tspan fill={FARBE.ov300}>{evT}</tspan>
        <tspan fill="rgba(255,255,255,0.5)"> · </tspan>
        <tspan fill={FARBE.navy200}>{auT}</tspan>
      </text>
    </g>
  );
}

/** Erkenntnis erst nach der Interaktion; Hinweis, dass sie im Steckbrief landet. Mobil kürzerer Zusatz. */
function ErkenntnisBox({ zeigen, id, text, zusatz, zusatzKurz, aktion, ruhig }) {
  return (
    <AnimatePresence initial={false}>
      {zeigen && (
        <m.div
          key={id}
          data-erkenntnis={id}
          className="mt-8 max-w-[68ch] md:mt-10"
          initial={ruhig ? false : { opacity: 0, y: BEWEGUNG.weg }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, transition: { duration: ruhig ? 0 : BEWEGUNG.dauer.kurz } }}
          transition={{ duration: ruhig ? 0 : BEWEGUNG.dauer.lang, ease: BEWEGUNG.ease.aus }}
        >
          <Erkenntnis dunkel>{text}</Erkenntnis>
          {zusatz && <p className={["mt-2 pl-5 text-[14.5px] leading-relaxed text-white/75", zusatzKurz ? "hidden sm:block" : ""].join(" ")}>{zusatz}</p>}
          {zusatzKurz && <p className="mt-2 pl-5 text-[14px] leading-snug text-white/75 sm:hidden">{zusatzKurz}</p>}
          {aktion && (
            <div className="mt-3 pl-5">
              <button
                type="button"
                onClick={aktion.onClick}
                data-testid={aktion.testid}
                className="inline-flex min-h-11 items-center gap-2 rounded-full bg-white/10 px-4 text-[14px] font-semibold text-white transition-colors hover:bg-white/15"
              >
                {aktion.label}
              </button>
            </div>
          )}
          <p className="mt-2 pl-5 text-[12.5px] text-white/60">
            Im Projektsteckbrief gesammelt ·{" "}
            <a href="#fahrplan" className="underline decoration-white/30 underline-offset-2 hover:decoration-white/70">
              Kapitel 08
            </a>
          </p>
        </m.div>
      )}
    </AnimatePresence>
  );
}

/** Wochenstreifen mit dem Federwert des Läufers: nur diese kleine Ansicht rendert je Bild neu. */
function WocheLive({ feder, kwpZiel, woche, yMax, jahrBei, quelle, idBasis }) {
  const [k, setK] = useState(() => feder.get());
  useEffect(() => feder.on("change", (v) => setK(v)), [feder]);
  useEffect(() => {
    setK(feder.get());
  }, [kwpZiel, feder]);
  const jahr = jahrBei(k);
  return <K3Woche woche={woche} kwp={k} kwpText={kwpZiel} yMax={yMax} jahr={jahr} quelle={quelle} idBasis={idBasis} />;
}

/** War das Instrument beim Laden der Bühne schon im Bild? Dann wird die Kurve nicht neu gezeichnet. */
function warImBild() {
  if (typeof document === "undefined") return true;
  const el = document.querySelector('[data-kapitel="k3"] [data-k3]');
  if (!el) return false;
  const r = el.getBoundingClientRect();
  return r.top < window.innerHeight && r.bottom > 0;
}

export default function K3SonneSchicht({ start, markt, flotteAnnahme, ortNamen = {} }) {
  const ruhig = useReduzierteBewegung();
  const mobil = useMobil();
  const breit = useBreitAb(1024);
  const stufeMarkt = mobil ? "mobil" : breit ? "desktop" : "mittel";
  const daten = useGewerbeDaten();
  const sb = useSteckbrief();
  const idBasis = `k3${useId().replace(/[^a-zA-Z0-9]/g, "")}`;
  const [ansage, ansagen] = useAnsage();
  const [zeichnen] = useState(() => !warImBild());

  // Ohne Hero (Vorschau) selbst anstoßen – idempotent
  useEffect(() => {
    vorwaermen();
  }, []);

  // ------------------------------------------------------------------ Daten
  const bereit = daten.status === "bereit" && !!daten.last && !!daten.pv;
  const last = bereit ? daten.last : null;
  const pv = bereit ? daten.pv : null;
  const vor = useMemo(() => (last ? vorbereiten(last) : null), [last]);
  const eigen = last?.quelle === "eigen";

  const empfBasis = pv ? pv.empfehlung.kwp : start.empfKwp;
  const xMax = pv ? pv.kurveMax : start.xMax;
  const dachAusK2 = Number.isFinite(sb.kwpMax) && sb.kwpMax > 0;
  const dachKwp = dachAusK2 ? sb.kwpMax : MODELLHALLE_KWP;
  const max = Math.max(MIN_KWP + 10, Math.floor(Math.min(xMax, dachKwp) / 5) * 5);
  const maxRef = useRef(max);
  maxRef.current = max;

  const [wahl, setWahl] = useState(null);
  const kwp = aufRaster(wahl ?? sb.kwp ?? empfBasis, MIN_KWP, max);
  const [fest, setFest] = useState(null);
  const kwpFest = aufRaster(fest ?? sb.kwp ?? empfBasis, MIN_KWP, max);

  // ------------------------------------------------------------------ E-Flotte
  const [nWahl, setNWahl] = useState(null);
  const n = Math.max(0, Math.min(FLOTTE_MAX, Math.round(nWahl ?? sb.flotte ?? 0) || 0));
  const nE = useEntprellt(n, 150);
  const jahrJeFzg = (flotteAnnahme.km * flotteAnnahme.kwh100) / 100;
  // Jahresbedarf je Fahrzeug ÷ Arbeitstage eines JAHRES (auch bei Lastgängen unter einem Jahr)
  const bedarfTag = vor ? jahrJeFzg / jahresArbeitstage(vor) : null;
  const slots = vor?.slots ?? 96;
  const profil = useMemo(() => ladeprofil(bedarfTag ? n : 0, bedarfTag, slots), [n, bedarfTag, slots]);
  const profilE = useMemo(() => ladeprofil(bedarfTag ? nE : 0, bedarfTag, slots), [nE, bedarfTag, slots]);
  const kwhE = useMemo(() => {
    if (!last || !vor) return null;
    return nE > 0 ? kwhMitFlotte(last.reihe.kwh, vor, profilE, last.raster.typ) : last.reihe.kwh;
  }, [last, vor, nE, profilE]);
  const kurveRoh = useMemo(() => (pv && kwhE ? (nE > 0 ? kurve(kwhE, pv.reihe, pv.kurveMax, 60) : pv.kurve) : null), [pv, kwhE, nE]);
  const punkte = useMemo(() => (kurveRoh ? kurveFuerZeichnung(kurveRoh) : start.punkte), [kurveRoh, start.punkte]);
  const empfMitFlotte = useMemo(() => {
    if (!pv || !kwhE || nE <= 0) return null;
    let s = 0;
    for (let i = 0; i < kwhE.length; i++) s += kwhE[i];
    return empfehlung(kwhE, pv.reihe, s, pv.jahresErtrag, 0.8).kwp;
  }, [pv, kwhE, nE]);
  const mitFlotte = nE > 0 && empfMitFlotte != null;
  const empfKwp = mitFlotte ? empfMitFlotte : empfBasis;

  // ------------------------------------------------------------------ Werte (je Bild)
  const werte = useMemo(() => (pv && kwhE ? werteFuer(kwhE, pv.reihe, kwp) : startWerte(start, kwp)), [pv, kwhE, kwp, start]);
  const werteFest = useMemo(() => (pv && kwhE ? werteFuer(kwhE, pv.reihe, kwpFest) : startWerte(start, kwpFest)), [pv, kwhE, kwpFest, start]);
  const werteOhne = useMemo(() => (pv && last && nE > 0 ? werteFuer(last.reihe.kwh, pv.reihe, kwp) : null), [pv, last, nE, kwp]);
  const werteEmp = useMemo(() => (pv && kwhE ? werteFuer(kwhE, pv.reihe, empfKwp) : null), [pv, kwhE, empfKwp]);
  // Knick: Linie leuchtet live (SVG, kein Layout), die Erkenntnis folgt dem übernommenen Wert (beim Loslassen)
  const knickLive = kwp > KNICK_FAKTOR * empfKwp;
  const zeigKnick = !!pv && kwpFest > KNICK_FAKTOR * empfKwp;
  const ruheFest = useMemo(() => (zeigKnick && vor && kwhE ? ueberschussRuhe(kwhE, pv.reihe, kwpFest, vor) : null), [zeigKnick, vor, kwhE, pv, kwpFest]);
  const ruheEmp = useMemo(() => (vor && kwhE && pv ? ueberschussRuhe(kwhE, pv.reihe, empfKwp, vor) : start.ruheEmp), [vor, kwhE, pv, empfKwp, start.ruheEmp]);

  const baender = useMemo(() => {
    if (pv && vor) return vor.auswahl.map((t) => bandDaten(last, pv, t, kwp, profil, vor));
    return start.baender.map((b) => bandAusStart(b, kwp, start.woche));
  }, [pv, vor, last, kwp, profil, start.baender, start.woche]);
  const yMax = useMemo(() => bandYMax(baender), [baender]);
  const [tagAktiv, setTagAktiv] = useState(0);
  const tagIndex = Math.min(tagAktiv, Math.max(0, baender.length - 1));

  // Wochenstreifen: dieselbe Woche wie im Hero (eigene Daten: Woche des gewählten Werktags)
  const d0 = useMemo(() => (last && vor ? wocheWaehlen(last, vor) : -1), [last, vor]);
  const wocheBasis = useMemo(() => (last && pv && vor && d0 >= 0 ? wocheDaten(last, pv, vor, d0, null) : null), [last, pv, vor, d0]);
  const wocheMitFlotte = useMemo(() => (wocheBasis && n > 0 ? wocheDaten(last, pv, vor, d0, profil) : wocheBasis), [wocheBasis, n, last, pv, vor, d0, profil]);
  const woche = pv ? wocheMitFlotte : start.woche;
  const wocheY = useMemo(() => {
    const w = pv ? wocheBasis : start.woche;
    return w ? wocheYMax(w, max) : 100;
  }, [pv, wocheBasis, start.woche, max]);
  const ueberMax = useMemo(
    () => (pv && kwhE && vor ? ueberschussTeile(kwhE, pv.reihe, max, vor).gesamt / 1000 : startWerte(start, max).ueberschussMwh),
    [pv, kwhE, vor, max, start]
  );
  const jahrBei = useCallback(
    (k) => {
      if (pv && kwhE && vor) {
        const t = ueberschussTeile(kwhE, pv.reihe, k, vor);
        return { mwh: t.gesamt / 1000, anteil: t.anteil, maxMwh: ueberMax };
      }
      const w = startWerte(start, k);
      return { mwh: w.ueberschussMwh, anteil: w.ruhe, maxMwh: ueberMax };
    },
    [pv, kwhE, vor, ueberMax, start]
  );

  const eigenCt = Number.isFinite(sb.vermiedenCt) && sb.vermiedenCt > 0 ? sb.vermiedenCt : markt.eigenCt;
  const marktLive = useMemo(() => ({ ...markt, eigenCt }), [markt, eigenCt]);
  const ortId = pv?.ortId ?? daten.ortId ?? start.ortId;
  const ausrichtung = pv?.ausrichtung ?? daten.ausrichtung ?? start.ausrichtung;
  const ortLabel = `${ortNamen[ortId] || ortId} · ${AUSRICHTUNG_TEXT[ausrichtung] || ausrichtung}`;
  const marken = useMemo(() => sprungmarken(empfKwp, max, dachKwp, mitFlotte), [empfKwp, max, dachKwp, mitFlotte]);

  // ------------------------------------------------------------------ Steckbrief
  const aktuell = useRef({});
  aktuell.current = { kwp, werte, n };
  const [uebernahme, setUebernahme] = useState(0);
  useEffect(() => {
    if (!uebernahme) return;
    const { kwp: k, werte: w, n: nn } = aktuell.current;
    steckbrief.setze({ kwp: k, evQuote: Math.round(w.ev * 1000) / 1000, autarkie: Math.round(w.aut * 1000) / 1000, flotte: nn }, "k3");
  }, [uebernahme]);
  const flotteBeruehrt = useRef(false);
  useEffect(() => {
    if (!flotteBeruehrt.current) return;
    setUebernahme((c) => c + 1);
  }, [nE]);

  // ------------------------------------------------------------------ Feder-Läufer
  const kwpMV = useMotionValue(kwp);
  const feder = useSpring(kwpMV, FEDER);
  const zieht = useRef(false);
  const druck = useRef(false);
  useEffect(() => {
    if (ruhig || zieht.current) {
      kwpMV.jump(kwp);
      feder.jump(kwp);
    } else kwpMV.set(kwp);
  }, [kwp, ruhig, kwpMV, feder]);

  const kurveRef = useRef(null);
  const marktRef = useRef(null);
  const breiteKurve = useBreite(kurveRef);
  const breiteMarkt = useBreite(marktRef);
  const kurveSichtbar = useImSichtfeld(kurveRef, { schwelle: 0.1 });
  const gKurve = geo("kurve", mobil, breiteKurve);

  const lRef = {
    linie: useRef(null),
    ev: useRef(null),
    aut: useRef(null),
    grenz: useRef(null),
    evText: useRef(null),
    autText: useRef(null),
    grenzText: useRef(null),
  };
  const fuellRef = useRef(null);
  const pilleRef = useRef(null);
  const grenzZeilen = grenzBeschriftung(gKurve, werte.grenz);
  const malen = useRef(null);
  malen.current = (k) => {
    const g = gKurve;
    const { sx, sy } = kurvenSkalen(g, xMax);
    const x = sx(k);
    const yEv = sy(kurvenWert(punkte, k, "ev"));
    const yAut = sy(kurvenWert(punkte, k, "aut"));
    const yGr = sy(kurvenWert(punkte, k, "grenz"));
    const setze = (r, attrs) => {
      if (r.current) for (const [a, v] of Object.entries(attrs)) r.current.setAttribute(a, String(v));
    };
    setze(lRef.linie, { x1: x, x2: x });
    setze(lRef.ev, { cx: x, cy: yEv });
    setze(lRef.aut, { cx: x, cy: yAut });
    setze(lRef.grenz, { cx: x, cy: yGr });
    const links = x > g.w - g.r - 64;
    const dx = links ? -11 : 11;
    const abstand = yAut - yEv;
    const evDy = abstand < 22 ? -((22 - abstand) / 2) : 0;
    const autDy = abstand < 22 ? (22 - abstand) / 2 : 0;
    setze(lRef.evText, { x: x + dx, y: yEv + 4.5 + evDy, "text-anchor": links ? "end" : "start" });
    setze(lRef.autText, { x: x + dx, y: yAut + 4.5 + autDy, "text-anchor": links ? "end" : "start" });
    const lage = grenzTextLage(g, punkte, sx, sy, k, grenzZeilen, RECHENBEISPIEL_KWP < xMax ? [rbBox(g, sx, RECHENBEISPIEL_KWP)] : []);
    if (lRef.grenzText.current) {
      setze(lRef.grenzText, { x: lage.x, y: lage.y, "text-anchor": lage.anker });
      for (const t of lRef.grenzText.current.querySelectorAll("tspan")) t.setAttribute("x", String(lage.x));
    }
    // Läufer-Pille per transform (kein Layout-Shift), Füllung der Spur
    const a = sx(MIN_KWP);
    if (pilleRef.current) pilleRef.current.style.transform = `translateX(${Math.max(44, Math.min(g.w - 44, x))}px)`;
    if (fuellRef.current) fuellRef.current.style.width = `${(Math.max(0, x - a) / g.w) * 100}%`;
    // Kurven-Beschriftungen am Läufer (und unter der Grenz-Beschriftung) ausblenden
    const zone = laeuferZone(g, x);
    const box = knickLive ? lage.box : null;
    const labels = kurveRef.current?.querySelectorAll("[data-k3-label]") || [];
    for (const el of labels) {
      const x0 = Number(el.dataset.x0);
      const x1 = Number(el.dataset.x1);
      const y0 = Number(el.dataset.y0);
      const y1 = Number(el.dataset.y1);
      // feste Beschriftungen (Rechenbeispiel) weichen nur der Grenz-Beschriftung, Kurven-Beschriftungen auch dem Läufer
      let weg = el.dataset.fest ? false : x0 < zone.x1 && x1 > zone.x0;
      if (!weg && box) weg = x0 < box.x1 + 6 && x1 > box.x0 - 6 && y0 < box.y1 + 4 && y1 > box.y0 - 4;
      el.style.opacity = weg ? "0" : "1";
    }
  };
  useLayoutEffect(() => {
    malen.current?.(feder.get());
  });
  useEffect(() => feder.on("change", (v) => malen.current?.(v)), [feder]);

  // ------------------------------------------------------------------ Bedienung
  const waehle = useCallback((v, { uebernehmen = true } = {}) => {
    const r = aufRaster(v, MIN_KWP, maxRef.current);
    setWahl(r);
    setFest(r);
    if (uebernehmen) setUebernahme((c) => c + 1);
  }, []);
  const ziehen = useProBild((v) => setWahl(aufRaster(v, MIN_KWP, maxRef.current)));
  const tasten = useTastenRegler({ wert: kwp, setWert: (v) => waehle(v), min: MIN_KWP, max, schritt: kwp >= 500 ? 10 : 5, grob: 50, achse: "x" });

  // natives range – unkontrolliert (der Läufer zeigt den Zustand), Loslassen = „change“
  const reglerRef = useRef(null);
  const losRef = useRef(null);
  losRef.current = () => {
    druck.current = false;
    zieht.current = false;
    const el = reglerRef.current;
    if (el) waehle(Number(el.value));
  };
  const losHandler = useCallback(() => losRef.current?.(), []);
  const reglerAnbinden = useCallback(
    (el) => {
      if (reglerRef.current) reglerRef.current.removeEventListener("change", losHandler);
      reglerRef.current = el;
      if (el) el.addEventListener("change", losHandler);
    },
    [losHandler]
  );
  useEffect(() => {
    const el = reglerRef.current;
    if (el && !druck.current && Math.abs(Number(el.value) - kwp) > 0.01) el.value = String(kwp);
  }, [kwp]);

  const valuetext = `${zahl(kwp)} Kilowatt-Peak, Eigenverbrauch ${p0(werte.ev)} Prozent`;

  // Zeiger (nur feine Zeiger), Klick/Tipp = wählen
  const [zeigerKwp, setZeigerKwp] = useState(null);
  const zeigerSetzen = useProBild(setZeigerKwp);
  const kwpAusEreignis = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    const xPx = ((e.clientX - r.left) / Math.max(1, r.width)) * gKurve.w;
    return kurvenSkalen(gKurve, xMax).sx.invert(xPx);
  };
  const kurvenHandler = {
    onPointerMove: (e) => {
      if (e.pointerType !== "mouse" && e.pointerType !== "pen") return;
      zeigerSetzen(Math.max(MIN_KWP, Math.min(max, kwpAusEreignis(e))));
    },
    onPointerLeave: () => zeigerSetzen(null),
    onClick: (e) => waehle(kwpAusEreignis(e)),
  };

  const [zeigerSlot, setZeigerSlot] = useState(null);
  const slotSetzen = useProBild(setZeigerSlot);
  const slotAusEreignis = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    return Math.max(0, Math.min(slots - 1, Math.floor(((e.clientX - r.left) / Math.max(1, r.width)) * slots)));
  };
  const bandHandler = {
    onPointerMove: (e) => {
      if (e.pointerType === "mouse" || e.pointerType === "pen") slotSetzen(slotAusEreignis(e));
    },
    onPointerLeave: (e) => {
      if (e.pointerType === "mouse" || e.pointerType === "pen") slotSetzen(null);
    },
    onClick: (e) => setZeigerSlot(slotAusEreignis(e)),
  };

  // Marktwert: Überfahren = nur Ablesung, Klick/Tastatur = Auswahl (löst die Erkenntnis aus)
  const [monat, setMonat] = useState(null);
  const [monatZeiger, setMonatZeiger] = useState(null);
  const monatZeigerSetzen = useProBild(setMonatZeiger);
  const gMarkt = geo("markt", stufeMarkt, breiteMarkt);
  const iApr = markt.monate.findIndex((x) => x.monat === "2026-04");
  const monatAusEreignis = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    const xPx = ((e.clientX - r.left) / Math.max(1, r.width)) * gMarkt.w;
    return Math.max(0, Math.min(markt.monate.length - 1, Math.floor(((xPx - gMarkt.l) / gMarkt.iw) * markt.monate.length)));
  };
  const marktHandler = {
    onPointerMove: (e) => {
      if (e.pointerType === "mouse" || e.pointerType === "pen") monatZeigerSetzen(monatAusEreignis(e));
    },
    onPointerLeave: () => monatZeigerSetzen(null),
    onClick: (e) => setMonat(monatAusEreignis(e)),
  };

  const setzeFlotte = (v) => {
    const nv = Math.max(0, Math.min(FLOTTE_MAX, Math.round(Number(v)) || 0));
    flotteBeruehrt.current = true;
    setNWahl(nv);
  };

  // ------------------------------------------------------------------ Erkenntnisse
  const gemeldet = useRef(new Set());
  const melde = useCallback(
    (id, text) => {
      if (gemeldet.current.has(id)) return;
      gemeldet.current.add(id);
      steckbrief.erkenntnis(id);
      ereignis("erkenntnis", { id, kapitel: "k3" });
      if (text) ansagen(text);
    },
    [ansagen]
  );

  // Knick: Hauptsatz und Vergleich mit der Empfehlung (88 % an Ruhetagen → jetzt auch werktags Überschuss)
  const ruheOrt = eigen ? "an Wochenenden, Feiertagen und an Tagen mit Betriebsruhe" : "an Wochenenden, Feiertagen und im Betriebsurlaub";
  const knickText = zeigKnick
    ? `${kwpFest >= 1.9 * empfKwp ? "Doppelte Anlage heißt nicht doppelte Ersparnis" : "Mehr Anlage heißt nicht im selben Maß mehr Ersparnis"}: Bei ${zahl(kwpFest)} kWp sinkt der Eigenverbrauch auf ${p0(werteFest.ev)}\u00a0%.`
    : "";
  const ruheVergleich = zeigKnick && ruheFest != null && ruheEmp != null && ruheFest < ruheEmp - 0.02;
  const knickZusatz =
    zeigKnick && werteEmp && werteEmp.eigenMwh > 0
      ? `Gegenüber ${zahl(empfKwp)} kWp: ${zahl(kwpFest / empfKwp, 1)}-fache Anlage, aber nur ${zahl((werteFest.eigenMwh / werteEmp.eigenMwh - 1) * 100)}\u00a0% mehr selbst genutzter Strom${
          werteEmp.ueberschussMwh > 0 ? `; der Überschuss wächst auf das ${zahl(werteFest.ueberschussMwh / werteEmp.ueberschussMwh, 1)}-Fache` : ""
        }.${
          ruheVergleich
            ? ` Bei ${zahl(empfKwp)} kWp entstehen noch ${p0(ruheEmp)}\u00a0% des Überschusses ${ruheOrt}, bei ${zahl(kwpFest)} kWp nur ${p0(ruheFest)}\u00a0% – jetzt bleibt auch werktags Sonne übrig.`
            : ""
        }`
      : null;
  const knickKurz = ruheVergleich
    ? `Bei ${zahl(empfKwp)} kWp entstehen noch ${p0(ruheEmp)}\u00a0% des Überschusses an Ruhetagen, jetzt ${p0(ruheFest)}\u00a0% – auch werktags bleibt Sonne übrig.`
    : null;

  // Flotte: ehrliche Schlagzeile – bei der Empfehlung findet die Flotte werktags kaum freie Sonne
  const zeigFlotte = !!pv && nE > 0 && !!werteOhne;
  const flotteMwh = (nE * jahrJeFzg) / 1000;
  const solarAnteil = zeigFlotte && flotteMwh > 0 ? Math.max(0, (werte.eigenMwh - werteOhne.eigenMwh) / flotteMwh) : null;
  const ruheJetzt = useMemo(() => (zeigFlotte && vor && kwhE ? ueberschussTeile(kwhE, pv.reihe, kwp, vor).anteil : null), [zeigFlotte, vor, kwhE, pv, kwp]);
  const evVon = werteOhne ? p0(werteOhne.ev) : "";
  const evAuf = p0(werte.ev);
  const genau = evVon === evAuf;
  const evVonT = genau && werteOhne ? zahl(werteOhne.ev * 100, 1) : evVon;
  const evAufT = genau ? zahl(werte.ev * 100, 1) : evAuf;
  const wenigSonne = solarAnteil != null && solarAnteil < 0.25;
  const flotteText = zeigFlotte
    ? wenigSonne
      ? `Die Flotte findet werktags kaum freie Sonne: Bei ${zahl(kwp)} kWp braucht der Betrieb den Mittagsstrom schon selbst.`
      : `${nE === 1 ? "Ein Transporter lädt" : `${nE} Transporter laden`} mittags: Eigenverbrauch steigt von ${evVonT} auf ${evAufT}\u00a0% – werktags wird Überschuss zu Ladestrom.`
    : "";
  const amWochenende = wenigSonne && ruheJetzt != null && ruheJetzt >= 0.6;
  const flotteZusatz = zeigFlotte
    ? `${amWochenende ? "Der Überschuss fällt an Wochenenden und Feiertagen an, wenn niemand lädt. " : ""}${nE === 1 ? "Ein Transporter braucht" : `${nE} Transporter brauchen`} ${zahl(flotteMwh)} MWh im Jahr; die Sonne deckt davon ${p0(solarAnteil)}\u00a0%, der Eigenverbrauch steigt von ${evVonT} auf ${evAufT}\u00a0%.${
        empfMitFlotte && empfMitFlotte !== empfBasis ? ` Bei 80 % Eigenverbrauch trägt der Betrieb mit Flotte ${zahl(empfMitFlotte)} statt ${zahl(empfBasis)} kWp.` : ""
      }${wenigSonne ? " Mehr bringt die Flotte mit einer größeren Anlage oder mit Laden, das dem Überschuss folgt." : ""}`
    : null;
  const flotteKurz = zeigFlotte
    ? `${amWochenende ? "Der Überschuss fällt am Wochenende an. " : ""}Sonne deckt ${p0(solarAnteil)}\u00a0% des Ladestroms${empfMitFlotte && empfMitFlotte !== empfBasis ? `; mit Flotte trägt der Betrieb ${zahl(empfMitFlotte)} kWp` : ""}.`
    : null;
  const flotteAktion =
    zeigFlotte && empfMitFlotte && Math.abs(kwp - empfMitFlotte) > 0.5
      ? { label: `Auf ${zahl(empfMitFlotte)} kWp setzen`, onClick: () => waehle(empfMitFlotte), testid: "k3-flotte-uebernehmen" }
      : null;

  // Marktwert: Zusatz zum GEWÄHLTEN Monat (mit dem April als Vergleich)
  const zeigMarkt = monat != null;
  const apr = iApr >= 0 ? markt.monate[iApr] : null;
  const gew = monat != null ? markt.monate[monat] : null;
  const eigenCtQuelle = eigenCt === markt.eigenCt ? "im Rechenbeispiel" : "nach Ihrer Wahl in Kapitel 04";
  const marktText = "Sommerlicher Mittagsstrom ist am Markt wenig wert – selbst genutzt ist er am meisten wert.";
  const marktZusatz = gew
    ? `Im ${monatText(gew.monat)} brachte eingespeister Sonnenstrom im Mittel ${ct2(gew.ct)} ct/kWh${
        apr && gew.monat !== apr.monat && gew.ct > apr.ct ? `, im ${monatText(apr.monat)} nur ${ct2(apr.ct)} ct` : ""
      }; eine selbst genutzte Kilowattstunde spart ${eigenCtQuelle} ${ct2(eigenCt)} ct.`
    : null;

  useEffect(() => {
    if (zeigKnick) melde("k3-knick", knickText);
  }, [zeigKnick]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (zeigFlotte) melde("k3-flotte", flotteText);
  }, [zeigFlotte]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (zeigMarkt) melde("k3-marktwert", marktText);
  }, [zeigMarkt]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (!flotteBeruehrt.current || !pv) return;
    ansagen(`${nE} E-Transporter: Eigenverbrauch ${p0(werte.ev)} Prozent, Autarkie ${p0(werte.aut)} Prozent`);
  }, [nE]); // eslint-disable-line react-hooks/exhaustive-deps

  // ------------------------------------------------------------------ Ansicht
  const ansicht = {
    modus: pv ? "live" : "start",
    mobil,
    stufeMarkt,
    idBasis,
    quelle: eigen ? "eigen" : "beispiel",
    ortLabel,
    rechnet: !bereit || daten.pvLaedt || n !== nE,
    punkte,
    xMax,
    min: MIN_KWP,
    max,
    kwp,
    empfKwp,
    empfLabel: mitFlotte ? "Empfehlung mit Flotte" : "Empfehlung",
    rbKwp: RECHENBEISPIEL_KWP,
    dachKwp,
    dachAusK2,
    werte,
    knick: knickLive,
    kwpFest,
    knickFest: kwpFest > KNICK_FAKTOR * empfKwp,
    marken,
    baender,
    tagAktiv: tagIndex,
    yMax,
    zeigerSlot,
    flotte: { n, max: FLOTTE_MAX, annahme: flotteAnnahme, bedarfTag },
    markt: marktLive,
    monat,
    monatZeiger,
    breiten: { kurve: breiteKurve, markt: breiteMarkt },
    refs: { kurve: kurveRef, markt: marktRef },
    Z: Zahl,
    handlers: { kurve: kurvenHandler, band: bandHandler, markt: marktHandler, marke: (k) => waehle(k) },
    slots: {
      pfad: FederPfad,
      pfadProps: { ruhig, zeichnen: zeichnen && !ruhig, sichtbar: kurveSichtbar },
      laeufer: (g, { sx, sy }) => {
        const k = feder.get();
        return (
          <LaeuferSvg
            g={g}
            x={sx(k)}
            yEv={sy(kurvenWert(punkte, k, "ev"))}
            yAut={sy(kurvenWert(punkte, k, "aut"))}
            yGrenz={sy(kurvenWert(punkte, k, "grenz"))}
            evText={`${p0(werte.ev)}\u00a0%`}
            autText={`${p0(werte.aut)}\u00a0%`}
            grenzZeilen={grenzZeilen}
            grenzLage={grenzTextLage(g, punkte, sx, sy, k, grenzZeilen, RECHENBEISPIEL_KWP < xMax ? [rbBox(g, sx, RECHENBEISPIEL_KWP)] : [])}
            knick={knickLive}
            refs={lRef}
          />
        );
      },
      zeiger: (g) => (zeigerKwp != null ? <ZeigerSvg g={g} xMax={xMax} punkte={punkte} k={zeigerKwp} /> : null),
      leisteRefs: { fuellung: fuellRef, pille: pilleRef },
      woche: <WocheLive feder={feder} kwpZiel={kwp} woche={woche} yMax={wocheY} jahrBei={jahrBei} quelle={eigen ? "eigen" : "beispiel"} idBasis={`${idBasis}-w`} />,
      eingabe: ({ a, b }) => (
        <input
          ref={reglerAnbinden}
          type="range"
          min={MIN_KWP}
          max={max}
          step={5}
          defaultValue={kwp}
          onChange={(e) => ziehen(Number(e.target.value))}
          onKeyDown={tasten}
          onPointerDown={() => {
            druck.current = true;
          }}
          onPointerMove={() => {
            if (druck.current) zieht.current = true;
          }}
          onPointerUp={() => {
            druck.current = false;
          }}
          onPointerCancel={() => {
            druck.current = false;
            zieht.current = false;
          }}
          aria-label="Anlagengröße in Kilowatt-Peak"
          aria-valuetext={valuetext}
          data-testid="kwp-regler"
          className="peer absolute top-0 z-1 m-0 h-14 cursor-pointer appearance-none bg-transparent opacity-0 [&::-moz-range-thumb]:h-12 [&::-moz-range-thumb]:w-12 [&::-moz-range-thumb]:border-0 [&::-webkit-slider-thumb]:h-12 [&::-webkit-slider-thumb]:w-12 [&::-webkit-slider-thumb]:appearance-none"
          style={{ left: `calc(${a}% - 24px)`, width: `calc(${b - a}% + 48px)` }}
        />
      ),
      flotteSteuerung: (
        <div className="flex items-center gap-1 rounded-full bg-white/[0.07] p-1" role="group" aria-labelledby="k3-flotte-label">
          <button
            type="button"
            onClick={() => setzeFlotte(n - 1)}
            disabled={!bereit || n <= 0}
            aria-label="Einen E-Transporter weniger"
            data-testid="flotte-minus"
            className="flex h-12 w-12 items-center justify-center rounded-full text-[22px] font-bold text-white transition-colors hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40 md:h-11 md:w-11"
          >
            −
          </button>
          <input
            type="number"
            inputMode="numeric"
            min={0}
            max={FLOTTE_MAX}
            step={1}
            value={n}
            disabled={!bereit}
            onChange={(e) => setzeFlotte(e.target.value)}
            aria-label="Anzahl E-Transporter, die mittags laden"
            data-testid="flotte"
            className="ov-num h-12 w-12 rounded-full bg-transparent text-center font-display text-[20px] font-extrabold text-white [appearance:textfield] disabled:opacity-60 md:h-11 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
          />
          <button
            type="button"
            onClick={() => setzeFlotte(n + 1)}
            disabled={!bereit || n >= FLOTTE_MAX}
            aria-label="Einen E-Transporter mehr"
            data-testid="flotte-plus"
            className="flex h-12 w-12 items-center justify-center rounded-full text-[22px] font-bold text-white transition-colors hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40 md:h-11 md:w-11"
          >
            +
          </button>
        </div>
      ),
      tagWahl: (
        <div role="group" aria-label="Tag für das Detailband wählen" data-testid="k3-tagwahl">
          <Segment
            name={`${idBasis}-tag`}
            wert={baender[tagIndex]?.id}
            setWert={(id) => setTagAktiv(Math.max(0, baender.findIndex((b) => b.id === id)))}
            optionen={baender.map((b) => ({ id: b.id, label: bandKurz(b) }))}
            dunkel
            klein
          />
        </div>
      ),
      marktEingabe: (
        <input
          type="range"
          min={0}
          max={markt.monate.length - 1}
          step={1}
          value={monat ?? Math.max(0, iApr)}
          onChange={(e) => setMonat(Number(e.target.value))}
          aria-label="Monat des Referenzmarktwerts wählen"
          aria-valuetext={(() => {
            const x = markt.monate[monat ?? Math.max(0, iApr)];
            return `${monatText(x.monat)}: ${ct2(x.ct)} Cent je Kilowattstunde`;
          })()}
          data-testid="marktwert-monat"
          className="sr-only"
        />
      ),
      erkenntnisA: <ErkenntnisBox zeigen={zeigKnick} id="k3-knick" text={knickText} zusatz={knickZusatz} zusatzKurz={knickKurz} ruhig={ruhig} />,
      erkenntnisB: <ErkenntnisBox zeigen={zeigFlotte} id="k3-flotte" text={flotteText} zusatz={flotteZusatz} zusatzKurz={flotteKurz} aktion={flotteAktion} ruhig={ruhig} />,
      erkenntnisC: <ErkenntnisBox zeigen={zeigMarkt} id="k3-marktwert" text={marktText} zusatz={marktZusatz} ruhig={ruhig} />,
      ansage: (
        <p className="sr-only" aria-live="polite">
          {ansage}
        </p>
      ),
    },
  };

  return (
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion="user">
        <K3Ansicht {...ansicht} />
      </MotionConfig>
    </LazyMotion>
  );
}
