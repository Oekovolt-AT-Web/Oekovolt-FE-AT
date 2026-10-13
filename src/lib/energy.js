// src/lib/energy.js
//
// Live-Daten zum österreichischen Strommarkt – nur öffentliche, schlüsselfreie Quellen:
//   - SMARD (Bundesnetzagentur, CC BY 4.0): Day-Ahead-Großhandelspreis Österreich
//     (Filter 4170 „Marktpreis: Österreich“, Region DE, Auflösung quarterhour).
//     https://www.smard.de – Datenstand Viertelstunde seit 1. Oktober 2025; davor liegen die
//     Stundenpreise als vier gleiche Viertelstundenwerte vor. Geprüft am 2026-10-11: identisch
//     mit der Energy-Charts-Reihe bzn=AT (Abweichung 0,000 €/MWh über eine Woche).
//     Primäre Preisquelle für Live-Seite, Rechner und die Marktindizes (scripts/marktindizes.mjs).
//   - Fraunhofer ISE Energy-Charts (CC BY 4.0): öffentliche Nettostromerzeugung Österreichs
//     je Quelle (country=at) für den Strommix; außerdem Ersatzquelle für den Preis, falls
//     SMARD nicht antwortet (die Preisdaten dort stammen ebenfalls von Bundesnetzagentur | SMARD.de).
//     https://api.energy-charts.info – geprüft am 2026-09-28 per curl.
//   - aWATTar Österreich wurde als Ersatzquelle entfernt (B10, 2026-10-11): Die API-Seite
//     erlaubt nur eine kostenlose Nutzung „nach dem Fair-Use-Prinzip (100 Abfragen pro Tag)“ und
//     räumt keine Lizenz zur Weiterveröffentlichung der EPEX-Spot-Daten ein; eine klare
//     Erlaubnis für die Anzeige auf einer gewerblichen Website fehlt.
//
// Österreich bildet seit 1. Oktober 2018 eine eigene Gebotszone (Trennung der
// früheren Zone DE-AT-LU). Die Preise weichen deshalb vom deutschen Preis ab.
//
// Alle Abrufe laufen serverseitig mit Next-Cache (revalidate), damit Besucher
// nie direkt die Drittanbieter treffen und die Seite schnell bleibt.
//
// Die Rückgabeform (preis/erzeugung, Feldnamen) ist bewusst dieselbe wie in der
// deutschen Fassung, damit Ticker, Navbar, Startseite und Rechner unverändert
// weiterlaufen. Werte, die es für Österreich nicht gibt (Offshore-Wind, Kohle),
// liefern leere Reihen bzw. null und werden in der Oberfläche weggelassen.

const EC = "https://api.energy-charts.info";
const SMARD = "https://www.smard.de/app/chart_data";
export const ZEITZONE = "Europe/Vienna";
export const GEBOTSZONE = "AT";

/** SMARD-Filter „Marktpreis: Österreich“ (Day-Ahead, €/MWh). Die Nachbarländer liegen unter Region DE. */
export const SMARD_FILTER_AT = 4170;
export const SMARD_REGION = "DE";
export const SMARD_ATTRIBUTION = "Bundesnetzagentur | SMARD.de";
export const SMARD_LIZENZ = "https://creativecommons.org/licenses/by/4.0/";
const WOCHE_MS = 7 * 86400000;

