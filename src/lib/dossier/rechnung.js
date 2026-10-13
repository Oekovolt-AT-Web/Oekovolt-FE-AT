// src/lib/dossier/rechnung.js
//
// Gemeinsame Rechnung für Business-Case-Dossier (/dossier), Investitionsantrag
// (/rechner/investitionsantrag) und das Dossier-PDF (/api/dossier/pdf): Eingaben lesen und
// begrenzen, Projekt-Cashflow, Sensitivität, DSCR, Modellvergleich, Vergabehinweise und
// CO₂-Textbaustein in einem Ergebnisobjekt. Ohne React – im Browser und auf dem Server gleich.
// Alle Zahlen: Richtwerte/Orientierung mit Quelle und Stand; keine Steuer- oder Finanzberatung.

import { projektCashflow, sensitivitaet, INVESTITION, STAND_INVESTITION, zahl, euro, prozent } from "../rechner/investition.js";
import { rechneModellvergleich } from "../rechner/modellvergleich.js";
import { vergabeWege, VERGABE_STAND } from "../kommunen/vergabe.js";
import { rechneCo2, textbaustein, CO2 } from "../rechner/co2.js";
import { ANNAHMEN, PREISQUELLEN } from "../../data/solarrechner.js";

export { zahl, euro, prozent };

export const DOSSIER_STAND = STAND_INVESTITION;
export const GATE_KENNUNG = "dossier";
export const GATE_KENNUNG_ANTRAG = "investitionsantrag";
/** Lead-Gate-Kennung je Variante (Liste in src/data/leadRechner.js, Paket B03). */
export const gateKennung = (variante) => (variante === "investitionsantrag" ? GATE_KENNUNG_ANTRAG : GATE_KENNUNG);

/** Varianten des Dossiers (Zielgruppe bestimmt Auswahl und Reihenfolge der Abschnitte). */
export const VARIANTEN = [
  { id: "cfo", label: "Für die Geschäftsführung / CFO", kurz: "GF / CFO", text: "Kapitalwert, Sensitivität, Cashflow und Modellvergleich – die Entscheidungsgrundlage auf zwei Seiten." },
  { id: "bank", label: "Für die Bank", kurz: "Bank", text: "Unterlagenliste, Schuldendienstdeckung (DSCR) und Ertragsprognose mit Methode – was der Finanzierungspartner sehen will." },
  { id: "gemeinderat", label: "Für den Gemeinderat", kurz: "Gemeinderat", text: "Kennzahlen in Klartext, Vergabehinweise nach BVergG und die nächsten Schritte für den Beschluss." },
  { id: "investitionsantrag", label: "Investitionsantrag", kurz: "Antrag", text: "Entscheidungsvorlage → Annahmen → Cashflow 25 Jahre → Risiken → CO₂-Textbaustein → nächste Schritte." },
];

/**
 * URL-Felder des Investitionsantrags (Gewerbe-Rechner verlinken mit diesen Schlüsseln):
 *   kwp, inv (Investition € netto), ertrag (kWh/kWp), ev (Eigenverbrauch %), preis (ct/kWh),
 *   einsp (ct/kWh), betrieb (€/a), zins (%), fk (Fremdkapitalanteil %), lauf (Jahre),
 *   wacc (%), ifb (0/1), eag (0/1), verbrauch (kWh/a), jahr (Berichtsjahr CO₂)
 */
export const URL_FELDER = [
  { k: "kwp", name: "kwp", min: 5, max: 5000 },
  { k: "inv", name: "investition", min: 1000, max: 20_000_000 },
  { k: "ertrag", name: "ertragProKwp", min: 500, max: 1500 },
  { k: "ev", name: "eigenverbrauchsquote", min: 0, max: 100, faktor: 0.01 },
  { k: "preis", name: "strompreisCt", min: 3, max: 60 },
  { k: "einsp", name: "einspeiseCt", min: 0, max: 20 },
  { k: "betrieb", name: "betriebskosten", min: 0, max: 500_000 },
  { k: "zins", name: "kreditZins", min: 0, max: 15, faktor: 0.01 },
  { k: "fk", name: "fremdkapitalAnteil", min: 0, max: 100, faktor: 0.01 },
  { k: "lauf", name: "kreditJahre", min: 1, max: 25 },
  { k: "wacc", name: "kalkulationszins", min: 0, max: 15, faktor: 0.01 },
  { k: "ifb", name: "ifb", bool: true },
  { k: "eag", name: "eag", bool: true },
  { k: "verbrauch", name: "strombezugKwh", min: 0, max: 50_000_000 },
  { k: "jahr", name: "berichtsjahr", min: 2024, max: 2060 },
];

