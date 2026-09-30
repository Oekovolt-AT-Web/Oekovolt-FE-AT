// src/lib/egBetriebe.js
//
// Teilnahme-Check für Betriebe und Gemeinden in der gemeinsamen Energienutzung (ElWG) –
// reine Funktionen, per Node prüfbar (scripts/eg-betriebe.test.mjs).
//
// Rechtsstand 30.09.2026, Quellen (abgerufen 30.09.2026):
//  - Koordinationsstelle für Energiegemeinschaften, FAQs zum ElWG
//    https://energiegemeinschaften.gv.at/faqs-zum-elwg/
//    · große Unternehmen: nicht in EEG, nur BEG und Peer-to-Peer; Leistung je Erzeugungs-Zählpunkt
//      max. 6 MW (§ 67 Abs. 3 ElWG laut FAQ), Reduktion über Teilnahmefaktor möglich (Detailwissen)
//    · Gebietskörperschaften: mind. 10 % der jährlich für die gemeinsame Nutzung erzeugten und
//      eingespeisten Menge für schutzbedürftige Haushalte (§ 68 Abs. 6 ElWG), seit 1.10.2026
//    · Netzentgelt bis 31.12.2026 nur für lokale/regionale EEG reduziert; ab 1.1.2027 auch für
//      BEG, P2P und EVA im Nahebereich
//  - Koordinationsstelle, Lieferantenverpflichtungen (§ 69 ElWG): > 30 kW Haushalte,
//    > 100 kW sonstige aktive Kunden und Energiegemeinschaften; übertragbar an Organisator
//  - Koordinationsstelle, Organisationsformen: EEG/BEG brauchen Rechtspersönlichkeit
//  - Reduktion bis 31.12.2026: SNE-V 2018 idF 2026 (lokal −57 %, regional −28 % NE 6/7,
//    −64 % NE 4/5), siehe src/lib/rechner/energiegemeinschaft.js
//  - Ab 2027: E-Control, SNE-G-V Begutachtungsentwurf 07/2026, § 9 Abs. 3: Abschläge je genutzter
//    Infrastruktur nach § 70 Abs. 6 Z 1 bis 4 ElWG in der Tarifverordnung – Sätze noch offen.
//
// Große Unternehmen = ab 250 Beschäftigte UND über 50 Mio. € Umsatz oder über 43 Mio. € Bilanzsumme
// (§ 6 Abs. 1 Z 61 ElWG laut Koordinationsstelle, Detailwissen).

import { EG_ANNAHMEN, egParams } from "./rechner/energiegemeinschaft.js";
import { zahlText } from "../data/kennzahlen.js";

export const EGB_STAND = "30.09.2026";

export const GRENZEN = {
  grossUnternehmenKw: 6000, // § 67 Abs. 3 ElWG (Koordinationsstelle)
  lieferantSonstigeKw: 100, // § 69 ElWG – Unternehmen, Gemeinden, Energiegemeinschaften
  lieferantHaushaltKw: 30, // § 69 ElWG – Haushalte (hier nur informativ)
  gemeindeAnteil: 0.1, // § 68 Abs. 6 ElWG
};

export const AKTEURE = [
  { id: "kmu", label: "KMU", sub: "unter 250 Beschäftigte" },
  { id: "gross", label: "Groß\u00adunternehmen", sub: "ab 250 Beschäftigte" },
  { id: "gemeinde", label: "Gemeinde", sub: "Gebiets\u00adkörperschaft" },
];

export const ROLLEN = [
  { id: "erzeuger", label: "Erzeuger", sub: "Anlage einbringen" },
  { id: "abnehmer", label: "Abnehmer", sub: "Strom beziehen" },
  { id: "beides", label: "Beides", sub: "Überschuss & Bezug" },
];

export const NAHEBEREICHE = [
  { id: "gebaeude", label: "Gebäude", sub: "gleiche Hauptleitung" },
  { id: "lokal", label: "Lokal", sub: "gleicher Trafo" },
  { id: "regional", label: "Regional", sub: "gleiches Umspannwerk" },
  { id: "weit", label: "Österreichweit", sub: "ohne Nahebereich" },
];

