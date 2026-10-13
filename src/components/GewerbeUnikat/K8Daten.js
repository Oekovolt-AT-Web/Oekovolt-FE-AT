// src/components/GewerbeUnikat/K8Daten.js
//
// K8 · Inhalte des Fahrplans (NUR SERVER – von K8Fahrplan.js importiert): Stationen, Montagefenster, Kalender,
// Rechtliches, Mieter-Karte – als reine Daten (Texte, Links). Die Insel bekommt sie als Props, gerendert wird
// in K8FahrplanAnsicht.js (kein Fließtext im Client-Bundle). Texte aus der bisherigen Seite /gewerbe (AblaufLeiste, „Genehmigung & Recht“,
// FAQ) sowie aus src/data/netzbetreiber.js (CHECKLISTE, EAG_BEZUG) und src/data/einwaende.js („keine-zeit“).
// Regeln: keine Dauern, Fördercall nur als Kalenderfakt, Parkregler nur als PARKREGLER_SATZ.

import { FOERDERCALL, callPhase } from "@/lib/foerdercall";
import { FOERDER_FRISTEN, istKommend } from "@/data/foerderFristen";
import { PARKREGLER_SATZ } from "@/data/marke";
import { heuteWienIso } from "@/lib/programmStatus";
import { GEWERBE_PV } from "@/lib/rechner/gewerbepv";
import { acSumme, acVorschlag, torTyp } from "@/components/Technik/torTypen";
import { BEISPIEL, BEISPIEL_ERGEBNIS } from "./_beispiel";
import { beispielServer } from "./_server";
import { START as K2_START, kennwerte } from "./K2Modell";
import { startDeckel } from "./K5Rechnen";

/** Wörtlich (Konzept): Erklärung des Abhängigkeits-Schlosses an Station 6. */
export const SCHLOSS_TEXT = "Der EAG-Antrag muss vor der Inbetriebnahme gestellt sein; Anzeigen und Genehmigungen müssen dann in erster Instanz vorliegen.";

/** Einwände, die K8 als kompakte <details> zeigt (src/data/einwaende.js). */
export const EINWAND_IDS = ["keine-zeit", "servicepartner", "entfernung", "contracting", "drei-angebote"];

/**
 * Stationen. `beitrag` füllt die Zuständigkeits-Spuren (Desktop) bzw. die Unterzeile (mobil):
 * sie = Ihr Beitrag, wir = Ökovolt, mit = weitere Beteiligte. Soft hyphens (\u00AD) für schmale Spalten.
 */
