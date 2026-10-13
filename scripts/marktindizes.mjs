// Erzeugt die eigenen Marktindizes von Ökovolt Österreich (B10) aus offenen Daten:
//   data/marktindizes/speicher-spread-index.json  – Speicher-Spread-Index (1 MWh / 0,5 MW, 1 Zyklus/Tag, 88 % Round-Trip)
//   data/marktindizes/solar-marktwert.json        – Solar-Marktwert (PV-gewichteter Monatspreis, Ökovolt-Schätzung)
//
// Aufruf (manuell, Anfang jedes Monats, wenn der Vormonat vollständig ist):
//   node scripts/marktindizes.mjs                  → 2024-01 bis zum letzten vollständigen Monat
//   node scripts/marktindizes.mjs --von 2025-01 --bis 2026-09
//
// Quellen (beide CC BY 4.0):
//   Preise:  SMARD (Bundesnetzagentur), Filter 4170 „Marktpreis: Österreich“, Auflösung quarterhour –
//            derselbe Abruf wie auf /energie-live (src/lib/energy.js, smardPreise). Bis 30.09.2025 Stundenpreise
//            als vier gleiche Viertelstunden, seit 01.10.2025 echte Viertelstunden-Day-Ahead-Preise.
//   PV:      Energy-Charts (Fraunhofer ISE), public_power country=at, Reihe „Solar“ (öffentliche Netto-Solarerzeugung,
//            MW je Viertelstunde) als Gewicht für den Solar-Marktwert.
// Rechenregeln: src/lib/marktindizes.js (Test: scripts/marktindizes.test.mjs).
//
// Der Index ist eine theoretische Obergrenze bzw. eine Ökovolt-Schätzung – kein amtlicher Wert
// und keine Erlöszusage. Jede Zahl auf den Seiten trägt Quelle, Stand und den Hinweis „Richtwert/Orientierung“.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { smardPreise, SMARD_ATTRIBUTION, SMARD_FILTER_AT, SMARD_LIZENZ } from "../src/lib/energy.js";
import { indexAus, monatVon, monateZwischen, naechsterMonat, SPEICHER, MIN_ABDECKUNG_MONAT, ZEITZONE } from "../src/lib/marktindizes.js";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const ZIEL = path.join(ROOT, "data", "marktindizes");
const EC = "https://api.energy-charts.info";

/* ---------- Argumente ---------- */
const args = process.argv.slice(2);
const arg = (name) => {
  const i = args.indexOf(name);
  return i >= 0 ? args[i + 1] : null;
};
const heuteMonat = monatVon(Date.now());
const letzterVollerMonat = (() => {
  const j = Number(heuteMonat.slice(0, 4));
  const m = Number(heuteMonat.slice(5, 7));
  return m === 1 ? `${j - 1}-12` : `${j}-${String(m - 1).padStart(2, "0")}`;
})();
const VON = arg("--von") || "2024-01";
const BIS = arg("--bis") || letzterVollerMonat;
if (!/^\d{4}-\d{2}$/.test(VON) || !/^\d{4}-\d{2}$/.test(BIS) || VON > BIS) {
  console.error(`Ungültiger Zeitraum ${VON}..${BIS}`);
  process.exit(1);
}

/** Monatsanfang (Wiener Ortszeit) als ms – über die Kalenderfunktion ohne Zeitzonenbibliothek */
function monatsanfangMs(monat) {
  // Startschätzung in UTC, dann so lange korrigieren, bis der Wiener Kalendermonat passt
  let t = Date.UTC(Number(monat.slice(0, 4)), Number(monat.slice(5, 7)) - 1, 1) - 3 * 3600000;
  while (monatVon(t) < monat) t += 900000;
  while (monatVon(t - 900000) >= monat) t -= 900000;
  return t;
}

const warte = (ms) => new Promise((r) => setTimeout(r, ms));

/** JSON holen; Energy-Charts begrenzt die Abrufrate (HTTP 429) – deshalb bis zu 5 Versuche mit wachsender Pause */
async function holeJson(url, versuche = 5) {
  for (let i = 1; ; i++) {
    try {
      const res = await fetch(url, { headers: { Accept: "application/json", "User-Agent": "oekovolt.com marktindizes (manuell, monatlich)" } });
      if (!res.ok) throw new Error(`${url} -> ${res.status}`);
      return await res.json();
    } catch (e) {
      if (i >= versuche) throw e;
      const pause = 5000 * i;
      console.warn(`  Versuch ${i} fehlgeschlagen (${e.message}), neuer Versuch in ${pause / 1000} s`);
      await warte(pause);
    }
  }
}