/** Leistungsstufen des Reglers (kW Engpassleistung der eingebrachten Anlagen). */
export const LEISTUNGSSTUFEN = [10, 30, 50, 100, 150, 250, 500, 750, 1000, 2000, 4000, 6000, 8000];

export const MODELL_NAMEN = {
  eeg: "Erneuerbare-Energie-Gemeinschaft (EEG)",
  beg: "Bürgerenergiegemeinschaft (BEG)",
  p2p: "Peer-to-Peer-Vertrag (P2P)",
  gea: "Gemeinschaftliche Erzeugungsanlage (GEA)",
};

const kw = (n) => `${zahlText(Math.round(n))} kW`;

/**
 * Darf der Akteur am Modell teilnehmen – und mit welchem Netzentgeltvorteil?
 * status: "ja" | "bedingt" | "nein" | "pruefen"
 */
export function modellStatus(modell, { akteur, nahebereich, leistungKw = 0, rolle = "erzeuger" }) {
  const erzeugt = rolle !== "abnehmer";
  const ueber6 = akteur === "gross" && erzeugt && leistungKw > GRENZEN.grossUnternehmenKw;

  if (modell === "eeg") {
    if (akteur === "gross") return { status: "nein", text: "Große Unternehmen dürfen nicht an Erneuerbare-Energie-Gemeinschaften teilnehmen." };
    const zusatz = akteur === "kmu" ? " – sofern die Teilnahme nicht Ihre gewerbliche Haupttätigkeit ist." : ".";
    if (nahebereich === "gebaeude") return { status: "ja", text: `Möglich${zusatz} Im Gebäude ist meist eine GEA einfacher.` };
    return { status: "ja", text: `Möglich${zusatz}` };
  }

  if (modell === "beg") {
    if (akteur === "gross") {
      return ueber6
        ? { status: "bedingt", text: `Möglich, aber höchstens ${kw(GRENZEN.grossUnternehmenKw)} je Erzeugungs-Zählpunkt – größere Anlagen nur anteilig über einen Teilnahmefaktor.` }
        : { status: "ja", text: erzeugt ? `Möglich, mit höchstens ${kw(GRENZEN.grossUnternehmenKw)} je Erzeugungs-Zählpunkt.` : "Möglich." };
    }
    return { status: "ja", text: "Möglich; eine BEG darf Strom aus jeder Quelle teilen." };
  }

  if (modell === "p2p") {
    if (akteur === "gross" && ueber6) {
      return { status: "bedingt", text: `Möglich, aber höchstens ${kw(GRENZEN.grossUnternehmenKw)} je Erzeugungs-Zählpunkt (Teilnahmefaktor).` };
    }
    return { status: "ja", text: "Vertrag direkt zwischen zwei Parteien, ohne eigene Rechtsperson. Umsetzung beim Netzbetreiber stufenweise ab 5.10.2026." };
  }

  // GEA: nur innerhalb eines Gebäudes bzw. an derselben Hauptleitung / im Standortbereich
  if (nahebereich !== "gebaeude") return { status: "nein", text: "Nur für Teilnehmer an derselben Hauptleitung bzw. im Standortbereich." };
  if (akteur === "gross") {
    return { status: "pruefen", text: "Für große Unternehmen gilt die 6-MW-Grenze auch hier; die Teilnahme im Einzelfall mit Netzbetreiber und Rechtsberatung klären." };
  }
  return { status: "ja", text: "Möglich – per Vertrag oder über eine juristische Person." };
}

/** Netzentgeltvorteil auf den Arbeitspreis je Modell und Nahebereich (Text, 2026 und ab 2027). */
export function netzentgelt(modell, nahebereich) {
  const ab2027 =
    nahebereich === "weit"
      ? "ab 2027: kein Abschlag – österreichweit gilt das volle Netzentgelt"
      : "ab 1.1.2027: prozentueller Abschlag je genutzter Netzinfrastruktur, Satz legt die Tarifverordnung fest (noch offen)";

  if (modell === "gea") return { bis2026: "zugeordneter Strom nutzt das öffentliche Netz nicht", ab2027 };
  if (modell === "eeg") {
    if (nahebereich === "lokal" || nahebereich === "gebaeude") return { bis2026: "bis 31.12.2026: −57 % auf den Arbeitspreis (lokal, NE 6/7)", ab2027 };
    if (nahebereich === "regional") return { bis2026: "bis 31.12.2026: −28 % (NE 6/7) bzw. −64 % (NE 4/5) auf den Arbeitspreis", ab2027 };
    return { bis2026: "keine Reduktion", ab2027 };
  }
  return { bis2026: "bis 31.12.2026 keine Reduktion", ab2027 };
}

