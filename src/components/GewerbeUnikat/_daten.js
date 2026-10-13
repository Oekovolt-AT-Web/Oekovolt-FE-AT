"use client";

// src/components/GewerbeUnikat/_daten.js
//
// Gemeinsame Daten aller Kapitel-Inseln: EIN Lastgang (synthetisches Beispiel oder – nach bestätigter
// E-Mail – der eigene), gerechnet EINMAL im Web Worker (./_lastgang.worker.js) und von allen Kapiteln
// geteilt. Fällt der Worker aus, rechnet der Hauptthread im Leerlauf (gleiche Funktionen aus ./_rechnen.js).
//
//   vorwaermen()                     im Leerlauf nach dem Laden starten (Hero ruft das auf)
//   const d = useGewerbeDaten();     { status, quelle, last, pv, kapp, fehler, ortId, ausrichtung, pvLaedt }
//     status: "leer" | "laedt" | "bereit" | "fehler"
//     last:   Ergebnis von lastAufbereiten() (Kennzahlen, raster, reihe …)
//     pv:     Ergebnis von pvAufbereiten() (raster kW/kWp, reihe kWh/kWp, empfehlung, kurve …)
//     kapp:   Ergebnis von kappTabelle() (kommt kurz nach last/pv)
//   pvSetzen(ortId, ausrichtung)     K2 → neuer Ort / neue Dachart (Ausrichtung) für alle Kapitel
//   eigeneDateiAuswerten(file, { freigegeben })   K1 – nur mit freigegeben === true (Lead-Gate Stufe 2)
//   zumBeispiel()                    zurück zum synthetischen Beispiel
//
// Dachart → Ausrichtung des PV-Profils: ost-west → "ostwest", sued → "flach" (aufgeständert, flach geneigt),
// trapez → "flach", shed → "sued" (siehe AUSRICHTUNG_FUER_DACHART).

import { useSyncExternalStore } from "react";

export const AUSRICHTUNG_FUER_DACHART = { "ost-west": "ostwest", sued: "flach", trapez: "flach", shed: "sued" };

const START = Object.freeze({
  status: "leer",
  quelle: "beispiel",
  last: null,
  pv: null,
  kapp: null,
  fehler: null,
  ortId: "linz",
  ausrichtung: "ostwest",
  pvLaedt: false,
});

let z = START;
const hoerer = new Set();
let worker = null;
let workerKaputt = false;
let nr = 0;
let lastAuftrag = 0; // id des letzten Last-Auftrags (beispiel/datei) – ältere Antworten verwerfen
let pvAuftrag = 0;
const warten = new Map(); // id → { ok, nein } für eigeneDateiAuswerten

function setze(teil) {
  z = { ...z, ...teil };
  for (const h of hoerer) h();
}

function empfangen(e) {
  const m = e.data || {};
  if (m.typ === "daten") {
    if (m.id !== lastAuftrag) return;
    setze({ status: "bereit", quelle: m.last.quelle, last: m.last, pv: m.pv, kapp: null, fehler: null, pvLaedt: false, ortId: m.pv.ortId, ausrichtung: m.pv.ausrichtung });
    warten.get(m.id)?.ok(m.last);
    warten.delete(m.id);
  } else if (m.typ === "kappung") {
    if (m.id !== lastAuftrag) return;
    setze({ kapp: m.kapp });
  } else if (m.typ === "pv") {
    if (m.id !== pvAuftrag) return;
    setze({ pv: m.pv, pvLaedt: false, ortId: m.pv.ortId, ausrichtung: m.pv.ausrichtung });
  } else if (m.typ === "fehler") {
    const w = warten.get(m.id);
    if (w) {
      // Fehler einer eigenen Datei: Beispiel bleibt stehen, das Kapitel zeigt die Meldung
      w.nein(Object.assign(new Error(m.meldung), { code: m.code }));
      warten.delete(m.id);
      setze({ fehler: m.meldung, pvLaedt: false, status: z.last ? "bereit" : "fehler" });
    } else {
      setze({ fehler: m.meldung, pvLaedt: false, status: z.last ? "bereit" : "fehler" });
    }
  }
}

function holeWorker() {
  if (worker || workerKaputt || typeof window === "undefined" || typeof Worker === "undefined") return worker;
  try {
    worker = new Worker(new URL("./_lastgang.worker.js", import.meta.url));
    worker.onmessage = empfangen;
    worker.onerror = () => {
      workerKaputt = true;
      worker = null;
      // laufenden Beispiel-Auftrag im Hauptthread nachholen
      if (z.status === "laedt") imHauptthread({ auftrag: "beispiel", id: lastAuftrag, ortId: z.ortId, ausrichtung: z.ausrichtung });
    };
  } catch {
    workerKaputt = true;
    worker = null;
  }
  return worker;
}