// Grobe Orientierung für die Umrechnung „Börsenpreis → Endkundenpreis“ bei einem
// dynamischen Tarif in Österreich (Haushalt, Netzebene 7), Stand 2026:
//   - aufschlagCt: Netzentgelte inkl. Netzverlust- und Messentgelt, Erneuerbaren-
//     Förderbeitrag, Elektrizitätsabgabe (2026 für Haushalte befristet 0,1 ct/kWh),
//     Gebrauchsabgabe und Lieferantenaufschlag – netto, je nach Netzgebiet deutlich
//     verschieden (ca. 9–14 ct/kWh). Grundpauschalen sind nicht enthalten.
//   - mwst: Umsatzsteuer 20 %.
//   - festpreisCt: typischer Gesamtpreis eines Festpreis-Haushaltstarifs inkl. Netz,
//     Abgaben und USt – Orientierung, keine Tarifaussage.
// Für den konkreten Vergleich: Tarifkalkulator der E-Control.
export const TARIF_ANNAHMEN = {
  aufschlagCt: 11.5,
  mwst: 0.2,
  festpreisCt: 27,
};

async function holeJson(url, revalidate) {
  const res = await fetch(url, {
    next: { revalidate },
    headers: { Accept: "application/json", "User-Agent": "oekovolt.com energy widget" },
  });
  if (!res.ok) throw new Error(`${url} -> ${res.status}`);
  return res.json();
}

/** Tagesbeginn (lokal Europe/Vienna) als ISO-Datum YYYY-MM-DD */
function wienDatum(offsetTage = 0) {
  const d = new Date(Date.now() + offsetTage * 86400000);
  return new Intl.DateTimeFormat("sv-SE", { timeZone: ZEITZONE }).format(d);
}

/**
 * Zeitstempel der SMARD-Wochenblöcke (Montag 0 Uhr Ortszeit, ms) für Filter/Auflösung.
 * revalidate: Next-Cache in Sekunden (im Skript ohne Wirkung).
 */
export async function smardIndex(aufloesung = "quarterhour", revalidate = 3600) {
  const j = await holeJson(`${SMARD}/${SMARD_FILTER_AT}/${SMARD_REGION}/index_${aufloesung}.json`, revalidate);
  return Array.isArray(j.timestamps) ? j.timestamps : [];
}

/**
 * Day-Ahead-Preise Österreich von SMARD für ein Zeitfenster [von, bis) in ms.
 * Lädt nur die Wochenblöcke, die das Fenster berühren. Rückgabe: [{ t, eurMwh }] sortiert,
 * Werte ohne Preis (null, noch nicht veröffentlicht) werden weggelassen.
 */
export async function smardPreise(von, bis, { aufloesung = "quarterhour", revalidate = 900 } = {}) {
  const index = await smardIndex(aufloesung, Math.max(revalidate, 900));
  const bloecke = index.filter((t) => t < bis && t + WOCHE_MS > von);
  const punkte = [];
  for (const t of bloecke) {
    const j = await holeJson(`${SMARD}/${SMARD_FILTER_AT}/${SMARD_REGION}/${SMARD_FILTER_AT}_${SMARD_REGION}_${aufloesung}_${t}.json`, revalidate);
    for (const [zeit, wert] of j.series || []) {
      if (zeit >= von && zeit < bis && typeof wert === "number") punkte.push({ t: zeit, eurMwh: wert });
    }
  }
  return punkte.sort((a, b) => a.t - b.t);
}

/**
 * Day-Ahead-Preise der Gebotszone AT für heute (und morgen, sobald veröffentlicht –
 * nach der Auktion gegen Mittag). Rückgabe: { quelle, aufloesungMin, punkte: [{ t: ms, eurMwh }] }
 * Quelle: SMARD (Bundesnetzagentur); Ersatz: Energy-Charts (Fraunhofer ISE).
 */
