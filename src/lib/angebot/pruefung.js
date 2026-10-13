// src/lib/angebot/pruefung.js – Prüflogik der Angebots-Zweitmeinung (Paket B08)
//
// Reine Funktionen ohne Browser- oder Next-Abhängigkeiten, damit sie in Node testbar sind
// (scripts/angebot-pruefung.test.mjs). Die Komponente src/components/AngebotPruefer/AngebotPruefer.js
// liest ein PDF ausschließlich lokal (pdfjs-dist) und übergibt hier nur den Text bzw. die vom
// Nutzer bestätigten Felder. Das Ergebnis sind „Prüfpunkte zum Nachfragen“ – kein Urteil über das
// Angebot, keine Anbieternamen, keine Speicherung.
//
// Jede Zahl mit Quelle und Stand; alle Werte sind Richtwerte zur Orientierung.

export const STAND = "11.10.2026";

/* ------------------------------------------------------------------ Zweck der Scan-Sitzung (API /api/scan/start) */

/** Feste Liste – nur diese Zwecke akzeptiert /api/scan/start (zukunftssicher für C12 und D09). */
export const ZWECKE = ["angebot", "zweitmeinung", "hof", "stoerung"];
export const ZWECK_LABEL = { angebot: "Angebot", zweitmeinung: "Zweitmeinung", hof: "Hof", stoerung: "Störung" };
export const zweckGueltig = (zweck) => typeof zweck === "string" && ZWECKE.includes(zweck);
/** Quelle für das Backend: „Website · <Zweck>“, ohne Zweck bleibt es „Website“. */
export const quelleFuerZweck = (zweck) => (zweckGueltig(zweck) ? `Website · ${ZWECK_LABEL[zweck]}` : "Website");

/* ------------------------------------------------------------------ Quellen und Richtwerte */

export const QUELLEN = [
  {
    titel: "BMWET/Technikum Wien – Innovative Energietechnologien in Österreich, Marktentwicklung 2024 (Systempreise netto je Größenklasse)",
    href: "https://nachhaltigwirtschaften.at/resources/nw_pdf/schriftenreihe-2025-23a_marktstatistik-2024.pdf",
    hinweis: "Stand 2025",
  },
  { titel: "PVGIS v5.3 (EU-Kommission, JRC), SARAH3, 14 % Systemverluste – spezifischer Jahresertrag je Standort", href: "https://re.jrc.ec.europa.eu/pvg_tools/de/", hinweis: "Abruf über /api/standort" },
  { titel: "OeMAG – EAG-Investitionszuschüsseverordnung-Strom (EAG-IZV), Zuschuss höchstens 30 % der Investitionskosten", href: "https://www.oem-ag.at/de/foerderung/", hinweis: "Fassung 19.01.2026" },
  { titel: "ÖNORM B 1991-1-3 – Einwirkungen auf Tragwerke, Schneelasten (nationale Festlegungen Österreich)", href: "https://shop.austrian-standards.at/", hinweis: "Austrian Standards" },
  { titel: "OVE R 11-1 – Photovoltaik-Anlagen: Brandschutz, Anforderungen an Planung und Errichtung", href: "https://www.ove.at/", hinweis: "OVE Richtlinie" },
  { titel: "TOR Erzeuger Typ A/B (E-Control) – Anforderungen an Erzeugungsanlagen, Konformitätsnachweis, Erzeugungsanlagenregler", href: "https://www.e-control.at/", hinweis: "Technische und organisatorische Regeln" },
  { titel: "ÖVE/ÖNORM EN 62446-1 – Prüfung, Dokumentation und Instandhaltung von PV-Systemen", href: "https://shop.austrian-standards.at/", hinweis: "Austrian Standards" },
  { titel: "§ 933 ABGB – Gewährleistungsfristen (2 Jahre bewegliche, 3 Jahre unbewegliche Sachen)", href: "https://www.ris.bka.gv.at/", hinweis: "RIS" },
];