export const STATIONEN = [
  {
    nr: 1,
    titel: "Lastgang & Dach",
    beitrag: { sie: "Daten liefern", wir: "werten aus", mit: "–" },
    passiert: "Viertelstundenwerte, Netzrechnung, Dachpläne und Statik auswerten – daraus ergeben sich Grundlast, Anlagengröße und Netzebene.",
    sie: [
      "Lastgang der letzten zwölf Monate in Viertelstundenwerten – Betriebe mit Leistungsmessung erhalten ihn beim Netzbetreiber, meist über dessen Kundenportal",
      "Netzrechnungen (Netzebene, gemessene Leistung)",
      "Dachpläne, Statikunterlagen und Betriebszeiten",
    ],
    wir: ["Grundlast, Monatsspitzen und Eigenverbrauch aus Ihren Viertelstundenwerten", "Dachbelegung und Vorprüfung von Statik und Schneelast"],
    recht: "Keine Genehmigung nötig. Bemessung nach ÖNORM B 1991-1-3 (Schneelast) und B 1991-1-4 (Wind). Ohne Lastgang reichen für eine erste Einschätzung Jahresverbrauch und Rechnungen.",
    links: [
      { label: "Lastgang selbst auswerten", href: "/lastgang-analyse" },
      { label: "Kapitel 01 · Lastgang", href: "#lastgang" },
    ],
  },
  {
    nr: 2,
    titel: "Wirtschaft\u00ADlichkeit & Förderung",
    beitrag: { sie: "entscheiden", wir: "rechnen", mit: "Ihre Steuer\u00ADberatung" },
    passiert: "Varianten mit und ohne Speicher, Überschussvermarktung, EAG-Zuschuss, IFB und Finanzierung nebeneinander – mit offen gelegtem Rechenweg.",
    sie: ["Energiepreis aus Ihrem Liefervertrag", "Investitionsrahmen und Wahl der Variante", "Abstimmung mit Ihrer Steuerberatung (Investitionsfreibetrag, Abschreibung)"],
    wir: ["Rechenweg Zeile für Zeile, Leistungspreis und Speicher getrennt gerechnet", "Vergleich von Kauf, Contracting und Pacht – ohne Anbieternamen"],
    recht: "Öko-Investitionsfreibetrag 22 % für Anschaffungen bis 31.12.2026, danach 15 %. Selbst erzeugter und verbrauchter Strom ist nach § 2 Elektrizitätsabgabegesetz von der Abgabe befreit.",
    links: [
      { label: "Kapitel 07 · Wirtschaftlichkeit", href: "#wirtschaftlichkeit" },
      { label: "Kauf, Kredit oder Leasing", href: "/rechner/finanzierung" },
    ],
  },
  {
    nr: 3,
    titel: "Netzzugang",
    beitrag: { sie: "unterschreiben", wir: "melden an", mit: "Netzbetreiber" },
    passiert: "Antrag beim Netzbetreiber, Netzverträglichkeitsprüfung, Netzzugangsvertrag und Einspeisezählpunkt. Ohne Einspeisezählpunkt gibt es keinen EAG-Antrag.",
    sie: [
      "Bezugszählpunkt von der Netzrechnung (33 Stellen, beginnt mit AT)",
      "Zustimmung des Grundeigentümers, wenn Sie die Halle mieten",
      "Unterschrift unter den Netzzugangsvertrag",
    ],
    wir: [
      "Leistungen festlegen: Module in kWp, Wechselrichter in kVA, Einspeiseleistung",
      "Wechselrichter mit TOR-Nachweis, Antrag und Abstimmung mit dem Netzbetreiber",
      "Anzeigen nach Landes-Elektrizitätsrecht und Bauordnung, wo nötig",
    ],
    recht: "Elektrizitätswirtschaftsgesetz (ElWG, BGBl. I Nr. 91/2025) und TOR Erzeuger der E-Control; ab Typ B (250 kW) verlangt der Netzbetreiber zusätzliche Nachweise.",
    links: [
      { label: "Netzanmeldung Schritt für Schritt", href: "/netzanmeldung" },
      { label: "Kapitel 06 · Netzanschluss", href: "#netzanschluss" },
    ],
  },
  {
    nr: 4,
    titel: "EAG-Förder\u00ADantrag",
    beitrag: { sie: "geben frei", wir: "beantragen", mit: "EAG-Abwicklungs\u00ADstelle" },
    passiert: "Förderantrag im Fördercall der EAG-Abwicklungsstelle. In Kategorie D (über 100 kWp) wird nach dem niedrigsten Förderbedarf in €/kWp gereiht, höchstens 120 €/kWp.",
    sie: ["Freigabe des Förderbedarfs (Gebot in €/kWp)", "Einspeisezählpunkt aus Station 03"],
    wir: ["Antrag vorbereiten und im Portal einreichen", "Anzeigen und Genehmigungen zum Antrag beilegen"],
    recht: "§ 56 EAG und EAG-Investitionszuschüsseverordnung-Strom (BGBl. II Nr. 12/2026): Antrag vor der Inbetriebnahme, Anzeigen und Genehmigungen dann in erster Instanz. Bestellen und montieren ist vorher erlaubt.",
    links: [{ label: "EAG-Fördercall erklärt", href: "/forderungen/eag-foerdercall" }],
  },
  {
    nr: 5,
    titel: "Montage im laufenden Betrieb",
    beitrag: { sie: "Zugang geben", wir: "montieren", mit: "Feuerwehr, Versicherung" },
    passiert: "Baustelleneinrichtung nach Ihren Schichtplänen. Wählen Sie das Montagefenster – die Karte zeigt, was sich dadurch ändert.",
    sie: ["Schichtplan und Termin für die Einbindung in die Hauptverteilung", "Ansprechperson für Zutritt und Sicherheit"],
    wir: ["Unterkonstruktion, Module, Wechselrichter und Leitungen", "Abstimmung mit Feuerwehr und Betriebsversicherung"],
    recht: "Errichtung nach ÖVE/ÖNORM E 8101, Brandschutz nach OVE-Richtlinie R 11-1 (Freihaltezonen, Abschaltkonzept, Feuerwehrplan).",
    links: [],
    bild: true,
  },
  {
    nr: 6,
    titel: "Inbetrieb\u00ADnahme & Erstprüfung",
    beitrag: { sie: "nehmen ab", wir: "prüfen, melden fertig", mit: "Netzbetreiber" },
    passiert: "Erstprüfung, Prüfprotokoll und Anlagenbuch, dann die Fertigmeldung im Portal des Netzbetreibers. Eingespeist wird erst nach dessen Freigabe.",
    sie: [
      "Abnahmevertrag für den Überschuss (Stromhändler, OeMAG oder Energiegemeinschaft) – ohne ihn keine Freigabe bzw. keine Vergütung",
      "Abnahme der Anlage, Unterlagen an Ihre Betriebsversicherung",
    ],
    wir: ["Erstprüfung, Ländereinstellung Österreich und Blindleistungsverfahren", "Fertigmeldung mit Prüf- und Einstellprotokollen", `Ab TOR Typ B: ${PARKREGLER_SATZ}`],
    recht: "Erstprüfung nach ÖVE/ÖNORM EN 62446-1, Errichtung nach ÖVE/ÖNORM E 8101. Beim EAG-Investitionszuschuss muss der erste gültige Antrag vor dem Einschalten eingereicht sein.",
    links: [{ label: "Kapitel 06 · TOR Typ A oder B", href: "#netzanschluss" }],
    schloss: "erst nach Netzzugang und Förderantrag",
  },
  {
    nr: 7,
    titel: "Betrieb, Service & Ausbau",
    beitrag: { sie: "nutzen, entscheiden", wir: "betreuen", mit: "–" },
    passiert: "Monitoring über SCADA und Fernwartung, Wartungsvertrag, E-Check und Reststromvermarktung – über die gesamte Laufzeit. Speicher, Ladepunkte, Wärmepumpe oder Energiegemeinschaft lassen sich später ergänzen.",
    sie: ["Zugang für Wartung und Prüfungen", "Bescheid geben bei Umbauten am Dach oder an der Hauptverteilung"],
    wir: [PARKREGLER_SATZ, "Wartung und E-Check nach Vertrag"],
    recht: "Überschuss an OeMAG, Stromhändler oder per Direktvermarktung; Energiegemeinschaften nach §§ 65–72 ElWG (seit 01.10.2026).",
    links: [
      { label: "Energiegemeinschaften", href: "/energiegemeinschaften" },
      { label: "Direktvermarktung", href: "/service/direktvermarktung" },
    ],
  },
];