/** Standard-Eingaben des Dossiers (offen, änderbar). */
export const STANDARD_EINGABEN = {
  kwp: INVESTITION.kwp,
  investition: null, // null = Richtwert aus Marktstatistik (preisProKwp)
  ertragProKwp: INVESTITION.ertragProKwp,
  eigenverbrauchsquote: INVESTITION.eigenverbrauchsquote,
  strompreisCt: INVESTITION.strompreisCt,
  einspeiseCt: null, // null = Rechensatz (einspeiseSatzCt)
  betriebskosten: null,
  kreditZins: INVESTITION.kredit.zins,
  fremdkapitalAnteil: INVESTITION.kredit.fremdkapitalAnteil,
  kreditJahre: INVESTITION.kredit.jahre,
  kalkulationszins: INVESTITION.kalkulationszins,
  ifb: true,
  eag: false,
  strombezugKwh: 500000, // Betrieb mit rund 500 MWh/a – Basis des Strompreis-Richtwerts
  berichtsjahr: 2027,
};

const num = (v) => (v === null || v === undefined || v === "" ? null : Number(String(v).replace(",", ".")));

/** Eingaben aus Objekt oder URL-Parametern lesen und begrenzen (unbekannte Felder fallen weg). */
export function eingabenLesen(roh = {}, { ausUrl = false } = {}) {
  const e = { ...STANDARD_EINGABEN };
  for (const f of URL_FELDER) {
    const wert = ausUrl ? roh[f.k] : roh[f.name];
    if (wert === undefined || wert === null || wert === "") continue;
    if (f.bool) {
      e[f.name] = wert === true || wert === 1 || wert === "1" || wert === "true";
      continue;
    }
    const n = num(wert);
    if (!Number.isFinite(n)) continue;
    // Grenzen gelten in URL-Einheiten (z. B. Prozent); Objektwerte (Anteile) vorher umrechnen
    const inUrlEinheit = !ausUrl && f.faktor ? n / f.faktor : n;
    const begrenzt = Math.min(f.max, Math.max(f.min, inUrlEinheit));
    e[f.name] = f.faktor ? Math.round(begrenzt * f.faktor * 1e6) / 1e6 : begrenzt;
  }
  return e;
}

/** Eingaben als URL-Suchparameter (für Links aus den Gewerbe-Rechnern und „Link teilen“). */
export function eingabenAlsUrl(e, pfad = "/rechner/investitionsantrag") {
  const p = new URLSearchParams();
  for (const f of URL_FELDER) {
    const v = e[f.name];
    if (v === null || v === undefined || v === STANDARD_EINGABEN[f.name]) continue;
    if (f.bool) p.set(f.k, v ? "1" : "0");
    else p.set(f.k, String(Math.round((f.faktor ? v / f.faktor : v) * 100) / 100));
  }
  const s = p.toString();
  return s ? `${pfad}?${s}` : pfad;
}

const alsCashflowEingaben = (e) => ({
  jahre: 25,
  kwp: e.kwp,
  investition: e.investition ?? undefined,
  ertragProKwp: e.ertragProKwp,
  eigenverbrauchsquote: e.eigenverbrauchsquote,
  strompreisCt: e.strompreisCt,
  einspeiseCt: e.einspeiseCt ?? undefined,
  betriebskosten: e.betriebskosten ?? undefined,
  kalkulationszins: e.kalkulationszins,
  ifb: e.ifb,
  eag: e.eag,
  kredit: e.fremdkapitalAnteil > 0 ? { fremdkapitalAnteil: e.fremdkapitalAnteil, zins: e.kreditZins, jahre: e.kreditJahre } : null,
});