/**
 * Richtwert für die 10-%-Regel: Mindestmenge für schutzbedürftige Haushalte,
 * wenn die gesamte Erzeugung der Gemeindeanlage in die gemeinsame Nutzung eingebracht und eingespeist wird.
 */
export function gemeindeMindestmenge(leistungKw, ertragProKwp = EG_ANNAHMEN.ertragProKwp) {
  const erzeugung = Math.max(0, leistungKw) * ertragProKwp;
  const mindest = erzeugung * GRENZEN.gemeindeAnteil;
  const haushalte = mindest / EG_ANNAHMEN.haushaltKwh;
  return { erzeugung: Math.round(erzeugung), mindest: Math.round(mindest), haushalte: Math.floor(haushalte) };
}

/** Pflichten und Hinweise zur gewählten Konstellation. */
export function pflichten({ akteur, rolle, leistungKw = 0, nahebereich }) {
  const erzeugt = rolle !== "abnehmer";
  const liste = [];

  if (akteur === "kmu") {
    liste.push({ id: "haupttaetigkeit", titel: "Keine Haupttätigkeit", text: "Die Teilnahme darf nicht Ihre gewerbliche oder berufliche Haupttätigkeit sein (aktiver Kunde nach ElWG)." });
  }
  if (erzeugt && leistungKw > GRENZEN.lieferantSonstigeKw) {
    liste.push({
      id: "lieferant",
      titel: "Lieferantenpflichten (§ 69 ElWG)",
      text: `Über ${kw(GRENZEN.lieferantSonstigeKw)} eingebrachter Leistung: Allgemeine Lieferbedingungen, Informationsblatt, normgerechte Rechnungen, Änderungen einen Monat im Voraus. Übertragbar an die Gemeinschaft oder einen Organisator.`,
    });
  }
  if (akteur === "gross" && erzeugt) {
    liste.push({
      id: "6mw",
      titel: leistungKw > GRENZEN.grossUnternehmenKw ? "6-MW-Grenze überschritten" : "6-MW-Grenze",
      text:
        leistungKw > GRENZEN.grossUnternehmenKw
          ? `Mit ${kw(leistungKw)} liegt die Anlage über ${kw(GRENZEN.grossUnternehmenKw)} – einbringen nur anteilig über einen Teilnahmefaktor.`
          : `Je Erzeugungs-Zählpunkt höchstens ${kw(GRENZEN.grossUnternehmenKw)}; Ihre Angabe liegt darunter.`,
    });
  }
  if (akteur === "gemeinde" && erzeugt) {
    const g = gemeindeMindestmenge(leistungKw);
    liste.push({
      id: "zehnprozent",
      titel: "10 % für schutzbedürftige Haushalte (§ 68 Abs. 6 ElWG)",
      text: `Richtwert bei ${kw(leistungKw)} und voller Einbringung: rund ${zahlText(g.erzeugung)} kWh Erzeugung im Jahr, davon mindestens ${zahlText(g.mindest)} kWh für schutzbedürftige Haushalte zugänglich machen. Preis und Bedingungen legt die Gemeinde fest.`,
      werte: g,
    });
    liste.push({ id: "vergabe", titel: "Gemeinde- und Vergaberecht", text: "Beschlüsse nach Gemeindeordnung und Vergabe von Planung und Bau nach Vergaberecht einplanen." });
  }
  if (nahebereich === "weit") {
    liste.push({ id: "weit", titel: "Kein Netzentgeltvorteil", text: "Österreichweit geteilt gilt das volle Netzentgelt; netzübergreifende Modelle laufen voraussichtlich ab April 2027." });
  }
  liste.push({ id: "smartmeter", titel: "Smart Meter & Datenfreigabe", text: "Jeder Zählpunkt braucht Viertelstundenwerte und die Zustimmung zur Datenübermittlung." });
  return liste;
}