/**
 * Marktbezug aus der amtlichen Marktstatistik 2024 (netto, Mittelwert). Laut Auftrag NUR der Wert
 * 1.551 €/kWp und NUR für 5-kWp-Kleinanlagen (4,5–5,5 kWp), so gekennzeichnet. Für alle anderen
 * Größen zeigt das Werkzeug keinen Marktbezug (Richtwerte je Größenklasse: Ratgeber Photovoltaik Kosten).
 * Bewusst keine Abweichung in Prozent – das käme einer Wertung des Angebots nahe (UWG).
 */
export const MARKTSTATISTIK = {
  quelle: "BMWET-Marktstatistik 2024 (Technikum Wien)",
  stand: "2025",
  hinweis: "Mittelwert netto, Richtwert/Orientierung – kein Preis von Ökovolt, kein Angebot, kein Maßstab für andere Anlagengrößen.",
  klassen: [{ id: "5kwp", label: "5-kWp-Kleinanlage", von: 4.5, bis: 5.5, eurProKwp: 1551 }],
};

/** EAG-IZV: Zuschuss höchstens 30 % der förderfähigen Investitionskosten. */
export const EAG_ZUSCHUSS_MAX = 0.3;

/** Spezifischer Jahresertrag in Österreich als Plausibilitätsrahmen (kWh/kWp, PVGIS-Spanne Süd/Ost-West). */
export const ERTRAG_RAHMEN = { min: 850, max: 1250 };

export const AUSRICHTUNGEN = [
  { id: "sued", label: "Süd, ca. 30–35°", neigung: 35, azimut: 0, feld: "sued35_kwh_kwp" },
  { id: "ostwest", label: "Ost/West, ca. 10–15°", neigung: 15, azimut: -90, feld: "ostwest15_kwh_kwp" },
  { id: "flach", label: "Flachdach, ca. 10° Süd", neigung: 10, azimut: 0, feld: "flach10_kwh_kwp" },
];

/* ------------------------------------------------------------------ Felder */

export const FELDER = [
  { id: "kwp", label: "Anlagenleistung", einheit: "kWp", typ: "zahl", pflicht: true, min: 0.5, max: 50000, step: 0.1 },
  { id: "preisNetto", label: "Angebotssumme netto", einheit: "€", typ: "zahl", pflicht: true, min: 100, max: 100_000_000, step: 1 },
  { id: "modul", label: "Modul (Hersteller, Typ, Wp)", typ: "text" },
  { id: "wechselrichter", label: "Wechselrichter (Hersteller, Typ, kW)", typ: "text" },
  { id: "speicherKwh", label: "Speicher", einheit: "kWh", typ: "zahl", min: 0, max: 100000, step: 0.1 },
  { id: "unterkonstruktion", label: "Unterkonstruktion / Befestigung", typ: "text" },
  { id: "netzanschluss", label: "Netzanschluss / Netzebene", typ: "text" },
  { id: "gewaehrleistung", label: "Gewährleistung", typ: "text" },
  { id: "garantie", label: "Produkt-/Leistungsgarantie", typ: "text" },
];

export const LEERE_FELDER = Object.freeze(Object.fromEntries(FELDER.map((f) => [f.id, f.typ === "zahl" ? null : ""])));

/* ------------------------------------------------------------------ Prüfpunkte */

/**
 * Jeder Prüfpunkt: Frage, warum sie zählt, Quelle. `stichwort` prüft den Angebotstext, `auto(felder)`
 * liefert aus den bestätigten Feldern „ja“ (ausgewiesen) oder null (unklar).
 */
