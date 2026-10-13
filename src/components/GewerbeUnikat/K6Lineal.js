"use client";

// src/components/GewerbeUnikat/K6Lineal.js
//
// K6 · Bühne „Schwellen-Lineal“ (Client, per next/dynamic über K6Insel geladen):
//  A · DC-Lineal (kWp, log) mit Schieber (natives range über log-Abbildung + Tastatur über die Raster-
//      Leiter), Tore für EAG-Kategorien, OeMAG-Grenze und EAG-Höchstleistung, Netzebenen-Bänder;
//      AC-Lineal mit gestapeltem Balken (Wechselrichter + Speicher-WR + Bestand), Tore bei 250 kW
//      (TOR Typ B) und 1 MW (Fernwirkschnittstelle). Das TOR-Typ-Badge steht direkt an der AC-Summe.
//  B · Einlinienschaltbild (Hochformat, ab 1.024 px RECHTS neben den Linealen), das mitwächst:
//      Speicher-Abzweig, Parkregler mit Sollwert-Leitungen (zeichnen sich linear), Fernwirkschnittstelle,
//      Netzebene 7/6/5 synchron mit dem Steckbrief.
// Gerendert wird die reine Ansicht K6Ansicht – dieselbe wie im Server-Platzhalter. Rechnen ausschließlich
// über acVorschlag/acSumme/torTyp (src/components/Technik/torTypen.js) im Modell K6Modell.
//
// Zeitverhalten (QA 12.10.): Typ-Wechsel als Überblendung in 320 ms (kein mode="wait"), Erkenntnis und
// Tor-Karte wechseln in fester Höhe (Stapel in K6Ansicht) – nichts kommt verspätet, nichts rutscht nach.

import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, LazyMotion, MotionConfig, domAnimation, m } from "motion/react";
import { ereignis } from "@/lib/statistik";
import { BEWEGUNG, zahl } from "./_tokens";
import { Segment, Zahl, useAnsage, useImSichtfeld, useProBild, useReduzierteBewegung, useTastenRegler } from "./_gestaltung";
import { steckbrief, useSteckbrief } from "./_steckbrief";
import { ALLE_TORE, LEITER, LINEAL, START, ansichtModell, einlinie, kwpAusSchieber, leiterIndex } from "./K6Modell";
import { k6Anfrage } from "./K6Anfrage";
import K6Ansicht from "./K6Ansicht";

const zahlAus = (text) => {
  const n = Number(String(text).replace(",", "."));
  return Number.isFinite(n) ? Math.max(0, Math.min(LINEAL.max, Math.round(n))) : 0;
};

/**
 * @param {object} p
 * @param {number} p.beispielSpeicherKw   Speicher-Leistung des Rechenbeispiels aus Kapitel 05 (Deckel 230 kW)
 * @param {number} [p.beispielSpeicherKwh] zugehörige Kapazität (für den Speicherwunsch in der Anfrage)
 */