/** Unterlagen, die Bank oder Leasinggeber üblicherweise verlangen (wie /service/finanzierung). */
export const UNTERLAGEN_BANK = [
  "Jahresabschlüsse der letzten zwei bis drei Jahre, aktuelle Saldenliste",
  "Firmenbuchauszug und Ansprechpartner der Geschäftsführung",
  "Angebot mit Wirtschaftlichkeitsrechnung (Lastgang, Eigenverbrauch, Erlöse) – dieses Dossier als Beilage",
  "Nachweis über die Dachfläche: Eigentum oder Dachnutzungsvertrag, bei fremdem Grund ggf. Dienstbarkeit",
  "Netzzugangszusage bzw. Stand beim Netzbetreiber",
  "Förderzusage (EAG-Investitionszuschuss, Landesförderung), falls vorhanden",
  "Versicherungsbestätigung (Montage-/Elektronikversicherung) und Wartungsvertrag, falls verlangt",
];

export const NAECHSTE_SCHRITTE = [
  { t: "Lastgang und Anlagengröße bestätigen", x: "Viertelstundenwerte des Netzbetreibers auswerten (Lastgang-Analyse), Eigenverbrauchsquote absichern." },
  { t: "Angebot und Statik", x: "Angebot eines befugten Elektrotechnik-Betriebs, Dachstatik und Schneelast prüfen lassen (Standort-Check, Tragwerksplanung)." },
  { t: "Netzzugang beantragen", x: "Netzzugang beim Netzbetreiber anfragen – Antwortfristen und Netzanschlusskosten einplanen." },
  { t: "Förderung sichern", x: "EAG-Investitionszuschuss im Fördercall VOR Inbetriebnahme beantragen; Landesförderung je nach Programm vor Bestellung." },
  { t: "Finanzierung wählen", x: "Modellvergleich mit echten Angeboten (Bank, Leasinggeber, Contractor) aktualisieren; Steuerberatung zu IFB/AfA einbinden." },
  { t: "Beschluss und Beauftragung", x: "Entscheidungsvorlage beschließen, bei Gemeinden Vergabeverfahren nach BVergG festlegen, Auftrag erteilen." },
];

/** Risiken in Klartext – Zuordnung zu den Sensitivitätsvarianten. */
export const RISIKEN = {
  strompreis: "Strompreisrisiko: Sinkt der vermeidbare Arbeitspreis, sinkt die Ersparnis direkt. Gegenmaßnahme: Eigenverbrauch hoch halten, Einspeisung nicht als Haupterlös planen.",
  eigenverbrauch: "Eigenverbrauchsrisiko: Produktionsverlagerung, Standortschließung oder Effizienzgewinne senken den Eigenverbrauch. Gegenmaßnahme: Lastgang messen, Speicher oder Lastverschiebung prüfen.",
  investition: "Investitionsrisiko: Mehrkosten durch Statik, Netzanschluss, Trafo oder Brandschutz. Gegenmaßnahme: Standort-Check, Netzanfrage und Festpreisangebot vor dem Beschluss.",
  degradation: "Technisches Risiko: Degradation, Verschattung, Ausfälle und Verschmutzung drücken den Ertrag. Gegenmaßnahme: Monitoring, Wartungsvertrag, Leistungsgarantien der Hersteller.",
};