export const PRUEFPUNKTE = [
  {
    id: "netz",
    frage: "Netzebene und Netzzugang geklärt?",
    warum: "Netzebene, Anschlusspunkt und Netzzutrittsentgelt bestimmen Kosten und Zeitplan. Steht nichts im Angebot, kommt es später dazu.",
    quelle: "ElWG / Netzbetreiber-Anschlussbedingungen",
    stichwort: /Netzebene|Netzzugang|Netzzutritt|Netzanschluss|Netzbetreiber|Zählpunkt/i,
    auto: (f) => (f.netzanschluss?.trim() ? "ja" : null),
  },
  {
    id: "parkregler",
    frage: "Parkregler/EZA-Regler mit Konformitätsnachweis enthalten?",
    warum: "Ab TOR Erzeuger Typ B verlangt der Netzbetreiber eine regelbare Anlage mit Konformitätsnachweis. Ohne Position dafür fehlt ein Teil der Netzanmeldung.",
    quelle: "TOR Erzeuger Typ A/B (E-Control)",
    stichwort: /Parkregler|EZA-?Regler|Erzeugungsanlagenregler|Konformit[äa]t|Einheitenzertifikat|Anlagenzertifikat|TOR\s*Erzeuger/i,
  },
  {
    id: "statik",
    frage: "Statik und Schneelast nachgewiesen (ÖNORM B 1991-1-3)?",
    warum: "Dachlastreserve, Schneelastzone und Befestigung entscheiden über die Zulässigkeit der Anlage. „Bauseits“ heißt: Sie zahlen den Nachweis.",
    quelle: "ÖNORM B 1991-1-3",
    stichwort: /Statik|Schneelast|B\s*1991|Lastannahme|Tragf[äa]higkeit/i,
  },
  {
    id: "brandschutz",
    frage: "Brandschutz nach OVE R 11-1 berücksichtigt?",
    warum: "Feuerwehrschalter, Kennzeichnung, Leitungsführung und Abstände sind Planungsleistungen – und Voraussetzung für Versicherung und Abnahme.",
    quelle: "OVE R 11-1",
    stichwort: /Brandschutz|R\s*11-1|Feuerwehr|DC-?Freischalt/i,
  },
  {
    id: "monitoring",
    frage: "Monitoring/SCADA und Datenhoheit geregelt?",
    warum: "Wer Zugriff auf Wechselrichter- und Zählerdaten hat, entscheidet über Betriebsführung, Fehlersuche und einen späteren Anbieterwechsel.",
    quelle: "Vertragsinhalt (Datenzugang, Schnittstellen)",
    stichwort: /Monitoring|SCADA|Fern[üu]berwachung|Portal|Datenhoheit|Datenzugang|Modbus/i,
  },
  {
    id: "wartung",
    frage: "Wartungsumfang beschrieben?",
    warum: "Prüfintervalle, Reaktionszeiten und Kosten gehören ins Angebot – sonst ist der Betrieb der ersten Jahre nicht kalkulierbar.",
    quelle: "ÖVE/ÖNORM EN 62446-1",
    stichwort: /Wartung|Instandhaltung|Servicevertrag|Prüfintervall/i,
  },
  {
    id: "foerderung",
    frage: "Förder- und IFB-Annahmen offengelegt?",
    warum: "Zuschuss und Investitionsfreibetrag sind keine sicheren Einnahmen. Sie gehören in eine Variante, nicht in die Basisrechnung.",
    quelle: "EAG-IZV, § 11 EStG (IFB)",
    stichwort: /F[öo]rder|IFB|Investitionsfreibetrag|Zuschuss/i,
  },
  {
    id: "ertrag",
    frage: "Ertragsannahme mit Quelle?",
    warum: "Eine Prognose ohne Methode (PVGIS, Simulation mit Verschattung) lässt sich nicht nachrechnen. Darauf baut jede Wirtschaftlichkeitsrechnung auf.",
    quelle: "PVGIS (EU-Kommission, JRC)",
    stichwort: /PVGIS|Ertragsprognose|Ertragsgutachten|Simulation|kWh\s*\/\s*kWp|spezifische[rn]?\s+Ertrag/i,
  },
  {
    id: "eag",
    frage: "EAG-Zuschuss höchstens 30 % der Kosten?",
    warum: "Die EAG-IZV deckelt den Investitionszuschuss bei 30 % der förderfähigen Kosten. Ein höherer Betrag im Angebot ist ein Rechenfehler oder eine andere Förderung.",
    quelle: "EAG-IZV (Fassung 19.01.2026)",
    stichwort: /EAG|Investitionszuschuss|OeMAG/i,
  },
  {
    id: "komponenten",
    frage: "Modul und Wechselrichter mit Hersteller und Typ benannt?",
    warum: "Ohne Hersteller und Typ lassen sich Garantiebedingungen, Datenblätter und Konformität nicht prüfen; „gleichwertig“ ist keine Angabe.",
    quelle: "Datenblätter, Garantiebedingungen",
    stichwort: null,
    auto: (f) => (f.modul?.trim() && f.wechselrichter?.trim() ? "ja" : null),
  },
  {
    id: "unterkonstruktion",
    frage: "Unterkonstruktion und Befestigung benannt?",
    warum: "Ballast oder mechanische Befestigung, Material und Hersteller bestimmen Statik, Dachhaut und Garantie.",
    quelle: "ÖNORM B 1991-1-3, Herstellerangaben",
    stichwort: /Unterkonstruktion|Montagesystem|Aufst[äa]nderung|Montagegestell|Ballast/i,
    auto: (f) => (f.unterkonstruktion?.trim() ? "ja" : null),
  },
  {
    id: "gewaehrleistung",
    frage: "Gewährleistung und Garantien ausgewiesen?",
    warum: "Gewährleistung (§ 933 ABGB) und Herstellergarantien sind verschiedene Dinge; beide gehören mit Dauer und Bedingungen ins Angebot.",
    quelle: "§ 933 ABGB, Garantiebedingungen der Hersteller",
    stichwort: /Gew[äa]hrleistung|Garantie/i,
    auto: (f) => (f.gewaehrleistung?.trim() && f.garantie?.trim() ? "ja" : null),
  },
];

