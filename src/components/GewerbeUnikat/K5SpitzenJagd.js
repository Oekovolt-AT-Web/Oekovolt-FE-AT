"use client";

// src/components/GewerbeUnikat/K5SpitzenJagd.js
//
// K5 · Bühne „Die teuerste Viertelstunde“ (Client, per next/dynamic über K5Insel geladen):
//  A · Spitzen-Uhr: Intro (Punkte wandern von 00:00 zur Uhrzeit, Sonnenbögen wachsen), Ring-Auswahl per
//      Zeiger, Liste und Tastatur, Ablesung „Dezember: 312 kW am Fr 5.12. um 06:15 – Sonne …“.
//  B · Deckel über 12 Monatstürmen: Griff „230 kW / ≈ 4.050 €/a“ (Pointer + Tastatur), natives range.
//      Senkt man den Deckel, lösen sich die gekappten Stücke als Amber-Kappen (eine je Monat, Navy-Kontur)
//      und fallen in die Batterie, die als Speichergröße mitwächst. Kennwerte live aus der Kappungstabelle
//      des Workers (keine Rechenlast). „Sonne einschalten“, Abrechnung 2026 | 2027 (Entwurf), Grenznutzen.
//  C · Staffelstart (schematisch).
// Gerendert wird die reine Ansicht K5Ansicht – dieselbe wie im Server-Platzhalter.

import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { LazyMotion, MotionConfig, domAnimation, m } from "motion/react";
import { psParams } from "@/lib/rechner/peakshaving";
import { ereignis } from "@/lib/statistik";
import { Erkenntnis } from "./_bausteine";
import { BEWEGUNG, FARBE, zahl } from "./_tokens";
import { Segment, Zahl, useAnsage, useImSichtfeld, useMobil, useProBild, useReduzierteBewegung, useTastenRegler } from "./_gestaltung";
import { steckbrief, useSteckbrief } from "./_steckbrief";
import { useGewerbeDaten, vorwaermen } from "./_daten";
import K5Ansicht from "./K5Ansicht";
import { BATTERIE_BREITE, TUERME_HOEHE, UHR, batterieGeometrie, ringBei, tuermeSkalen } from "./K5Grafik";
import { ansichtModell, euroText, euroWert, monatsPlaetze, monatsspitzenMitPv, pvBeiSpitzen, sonnenboegen, startDeckel, zwoelfVolle } from "./K5Rechnen";
import { k5LinksSetzen } from "./K5Ausgang";

const MAX_KAPPEN = 40; // gleichzeitig fliegende Kappen (höchstens drei Wellen à 12)
const WELLE_MS = 280; // so oft löst sich beim Ziehen eine Welle gekappter Stücke
const PFEILE = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "PageUp", "PageDown", "Home", "End"];

function jahresspitzeMonat(plaetze) {
  let best = 0;
  plaetze.forEach((m, i) => {
    if (m && !(plaetze[best]?.spitzeKw >= m.spitzeKw)) best = i;
  });
  return best;
}

/**
 * @param {object} p
 * @param {object} p.start Startwerte vom Server (Beispielbetrieb, serialisierbar)
 * @param {Record<string,[string,number,number]>} p.orte Ort-Id → [Name, lat, lon]
 */