/** PV-Einspeisung Österreich (MW je Viertelstunde) eines Monats von Energy-Charts */
async function pvMonat(monat) {
  const von = `${monat}-01`;
  const bis = `${naechsterMonat(monat)}-01`;
  const j = await holeJson(`${EC}/public_power?country=at&start=${von}&end=${bis}`);
  const solar = j.production_types?.find((p) => p.name === "Solar")?.data || [];
  const zeiten = j.unix_seconds || [];
  const punkte = [];
  for (let i = 0; i < zeiten.length; i++) {
    const mw = solar[i];
    const t = zeiten[i] * 1000;
    if (typeof mw === "number" && monatVon(t) === monat) punkte.push({ t, mw });
  }
  return punkte;
}

/* ---------- Abruf ---------- */
const monate = monateZwischen(VON, BIS);
console.log(`Marktindizes ${VON}..${BIS} (${monate.length} Monate), Zeitzone ${ZEITZONE}`);

const von = monatsanfangMs(VON);
const bis = monatsanfangMs(naechsterMonat(BIS));
console.log(`SMARD Filter ${SMARD_FILTER_AT}, Viertelstunden ${new Date(von).toISOString()} .. ${new Date(bis).toISOString()}`);
const preise = await smardPreise(von, bis, { aufloesung: "quarterhour" });
console.log(`  ${preise.length} Preispunkte`);

const pv = [];
const pvAbdeckung = {};
for (const m of monate) {
  try {
    const p = await pvMonat(m);
    pv.push(...p);
    pvAbdeckung[m] = p.length;
    console.log(`  PV ${m}: ${p.length} Viertelstunden`);
    await warte(2000); // Abrufrate schonen
  } catch (e) {
    pvAbdeckung[m] = 0;
    console.warn(`  PV ${m}: kein Abruf (${e.message})`);
  }
}

/* ---------- Rechnen ---------- */
const index = indexAus(preise, pv, SPEICHER).filter((m) => m.monat >= VON && m.monat <= BIS);
const luecken = index.filter((m) => m.abdeckung < MIN_ABDECKUNG_MONAT).map((m) => `${m.monat} (${Math.round(m.abdeckung * 100)} %)`);
if (luecken.length) console.warn(`Monate mit Lücken: ${luecken.join(", ")}`);
const fehlend = monate.filter((m) => !index.some((i) => i.monat === m));
if (fehlend.length) console.warn(`Ohne Daten: ${fehlend.join(", ")}`);

const stand = new Date().toISOString().slice(0, 10);
// Quellen je Index: Der Speicher-Index rechnet nur mit SMARD-Preisen, der Solar-Marktwert zusätzlich mit Energy-Charts.
const QUELLE_SMARD = { name: `${SMARD_ATTRIBUTION} – Marktpreis Österreich (Filter ${SMARD_FILTER_AT}, Day-Ahead, Viertelstunde)`, url: "https://www.smard.de/home/downloadcenter/download-marktdaten/", lizenz: "CC BY 4.0" };
const QUELLE_EC = { name: "Energy-Charts (Fraunhofer ISE) – öffentliche Nettostromerzeugung Österreich, Reihe Solar", url: "https://www.energy-charts.info/?l=de&c=AT", lizenz: "CC BY 4.0" };

const basis = {
  lizenz: "CC BY 4.0",
  lizenzUrl: SMARD_LIZENZ,
  herausgeber: "Ökovolt Solartechnik GmbH (Ökovolt Österreich)",
  stand,
  zeitraum: { von: index[0]?.monat || VON, bis: index[index.length - 1]?.monat || BIS },
  zeitzone: ZEITZONE,
  hinweis: "Eigene Berechnung von Ökovolt Österreich aus offenen Daten – nicht amtlich, keine Erlöszusage, Richtwert/Orientierung.",
  skript: "scripts/marktindizes.mjs",
  rechenregeln: "src/lib/marktindizes.js",
};