export const ANTWORTEN = [
  { id: "ja", label: "Enthalten" },
  { id: "nein", label: "Fehlt" },
  { id: "unklar", label: "Unklar" },
];

/* ------------------------------------------------------------------ Zahlen lesen */

const zahlDe = (s) => {
  if (s == null) return null;
  let t = String(s).trim().replace(/\s/g, "");
  if (/,\d{1,2}$/.test(t)) t = t.replace(/\./g, "").replace(",", ".");
  else if (/\.\d{1,2}$/.test(t) && !/\.\d{3}(\.|$)/.test(t)) t = t.replace(/,/g, "");
  else t = t.replace(/[.,](?=\d{3}(\D|$))/g, "").replace(",", ".");
  const n = Number(t);
  return Number.isFinite(n) ? n : null;
};

/** Zeilen aus dem PDF-Text: Mehrfach-Leerzeichen zusammenziehen, Leerzeilen entfernen. */
export function textNormalisieren(text) {
  return String(text || "")
    .replace(/\r/g, "")
    .replace(/[ \t ]+/g, " ")
    .split("\n")
    .map((z) => z.trim())
    .filter(Boolean)
    .join("\n");
}

const kuerzen = (s, max = 100) => {
  const t = String(s || "").trim();
  return t.length > max ? `${t.slice(0, max - 1)}…` : t;
};

const haeufigster = (werte) => {
  if (!werte.length) return null;
  const z = new Map();
  for (const w of werte) z.set(w, (z.get(w) || 0) + 1);
  let best = werte[0];
  for (const [w, c] of z) if (c > z.get(best)) best = w;
  return best;
};

const zeileMit = (zeilen, muster, mitZahl = false) => {
  const treffer = zeilen.filter((z) => muster.test(z) && z.length <= 160);
  return (mitZahl && treffer.find((z) => /\d/.test(z))) || treffer[0] || null;
};

