// src/components/GewerbeUnikat/_lastgang.worker.js
//
// Web Worker der Unikat-Seite /gewerbe: rechnet den Lastgang (Beispiel oder eigene Datei) abseits des
// Hauptthreads – Parsen ≈ 150 ms, Analyse ≈ 80 ms, PV-Profil ≈ 180 ms, Kappungstabelle ≈ 100 ms (Node,
// Messung 12.10.2026). Gestartet wird er ausschließlich über ./_daten.js.
//
// Nachrichten an den Worker:
//   { auftrag: "beispiel", id, ortId?, ausrichtung? }   synthetischer Beispielbetrieb
//   { auftrag: "datei", id, bytes, ortId?, ausrichtung? } eigener Lastgang – NUR nach bestätigter E-Mail
//                                                       (Lead-Gate „lastgang-analyse“, Stufe 2) schicken
//   { auftrag: "pv", id, ortId, ausrichtung }            PV für den aktuellen Lastgang neu (Ort/Dachart aus K2)
// Antworten:
//   { typ: "daten", id, last, pv }   { typ: "kappung", id, kapp }   { typ: "pv", id, pv }
//   { typ: "fehler", id, meldung, code }
//
// Datenschutz: Die Datei bleibt im Arbeitsspeicher dieses Browsers. Nichts wird gesendet oder gespeichert.

import pvgis from "../../data/regionen-pvgis.json";
import { BEISPIEL_AUSRICHTUNG, BEISPIEL_ORT, beispielLastgang, kappTabelle, lastAufbereiten, lastgangAusBytes, pvAufbereiten } from "./_rechnen.js";

let lg = null;
let last = null;

const ortFuer = (id) => (pvgis.orte[id] ? [id, pvgis.orte[id]] : [BEISPIEL_ORT, pvgis.orte[BEISPIEL_ORT]]);
const ausrichtungFuer = (a) => (["sued", "ostwest", "flach"].includes(a) ? a : BEISPIEL_AUSRICHTUNG);

function pvRechnen(ortId, ausrichtung) {
  const [id, ort] = ortFuer(ortId);
  return pvAufbereiten(lg, last, ort, id, ausrichtungFuer(ausrichtung));
}

self.onmessage = (e) => {
  const { auftrag, id } = e.data || {};
  try {
    if (auftrag === "beispiel" || auftrag === "datei") {
      lg = auftrag === "beispiel" ? beispielLastgang() : lastgangAusBytes(e.data.bytes);
      last = lastAufbereiten(lg, auftrag === "beispiel" ? "beispiel" : "eigen");
      const pv = pvRechnen(e.data.ortId, e.data.ausrichtung);
      self.postMessage({ typ: "daten", id, last, pv });
      // Kappungstabelle danach – K5 braucht sie erst später
      self.postMessage({ typ: "kappung", id, kapp: kappTabelle(last) });
    } else if (auftrag === "pv") {
      if (!lg) throw new Error("Noch kein Lastgang geladen.");
      self.postMessage({ typ: "pv", id, pv: pvRechnen(e.data.ortId, e.data.ausrichtung) });
    }
  } catch (err) {
    self.postMessage({
      typ: "fehler",
      id,
      meldung: err?.name === "LastgangFehler" ? err.message : "Die Datei konnte nicht ausgewertet werden. Bitte als CSV mit Datum, Uhrzeit und Viertelstundenwerten exportieren.",
      code: err?.code || "unbekannt",
    });
  }
};