const speicherDatei = {
  name: "Ökovolt Speicher-Spread-Index Österreich",
  beschreibung:
    "Theoretischer Spread-Erlös eines Batteriespeichers (1 MWh nutzbar, 0,5 MW, ein Vollzyklus je Tag, Round-Trip 88 %) am Day-Ahead-Markt der Gebotszone AT bei perfekter Voraussicht – Obergrenze ohne Netzentgelte, Abgaben, Degradation und Vermarktungsentgelt. Dazu Monatsmittel, Minimum, Maximum und Zahl der negativen Viertelstunden.",
  ...basis,
  attribution: "Ökovolt Österreich – Speicher-Spread-Index, Daten: Bundesnetzagentur | SMARD.de, CC BY 4.0",
  quellen: [QUELLE_SMARD],
  annahmen: {
    ...SPEICHER,
    ladeschritte: "günstigste Viertelstunden des Tages bis zur vollen Kapazität (bei 0,5 MW: 8 Viertelstunden)",
    entladeschritte: "teuerste Viertelstunden des Tages, Energie abzüglich Round-Trip-Verlust",
    reihenfolge: "ohne Reihenfolge-Bedingung Laden vor Entladen – deshalb Obergrenze",
    tage: "nur Tage mit mindestens 90 % der Viertelstunden; Monatswert = Tagesmittel × Kalendertage",
    bis2025_09: "Stundenpreise (vier gleiche Viertelstunden) – entspricht 2 Lade- und 2 Entladestunden",
  },
  einheiten: { spreadErloesEur: "€ je Monat (1 MWh Speicher)", spreadProTag: "€ je Tag", spreadJeKwh: "€ je kWh nutzbarer Kapazität und Monat", mittel: "€/MWh", min: "€/MWh", max: "€/MWh", negativ: "Viertelstunden mit Preis < 0", negativStunden: "Stunden", abdeckung: "Anteil vorhandener Viertelstunden" },
  monate: index.map(({ monat, viertelstunden, abdeckung, schrittMin, mittel, min, max, negativ, negativStunden, spreadErloesEur, spreadTage, spreadProTag, spreadJeKwh }) => ({
    monat,
    viertelstunden,
    abdeckung,
    schrittMin,
    mittel,
    min,
    max,
    negativ,
    negativStunden,
    spreadErloesEur,
    spreadTage,
    spreadProTag,
    spreadJeKwh,
  })),
};

const solarDatei = {
  name: "Ökovolt Solar-Marktwert Österreich",
  beschreibung:
    "PV-gewichteter Day-Ahead-Monatspreis der Gebotszone AT: Summe aus Viertelstundenpreis × öffentlicher Netto-Solarerzeugung Österreichs, geteilt durch die Solarerzeugung. Eigene Schätzung von Ökovolt – nicht der amtliche Referenzmarktwert der E-Control nach § 13 EAG. Dazu das ungewichtete Monatsmittel und der Marktwertfaktor (Solar-Marktwert ÷ Monatsmittel).",
  ...basis,
  attribution: "Ökovolt Österreich – Solar-Marktwert, Daten: Bundesnetzagentur | SMARD.de und Energy-Charts (Fraunhofer ISE), jeweils CC BY 4.0",
  quellen: [QUELLE_SMARD, QUELLE_EC],
  methode: {
    gewicht: "Energy-Charts public_power country=at, Reihe Solar (MW je Viertelstunde)",
    formel: "Σ(Preis_i × Solar_i) / Σ(Solar_i) über alle Viertelstunden des Monats mit Solarerzeugung > 0",
    abgrenzung: "Die E-Control gewichtet für den Referenzmarktwert die tatsächlich abgerechnete PV-Einspeisung; Mengen und Datenbasis unterscheiden sich, Abweichungen sind normal.",
  },
  einheiten: { solarMarktwert: "€/MWh", mittel: "€/MWh", marktwertfaktor: "Verhältnis", negativ: "Viertelstunden mit Preis < 0", abdeckung: "Anteil vorhandener Preis-Viertelstunden", pvViertelstunden: "Viertelstunden mit PV-Wert" },
  monate: index.map(({ monat, abdeckung, mittel, negativ, solarMarktwert, marktwertfaktor }) => ({
    monat,
    abdeckung,
    pvViertelstunden: pvAbdeckung[monat] ?? 0,
    mittel,
    solarMarktwert,
    marktwertfaktor,
    negativ,
  })),
};

fs.mkdirSync(ZIEL, { recursive: true });
fs.writeFileSync(path.join(ZIEL, "speicher-spread-index.json"), JSON.stringify(speicherDatei, null, 1) + "\n");
fs.writeFileSync(path.join(ZIEL, "solar-marktwert.json"), JSON.stringify(solarDatei, null, 1) + "\n");

console.log("\nMonat      Mittel   Spread €/Mon  neg. VS  Solar-MW  Faktor");
for (const m of index) {
  console.log(`${m.monat}   ${String(m.mittel).padStart(7)}   ${String(m.spreadErloesEur).padStart(10)}   ${String(m.negativ).padStart(6)}   ${String(m.solarMarktwert ?? "–").padStart(7)}   ${m.marktwertfaktor ?? "–"}`);
}
console.log(`\nGeschrieben: ${path.relative(ROOT, ZIEL)}/speicher-spread-index.json, solar-marktwert.json (Stand ${stand})`);