/** Spuren der Zuständigkeit (Desktop-Tabelle unter den Stationen). */
export const SPUREN = [
  { id: "sie", label: "Ihr Beitrag" },
  { id: "wir", label: "Wir" },
  { id: "mit", label: "Beteiligt" },
];

/** Montagefenster (Segment in Station 5). Ids = steckbrief.montagefenster. */
export const FENSTER = [
  { id: "schicht", label: "laufende Schicht" },
  { id: "wochenende", label: "Wochen\u00ADenden" },
  { id: "betriebsurlaub", label: "Betriebs\u00ADurlaub" },
];

/** Was sich je Montagefenster ändert – ohne Dauern, ohne Zusagen. */
export const MONTAGE_TEXTE = {
  offen: {
    kran: "Kranstellplatz, Materiallager und Zufahrt stimmen wir mit Ihrer Werkslogistik ab.",
    abschaltung: "Module und DC-Leitungen werden ohne Eingriff in Ihre Stromversorgung montiert. Abgeschaltet wird nur für die Einbindung in die Hauptverteilung – zu einem vereinbarten Zeitpunkt.",
    brandschutz: "Freihaltezonen, Abschaltkonzept und Feuerwehrplan nach OVE-Richtlinie R 11-1; Heißarbeiten nur mit Ihrer Freigabe.",
    unterweisung: "Unsere Monteure werden vor dem ersten Einsatz nach Ihren Betriebsregeln unterwiesen – Zutritt, Verkehrswege, Notfall.",
  },
  schicht: {
    kran: "Kranhub und Anlieferung außerhalb der Hauptzeiten Ihrer Werkslogistik; die Kranzone wird abgesperrt, Wege für Stapler und Lkw bleiben frei.",
    abschaltung: "Die Produktion läuft weiter. Die Einbindung in die Hauptverteilung legen wir in eine Pause, an das Schichtende oder auf einen Wochenendtermin.",
    brandschutz: "Heißarbeiten, etwa an der Dachhaut, nur mit Ihrer Freigabe und Brandwache; Rettungswege und Brandabschnitte bleiben frei.",
    unterweisung: "Unterweisung aller Monteure vor dem ersten Einsatz; Zutritt nur über abgestimmte Wege, Arbeitszeiten nach Ihrem Schichtplan.",
  },
  wochenende: {
    kran: "Anlieferung und Kranhub, wenn Hof und Zufahrt frei sind – weniger Berührung mit Ihrem Werksverkehr.",
    abschaltung: "Die Einbindung in die Hauptverteilung trifft keine laufende Schicht; mit Samstagsbetrieb am Nachmittag oder am Sonntag.",
    brandschutz: "Zutritt mit Werkschutz bzw. Brandmeldeanlage abstimmen; Heißarbeiten nur mit Freigabe und Brandwache.",
    unterweisung: "Unterweisung vorab und eine erreichbare Ansprechperson Ihres Betriebs für Zutritt und Notfall am Wochenende.",
  },
  betriebsurlaub: {
    kran: "Hof und Zufahrten sind frei – Kranstellplatz und Materiallager lassen sich großzügig einrichten.",
    abschaltung: "Die Einbindung in die Hauptverteilung trifft keine Produktion; abzustimmen bleibt nur die Grundlast, etwa IT und Kühlung.",
    brandschutz: "Weniger Personal im Werk: Brandmeldeanlage, Feuerwehrzufahrt und Brandwache für die Urlaubszeit gemeinsam festlegen.",
    unterweisung: "Unterweisung mit Ihrer Haustechnik oder Bereitschaft; Zutritt und Notfallkette für die Urlaubszeit schriftlich festhalten.",
  },
};

