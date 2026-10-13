// scripts/peer-to-peer.test.mjs
//
// Prüft src/components/Rechner/peerToPeerRechnung.js: OeMAG-Referenzen aus src/data/oemag.js,
// Rechenlogik (Mehrerlös, Ersparnis, fairer Preis), Lieferantenpflicht-Schwellen, CSV-Export.
// Aufruf: node scripts/peer-to-peer.test.mjs

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { OEMAG_MONATE } from "../src/data/oemag.js";
import { GRENZEN, OEMAG_REFERENZEN, P2P_ANNAHMEN, STANDARD, csvExport, lieferantenpflicht, rechnePeerToPeer, referenzFuer } from "../src/components/Rechner/peerToPeerRechnung.js";

let tests = 0;
const t = (name, fn) => {
  tests += 1;
  try {
    fn();
    console.log(`  ok  ${name}`);
  } catch (e) {
    console.error(`  FEHLER ${name}\n     ${e.message}`);
    process.exitCode = 1;
  }
};
const nahe = (a, b, eps = 1e-6) => assert.ok(Math.abs(a - b) < eps, `${a} ≠ ${b}`);

console.log("peerToPeerRechnung.js");

t("OeMAG-Referenzen stammen aus den Monatswerten", () => {
  const letzte12 = OEMAG_MONATE.slice(-12);
  const mittel = letzte12.reduce((a, m) => a + m.ct, 0) / 12;
  nahe(referenzFuer("mittel12").ct, Math.round(mittel * 1000) / 1000, 1e-9);
  assert.equal(referenzFuer("letzter").ct, OEMAG_MONATE[OEMAG_MONATE.length - 1].ct);
  const j25 = OEMAG_MONATE.filter((m) => m.monat.startsWith("2025-"));
  assert.equal(j25.length, 12);
  nahe(referenzFuer("jahr2025").ct, Math.round((j25.reduce((a, m) => a + m.ct, 0) / 12) * 1000) / 1000, 1e-9);
  assert.equal(referenzFuer("unbekannt").id, OEMAG_REFERENZEN[0].id);
  for (const r of OEMAG_REFERENZEN) assert.ok(r.ct > 3 && r.ct < 20, `${r.id}: ${r.ct}`);
});

t("Standardfall: Mehrerlös = geteilte Menge × (P2P − OeMAG), Ersparnis = geteilte Menge × (Energiepreis − P2P)", () => {
  const r = rechnePeerToPeer();
  assert.equal(r.geteilteKwh, STANDARD.ueberschussKwh * STANDARD.gleichzeitigkeit);
  nahe(r.mehrerloes, (r.geteilteKwh * (STANDARD.p2pPreisCt - r.oemagCt)) / 100);
  nahe(r.ersparnisEnergie, (r.geteilteKwh * (STANDARD.energiepreisCt - STANDARD.p2pPreisCt)) / 100);
  nahe(r.erloesMit, r.erloesP2p + r.erloesRest);
  nahe(r.erloesOhne, (STANDARD.ueberschussKwh * r.oemagCt) / 100);
  assert.equal(r.ersparnisNetz, 0, "Netzentgelt-Abschlag standardmäßig 0 (keine erfundenen Abschläge)");
  assert.equal(P2P_ANNAHMEN.netzentgeltAbschlagCt, 0);
  nahe(r.fairerPreisCt, Math.round(((r.oemagCt + STANDARD.energiepreisCt) / 2) * 100) / 100);
});

t("P2P-Preis gleich OeMAG: kein Mehrerlös; gleich Energiepreis: keine Ersparnis", () => {
  const ref = referenzFuer("mittel12").ct;
  nahe(rechnePeerToPeer({ p2pPreisCt: ref }).mehrerloes, 0);
  nahe(rechnePeerToPeer({ p2pPreisCt: 14, energiepreisCt: 14 }).ersparnisEnergie, 0);
  assert.equal(rechnePeerToPeer({ p2pPreisCt: ref - 1 }).preisUnterOemag, true);
  assert.equal(rechnePeerToPeer({ p2pPreisCt: 15, energiepreisCt: 14 }).preisUeberEnergiepreis, true);
});

t("Netzentgelt-Abschlag wirkt nur als Eingabe auf die Abnehmer-Ersparnis", () => {
  const ohne = rechnePeerToPeer();
  const mit = rechnePeerToPeer({ netzentgeltAbschlagCt: 2 });
  nahe(mit.ersparnisNetz, (mit.geteilteKwh * 2) / 100);
  nahe(mit.mehrerloes, ohne.mehrerloes);
  nahe(mit.ersparnisAbnehmer - ohne.ersparnisAbnehmer, mit.ersparnisNetz);
});