export async function getSpotPrices() {
  const jetzt = Date.now();
  let smard = [];
  try {
    // Fenster großzügig: gestern bis übermorgen, gefiltert wird in getEnergySnapshot nach Wiener Kalendertag
    smard = await smardPreise(jetzt - 86400000, jetzt + 2 * 86400000, { revalidate: 900 });
  } catch (e) {
    console.error("smard price AT:", e.message);
  }
  const tagWien = (t) => new Intl.DateTimeFormat("sv-SE", { timeZone: ZEITZONE }).format(new Date(t));
  const hatMorgen = smard.some((p) => tagWien(p.t) === wienDatum(1));
  const stundeWien = Number(new Intl.DateTimeFormat("de-AT", { hour: "numeric", hourCycle: "h23", timeZone: ZEITZONE }).format(new Date(jetzt)));
  // SMARD vollständig (oder Auktion für morgen noch nicht gelaufen) → nur SMARD
  if (smard.length && (hatMorgen || stundeWien < 13)) {
    return { quelle: SMARD_ATTRIBUTION, aufloesungMin: aufloesung(smard), punkte: smard };
  }
  // Energy-Charts: Ersatz bei SMARD-Ausfall; nach der Mittagsauktion auch Ergänzung für morgen,
  // falls SMARD den Folgetag noch nicht veröffentlicht hat (Preisdaten dort ebenfalls aus SMARD).
  try {
    const j = await holeJson(`${EC}/price?bzn=${GEBOTSZONE}&start=${wienDatum(0)}&end=${wienDatum(2)}`, 900);
    const sek = j.unix_seconds || [];
    const ec = sek.map((s, i) => ({ t: s * 1000, eurMwh: j.price?.[i] })).filter((p) => typeof p.eurMwh === "number");
    if (smard.length) {
      const letzter = smard[smard.length - 1].t;
      const dazu = ec.filter((p) => p.t > letzter);
      const punkte = [...smard, ...dazu];
      return { quelle: dazu.length ? `${SMARD_ATTRIBUTION} · Energy-Charts (Fraunhofer ISE)` : SMARD_ATTRIBUTION, aufloesungMin: aufloesung(punkte), punkte };
    }
    return { quelle: ec.length ? "Energy-Charts (Fraunhofer ISE)" : null, aufloesungMin: aufloesung(ec), punkte: ec };
  } catch (e) {
    console.error("energy-charts price AT:", e.message);
    if (smard.length) return { quelle: SMARD_ATTRIBUTION, aufloesungMin: aufloesung(smard), punkte: smard };
    return { quelle: null, aufloesungMin: 15, punkte: [] };
  }
}

/** Auflösung einer Preisreihe in Minuten (15 oder 60) aus den ersten beiden Punkten */
function aufloesung(punkte) {
  const schrittMin = punkte.length > 1 ? Math.round((punkte[1].t - punkte[0].t) / 60000) : 15;
  return schrittMin === 60 ? 60 : 15;
}

/**
 * Stromerzeugung Österreichs nach Quelle (Energy-Charts public_power, country=at)
 * ab gestern 0 Uhr bis jetzt. Gestern ist mit dabei, damit Diagramme auch kurz
 * nach Mitternacht einen vollständigen 24-Stunden-Verlauf zeigen können.
 */