// ---------------------------------------------------------------------------------------------------
// Kalender (Station 4): Fördercall als Kalenderfakt und kommende Fristen für Betriebe – kein Countdown
// ---------------------------------------------------------------------------------------------------

const datum = (iso) => {
  const [j, m, t] = iso.split("-");
  return `${t}.${m}.${j}`;
};

/** „08.–22.10.2026“ bzw. „28.12.2026–08.01.2027“. */
function spanne(von, bis) {
  if (von.slice(0, 7) === bis.slice(0, 7)) return `${von.slice(8)}.–${datum(bis)}`;
  return `${datum(von)}–${datum(bis)}`;
}

/** Der laufende Fördercall steht schon im Satz darüber – seine Termine nicht doppelt listen. */
const CALL_PRAEFIX = `eag-call-${FOERDERCALL.jahr}-${FOERDERCALL.nr}`;

/** Kommende Fristen für Betriebe (bundesweit), höchstens 6 – reine Kalenderfakten. */
export function fristenFuerBetriebe(heuteIso = heuteWienIso()) {
  return FOERDER_FRISTEN.filter((f) => f.bundesland === "bund" && f.zielgruppen.includes("unternehmen") && !f.id.startsWith(CALL_PRAEFIX) && istKommend(f, heuteIso))
    .sort((a, b) => (a.datum < b.datum ? -1 : 1))
    .slice(0, 6)
    .map((f) => ({
      id: f.id,
      wann: f.bis ? spanne(f.datum, f.bis) : datum(f.datum),
      titel: f.titel,
      voraussichtlich: !!f.voraussichtlich,
      quelle: { label: f.quelle.label, url: f.quelle.url },
    }));
}