/** Gesamtauswertung für die Oberfläche. */
export function teilnahmeCheck(eingabe) {
  const e = {
    akteur: AKTEURE.some((a) => a.id === eingabe.akteur) ? eingabe.akteur : "kmu",
    rolle: ROLLEN.some((r) => r.id === eingabe.rolle) ? eingabe.rolle : "erzeuger",
    nahebereich: NAHEBEREICHE.some((n) => n.id === eingabe.nahebereich) ? eingabe.nahebereich : "lokal",
    leistungKw: Number.isFinite(eingabe.leistungKw) ? Math.max(0, eingabe.leistungKw) : 0,
  };
  if (e.rolle === "abnehmer") e.leistungKw = 0;
  const modelle = ["eeg", "beg", "p2p", "gea"].map((id) => ({ id, name: MODELL_NAMEN[id], ...modellStatus(id, e), netz: netzentgelt(id, e.nahebereich) }));
  return { eingabe: e, modelle, pflichten: pflichten(e), empfehlung: empfehlung(e, modelle), rechnerLink: rechnerLink(e) };
}

/** Kurze Empfehlung: welches Modell zuerst prüfen? */
export function empfehlung(e, modelle) {
  const ok = (id) => modelle.find((m) => m.id === id)?.status !== "nein";
  if (e.nahebereich === "gebaeude" && ok("gea")) return { modell: "gea", text: "Im selben Gebäude zuerst die gemeinschaftliche Erzeugungsanlage prüfen – ohne Verein und mit dem höchsten Netzvorteil." };
  if (e.akteur === "gross") return { modell: "beg", text: "Als großes Unternehmen kommen Bürgerenergiegemeinschaft oder Peer-to-Peer-Vertrag in Frage; alternativ Dachfläche an eine EEG verpachten." };
  if (e.nahebereich === "weit") return { modell: "beg", text: "Ohne Nahebereich gibt es keinen Netzentgeltvorteil – eine BEG oder ein P2P-Vertrag bündelt dann vor allem den Strompreis." };
  if (e.akteur === "gemeinde") return { modell: "eeg", text: "Für Gemeinden ist die lokale oder regionale EEG der Klassiker: Netzentgeltvorteil, Entfall von Elektrizitätsabgabe und Erneuerbaren-Förderbeitrag, Bürgerbeteiligung." };
  return { modell: "eeg", text: "Als KMU im Nahebereich bringt die EEG die meisten Vorteile: reduziertes Netzentgelt, keine Elektrizitätsabgabe und kein Erneuerbaren-Förderbeitrag auf den Gemeinschaftsstrom." };
}

/**
 * Link in den Energiegemeinschafts-Rechner mit einem Beispielszenario zur Konstellation.
 * Partner und Verbräuche sind Rechenannahmen, im Rechner frei änderbar.
 */
export function rechnerLink({ akteur, rolle, leistungKw, nahebereich }) {
  const gross = akteur === "gross";
  const modell = gross || nahebereich === "weit" ? "beg" : nahebereich === "regional" ? "regional" : "lokal";
  const typ = akteur === "gemeinde" ? "gemeinde" : "betrieb";
  const kwp = rolle === "abnehmer" ? 0 : Math.min(5000, Math.round(leistungKw));
  const ne = kwp > 250 ? "6" : "7";
  const selbst = { typ, verbrauch: rolle === "erzeuger" ? 120000 : 250000, kwp, ne, schichten: 1, gross };
  const partner =
    rolle === "abnehmer"
      ? [{ typ: akteur === "gemeinde" ? "betrieb" : "gemeinde", verbrauch: 100000, kwp: 150, ne: "7", schichten: 1 }]
      : [
          { typ: "betrieb", verbrauch: 200000, kwp: 0, ne: "7", schichten: 2 },
          { typ: "haushalte", anzahl: 30, verbrauch: EG_ANNAHMEN.haushaltKwh, kwp: 0, ne: "7n" },
        ];
  const q = egParams({ teilnehmer: [selbst, ...partner], modell, bereich: "ooe", energiepreisCt: EG_ANNAHMEN.energiepreisCt, egPreisCt: null });
  // p=null weglassen: der Rechner schlägt dann selbst den Win-win-Preis vor
  return `/rechner/energiegemeinschaft?${q.replace(/&p=null/, "")}`;
}
