"use client";

// src/components/GewerbeUnikat/K7Pult.js
//
// K7 · Bühne „Rechenweg live“ (per next/dynamic aus K7Insel, erst in Bildschirmnähe). Die Beispieltabelle
// wird zum Instrument:
//  - Annahme-Werte in der Tabelle sind Knöpfe. Desktop: Klick/Fokus öffnet die Regler-Zeile direkt unter der
//    Zeile (motion, Höhe gleitet; Escape schließt). Mobil (≤ 2.600 px): Tabs „Rechenweg | Stresstest“, die
//    Regler im Dock unter der Tabelle (Daumenzone, ein Feld auf einmal, vor/zurück); ein Tipp auf einen Wert
//    wählt das Feld im Dock. Saldo entfällt mobil (Tabelle und Dock tragen die Ergebnisse).
//  - Ergebnisse gleiten (Zahl, <output>), Abweichungen vom Rechenbeispiel sind ov-50 hinterlegt, „Zurück zum
//    Rechenbeispiel“ stellt den Startzustand wieder her (= BEISPIEL exakt: ≈ 34.360 €/a, ≈ 6,1 J., ≈ 10.600 €).
//  - Saldo-Kurve (K7SaldoKurve): kumulierter Cashflow des Rechenwegs mit Geisterlinie des Rechenbeispiels –
//    am Desktop im mitlaufenden Saldo, mobil/Tablet in der Antwort des Prüfstands. Jede Eingabe, jeder
//    Einwand und der Warte-Regler verschieben sichtbar Linie und Amortisationspunkt.
//  - Chips übernehmen Werte aus Kapitel 02 (Ort/Dachart → spezifischer Ertrag), 03 (kWp, Eigenverbrauch) und
//    04 (Energiepreis, Netzbereich/-ebene). Netz-Arbeitspreis und Netzverlust sind nur lesbar. Die kWp aus
//    Kapitel 03 kommen über K7Insel (useK3Kwp) – nie der Wert, den das Pult selbst in den Steckbrief schreibt.
//  - Einwand-Prüfstand: ein Chip stellt das Pult um (Faktoren aus STRESSTEST), zeigt Antwort und Beleg aus
//    src/data/einwaende.js und die Wirkung auf Überschuss und Amortisation (die Antwort rückt ins Bild).
//    Ereignis „einwand_geprueft“. „Strompreise fallen wieder“ wirkt NICHT zusätzlich auf den Fächer: dessen
//    konservativer Fall enthält genau diese −30 % schon (sonst 0,7 × 0,7 – zwei Antworten auf eine Frage).
//  - Warte-Regler: Monate × Jahresüberschuss ÷ 12 – kein Countdown, keine Projektdauer.
//  - 25 Jahre & Stresstest: K7Stresstest (Stundenmodell), Erkenntnis „k7-stresstest“, sobald der Fächer
//    gesehen und ein Einwand geprüft wurde.
//  - Entscheider-Mappe: RechnerTeilen unverändert (Gate Stufe 1 „gewerbe-pv“ nur für PDF/Link/Teilen).
//  - Steckbrief: setze({ kwp, amortisationJahre, ueberschussJahr }, "k7") nach eigener Eingabe (entprellt).

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, LazyMotion, MotionConfig, domAnimation, m } from "motion/react";
import RechnerTeilen from "@/components/RechnerTeilen/RechnerTeilen";
import { istIfbAktiv } from "@/data/fristen";
import { amortisationText, eagKategorie, euroGerundet, irrCa, spezifischerErtrag, stresstestBericht } from "@/lib/rechner/gewerbepv";
import { ereignis } from "@/lib/statistik";
import { Erkenntnis } from "./_bausteine.js";
import { BEWEGUNG, ERKENNTNISSE, KENNZEICHNUNG, zahl } from "./_tokens.js";
import { useAnsage, useMobil, useReduzierteBewegung, Zahl } from "./_gestaltung.js";
import { steckbrief, steckbriefQuery, useSteckbrief } from "./_steckbrief.js";
import { useGewerbeDaten } from "./_daten.js";
import K7Tabelle, { GRUPPE_VON, TABELLE_FUSS } from "./K7Tabelle.js";
import K7Ansicht, {
  AnsichtTabs,
  Dock,
  FeldRegler,
  MappeRahmen,
  Pruefstand,
  ReglerInhalt,
  SATZ_ABWEICHUNG,
  Saldo,
  UnterTabelle,
  Warte,
  faecherAnnahmen,
  satzImBeispiel,
} from "./K7Ansicht.js";
import K7Stresstest from "./K7Stresstest.js";
import K7SaldoKurve from "./K7SaldoKurve.js";
import { MODELL_ANNAHMEN, dachartLabel } from "./K7Modell.js";
import {
  ABGABE,
  GRENZEN,
  IFB_SATZ,
  abweichungen,
  euro10,
  euro100,
  jahre1,
  k7Kodieren,
  k7Lesen,
  netzKurz,
  netzWerte,
  pruefung,
  pultRechnen,
  pultStart,
  pz,
  richtwertInvest,
} from "./K7Rechnen.js";