/** „22.10., 23:59 Uhr“ aus einem ISO-Zeitpunkt mit Zonenangabe (Wanduhr Österreich, ohne Intl). */
export function wandzeit(iso) {
  const m = /^\d{4}-(\d{2})-(\d{2})T(\d{2}):(\d{2})/.exec(String(iso || ""));
  return m ? `${m[2]}.${m[1]}., ${m[3]}:${m[4]} Uhr` : null;
}

/**
 * Satz zum Fördercall je Phase (vor / Ticketziehung / Einreichung / vorbei) – Datum statt Countdown.
 * Uhrzeiten kommen aus FOERDERCALL (antragStart, ende), damit der nächste Call ohne Änderung hier stimmt.
 */
export function kalenderSatz(phase, call = FOERDERCALL) {
  const c = `${call.nr}. EAG-Fördercall ${call.jahr}`;
  if (phase === "nach") return `Der ${c} lief vom ${call.zeitraum}.`;
  if (phase === "vor") return `Der ${c} ist für ${call.zeitraum} angesetzt.`;
  const bis = wandzeit(call.ende);
  const ab = wandzeit(call.antragStart);
  if (phase === "ticket" && ab && bis) return `Der ${c} läuft vom ${call.zeitraum} (Einreichung ab ${ab} bis ${bis}).`;
  return bis ? `Der ${c} läuft vom ${call.zeitraum} (Einreichung bis ${bis}).` : `Der ${c} läuft vom ${call.zeitraum}.`;
}

/** Alles, was die Insel braucht – serialisierbare Daten. */
export function fahrplanDaten(heuteIso = heuteWienIso()) {
  return {
    stationen: STATIONEN.map((s) => ({ ...s, schloss: s.schloss || null, bild: !!s.bild, mieter: s.nr === 3 ? MIETER : null })),
    montage: MONTAGE_TEXTE,
    kalender: {
      satz: kalenderSatz(callPhase(Date.now())),
      portal: FOERDERCALL.portal,
      stand: FOERDERCALL.stand.label,
      fristen: fristenFuerBetriebe(heuteIso),
    },
  };
}