export default function K5SpitzenJagd({ start, orte }) {
  const d = useGewerbeDaten();
  const sb = useSteckbrief();
  const ruhig = useReduzierteBewegung();
  const mobil = useMobil();
  const [ansage, ansagen] = useAnsage();

  useEffect(() => {
    vorwaermen(); // idempotent – startet den Worker, falls der Hero es (noch) nicht getan hat
  }, []);

  // ---------------------------------------------------------------- Daten
  const last = d.status === "bereit" && d.last ? d.last : null;
  const pv = last ? d.pv : null;
  const kapp = last ? d.kapp : null;
  const quelle = last ? last.quelle : "beispiel";
  const ortId = orte[d.ortId] ? d.ortId : orte[start.ortId] ? start.ortId : Object.keys(orte)[0];
  const [ortName, lat, lon] = orte[ortId];
  const jahr = last?.monate?.[0]?.jahr ?? start.jahr;
  const boegen = useMemo(() => sonnenboegen(lat, lon, jahr), [lat, lon, jahr]);
  const startPlaetze = useMemo(() => monatsPlaetze(start.monate), [start.monate]);
  const plaetze = useMemo(() => (last ? monatsPlaetze(last.monate) : startPlaetze), [last, startPlaetze]);
  const kwp = sb.kwp ?? pv?.empfehlung?.kwp ?? start.kwp;
  const pvKw = useMemo(() => (last && pv ? pvBeiSpitzen(plaetze, last.reihe, pv.reihe, kwp, last.intervall) : null), [last, pv, plaetze, kwp]);
  const mitPv = useMemo(() => {
    if (last && pv) return monatsspitzenMitPv(last.reihe, pv.reihe, kwp, last.intervall);
    return kwp === start.mitPv.kwp ? start.mitPv : null;
  }, [last, pv, kwp, start.mitPv]);
  const spitzeKw = last ? last.spitze.kw : start.spitzeKw;
  const mittelKw = last ? last.mittelKw : start.mittelKw;
  const verbrauch = last ? last.jahresverbrauch : start.jahresverbrauch;

  const daten = useMemo(
    () => ({
      plaetze,
      boegen,
      ort: { name: ortName, lat, lon },
      kwp,
      spitzeKw,
      mittelKw,
      pvKw,
      mitPv,
      zeilen: kapp ? kapp.zeilen : quelle === "beispiel" ? start.kappung : null,
      kappBereich: kapp ? kapp.bereich : null,
      vollstaendig: !!kapp,
      bereichId: sb.bereich,
      ne: sb.ne,
      quelle,
    }),
    [plaetze, boegen, ortName, lat, lon, kwp, spitzeKw, mittelKw, pvKw, mitPv, kapp, quelle, start.kappung, sb.bereich, sb.ne]
  );

  // ---------------------------------------------------------------- Zustand
  const [monat, setMonat] = useState(start.aktiv);
  const [deckel, setDeckel] = useState(() => startDeckel(start.spitzeKw));
  const [sonne, setSonne] = useState(false);
  const [modus, setModus] = useState("2026");
  const [staffel, setStaffel] = useState("gleichzeitig");
  const [intro, setIntro] = useState("warten");
  const [kappen, setKappen] = useState([]);
  const [vorschau, setVorschau] = useState(null); // Hover-Vorschau (Maus) – ändert die Auswahl nicht
  const [uhrBeruehrt, setUhrBeruehrt] = useState(false);
  const [gesehenSpeicher, setGesehenSpeicher] = useState(false);
  const [beruehrt, setBeruehrt] = useState(false);
  const [sofort, setSofort] = useState(false);
  const [breite, setBreite] = useState(0);
  const [breiteLinks, setBreiteLinks] = useState(0);
  const [offen, setOffen] = useState({ grenz: false, staffel: false });

  const gezeigt = vorschau != null && daten.plaetze[vorschau] ? vorschau : monat;
  const v = useMemo(() => ansichtModell(daten, { monat: gezeigt, gewaehlt: monat, deckel, sonne, modus, staffel }), [daten, gezeigt, monat, deckel, sonne, modus, staffel]);
  const vRef = useRef(v);
  vRef.current = v;
  const deckelRef = useRef(deckel);
  const beruehrtRef = useRef(false);
  const ziehen = useRef(false);
  const kappenNr = useRef(0);
  const wellenNr = useRef(0);

  const uhrSvg = useRef(null);
  const tuermeSvg = useRef(null);
  const tuermeBox = useRef(null);
  const wrap = useRef(null);
  const refs = useMemo(() => ({ uhrSvg, tuermeSvg, tuermeBox, wrap }), []);

  // Steckbrief-Wert übernehmen (Rückkehr, geteilter Link), solange der Besucher den Deckel nicht bewegt hat
  const sbSchwelle = sb.schwelleKw;
  useEffect(() => {
    if (sbSchwelle != null && !beruehrtRef.current) {
      deckelRef.current = sbSchwelle;
      setDeckel(sbSchwelle);
    }
  }, [sbSchwelle]);

  // Wechsel Beispiel ↔ eigener Lastgang: Startdeckel und Monat der Jahresspitze neu
  const quelleRef = useRef(quelle);
  useEffect(() => {
    if (quelleRef.current === quelle) return;
    quelleRef.current = quelle;
    const neu = startDeckel(spitzeKw);
    deckelRef.current = neu;
    beruehrtRef.current = false;
    setDeckel(neu);
    setMonat(jahresspitzeMonat(plaetze));
  }, [quelle, spitzeKw, plaetze]);

  // ---------------------------------------------------------------- Messen (Türme passen sich der Breite an)
  // Bei Breitenwechsel (Fenster, Drehen) sofort neu zeichnen – sonst federn die Türme ihren Beschriftungen
  // hinterher; fliegende Kappen verwerfen (ihre Koordinaten gelten nicht mehr).
  const breiteRef = useRef(0);
  useLayoutEffect(() => {
    const el = tuermeBox.current;
    const w = wrap.current;
    if (!el || !w) return undefined;
    const messen = () => {
      const b = Math.round(el.clientWidth);
      if (breiteRef.current && breiteRef.current !== b) {
        setSofort(true);
        setKappen([]);
      }
      breiteRef.current = b;
      setBreite(b);
      setBreiteLinks(Math.round(w.clientWidth));
    };
    messen();
    if (typeof ResizeObserver === "undefined") return undefined;
    const ro = new ResizeObserver(messen);
    ro.observe(el);
    ro.observe(w);
    return () => ro.disconnect();
  }, []);

  // ---------------------------------------------------------------- Intro der Uhr (einmal beim Eintritt)
  useLayoutEffect(() => {
    const el = uhrSvg.current;
    if (ruhig || !el) {
      setIntro("fertig");
      return;
    }
    const r = el.getBoundingClientRect();
    // Schon im Bild (Besucher sah den Platzhalter): kein Intro, Endzustand bleibt stehen
    if (r.top < window.innerHeight * 0.85 && r.bottom > 0) setIntro("fertig");
  }, [ruhig]);
  const uhrSichtbar = useImSichtfeld(uhrSvg, { einmal: true, schwelle: 0.35 });
  useEffect(() => {
    if (intro === "warten" && uhrSichtbar) setIntro("los");
  }, [uhrSichtbar, intro]);
  // Eigener Effekt nur für „los“: der Wechsel warten → los räumt den Zeitgeber nicht mehr ab
  useEffect(() => {
    if (intro !== "los") return undefined;
    const t = window.setTimeout(() => setIntro("fertig"), 2100);
    return () => window.clearTimeout(t);
  }, [intro]);

  // ---------------------------------------------------------------- A · Monat wählen
  const waehleMonat = useCallback(
    (i) => {
      const vv = vRef.current;
      if (!vv.monate[i] || vv.monate[i].leer) return;
      setMonat(i);
      setVorschau(null);
      setUhrBeruehrt(true);
      ansagen(vv.monate[i].satz);
    },
    [ansagen]
  );
  // Hover nur als Vorschau – und nur bei echter Mausbewegung. Scrollt die Seite unter einer ruhenden Maus,
  // feuert der Browser Zeiger-Ereignisse mit unveränderten Koordinaten: die zählen nicht.
  const zeigerPos = useRef(null);
  useEffect(() => {
    const merken = (e) => {
      zeigerPos.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener("pointermove", merken, { passive: true });
    return () => window.removeEventListener("pointermove", merken);
  }, []);
  const echteBewegung = useCallback((e) => {
    const p = zeigerPos.current; // der Fenster-Hörer läuft nach React – hier steht noch die vorige Position
    return !p || Math.abs(p.x - e.clientX) + Math.abs(p.y - e.clientY) > 1;
  }, []);
  const zeigeVorschau = useCallback((i) => {
    const vv = vRef.current;
    if (i != null && (!vv.monate[i] || vv.monate[i].leer)) return;
    setVorschau(i);
  }, []);
  // Erkenntnis „Sonne schläft“: sobald der Besucher einen Monat gewählt hat UND die PV-Werte vorliegen
  const uhrGemeldet = useRef(false);
  const nullMonate = v.nullMonate;
  const anzahlMonate = v.anzahlMonate;
  useEffect(() => {
    if (!uhrBeruehrt || nullMonate == null || uhrGemeldet.current) return;
    uhrGemeldet.current = true;
    if (nullMonate >= Math.ceil(anzahlMonate / 2)) {
      steckbrief.erkenntnis("k5-sonne-schlaeft");
      ereignis("erkenntnis", { id: "k5-sonne-schlaeft" });
    }
  }, [uhrBeruehrt, nullMonate, anzahlMonate]);
  const ringAusZeiger = useCallback((clientX, clientY) => {
    const el = uhrSvg.current;
    if (!el) return null;
    const r = el.getBoundingClientRect();
    if (!r.width) return null;
    return ringBei(((clientX - r.left) / r.width) * UHR.groesse, ((clientY - r.top) / r.height) * UHR.groesse);
  }, []);
  const ringBewegen = useProBild((x, y) => zeigeVorschau(ringAusZeiger(x, y)));
  const uhrZeiger = useMemo(
    () => ({
      onPointerMove: (e) => {
        if (e.pointerType === "mouse" && echteBewegung(e)) ringBewegen(e.clientX, e.clientY);
      },
      // Klick (Maus) oder Tippen (Touch, ohne Scrollgeste) wählt den Monat
      onPointerUp: (e) => {
        if (e.button !== undefined && e.button > 0) return;
        const i = ringAusZeiger(e.clientX, e.clientY);
        if (i != null) waehleMonat(i);
      },
    }),
    [ringBewegen, ringAusZeiger, waehleMonat, echteBewegung]
  );
  const listeTaste = useCallback((e, i) => {
    const richtung = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 }[e.key];
    let ziel = null;
    const mon = vRef.current.monate;
    if (richtung) {
      ziel = i;
      do ziel = (ziel + richtung + 12) % 12;
      while (mon[ziel].leer && ziel !== i);
    } else if (e.key === "Home") ziel = mon.findIndex((x) => !x.leer);
    else if (e.key === "End") ziel = 11 - [...mon].reverse().findIndex((x) => !x.leer);
    if (ziel == null || ziel < 0) return;
    e.preventDefault();
    e.currentTarget.closest("ul")?.querySelector(`[data-monat="${ziel}"]`)?.focus();
  }, []);

  // ---------------------------------------------------------------- B · Deckel
  // Kappen-Flug: Jede Welle löst je Monat das NEU gekappte Stück (alter → neuer Deckel) als Block aus dem
  // Turm; die Blöcke heben ab und fallen im Bogen auf die Batterie, die gleichzeitig mitwächst.
  const kappenWerfen = useCallback(
    (alt, neu) => {
      const vv = vRef.current;
      const box = tuermeBox.current;
      const w = wrap.current;
      if (!box || !w || !(neu < alt - 0.25)) return;
      const hoehe = mobil ? TUERME_HOEHE.mobil : TUERME_HOEHE.breit;
      const s = tuermeSkalen({ breite: box.clientWidth, hoehe, mobil, v: vv });
      const battB = mobil ? BATTERIE_BREITE.mobil : BATTERIE_BREITE.breit;
      const bg = batterieGeometrie({ v: vv, breite: battB, hoehe, mobil });
      const zielX = w.clientWidth - battB + bg.mitteX;
      const zielY = bg.moeglich ? bg.top - bg.kappeH : bg.yB - 6;
      const bw = s.x.bandwidth();
      const welle = ++wellenNr.current;
      const neue = [];
      vv.werte.forEach((wert, i) => {
        if (!Number.isFinite(wert)) return;
        const hi = Math.min(wert, alt);
        if (hi - neu < 0.25) return;
        const y0 = s.y(hi);
        const h = Math.max(mobil ? 6 : 8, s.y(neu) - y0);
        const x0 = s.x(i);
        const sx = Math.min(1, (bg.bodyW * 0.92) / bw);
        const sy = Math.min(1, (mobil ? 6 : 8) / h);
        const dx = zielX - (x0 + bw / 2);
        const dy = zielY - (h * sy) / 2 - (y0 + h / 2);
        neue.push({
          id: ++kappenNr.current,
          welle,
          x: Math.round(x0 * 10) / 10,
          y: Math.round(y0 * 10) / 10,
          w: Math.round(bw * 10) / 10,
          h: Math.round(h * 10) / 10,
          dx,
          dy,
          // Bogen über Start und Ziel, aber nie über den Rand der Grafik hinaus
          gipfel: Math.max(Math.min(0, dy) - 26 - Math.abs(dx) * 0.05, 8 - (y0 + h / 2)),
          sx,
          sy,
          dauer: 0.58 + Math.min(0.45, Math.abs(dx) / 1500),
          verz: (11 - i) * 0.028,
        });
      });
      if (!neue.length) return;
      setKappen((liste) => {
        let l = [...liste, ...neue];
        // zu viele in der Luft: älteste Wellen zuerst verwerfen
        while (l.length > MAX_KAPPEN) {
          const aelteste = l[0].welle;
          l = l.filter((x) => x.welle !== aelteste);
        }
        return l;
      });
    },
    [mobil]
  );
  // Wellen: beim Ziehen höchstens alle WELLE_MS eine – so sind die Blöcke groß genug, um sie zu sehen
  const flugVon = useRef(null);
  const flugTimer = useRef(0);
  useEffect(() => () => window.clearTimeout(flugTimer.current), []);
  const flugAusloesen = useCallback(() => {
    window.clearTimeout(flugTimer.current);
    flugTimer.current = 0;
    const von = flugVon.current;
    const bis = deckelRef.current;
    flugVon.current = bis;
    if (von != null && bis < von) kappenWerfen(von, bis);
  }, [kappenWerfen]);
  const flugPlanen = useCallback(() => {
    if (!flugTimer.current) flugTimer.current = window.setTimeout(flugAusloesen, WELLE_MS);
  }, [flugAusloesen]);

  const deckelSetzen = useCallback(
    (roh) => {
      const vv = vRef.current;
      const b = vv.bereichDeckel;
      const neu = Math.min(b.max, Math.max(b.min, Math.round(roh / b.schritt) * b.schritt));
      const alt = Math.min(b.max, Math.max(b.min, deckelRef.current));
      if (neu === alt) return;
      deckelRef.current = neu;
      beruehrtRef.current = true;
      setDeckel(neu);
      setBeruehrt(true);
      setSofort(true);
      if (!ruhig) {
        if (flugVon.current == null) flugVon.current = alt;
        flugPlanen();
      }
    },
    [ruhig, flugPlanen]
  );

  const uebernehmen = useCallback(() => {
    if (flugTimer.current) flugAusloesen(); // Rest der Bewegung sofort fliegen lassen
    const vv = vRef.current;
    const z = vv.zeile;
    if (!beruehrtRef.current || !z) return;
    steckbrief.setze(
      {
        schwelleKw: vv.deckel,
        speicherKw: z.moeglich ? z.leistungKw : null,
        speicherKwh: z.moeglich ? z.nennKwh : null,
        lpErsparnisEuro: vv.euro != null ? euroWert(vv.euro) : null,
      },
      "k5"
    );
    ereignis("k5_deckel", { kw: vv.deckel, kwh: z.moeglich ? z.nennKwh : 0 });
  }, [flugAusloesen]);

  const ausY = useCallback(
    (clientY) => {
      const svg = tuermeSvg.current;
      if (!svg) return;
      const r = svg.getBoundingClientRect();
      const s = tuermeSkalen({ breite: r.width, hoehe: r.height, mobil, v: vRef.current });
      deckelSetzen(s.y.invert(clientY - r.top));
    },
    [mobil, deckelSetzen]
  );
  const ziehenProBild = useProBild((clientY) => ausY(clientY));

  const tasten = useTastenRegler({ wert: v.deckel, setWert: deckelSetzen, min: v.bereichDeckel.min, max: v.bereichDeckel.max, schritt: v.bereichDeckel.schritt, grob: 10 });
  const griff = useMemo(
    () => ({
      onPointerDown: (e) => {
        if (e.button !== undefined && e.button !== 0) return;
        try {
          e.currentTarget.setPointerCapture?.(e.pointerId);
        } catch {
          // Zeiger nicht (mehr) aktiv – Ziehen funktioniert trotzdem über die Ereignisse am Element
        }
        ziehen.current = true;
        beruehrtRef.current = true;
        setBeruehrt(true);
      },
      onPointerMove: (e) => {
        if (ziehen.current) ziehenProBild(e.clientY);
      },
      onPointerUp: () => {
        if (!ziehen.current) return;
        ziehen.current = false;
        uebernehmen();
      },
      onPointerCancel: () => {
        ziehen.current = false;
      },
      onKeyDown: (e) => {
        if (e.shiftKey && (e.key === "ArrowUp" || e.key === "ArrowDown")) {
          e.preventDefault();
          deckelSetzen(vRef.current.deckel + (e.key === "ArrowUp" ? 10 : -10));
          return;
        }
        tasten(e);
      },
      onKeyUp: (e) => {
        if (PFEILE.includes(e.key)) uebernehmen();
      },
    }),
    [ziehenProBild, uebernehmen, tasten, deckelSetzen]
  );
  const plotZeiger = useMemo(
    () => ({
      onPointerDown: (e) => {
        // Maus: überall in der Fläche greifen; Touch nur am Griff (Scrollen bleibt frei)
        if (e.pointerType !== "mouse" || e.button !== 0) return;
        try {
          e.currentTarget.setPointerCapture?.(e.pointerId);
        } catch {
          // Zeiger nicht (mehr) aktiv – Ziehen funktioniert trotzdem über die Ereignisse am Element
        }
        ziehen.current = true;
        ausY(e.clientY);
      },
      onPointerMove: (e) => {
        if (ziehen.current) ziehenProBild(e.clientY);
      },
      onPointerUp: () => {
        if (!ziehen.current) return;
        ziehen.current = false;
        uebernehmen();
      },
      onPointerCancel: () => {
        ziehen.current = false;
      },
    }),
    [ausY, ziehenProBild, uebernehmen]
  );

  // ---------------------------------------------------------------- Umschalter
  const sonneUmschalten = useCallback(() => {
    const neu = !sonne;
    setSofort(false);
    setSonne(neu);
    ereignis("k5_sonne", { an: neu });
    if (neu && !gesehenSpeicher) {
      setGesehenSpeicher(true);
      steckbrief.erkenntnis("k5-speicher");
      ereignis("erkenntnis", { id: "k5-speicher" });
    }
  }, [sonne, gesehenSpeicher]);
  const modusSetzen = useCallback((id) => {
    setSofort(false);
    setModus(id);
    ereignis("k5_abrechnung", { modus: id });
  }, []);
  const staffelSetzen = useCallback((id) => {
    setSofort(false);
    setStaffel(id);
  }, []);

  // ---------------------------------------------------------------- Ansage (gedrosselt) und Links für den Ausgang
  useEffect(() => {
    if (!beruehrt) return;
    const z = v.zeile;
    if (!z) ansagen(`Deckel ${zahl(v.deckel)} kW – Werte werden berechnet.`);
    else if (!z.moeglich) ansagen(`Deckel ${zahl(v.deckel)} kW – zu nah an der Dauerlast, hier hilft kein Speicher allein.`);
    else
      ansagen(
        `Deckel ${zahl(v.deckel)} kW: Speicher ${zahl(z.leistungKw)} kW und ${zahl(z.nennKwh)} kWh` +
          (v.modus === "2027" || v.euro == null ? "." : `, etwa ${zahl(euroWert(v.euro))} Euro pro Jahr weniger Leistungspreis.`)
      );
  }, [beruehrt, v.deckel, v.zeile, v.euro, v.modus, ansagen]);

  const kappZeile = v.zeile;
  useEffect(() => {
    if (!zwoelfVolle(plaetze)) {
      k5LinksSetzen({ sekundaer: null });
      return;
    }
    const q = psParams({
      verbrauch,
      spitzen: plaetze.map((x) => x.spitzeKw),
      kappung: v.deckel,
      schichten: sb.schichten || 2,
      art: "anlauf",
      bereich: sb.bereich,
      ne: sb.ne,
      kwp,
      speicher: kappZeile?.moeglich ? kappZeile.nennKwh : null,
      lp: v.lp,
    });
    k5LinksSetzen({ sekundaer: `/rechner/peak-shaving?${q}` });
  }, [plaetze, verbrauch, v.deckel, v.lp, kappZeile, sb.schichten, sb.bereich, sb.ne, kwp]);

  const kappeLanden = useCallback((id) => setKappen((liste) => liste.filter((x) => x.id !== id)), []);

  // ---------------------------------------------------------------- Komponentensatz und Slots
  const k = useMemo(
    () => ({
      bewegt: true,
      ruhig,
      G: m.g,
      Rect: m.rect,
      Circle: m.circle,
      Path: m.path,
      Line: m.line,
      Text: m.text,
      Zahl,
      Segment,
      feder: ruhig || sofort ? { duration: 0 } : BEWEGUNG.feder.steif,
      groesse: ruhig || sofort ? { duration: 0 } : { duration: BEWEGUNG.dauer.mittel, ease: BEWEGUNG.ease.aus },
    }),
    [ruhig, sofort]
  );

  const einblenden = ruhig ? { initial: false } : { initial: { opacity: 0, y: BEWEGUNG.weg }, animate: { opacity: 1, y: 0 }, transition: { duration: BEWEGUNG.dauer.lang, ease: BEWEGUNG.ease.aus } };
  const satzUhr =
    v.nullMonate == null
      ? null
      : v.nullMonate >= Math.ceil(v.anzahlMonate / 2)
        ? `Um ${v.haeufigste} schläft die Sonne noch: In ${zahl(v.nullMonate)} von ${zahl(v.anzahlMonate)} Monaten liefert die Anlage zur Monatsspitze 0 kW.`
        : `In ${zahl(v.anzahlMonate - v.nullMonate)} von ${zahl(v.anzahlMonate)} Monaten liefert die Anlage zur Monatsspitze Strom – an trüben Tagen aber nicht. Planbar kappt nur ein Speicher.`;
  const z = v.zeile;
  // Zahl, Einheit und „≈“ bleiben zusammen (kein Umbruch in „€/Jahr“)
  const zus = (t) => <span className="whitespace-nowrap">{t}</span>;
  const speicherOk = z && z.moeglich && v.euro != null;
  const satzSpeicher =
    v.modus === "2027" ? (
      // ab 2027 (Entwurf): keine Euro-Beträge – die Tarifwerte stehen aus
      <>
        PV allein: {zus(`−${zahl(v.pvAllein.senkungKw, 1)} kW`)} im Mittel der Monatsspitzen.
        {speicherOk && (
          <>
            {" "}
            Speicher {zus(`${zahl(z.leistungKw)} kW`)} / {zus(`${zahl(z.nennKwh)} kWh`)}: {zus(`−${zahl(z.senkungKw, 1)} kW`)}. Die Euro-Beträge für 2027 stehen noch aus.
          </>
        )}
      </>
    ) : (
      <>
        PV allein: {zus(`−${zahl(v.pvAllein.senkungKw, 1)} kW`)} im Mittel {zus(`${euroText(v.pvAllein.euro)}/Jahr`)}.
        {speicherOk && (
          <>
            {" "}
            Speicher {zus(`${zahl(z.leistungKw)} kW`)} / {zus(`${zahl(z.nennKwh)} kWh`)}: {zus(`−${zahl(z.senkungKw, 1)} kW`)} {zus(`${euroText(v.euro)}/Jahr`)}.
          </>
        )}
      </>
    );

  const slots = {
    erkenntnisUhr:
      uhrBeruehrt && satzUhr ? (
        <m.div key="e-uhr" {...einblenden}>
          <Erkenntnis dunkel data-testid="erkenntnis-sonne">
            {satzUhr}
          </Erkenntnis>
        </m.div>
      ) : null,
    erkenntnisDeckel: gesehenSpeicher ? (
      <m.div key="e-speicher" {...einblenden}>
        <Erkenntnis dunkel data-testid="erkenntnis-speicher" className="md:text-[18px]">
          {satzSpeicher}
        </Erkenntnis>
      </m.div>
    ) : null,
    kappen:
      kappen.length > 0 ? (
        <svg aria-hidden="true" className="pointer-events-none absolute inset-0 z-3 h-full w-full overflow-visible">
          {kappen.map((c) => (
            <m.rect
              key={c.id}
              x={c.x}
              y={c.y}
              width={c.w}
              height={c.h}
              rx={Math.min(2.5, c.w / 5)}
              fill={FARBE.sun500}
              stroke={FARBE.navy950}
              strokeWidth={1.5}
              style={{ transformBox: "fill-box", transformOrigin: "50% 50%", filter: "drop-shadow(0 4px 6px rgba(3,18,43,0.45))" }}
              initial={{ x: 0, y: 0, scaleX: 1, scaleY: 1, opacity: 1 }}
              animate={{ x: [0, 0, c.dx * 0.5, c.dx], y: [0, -12, c.gipfel, c.dy], scaleX: [1, 1.06, 1, c.sx], scaleY: [1, 1.06, 1, c.sy], opacity: [1, 1, 0] }}
              transition={{
                duration: c.dauer,
                delay: c.verz,
                times: [0, 0.14, 0.52, 1],
                ease: ["easeOut", "easeInOut", "easeIn"],
                // voll sichtbar bis zur Landung auf der Batterie, dann weg (kein bräunlicher Halbton über Navy)
                opacity: { duration: c.dauer + 0.08, delay: c.verz, times: [0, 0.93, 1] },
              }}
              onAnimationComplete={() => kappeLanden(c.id)}
            />
          ))}
        </svg>
      ) : null,
    ansage: (
      <p aria-live="polite" className="sr-only">
        {ansage}
      </p>
    ),
  };

  const aktionen = {
    monat: waehleMonat,
    monatZeiger: (e, i) => {
      if (e.pointerType === "mouse" && echteBewegung(e)) zeigeVorschau(i);
    },
    vorschauEnde: () => setVorschau(null),
    listeTaste,
    uhrZeiger,
    plotZeiger,
    griff,
    range: (e) => deckelSetzen(Number(e.target.value)),
    loslassen: uebernehmen,
    sonne: sonneUmschalten,
    modus: modusSetzen,
    staffel: staffelSetzen,
    umschalten: (id) => {
      setSofort(false);
      setOffen((o) => ({ ...o, [id]: !o[id] }));
      ereignis("k5_aufklappen", { teil: id });
    },
  };

  return (
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion="user">
        <div data-k5-daten={kapp ? "voll" : last ? "teil" : "start"} data-k5-intro={intro} className="contents" />
        <K5Ansicht v={v} k={k} aktionen={aktionen} slots={slots} refs={refs} mass={{ breite, breiteLinks, mobil }} intro={intro} hinweis={!beruehrt} offen={offen} />
      </MotionConfig>
    </LazyMotion>
  );
}