export async function getGeneration() {
  try {
    const j = await holeJson(`${EC}/public_power?country=at&start=${wienDatum(-1)}&end=${wienDatum(1)}`, 900);
    const zeiten = (j.unix_seconds || []).map((s) => s * 1000);
    const reihe = (name) => j.production_types?.find((p) => p.name === name)?.data || [];
    const summe = (...namen) => zeiten.map((_, i) => namen.reduce((acc, n) => acc + (Number(reihe(n)[i]) || 0), 0));

    const laufwasser = reihe("Hydro Run-of-River");
    const speicherwasser = reihe("Hydro water reservoir");

    const serien = {
      solar: reihe("Solar"),
      windOnshore: reihe("Wind onshore"),
      windOffshore: [], // in Österreich nicht vorhanden – bleibt leer
      biomasse: reihe("Biomass"),
      laufwasser,
      speicherwasser,
      // Wasserkraft aus natürlichem Zufluss (Laufwasser + Speicherkraftwerke)
      wasser: zeiten.map((_, i) => (Number(laufwasser[i]) || 0) + (Number(speicherwasser[i]) || 0)),
      gas: reihe("Fossil gas"),
      // Rest der öffentlichen Nettoerzeugung: Pumpspeicher-Erzeugung (zählt nicht als
      // erneuerbar, weil der Strom vorher eingespeichert wurde), Müll, Geothermie, Sonstige
      sonstige: summe("Hydro pumped storage", "Waste", "Geothermal", "Others", "Fossil oil", "Fossil hard coal", "Fossil brown coal / lignite"),
      // Grenzüberschreitender Handel: positiv = Nettoimport, negativ = Nettoexport
      import: reihe("Cross border electricity trading"),
      last: reihe("Load"),
      eeAnteil: reihe("Renewable share of load"),
    };

    // Letzter Zeitpunkt mit Solar- UND Lastwert
    let idx = -1;
    for (let i = zeiten.length - 1; i >= 0; i--) {
      if (serien.solar[i] != null && serien.last[i] != null) {
        idx = i;
        break;
      }
    }
    return { quelle: "Energy-Charts (Fraunhofer ISE)", zeiten, serien, idx };
  } catch (e) {
    console.error("energy-charts power AT:", e.message);
    return { quelle: null, zeiten: [], serien: {}, idx: -1 };
  }
}

/** Kompakte Live-Zusammenfassung für Ticker, Widgets und Dashboard. */
export async function getEnergySnapshot() {
  const [preise, erzeugung] = await Promise.all([getSpotPrices(), getGeneration()]);
  const jetzt = Date.now();
  const schritt = preise.aufloesungMin * 60000;

  const tagVon = (t) => new Intl.DateTimeFormat("sv-SE", { timeZone: ZEITZONE }).format(new Date(t));
  const heute = preise.punkte.filter((p) => tagVon(p.t) === wienDatum(0));
  const morgen = preise.punkte.filter((p) => tagVon(p.t) === wienDatum(1));
  const aktuell = preise.punkte.find((p) => p.t <= jetzt && jetzt < p.t + schritt) || null;

  const stat = (arr) => {
    if (!arr.length) return null;
    const werte = arr.map((p) => p.eurMwh);
    const min = arr.reduce((a, b) => (b.eurMwh < a.eurMwh ? b : a));
    const max = arr.reduce((a, b) => (b.eurMwh > a.eurMwh ? b : a));
    return { avg: werte.reduce((a, b) => a + b, 0) / werte.length, min, max, negativ: werte.filter((w) => w < 0).length };
  };

  const { serien, idx, zeiten } = erzeugung;
  const wert = (s) => (idx >= 0 && serien[s]?.[idx] != null ? Number(serien[s][idx]) || 0 : null);
  const last = wert("last");

  return {
    stand: new Date().toISOString(),
    gebotszone: GEBOTSZONE,
    preis: {
      quelle: preise.quelle,
      aufloesungMin: preise.aufloesungMin,
      aktuell,
      heute: stat(heute),
      morgen: stat(morgen),
      punkte: preise.punkte,
    },
    erzeugung: {
      quelle: erzeugung.quelle,
      zeitpunkt: idx >= 0 ? zeiten[idx] : null,
      solarMw: wert("solar"),
      windMw: wert("windOnshore"),
      wasserMw: wert("wasser"),
      importMw: wert("import"),
      lastMw: last,
      eeAnteil: wert("eeAnteil"),
      solarAnteil: idx >= 0 && last ? (wert("solar") / last) * 100 : null,
      zeiten,
      serien,
    },
  };
}

/** €/MWh (Börse, netto) -> ct/kWh */
export const ctKwh = (eurMwh) => eurMwh / 10;

/** Grobe Brutto-Endkundenkosten bei dynamischem Tarif in ct/kWh (Österreich, Orientierung). */
export const dynamischBrutto = (eurMwh) => (ctKwh(eurMwh) + TARIF_ANNAHMEN.aufschlagCt) * (1 + TARIF_ANNAHMEN.mwst);
