// src/lib/kommunen/vergabe.js
//
// Vergabe-Wegweiser für Gemeinden (Unterschwellenbereich nach BVergG 2018 idF
// Vergaberechtsgesetz 2026, BGBl. I Nr. 8/2026 – großteils in Kraft seit 01.03.2026).
// Reine Funktionen ohne React – genutzt von /kommunen/vergabe-foerderung, mit node testbar
// (scripts/kommunen-vergabe.test.mjs).
//
// Quellen (geprüft am 30.09.2026; RIS war an diesem Tag nicht erreichbar – HTTP 503 –,
// Gesetzestext daher über die RIS-Spiegelung von JUSLINE):
//  - § 46 Abs. 2, 4, 5 BVergG 2018 (in Kraft seit 01.03.2026): Direktvergabe Bau < 200.000 €,
//    Liefer/DL < Betrag nach § 12 Abs. 1 Z 1; ab 50.000 € um drei Angebote/Preisauskünfte bemühen;
//    Dokumentation. https://www.jusline.at/gesetz/bvergg_2018/paragraf/46
//  - § 47 Abs. 2 BVergG 2018: Direktvergabe mit vorheriger Bekanntmachung Bau < 2.000.000 €,
//    Liefer/DL < Betrag nach § 12 Abs. 1 Z 1. https://www.jusline.at/gesetz/bvergg_2018/paragraf/47
//  - § 43 BVergG 2018: nicht offenes Verfahren ohne Bekanntmachung nur Bau < 2.000.000 €.
//  - § 44 Abs. 2 BVergG 2018: Verhandlungsverfahren ohne Bekanntmachung im USB nur bei besonders
//    günstiger Gelegenheit (Waren/Dienstleistungen).
//  - § 13 Abs. 1, 3, 5 BVergG 2018: geschätzter Auftragswert = Gesamtwert ohne USt, sachkundig
//    ermitteln, keine Umgehung durch Berechnungsmethode oder Unterteilung.
//  - Bundeskammer der ZiviltechnikerInnen, Übersicht Schwellenwerte und Vergabeverfahren, Stand 01.03.2026
//  - WKO, Vergaberecht 2026 im Überblick (Sektorenwerte); WKO, EU-Schwellenwerte ab 1.1.2026
//    (Bau 5.404.000 €, Liefer/DL zentral 140.000 €, subzentral 216.000 €, Sektoren 432.000 €;
//    gültig bis 31.12.2027).
//
// Orientierung, keine Rechtsberatung. Die Wahl des Verfahrens verantwortet der Auftraggeber.

import { zahlText } from "../../data/kennzahlen.js";

export const VERGABE_STAND = { iso: "2026-09-30", label: "30.09.2026" };

/** Ab diesem geschätzten Auftragswert: um mind. drei Angebote/Preisauskünfte bemühen (§ 46 Abs. 4). */
export const DREI_ANGEBOTE_AB = 50_000;

/**
 * Schwellenwerte (netto, „unter“ = der Wert darf nicht erreicht werden).
 * null = Verfahren für diese Kombination nicht vorgesehen.
 */
export const SCHWELLEN = {
  klassisch: {
    bau: { direkt: 200_000, direktBekanntmachung: 2_000_000, nichtOffenOhne: 2_000_000, eu: 5_404_000 },
    lieferDl: { direkt: 140_000, direktBekanntmachung: 140_000, nichtOffenOhne: null, eu: 216_000 },
  },
  sektoren: {
    bau: { direkt: 200_000, direktBekanntmachung: 2_000_000, nichtOffenOhne: 2_000_000, eu: 5_404_000 },
    lieferDl: { direkt: 150_000, direktBekanntmachung: 200_000, nichtOffenOhne: null, eu: 432_000 },
  },
};

export const AUFTRAGGEBER = [
  { id: "klassisch", label: "Gemeinde, Verband, Land", kurz: "öffentlicher Auftraggeber" },
  { id: "sektoren", label: "Stadtwerk als Sektorenauftraggeber", kurz: "Sektorenauftraggeber" },
];

export const ARTEN = [
  { id: "bau", label: "Bauauftrag", kurz: "Bau" },
  { id: "lieferDl", label: "Liefer- oder Dienstleistungsauftrag", kurz: "Lieferung/Dienstleistung" },
];

/** „12.345 €“ mit Tausenderpunkt (hydrationssicher, ohne Intl). */
export function euro(n) {
  const x = Math.round(Number(n));
  if (!Number.isFinite(x)) return "–";
  return `${zahlText(x)} €`;
}

/**
 * Liest eine Eingabe wie „180.000“, „180000“, „180 000 €“ oder „1,2 Mio“ als Euro-Betrag.
 * Gibt null zurück, wenn nichts Brauchbares erkannt wird.
 */