/** Rechtliches (Wissensschublade) – voller Text wie bisher auf /gewerbe. */
export const RECHT = [
  {
    titel: "Netzzugang",
    text: "Antrag beim Netzbetreiber (z. B. Netz Oberösterreich, Salzburg Netz, Wiener Netze, Netz Niederösterreich), Netzverträglichkeitsprüfung, Netzzugangsvertrag und Einspeisezählpunkt. Rechtsgrundlage ist seit 2025/2026 schrittweise das Elektrizitätswirtschaftsgesetz (ElWG, BGBl. I Nr. 91/2025).",
  },
  {
    titel: "Gewerberecht",
    text: "Überschusseinspeiser sind Teil der Betriebsanlage; laut Erlass des Wirtschaftsministeriums vom 1. März 2021 im Regelfall ohne eigene Genehmigung – außer bei Sonderfällen wie Fluchtwegen, Ex-Zonen oder Blendung.",
  },
  {
    titel: "Elektrizitätsrecht des Landes",
    text: "Dach- und Parkplatzanlagen sind vielfach bewilligungsfrei – in Oberösterreich etwa auf künstlichen Strukturen unabhängig von der Leistung. Volleinspeiser und Freiflächen können eine Anzeige oder Bewilligung brauchen.",
  },
  {
    titel: "Bauordnung",
    text: "Je Bundesland unterschiedlich – auf Dächern meist bewilligungs- und anzeigefrei, aber Orts- und Landschaftsbild, Statik und Brandschutz gelten immer.",
    link: { label: "Baurecht der Bundesländer", href: "/forderungen/baurecht" },
  },
  {
    titel: "Förderung",
    text: "EAG-Antrag vor der Inbetriebnahme; alle Anzeigen und Genehmigungen müssen zu diesem Zeitpunkt in erster Instanz vorliegen.",
  },
  {
    titel: "Versicherung & Brandschutz",
    text: "Abstimmung mit Betriebsversicherung und Feuerwehr, Errichtung nach ÖVE/ÖNORM E 8101 und Erstprüfung nach ÖVE/ÖNORM EN 62446-1.",
  },
];

/** Verfahren im Überblick (Tabelle in der Schublade) – Reihenfolge statt Dauer. */
export const VERFAHREN = [
  { verfahren: "Netzzugang", wer: "Netzbetreiber", wann: "vor der Montage, Ergebnis: Einspeisezählpunkt", grundlage: "ElWG, TOR Erzeuger" },
  { verfahren: "Anzeige/Bewilligung nach Landesrecht", wer: "Land bzw. Gemeinde", wann: "nur wo nötig, vor dem EAG-Antrag", grundlage: "Elektrizitätsrecht des Landes, Bauordnung" },
  { verfahren: "Gewerbebehörde", wer: "Bezirksverwaltungsbehörde", wann: "nur in Sonderfällen (Fluchtwege, Ex-Zonen, Blendung)", grundlage: "Erlass vom 1. März 2021" },
  { verfahren: "EAG-Investitionszuschuss", wer: "EAG-Abwicklungsstelle", wann: "im Fördercall, vor der Inbetriebnahme", grundlage: "§ 56 EAG, EAG-IZV-Strom" },
  { verfahren: "Brandschutz und Versicherung", wer: "Feuerwehr, Betriebsversicherung", wann: "vor der Montage abgestimmt", grundlage: "OVE R 11-1, ÖVE/ÖNORM E 8101" },
  { verfahren: "Fertigmeldung und Freigabe", wer: "Netzbetreiber", wann: "nach der Erstprüfung, vor dem Einspeisen", grundlage: "ÖVE/ÖNORM EN 62446-1" },
];

/** Karte „Mieter der Halle?“ in Station 3 (Text aus der FAQ, gekürzt) – dort braucht es die Zustimmung des Eigentümers. */
export const MIETER = {
  frage: "Mieter der Halle?",
  titel: "Dann regelt eine Dachnutzungsvereinbarung das Dach.",
  text: "Der Eigentümer stimmt zu – passend zur Laufzeit der Anlage, mit Regeln zu Dachsanierung, Rückbau und Versicherung. Alternativ investiert der Eigentümer und liefert Ihnen den Strom, etwa über eine gemeinschaftliche Erzeugungsanlage. Wir stimmen das Modell mit beiden Seiten ab.",
};

// ---------------------------------------------------------------------------------------------------
// Projektsteckbrief im Startzustand: ein vollständig ausgefülltes BEISPIEL-Dossier
// ---------------------------------------------------------------------------------------------------

/**
 * Beispielwerte für jedes Feld des Steckbriefs – genau die Startzustände der Kapitel, aus denselben
 * Bibliotheken gerechnet (keine erfundenen Zahlen). Der Besucher ersetzt sie Zeile für Zeile durch seine
 * Werte; Beispielwerte gehen NIE in die Anfrage (siehe anfrageTeile in K8SteckbriefBlatt.js).
 *
 * Zwei offen benannte Sichten („Eine Wahrheit“): Anlage, Eigenverbrauch, Speicher und Netz kommen aus dem
 * Stundenmodell des synthetischen Betriebs (Linz, Ost-West, Empfehlung 280 kWp), Amortisation und
 * Überschuss aus dem Rechenbeispiel (300 kWp, 70 % Eigenverbrauch, 1.050 kWh/kWp). Das Blatt nennt beides.
 */