export const QUELLEN = [
  ...PREISQUELLEN.filter((q) => /Marktentwicklung|IEA|Eurostat|OeMAG/.test(q.name)).map((q) => ({ titel: q.name, href: q.url })),
  { titel: "RIS – EStG § 11 und § 124b Z 480 (Investitionsfreibetrag)", href: "https://www.ris.bka.gv.at/GeltendeFassung.wxe?Abfrage=Bundesnormen&Gesetzesnummer=10004570" },
  { titel: "EAG-Abwicklungsstelle – Investitionszuschuss Photovoltaik & Speicher", href: "https://www.eag-abwicklungsstelle.at/wissen/investitionszuschuss-photovoltaik-und-speicher/" },
  { titel: "BVergG 2018 idF Vergaberechtsgesetz 2026 – §§ 13, 43, 46, 47 (Vergabe-Wegweiser)", href: "https://www.jusline.at/gesetz/bvergg_2018/paragraf/46" },
  { titel: "GHG Protocol Scope 2 Guidance; Emissionsfaktor Strommix AT 2024 (BMIMI Marktentwicklung 2024, Kap. 3.2.3)", href: "https://nachhaltigwirtschaften.at/resources/nw_pdf/schriftenreihe-2025-23a_marktstatistik-2024.pdf" },
];

/**
 * Vollständige Dossier-Rechnung.
 * @param {object} eingabenRoh  siehe STANDARD_EINGABEN (bereits gelesen oder roh)
 * @param {object} [o]          { variante }
 */