const KLEMMEN = (v, g) => Math.min(g.max, Math.max(g.min, v));

/** Eingabe-Element je Feld (für „Wert anklicken → Regler fokussieren“). */
const ZIEL = {
  kwp: "#k7-r-kwp",
  ertragKwhKwp: "#k7-r-ertrag",
  evQuote: "#k7-r-ev",
  energieCt: "#k7-r-energie",
  abgabeCt: 'input[name="k7-abgabe"]:checked',
  ueberschussCt: "#k7-r-ueberschuss",
  investKwp: "#k7-r-invest",
  eagKwp: "#k7-r-eag",
  ifbSatz: 'input[name="k7-ifb"]:checked',
};

function WertGleitend({ wert, format }) {
  return <Zahl wert={wert} format={format} />;
}

const ERKENNTNIS_TEXT = ERKENNTNISSE.find((e) => e.id === "k7-stresstest")?.text || "Sie haben den schlechten Fall selbst durchgerechnet.";

export default function K7Pult({ netz, orte, start: server, einwaende, quelleNetz, k3Kwp: k3KwpHerkunft = null }) {
  const ruhig = useReduzierteBewegung();
  const mobil = useMobil();
  const sb = useSteckbrief();
  const empfDaten = useGewerbeDaten((d) => d.pv?.empfehlung);
  const empf = empfDaten || server.empfehlung;

  // --- Zustand -------------------------------------------------------------------------------------------
  const [start, setStart] = useState(() => pultStart(true));
  const [basis, setBasis] = useState(start); // eigene Annahmen (ohne laufende Prüfung)
  const [pruefId, setPruefId] = useState(null);
  const [warteBasis, setWarteBasis] = useState(0);
  const [offen, setOffen] = useState("anlage"); // Desktop: offene Regler-Zeile
  const [ansicht, setAnsicht] = useState("rechenweg"); // Mobil: Rechenweg | Stresstest
  const [dockFeld, setDockFeld] = useState("kwp"); // Mobil: Feld im Regler-Dock
  const [fussOffen, setFussOffen] = useState(false); // Mobil: Fußtext ganz
  const [warteOffen, setWarteOffen] = useState(false); // Mobil: Warte-Regler aufgeklappt
  const [beruehrt, setBeruehrt] = useState(false);
  const [geprueft, setGeprueft] = useState(false);
  const [gesehen, setGesehen] = useState(false);

  const pr = pruefung(pruefId);
  const p = useMemo(() => (pr ? pr.anwenden(basis) : basis), [pr, basis]);
  const warte = pr?.warte ?? warteBasis;
  const r = useMemo(() => pultRechnen(p, netz), [p, netz]);
  const rBasis = useMemo(() => (pr ? pultRechnen(basis, netz) : r), [pr, basis, netz, r]);
  const r0 = useMemo(() => pultRechnen(start, netz), [start, netz]);
  const geaendert = useMemo(() => abweichungen(p, start), [p, start]);
  const istStart = geaendert.size === 0 && warte === 0;

  // IFB-Satz nach Datum (nach dem 31.12.2026: 15 %), einmal nach dem Laden
  useEffect(() => {
    if (istIfbAktiv(Date.now())) return;
    const s = pultStart(false);
    setStart(s);
    setBasis((b) => (b.ifbSatz === IFB_SATZ.bis2026 ? { ...b, ifbSatz: IFB_SATZ.ab2027 } : b));
  }, []);

  // Rückkehr über das Lead-Gate bzw. geteilter Link: ?sb=1&…&k7=… stellt das Pult wieder her
  useEffect(() => {
    try {
      const q = new URLSearchParams(window.location.search);
      if (q.get("sb") !== "1" || !q.get("k7")) return;
      const z = k7Lesen(q.get("k7"), netz, pultStart(istIfbAktiv(Date.now())));
      if (!z) return;
      setBasis(z.p);
      setWarteBasis(z.warte);
    } catch {
      // ungültiger Link – Startzustand bleibt
    }
  }, [netz]);

  // --- Werte aus anderen Kapiteln (Chips) --------------------------------------------------------------------
  const ort = orte[sb.ortId] || orte.linz;
  const dach = dachartLabel(sb.dachart);
  const k2Ertrag = ort ? KLEMMEN(spezifischerErtrag(sb.dachart, ort), GRENZEN.ertragKwhKwp) : null;
  // nur der Wert, den Kapitel 03 gesetzt hat (K7Herkunft) – sonst die Modell-Empfehlung, mit der K3 startet
  const k3Kwp = KLEMMEN(Math.round((k3KwpHerkunft ?? empf.kwp) / 5) * 5, GRENZEN.kwp);
  const k3Ev = KLEMMEN(Math.round((sb.evQuote ?? empf.evQuote) * 100) / 100, GRENZEN.evQuote);
  const k4Aktiv = sb.bausteine.includes("k4");
  const k4Energie = k4Aktiv && Number.isFinite(sb.energieCt) ? KLEMMEN(sb.energieCt, GRENZEN.energieCt) : null;
  const k4NetzAnders = k4Aktiv && netz[sb.bereich] && [5, 6, 7].includes(sb.ne) && (sb.bereich !== p.bereich || sb.ne !== p.ne);
  const quellen = {
    k3Kwp,
    k3Ev,
    k2Ertrag,
    k2Label: `${ort?.name ?? "Linz"}, ${dach.kurz}`,
    k4Energie,
    k4Netz: k4NetzAnders ? `${netzKurz(netz[sb.bereich].label, sb.ne)}` : null,
  };
  const ziel = {
    kwp: k3Kwp,
    ertragKwhKwp: k2Ertrag ?? p.ertragKwhKwp,
    evQuote: k3Ev,
    ...(k4Aktiv ? { energieCt: k4Energie ?? p.energieCt, bereich: sb.bereich, ne: sb.ne } : {}),
  };
  const uebernehmbar = Object.entries(ziel).some(([k, v]) => (typeof v === "number" ? Math.abs(v - p[k]) > 1e-6 : v !== p[k]));
  const uebernehmenText = uebernehmbar ? `Werte aus Kapitel ${k4Aktiv ? "02–04" : "02–03"} übernehmen` : null;

  // --- Ändern ------------------------------------------------------------------------------------------------
  /** Eigene Eingabe: eine laufende Prüfung wird zur neuen Ausgangslage („eingebacken“). */
  const aendern = useCallback(
    (teil) => {
      setBasis((b) => ({ ...(pr ? pr.anwenden(b) : b), ...teil }));
      if (pr?.warte != null) setWarteBasis(pr.warte);
      if (pr) setPruefId(null);
      setBeruehrt(true);
    },
    [pr]
  );
  const setze = useCallback((feld, wert) => aendern({ [feld]: wert }), [aendern]);
  const aktionen = useMemo(
    () => ({
      setze,
      k4: () => aendern({ bereich: sb.bereich, ne: sb.ne }),
    }),
    [setze, aendern, sb.bereich, sb.ne]
  );

  const zuruecksetzen = useCallback(() => {
    setBasis(start);
    setPruefId(null);
    setWarteBasis(0);
    setBeruehrt(true);
  }, [start]);
  const uebernehmen = () => {
    aendern(ziel);
    ereignis("k7_steckbrief_uebernommen", { kapitel: k4Aktiv ? "k2-k4" : "k2-k3" });
  };

  const warteSetzen = useCallback(
    (n) => {
      if (pr) {
        setBasis((b) => pr.anwenden(b));
        setPruefId(null);
      }
      setWarteBasis(n);
      setBeruehrt(true);
    },
    [pr]
  );

  // --- Einwand-Prüfstand -----------------------------------------------------------------------------------
  // Die Antwort (mit Beleg) öffnet unter den Chips; nach dem Klick rückt sie ganz ins Bild (block „nearest“,
  // scroll-margin hält die DaumenLeiste frei). Reduzierte Bewegung: ohne Gleiten.
  const panelZiel = useRef(false);
  const panelRef = useCallback(
    (el) => {
      if (!el || !panelZiel.current) return;
      panelZiel.current = false;
      requestAnimationFrame(() => {
        const b = el.getBoundingClientRect();
        if (b.bottom > window.innerHeight - 24 || b.top < 72) el.scrollIntoView({ block: "nearest", behavior: ruhig ? "auto" : "smooth" });
      });
    },
    [ruhig]
  );
  const pruefen = useCallback(
    (id) => {
      if (pruefId === id) {
        setPruefId(null);
        return;
      }
      setPruefId(id);
      setGeprueft(true);
      setBeruehrt(true);
      panelZiel.current = true;
      ereignis("einwand_geprueft", { id });
      // Prüfung betrifft eine Tabellenzeile → am Desktop deren Regler zeigen
      const feld = pruefung(id)?.felder?.[0];
      if (id === "technik-warten") setWarteOffen(true);
      if (feld && GRUPPE_VON[feld]) {
        if (mobil) setDockFeld(feld);
        else setOffen(GRUPPE_VON[feld]);
      }
    },
    [pruefId, mobil]
  );

  // --- Tabelle: Wert anklicken / fokussieren ---------------------------------------------------------------
  const fokussieren = useCallback(
    (feld, scrollen) => {
      let n = 0;
      const versuch = () => {
        const el = document.querySelector(`[data-kapitel="k7"] ${ZIEL[feld]}`);
        if (el) {
          if (scrollen) el.scrollIntoView({ block: "center", behavior: ruhig ? "auto" : "smooth" });
          el.focus({ preventScroll: true });
        } else if (n++ < 6) requestAnimationFrame(versuch);
      };
      requestAnimationFrame(versuch);
    },
    [ruhig]
  );
  const fokusStill = useRef(false);
  const tabellenAktionen = useMemo(
    () => ({
      pille: (feld) => {
        const gruppe = GRUPPE_VON[feld];
        if (mobil) {
          setDockFeld(feld);
          const dock = document.querySelector('[data-kapitel="k7"] [data-testid="pult-dock"]');
          const r = dock?.getBoundingClientRect();
          // Dock nur scrollen, wenn er nicht ganz im Bild ist (Daumenzone bleibt ruhig)
          if (dock && r && (r.top < 64 || r.bottom > window.innerHeight - 80)) dock.scrollIntoView({ block: "center", behavior: ruhig ? "auto" : "smooth" });
          fokussieren(feld, false);
          return;
        }
        setOffen(gruppe);
        fokussieren(feld, false);
      },
      fokus: (gruppe) => {
        // Fokus nach „Escape“ (Rücksprung auf den Wert-Knopf) öffnet die Zeile nicht wieder
        if (fokusStill.current) {
          fokusStill.current = false;
          return;
        }
        if (!mobil) setOffen(gruppe);
      },
    }),
    [mobil, fokussieren, ruhig]
  );

  /** Mobil: zur Ansicht „Stresstest“ wechseln und an den Anfang der Bühne springen. */
  const zumStresstest = useCallback(() => {
    setAnsicht("stresstest");
    requestAnimationFrame(() => {
      document.querySelector('[data-kapitel="k7"] [data-testid="ansicht-tabs"]')?.scrollIntoView({ block: "start", behavior: ruhig ? "auto" : "smooth" });
    });
  }, [ruhig]);

  // --- Steckbrief und Ansage (nach eigener Eingabe, entprellt) -------------------------------------------------
  const [ansage, ansagen] = useAnsage(600);
  useEffect(() => {
    if (!beruehrt) return undefined;
    ansagen(
      r.amortisation == null
        ? `Jährlicher Überschuss rund ${euro10(r.jahr)} Euro – keine Amortisation.`
        : `Jährlicher Überschuss rund ${euro10(r.jahr)} Euro, statische Amortisation ${jahre1(r.amortisation)} Jahre, Steuerwirkung Öko-IFB rund ${euro100(r.ifbWirkung)} Euro.`
    );
    const t = setTimeout(() => {
      steckbrief.setze(
        { kwp: p.kwp, amortisationJahre: r.amortisation == null ? null : Math.round(r.amortisation * 10) / 10, ueberschussJahr: Math.round(r.jahr) },
        "k7"
      );
    }, 450);
    return () => clearTimeout(t);
  }, [beruehrt, p.kwp, r.amortisation, r.jahr, r.ifbWirkung, ansagen]);

  // --- Erkenntnis: Fächer gesehen + Einwand geprüft -------------------------------------------------------------
  const zeigeErkenntnis = geprueft && gesehen;
  const erkanntRef = useRef(false);
  useEffect(() => {
    if (!zeigeErkenntnis || erkanntRef.current) return;
    erkanntRef.current = true;
    steckbrief.erkenntnis("k7-stresstest");
    ereignis("erkenntnis", { id: "k7-stresstest" });
  }, [zeigeErkenntnis]);
  const onGesehen = useCallback(() => setGesehen(true), []);

  // --- Stundenmodell (Stresstest) --------------------------------------------------------------------------
  const modRef = useRef(server.modell);
  const [modAmort, setModAmort] = useState(server.modell.amort);
  const onModell = useCallback((mod) => {
    modRef.current = mod;
    setModAmort(mod.amort);
  }, []);
  // Der konservative Lauf rechnet Strompreis und Einspeiseerlös schon × 0,7 – bei geprüftem Einwand
  // „Strompreise fallen wieder“ rechnet der Fächer deshalb mit Ihren Annahmen OHNE diese Prüfung.
  const ohnePreisPruefung = pr?.id === "strompreise";
  const pF = ohnePreisPruefung ? basis : p;
  const rF = ohnePreisPruefung ? rBasis : r;
  const eingabe = useMemo(
    () => ({
      kwp: pF.kwp,
      dachart: sb.dachart,
      ortId: orte[sb.ortId] ? sb.ortId : "linz",
      verbrauchKwh: sb.jahresverbrauchKwh,
      schichten: sb.schichten,
      arbeitspreisCt: Math.round(rF.vermiedenCt * 1000) / 1000,
      einspeiseCt: pF.ueberschussCt,
      eag: pF.eagKwp > 0,
    }),
    [pF.kwp, sb.dachart, sb.ortId, sb.jahresverbrauchKwh, sb.schichten, rF.vermiedenCt, pF.ueberschussCt, pF.eagKwp, orte]
  );
  const beispiel = sb.quelle !== "eigen";
  const info = { ortName: ort?.name ?? "Linz", dachart: dach.kurz, verbrauchKwh: sb.jahresverbrauchKwh, schichten: sb.schichten };

  const erkenntnis = (
    <AnimatePresence initial={false}>
      {zeigeErkenntnis && (
        <m.div
          key="erkenntnis"
          initial={ruhig ? false : { opacity: 0, y: BEWEGUNG.weg }}
          animate={{ opacity: 1, y: 0 }}
          transition={ruhig ? { duration: 0 } : { duration: BEWEGUNG.dauer.lang, ease: BEWEGUNG.ease.aus }}
          className="mt-6"
        >
          <Erkenntnis data-testid="erkenntnis-stresstest">{ERKENNTNIS_TEXT}</Erkenntnis>
          <p className="mt-2 pl-5 text-[13.5px] leading-snug text-ink-600">
            {modAmort.k != null
              ? `Im konservativen Fall amortisiert sich das Modell nach ${jahre1(modAmort.k)} Jahren, erwartet nach ${jahre1(modAmort.e)}.`
              : "Im konservativen Fall amortisiert sich das Modell nicht innerhalb von 25 Jahren – sprechen wir über Speicher oder Größe."}
          </p>
        </m.div>
      )}
    </AnimatePresence>
  );

  // --- Entscheider-Mappe ----------------------------------------------------------------------------------------
  const richtwert = richtwertInvest(p.kwp);
  const query = `${steckbriefQuery(sb)}&k7=${k7Kodieren(p, warte)}#wirtschaftlichkeit`;
  const bericht = () => {
    const mod = modRef.current;
    const e = mod?.erwartet;
    const kons = mod?.laeufe?.find((l) => l.id === "konservativ");
    const n = r.netz;
    return {
      untertitel: `Rechenweg und Stresstest · ${zahl(p.kwp)} kWp · ${n.label}, Netzebene ${p.ne} · ${KENNZEICHNUNG.beispiel}`,
      kennzahlen: [
        ["Jährlicher Überschuss", `≈ ${euro10(r.jahr)} €`, "Rechenweg, vor Steuern, ohne Leistungspreiseffekt"],
        ["Statische Amortisation", r.amortisation == null ? "–" : `≈ ${jahre1(r.amortisation)} Jahre`, `Investition ${euro100(r.investition)} € nach EAG-Zuschuss`],
        ["Steuerwirkung Öko-IFB", `≈ ${euro100(r.ifbWirkung)} €`, `IFB ${pz(p.ifbSatz)} %, Körperschaftsteuer 23 %`],
        kons && ["Stresstest konservativ", amortisationText(kons.amortisation, mod.st.jahre), "Strompreis −30 %, Ertrag −10 %, Stundenmodell"],
      ].filter(Boolean),
      eingaben: [
        {
          titel: "Anlage",
          zeilen: [
            ["Anlagengröße", `${zahl(p.kwp)} kWp`],
            ["Spezifischer Ertrag", `${zahl(p.ertragKwhKwp)} kWh/kWp`, p.ertragKwhKwp === start.ertragKwhKwp ? "Innviertel, Richtwert nach PVGIS" : "eigene Annahme"],
            ["Eigenverbrauch", `${pz(p.evQuote)} %`],
          ],
        },
        {
          titel: "Preise je kWh (netto)",
          zeilen: [
            ["Energiepreis Liefervertrag", `${zahl(p.energieCt, 2)} ct`],
            ["Netznutzung (Arbeitspreis)", `${zahl(n.ap, 2)} ct`, `${n.label}, Netzebene ${p.ne}`],
            ["Netzverlustentgelt", `${zahl(n.nv, 3)} ct`],
            ["Elektrizitätsabgabe", `${zahl(p.abgabeCt, 2)} ct`, p.abgabeCt === ABGABE.regulaer ? "regulär" : "2026 befristet"],
            ["Überschusserlös", `${zahl(p.ueberschussCt, 2)} ct`],
          ],
        },
        {
          titel: "Investition und Förderung",
          zeilen: [
            ["Investition", `${zahl(p.investKwp)} €/kWp netto`, `Richtwert Marktstatistik ${zahl(richtwert)} €/kWp`],
            ["EAG-Investitionszuschuss", p.eagKwp > 0 ? `${zahl(p.eagKwp)} €/kWp` : "ohne", "nur bei Zuschlag im Fördercall"],
            ["Öko-Investitionsfreibetrag", `${pz(p.ifbSatz)} %`, p.ifbSatz > 0.2 ? "Übergabe bis 31.12.2026" : "Übergabe ab 2027"],
          ],
        },
        {
          titel: "Stundenmodell (Stresstest)",
          zeilen: [
            ["Standort", info.ortName, "PVGIS"],
            ["Dachart", dach.lang],
            ["Jahresverbrauch", `${zahl(Math.round(sb.jahresverbrauchKwh / 1000))} MWh`, sb.quelle === "eigen" ? "eigener Lastgang" : "synthetischer Beispielbetrieb"],
            ["Schichten", String(sb.schichten)],
          ],
        },
      ],
      ergebnisse: [
        {
          titel: "Rechenweg (Jahr 1, statisch)",
          zeilen: [
            ["Jahresertrag", `${zahl(Math.round(r.ertrag))} kWh`],
            ["Eigenverbrauch", `${zahl(Math.round(r.eigen))} kWh`],
            ["Vermiedene Kosten je kWh", `${zahl(r.vermiedenCt, 2)} ct`],
            ["Ersparnis Eigenverbrauch", `≈ ${euro10(r.ersparnis)} €/Jahr`],
            ["Erlös Überschuss", `≈ ${euro10(r.erloes)} €/Jahr`],
            ["Betrieb, Wartung, Versicherung", `− ${euro10(r.betrieb)} €/Jahr`],
            ["Jährlicher Überschuss", `≈ ${euro10(r.jahr)} €/Jahr`],
            ["Investition", `${euro100(r.investitionBrutto)} €`],
            ["EAG-Investitionszuschuss", r.zuschuss > 0 ? `− ${euro100(r.zuschuss)} €` : "0 €"],
            ["Statische Amortisation", r.amortisation == null ? "–" : `≈ ${jahre1(r.amortisation)} Jahre`],
            [`Öko-IFB ${pz(p.ifbSatz)} %`, `≈ ${euro100(r.ifbWirkung)} € Steuerwirkung`],
          ],
        },
        e && {
          titel: "Stundenmodell über 25 Jahre (erwarteter Fall)",
          zeilen: [
            ["Investition nach EAG-Zuschuss", euroGerundet(e.investition), "Richtwert Marktstatistik"],
            ["Amortisation", amortisationText(e.amortisation, e.jahre)],
            ["Rendite (IRR)", irrCa(e.irr), "vor Steuern"],
            [`Kumulierter Cashflow nach ${e.jahre} Jahren`, euroGerundet(e.summe)],
          ],
        },
        warte > 0 && {
          titel: "Entscheidungszeitpunkt",
          zeilen: [[`Entscheidung in ${warte} Monaten`, `≈ ${euro10((warte * r.jahr) / 12)} € Überschuss entgehen`, "Jahresüberschuss ÷ 12 × Monate"]],
        },
      ],
      annahmen: [
        TABELLE_FUSS,
        `Netzentgelte nach ${quelleNetz.name}.`,
        "Investition: Richtwerte schlüsselfertig aus der österreichischen Marktstatistik (Marktentwicklung 2024) und IEA PVPS National Survey Report Austria 2024, netto – keine Ökovolt-Preise.",
        SATZ_ABWEICHUNG,
        faecherAnnahmen(MODELL_ANNAHMEN),
      ],
      hinweise: [KENNZEICHNUNG.beispiel, KENNZEICHNUNG.keineBeratung, "Förderungen können die Bemessungsgrundlage des IFB mindern – bitte mit der Steuerberatung abstimmen."],
      mappe: e
        ? {
            investition: e.investition,
            amortisation: e.amortisation ?? undefined,
            jahre: e.jahre,
            irr: e.irr ?? undefined,
            irrOhneIfb: e.irrOhneIfb ?? undefined,
            ifbAktiv: e.ifbAktiv,
            bezugspreis: r.vermiedenCt,
            cashflow: e.cashflow,
            kwp: p.kwp,
            jahresertragKwh: e.jahresertrag,
            netzebene: `NE ${p.ne}`,
            ertragMethode: `Stundenmodell (8.760 h) mit PVGIS-Ertrag für ${info.ortName}, typisches Lastprofil – kein gemessener Lastgang`,
            stresstest: mod.laeufe.map((l) => ({ szenario: l.label, irr: l.irr, amortisation: l.amortisation, summe: l.summe })),
          }
        : { kwp: p.kwp, investition: r.investition, amortisation: r.amortisation ?? undefined, bezugspreis: r.vermiedenCt, netzebene: `NE ${p.ne}` },
      stresstest: mod ? { ...stresstestBericht(mod.st), satz: satzImBeispiel(mod.st.satz.text, beispiel) } : undefined,
    };
  };

  // --- Bausteine der Ansicht --------------------------------------------------------------------------------
  const eagText = eagKategorie(p.kwp).text;
  const regler = (gruppe) => <ReglerInhalt gruppe={gruppe} p={p} r={r} start={start} quellen={quellen} richtwert={richtwert} eagText={eagText} aktionen={aktionen} />;

  const schliessen = (e, gruppe) => {
    if (e.key !== "Escape") return;
    e.stopPropagation();
    setOffen(null);
    // sichtbaren Wert-Knopf der Zeile wieder fokussieren (mobile Unterzeile ist am Desktop ausgeblendet)
    const knoepfe = document.querySelectorAll(`[data-kapitel="k7"] [aria-controls="k7-regler-${gruppe}"]`);
    const ziel = [...knoepfe].find((k) => k.offsetParent !== null);
    if (ziel) {
      fokusStill.current = true;
      ziel.focus();
      fokusStill.current = false;
    }
  };
  const reglerZeile = mobil
    ? undefined
    : (gruppe) => (
        <AnimatePresence initial={false}>
          {offen === gruppe && (
            <m.tr key={`regler-${gruppe}`} exit={{ opacity: 1 }} transition={{ duration: ruhig ? 0 : BEWEGUNG.dauer.mittel }}>
              <td colSpan={3} className="p-0">
                <m.div
                  id={`k7-regler-${gruppe}`}
                  role="group"
                  aria-label="Annahme verstellen"
                  initial={ruhig ? false : { height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={ruhig ? { duration: 0 } : { duration: BEWEGUNG.dauer.mittel, ease: BEWEGUNG.ease.aus }}
                  className="overflow-hidden"
                  onKeyDown={(e) => schliessen(e, gruppe)}
                >
                  <div className="bg-sand-50 px-4 pb-5 pt-4 md:px-5">{regler(gruppe)}</div>
                </m.div>
              </td>
            </m.tr>
          )}
        </AnimatePresence>
      );

  const panel = (
    <AnimatePresence mode="wait" initial={false}>
      {pr && (
        <m.div
          key={pr.id}
          ref={panelRef}
          initial={ruhig ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: ruhig ? 0 : BEWEGUNG.dauer.mittel, ease: BEWEGUNG.ease.aus }}
          className="mt-4 scroll-mb-28 scroll-mt-24 rounded-3xl bg-ov-50 p-5 lg:p-6"
          data-testid="einwand-antwort"
        >
          <EinwandAntwort
            pr={pr}
            einwand={einwaende.find((x) => x.id === pr.id)}
            r={r}
            rBasis={rBasis}
            warte={warte}
            konservativJahre={modAmort.k}
            kurve={<K7SaldoKurve r={r} r0={r0} monate={warte} ruhig={ruhig} hoehe={136} testid="antwort-kurve" />}
          />
          {mobil && (
            <button
              type="button"
              onClick={zumStresstest}
              className="mt-4 inline-flex min-h-11 items-center gap-1.5 rounded-full bg-navy-950 px-4 text-[13.5px] font-semibold text-white"
            >
              Den schlechten Fall über 25 Jahre ansehen <span aria-hidden="true">→</span>
            </button>
          )}
        </m.div>
      )}
    </AnimatePresence>
  );

  return (
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion="user">
        <K7Ansicht
          tabs={
            mobil ? (
              <AnsichtTabs
                ansicht={ansicht}
                onAnsicht={(a) => {
                  setAnsicht(a);
                  ereignis("k7_ansicht", { ansicht: a });
                }}
              />
            ) : null
          }
          ansicht={mobil ? ansicht : "rechenweg"}
          saldo={
            mobil ? null : (
              <Saldo
                r={r}
                r0={r0}
                Wert={WertGleitend}
                geaendert={!istStart}
                aktionen={{ zuruecksetzen, uebernehmen }}
                uebernehmenText={uebernehmenText}
                kurve={<K7SaldoKurve r={r} r0={r0} monate={warte} ruhig={ruhig} testid="saldo-kurve" />}
              />
            )
          }
          tabelle={<K7Tabelle r={r} p={p} geaendert={geaendert} offen={mobil ? null : offen} aktionen={tabellenAktionen} reglerZeile={reglerZeile} Wert={WertGleitend} live istStart={geaendert.size === 0} />}
          unterTabelle={<UnterTabelle fuss={TABELLE_FUSS} geaendert={geaendert.size > 0} quelleNetz={quelleNetz} fussOffen={fussOffen} onFuss={() => setFussOffen(true)} />}
          dock={
            mobil ? (
              <Dock
                feld={dockFeld}
                onFeld={setDockFeld}
                inhalt={<FeldRegler feld={dockFeld} p={p} r={r} start={start} quellen={quellen} richtwert={richtwert} eagText={eagText} aktionen={aktionen} kompakt />}
                r={r}
                Wert={WertGleitend}
                onReset={zuruecksetzen}
                geaendert={!istStart}
              />
            ) : null
          }
          pruefstand={<Pruefstand aktiv={pruefId} onPruefen={pruefen} panel={panel} />}
          warte={
            <Warte
              monate={warte}
              jahr={r.jahr}
              onWert={warteSetzen}
              hervor={pr?.id === "technik-warten"}
              eigen={geaendert.size > 0}
              mobilZu={mobil && !warteOffen && warte === 0}
              onOeffnen={() => setWarteOffen(true)}
            />
          }
          weiter={
            mobil ? (
              <button
                type="button"
                onClick={zumStresstest}
                data-testid="weiter-stresstest"
                className="flex min-h-12 w-full items-center justify-between gap-3 rounded-full bg-ink-100 px-5 text-left text-[14px] font-semibold text-ink-900"
              >
                Weiter: Stresstest über 25 Jahre
                <span aria-hidden="true">→</span>
              </button>
            ) : null
          }
          faecher={
            <K7Stresstest eingabe={eingabe} orte={orte} start={server.modell} info={info} onModell={onModell} onGesehen={onGesehen} erkenntnis={erkenntnis} beispiel={beispiel} />
          }
          mappe={
            <MappeRahmen
              kinder={
                <RechnerTeilen
                  rechner="gewerbe-pv"
                  name="Gewerbe-PV-Rechner"
                  pfad="/gewerbe"
                  query={query}
                  titel="Photovoltaik für unseren Betrieb – Rechenweg und Stresstest"
                  text="Rechenweg und Stresstest für unser Betriebsdach – jede Annahme offengelegt, gerechnet mit dem Ökovolt-Pult."
                  kampagne="gewerbe_unikat"
                  bericht={bericht}
                />
              }
            />
          }
        />
        <p className="sr-only" aria-live="polite">
          {ansage}
        </p>
      </MotionConfig>
    </LazyMotion>
  );
}

/**
 * Antwort des Prüfstands: was verstellt wurde, Wirkung, Antwort und Beleg aus src/data/einwaende.js.
 * Desktop zweispaltig (Wirkung | Antwort mit Beleg) – die Linie dazu zeigt der mitlaufende Saldo; unter lg
 * (Saldo nicht im Bild) steht die Saldo-Kurve in der Antwort selbst.
 * konservativJahre: Amortisation des konservativen Falls im Stundenmodell (für den Satz beim Strompreis-Einwand).
 */
function EinwandAntwort({ pr, einwand, r, rBasis, warte, konservativJahre, kurve }) {
  const extern = einwand?.belegHref && /^https?:/.test(einwand.belegHref);
  const pfeil = (a, b, f) => (
    <>
      <span className="text-ink-500">{f(a)}</span> <span aria-hidden="true">→</span>
      <span className="sr-only"> wird zu </span> <strong className="font-extrabold text-ink-900">{f(b)}</strong>
    </>
  );
  return (
    <div className="lg:grid lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] lg:gap-x-8">
      <div className="min-w-0">
        <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-ov-800">Geprüft: „{einwand?.einwand ?? pr.chip}“</p>
        <p className="mt-1.5 text-[13.5px] leading-snug text-ink-700">{pr.was}</p>
        {pr.id === "technik-warten" ? (
          <p className="ov-num mt-3 font-display text-[16px] font-bold leading-snug text-ink-900">≈ {euro10((warte * r.jahr) / 12)} € Überschuss entgehen in 12 Monaten</p>
        ) : (
          <dl className="ov-num mt-3 grid grid-cols-2 gap-3 font-display text-[15px] leading-snug">
            <div>
              <dt className="font-sans text-[12px] text-ink-600">Jahresüberschuss</dt>
              <dd>{pfeil(rBasis.jahr, r.jahr, (v) => `${euro10(v)} €`)}</dd>
            </div>
            <div>
              <dt className="font-sans text-[12px] text-ink-600">Amortisation</dt>
              <dd>{pfeil(rBasis.amortisation, r.amortisation, (v) => (v == null ? "–" : `${jahre1(v)} J.`))}</dd>
            </div>
          </dl>
        )}
        {kurve && (
          <figure className="mt-4 rounded-2xl bg-white/70 px-3 pb-2 pt-3 lg:hidden">
            <figcaption className="text-[12px] font-semibold leading-snug text-ink-700">Kumuliert über 15 Jahre · statisch, gestrichelt: Rechenbeispiel</figcaption>
            <div className="mt-1.5">{kurve}</div>
          </figure>
        )}
        {pr.id === "strompreise" && (
          <p className="mt-3 text-[13px] leading-snug text-ink-600" data-testid="einwand-faecher-satz">
            Im Stresstest unten steckt dieser Einwand schon im konservativen Fall – dort zusätzlich mit 10 % weniger Sonne, ohne
            Preissteigerung und mit Modulalterung
            {konservativJahre != null ? (
              <>
                : Amortisation <span className="ov-num whitespace-nowrap font-semibold text-ink-800">≈ {jahre1(konservativJahre)} J.</span> im Stundenmodell.
              </>
            ) : (
              "."
            )}
          </p>
        )}
      </div>
      {einwand && (
        <div className="min-w-0 max-lg:mt-3 lg:border-l lg:border-ink-900/[0.08] lg:pl-8">
          <p className="max-w-[68ch] text-[14px] leading-relaxed text-ink-700">{einwand.antwort}</p>
          <p className="mt-2 max-w-[68ch] text-[13px] leading-snug text-ink-600">
            <strong className="font-semibold text-ink-900">Beleg:</strong> {einwand.beleg}{" "}
            {einwand.belegHref &&
              (extern ? (
                <a href={einwand.belegHref} target="_blank" rel="noopener noreferrer" className="font-semibold text-ink-900 underline decoration-ink-300 underline-offset-2 hover:decoration-ink-900">
                  Quelle öffnen
                </a>
              ) : (
                <Link href={einwand.belegHref} className="font-semibold text-ink-900 underline decoration-ink-300 underline-offset-2 hover:decoration-ink-900">
                  Beleg ansehen
                </Link>
              ))}
          </p>
        </div>
      )}
    </div>
  );
}