export function steckbriefBeispiel() {
  const b = beispielServer();
  const k = b.kennzahlen;
  const emp = k.pv?.empfehlung ?? { kwp: 280, evQuote: null, autarkie: null };

  // K2 im Startzustand: Halle 100 × 60 m, Ost-West, Linz – größte Anlage nach Flächenbedarf der Dachart
  const ow = GEWERBE_PV.dacharten.find((d) => d.id === K2_START.dachart);
  const dach = ow ? kennwerte({ ...K2_START, qmProKwp: ow.qmProKwp, spez: 0 }) : null;

  // K5 im Startzustand: Deckel bei 74 % der Jahresspitze → Speicher und Ersparnis (NE 6 Oberösterreich)
  const deckel = startDeckel(k.spitzeKw);
  const kapp = b.kappung.find((z) => z.schwelle === deckel && z.moeglich) || null;

  // K6 im Startzustand: Empfehlung ohne Speicher, Wechselrichter-Vorschlag kWp ÷ 1,15
  const wr = acVorschlag(emp.kwp);
  const tor = torTyp(wr);
  // … und mit dem Speicher-Wechselrichter aus K5 (Querverweis im Blatt)
  const acMitSpeicher = kapp ? acSumme({ wrKva: wr, speicherKva: kapp.leistungKw }) : null;

  const r = BEISPIEL_ERGEBNIS;
  return {
    werte: {
      quelle: "beispiel",
      jahresverbrauchKwh: Math.round(k.jahresverbrauch / 1000) * 1000,
      schichten: 2,
      dachart: K2_START.dachart,
      flaecheQm: K2_START.laengeM * K2_START.breiteM,
      ortId: K2_START.ortId,
      kwpMax: dach?.kwp ?? null,
      kwp: emp.kwp,
      evQuote: emp.evQuote,
      autarkie: emp.autarkie,
      flotte: 0,
      bereich: BEISPIEL.bereich,
      ne: BEISPIEL.ne,
      vermiedenCt: Math.round(r.vermiedenCt * 1000) / 1000,
      schwelleKw: kapp ? deckel : null,
      speicherKw: kapp ? kapp.leistungKw : null,
      speicherKwh: kapp ? kapp.nennKwh : null,
      lpErsparnisEuro: kapp ? Math.round(kapp.euro) : null,
      acSummeKw: wr,
      torTyp: tor.typ.toLowerCase(),
      amortisationJahre: r.amortisation == null ? null : Math.round(r.amortisation * 10) / 10,
      ueberschussJahr: Math.round(r.jahr),
      montagefenster: "betriebsurlaub",
    },
    bezug: {
      // Rechenbeispiel (K7)
      rbKwp: BEISPIEL.kwp,
      rbEv: BEISPIEL.evQuote,
      rbErtrag: BEISPIEL.ertragKwhKwp,
      rbStand: BEISPIEL.stand,
      // Modell (K3)
      modellErtrag: Math.round(k.pv?.jahresErtrag ?? 0),
      // K4
      energieCt: BEISPIEL.energieCt,
      // K2
      laengeM: K2_START.laengeM,
      breiteM: K2_START.breiteM,
      // K5/K6
      spitzeKw: Math.round(k.spitzeKw),
      acMitSpeicher,
      torMitSpeicher: acMitSpeicher != null ? torTyp(acMitSpeicher).typ : null,
      // K8 – Betriebsurlaub im synthetischen Lastgang (src/lib/lastgang/beispiel.js: 4.–15. August)
      urlaub: "4.–15. August",
    },
  };
}