/**
 * Felder aus dem Angebotstext erkennen. Rückgabe { felder, treffer, stichworte }:
 * felder – Vorschläge je Feld (null/"" wenn nichts gefunden), treffer – Textausschnitt je erkanntem Feld,
 * stichworte – je Prüfpunkt, ob das Thema im Text vorkommt.
 */
export function erkenneFelder(rohText) {
  const text = textNormalisieren(rohText);
  const zeilen = text.split("\n");
  const felder = { ...LEERE_FELDER };
  const treffer = {};

  // kWp: häufigster Wert, mit Vorrang für „Leistung … kWp“
  const kwpAlle = [...text.matchAll(/(\d{1,4}(?:[.,]\d{1,3})?)\s*kWp\b/gi)].map((m) => zahlDe(m[1])).filter((n) => n > 0 && n < 50000);
  const kwpLeistung = text.match(/(?:Anlagenleistung|Gesamtleistung|Nennleistung|Leistung|Generatorleistung)[^\n\d]{0,30}(\d{1,4}(?:[.,]\d{1,3})?)\s*kWp/i);
  const kwp = kwpLeistung ? zahlDe(kwpLeistung[1]) : haeufigster(kwpAlle);
  if (kwp) {
    felder.kwp = kwp;
    treffer.kwp = kuerzen(kwpLeistung ? kwpLeistung[0] : zeileMit(zeilen, /kWp/i));
  }

  // Preis netto: größter Betrag in Zeilen mit „netto“ (beide Reihenfolgen)
  const betrag = "(\\d{1,3}(?:\\.\\d{3})+(?:,\\d{1,2})?|\\d{1,3}(?:,\\d{3})+(?:\\.\\d{1,2})?|\\d{3,9}(?:[.,]\\d{1,2})?)";
  const nettoZeilen = zeilen.filter((z) => /netto|exkl\.?\s*(?:USt|MwSt)|ohne\s+(?:USt|MwSt)/i.test(z));
  let preis = null;
  let preisZeile = null;
  for (const z of nettoZeilen) {
    for (const m of z.matchAll(new RegExp(`(?:€|EUR)\\s*${betrag}|${betrag}\\s*(?:€|EUR)`, "gi"))) {
      const n = zahlDe(m[1] || m[2]);
      if (n && n >= 100 && n > (preis || 0)) {
        preis = n;
        preisZeile = z;
      }
    }
  }
  if (preis) {
    felder.preisNetto = preis;
    treffer.preisNetto = kuerzen(preisZeile);
  }

  const modul = zeileMit(zeilen, /\bModul/i, true);
  if (modul) {
    felder.modul = kuerzen(modul, 90);
    treffer.modul = kuerzen(modul);
  }
  const wr = zeileMit(zeilen, /Wechselrichter|Inverter/i, true);
  if (wr) {
    felder.wechselrichter = kuerzen(wr, 90);
    treffer.wechselrichter = kuerzen(wr);
  }
  const sp = text.match(/(?:Speicher|Batterie)[^\n]{0,60}?(\d{1,4}(?:[.,]\d{1,2})?)\s*kWh/i) || text.match(/(\d{1,4}(?:[.,]\d{1,2})?)\s*kWh[^\n]{0,30}?(?:Speicher|Batterie)/i);
  if (sp) {
    const n = zahlDe(sp[1]);
    if (n > 0 && n < 100000) {
      felder.speicherKwh = n;
      treffer.speicherKwh = kuerzen(sp[0]);
    }
  }
  const uk = zeileMit(zeilen, /Unterkonstruktion|Montagesystem|Aufst[äa]nderung|Montagegestell/i);
  if (uk) {
    felder.unterkonstruktion = kuerzen(uk, 90);
    treffer.unterkonstruktion = kuerzen(uk);
  }
  const netz = zeileMit(zeilen, /Netzanschluss|Netzzugang|Netzebene|Netzanmeldung|Z[äa]hlpunkt/i);
  if (netz) {
    felder.netzanschluss = kuerzen(netz, 90);
    treffer.netzanschluss = kuerzen(netz);
  }
  const gw = text.match(/Gew[äa]hrleistung[^\n\d]{0,40}(\d{1,2})\s*Jahre?/i) || text.match(/(\d{1,2})\s*Jahre?\s*Gew[äa]hrleistung/i);
  if (gw) {
    felder.gewaehrleistung = `${gw[1]} Jahre`;
    treffer.gewaehrleistung = kuerzen(gw[0]);
  }
  const ga = [...text.matchAll(/(\d{1,2})[ \t]*Jahre?[ \t]*(?:[A-Za-zäöüÄÖÜ-]+[ \t]*)?garantie|(?:Produkt|Leistungs|Hersteller)?garantie[^\n\d]{0,40}(\d{1,2})[ \t]*Jahre?/gi)];
  if (ga.length) {
    const jahre = [...new Set(ga.map((m) => Number(m[1] || m[2])).filter((n) => n > 0 && n <= 40))].sort((a, b) => a - b);
    felder.garantie = `${jahre.join(" / ")} Jahre`;
    treffer.garantie = kuerzen(ga[0][0]);
  }

  const stichworte = {};
  for (const p of PRUEFPUNKTE) stichworte[p.id] = p.stichwort ? p.stichwort.test(text) : false;

  return { felder, treffer, stichworte, zeichen: text.length };
}