t("Monotonie: mehr Gleichzeitigkeit und höherer P2P-Preis erhöhen den Mehrerlös", () => {
  const a = rechnePeerToPeer({ gleichzeitigkeit: 0.4, p2pPreisCt: 10 });
  const b = rechnePeerToPeer({ gleichzeitigkeit: 0.8, p2pPreisCt: 10 });
  const c = rechnePeerToPeer({ gleichzeitigkeit: 0.8, p2pPreisCt: 12 });
  assert.ok(b.mehrerloes > a.mehrerloes && c.mehrerloes > b.mehrerloes);
});

t("Eingaben werden auf die Grenzen geklemmt", () => {
  const r = rechnePeerToPeer({ ueberschussKwh: 1e9, gleichzeitigkeit: 5, p2pPreisCt: -3, energiepreisCt: 0, netzentgeltAbschlagCt: 99, anlageKwp: 0 });
  assert.equal(r.eingaben.ueberschussKwh, GRENZEN.ueberschussKwh.max);
  assert.equal(r.eingaben.gleichzeitigkeit, GRENZEN.gleichzeitigkeit.max);
  assert.equal(r.eingaben.p2pPreisCt, GRENZEN.p2pPreisCt.min);
  assert.equal(r.eingaben.energiepreisCt, GRENZEN.energiepreisCt.min);
  assert.equal(r.eingaben.netzentgeltAbschlagCt, GRENZEN.netzentgeltAbschlagCt.max);
  assert.equal(r.eingaben.anlageKwp, GRENZEN.anlageKwp.min);
  assert.ok(Number.isFinite(r.mehrerloes));
});

t("Lieferantenpflicht: Haushalt über 30 kW, sonst über 100 kW (§ 69 ElWG laut Koordinationsstelle)", () => {
  assert.equal(lieferantenpflicht(30, "haushalt").trifft, false);
  assert.equal(lieferantenpflicht(31, "haushalt").trifft, true);
  assert.equal(lieferantenpflicht(100, "sonst").trifft, false);
  assert.equal(lieferantenpflicht(100.5, "sonst").trifft, true);
  assert.equal(lieferantenpflicht(60, "sonst").schwelleKw, 100);
  assert.match(lieferantenpflicht(150).text, /§ 69 ElWG/);
  assert.match(rechnePeerToPeer({ anlageKwp: 40, erzeugerTyp: "haushalt" }).lieferantenpflicht.text, /über 30 kW/);
});

t("CSV-Export: Semikolon, Kopf, alle Kennzahlen, Quellen", () => {
  const r = rechnePeerToPeer({ ueberschussKwh: 30000, gleichzeitigkeit: 0.6, p2pPreisCt: 10 });
  const csv = csvExport(r, "11.10.2026");
  const zeilen = csv.split("\r\n");
  assert.ok(zeilen.length > 20);
  assert.ok(zeilen[0].startsWith('"Peer-to-Peer-Rechner Ökovolt";"Stand 11.10.2026"'));
  assert.ok(zeilen.every((z) => z.split(";").length === 2), "jede Zeile zwei Felder");
  assert.ok(csv.includes("Richtwert"));
  assert.ok(csv.includes('"Geteilte Menge (kWh)";"18.000"'));
  assert.ok(csv.includes("oem-ag.at/marktpreis") && csv.includes("ris.bka.gv.at"));
  assert.ok(csv.includes("Mehrerlös Erzeuger"));
});

t("Lead-Gate im Rechner: Double-Opt-in, Kennung peer-to-peer, keine Freischaltung im Browser-Speicher", () => {
  const src = readFileSync(new URL("../src/components/Rechner/PeerToPeerRechner.js", import.meta.url), "utf8");
  assert.ok(src.includes('GATE_KENNUNG = "peer-to-peer"'));
  assert.ok(src.includes("/api/lead-gate/status"), "Freischaltung wird serverseitig geprüft");
  assert.ok(src.includes("/api/rechner_lead"));
  assert.ok(src.includes("Bitte E-Mail bestätigen") && src.includes("Spam-Ordner") && src.includes("ERNEUT_NACH_S = 60"));
  assert.ok(!/sessionStorage|localStorage/.test(src), "keine Freischaltung über Browser-Speicher");
  assert.ok(/process\.env\.NODE_ENV !== "production"/.test(src), "Simulation nur außerhalb der Produktion");
  assert.ok(src.includes("Art. 6") && src.includes("/datenschutz"));
  // Telefon erst nach Häkchen, Häkchen nicht vorangekreuzt
  assert.ok(src.includes("{kontaktOk && (") && src.includes("useState(Boolean(vorgabe?.kontaktOk))"));
});

console.log(process.exitCode ? `\n${tests} Tests, Fehler siehe oben` : `\n${tests} Tests grün`);