export function dossierRechnung(eingabenRoh = {}, { variante = "cfo" } = {}) {
  const e = eingabenLesen(eingabenRoh);
  const cashflow = projektCashflow(alsCashflowEingaben(e));
  const sens = sensitivitaet(alsCashflowEingaben(e));
  const modell = rechneModellvergleich({
    kwp: cashflow.eingaben.kwp,
    investition: cashflow.anlagenpreis,
    ertragProKwp: cashflow.eingaben.ertragProKwp,
    eigenverbrauchsquote: cashflow.eingaben.eigenverbrauchsquote,
    strompreisCt: cashflow.eingaben.strompreisCt,
    einspeiseCt: cashflow.eingaben.einspeiseCt,
    betriebskosten: cashflow.eingaben.betriebskosten,
    kalkulationszins: cashflow.eingaben.kalkulationszins,
    ifb: e.ifb,
    eag: e.eag,
    kredit: { eigenkapitalAnteil: 1 - e.fremdkapitalAnteil, zins: e.kreditZins, jahre: e.kreditJahre },
  });

  const vergabe = variante === "gemeinderat" ? { bau: vergabeWege({ auftraggeber: "klassisch", art: "bau", wert: cashflow.anlagenpreis }), lieferDl: vergabeWege({ auftraggeber: "klassisch", art: "lieferDl", wert: cashflow.anlagenpreis }), stand: VERGABE_STAND } : null;

  const co2 = rechneCo2({ strombezugKwh: e.strombezugKwh, pv: { kwp: cashflow.eingaben.kwp, ertragProKwp: cashflow.eingaben.ertragProKwp, eigenverbrauchsquote: cashflow.eingaben.eigenverbrauchsquote } });
  const co2Text = textbaustein(co2, { jahr: String(e.berichtsjahr), firma: "Das Unternehmen" });

  const risiken = sens.zeilen.map((z) => ({ id: z.id, label: z.label, text: RISIKEN[z.id] || "", spanne: z.spanne, niedrig: z.niedrig, hoch: z.hoch }));

  const annahmen = [
    ["Betrachtung", "25 Jahre, netto, vor Ertragsteuern; Jahr 0 = Investition"],
    ["Anlagenpreis netto", `${euro(cashflow.anlagenpreis)} (${e.investition == null ? "Richtwert Marktstatistik 2024 / IEA PVPS 2024" : "Ihre Eingabe"})`],
    ["EAG-Investitionszuschuss", cashflow.zuschuss > 0 ? `${euro(cashflow.zuschuss)} (nur im Fördercall, kein Rechtsanspruch)` : "nicht angesetzt"],
    ["Jahresertrag", `${zahl(cashflow.eingaben.ertragProKwp)} kWh/kWp (Marktstatistik 2024: 1.000 Volllaststunden; IEA PVPS: 1.050)`],
    ["Eigenverbrauchsquote", `${prozent(cashflow.eingaben.eigenverbrauchsquote)} (Ihre Annahme – mit Lastgang absichern)`],
    ["Vermiedener Strompreis", `${zahl(cashflow.eingaben.strompreisCt, 1)} ct/kWh netto, +${prozent(cashflow.eingaben.strompreisSteigerung)} je Jahr (Eurostat-basierter Richtwert)`],
    ["Einspeiseerlös", `${zahl(cashflow.eingaben.einspeiseCt, 1)} ct/kWh (Rechensatz Marktprämie/Direktvermarktung)`],
    ["Betriebskosten", `${euro(cashflow.eingaben.betriebskosten)} je Jahr, +${prozent(cashflow.eingaben.betriebskostenSteigerung)} je Jahr`],
    ["Degradation", `${prozent(cashflow.eingaben.degradation, 2)} je Jahr`],
    ["Kalkulationszins (WACC)", `${prozent(cashflow.eingaben.kalkulationszins, 1)} (Ihre Kapitalkosten, Beispiel)`],
    ["Kredit (Beispiel)", cashflow.kredit ? `${prozent(cashflow.eingaben.kredit.fremdkapitalAnteil)} Fremdkapital, ${prozent(cashflow.eingaben.kredit.zins, 2)}, ${cashflow.eingaben.kredit.jahre} Jahre Annuität` : "ohne Kredit"],
    ["Investitionsfreibetrag", cashflow.ifb.aktiv ? `${prozent(cashflow.ifb.satz)} der Bemessung (Öko-IFB bei Anschaffung bis 31.12.2026, danach 15 %), Steuereffekt ${prozent(cashflow.ifb.koest)} KöSt als Zufluss im Jahr 1 angesetzt – Voraussetzungen mit der Steuerberatung klären` : "nicht angesetzt"],
    ["CO₂-Faktor", `${zahl(CO2.lokFaktorG, 1)} g CO₂e/kWh standortbasiert (Strommix AT 2024), Berichtsjahr ${e.berichtsjahr}`],
  ];

  const kennzahlen = [
    { label: "Kapitalwert (25 J.)", wert: euro(cashflow.kapitalwert), hinweis: `Kalkulationszins ${prozent(cashflow.eingaben.kalkulationszins, 1)}` },
    { label: "Interner Zinsfuß", wert: cashflow.irr == null ? "–" : prozent(cashflow.irr, 1), hinweis: "vor Steuern" },
    { label: "Amortisation", wert: cashflow.amortisation == null ? "> 25 J." : cashflow.amortisation === 0 ? "ab Jahr 1" : `${zahl(cashflow.amortisation, 1)} J.`, hinweis: "ab dann kumuliert im Plus" },
    { label: "Nutzen im Jahr 1", wert: euro(cashflow.jahr1.cfads), hinweis: "Ersparnis + Erlös − Betrieb" },
    { label: "Investition netto", wert: euro(cashflow.investition), hinweis: cashflow.zuschuss > 0 ? (e.investition == null ? "Richtwert, nach EAG-Zuschuss" : "Ihre Eingabe, nach EAG-Zuschuss") : e.investition == null ? "Richtwert" : "Ihre Eingabe" },
    { label: "DSCR min.", wert: cashflow.kredit?.dscr?.min == null ? "–" : zahl(cashflow.kredit.dscr.min, 2), hinweis: cashflow.kredit ? `${cashflow.kredit.jahre} Jahre Kredit` : "ohne Kredit" },
  ];

  return { stand: DOSSIER_STAND, variante, eingaben: e, cashflow, sens, modell, vergabe, co2, co2Text, risiken, annahmen, kennzahlen, unterlagen: UNTERLAGEN_BANK, schritte: NAECHSTE_SCHRITTE, quellen: QUELLEN };
}

/** Beispielwerte für die Vorschau VOR dem Lead-Gate (klar als Beispiel gekennzeichnet). */
export function beispielRechnung(variante = "cfo") {
  return { ...dossierRechnung({ kwp: 250, eigenverbrauchsquote: 0.7 }, { variante }), beispiel: true };
}

export const HAFTUNG = "Richtwerte zur Orientierung, keine Steuer-, Rechts- oder Finanzberatung. Maßgeblich sind Angebot, Vertrag, Förderrichtlinien und die Einschätzung Ihrer Steuerberatung und Ihres Finanzierungspartners.";