/* ------------------------------------------------------------------ Rechnen */

export const rund = (n, s = 0) => (Number.isFinite(n) ? Math.round(n * 10 ** s) / 10 ** s : null);

/** €/kWp, Jahresertrag und €/kWh Jahresertrag – alles netto, ohne Speicher-Trennung (Hinweis im Ergebnis). */
export function kennzahlen({ kwp, preisNetto, ertragKwhProKwp }) {
  const k = Number(kwp);
  const p = Number(preisNetto);
  const e = Number(ertragKwhProKwp);
  if (!(k > 0) || !(p > 0)) return null;
  const jahresertrag = e > 0 ? k * e : null;
  return {
    eurProKwp: rund(p / k),
    jahresertragKwh: jahresertrag ? Math.round(jahresertrag) : null,
    eurProKwhJahr: jahresertrag ? rund(p / jahresertrag, 2) : null,
    ertragKwhProKwp: e > 0 ? Math.round(e) : null,
  };
}

/** Marktbezug nur für 5-kWp-Kleinanlagen, sonst null. Ohne Abweichung/Wertung. */
export function marktbezug(kwp) {
  const k = Number(kwp);
  const klasse = MARKTSTATISTIK.klassen.find((c) => k >= c.von && k <= c.bis);
  if (!klasse) return null;
  return { ...klasse, quelle: MARKTSTATISTIK.quelle, stand: MARKTSTATISTIK.stand, hinweis: MARKTSTATISTIK.hinweis };
}

/** Ertragsannahme innerhalb der österreichischen PVGIS-Spanne? */
export const ertragPlausibel = (kwhProKwp) => Number.isFinite(kwhProKwp) && kwhProKwp >= ERTRAG_RAHMEN.min && kwhProKwp <= ERTRAG_RAHMEN.max;

/** EAG-Zuschuss gegen die 30-%-Grenze prüfen (null, wenn kein Zuschuss angegeben). */
export function eagPruefung({ eagZuschuss, preisNetto }) {
  const z = Number(eagZuschuss);
  const p = Number(preisNetto);
  if (!(z > 0) || !(p > 0)) return null;
  const anteil = rund(z / p, 3);
  return { zuschuss: z, anteil, maxAnteil: EAG_ZUSCHUSS_MAX, maxBetrag: Math.round(p * EAG_ZUSCHUSS_MAX), ueberGrenze: anteil > EAG_ZUSCHUSS_MAX };
}