export default function K6Lineal({ beispielSpeicherKw = 85, beispielSpeicherKwh = null }) {
  const sb = useSteckbrief();
  const ruhig = useReduzierteBewegung();
  const [ansage, ansagen] = useAnsage();

  // ---------------------------------------------------------------- Zustand
  const [kwp, setKwp] = useState(() => (sb.kwp != null ? Math.max(LINEAL.min, Math.min(LINEAL.max, Math.round(sb.kwp))) : START.kwp));
  const [wrEigen, setWrEigen] = useState(null);
  const [sp, setSp] = useState(START.speicherKw);
  const [bestand, setBestand] = useState(START.bestandKw);
  const [texte, setTexte] = useState({ wr: null, sp: String(START.speicherKw), bestand: String(START.bestandKw) });
  const [aktivesTor, setAktivesTor] = useState(null);
  const [karteOffen, setKarteOffen] = useState(false); // mobil: Text der Tor-Karte – nur auf Antippen
  const [beruehrt, setBeruehrt] = useState(false);
  const [sofort, setSofort] = useState(false);
  const [intro, setIntro] = useState("fertig");
  const ne = sb.ne;

  const v = useMemo(() => ansichtModell({ kwp, wrEigen, speicherKw: sp, bestandKw: bestand, ne, aktivesTor }), [kwp, wrEigen, sp, bestand, ne, aktivesTor]);
  const e = useMemo(() => einlinie(v), [v]);

  const beruehren = useCallback(() => setBeruehrt(true), []);

  // Steckbrief → kWp (Kapitel 03 oder Rückkehr über ?sb=1): übernehmen, solange nicht gezogen wird
  const sbKwp = sb.kwp;
  const zieht = useRef(false);
  useEffect(() => {
    if (sbKwp == null || zieht.current) return;
    const k = Math.max(LINEAL.min, Math.min(LINEAL.max, Math.round(sbKwp)));
    setKwp((alt) => (Math.abs(alt - k) >= 1 ? k : alt));
  }, [sbKwp]);

  // ---------------------------------------------------------------- Tore: Überfahren wechselt die Tor-Karte
  // (Desktop: Karte steht immer offen; mobil wechselt nur ihr Titel – aufgeklappt wird nur auf Antippen,
  // damit beim Ziehen nichts darunter verrutscht.)
  const vorher = useRef(null);
  useEffect(() => {
    const jetzt = Object.fromEntries([...v.dcTore, ...v.acTore].map((t) => [t.id, t.offen]));
    const alt = vorher.current;
    vorher.current = jetzt;
    if (!alt) return;
    const gewechselt = ALLE_TORE.filter((t) => alt[t.id] !== jetzt[t.id]);
    if (!gewechselt.length) return;
    // AC-Tore (TOR-Typ) haben Vorrang; von mehreren gekreuzten gilt das zuletzt überfahrene – das ist in
    // Bewegungsrichtung das, das dem aktuellen Wert am nächsten liegt (5.000 → 20 kWp: Typ B, nicht 1 MW).
    const ac = gewechselt.filter((t) => t.lineal === "ac");
    const kandidaten = ac.length ? ac : gewechselt;
    const wertVon = (t) => Math.max(1, t.lineal === "ac" ? v.ac : v.kwp);
    const abstand = (t) => Math.abs(Math.log(t.wert) - Math.log(wertVon(t)));
    const wahl = kandidaten.reduce((best, t) => (abstand(t) < abstand(best) ? t : best), kandidaten[0]);
    setAktivesTor(wahl.id);
    // v.ac/v.kwp gehören zu denselben Toren – Abhängigkeit über dcTore/acTore genügt
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [v.dcTore, v.acTore]);

  // ---------------------------------------------------------------- Erkenntnis + Steckbrief + Anfrage
  const gemeldet = useRef(false);
  useEffect(() => {
    if (!beruehrt || gemeldet.current) return;
    if (v.typB || v.sp > 0) {
      gemeldet.current = true;
      steckbrief.erkenntnis("k6-typ-b");
      ereignis("erkenntnis", { id: "k6-typ-b" });
    }
  }, [beruehrt, v.typB, v.sp]);

  const spKwh = v.sp > 0 && v.sp === beispielSpeicherKw && !(sb.speicherKw > 0) ? beispielSpeicherKwh : null;
  useEffect(() => {
    if (!beruehrt) return undefined;
    // Anfrage-Kontext sofort (der Ausgang zeigt immer den aktuellen Stand), Steckbrief/Statistik gedrosselt
    k6Anfrage.setze({ kwp: v.kwp, sp: v.sp, spKwh, ac: v.ac, typ: v.tor.typ, ne: v.ne });
    const t = setTimeout(() => {
      steckbrief.setze({ kwp: v.kwp, wrKva: v.wr, acSummeKw: v.ac, torTyp: v.tor.typ.toLowerCase(), ne: v.ne }, "k6");
      ereignis("k6_netzanschluss", { kwp: v.kwp, ac: v.ac, typ: v.tor.typ, ne: v.ne, speicher: v.sp > 0 });
    }, 450);
    return () => clearTimeout(t);
  }, [beruehrt, v.kwp, v.wr, v.ac, v.tor.typ, v.ne, v.sp, spKwh]);

  // Ansage (gedrosselt) – Typ in aria-live
  const ersteAnsage = useRef(true);
  useEffect(() => {
    if (ersteAnsage.current) {
      ersteAnsage.current = false;
      return;
    }
    ansagen(`${zahl(v.kwp)} kWp, ${zahl(v.ac)} kW am Netzanschlusspunkt – ${v.typText}${v.knapp ? ", knapp an der Typ-B-Grenze" : ""}${v.typB ? ", Parkregler im Schaltbild" : ""}.`);
  }, [v.kwp, v.ac, v.typText, v.knapp, v.typB, ansagen]);

  // ---------------------------------------------------------------- Intro: Balken wachsen beim ersten Sichtkontakt
  const wurzel = useRef(null);
  const sichtbar = useImSichtfeld(wurzel, { schwelle: 0.12 });
  useLayoutEffect(() => {
    if (ruhig) return;
    const r = wurzel.current?.getBoundingClientRect();
    if (r && r.top > window.innerHeight * 0.85) setIntro("warten");
    // nur beim Einhängen prüfen
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    if (intro === "warten" && sichtbar) setIntro("los");
  }, [intro, sichtbar]);
  useEffect(() => {
    if (intro !== "los") return undefined;
    const t = setTimeout(() => setIntro("fertig"), 1500);
    return () => clearTimeout(t);
  }, [intro]);
  useEffect(() => {
    if (ruhig) setIntro("fertig");
  }, [ruhig]);

  // ---------------------------------------------------------------- Bedienung
  const ziehen = useProBild((promille) => setKwp(kwpAusSchieber(promille)));
  const range = useCallback(
    (ev) => {
      zieht.current = true;
      beruehren();
      setSofort(true);
      ziehen(Number(ev.target.value));
    },
    [beruehren, ziehen]
  );
  const rangeLos = useCallback(() => {
    zieht.current = false;
    setSofort(false);
  }, []);
  const leiterSetzen = useCallback(
    (i) => {
      beruehren();
      setSofort(false);
      setKwp(LEITER[i]);
    },
    [beruehren]
  );
  const rangeTaste = useTastenRegler({ wert: leiterIndex(kwp), setWert: leiterSetzen, min: 0, max: LEITER.length - 1, schritt: 1, grob: 10, achse: "x" });

  // Felder: Ein leeres Feld rechnet nicht mit 0 weiter (QA 12.10.) – Wechselrichter leer = Vorschlag,
  // Speicher/Bestand leer = letzter Wert, bis das Feld verlassen wird (dann 0).
  const feld = useCallback(
    (schluessel) => (ev) => {
      const text = ev.target.value;
      beruehren();
      setSofort(false);
      setTexte((t) => ({ ...t, [schluessel]: text }));
      if (text.trim() === "") {
        if (schluessel === "wr") setWrEigen(null);
        return;
      }
      const n = zahlAus(text);
      if (schluessel === "wr") setWrEigen(n);
      else if (schluessel === "sp") setSp(n);
      else setBestand(n);
    },
    [beruehren]
  );
  const feldVerlassen = useCallback(
    (schluessel) => (ev) => {
      const text = ev.target.value;
      if (schluessel === "wr") {
        if (text.trim() === "") {
          setWrEigen(null);
          setTexte((t) => ({ ...t, wr: null }));
        } else setTexte((t) => ({ ...t, wr: String(zahlAus(text)) }));
        return;
      }
      const n = text.trim() === "" ? 0 : zahlAus(text);
      if (schluessel === "sp") setSp(n);
      else setBestand(n);
      setTexte((t) => ({ ...t, [schluessel]: String(n) }));
    },
    []
  );
  const wrVorschlag = useCallback(() => {
    beruehren();
    setWrEigen(null);
    setTexte((t) => ({ ...t, wr: null }));
  }, [beruehren]);

  const chipKw = sb.speicherKw != null && sb.speicherKw > 0 ? Math.round(sb.speicherKw) : beispielSpeicherKw;
  const chipText = sb.speicherKw != null && sb.speicherKw > 0 ? `Speicher-WR aus Kapitel 05 übernehmen: ${zahl(chipKw)} kW` : `Speicher-WR aus Kapitel 05 (Beispiel): ${zahl(chipKw)} kW`;
  const chipKurz = `+ ${zahl(chipKw)} kW Speicher-WR (${sb.speicherKw > 0 ? "aus Kap. 05" : "Beispiel, Kap. 05"})`;
  const speicherChip = useCallback(() => {
    beruehren();
    setSofort(false);
    const neu = sp === chipKw ? 0 : chipKw;
    setSp(neu);
    setTexte((t) => ({ ...t, sp: String(neu) }));
    ereignis("k6_speicher_chip", { kw: neu });
  }, [beruehren, sp, chipKw]);

  const neSetzen = useCallback(
    (id) => {
      beruehren();
      steckbrief.setze({ ne: Number(id) }, "k6");
    },
    [beruehren]
  );
  const torZeigen = useCallback((id) => {
    setAktivesTor(id);
    setKarteOffen(true);
  }, []);
  const karteUmschalten = useCallback(() => setKarteOffen((o) => !o), []);

  const aktionen = useMemo(
    () => ({ range, rangeTaste, rangeLos, feld, feldVerlassen, wrVorschlag, speicherChip, neSetzen, torZeigen, karteUmschalten }),
    [range, rangeTaste, rangeLos, feld, feldVerlassen, wrVorschlag, speicherChip, neSetzen, torZeigen, karteUmschalten]
  );

  // ---------------------------------------------------------------- Komponentensätze
  const feder = useMemo(() => (ruhig ? { duration: 0 } : BEWEGUNG.feder.steif), [ruhig]);
  const k = useMemo(
    () => ({
      bewegt: true,
      ruhig,
      G: m.g,
      Path: m.path,
      Line: m.line,
      Rect: m.rect,
      Circle: m.circle,
      Div: m.div,
      Praesenz: AnimatePresence,
      Zahl,
      Segment,
      feder: sofort ? { duration: 0 } : feder,
      // Leitungen zeichnen sich LINEAR – mit ease-out wären nach 50 ms schon 84 % gezeichnet (QA 12.10.)
      zeichnen: ruhig ? { duration: 0 } : { duration: 0.45, ease: "linear" },
      // Zustandswechsel (TOR-Typ): Überblendung in 320 ms
      wechsel: ruhig ? { duration: 0 } : { duration: BEWEGUNG.dauer.mittel, ease: BEWEGUNG.ease.aus },
      raus: ruhig ? { duration: 0 } : { duration: 0.14, ease: BEWEGUNG.ease.aus },
    }),
    [ruhig, sofort, feder]
  );
  const kE = useMemo(() => ({ ...k, feder }), [k, feder]);

  const f = { wr: texte.wr ?? String(v.wr), sp: texte.sp, bestand: texte.bestand };

  const slots = {
    ansage: (
      <p className="sr-only" aria-live="polite" aria-atomic="true">
        {ansage}
      </p>
    ),
  };

  return (
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion="user">
        <K6Ansicht
          v={v}
          e={e}
          k={k}
          kE={kE}
          a={aktionen}
          f={f}
          chip={{ kw: chipKw, text: chipText, kurz: chipKurz }}
          slots={slots}
          intro={intro}
          wurzelRef={wurzel}
          karteOffen={karteOffen}
          beruehrt={beruehrt}
        />
      </MotionConfig>
    </LazyMotion>
  );
}