/** Rückfall ohne Worker: dieselben Funktionen im Hauptthread, in Leerlauf-Häppchen. */
async function imHauptthread(auftrag) {
  const [r, pvgisModul] = await Promise.all([import("./_rechnen.js"), import("@/data/regionen-pvgis.json")]);
  const pvgis = pvgisModul.default || pvgisModul;
  const pause = () => new Promise((res) => (window.requestIdleCallback ? window.requestIdleCallback(res, { timeout: 500 }) : setTimeout(res, 16)));
  try {
    await pause();
    const lg = auftrag.auftrag === "datei" ? r.lastgangAusBytes(auftrag.bytes) : r.beispielLastgang();
    await pause();
    const last = r.lastAufbereiten(lg, auftrag.auftrag === "datei" ? "eigen" : "beispiel");
    await pause();
    const ortId = pvgis.orte[auftrag.ortId] ? auftrag.ortId : r.BEISPIEL_ORT;
    const pv = r.pvAufbereiten(lg, last, pvgis.orte[ortId], ortId, auftrag.ausrichtung || r.BEISPIEL_AUSRICHTUNG);
    empfangen({ data: { typ: "daten", id: auftrag.id, last, pv } });
    await pause();
    empfangen({ data: { typ: "kappung", id: auftrag.id, kapp: r.kappTabelle(last) } });
    // für spätere PV-Aufträge merken
    hauptthreadLg = { lg, last };
  } catch (err) {
    empfangen({ data: { typ: "fehler", id: auftrag.id, meldung: err?.name === "LastgangFehler" ? err.message : "Die Daten konnten nicht berechnet werden.", code: err?.code || "unbekannt" } });
  }
}
let hauptthreadLg = null;

function senden(auftrag) {
  const w = holeWorker();
  if (w) w.postMessage(auftrag);
  else imHauptthread(auftrag);
}

/** Beispiel im Leerlauf rechnen (idempotent). */
export function vorwaermen() {
  if (z.status !== "leer") return;
  lastAuftrag = ++nr;
  setze({ status: "laedt" });
  senden({ auftrag: "beispiel", id: lastAuftrag, ortId: z.ortId, ausrichtung: z.ausrichtung });
}

/** PV für Ort/Ausrichtung neu rechnen (K2). Ohne geladene Daten wird nur der Wunsch gemerkt. */
export function pvSetzen(ortId, ausrichtung) {
  if (ortId === z.ortId && ausrichtung === z.ausrichtung) return;
  if (z.status !== "bereit") {
    setze({ ortId, ausrichtung });
    return;
  }
  pvAuftrag = ++nr;
  setze({ pvLaedt: true });
  const w = holeWorker();
  if (w) w.postMessage({ auftrag: "pv", id: pvAuftrag, ortId, ausrichtung });
  else
    (async () => {
      const [r, pvgisModul] = await Promise.all([import("./_rechnen.js"), import("@/data/regionen-pvgis.json")]);
      const pvgis = pvgisModul.default || pvgisModul;
      if (!hauptthreadLg) return;
      const id = pvgis.orte[ortId] ? ortId : r.BEISPIEL_ORT;
      empfangen({ data: { typ: "pv", id: pvAuftrag, pv: r.pvAufbereiten(hauptthreadLg.lg, hauptthreadLg.last, pvgis.orte[id], id, ausrichtung) } });
    })();
}

/**
 * Eigenen Lastgang auswerten – AUSSCHLIESSLICH nach bestätigter E-Mail (useLeadGate, Kennung
 * "lastgang-analyse", modus "auswertung"). Ohne freigegeben === true passiert nichts.
 * @param {File} file CSV/TXT
 * @returns {Promise<object>} last bei Erfolg; wirft Error mit verständlicher Meldung
 */
export async function eigeneDateiAuswerten(file, { freigegeben } = {}) {
  if (freigegeben !== true) throw new Error("Die Auswertung eigener Daten startet erst nach bestätigter E-Mail.");
  const bytes = new Uint8Array(await file.arrayBuffer());
  lastAuftrag = ++nr;
  const id = lastAuftrag;
  setze({ status: z.last ? "bereit" : "laedt", fehler: null });
  return new Promise((ok, nein) => {
    warten.set(id, { ok, nein });
    senden({ auftrag: "datei", id, bytes, ortId: z.ortId, ausrichtung: z.ausrichtung });
  });
}

/** Zurück zum synthetischen Beispiel (eigene Daten werden verworfen). */
export function zumBeispiel() {
  lastAuftrag = ++nr;
  setze({ fehler: null });
  senden({ auftrag: "beispiel", id: lastAuftrag, ortId: z.ortId, ausrichtung: z.ausrichtung });
}

function abonnieren(cb) {
  hoerer.add(cb);
  return () => hoerer.delete(cb);
}
const lesen = () => z;
const lesenServer = () => START;

/** Daten lesen (alle Kapitel). Mit selector nur ein Feld (Rückgabe stabil halten). */
export function useGewerbeDaten(selector) {
  const s = useSyncExternalStore(abonnieren, lesen, lesenServer);
  return selector ? selector(s) : s;
}