/**
 * Vollständigkeits-Checkliste: Antworten des Nutzers (ja/nein/unklar) gehen vor, dann Felder, dann
 * Stichworte aus dem Text (nur Hinweis „im Text erwähnt“, kein „ja“). Rückgabe je Prüfpunkt mit
 * status „erfuellt“ (ja) oder „nachfragen“ (alles andere).
 */
export function checkliste({ felder = {}, antworten = {}, stichworte = {}, eag = null, speicher = false } = {}) {
  const liste = PRUEFPUNKTE.map((p) => {
    let antwort = ANTWORTEN.some((a) => a.id === antworten[p.id]) ? antworten[p.id] : null;
    let herkunft = antwort ? "nutzer" : null;
    if (!antwort && p.auto) {
      const a = p.auto(felder);
      if (a) {
        antwort = a;
        herkunft = "felder";
      }
    }
    if (!antwort) {
      antwort = "unklar";
      herkunft = stichworte[p.id] ? "text" : "leer";
    }
    let zusatz = null;
    if (p.id === "eag" && eag) {
      zusatz = eag.ueberGrenze
        ? `Angegebener Zuschuss ${Math.round(eag.anteil * 100)} % der Angebotssumme – über der 30-%-Grenze der EAG-IZV (höchstens ${eag.maxBetrag.toLocaleString("de-DE")} €).`
        : `Angegebener Zuschuss ${Math.round(eag.anteil * 100)} % der Angebotssumme – innerhalb der 30-%-Grenze der EAG-IZV.`;
      if (eag.ueberGrenze && herkunft !== "nutzer") antwort = "nein";
    }
    return {
      id: p.id,
      frage: p.frage,
      warum: p.warum,
      quelle: p.quelle,
      antwort,
      herkunft,
      imText: Boolean(stichworte[p.id]),
      zusatz,
      status: antwort === "ja" ? "erfuellt" : "nachfragen",
    };
  });
  if (speicher) {
    liste.push({
      id: "speicher",
      frage: "Speicher: nutzbare Kapazität, Zyklen und Garantie angegeben?",
      warum: "Speicher werden in €/kWh nutzbarer Kapazität verglichen; Zyklenzahl und Garantiebedingungen bestimmen die Lebensdauer.",
      quelle: "Datenblatt, Garantiebedingungen",
      antwort: antworten.speicher === "ja" ? "ja" : antworten.speicher === "nein" ? "nein" : "unklar",
      herkunft: antworten.speicher ? "nutzer" : "leer",
      imText: false,
      zusatz: null,
      status: antworten.speicher === "ja" ? "erfuellt" : "nachfragen",
    });
  }
  return liste;
}

/**
 * Gesamte Prüfung: Kennzahlen, Marktbezug, EAG-Grenze, Prüfpunkte. Keine Wertung, keine Namen.
 * eingabe: { felder, antworten, stichworte, ertragKwhProKwp, ertragQuelle, eagZuschuss }
 */