export function betragLesen(eingabe) {
  if (typeof eingabe === "number") return Number.isFinite(eingabe) && eingabe >= 0 ? eingabe : null;
  if (typeof eingabe !== "string") return null;
  let s = eingabe.trim().toLowerCase().replace(/€|eur(o)?/g, "").trim();
  if (!s) return null;
  let faktor = 1;
  if (/(mio\.?|millionen?)$/.test(s)) {
    faktor = 1_000_000;
    s = s.replace(/(mio\.?|millionen?)$/, "").trim();
  }
  s = s.replace(/[\s ']/g, "");
  if (faktor > 1) {
    // „1,2“ bzw. „1.2“ Mio.
    s = s.replace(",", ".");
  } else if (/^\d{1,3}(\.\d{3})+(,\d+)?$/.test(s)) {
    s = s.replace(/\./g, "").replace(",", ".");
  } else {
    s = s.replace(",", ".");
  }
  if (!/^\d+(\.\d+)?$/.test(s)) return null;
  const n = Number(s) * faktor;
  return Number.isFinite(n) && n >= 0 ? Math.round(n) : null;
}

/**
 * Welche Verfahren kommen bei einem geschätzten Auftragswert in Frage?
 * @param {{ auftraggeber?: "klassisch"|"sektoren", art?: "bau"|"lieferDl", wert: number }} p
 * @returns {null | { bereich: "unterschwelle"|"oberschwelle", schwellen, wege: Array, pflichten: string[], kurz: string }}
 */
export function vergabeWege({ auftraggeber = "klassisch", art = "bau", wert } = {}) {
  const s = SCHWELLEN[auftraggeber]?.[art];
  const w = Number(wert);
  if (!s || !Number.isFinite(w) || w < 0) return null;

  const unter = (grenze) => grenze != null && w < grenze;
  const ober = w >= s.eu;
  const bau = art === "bau";

  const wege = [
    {
      id: "direkt",
      name: "Direktvergabe",
      grenze: s.direkt,
      zulaessig: unter(s.direkt),
      norm: auftraggeber === "sektoren" ? "Sektorenbestimmungen BVergG" : "§ 46 BVergG",
      text: "Formfrei an ein geeignetes Unternehmen – mit Dokumentation von Gegenstand, Wert, Auftragnehmer und Preisangemessenheit.",
    },
    {
      id: "direktBekanntmachung",
      name: "Direktvergabe mit vorheriger Bekanntmachung",
      grenze: s.direktBekanntmachung,
      zulaessig: unter(s.direktBekanntmachung),
      norm: auftraggeber === "sektoren" ? "Sektorenbestimmungen BVergG" : "§ 47 BVergG",
      text:
        s.direktBekanntmachung === s.direkt
          ? "Für diese Auftragsart gleiche Grenze wie die Direktvergabe – keine Erweiterung."
          : "Beabsichtigte Vergabe bekannt machen, dann mit geeigneten Unternehmen verhandeln; Ergebnis dokumentieren.",
    },
    {
      id: "nichtOffenOhne",
      name: "Nicht offenes Verfahren ohne Bekanntmachung",
      grenze: s.nichtOffenOhne,
      zulaessig: unter(s.nichtOffenOhne),
      norm: auftraggeber === "sektoren" ? "Sektorenbestimmungen BVergG" : "§ 43 BVergG",
      text: bau
        ? "Nur Bauaufträge: ausgewählte geeignete Unternehmen zur Angebotsabgabe einladen, wenn genug bekannt sind, um Wettbewerb sicherzustellen."
        : "Für Liefer- und Dienstleistungsaufträge seit dem Vergaberechtsgesetz 2026 nicht mehr vorgesehen.",
    },
    {
      id: "mitBekanntmachung",
      name: ober ? "Verfahren mit EU-weiter Bekanntmachung" : "Offenes/nicht offenes Verfahren oder Verhandlungsverfahren mit Bekanntmachung (österreichweit)",
      grenze: null,
      zulaessig: true,
      norm: ober ? "Oberschwellenbereich" : "Unterschwellenbereich",
      text: ober
        ? `Ab ${euro(s.eu)} gilt der Oberschwellenbereich: EU-weite Bekanntmachung, strengere Fristen und Verfahrensregeln.`
        : `Immer möglich – bis unter ${euro(s.eu)} mit österreichweiter Bekanntmachung.`,
    },
  ];

  // Sektoren, Liefer/DL: keine eigene Wertgrenze für das nicht offene Verfahren ohne Bekanntmachung ausgewiesen → Zeile weglassen.
  const sichtbar = wege.filter((x) => !(auftraggeber === "sektoren" && x.id === "nichtOffenOhne" && x.grenze == null));
  const klassisch = auftraggeber === "klassisch";

  const pflichten = [];
  if (w > DREI_ANGEBOTE_AB && unter(s.direkt)) {
    pflichten.push(`Über ${euro(DREI_ANGEBOTE_AB)}: um mindestens drei Angebote oder unverbindliche Preisauskünfte bemühen, sofern keine sachlichen Gründe entgegenstehen${klassisch ? " (§ 46 Abs. 4)" : ""}.`);
  }
  if (unter(s.direkt)) {
    pflichten.push(`Eingeholte Angebote, Gegenstand und Wert, Auftragnehmer und – wenn wirtschaftlich vertretbar – die Preisangemessenheit dokumentieren${klassisch ? " (§ 46 Abs. 5)" : ""}.`);
  }
  pflichten.push("Auftragswert vorab sachkundig schätzen: Gesamtwert ohne Umsatzsteuer inkl. Optionen; nicht so unterteilen, dass Vorschriften umgangen werden (§ 13).");
  if (ober) pflichten.push("Oberschwellenbereich: EU-weite Bekanntmachung, Stillhaltefrist und Rechtsschutz nach den Oberschwellenregeln einplanen.");

  const einfachster = sichtbar.find((x) => x.zulaessig);
  const kurz = ober
    ? `EU-weites Verfahren – der Auftragswert erreicht die EU-Schwelle von ${euro(s.eu)}.`
    : einfachster.id === "direkt"
      ? `Direktvergabe möglich – der Auftragswert liegt unter ${euro(s.direkt)}.`
      : einfachster.id === "mitBekanntmachung"
        ? "Verfahren mit österreichweiter Bekanntmachung nötig."
        : `${einfachster.name} möglich – der Auftragswert liegt unter ${euro(einfachster.grenze)}.`;

  return { bereich: ober ? "oberschwelle" : "unterschwelle", schwellen: s, wege: sichtbar, pflichten, kurz };
}
