"use client";

// src/components/GewerbeUnikat/K4Roentgen.js
//
// K4 · Röntgen der Stromrechnung – interaktive Bühne (per next/dynamic aus K4Insel, erst in Bildschirmnähe).
//
//  - Die Musterrechnung ist die JAHRES-Stromrechnung des Betriebs (synthetischer Beispielbetrieb 884 MWh bzw.
//    – nach dem Gate in K1 – der eigene Lastgang): je Zeile ct/kWh, Balken und Euro je Jahr; Leistungspreis
//    „bleibt – Kapitel 05“; Jahressumme.
//  - Knopf „Rechnung röntgen“ (einmal automatisch, sobald das Ziel – ab lg das Röntgenbild, darunter der Film
//    in der Rechnung – im freien Bild steht und die Zeilen noch darüber): ein Strahl fährt über die Zeilen,
//    der Solar-Anteil jeder Zeile (selbst genutzte kWh ÷ Verbrauch) hebt ab und FLIEGT (motion layoutId,
//    domMax) in den gestapelten Balken „Was der Solarstrom jedes Jahr streicht“. Die Zeilen gleiten auf den
//    Rest, „− x €“ erscheint, die Jahressumme zeigt vorher/nachher. Umkehrbar.
//  - Anlage (Wahl im Röntgenbild bzw. Film – Ursache neben Wirkung): Rechenbeispiel (300 kWp, wie Kurzantwort/
//    K7) oder Stundenmodell (K3: kWp/Eigenverbrauch aus dem Steckbrief bzw. Empfehlung aus dem Lastgang; Start
//    „Modell“, sobald K3 benutzt wurde oder ein eigener Lastgang geladen ist). Netzbereich über Karte, Stadtnetz-Pillen oder select,
//    Netzebene, Energiepreis, Elektrizitätsabgabe → Zeilen, Scheiben, Summen folgen live.
//  - Erkenntnis „k4-faktor“ beim ersten Röntgen (Euro je Jahr + Faktor je kWh); Zusatz auf Netzebene 7.
//  - Steckbrief: setze({ bereich, ne, energieCt, vermiedenCt }, "k4") bei jeder eigenen Wahl. Die Börsen-
//    Zeile (K4BoerseLive) kann den Energiepreis über den Steckbrief setzen – die Bühne folgt.
//  - Reduzierte Bewegung: kein Strahl, kein Flug (ohne layoutId), Zahlen sofort am Ziel.
//
// domMax (Layout-Animationen) wird NUR hier importiert und landet so im K4-Chunk.

import { useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { AnimatePresence, LayoutGroup, LazyMotion, MotionConfig, domMax, m } from "motion/react";
import { ereignis } from "@/lib/statistik";
import { Erkenntnis } from "./_bausteine.js";
import { BEWEGUNG, zahl } from "./_tokens.js";
import { useAnsage, useReduzierteBewegung, Zahl } from "./_gestaltung.js";
import { steckbrief, useSteckbrief } from "./_steckbrief.js";
import { useGewerbeDaten } from "./_daten.js";
import { K4Bild, K4Film, PLOT_PX } from "./K4Bild.js";
import K4Karte from "./K4Karte.js";
import { K4KarteRahmen, K4Legende, K4Pult, K4StadtPillen } from "./K4Pult.js";
import { ABGABE, ANLAGE_BEISPIEL, ENERGIE, ImBereich, K4Gerippe, K4Knopf, K4Rechnung, euroZahl, k4Jahr, k4Werte } from "./K4Rechnung.js";

const klemmen = (v) => Math.min(ENERGIE.max, Math.max(ENERGIE.min, v));
const rund = (v, s) => Math.round(v * 10 ** s) / 10 ** s;
const zuZahl = (text) => Number(String(text).replace(/\s/g, "").replace(",", "."));

/** Flug: Rechnung → Röntgenbild (Zeile für Zeile, wie der Strahl sie erreicht) und zurück. */
/** Der Strahl braucht STRAHL_S für die vier Zeilen; Zeile i hebt ab, sobald er ihre Mitte erreicht. */
const STRAHL_S = 0.72;
const ABFLUG = (i) => 0.02 + (STRAHL_S * (i + 0.5)) / 4;
const FLUG_HIN = (i) => ({ duration: BEWEGUNG.dauer.lang, ease: BEWEGUNG.ease.aus, delay: ABFLUG(i) });
const FLUG_ZURUECK = (i) => ({ duration: 0.55, ease: BEWEGUNG.ease.aus, delay: (3 - i) * 0.07 });
/** Reduzierte Bewegung: keine layoutId (kein Flug) und Layout-Übergänge sofort – MotionConfig „user“ hält Layout-Animationen nicht an. */
const SOFORT = { duration: 0 };
/** Landung der letzten Scheibe (s) – danach gleiten Zeilen und Summen. */
const GELANDET_MS = Math.round((ABFLUG(3) + BEWEGUNG.dauer.lang) * 1000) - 120;

const AUSRICHTUNG_TEXT = { ostwest: "Ost-West", flach: "flach aufgeständert", sued: "Süd" };

/** Unter lg (1024 px): Film in der Rechnung statt großem Röntgenbild (Handy und Tablet hochkant). */
const SCHMAL = "(max-width: 1023px)";
function schmalAbo(cb) {
  const mq = window.matchMedia(SCHMAL);
  mq.addEventListener?.("change", cb);
  return () => mq.removeEventListener?.("change", cb);
}
const schmalLesen = () => window.matchMedia(SCHMAL).matches;
const useSchmal = () => useSyncExternalStore(schmalAbo, schmalLesen, () => false);

/** Eigenverbrauchsquote für eine Anlagengröße aus der Modellkurve [{ kwp, evQuote }] (linear). */
function evAusKurve(kurve, kwp) {
  if (!Array.isArray(kurve) || kurve.length < 2 || !Number.isFinite(kwp)) return null;
  if (kwp <= kurve[0].kwp) return kurve[0].evQuote;
  for (let i = 1; i < kurve.length; i++) {
    const a = kurve[i - 1];
    const b = kurve[i];
    if (kwp <= b.kwp) return a.evQuote + ((b.evQuote - a.evQuote) * (kwp - a.kwp)) / (b.kwp - a.kwp);
  }
  return kurve[kurve.length - 1].evQuote;
}

export default function K4Roentgen({ netz, staedte, abgabeHinweis, quelle, betrieb, orteNamen = {} }) {
  const ruhig = useReduzierteBewegung();
  const mobil = useSchmal();
  const sb = useSteckbrief();
  const daten = useGewerbeDaten();
  const ids = useMemo(() => netz.map((b) => b.id), [netz]);

  // --- Betrieb: synthetisches Beispiel oder eigener Lastgang (nach Gate in K1) --------------------------
  const eigen = daten.quelle === "eigen" && daten.last ? daten.last : null;
  const verbrauchKwh = eigen ? eigen.jahresverbrauch : betrieb.verbrauchKwh;
  const lpKw = rund(eigen ? eigen.mittelMonatsspitze : betrieb.lpKw, 1);

  // --- Anlage: Rechenbeispiel oder Stundenmodell (K3) ---------------------------------------------------
  const pv = daten.pv;
  const modellKwp = Math.round(sb.kwp ?? pv?.empfehlung?.kwp ?? betrieb.modell.kwp);
  const modellEv = sb.evQuote ?? evAusKurve(pv?.kurve, modellKwp) ?? pv?.empfehlung?.evQuote ?? betrieb.modell.evQuote;
  const modellErtrag = pv?.jahresErtrag ?? betrieb.modell.ertrag;
  const modellOrt = orteNamen[pv?.ortId ?? betrieb.modell.ortId] ?? "Linz";
  const modellAusrichtung = AUSRICHTUNG_TEXT[pv?.ausrichtung ?? betrieb.modell.ausrichtung] ?? "Ost-West";
  const [anlageWahl, setAnlageWahl] = useState(null);
  const anlageId = anlageWahl ?? (eigen || sb.bausteine.includes("k3") ? "modell" : "beispiel");
  const anlage = useMemo(
    () => (anlageId === "modell" ? { id: "modell", kwp: modellKwp, ertrag: modellErtrag, evQuote: modellEv } : ANLAGE_BEISPIEL),
    [anlageId, modellKwp, modellErtrag, modellEv]
  );

  // --- Auswahl: Netzbereich/Netzebene/Energiepreis leben im Steckbrief (geteilt mit K5–K8), Abgabe lokal ----
  const bereich = ids.includes(sb.bereich) ? sb.bereich : "ooe";
  const ne = [5, 6, 7].includes(sb.ne) ? sb.ne : 6;
  const sbEnergie = Number.isFinite(sb.energieCt) ? klemmen(sb.energieCt) : ENERGIE.start;
  const [energieLokal, setEnergieLokal] = useState(null); // während des Ziehens (Steckbrief erst entprellt)
  const [energieEingabe, setEnergieEingabe] = useState(null); // freie Eingabe im Textfeld
  const energieCt = energieLokal ?? sbEnergie;
  const [abgabeId, setAbgabeId] = useState("befristet");
  const abgabeCt = abgabeId === "regulaer" ? ABGABE.regulaer : ABGABE.befristet;
  const werte = useMemo(() => k4Werte({ netz, bereich, ne, energieCt, abgabeCt }), [netz, bereich, ne, energieCt, abgabeCt]);
  const jahr = useMemo(() => k4Jahr(werte, { verbrauchKwh, lpKw, anlage }), [werte, verbrauchKwh, lpKw, anlage]);

  // --- Röntgen-Zustand -----------------------------------------------------------------------------------
  const [roentgen, setRoentgen] = useState(false);
  const [flug, setFlug] = useState(false); // true während Hin-/Rückflug → Flug-Übergang statt Feder
  const [gezeigt, setGezeigt] = useState(false); // nach der Landung: Zeilen gleiten auf den Rest, Summen
  const [erkannt, setErkannt] = useState(false);
  const [strahlNr, setStrahlNr] = useState(0);
  const [aktiv, setAktiv] = useState(null);
  const erkanntRef = useRef(false);
  const beruehrt = useRef(false);
  const uhren = useRef([]);
  useEffect(() => () => uhren.current.forEach(clearTimeout), []);

  // Neueste Werte für entprellte Schreibvorgänge
  const aktuell = useRef({ bereich, ne, energieCt, abgabeCt });
  aktuell.current = { bereich, ne, energieCt, abgabeCt };

  const schreiben = useCallback(
    (teil) => {
      const a = { ...aktuell.current, ...teil };
      const v = k4Werte({ netz, ...a });
      steckbrief.setze({ bereich: v.b.id, ne: v.ne, energieCt: rund(a.energieCt, 2), vermiedenCt: rund(v.summe, 3) }, "k4");
    },
    [netz]
  );

  const umschalten = useCallback(
    (an, auto = false) => {
      uhren.current.forEach(clearTimeout);
      uhren.current = [];
      setFlug(!ruhig);
      setRoentgen(an);
      if (an) {
        setStrahlNr((n) => n + 1);
        if (ruhig) setGezeigt(true);
        else uhren.current.push(setTimeout(() => setGezeigt(true), GELANDET_MS));
        if (!erkanntRef.current) {
          erkanntRef.current = true;
          steckbrief.erkenntnis("k4-faktor");
          ereignis("erkenntnis", { id: "k4-faktor" });
          if (ruhig) setErkannt(true);
          else uhren.current.push(setTimeout(() => setErkannt(true), GELANDET_MS + 380));
        }
      } else {
        setGezeigt(false);
      }
      uhren.current.push(setTimeout(() => setFlug(false), ruhig ? 0 : 1500));
      ereignis("k4_roentgen", { an, auto });
    },
    [ruhig]
  );

  // --- Einmal automatisch röntgen: sobald das ZIEL ganz im freien Bild steht (unter dem Seitenkopf, über der
  //     Handy-Leiste) und kurz dort bleibt. Handy: schon wenn der Film unten auftaucht und die Zeilen noch ganz
  //     im Bild stehen – der Film liegt direkt unter den Zeilen, beim Weiterlesen wandert der Flug ins Bild.
  //     (Desktop: das große Röntgenbild steht rechts neben der Rechnung.) ----------------------------------------
  const zielRef = useRef(null);
  const zeilenRef = useRef(null);
  const autoLief = useRef(false);
  useEffect(() => {
    if (autoLief.current) return undefined;
    let raf = 0;
    let uhr = 0;
    const imBild = () => {
      const el = zielRef.current;
      if (!el) return false;
      const r = el.getBoundingClientRect();
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const oben = vw < 1024 ? 72 : 84;
      const unten = vh - (vw < 1024 ? 92 : 16);
      const ganz = r.height > unten - oben ? r.top >= oben && r.top + r.height / 2 <= unten : r.top >= oben && r.bottom <= unten;
      if (ganz || !mobil) return ganz;
      const z = zeilenRef.current?.getBoundingClientRect();
      return !!z && r.top >= oben && r.top <= unten - 4 && z.top >= oben;
    };
    const abmelden = () => {
      window.removeEventListener("scroll", melden);
      window.removeEventListener("resize", melden);
    };
    function pruefen() {
      raf = 0;
      if (autoLief.current || beruehrt.current) return abmelden();
      if (!imBild()) {
        clearTimeout(uhr);
        uhr = 0;
        return undefined;
      }
      if (uhr) return undefined;
      uhr = window.setTimeout(
        () => {
          uhr = 0;
          if (autoLief.current || beruehrt.current || !imBild()) return;
          autoLief.current = true;
          abmelden();
          umschalten(true, true);
        },
        ruhig ? 0 : mobil ? 150 : 350
      );
      return undefined;
    }
    function melden() {
      if (!raf) raf = requestAnimationFrame(pruefen);
    }
    window.addEventListener("scroll", melden, { passive: true });
    window.addEventListener("resize", melden, { passive: true });
    melden();
    return () => {
      abmelden();
      cancelAnimationFrame(raf);
      clearTimeout(uhr);
    };
  }, [ruhig, umschalten, mobil]);

  // Höhe der Zeichenfläche (für den Abstand der Direktbeschriftung) – nur das große Röntgenbild
  const [plotPx, setPlotPx] = useState(PLOT_PX.breit);
  useEffect(() => {
    const el = zielRef.current;
    if (mobil || !el || typeof ResizeObserver === "undefined") return undefined;
    const ro = new ResizeObserver(([e]) => {
      const h = Math.round(e.contentRect.height);
      if (h > 0) setPlotPx(h);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [mobil]);

  // Ansage (gedrosselt) bei jeder Änderung nach dem ersten Röntgen
  const [ansage, ansagen] = useAnsage();
  const ansageText = `${werte.b.label}, Netzebene ${werte.ne}: Der selbst genutzte Solarstrom streicht ${euroZahl(jahr.gestrichen)} Euro im Jahr von der Rechnung. Eine selbst genutzte kWh spart ${zahl(werte.summe, 2)} Cent, ${zahl(werte.faktor, 1)}-mal so viel wie eine eingespeiste.`;
  useEffect(() => {
    if (erkannt) ansagen(ansageText);
  }, [ansageText, erkannt, ansagen]);

  // Entprelltes Schreiben des Energiepreises
  const energieUhr = useRef(0);
  useEffect(() => () => clearTimeout(energieUhr.current), []);
  const energieMerken = useCallback(
    (v) => {
      clearTimeout(energieUhr.current);
      energieUhr.current = setTimeout(() => {
        schreiben({ energieCt: v });
        setEnergieLokal(null);
      }, 320);
    },
    [schreiben]
  );

  const aendern = {
    anlage(id) {
      if (id !== "beispiel" && id !== "modell") return;
      beruehrt.current = true;
      setAnlageWahl(id);
      ereignis("k4_anlage", { anlage: id });
    },
    bereich(id) {
      if (!ids.includes(id)) return;
      beruehrt.current = true;
      schreiben({ bereich: id });
      ereignis("k4_netzbereich", { bereich: id, ne: aktuell.current.ne });
    },
    ne(n) {
      if (![5, 6, 7].includes(n)) return;
      beruehrt.current = true;
      schreiben({ ne: n });
      ereignis("k4_netzebene", { ne: n });
    },
    energieRegler(v) {
      beruehrt.current = true;
      const k = klemmen(rund(v, 2));
      setEnergieEingabe(null);
      setEnergieLokal(k);
      energieMerken(k);
    },
    energieText(text) {
      beruehrt.current = true;
      setEnergieEingabe(text);
      const v = zuZahl(text);
      if (String(text).trim() !== "" && Number.isFinite(v) && v >= ENERGIE.min && v <= ENERGIE.max) {
        setEnergieLokal(v);
        energieMerken(v);
      }
    },
    energieFertig() {
      if (energieEingabe != null) {
        const v = zuZahl(energieEingabe);
        const k = String(energieEingabe).trim() !== "" && Number.isFinite(v) ? klemmen(rund(v, 2)) : energieCt;
        setEnergieEingabe(null);
        setEnergieLokal(k);
        energieMerken(k);
      }
    },
    abgabe(id) {
      beruehrt.current = true;
      setAbgabeId(id);
      schreiben({ abgabeCt: id === "regulaer" ? ABGABE.regulaer : ABGABE.befristet });
    },
  };

  const wahlBereich = useCallback(
    (id, weg) => {
      beruehrt.current = true;
      schreiben({ bereich: id });
      ereignis("k4_netzbereich", { bereich: id, ne: aktuell.current.ne, [weg]: true });
    },
    [schreiben]
  );
  const wahlAusKarte = useCallback((id) => wahlBereich(id, "karte"), [wahlBereich]);
  const wahlAusPille = useCallback((id) => wahlBereich(id, "pille"), [wahlBereich]);

  const knopfKlick = () => {
    beruehrt.current = true;
    const an = !roentgen;
    umschalten(an);
    if (an) schreiben({});
  };

  // --- Render-Bausteine ---------------------------------------------------------------------------

  const hover = (id) => ({
    onPointerEnter: (e) => e.pointerType === "mouse" && setAktiv(id),
    onPointerLeave: () => setAktiv(null),
  });

  /** Solar-Scheibe am Ende des Zeilenbalkens (vor dem Röntgen; fliegt zurück hierher). */
  const scheibe = (t, i, breite) => (
    <m.span
      key={t.id}
      layoutId={ruhig ? undefined : `k4-teil-${t.id}`}
      className="relative z-30 ml-[1.5px] block h-2 min-w-[3px]"
      style={{ width: `${breite}%`, background: t.farbe, borderRadius: "0 4px 4px 0" }}
      transition={{ layout: ruhig ? SOFORT : flug ? FLUG_ZURUECK(i) : BEWEGUNG.feder.steif }}
    />
  );

  /** Segment im großen Röntgenbild (senkrecht gestapelt). */
  const segmentHoch = (t, i, g) => (
    <m.span
      key={t.id}
      layoutId={ruhig ? undefined : `k4-teil-${t.id}`}
      {...hover(t.id)}
      className="absolute inset-x-0 z-20 block"
      style={{
        bottom: `${g.unten}%`,
        height: `max(0px, calc(${g.hoehe}% - 2px))`,
        background: t.farbe,
        borderRadius: 3,
        opacity: aktiv && aktiv !== t.id ? 0.35 : 1,
        transition: "opacity 200ms ease-out",
      }}
      transition={{ layout: ruhig ? SOFORT : flug ? FLUG_HIN(i) : BEWEGUNG.feder.steif }}
    />
  );

  /** Segment im Film (Handy, waagrecht gestapelt). */
  const segmentQuer = (t, i, g) => (
    <m.span
      key={t.id}
      layoutId={ruhig ? undefined : `k4-teil-${t.id}`}
      className="absolute inset-y-0 z-20 block"
      style={{ left: `${g.links}%`, width: `max(2px, calc(${g.breite}% - 2px))`, background: t.farbe, borderRadius: 3 }}
      transition={{ layout: ruhig ? SOFORT : flug ? FLUG_HIN(i) : BEWEGUNG.feder.steif }}
    />
  );

  const strahl =
    !ruhig && roentgen && strahlNr > 0 ? (
      <div aria-hidden="true" className="pointer-events-none absolute -inset-x-3 -bottom-1 -top-2 z-10 overflow-hidden rounded-xl">
        <m.div
          key={strahlNr}
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, rgba(140,186,88,0) calc(100% - 64px), rgba(140,186,88,0.16) calc(100% - 14px), rgba(102,153,51,0.95) calc(100% - 2px), rgba(102,153,51,0) 100%)",
          }}
          initial={{ y: "-100%", opacity: 0 }}
          animate={{ y: "0%", opacity: [0, 1, 1, 0] }}
          transition={{ y: { duration: STRAHL_S, ease: "linear" }, opacity: { duration: STRAHL_S + 0.08, times: [0, 0.08, 0.86, 1] } }}
        />
      </div>
    ) : null;

  const erkenntnis = (
    <AnimatePresence initial={false}>
      {erkannt && (
        <m.div
          key="k4-erkenntnis"
          initial={ruhig ? false : { opacity: 0, y: BEWEGUNG.weg }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: BEWEGUNG.dauer.lang, ease: BEWEGUNG.ease.aus }}
        >
          <Erkenntnis data-testid="k4-erkenntnis">
            {ImBereich(werte.b)} auf Netzebene {werte.ne} streicht der Solarstrom jedes Jahr{" "}
            <span className="ov-num whitespace-nowrap">{euroZahl(jahr.gestrichen)} €</span> von der Rechnung – jede selbst genutzte kWh ist{" "}
            <span className="ov-num">{zahl(werte.faktor, 1)}</span>-mal so viel wert wie eine eingespeiste.
          </Erkenntnis>
          {werte.ne === 7 && (
            <p className="mt-3 pl-5 text-[15px] leading-snug text-ink-700">
              Hier ist allein das Netz-Arbeitsentgelt <strong className="ov-num font-bold text-ink-900">{zahl(werte.ap, 2)} ct</strong> je kWh wert –{" "}
              <strong className="ov-num whitespace-nowrap font-bold text-ink-900">{euroZahl((jahr.eigenKwh * werte.ap) / 100)} €</strong> im Jahr.
            </p>
          )}
        </m.div>
      )}
    </AnimatePresence>
  );

  const euroAnzeige = (v) => <Zahl wert={v} stellen={0} />;
  const anlageOptionen = [
    { id: "beispiel", label: `Beispiel ${zahl(ANLAGE_BEISPIEL.kwp)} kWp`, sr: " – Rechenbeispiel der Seite" },
    { id: "modell", label: `Modell ${zahl(modellKwp)} kWp`, sr: " – Stundenmodell aus Kapitel 03" },
  ];
  // Film (Handy/Tablet): Rechenweg in einer Zeile; großes Bild: Rechenweg mit Quelle der Annahmen
  const gedeckelt = jahr.gedeckelt ? " (gedeckelt auf den Verbrauch)" : "";
  const anlageKurz =
    anlageId === "modell"
      ? `${zahl(modellErtrag)} kWh/kWp · ${zahl(modellEv * 100)} %${gedeckelt}`
      : `${zahl(ANLAGE_BEISPIEL.ertrag)} kWh/kWp · ${zahl(ANLAGE_BEISPIEL.evQuote * 100)} %${gedeckelt}`;
  const anlageLang =
    anlageId === "modell"
      ? `${zahl(modellKwp)} kWp × ${zahl(modellErtrag)} kWh/kWp × ${zahl(modellEv * 100)} %${gedeckelt} – Stundenmodell, Kapitel 03 (${modellOrt}, ${modellAusrichtung}${eigen ? ", Ihr Lastgang" : ""})`
      : `${zahl(ANLAGE_BEISPIEL.kwp)} kWp × ${zahl(ANLAGE_BEISPIEL.ertrag)} kWh/kWp × ${zahl(ANLAGE_BEISPIEL.evQuote * 100)} %${gedeckelt} – Rechenbeispiel wie Kapitel 07`;

  return (
    <MotionConfig reducedMotion="user">
      <LazyMotion features={domMax} strict>
        <LayoutGroup id="k4">
          <div data-k4-buehne="bereit" data-roentgen={roentgen ? "an" : "aus"} data-k4-anlage={anlageId}>
            <K4Gerippe
              rechnung={
                <K4Rechnung
                  werte={werte}
                  jahr={jahr}
                  betrieb={{ eigen: !!eigen }}
                  abgabeCt={abgabeCt}
                  roentgen={roentgen}
                  gezeigt={gezeigt}
                  scheibe={scheibe}
                  euroAnzeige={euroAnzeige}
                  ctSummeAnzeige={<Zahl wert={werte.summe} stellen={2} />}
                  strahl={strahl}
                  zeilenRef={zeilenRef}
                  aktiv={aktiv}
                  onAktiv={setAktiv}
                  ruhig={ruhig}
                  film={
                    mobil ? (
                      <K4Film
                        werte={werte}
                        jahr={jahr}
                        roentgen={roentgen}
                        gezeigt={gezeigt}
                        zielRef={zielRef}
                        segment={segmentQuer}
                        gestrichenAnzeige={<Zahl wert={jahr.gestrichen} stellen={0} />}
                        ruhig={ruhig}
                        anlage={{ wert: anlageId, optionen: anlageOptionen, kurz: anlageKurz, name: "k4-anlage-film" }}
                        onAnlage={aendern.anlage}
                        quelle={quelle}
                      />
                    ) : null
                  }
                  knopf={<K4Knopf roentgen={roentgen} onClick={knopfKlick} />}
                />
              }
              bild={
                mobil ? null : (
                  <K4Bild
                    werte={werte}
                    jahr={jahr}
                    anlage={{ wert: anlageId, optionen: anlageOptionen, lang: anlageLang, name: "k4-anlage-bild" }}
                    onAnlage={aendern.anlage}
                    roentgen={roentgen}
                    gezeigt={gezeigt}
                    plotPx={plotPx}
                    zielRef={zielRef}
                    segment={segmentHoch}
                    gestrichenAnzeige={<Zahl wert={jahr.gestrichen} stellen={0} />}
                    faktorAnzeige={<Zahl wert={werte.faktor} stellen={1} />}
                    aktiv={aktiv}
                    onAktiv={setAktiv}
                    ruhig={ruhig}
                    quelle={quelle}
                    eigen={!!eigen}
                  />
                )
              }
              erkenntnis={erkenntnis}
              karte={
                <K4KarteRahmen
                  legende={<K4Legende netz={netz} ne={ne} bereich={bereich} />}
                  pillen={<K4StadtPillen netz={netz} bereich={bereich} onWahl={wahlAusPille} />}
                >
                  <K4Karte netz={netz} ne={ne} bereich={bereich} onWahl={wahlAusKarte} staedte={staedte} />
                </K4KarteRahmen>
              }
              pult={
                <K4Pult
                  netz={netz}
                  werte={werte}
                  bereich={bereich}
                  ne={ne}
                  energieCt={energieCt}
                  energieEingabe={energieEingabe}
                  abgabeCt={abgabeCt}
                  abgabeHinweis={abgabeHinweis}
                  aendern={aendern}
                />
              }
            />
            <p aria-live="polite" className="sr-only">
              {ansage}
            </p>
          </div>
        </LayoutGroup>
      </LazyMotion>
    </MotionConfig>
  );
}