export function pruefen(eingabe = {}) {
  const felder = { ...LEERE_FELDER, ...(eingabe.felder || {}) };
  const fehler = [];
  if (!(Number(felder.kwp) > 0)) fehler.push("Anlagenleistung in kWp fehlt.");
  if (!(Number(felder.preisNetto) > 0)) fehler.push("Angebotssumme netto fehlt.");
  if (fehler.length) return { ok: false, fehler };

  const kz = kennzahlen({ kwp: felder.kwp, preisNetto: felder.preisNetto, ertragKwhProKwp: eingabe.ertragKwhProKwp });
  const eag = eagPruefung({ eagZuschuss: eingabe.eagZuschuss, preisNetto: felder.preisNetto });
  const punkte = checkliste({ felder, antworten: eingabe.antworten, stichworte: eingabe.stichworte, eag, speicher: Number(felder.speicherKwh) > 0 });
  const nachfragen = punkte.filter((p) => p.status === "nachfragen");
  const hinweise = [];
  if (Number(felder.speicherKwh) > 0) hinweise.push("Die Angebotssumme enthält vermutlich den Speicher. Für den Vergleich je kWp den Speicheranteil herausrechnen und getrennt in €/kWh nutzbarer Kapazität bewerten.");
  if (kz.ertragKwhProKwp && !ertragPlausibel(kz.ertragKwhProKwp)) hinweise.push(`Die Ertragsannahme von ${kz.ertragKwhProKwp} kWh/kWp liegt außerhalb der in Österreich üblichen Spanne (${ERTRAG_RAHMEN.min}–${ERTRAG_RAHMEN.max} kWh/kWp nach PVGIS) – Quelle und Verschattung nachfragen.`);

  return {
    ok: true,
    stand: STAND,
    felder,
    kennzahlen: kz,
    ertragQuelle: eingabe.ertragQuelle || null,
    marktbezug: marktbezug(felder.kwp),
    eag,
    pruefpunkte: punkte,
    nachfragen,
    vollstaendigkeit: { gesamt: punkte.length, erfuellt: punkte.length - nachfragen.length, offen: nachfragen.length },
    hinweise,
  };
}

/** Kurzfassung als Textzeilen (Lead-Nachricht, Druck) – nur Kennzahlen, keine Namen, kein Dateiinhalt. */
export function zusammenfassungZeilen(ergebnis) {
  if (!ergebnis?.ok) return [];
  const { felder, kennzahlen: kz, marktbezug: mb, nachfragen } = ergebnis;
  const f = (n, s = 0) => (Number.isFinite(n) ? n.toLocaleString("de-DE", { minimumFractionDigits: s, maximumFractionDigits: s }) : "–");
  const zeilen = [
    `Anlage: ${f(felder.kwp, 1)} kWp, Angebotssumme netto ${f(felder.preisNetto)} €${Number(felder.speicherKwh) > 0 ? `, Speicher ${f(felder.speicherKwh, 1)} kWh` : ""}`,
    `Kennzahlen: ${f(kz.eurProKwp)} €/kWp${kz.eurProKwhJahr ? `, ${f(kz.eurProKwhJahr, 2)} €/kWh Jahresertrag (${f(kz.jahresertragKwh)} kWh/a bei ${kz.ertragKwhProKwp} kWh/kWp)` : ""}`,
  ];
  if (mb) zeilen.push(`Marktbezug: ${mb.label} ${f(mb.eurProKwp)} €/kWp (${mb.quelle}, Stand ${mb.stand})`);
  zeilen.push(`Prüfpunkte zum Nachfragen (${nachfragen.length}/${ergebnis.pruefpunkte.length}): ${nachfragen.map((p) => p.frage).join(" | ") || "keine"}`);
  return zeilen;
}

/** Beispielwerte für die Vorschau vor dem Lead-Gate – klar als Beispiel gekennzeichnet, keine echte Anlage. */
export const BEISPIEL = {
  felder: { ...LEERE_FELDER, kwp: 99.9, preisNetto: 84900, modul: "Beispielmodul 440 Wp (Hersteller/Typ laut Angebot)", wechselrichter: "Beispiel-Wechselrichter 100 kW", unterkonstruktion: "Flachdach, Ost/West, ballastiert", netzanschluss: "Netzebene 7, bestehender Anschluss", gewaehrleistung: "3 Jahre", garantie: "12 / 25 Jahre" },
  ertragKwhProKwp: 950,
  ertragQuelle: "PVGIS, Beispielstandort, Ost/West 15°",
  antworten: { netz: "ja", komponenten: "ja", unterkonstruktion: "ja", gewaehrleistung: "ja", ertrag: "ja" },
};
